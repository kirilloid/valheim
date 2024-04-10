import type { Spawner } from '../types';

export const spawners: Spawner[] = [
  {
    type: 'spawner',
    tier: 4,
    id: 'Spawner_Ulv',
    spawn: 'Ulv',
    levels: [1, 1],
    levelUpChance: 0.1,
  },
  {
    type: 'spawner',
    tier: 4,
    id: 'Spawner_Bat',
    spawn: 'Bat',
    levels: [1, 1],
    levelUpChance: 0.1,
  },
  {
    type: 'spawner',
    tier: 4,
    id: 'Spawner_StoneGolem',
    spawn: 'StoneGolem',
    levels: [1, 1],
    levelUpChance: 0.1,
  },
  {
    type: 'spawner',
    tier: 6,
    id: 'Spawner_Seeker',
    spawn: 'Seeker',
    levels: [1, 3],
    levelUpChance: 0.1,
  },
  {
    type: 'spawner',
    tier: 6,
    id: 'Spawner_SeekerBrute',
    spawn: 'SeekerBrute',
    levels: [1, 3],
    levelUpChance: 0.1,
  },
  {
    type: 'spawner',
    tier: 6,
    id: 'Spawner_Tick',
    spawn: 'Tick',
    levels: [1, 3],
    levelUpChance: 0.1,
  },
  {
    type: 'spawner',
    tier: 6,
    id: 'Spawner_Tick_stared',
    spawn: 'Tick',
    levels: [1, 3],
    levelUpChance: 0.2,
  },
  {
    type: 'spawner',
    tier: 6,
    id: 'Spawner_DvergerMage',
    spawn: 'DvergerMage',
    levels: [1, 3],
    levelUpChance: 0.1,
  },
  {
    type: 'spawner',
    tier: 6,
    id: 'Spawner_BlobTar_respawn_30',
    spawn: 'BlobTar',
    levels: [1, 1],
    levelUpChance: 0.15,
    respawnMinutes: 60,
  },
  {
    type: 'spawner',
    tier: 6,
    id: 'Spawner_DvergerArbalest',
    spawn: 'Dverger',
    levels: [1, 3],
    levelUpChance: 0.1,
  },
  {
    type: 'spawner',
    tier: 2,
    id: 'Spawner_Skeleton_hildir',
    spawn: 'Skeleton_Hildir_nochest',
    levels: [1, 1],
    levelUpChance: 0.1,
  },
];

for (const spawner of spawners) {
  spawner.iconId = `creature/${spawner.spawn}`;
}