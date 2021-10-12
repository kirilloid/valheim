import type { LocationItem } from '../types';

import { locItem } from '../model/game';
import { Distribution } from '../model/dist';

export type DungeonRoomsConfig = {
  type: 'dungeon';
  rooms: RoomConfig[];
};

type CampConfig = {
  type: 'camp';
  inner: CamplaceConfig[];
  perimeter: CamplaceConfig[];
};

type RoomConfig = {
  id: string;
  type: 'start' | 'middle' | 'end';
  size: [number, number, number];
  minPlaceOrder?: number;
  weight: number;
  connections: number;
  items: LocationItem[];
  dist: Distribution;
};

type CamplaceConfig = {
  id: string;
  size: [number, number, number];
  weight: number;
  items: LocationItem[];
  dist: Distribution;
};

export const gobvill: CampConfig = {
  type: 'camp',
  perimeter: [
    {
      id: 'guardtower',
      size: [7, 8, 7],
      weight: 1,
      items: [
        locItem('GoblinArcher', 1, 2),
        locItem('Goblin', 0.5),
      ],
      dist: [],
    },
    {
      id: 'woodwall',
      size: [10, 8, 2],
      weight: 1,
      items: [], // 5x fence
      dist: [],
    },
    {
      id: 'woodwall2',
      size: [10, 8, 2],
      weight: 1,
      items: [], // 5x fence
      dist: [],
    },
    {
      id: 'guardplatform',
      size: [5, 8, 8],
      weight: 1,
      items: [
        locItem('GoblinArcher', 1),
        locItem('Goblin', 0.5),
      ],
      dist: [],
    },
    {
      id: 'stakes',
      size: [10, 8, 3],
      weight: 1,
      items: [
        locItem('GoblinArcher', 0.5),
        locItem('Goblin', 0.5),
        locItem('piece_sharpstakes', 1, 3),
      ],
      dist: [],
    },
    {
      id: 'platform',
      size: [6, 8, 9],
      weight: 1,
      items: [
        locItem('GoblinArcher', 1, 2),
        locItem('Goblin', 0.5),
      ],
      dist: [],
    },
  ],
  inner: [
    {
      id: 'barley',
      size: [10, 8, 7],
      weight: 1,
      items: [
        locItem('Goblin', 0.5),
        locItem('Barley', 1, 12),
      ],
      dist: [],
    },
    {
      id: 'flax',
      size: [10, 8, 7],
      weight: 1,
      items: [
        locItem('Goblin', 0.5, 2),
        locItem('Flax', 1, 11),
      ],
      dist: [],
    },
    {
      id: 'crafting',
      size: [5, 8, 5],
      weight: 1,
      items: [
        locItem('Goblin', 0.5, 2),
        locItem('piece_workbench_ext2', 1, 2),
        locItem('TreasureChest_heath'),
      ],
      dist: [],
    },
    {
      id: 'bonfire',
      size: [8, 8, 8],
      weight: 1,
      items: [
        locItem('bonfire'),
        locItem('Goblin', 0.5, 3),
        locItem('GoblinBrute', 0.5),
        locItem('GoblinShaman', 0.5),
        locItem('GoblinTotem', 0.5),
      ],
      dist: [],
    },
    {
      id: 'campfire',
      size: [6, 8, 6],
      weight: 1,
      items: [
        locItem('fire_pit'),
        locItem('wood_wall_log', 0.5, 6),
        locItem('Goblin', 0.5, 3),
        locItem('GoblinBrute', 0.5),
        locItem('GoblinShaman', 0.5),
      ],
      dist: [],
    },
    {
      id: 'refusepit',
      size: [5, 8, 4],
      weight: 0.5,
      items: [
        locItem('fire_pit'),
        locItem('BlackMetalScrap', 0.2),
        locItem('Dandelion', 0.5, 4),
        locItem('BoneFragments', 0.5, 4),
        locItem('Goblin', 0.5, 2),
      ],
      dist: [],
    },
    {
      id: 'tent1',
      size: [12, 8, 12],
      weight: 1,
      items: [
        locItem('fire_pit', 0.5),
        locItem('wood_wall_log', 0.5, 2),
        locItem('TreasureChest_heath', 0.3),
        locItem('Goblin', 0.5, 3),
        locItem('GoblinShaman', 0.5),
      ],
      dist: [],
    },
    {
      id: 'tent2',
      size: [12, 8, 12],
      weight: 1,
      items: [
        locItem('fire_pit', 0.5),
        locItem('wood_wall_log', 0.5, 2),
        locItem('TreasureChest_heath', 0.2),
        locItem('Goblin', 0.5, 3),
      ],
      dist: [],
    },
    {
      id: 'hut1',
      size: [8, 8, 10],
      weight: 1,
      items: [
        locItem('fire_pit', 0.5),
        locItem('wood_wall_log', 0.5, 2),
        locItem('Goblin', 0.5, 3),
      ],
      dist: [],
    },
    {
      id: 'hut02',
      size: [10, 8, 12],
      weight: 1,
      items: [
        locItem('fire_pit', 0.5),
        locItem('wood_wall_log', 0.5, 2),
        locItem('TreasureChest_heath', 0.3),
        locItem('Goblin', 0.5, 3),
        locItem('GoblinBrute', 0.1),
        locItem('GoblinShaman', 0.5),
      ],
      dist: [],
    },
    {
      id: 'hut03',
      size: [10, 8, 16],
      weight: 1,
      items: [
        locItem('fire_pit', 0.5),
        locItem('wood_wall_log', 0.5, 2),
        locItem('TreasureChest_heath', 0.3),
        locItem('BlackMetalScrap', 0.2),
        locItem('Dandelion', 0.5, 4),
        locItem('Goblin', 0.5, 5),
        locItem('GoblinArcher'),
        locItem('GoblinBrute', 0.1),
        locItem('GoblinShaman', 0.5),
      ],
      dist: [],
    },
  ],
};

export const woodfarm: CampConfig = {
  type: 'camp',
  perimeter: [
    {
      id: 'outhouse',
      size: [10, 8, 10],
      weight: 0.5,
      items: [
        locItem('Mushroom', 0.33, 4),
      ],
      dist: [],
    },
    {
      id: 'tower',
      size: [13, 8, 13],
      weight: 10,
      items: [
        locItem('Beehive', 0.2),
      ],
      dist: [],
    },
    {
      id: 'fence1',
      size: [12, 8, 5],
      weight: 6,
      items: [
        locItem('wood_fence', 0.5, 5),
      ],
      dist: [],
    },
    {
      id: 'fence2',
      size: [9, 8, 4],
      weight: 6,
      items: [
        locItem('wood_fence', 0.5, 3),
      ],
      dist: [],
    },
    {
      id: 'road1',
      size: [6, 8, 17],
      weight: 6,
      items: [
        locItem('wood_pole', 1, 2),
        locItem('piece_sign', 1, 3),
      ],
      dist: [],
    },
  ],
  inner: [
    {
      id: 'turnipfield',
      size: [12, 8, 9],
      weight: 5,
      items: [
        locItem('wood_fence', 0.5, 12),
        locItem('Raspberry', 0.4, 6),
        locItem('Boar', 0.33),
      ],
      dist: [],
    },
    {
      id: 'farmhouse1',
      size: [15, 8, 15],
      weight: 8,
      items: [
        /*
        locItem('bed', 0.5),
        locItem('wood_door', 0.66),
        locItem('wood_roof_45', 0.8, 4),
        locItem('wood_roof_45', 0.66, 4),
        locItem('wood_roof_45', 1, 8),
        locItem('wood_beam_45', 1, 4),
        locItem('wood_wall', 1),
        locItem('wood_wall_roof_45', 1, 4),
        locItem('wood_wall_roof_top_45', 0.66, 2),
        locItem('wood_floor', 1, 12),
        */
      ],
      dist: [],
    },
    {
      id: 'farmhouse2',
      size: [15, 8, 15],
      weight: 6,
      items: [
        locItem('TreasureChest_Meadows'),
        locItem('Beehive', 0.2),
      ],
      dist: [],
    },
    {
      id: 'farmhouse3',
      size: [15, 8, 17],
      weight: 4,
      items: [
        locItem('TreasureChest_Meadows', 0.9),
        locItem('Beehive', 0.2),
      ],
      dist: [],
    },
    {
      id: 'signpost',
      size: [2, 8, 2],
      weight: 0.1,
      items: [
        locItem('wood_pole', 1, 2),
        locItem('piece_sign', 1, 3),
      ],
      dist: [],
    },
    {
      id: 'woodpile',
      size: [10, 8, 10],
      weight: 0.5,
      items: [
        locItem('wood_stack'),
        locItem('wood_stack', 0.5, 3),
      ],
      dist: [],
    },
    {
      id: 'henpen',
      size: [15, 8, 15],
      weight: 3,
      items: [
        locItem('Boar', 0.33, 2),
        locItem('wood_fence', 0.5, 15),
        locItem('Dandelion', 0.2, 6),
      ],
      dist: [],
    },
    {
      id: 'yard',
      size: [15, 8, 15],
    weight: 3,
      items: [
        locItem('piece_maypole', 0.1),
        locItem('Boar', 0.33, 3),
        locItem('wood_fence', 0.5, 16),
        locItem('Dandelion', 0.2, 6),
      ],
      dist: [],
    },
  ],
};

export const forestcrypt: DungeonRoomsConfig = {
  type: 'dungeon',
  rooms: [
    {
      id: 'entrance_large',
      type: 'start',
      size: [12, 12, 20],
      weight: 1,
      connections: 3,
      items: [
        locItem('MushroomYellow', 0.2, 12),
      ],
      dist: [0, 1],
    },
    {
      id: 'room1',
      type: 'middle',
      size: [8, 6, 8],
      minPlaceOrder: 2,
      weight: 1,
      connections: 3,
      items: [
        locItem([locItem('Skeleton', 1, 3)], 0.5),
        locItem('MushroomYellow', 0.2, 5),
        locItem('piece_groundtorch_wood', 0.44),
        locItem('TreasureChest_forestcrypt'),
      ],
      dist: [0.118, 0.268, 0.292, 0.177, 0.086, 0.039, 0.012, 0.007, 0.001],
    },
    {
      id: 'Corridor1',
      type: 'middle',
      size: [6, 5, 10],
      weight: 1,
      connections: 3,
      items: [
        locItem('Skeleton', 0.33),
        locItem('piece_groundtorch_wood', 0.2),
      ],
      dist: [0, 0, 0.012, 0.111, 0.237, 0.303, 0.183, 0.099, 0.034, 0.014, 0.005, 0.002],
    },
    {
      id: 'Corridor2',
      type: 'middle',
      size: [6, 5, 10],
      minPlaceOrder: 2,
      weight: 1,
      connections: 3,
      items: [
        locItem('Skeleton', 0.33),
        locItem('MushroomYellow', 0.2, 5),
      ],
      dist: [0.108, 0.278, 0.28, 0.167, 0.103, 0.033, 0.023, 0.003, 0.005],
    },
    {
      id: 'Corridor3',
      type: 'middle',
      size: [8, 5, 10],
      minPlaceOrder: 2,
      weight: 1,
      connections: 2,
      items: [
        locItem([locItem('Skeleton', 1, 3)], 0.5),
        locItem('MushroomYellow', 0.2, 9),
        locItem('Pickable_ForestCryptRandom', 0.5, 2),
      ],
      dist: [0.133, 0.264, 0.305, 0.172, 0.083, 0.021, 0.017, 0.004, 0.001],
    },
    {
      id: 'Bend1',
      type: 'middle',
      size: [6, 5, 6],
      minPlaceOrder: 4,
      weight: 1,
      connections: 2,
      items: [
        locItem('MushroomYellow', 0.2, 6),
      ],
      dist: [0.087, 0.208, 0.265, 0.237, 0.122, 0.055, 0.016, 0.005, 0.004, 0.001],
    },
    {
      id: 'Bend2',
      type: 'middle',
      size: [8, 5, 6],
      minPlaceOrder: 4,
      weight: 1,
      connections: 2,
      items: [
        locItem('Skeleton', 0.33),
        locItem('MushroomYellow', 0.2, 6),
      ],
      dist: [0.501, 0.331, 0.124, 0.037, 0.004, 0.002, 0.001],
    },
    {
      id: 'Stairs1',
      type: 'middle',
      size: [4, 10, 8],
      minPlaceOrder: 4,
      weight: 1,
      connections: 2,
      items: [],
      dist: [0.515, 0.318, 0.125, 0.028, 0.011, 0.003],
    },
    {
      id: 'room_16',
      type: 'middle',
      size: [16, 8, 16],
      minPlaceOrder: 2,
      weight: 1,
      connections: 4,
      items: [
        locItem('BonePileSpawner', 0.2, 2),
        locItem([locItem('Skeleton', 1, 3)], 0.779),
        locItem('MushroomYellow', 0.2, 13),
      ],
      dist: [0.179, 0.318, 0.284, 0.149, 0.052, 0.013, 0.004, 0.001],
    },
    {
      id: 'Chasm01',
      type: 'middle',
      size: [12, 16, 12],
      minPlaceOrder: 4,
      weight: 1,
      connections: 4,
      items: [
        locItem([locItem('Skeleton', 1, 3)], 0.779),
        locItem('Ghost', 0.5),
        locItem('MushroomYellow', 0.2, 17),
        locItem('piece_groundtorch_wood', 0.5),
      ],
      dist: [0.640, 0.273, 0.07, 0.01, 0.005, 0, 0.001, 0.001],
    },
    {
      id: 'BurialChamber01',
      type: 'middle',
      size: [6, 6, 18],
      minPlaceOrder: 3,
      weight: 1,
      connections: 1,
      items: [
        locItem('Vegvisir', 0.4),
        locItem('MushroomYellow', 0.2, 5),
        locItem('piece_groundtorch_wood', 0.5),
        locItem('BoneFragments', 0.5, 4),
        locItem('Pickable_ForestCryptRandom', 0.5, 4),
        locItem('SurtlingCore', 0.754, 2), // .757 + .751
        locItem('SurtlingCore', 0.55, 2),
      ],
      dist: [0.349, 0.486, 0.141, 0.019, 0.003, 0.002],
    },
    {
      id: 'BurialChamber02',
      type: 'middle',
      size: [6, 6, 18],
      minPlaceOrder: 3,
      weight: 1,
      connections: 1,
      items: [
        locItem('Vegvisir', 0.4),
        locItem('MushroomYellow', 0.2, 7),
        locItem('piece_groundtorch_wood', 0.5, 2),
        // spawners
        locItem('Skeleton', 0.33, 2),
        locItem('BonePileSpawner'),
        locItem('Skeleton_Poison', 0.25),
        // loot
        locItem('BoneFragments', 0.5),
        locItem('Pickable_ForestCryptRandom', 0.5, 7),
        locItem('SurtlingCore', 0.702, 2),
        locItem('SurtlingCore', 0.646, 2),
        locItem('SurtlingCore', 0.726),
        locItem('SurtlingCore', 0.55, 2),
        locItem('SurtlingCore', 0.504),
        locItem('TreasureChest_forestcrypt'),
      ],
      dist: [0.459, 0.421, 0.102, 0.018],
    },
    {
      id: 'Burialchamber03',
      type: 'middle',
      size: [16, 6, 8],
      minPlaceOrder: 3,
      weight: 1,
      connections: 1,
      items: [
        locItem('Vegvisir', 0.4),
        locItem('piece_groundtorch_wood', 0.5, 4),
        locItem('SurtlingCore', 0.5, 5),
        locItem('Pickable_ForestCryptRandom', 0.5, 6),
        locItem('TreasureChest_forestcrypt'),
        // spawners
        locItem('Skeleton', 0.33, 2),
        locItem('BonePileSpawner'),
        locItem('Skeleton_Poison', 0.25),
      ],
      dist: [0.330, 0.375, 0.203, 0.068, 0.016, 0.006, 0.002],
    },
    {
      id: 'Burialchamber04',
      type: 'middle',
      size: [16, 6, 8],
      minPlaceOrder: 3,
      weight: 1,
      connections: 1,
      items: [
        locItem('Vegvisir', 0.4),
        locItem('piece_groundtorch_wood', 0.5, 4),
        // spawners
        locItem('Skeleton', 0.33, 2),
        locItem('BonePileSpawner'),
        locItem('Skeleton_Poison', 0.2),
        // loot
        locItem('SurtlingCore', 0.5, 5),
        locItem('Pickable_ForestCryptRandom', 0.5, 7),
        locItem('TreasureChest_forestcrypt'),
      ],
      dist: [0.320, 0.378, 0.21, 0.061, 0.027, 0.003, 0.001],
    },
    {
      id: 'Burialchamber05',
      type: 'middle',
      size: [16, 6, 16],
      minPlaceOrder: 3,
      weight: 1,
      connections: 2,
      items: [
        locItem('MushroomYellow', 0.2, 13),
        // spawners
        locItem('Skeleton', 0.33, 4),
        locItem('Skeleton_Poison', 0.33),
        locItem('BonePileSpawner', 0.25),
        // loot
        locItem('SurtlingCore', 0.55, 6),
        locItem('Pickable_ForestCryptRandom', 0.5, 6),
        locItem('TreasureChest_forestcrypt'),
      ],
      dist: [0.425, 0.369, 0.152, 0.041, 0.012, 0.001],
    },
    {
      id: 'EndCap', // lower priority
      type: 'end',
      size: [2, 4, 0],
      weight: 1,
      connections: 1,
      items: [],
      dist: [0.403, 0.343, 0.185, 0.047, 0.017, 0.003, 0.001, 0.001],
    },
    {
      id: 'EndCap2',
      type: 'end',
      size: [2, 4, 2],
      weight: 1,
      connections: 1,
      items: [
        locItem('MushroomYellow', 0.2, 5),
      ],
      dist: [0.02, 0.01, 0.026, 0.055, 0.112, 0.154, 0.157, 0.146, 0.125, 0.079, 0.048, 0.03, 0.022, 0.013, 0.01, 0.005, 0.004, 0.001, 0.001],
    },
    {
      id: 'EndCap3',
      type: 'end',
      size: [2, 4, 2],
      weight: 1,
      connections: 1,
      items: [
        locItem('BoneFragments', 0.33),
        locItem('SurtlingCore', 0.33),
      ],
      dist: [0.001, 0.006, 0.029, 0.048, 0.114, 0.124, 0.155, 0.142, 0.115, 0.093, 0.073, 0.04, 0.028, 0.012, 0.007, 0.008, 0.002, 0.002, 0, 0.001],
    },
  ],
};

const ROOM_ENEMIES = locItem([
  locItem('Draugr', 0.5, 2),
  locItem('Draugr_Elite', 0.15),
  locItem('Blob', 0.5),
]);

const ROOM_LOOT = locItem([
  locItem('Pickable_SunkenCryptRandom', 0.5, 4),
  locItem('TreasureChest_sunkencrypt', 0.9),
  locItem('piece_groundtorch_green', 0.5, 4),
]);

export const sunkencrypt: DungeonRoomsConfig = {
  type: 'dungeon',
  rooms: [
    {
      id: 'Start1',
      type: 'start',
      size: [8, 10, 14],
      weight: 1,
      connections: 3,
      items: [
        locItem('piece_groundtorch_green', 1, 2),
        locItem('MushroomYellow', 0.5, 6),
      ],
      dist: [0, 1],
    },
    {
      id: 'Corridor1',
      type: 'middle',
      size: [12, 10, 10],
      weight: 5,
      connections: 2,
      items: [
        locItem('piece_groundtorch_green', 0.5, 6),
        locItem('mudpile2', 0.6, 2),
        locItem('Vegvisir', 0.4),
        locItem('TreasureChest_sunkencrypt', 0.5, 3),
      ],
      dist: [0.21, 0.44, 0.19, 0.1, 0.06],
    },
    {
      id: 'Corridor2',
      type: 'middle',
      size: [12, 10, 8],
      weight: 0.5,
      connections: 2,
      items: [
        locItem('Draugr', 0.5, 2),
        locItem('piece_groundtorch_green', 0.5, 4),
        locItem('MushroomYellow', 0.5, 6),
        locItem('mudpile2', 0.6, 2),
      ],
      dist: [0.21, 0.44, 0.21, 0.12, 0.02],
    },
    {
      id: 'Corridor3',
      type: 'middle',
      size: [12, 10, 8],
      weight: 0.5,
      connections: 2, // water + ''
      items: [
        locItem('piece_groundtorch_green', 0.5, 2),
      ],
      dist: [0.14, 0.22, 0.22, 0.21, 0.12, 0.06, 0.01, 0.01, 0.01],
    },
    {
      id: 'Corridor4',
      type: 'middle',
      size: [12, 10, 8],
      weight: 1,
      connections: 3,
      items: [
        locItem('mudpile2', 0.6, 3),
        locItem('Draugr', 0.5),
        locItem('Blob', 0.5),
        locItem('piece_groundtorch_green', 0.5, 1),
      ],
      dist: [0.17, 0.3, 0.26, 0.15, 0.07, 0.03, 0.02],
    },
    {
      id: 'Corridor5',
      type: 'middle',
      size: [12, 10, 8],
      weight: 1,
      connections: 4,
      items: [
        locItem('mudpile2', 0.6, 4),
        locItem('Blob', 0.5, 2),
        locItem('piece_groundtorch_green', 0.5, 2),
      ],
      dist: [0.19, 0.22, 0.13, 0.27, 0.13, 0.03, 0.03],
    },
    {
      id: 'Stair1',
      type: 'middle',
      size: [16, 16, 8],
      weight: 2,
      connections: 4,
      items: [
        locItem('mudpile2', 0.6, 2),
        locItem('piece_groundtorch_green', 0.5, 4),
      ],
      dist: [0.26, 0.29, 0.26, 0.14, 0.04, 0.01],
    },
    {
      id: 'Room1',
      type: 'middle',
      size: [12, 10, 12],
      weight: 1,
      connections: 4,
      items: [
        ROOM_ENEMIES,
        locItem('mudpile2', 0.6, 4),
        ROOM_LOOT,
        locItem('MushroomYellow', 0.5, 8),
      ],
      dist: [0.34, 0.29, 0.24, 0.06, 0.07],
    },
    {
      id: 'Room2',
      type: 'middle',
      size: [12, 10, 12],
      weight: 1,
      connections: 3,
      items: [
        ROOM_ENEMIES,
        locItem('Spawner_DraugrPile', 0.5),
        locItem('mudpile2', 0.6, 4),
        ROOM_LOOT,
        locItem('MushroomYellow', 0.5, 8),
      ],
      dist: [0.30, 0.31, 0.22, 0.12, 0.04, 0, 0.01],
    },
    {
      id: 'Room3',
      type: 'middle',
      size: [12, 10, 12],
      weight: 1,
      connections: 2,
      items: [
        locItem('Vegvisir', 0.5),
        ROOM_ENEMIES,
        locItem('mudpile2', 0.6, 3),
        ROOM_LOOT,
        locItem('MushroomYellow', 0.5, 8),
      ],
      dist: [0.25, 0.37, 0.24, 0.1, 0.04],
    },
    {
      id: 'Room4',
      type: 'middle',
      size: [12, 10, 12],
      weight: 1,
      connections: 2, // water + ''
      items: [
        ROOM_ENEMIES,
        locItem('mudpile2', 0.6, 2),
        ROOM_LOOT,
        locItem('MushroomYellow', 0.5, 8),
      ],
      dist: [0.22, 0.24, 0.23, 0.15, 0.1, 0.03, 0.01, 0, 0.02],
    },
    {
      id: 'Endcap1',
      type: 'end',
      size: [4, 10, 4],
      weight: 0.5,
      connections: 1,
      items: [
        locItem('MushroomYellow', 0.5, 5),
      ],
      dist: [0.16, 0.14, 0.15, 0.19, 0.12, 0.09, 0.07, 0.03, 0.05],
    },
    {
      id: 'Endcap2',
      type: 'end',
      size: [4, 10, 4],
      weight: 0.5,
      connections: 1,
      items: [
        locItem('Pickable_SunkenCryptRandom', 0.5),
        locItem('MushroomYellow', 0.5, 4),
      ],
      dist: [0.07, 0.11, 0.2, 0.22, 0.18, 0.09, 0.05, 0.04, 0.02, 0.02],
    },
    {
      id: 'Endcap3',
      type: 'end',
      size: [4, 10, 4],
      weight: 0.5,
      connections: 1,
      items: [],
      dist: [0, 0.02, 0.1, 0.06, 0.11, 0.09, 0.11, 0.18, 0.11, 0.12, 0.03, 0.02, 0.02, 0, 0.03],
    },
    {
      id: 'EndcapWater1',
      type: 'end',
      size: [0, 10, 4],
      weight: 0.5,
      connections: 1, // water
      items: [],
      dist: [0.37, 0.41, 0.13, 0.07, 0.02],
    },
    {
      id: 'EndcapWater2',
      type: 'end',
      size: [4, 10, 4],
      weight: 0.5,
      connections: 1, // water
      items: [],
      dist: [0,45, 0.37, 0.13, 0.05],
    },
  ],
};
