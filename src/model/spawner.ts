import type { EnvId } from '../data/env';
import type { Biome, EntityId, Pair, SpawnerConfig } from '../types';

export function spawner(config: {
  tier: number;
  biomes: Biome[];
  biomeAreas?: number;
  maxSpawned: number;
  interval: number;
  chance: number;
  distance?: number;
  radius?: Pair<number>;
  killed?: EntityId;
  envs?: EnvId[];
  groupSize?: Pair<number>;
  groupRadius?: number;
  night?: boolean;
  altitude?: Pair<number>;
  tilt?: Pair<number>;
  forest?: boolean;
  offset?: number;
  levels?: Pair<number>;
  minDistance?: number;
}): SpawnerConfig {
  return {
    biomeAreas: 7,
    distance: 10,
    radius: [40, 80],
    killed: undefined,
    envs: [],
    groupSize: [1, 1],
    groupRadius: 3,
    night: undefined,
    altitude: [0, 1000],
    tilt: [0, 35],
    forest: undefined,
    offset: 0.5,
    levels: [1, 3],
    minDistance: 0,
    ...config,
  };
}
