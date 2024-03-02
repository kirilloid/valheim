import type { EntityId, Pair } from "./base";

export interface DropEntry {
  item: EntityId;
  chance: number;
  min: number;
  max: number;
  scale: boolean;
  perPlayer: boolean;
}

export interface GeneralDrop {
  offByOneBug?: boolean;
  chance?: number;
  oneOfEach?: boolean;
  num: Pair<number>;
  options: { item: EntityId, num?: Pair<number>, weight?: number }[];
}

export type SimpleDrop = Record<EntityId, number>;
