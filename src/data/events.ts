import type { GameEvent } from '../types';

export const events: GameEvent[] = [
  {
    id: 'army_eikthyr',
    tier: 1,
    icon: 'Eikthyr',
    biomes: ['Meadows', 'BlackForest'],
    killed: [],
    notKilled: ['Eikthyr'],
    duration: 90,
    spawns: [
      {
        id: 'Neck',
        max: 2,
        interval: 20,
      },
      {
        id: 'Boar',
        max: 2,
        interval: 20,
      }
    ],
    base: true,
  },
  {
    id: 'army_theelder',
    tier: 2,
    icon: 'gd_king',
    biomes: ['Meadows', 'BlackForest', 'Swamp', 'Plains'],
    killed: ['Eikthyr'],
    notKilled: ['gd_king'],
    duration: 120,
    spawns: [
      {
        id: 'Greydwarf',
        max: 6,
        interval: 5,
      },
      {
        id: 'Greydwarf_Shaman',
        max: 1,
        interval: 5,
      },
      {
        id: 'Greydwarf_Elite',
        max: 1,
        interval: 5,
      },
    ],
    base: true,
  },
  {
    id: 'foresttrolls',
    tier: 2,
    icon: 'Troll',
    biomes: ['Meadows', 'BlackForest', 'Swamp', 'Plains'],
    killed: ['gd_king', 'Troll'],
    notKilled: [],
    duration: 80,
    spawns: [
      {
        id: 'Troll',
        max: 2,
        interval: 20,
      }
    ],
    base: true,
  },
  {
    id: 'army_bonemass',
    tier: 3,
    icon: 'Bonemass',
    biomes: ['Meadows', 'BlackForest', 'Swamp', 'Mountain', 'Plains'],
    killed: ['gd_king'],
    notKilled: ['Bonemass'],
    duration: 150,
    spawns: [
      {
        id: 'Draugr',
        max: 3,
        interval: 5,
      },
      {
        id: 'Skeleton',
        max: 3,
        interval: 5,
      },
    ],
    base: true,
  },
  {
    id: 'skeletons',
    tier: 4,
    icon: 'Skeleton',
    biomes: ['Meadows', 'BlackForest', 'Swamp', 'Plains', 'Mistlands'],
    killed: ['Bonemass'],
    notKilled: [],
    duration: 120,
    spawns: [
      {
        id: 'Skeleton',
        max: 20,
        group: [4, 6],
        interval: 10,
      },
      {
        id: 'Skeleton_Poison',
        max: 1,
        interval: 15,
        chance: 0.54,
      },
    ],
    base: true,
  },
  {
    id: 'surtlings',
    tier: 4,
    icon: 'Surtling',
    biomes: ['Meadows', 'BlackForest', 'Swamp', 'Plains'],
    killed: ['Bonemass', 'Surtling'],
    notKilled: [],
    duration: 120,
    spawns: [
      {
        id: 'Surtling',
        max: 4,
        interval: 2,
      }
    ],
    base: true,
  },
  {
    id: 'blobs',
    tier: 4,
    icon: 'Blob',
    biomes: ['Meadows', 'BlackForest', 'Swamp', 'Plains'],
    killed: ['Bonemass'],
    notKilled: [],
    duration: 120,
    spawns: [
      {
        id: 'Blob',
        max: 5,
        interval: 2,
      },
      {
        id: 'BlobElite',
        max: 2,
        interval: 2,
      }
    ],
    base: true,
  },
  {
    id: 'army_moder',
    tier: 4,
    icon: 'Dragon',
    biomes: ['Meadows', 'BlackForest', 'Swamp', 'Mountain', 'Plains'],
    killed: ['Bonemass'],
    notKilled: ['Dragon'],
    duration: 150,
    spawns: [
      {
        id: 'Hatchling',
        max: 3,
        interval: 10,
      }
    ],
    base: true,
  },
  {
    id: 'wolves',
    tier: 4,
    icon: 'Wolf',
    biomes: ['Mountain', 'Plains'],
    killed: ['Bonemass'],
    notKilled: [],
    duration: 120,
    spawns: [
      {
        id: 'Wolf',
        max: 6,
        interval: 2,
      }
    ],
    base: false,
  },
  {
    id: 'army_goblin',
    tier: 5,
    icon: 'GoblinKing',
    biomes: ['Meadows', 'BlackForest', 'Plains'],
    killed: ['Dragon'],
    notKilled: ['GoblinKing'],
    duration: 120,
    spawns: [
      {
        id: 'Goblin',
        max: 8,
        group: [1, 4],
        interval: 10,
        chance: 0.582,
      },
      {
        id: 'GoblinBrute',
        max: 2,
        interval: 20,
        chance: 0.47,
      },
      {
        id: 'GoblinShaman',
        max: 1,
        interval: 20,
        chance: 0.47,
      },
    ],
    base: true,
  },
  {
    id: 'bats',
    tier: 4,
    icon: 'Bat',
    biomes: ['Meadows', 'BlackForest', 'Swamp', 'Mountain', 'Plains'],
    killed: ['Bonemass', 'Bat'],
    notKilled: [],
    duration: 120,
    spawns: [
      {
        id: 'Bat',
        max: 10,
        group: [2, 4],
        interval: 10,
        chance: 1,
      },
    ],
    base: true,
  },
  {
    id: 'army_gjall',
    tier: 6,
    icon: 'Gjall',
    biomes: ['Mistlands'],
    killed: ['GoblinKing'],
    notKilled: ['SeekerQueen'],
    duration: 90,
    spawns: [
      {
        id: 'Gjall',
        max: 1,
        interval: 40,
        chance: 1,
      },
      {
        id: 'Tick',
        max: 4,
        interval: 20,
        chance: 1,
      },
    ],
    base: true,
  },
  {
    id: 'army_seekers',
    tier: 6,
    icon: 'Seeker',
    biomes: ['BlackForest', 'Mountain', 'Plains', 'Ocean', 'Mistlands'],
    killed: ['GoblinKing'],
    notKilled: ['SeekerQueen'],
    duration: 120,
    spawns: [
      {
        id: 'Seeker',
        max: 3,
        group: [1, 1],
        interval: 35,
        chance: 1,
      },
      {
        id: 'SeekerBrood',
        max: 8,
        group: [1, 1],
        interval: 20,
        chance: 1,
      },
      {
        id: 'SeekerBrute',
        max: 1,
        group: [1, 1],
        interval: 100,
        chance: 1,
      },
    ],
    base: true,
  },
];
