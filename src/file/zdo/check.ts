import type { ZDO, ZDOCorruption } from '../types';
import type { WorldData } from '../World';
import { Mistake, MistakeLevel } from '../types';
import { offsets } from './offset';
import { data, extraData } from '../../data/itemDB';
import { stableHashCode } from '../../model/hash';
import { prefabHashes } from '../../data/zdo';
import { GameComponent } from '../../types';

export const MistakeLevels: Record<Mistake, MistakeLevel> = {
  [Mistake.None]: MistakeLevel.OK,
  [Mistake.CoordinatesTooFar]: MistakeLevel.NOTICE,
  [Mistake.CoordinatesInconsistent]: MistakeLevel.WARNING,
  [Mistake.DropExplosion]: MistakeLevel.ERROR,
  [Mistake.TimeInFuture]: MistakeLevel.WARNING,
  [Mistake.ContainerStuck]: MistakeLevel.WARNING,
  [Mistake.UnreadData]: MistakeLevel.WARNING,
  [Mistake.GenericException]: MistakeLevel.ERROR,
  [Mistake.RangeException]: MistakeLevel.ERROR,
  [Mistake.UTFException]: MistakeLevel.ERROR,
  [Mistake.ImpossibleError]: MistakeLevel.NOTICE,
};

export function errorToMistake(e: unknown): Mistake {
  if (e instanceof Error) {
    if (e.message.includes('UTF')) {
      return Mistake.UTFException;
    } else if (e.message.includes('Offset')) {
      return Mistake.RangeException;
    } else {
      return Mistake.GenericException;
    }
  } else {
    return Mistake.GenericException;
  }
}

type CorruptionType = Omit<ZDOCorruption, 'index'>;

const HEADER_SIZE = 16; // ZDOID: long (8), int (4) & byte array length: int (4)
const IN_USE = stableHashCode('InUse');

const componentChecks: Partial<Record<GameComponent, (zdo: ZDO) => CorruptionType | undefined>> = {
  Container(zdo: ZDO) {
    if (zdo.ints.get(IN_USE)) {
      return {
        mistake: Mistake.ContainerStuck,
        offset: zdo._offset + ((zdo as any).offsetStrings ?? 80) + HEADER_SIZE,
      }
    }
  },
  Ragdoll(zdo: ZDO) {
    const length = zdo.ints.get(stableHashCode('drops')) ?? 0;   
    for (let i = 0; i < length; i++) {
      const num = zdo.ints.get(stableHashCode(`drop_amount${i}`));
      if (num != null && num > 10000) {
        return {
          mistake: Mistake.DropExplosion,
          offset: zdo._offset + ((zdo as any).offsetInts ?? 80) + HEADER_SIZE + 13 + i * 16,
        }
      }
    }
  },
}

export function check(world: WorldData, zdo: ZDO): CorruptionType {
  try {
    // force-read last map, this might throw an exception
    const bytes = zdo.byteArrays.get(0);
    if (bytes != null && bytes.length < 0) {
      return { mistake: Mistake.ImpossibleError, offset: zdo._offset };
    };
    const string = zdo.strings.get(0);
    if (string != null && string.length < 0) {
      return { mistake: Mistake.ImpossibleError, offset: zdo._offset };
    }

    const id = prefabHashes.get(zdo.prefab);
    if (id != null) {
      const obj = data[id];
      const components = (obj == null ? extraData[id] : obj.components) ?? [];
      for (const cmp of components) {
        const checkResult = componentChecks[cmp]?.(zdo);
        if (checkResult != null) return checkResult;
      }
    }

    if (Number(zdo.timeCreated) / 1e7 > world.netTime) {
      return {
        mistake: Mistake.TimeInFuture,
        offset: zdo._offset + offsets.timeCreated + HEADER_SIZE,
      };
    }

    const { sector, position } = zdo;
    if (sector.x !== Math.round(position.x / 64)
    ||  sector.y !== Math.round(position.z / 64)) {
      return {
        mistake: Mistake.CoordinatesInconsistent,
        offset: zdo._offset + offsets.sector + HEADER_SIZE,
      };
    }

    if (position.x * position.x + position.z * position.z > 11000 * 11000
    ||  position.y < -100
    || (position.y > 1000
    && Math.abs(position.y - 5000) > 100)) {
      return {
        mistake: Mistake.CoordinatesTooFar,
        offset: zdo._offset + offsets.position + HEADER_SIZE,
      }
    }
    return { mistake: Mistake.None, offset: 0 };
  } catch (e) {
    const mistake = errorToMistake(e);
    const { _offset: offset } = zdo;
    return { mistake, offset };
  }
}
