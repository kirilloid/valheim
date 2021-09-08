import type { GameEvent } from '../types';

export const events: GameEvent[] = [
  {
    id: 'army_eikthyr',
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
        id: 'GreydwarfShaman',
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
];