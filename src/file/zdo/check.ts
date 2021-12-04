import type { ZDO, ZDOCorruption } from '../types';
import type { WorldData } from '../World';
import { Mistake, MistakeLevel } from '../types';
import { offsets } from './offset';

export const MistakeLevels: Record<Mistake, MistakeLevel> = {
  [Mistake.None]: MistakeLevel.OK,
  [Mistake.CoordinatesTooFar]: MistakeLevel.NOTICE,
  [Mistake.CoordinatesInconsistent]: MistakeLevel.WARNING,
  [Mistake.TimeInFuture]: MistakeLevel.WARNING,
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

export function check(world: WorldData, zdo: ZDO): ZDOCorruption {
  try {
    // force-read last arrays, this might through exception
    const bytes = zdo.byteArrays.get(0);
    if (bytes != null && bytes.length < 0) {
      return { mistake: Mistake.ImpossibleError, offset: zdo.offset };
    };
    const string = zdo.strings.get(0);
    if (string != null && string.length < 0) {
      return { mistake: Mistake.ImpossibleError, offset: zdo.offset };
    }

    if (zdo.timeCreated > world.netTime) {
      return {
        mistake: Mistake.TimeInFuture,
        offset: zdo.offset + offsets.timeCreated + HEADER_SIZE,
      };
    }

    const { sector, position } = zdo;
    if (sector.x !== Math.round(position.x / 64)
    ||  sector.y !== Math.round(position.z / 64)) {
      return {
        mistake: Mistake.CoordinatesInconsistent,
        offset: zdo.offset + offsets.sector + HEADER_SIZE,
      };
    }

    if (Math.abs(position.x) > 11000
    ||  Math.abs(position.z) > 11000
    ||  position.y < -100 || position.y > 4100) {
      return {
        mistake: Mistake.CoordinatesTooFar,
        offset: zdo.offset + offsets.position + HEADER_SIZE,
      }
    }
    return { mistake: Mistake.None, offset: 0 };
  } catch (e) {
    const mistake = errorToMistake(e);
    const { offset } = zdo;
    return { mistake, offset };
  }
}
