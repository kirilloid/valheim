import type { EntityId, GeneralDrop } from '../types';

export const singleDrop = (item: EntityId, min: number = 1, max: number = 1): GeneralDrop => ({
  num: [min, max],
  options: [{ item }]
});
