import type { ZDO, ZDOCorruption } from '../types';
import type { WorldData } from '../World';
import { Mistake, MistakeLevel } from '../types';
import { offsets } from './offset';
import { stableHashCode } from '../../model/hash';

export const MistakeLevels: Record<Mistake, MistakeLevel> = {
  [Mistake.None]: MistakeLevel.OK,
  [Mistake.CoordinatesTooFar]: MistakeLevel.NOTICE,
  [Mistake.CoordinatesInconsistent]: MistakeLevel.WARNING,
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

const HEADER_SIZE = 16; // ZDOID: long (8), int (4) & byte array length: int (4)

export function check(world: WorldData, zdo: ZDO): Omit<ZDOCorruption, 'index'> {
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

    if (zdo.ints.get(stableHashCode('InUse'))) {
      return {
        mistake: Mistake.ContainerStuck,
        offset: zdo._offset + ((zdo as any).offsetStrings ?? 80) + HEADER_SIZE,
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
