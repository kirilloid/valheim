import type { LocationItem } from '../types';

import { locItem } from '../model/game';
import { Distribution } from '../model/dist';

export type DungeonRoomsConfig = {
  type: 'dungeon';
  prefix: string,
  rooms: RoomConfig[];
};

export type CampConfig = {
  type: 'camp';
  prefix: string,
  inner: CamplaceConfig[];
  perimeter: CamplaceConfig[];
};

type RoomConnection = {
  pos: [x: number, y: number, z: number],
  type?: string;
  entrance?: boolean;
  allowDoor?: boolean;
};

type RoomConfig = {
  id: string;
} & ({
  type: 'start';
} | {
  type: 'middle';
  minPlaceOrder?: number;
} | {
  type: 'end';
  minPlaceOrder?: number;
  endCapPriority?: number;
}) & {
  size: [number, number, number];
  weight: number;
  connections: RoomConnection[];
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

const entrance = true;
const allowDoor = true;

export const gobvill: CampConfig = {
  type: 'camp',
  prefix: 'gobvill_',
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
  prefix: `woodfarm_`,
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
        locItem('TreasureChest_meadows'),
        locItem('Beehive', 0.2),
      ],
      dist: [],
    },
    {
      id: 'farmhouse3',
      size: [15, 8, 17],
      weight: 4,
      items: [
        locItem('TreasureChest_meadows', 0.9),
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

export const woodvillage: CampConfig = {
  type: 'camp',
  prefix: `woodvillage_`,
  perimeter: [],
  inner: [],
};

export const forestcrypt: DungeonRoomsConfig = {
  type: 'dungeon',
  prefix: 'forestcrypt_',
  rooms: [
    // forestcrypt_entrance: disabled
    {
      id: 'entrance_large',
      type: 'start',
      size: [12, 12, 20],
      weight: 1,
      connections: [
        { pos: [0, -3.5, 10] },
        { pos: [0, 0.5, -10], entrance },
        { pos: [-6, -3.5, 4] },
        { pos: [6, -3.5, 4] },
      ],
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
      connections: [
        { pos: [4, -1.5, 2] },
        { pos: [-4, -1.5, 0] },
        { pos: [0, -1.5, 4] },
      ],
      items: [
        locItem([locItem('Skeleton', 1, 3)], 0.5),
        locItem('MushroomYellow', 0.2, 5),
        locItem('piece_groundtorch_wood', 0.44),
        locItem('TreasureChest_forestcrypt'),
      ],
      dist: [0.118, 0.268, 0.292, 0.177, 0.086, 0.039, 0.012, 0.007, 0.001],
    },
    // room2: disabled
    // BurialChamber01: disabled
    // BurialChamber02: disabled
    {
      id: 'Corridor1',
      type: 'middle',
      size: [4, 5, 8],
      weight: 1,
      connections: [
        { pos: [0, -1, 4] },
        { pos: [0, -1, -4] },
        { pos: [-2, -1, 0] },
      ],
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
      connections: [
        { pos: [1, -1, 5] },
        { pos: [-1, -1, -5] },
        { pos: [-3, -1, -3] },
      ],
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
      connections: [
        { pos: [0, -1, 5] },
        { pos: [2, -1, -5] },
        { pos: [-4, -1, -1] },
      ],
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
      connections: [
        { pos: [1, -1, 3] },
        { pos: [-3, -1, -1] },
      ],
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
      connections: [
        { pos: [2, -1, 3] },
        { pos: [-2, -1, 3] },
      ],
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
      connections: [
        { pos: [0, -3.5, 4] },
        { pos: [0, 0.5, -4] },
      ],
      items: [],
      dist: [0.515, 0.318, 0.125, 0.028, 0.011, 0.003],
    },
    // Stairs2: disabled
    {
      id: 'EndCap', // lower priority
      type: 'end',
      size: [2, 4, 0],
      weight: 1,
      endCapPriority: -1,
      connections: [{ pos: [0, -1.5, 0] }],
      items: [],
      dist: [0.403, 0.343, 0.185, 0.047, 0.017, 0.003, 0.001, 0.001],
    },
    {
      id: 'EndCap2',
      type: 'end',
      size: [2, 4, 2],
      weight: 1,
      endCapPriority: 1,
      connections: [{ pos: [0, -1.5, -1] }],
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
      endCapPriority: 1,
      connections: [{ pos: [0, -1.5, -1] }],
      items: [
        locItem('BoneFragments', 0.33),
        locItem('SurtlingCore', 0.33),
      ],
      dist: [0.001, 0.006, 0.029, 0.048, 0.114, 0.124, 0.155, 0.142, 0.115, 0.093, 0.073, 0.04, 0.028, 0.012, 0.007, 0.008, 0.002, 0.002, 0, 0.001],
    },
    {
      id: 'room_16',
      type: 'middle',
      size: [16, 8, 16],
      minPlaceOrder: 2,
      weight: 1,
      connections: [
        { pos: [-8, -1.5, 0] },
        { pos: [0, -1.5, 8] },
        { pos: [8, -1.5, 0] },
        { pos: [0, -1.5, -8] },
      ],
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
      connections: [
        { pos: [6, 1.5, 0] },
        { pos: [-6, 1.5, 0] },
        { pos: [0, -6, 6] },
        { pos: [0, -6, -6] },
      ],
      items: [
        locItem([locItem('Skeleton', 1, 3)], 0.779),
        locItem('Ghost', 0.5),
        locItem('MushroomYellow', 0.2, 17),
        locItem('piece_groundtorch_wood', 0.5),
      ],
      dist: [0.640, 0.273, 0.07, 0.01, 0.005, 0, 0.001, 0.001],
    },
    {
      id: 'new_BurialChamber01',
      type: 'middle',
      size: [6, 6, 18],
      minPlaceOrder: 3,
      weight: 1,
      connections: [{ pos: [0, -1.5, 9] }],
      items: [
        locItem('Vegvisir_GDKing', 0.4),
        locItem('MushroomYellow', 0.2, 5),
        locItem('piece_groundtorch_wood', 0.5),
        locItem('BoneFragments', 0.5, 4),
        locItem('Pickable_ForestCryptRandom', 0.5, 4),
        locItem('SurtlingCore', 0.757),
        locItem('SurtlingCore', 0.751),
        locItem('SurtlingCore', 0.55, 2),
      ],
      dist: [0.349, 0.486, 0.141, 0.019, 0.003, 0.002],
    },
    {
      id: 'new_BurialChamber02',
      type: 'middle',
      size: [20, 8, 12],
      minPlaceOrder: 3,
      weight: 1,
      connections: [{ pos: [-10, -1.5, 0] }],
      items: [
        locItem('Vegvisir_GDKing', 0.4),
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
      connections: [{ pos: [4, -1.5, 4] }],
      items: [
        locItem('Vegvisir_GDKing', 0.4),
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
      connections: [{ pos: [4, -1.5, 4] }],
      items: [
        locItem('Vegvisir_GDKing', 0.4),
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
      size: [16, 8, 16],
      minPlaceOrder: 3,
      weight: 1,
      connections: [
        { pos: [-8, -1.5, 0] },
        { pos: [-5, -1.5, -8] },
      ],
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
  prefix: 'sunkencrypt_new_',
  rooms: [
    {
      id: 'Start1',
      type: 'start',
      size: [8, 10, 14],
      weight: 1,
      connections: [
        { pos: [4, -2.5, -1] },
        { pos: [-4, -2.5, -1] },
        { pos: [0, -2.5, -7] },
      ],
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
      connections: [
        { pos: [6, -2.5, 0] },
        { pos: [-6, -2.5, 0] },
      ],
      items: [
        locItem('piece_groundtorch_green', 0.5, 6),
        locItem('mudpile2', 0.6, 2),
        locItem('Vegvisir_Bonemass', 0.4),
        locItem('TreasureChest_sunkencrypt', 0.5, 3),
      ],
      dist: [0.21, 0.44, 0.19, 0.1, 0.06],
    },
    {
      id: 'Corridor2',
      type: 'middle',
      size: [12, 10, 8],
      weight: 0.5,
      connections: [
        { pos: [6, -2.5, 0] },
        { pos: [-6, -2.5, 0] },
      ],
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
      connections: [
        { pos: [6, -1.5, 0] },
        { pos: [-6, -3, 0], type: 'water' },
      ],
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
      connections: [
        { pos: [6, -2.5, 0] },
        { pos: [-6, -2.5, 0] },
        { pos: [0, -2.5, 4] },
      ],
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
      connections: [
        { pos: [6, -2.5, 0] },
        { pos: [-6, -2.5, 0] },
        { pos: [0, -2.5, 4] },
        { pos: [0, -2.5, -4] },
      ],
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
      connections: [
        { pos: [7.75, -2.5, 0] },
        { pos: [-8, -6, 0] },
      ],
      items: [
        locItem('mudpile2', 0.6, 2),
        locItem('piece_groundtorch_green', 0.5, 4),
      ],
      dist: [0.26, 0.29, 0.26, 0.14, 0.04, 0.01],
    },
    {
      id: 'Endcap1',
      type: 'end',
      size: [4, 10, 4],
      weight: 0.5,
      connections: [{ pos: [2, -2.5, 0] }],
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
      connections: [{ pos: [2, -2.5, 0] }],
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
      connections: [{ pos: [0, -2.5, 0] }],
      items: [],
      dist: [0, 0.02, 0.1, 0.06, 0.11, 0.09, 0.11, 0.18, 0.11, 0.12, 0.03, 0.02, 0.02, 0, 0.03],
    },
    {
      id: 'EndcapWater1',
      type: 'end',
      size: [0, 10, 4],
      weight: 0.5,
      connections: [{ pos: [0, -2.5, 0], type: 'water' }],
      items: [],
      dist: [0.37, 0.41, 0.13, 0.07, 0.02],
    },
    {
      id: 'EndcapWater2',
      type: 'end',
      size: [4, 10, 4],
      weight: 0.5,
      connections: [{ pos: [2, -4, 0], type: 'water' }],
      items: [],
      dist: [0,45, 0.37, 0.13, 0.05],
    },
    {
      id: 'Room1',
      type: 'middle',
      size: [12, 10, 12],
      weight: 1,
      connections: [
        { pos: [6, -2.5, 0] },
        { pos: [-6, -2.5, 0] },
        { pos: [0, -2.5, 6] },
        { pos: [0, -2.5, -6] },
      ],
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
      connections: [
        { pos: [6, -2.5, 0] },
        { pos: [0, -2.5, 6] },
        { pos: [0, -2.5, -6] },
      ],
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
      connections: [
        { pos: [0, -2.5, 6] },
        { pos: [0, -2.5, -6] },
      ],
      items: [
        locItem('Vegvisir_Bonemass', 0.5),
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
      connections: [
        { pos: [0, -4, 6], type: 'water' },
        { pos: [0, -2.5, -6] },
      ],
      items: [
        ROOM_ENEMIES,
        locItem('mudpile2', 0.6, 2),
        ROOM_LOOT,
        locItem('MushroomYellow', 0.5, 8),
      ],
      dist: [0.22, 0.24, 0.23, 0.15, 0.1, 0.03, 0.01, 0, 0.02],
    },
  ],
};

const BATS = [
  locItem('Spawner_Bat', 1, 2),
  locItem('Spawner_Bat', 0.75),
  locItem('Spawner_Bat', 0.5, 2),
];

export const frostCaves: DungeonRoomsConfig = {
  type: 'dungeon',
  prefix: 'cave_',
  rooms: [
    {
      id: 'shrine_lootencap06',
      type: 'end',
      size: [0, 4, 2],
      weight: 2,
      endCapPriority: 2,
      connections: [{ pos: [0, -1.25, 0], type: 'loot' }],
      items: [
        locItem('Pickable_ForestCryptRemains03', 0.33, 2),
        locItem('Pickable_ForestCryptRemains01', 0.33, 2),
        locItem('Pickable_Item', 0.2, 3),
      ],
      dist: [0],
    },
    {
      id: 'shrine_lootencap05',
      type: 'end',
      size: [0, 4, 2],
      weight: 3,
      endCapPriority: 2,
      connections: [{ pos: [0, -1.25, 0], type: 'loot' }],
      items: [
        locItem('cloth_hanging_door'),
        locItem('Pickable_ForestCryptRemains02', 0.33),
        locItem('Pickable_ForestCryptRemains03', 0.33),
        locItem('Pickable_MeatPile', 0.66),
        locItem('Pickable_Item', 0.2, 3),
      ],
      dist: [0],
    },
    {
      id: 'shrine_lootencap04',
      type: 'end',
      size: [0, 4, 2],
      weight: 1,
      endCapPriority: 1,
      connections: [{ pos: [0, -1.25, 0], type: 'loot' }],
      items: [
        locItem('cloth_hanging_door'),
        locItem('Pickable_ForestCryptRemains02', 0.33),
        locItem('Pickable_ForestCryptRemains03', 0.33),
        locItem('Pickable_MeatPile', 0.66),
        locItem('Pickable_Item', 0.2, 3),
      ],
      dist: [0],
    },
    {
      id: 'shrine_lootencap03',
      type: 'end',
      size: [0, 4, 2],
      weight: 3,
      endCapPriority: 2,
      connections: [{ pos: [0, -1.25, 0], type: 'loot' }],
      items: [
        locItem('Pickable_MountainCaveRandom', 0.75),
        locItem('cloth_hanging_door'),
      ],
      dist: [0],
    },
    {
      id: 'shrine_lootencap02',
      type: 'end',
      size: [0, 4, 2],
      weight: 2,
      endCapPriority: 1,
      connections: [{ pos: [0, -1.25, 0], type: 'loot' }],
      items: [
        locItem('MountainKit_brazier', 0.66),
      ],
      dist: [0],
    },
    {
      id: 'shrine_lootencap01',
      type: 'end',
      size: [0, 4, 2],
      weight: 2,
      endCapPriority: 1,
      connections: [{ pos: [0, -1.25, 0], type: 'loot' }],
      items: [
        locItem('Pickable_MountainCaveRandom', 0.75),
        locItem('cloth_hanging_door'),
      ],
      dist: [0],
    },
    {
      id: 'shrine_endcap_noshrine',
      type: 'end',
      size: [0, 12, 12],
      weight: 1,
      endCapPriority: 1,
      connections: [{ pos: [0, -4, 0] }],
      items: [
        locItem('Pickable_MountainCaveRandom', 0.75),
        locItem('cloth_hanging_door'),
      ],
      dist: [0],
    },
    {
      id: 'shrine_endcap_noshrine02',
      type: 'end',
      size: [0, 12, 12],
      weight: 1,
      endCapPriority: 1,
      connections: [{ pos: [0, -4, 0] }],
      items: [
        locItem('Pickable_MountainCaveRandom', 0.75),
        locItem('cloth_hanging_door'),
      ],
      dist: [0],
    },
    {
      id: 'shrine_endcap01',
      type: 'end',
      size: [0, 6, 6],
      weight: 1,
      endCapPriority: 1,
      connections: [{ pos: [0, -2.5, 0], type: 'shrine' }],
      items: [],
      dist: [0],
    },
    {
      id: 'shrine_endcap02',
      type: 'end',
      size: [0, 6, 6],
      weight: 1,
      endCapPriority: 1,
      connections: [{ pos: [0, -2.5, 0], type: 'shrine' }],
      items: [],
      dist: [0],
    },
    {
      id: 'shrine_endcap03',
      type: 'end',
      size: [0, 6, 6],
      weight: 1,
      endCapPriority: 1,
      connections: [{ pos: [0, -2.5, 0], type: 'shrine' }],
      items: [],
      dist: [0],
    },
    {
      id: 'shrine_endcap04',
      type: 'end',
      size: [0, 6, 6],
      weight: 1,
      endCapPriority: 1,
      connections: [{ pos: [0, -2.5, 0], type: 'shrine' }],
      items: [],
      dist: [0],
    },
    {
      id: 'shrine_endcap05',
      type: 'end',
      size: [0, 6, 6],
      weight: 0.5,
      endCapPriority: 1,
      connections: [{ pos: [0, -2.5, 0], type: 'shrine' }],
      items: [],
      dist: [0],
    },
    {
      id: 'shrine_endcap',
      type: 'end',
      size: [0, 6, 6],
      weight: 1,
      endCapPriority: 1,
      connections: [{ pos: [0, -2.5, 0], type: 'shrine' }],
      items: [],
      dist: [0],
    },
    {
      id: 'new_deeproom_bottom_shrine',
      type: 'middle',
      size: [24, 12, 24],
      minPlaceOrder: 2,
      weight: 10,
      connections: [
        { pos: [0, 6, 0], type: 'deeproom' },
        { pos: [0, -2.5, -12], type: 'shrine' },
        { pos: [6, -2.5, -12], type: 'shrine' },
        { pos: [-12, -2.5, -6], type: 'shrine' },
        { pos: [12, -2.5, 6], type: 'shrine' },
        { pos: [-6, -2.5, 12] },
      ],
      items: [
        locItem('MountainKit_brazier', 0.66, 5),
        locItem('cloth_hanging_door_double', 0.66, 2),
        locItem('Spawner_Ulv', 0.5, 4),
      ],
      dist: [0],
    },
    {
      id: 'shrine_hole01',
      type: 'middle',
      size: [12, 30, 12],
      minPlaceOrder: 1,
      weight: 200,
      connections: [
        { pos: [0, -12, 6], type: 'shrine', allowDoor },
        { pos: [0, 5.75, 6], type: 'shrine', allowDoor },
        { pos: [6, 5.75, 0], type: 'shrine', allowDoor },
        { pos: [6, -12, 0], type: 'shrine', allowDoor },
      ],
      items: [],
      dist: [0],
    },
    {
      id: 'shrine_room01',
      type: 'middle',
      size: [12, 9, 12],
      minPlaceOrder: 2,
      weight: 150,
      connections: [
        { pos: [0, -3, -6], type: 'shrine', allowDoor },
        { pos: [0, -3, 6], type: 'shrine', allowDoor },
        { pos: [-6, -3, 0], type: 'shrine', allowDoor },
        { pos: [6, -3, 0], type: 'shrine', allowDoor },
      ],
      items: [],
      dist: [0],
    },
    {
      id: 'shrine_room02',
      type: 'middle',
      size: [12, 9, 12],
      minPlaceOrder: 2,
      weight: 150,
      connections: [
        { pos: [0, -3, -6], type: 'shrine', allowDoor },
        { pos: [0, -3, 6], type: 'shrine', allowDoor },
        { pos: [-6, -3, 0], type: 'shrine', allowDoor },
        { pos: [6, -3, 0], type: 'shrine', allowDoor },
      ],
      items: [],
      dist: [0],
    },
    {
      id: 'shrine_shrine03',
      type: 'middle',
      size: [12, 9, 20],
      minPlaceOrder: 3,
      weight: 600,
      connections: [
        { pos: [6, -1, -4], type: 'shrine', allowDoor },
        { pos: [-6, -1, -4], type: 'shrine', allowDoor },
        { pos: [0, -1, -10], type: 'shrine', allowDoor },
      ],
      items: [],
      dist: [0],
    },
    {
      id: 'shrine_shrine02',
      type: 'middle',
      size: [12, 9, 20],
      minPlaceOrder: 3,
      weight: 600,
      connections: [{ pos: [0, -1, -10], type: 'shrine', allowDoor }],
      items: [],
      dist: [0],
    },
    {
      id: 'shrine_shrine01',
      type: 'middle',
      size: [12, 9, 12],
      minPlaceOrder: 3,
      weight: 600,
      connections: [{ pos: [0, -1, -6], type: 'shrine', allowDoor }],
      items: [],
      dist: [0],
    },
    {
      id: 'shrine_corridor07',
      type: 'middle',
      size: [12, 6, 12],
      minPlaceOrder: 2,
      weight: 150,
      connections: [
        { pos: [0, -2.5, 6], type: 'shrine', allowDoor },
        { pos: [0, -2.5, -6], type: 'shrine', allowDoor },
        { pos: [6, -2.5, 0], type: 'shrine', allowDoor },
        { pos: [-6, -2.5, 0], type: 'shrine', allowDoor },
      ],
      items: [
        locItem('cloth_hanging_door', 1, 2),
        locItem('Spawner_Ulv', 0.66, 2),
        locItem('Pickable_MountainCaveRandom', 0.66),
      ],
      dist: [0],
    },
    {
      id: 'shrine_corridor06',
      type: 'middle',
      size: [12, 6, 12],
      minPlaceOrder: 2,
      weight: 200,
      connections: [
        { pos: [0, -2.5, 6], type: 'shrine', allowDoor },
        { pos: [0, -2.5, -6], type: 'shrine', allowDoor },
        { pos: [-6, -2.5, 0], type: 'shrine', allowDoor },
        { pos: [6, -2.5, 0], type: 'shrine', allowDoor },
      ],
      items: [],
      dist: [0],
    },
    {
      id: 'shrine_corridor05',
      type: 'middle',
      size: [12, 6, 12],
      minPlaceOrder: 2,
      weight: 150,
      connections: [
        { pos: [0, -2.5, 6], type: 'shrine', allowDoor },
        { pos: [0, -2.5, -6], type: 'shrine', allowDoor },
        { pos: [6, -2.5, 0], type: 'shrine', allowDoor },
        { pos: [-2, -2.5, 0], type: 'loot' },
        { pos: [-2, -2.5, 3], type: 'loot' },
        { pos: [-2, -2.5, -3], type: 'loot' },
      ],
      items: [
        locItem('Pickable_MountainCaveRandom', 0.66, 2),
        locItem('Spawner_Ulv', 0.66, 2),
        locItem('cloth_hanging_door', 1, 3),
      ],
      dist: [0],
    },
    {
      id: 'shrine_corridor04',
      type: 'middle',
      size: [12, 6, 12],
      minPlaceOrder: 2,
      weight: 200,
      connections: [
        { pos: [0, -2.5, 6], type: 'shrine', allowDoor },
        { pos: [0, -2.5, -6], type: 'shrine', allowDoor },
        { pos: [-6, -2.5, 0], type: 'shrine', allowDoor },
        { pos: [6, -2.5, 0], type: 'shrine', allowDoor },
      ],
      items: [
        // braziers
        locItem('MountainKit_brazier', 0.66, 2),
        // dirtcenter
        locItem([
          locItem('Pickable_ForestCryptRemains01', 0.33),
          locItem('Pickable_ForestCryptRemains02', 0.33),
          locItem('Pickable_ForestCryptRemains03', 0.33, 2),
        ], 0.5),
        // dirtwall
        locItem([
          locItem('Pickable_ForestCryptRemains01', 0.33),
          locItem('Pickable_ForestCryptRemains02', 0.33),
          locItem('Pickable_ForestCryptRemains03', 0.33),
          locItem('Pickable_MeatPile', 0.66),
        ], 0.5),
        // EnemiesRoom
        locItem('Spawner_Ulv', 0.5, 1),
        locItem('Spawner_Ulv', 0.25, 3),
      ],
      dist: [0],
    },
    {
      id: 'shrine_corridor03',
      type: 'middle',
      size: [12, 6, 12],
      minPlaceOrder: 2,
      weight: 200,
      connections: [
        { pos: [0, -2.5, -6], type: 'shrine', allowDoor },
        { pos: [-6, -2.5, 0], type: 'shrine', allowDoor },
        { pos: [6, -2.5, 0], type: 'shrine', allowDoor },
        { pos: [-6, -2.5, 0], type: 'shrine', allowDoor },
      ],
      items: [
        // GameObject/sacredpillar
        locItem('Pickable_MountainCaveRandom'),
        // braziers
        locItem('MountainKit_brazier', 0.66, 3),
        // dirtcenter
        locItem([
          locItem('Pickable_ForestCryptRemains01', 0.33),
          locItem('Pickable_ForestCryptRemains02', 0.33),
          locItem('Pickable_ForestCryptRemains03', 0.33),
        ], 0.5),
        // dirtwall
        locItem([
          locItem('Pickable_MeatPile', 0.66),
          locItem('Pickable_ForestCryptRemains01', 0.33),
          locItem('Pickable_ForestCryptRemains02', 0.33),
          locItem('Pickable_ForestCryptRemains03', 0.33),
        ], 0.5),
        // dirtwall (1)
        locItem([
          locItem('Pickable_ForestCryptRemains01', 0.33),
          locItem('Pickable_ForestCryptRemains02', 0.33),
          locItem('Pickable_ForestCryptRemains03', 0.33),
          locItem('Pickable_MeatPile', 0.66),
        ], 0.5),
        // EnemiesRoom
        locItem('Spawner_Ulv', 0.33, 2),
      ],
      dist: [0],
    },
    {
      id: 'shrine_corridor02',
      type: 'middle',
      size: [12, 6, 12],
      minPlaceOrder: 2,
      weight: 150,
      connections: [
        { pos: [0, -2.5, 6], type: 'shrine', allowDoor },
        { pos: [0, -2.5, -6], type: 'shrine', allowDoor },
        { pos: [2, -2.5, -3], type: 'loot' },
        { pos: [2, -2.5, 0], type: 'loot' },
        { pos: [2, -2.5, 3], type: 'loot' },
        { pos: [-2, -2.5, 0], type: 'loot' },
        { pos: [-2, -2.5, -3], type: 'loot' },
        { pos: [-2, -2.5, 3], type: 'loot' },
      ],
      items: [
        // EnemiesRoom
        locItem('Spawner_Ulv', 0.33, 2),
      ],
      dist: [0],
    },
    {
      id: 'shrine_corridor01',
      type: 'middle',
      size: [12, 6, 12],
      minPlaceOrder: 2,
      weight: 200,
      connections: [
        { pos: [0, -2.5, 6], type: 'shrine', allowDoor },
        { pos: [0, -2.5, -6], type: 'shrine', allowDoor },
        { pos: [-6, -2.5, 0], type: 'shrine', allowDoor },
        { pos: [6, -2.5, 0], type: 'shrine', allowDoor },
      ],
      items: [
        // braziers
        locItem('MountainKit_brazier', 0.66, 3),
        // dirtwall
        locItem([
          locItem('Pickable_ForestCryptRemains01', 0.33),
          locItem('Pickable_ForestCryptRemains02', 0.33),
          locItem('Pickable_ForestCryptRemains03', 0.33),
          locItem('Pickable_MeatPile', 0.66),
        ], 0.5),
        // dirtwall (1)
        locItem([
          locItem('Pickable_ForestCryptRemains01', 0.33),
          locItem('Pickable_ForestCryptRemains02', 0.33),
          locItem('Pickable_ForestCryptRemains03', 0.33),
          locItem('Pickable_MeatPile', 0.66),
        ], 0.5),
        // dirtcenter
        locItem([
          locItem('Pickable_ForestCryptRemains01', 0.33),
          locItem('Pickable_ForestCryptRemains02', 0.33),
          locItem('Pickable_ForestCryptRemains03', 0.33),
          locItem('Pickable_MeatPile', 0.66, 2),
        ], 0.5),
        // EnemiesRoom
        locItem('Spawner_Ulv', 0.5, 4),
      ],
      dist: [0],
    },
    {
      id: 'shrine_start02_ice',
      type: 'middle',
      size: [12, 12, 21],
      minPlaceOrder: 2,
      weight: 200,
      connections: [
        { pos: [0, -1.75, 10.5], type: 'shrine', allowDoor },
        { pos: [-6, -1.75, 4.5], type: 'shrine', allowDoor },
        { pos: [6, -1.75, 4.5], type: 'shrine', allowDoor },
        { pos: [0, -4, -10.5], type: 'ice', allowDoor },
      ],
      items: [
        // braziers
        locItem('MountainKit_brazier', 0.66, 3),
      ],
      dist: [0],
    },
    {
      id: 'shrine_start02_ice_corridor',
      type: 'middle',
      size: [12, 12, 24],
      minPlaceOrder: 2,
      weight: 150,
      connections: [
        { pos: [0, -4, -12], type: 'ice', allowDoor },
        { pos: [0, -1.75, 12], type: 'shrine', allowDoor },
        { pos: [6, -1.75, 6], type: 'shrine', allowDoor },
        { pos: [-6, -1.75, 6], type: 'shrine', allowDoor },
      ],
      items: [
        // braziers
        locItem('MountainKit_brazier', 0.66),
        // SacredPillar
        locItem('Pickable_MountainCaveRandom', 0.66),
      ],
      dist: [0],
    },
    {
      id: 'shrine_start02',
      type: 'middle',
      size: [12, 12, 21],
      minPlaceOrder: 2,
      weight: 150,
      connections: [
        { pos: [0, -4, -10.5], type: 'shrine', allowDoor },
        { pos: [-6, -4, 4.5], type: 'shrine', allowDoor },
        { pos: [6, -4, 4.5], type: 'shrine', allowDoor },
        { pos: [0, -1.25, -10.5], allowDoor },
      ],
      items: [
        // braziers
        locItem('MountainKit_brazier', 0.66, 3),
      ],
      dist: [0],
    },
    {
      id: 'shrine_start02',
      type: 'middle',
      size: [12, 12, 24],
      minPlaceOrder: 2,
      weight: 150,
      connections: [
        { pos: [0, -1.25, -12], allowDoor },
        { pos: [6, -4, 6], type: 'shrine', allowDoor },
        { pos: [-6, -4, 6], type: 'shrine', allowDoor },
      ],
      items: [
        // braziers
        locItem('MountainKit_brazier', 0.66),
        // GameObject
        locItem('cloth_hanging_door', 1, 2),
      ],
      dist: [0],
    },
    {
      id: 'new_deeproom_endcap',
      type: 'end',
      size: [24, 12, 0],
      weight: 1,
      connections: [{ pos: [0, 0, 0], type: 'deeproom' }],
      items: [
        locItem('Pickable_MountainCaveCrystal', 0.5, 8),
      ],
      dist: [0],
    },
    {
      id: 'new_deeproom_bottom_lake',
      type: 'middle',
      size: [24, 12, 24],
      minPlaceOrder: 2,
      weight: 6,
      connections: [{ pos: [0, 6, 0], type: 'deeproom' }],
      items: [
        // fishes x5
        locItem([locItem('Fish4_cave', 0.66, 9)], 1, 5),
        // GameObject
        locItem([locItem('Pickable_MountainCaveCrystal', 0.66, 6)], 0.75),
      ],
      dist: [0],
    },
    {
      id: 'new_deeproom_bottom_ice',
      type: 'middle',
      size: [24, 12, 24],
      minPlaceOrder: 2,
      weight: 10,
      connections: [
        { pos: [0, 6, 0], type: 'deeproom' },
        { pos: [6, -3, -12], type: 'ice', allowDoor },
        { pos: [6, -3, 12], type: 'ice', allowDoor },
        { pos: [-12, -3, -6], type: 'ice', allowDoor },
        { pos: [12, -3, 6], type: 'ice', allowDoor },
        { pos: [-6, -3, 12], type: 'ice', allowDoor },
      ],
      items: [
        // EnemiesRoom
        locItem('Spawner_Ulv', 0.5, 3),
      ],
      dist: [0],
    },
    {
      id: 'new_deeproom_bottom',
      type: 'middle',
      size: [24, 12, 24],
      minPlaceOrder: 2,
      weight: 10,
      connections: [
        { pos: [6, -3, -12], allowDoor },
        { pos: [6, -3, 12], allowDoor },
        { pos: [-12, -3, -6], allowDoor },
        { pos: [0, 6, 0], type: 'deeproom' },
        { pos: [12, -3, 6], allowDoor },
        { pos: [-6, -3, 12], allowDoor },
      ],
      items: [
        // EnemiesRoom
        locItem('Spawner_Ulv', 0.5, 3),
      ],
      dist: [0],
    },
    {
      id: 'new_deeproom_middle',
      type: 'middle',
      size: [24, 24, 24],
      minPlaceOrder: 1,
      weight: 10,
      connections: [
        { pos: [0, -12, 0], type: 'deeproom' },
        { pos: [0, 12, 0], type: 'deeproom' },
      ],
      items: [
        // bats
        ...BATS,
        // crystals
        locItem('Pickable_MountainCaveCrystal', 0.8, 4),
      ],
      dist: [0],
    },
    {
      id: 'new_deeproom_top',
      type: 'middle',
      size: [24, 24, 24],
      minPlaceOrder: 1,
      weight: 10,
      connections: [
        { pos: [-6, 3, 12], allowDoor },
        { pos: [12, 3, 6], allowDoor },
        { pos: [-12, 3, -6], allowDoor },
        { pos: [0, -12, 0], type: 'deeproom' },
      ],
      items: [
        // GameObject (1)/GameObject (1)/crystals
        locItem([locItem('Pickable_MountainCaveCrystal', 0.8, 3)], 0.5 * 0.5),
        // bats x3
        locItem(BATS, 1, 3),
      ],
      dist: [0],
    },
    {
      id: 'new_deeproom_roof',
      type: 'middle',
      size: [24, 11, 24],
      weight: 999,
      connections: [
        { pos: [0, -5.5, 0], type: 'deeproom' },
      ],
      items: [
        // bats (2)
        ...BATS,
      ],
      dist: [0],
    },
    {
      id: 'new_sloperoom05',
      type: 'middle',
      size: [24, 30, 60],
      weight: 200,
      connections: [
        { pos: [12, 5.75, 0], allowDoor },
        { pos: [6, -12, 30], allowDoor },
        { pos: [12, -12, 24], allowDoor },
        { pos: [-12, -12, 24], allowDoor },
        { pos: [6, -12, -30], allowDoor },
        { pos: [12, -12, -24], allowDoor },
        { pos: [-12, -12, -24], allowDoor },
      ],
      items: [
        // bats
        ...BATS,
        locItem('Pickable_MountainCaveCrystal', 0.33, 3),
      ],
      dist: [0],
    },
    {
      id: 'new_sloperoom04',
      type: 'middle',
      size: [24, 30, 36],
      minPlaceOrder: 1,
      weight: 120,
      connections: [
        { pos: [12, 5.75, 12], allowDoor },
        { pos: [6, -12, -18], allowDoor },
        { pos: [12, -12, -12], allowDoor },
        { pos: [-12, -12, -12], allowDoor },
      ],
      items: [
        // bats
        ...BATS,
      ],
      dist: [0],
    },
    {
      id: 'new_sloperoom03',
      type: 'middle',
      size: [24, 30, 36],
      minPlaceOrder: 1,
      weight: 120,
      connections: [
        { pos: [12, 5.75, 12], allowDoor },
        { pos: [6, -12, -18], allowDoor },
        { pos: [12, -12, 12], allowDoor },
        { pos: [-12, -12, 12], allowDoor },
      ],
      items: [
        // bats
        ...BATS,
        locItem('Pickable_MountainCaveCrystal', 0.33, 3),
      ],
      dist: [0],
    },
    {
      id: 'new_sloperoom02',
      type: 'middle',
      size: [24, 30, 36],
      minPlaceOrder: 1,
      weight: 120,
      connections: [
        { pos: [12, 5.75, 12], allowDoor },
        { pos: [6, -12, -18], allowDoor },
        { pos: [12, -12, -12], allowDoor },
        { pos: [-6, -12, 18], allowDoor },
        { pos: [-12, -12, -12], allowDoor },
        { pos: [6, -12, 18], allowDoor },
        { pos: [12, -12, 12], allowDoor },
        { pos: [-12, -12, 12], allowDoor },
      ],
      items: [
        // bats
        ...BATS,
        // EnemiesRoom
        locItem('Spawner_Ulv', 0.5, 3),
      ],
      dist: [0],
    },
    {
      id: 'new_sloperoom01',
      type: 'middle',
      size: [24, 30, 36],
      minPlaceOrder: 1,
      weight: 120,
      connections: [
        { pos: [12, 5.75, -12], allowDoor },
        { pos: [6, -12, -18], allowDoor },
        { pos: [12, -12, -12], allowDoor },
        { pos: [-6, -12, -18], allowDoor },
        { pos: [-12, -12, -12], allowDoor },
        { pos: [6, -12, 18], allowDoor },
        { pos: [12, -12, 12], allowDoor },
        { pos: [-12, -12, 12], allowDoor },
      ],
      items: [
        // bats
        ...BATS,
        locItem('Pickable_MountainCaveCrystal', 0.33, 3),
        // EnemiesRoom
        locItem('Spawner_Ulv', 0.5, 3),
      ],
      dist: [0],
    },
    {
      id: 'new_sloperoom_w_hole',
      type: 'middle',
      size: [24, 30, 36],
      minPlaceOrder: 1,
      weight: 50,
      connections: [
        { pos: [6, -12, -18], allowDoor },
        { pos: [12, -12, -12], allowDoor },
        { pos: [-6, -12, -18], allowDoor },
        { pos: [-12, -12, -12], allowDoor },
        { pos: [6, -12, 18], allowDoor },
        { pos: [12, -12, 12], allowDoor },
        { pos: [6, 5.75, 18], allowDoor },
        { pos: [6, 5.75, 12], allowDoor },
        { pos: [6, 5.75, -12], allowDoor },
      ],
      items: [
        // bats x2
        locItem(BATS, 1, 2),
        locItem('Pickable_MountainCaveCrystal', 0.33, 3),
        // EnemiesRoom
        locItem('Spawner_Ulv', 0.5, 3),
      ],
      dist: [0],
    },
    {
      id: 'new_slope_endcap01',
      type: 'end',
      size: [0, 12, 12],
      minPlaceOrder: 1,
      endCapPriority: 1,
      weight: 0.5,
      connections: [{ pos: [0, -3, 0], type: 'slope' }],
      items: [],
      dist: [0],
    },
    {
      id: 'new_iceendcap02_crystal',
      type: 'end',
      size: [0, 12, 12],
      minPlaceOrder: 1,
      endCapPriority: 1,
      weight: 3,
      connections: [{ pos: [0, -3, 0], type: 'ice' }],
      items: [
        // crystals
        locItem('Pickable_MountainCaveCrystal', 0.8, 4),
      ],
      dist: [0],
    },
    {
      id: 'new_iceendcap02',
      type: 'end',
      size: [0, 12, 12],
      minPlaceOrder: 1,
      endCapPriority: 1,
      weight: 3,
      connections: [{ pos: [0, -3, 0], type: 'ice' }],
      items: [
        // crystals
        locItem('Pickable_MountainCaveCrystal', 0.8, 4),
      ],
      dist: [0],
    },
    {
      id: 'new_iceendcap_painting04',
      type: 'end',
      size: [0, 12, 12],
      endCapPriority: 1,
      weight: 1,
      connections: [{ pos: [0, -3, 0], type: 'ice' }],
      items: [],
      dist: [0],
    },
    {
      id: 'new_iceendcap_painting03',
      type: 'end',
      size: [0, 12, 12],
      endCapPriority: 1,
      weight: 1,
      connections: [{ pos: [0, -3, 0], type: 'ice' }],
      items: [],
      dist: [0],
    },
    {
      id: 'new_iceendcap_painting02',
      type: 'end',
      size: [0, 12, 12],
      endCapPriority: 1,
      weight: 1,
      connections: [{ pos: [0, -3, 0], type: 'ice' }],
      items: [],
      dist: [0],
    },
    {
      id: 'new_iceendcap_painting01',
      type: 'end',
      size: [0, 12, 12],
      endCapPriority: 1,
      weight: 1,
      connections: [{ pos: [0, -3, 0], type: 'ice' }],
      items: [],
      dist: [0],
    },
    {
      id: 'new_iceendcap_moderstone',
      type: 'end',
      size: [0, 12, 12],
      endCapPriority: 1,
      weight: 0.5,
      connections: [{ pos: [0, -3, 0] }],
      items: [
        locItem('Vegvisir_DragonQueen', 0.25),
      ],
      dist: [0],
    },
    {
      id: 'new_ice_corridor07',
      type: 'middle',
      size: [12, 12, 12],
      weight: 10,
      connections: [
        { pos: [6, -3, 0], type: 'ice', allowDoor },
        { pos: [-6, -3, 0], type: 'ice', allowDoor },
      ],
      items: [
        // crystals
        locItem([locItem('Pickable_MountainCaveCrystal', 0.8, 4)], 0.5),
      ],
      dist: [0],
    },
    {
      id: 'new_ice_corridor06',
      type: 'middle',
      size: [12, 12, 12],
      weight: 5,
      connections: [
        { pos: [6, -3, 0], type: 'ice', allowDoor },
        { pos: [-6, -3, 0], type: 'ice', allowDoor },
      ],
      items: [
      ],
      dist: [0],
    },
    {
      id: 'new_ice_corridor05',
      type: 'middle',
      size: [12, 12, 12],
      weight: 10,
      connections: [
        { pos: [6, -3, 0], type: 'ice', allowDoor },
        { pos: [-6, -3, 0], type: 'ice', allowDoor },
        { pos: [0, -3, -6], type: 'ice', allowDoor },
      ],
      items: [
        // treasure
        locItem([
          locItem('Spawner_Ulv', 0.5, 4),
        ], 0.25),
        // ..
        locItem('Pickable_MountainCaveCrystal', 0.25),
      ],
      dist: [0],
    },
    {
      id: 'new_ice_corridor04',
      type: 'middle',
      size: [12, 12, 12],
      weight: 5,
      connections: [
        { pos: [6, -3, 0], type: 'ice', allowDoor },
        { pos: [-6, -3, 0], type: 'ice', allowDoor },
      ],
      items: [
      ],
      dist: [0],
    },
    {
      id: 'new_ice_corridor03',
      type: 'middle',
      size: [12, 12, 12],
      weight: 5,
      connections: [
        { pos: [6, -3, 0], type: 'ice', allowDoor },
        { pos: [-6, -3, 0], type: 'ice', allowDoor },
      ],
      items: [
        // GameObject
        locItem('Pickable_MountainCaveCrystal', 0.5 * 0.5)
      ],
      dist: [0],
    },
    {
      id: 'new_ice_corridor02',
      type: 'middle',
      size: [12, 12, 12],
      weight: 5,
      connections: [
        { pos: [6, -3, 0], type: 'ice', allowDoor },
        { pos: [-6, -3, 0], type: 'ice', allowDoor },
      ],
      items: [
        // treasure
        locItem([
          locItem('Spawner_Ulv', 0.5, 4),
        ], 0.25),
      ],
      dist: [0],
    },
    {
      id: 'new_ice_corridor01',
      type: 'middle',
      size: [12, 12, 12],
      weight: 5,
      connections: [
        { pos: [6, -2, 0], allowDoor },
        { pos: [-6, -4.75, 0], type: 'ice', allowDoor },
      ],
      items: [
        locItem('Pickable_MountainCaveCrystal', 0.25, 2),
      ],
      dist: [0],
    },
    {
      id: 'new_endcap02_crystal',
      type: 'end',
      size: [0, 12, 12],
      endCapPriority: 1,
      minPlaceOrder: 1,
      weight: 3,
      connections: [{ pos: [0, -3, 0] }],
      items: [
        // crystals
        locItem('Pickable_MountainCaveCrystal', 0.8, 4),
      ],
      dist: [0],
    },
    {
      id: 'new_endcap02',
      type: 'end',
      size: [0, 12, 12],
      endCapPriority: 1,
      minPlaceOrder: 1,
      weight: 3,
      connections: [{ pos: [0, -3, 0] }],
      items: [
        // crystals
        locItem('Pickable_MountainCaveCrystal', 0.8, 4),
      ],
      dist: [0],
    },
    {
      id: 'new_endcap_painting_04',
      type: 'end',
      size: [0, 12, 12],
      endCapPriority: 1,
      weight: 1,
      connections: [{ pos: [0, -3, 0] }],
      items: [],
      dist: [0],
    },
    {
      id: 'new_endcap_painting_03',
      type: 'end',
      size: [0, 12, 12],
      endCapPriority: 1,
      weight: 1,
      connections: [{ pos: [0, -3, 0] }],
      items: [],
      dist: [0],
    },
    {
      id: 'new_endcap_painting_02',
      type: 'end',
      size: [0, 12, 12],
      endCapPriority: 1,
      weight: 1,
      connections: [{ pos: [0, -3, 0] }],
      items: [],
      dist: [0],
    },
    {
      id: 'new_endcap_painting_01',
      type: 'end',
      size: [0, 12, 12],
      endCapPriority: 1,
      weight: 1,
      connections: [{ pos: [0, -3, 0] }],
      items: [],
      dist: [0],
    },
    {
      id: 'new_endcap_moderstone',
      type: 'end',
      size: [0, 12, 12],
      endCapPriority: 1,
      weight: 0.5,
      connections: [{ pos: [0, -3, 0] }],
      items: [
        locItem('Vegvisir_DragonQueen', 0.25),
      ],
      dist: [0],
    },
    {
      id: 'new_corridor09',
      type: 'middle',
      size: [24, 12, 12],
      minPlaceOrder: 1,
      weight: 5,
      connections: [
        { pos: [-12, -3, 0], allowDoor },
        { pos: [-6, -3, -6], allowDoor },
        { pos: [12, -3, 0], allowDoor },
        { pos: [6, -3, 6], allowDoor },
      ],
      items: [
        locItem('Pickable_MountainCaveCrystal', 0.25, 2),
      ],
      dist: [0],
    },
    {
      id: 'new_corridor08',
      type: 'middle',
      size: [12, 12, 12],
      minPlaceOrder: 1,
      weight: 10,
      connections: [
        { pos: [-6, -3, 0], allowDoor },
        { pos: [0, -3, -6], allowDoor },
      ],
      items: [
        // crystals
        locItem([locItem('Pickable_MountainCaveCrystal', 0.8, 4)], 0.5),
      ],
      dist: [0],
    },
    {
      id: 'new_corridor07',
      type: 'middle',
      size: [12, 12, 12],
      minPlaceOrder: 1,
      weight: 10,
      connections: [
        { pos: [-6, -3, 0], allowDoor },
        { pos: [-6, -3, 0], allowDoor },
      ],
      items: [
        // extraroof (2)/random (1)/crystals
        locItem('Pickable_MountainCaveCrystal', 0.5 * 0.25, 2),
      ],
      dist: [0],
    },
    {
      id: 'new_corridor06',
      type: 'middle',
      size: [12, 12, 12],
      minPlaceOrder: 1,
      weight: 5,
      connections: [
        { pos: [-6, -3, 0], allowDoor },
        { pos: [0, -3, -6], allowDoor },
      ],
      items: [
        // roow/walls
        locItem('Pickable_MountainCaveCrystal', 0.25),
        // ..
        locItem('Spawner_Ulv', 0.5, 4),
      ],
      dist: [0],
    },
    {
      id: 'new_corridor05',
      type: 'middle',
      size: [12, 12, 12],
      minPlaceOrder: 1,
      weight: 5,
      connections: [
        { pos: [6, -3, 0], allowDoor },
        { pos: [-6, -3, 0], allowDoor },
      ],
      items: [
        // room/pillars
        locItem([locItem('Pickable_MountainCaveCrystal', 0.25, 2)], 0.5),
      ],
      dist: [0],
    },
    {
      id: 'new_corridor03',
      type: 'middle',
      size: [12, 12, 12],
      minPlaceOrder: 1,
      weight: 5,
      connections: [
        { pos: [6, -3, 0], allowDoor },
        { pos: [-6, -3, 0], allowDoor },
      ],
      items: [
        locItem('Pickable_MountainCaveCrystal', 0.25, 2),
      ],
      dist: [0],
    },
    {
      id: 'new_corridor01',
      type: 'middle',
      size: [12, 12, 12],
      minPlaceOrder: 1,
      weight: 5,
      connections: [
        { pos: [6, -3, 0], allowDoor },
        { pos: [-6, -3, 0], allowDoor },
      ],
      items: [
        // crystals
        locItem('Pickable_MountainCaveCrystal', 0.25, 2),
      ],
      dist: [0],
    },
    {
      id: 'new_crossroads01_hole',
      type: 'middle',
      size: [12, 30, 12],
      minPlaceOrder: 1,
      weight: 5,
      connections: [
        { pos: [0, -12, -6], allowDoor },
        { pos: [0, -12, 6], allowDoor },
        { pos: [-6, -12, 0], allowDoor },
        { pos: [0, 5.75, -6], allowDoor },
        { pos: [0, 5.75, 6], allowDoor },
        { pos: [6, 5.75, 0], allowDoor },
      ],
      items: [
        // bats
        ...BATS,
        // crystals
        locItem([locItem('Pickable_MountainCaveCrystal', 0.8, 4)], 0.5),
        // ..
        locItem('Pickable_MountainCaveCrystal', 0.25),
      ],
      dist: [0],
    },
    {
      id: 'cave_new_crossroads01_hole_shrine',
      type: 'middle',
      size: [12, 30, 12],
      minPlaceOrder: 1,
      weight: 5,
      connections: [
        { pos: [0, 5.75, -6], allowDoor },
        { pos: [0, 5.75, 6], allowDoor },
        { pos: [6, 5.75, 0], allowDoor },
        { pos: [0, -12, 6], allowDoor, type: 'shrine' },
        { pos: [-6, -12, 0], allowDoor, type: 'shrine' },
      ],
      items: [
        // braziers
        locItem('MountainKit_brazier', 0.66, 3),
        // EnemiesRoom
        locItem('Spawner_Ulv', 0.66, 3),
        // bats
        ...BATS,
        // ..
        locItem('Pickable_MountainCaveCrystal', 0.25, 3),
      ],
      dist: [0],
    },
    {
      id: 'cave_new_crossroads01_hole_long',
      type: 'middle',
      size: [12, 30, 24],
      minPlaceOrder: 1,
      weight: 5,
      connections: [
        { pos: [0, -12, -12], allowDoor },
        { pos: [0, -12, 12], allowDoor },
        { pos: [-6, -12, -6], allowDoor },
        { pos: [0, 5.75, -12], allowDoor },
        { pos: [0, 5.75, 12], allowDoor },
        { pos: [6, 5.75, -6], allowDoor },
        { pos: [6, -12, -6], allowDoor },
        { pos: [-6, 5.75, 6], allowDoor },
        { pos: [-6, 5.75, -6], allowDoor },
      ],
      items: [
        // bats x2
        locItem(BATS, 1, 2),
        // crystals
        locItem([locItem('Pickable_MountainCaveCrystal', 0.8, 4)], 0.5),
        // ..
        locItem('Pickable_MountainCaveCrystal', 0.25, 4),
      ],
      dist: [0],
    },
    {
      id: 'cave_new_crossroads01_hole_ice',
      type: 'middle',
      size: [12, 30, 12],
      minPlaceOrder: 1,
      weight: 5,
      connections: [
        { pos: [0, -12, -6], allowDoor, type: 'ice' },
        { pos: [0, -12, 6], allowDoor, type: 'ice' },
        { pos: [-6, -12, 0], allowDoor, type: 'ice' },
        { pos: [0, 5.75, -6], allowDoor },
        { pos: [0, 5.75, 6], allowDoor },
        { pos: [6, 5.75, 0], allowDoor },
      ],
      items: [
        // bats
        ...BATS,
        // crystals
        locItem([locItem('Pickable_MountainCaveCrystal', 0.8, 4)], 0.5),
        // ..
        locItem('Pickable_MountainCaveCrystal', 0.25, 3),
      ],
      dist: [0],
    },
    {
      id: 'cave_new_crossroads01',
      type: 'middle',
      size: [12, 12, 12],
      minPlaceOrder: 1,
      weight: 5,
      connections: [
        { pos: [6, -3, 0], allowDoor },
        { pos: [-6, -3, 0], allowDoor },
        { pos: [0, -3, 6], allowDoor },
        { pos: [0, -3, -6], allowDoor },
      ],
      items: [
        // ..
        locItem('Pickable_MountainCaveCrystal', 0.25, 2),
      ],
      dist: [0],
    },
    {
      id: 'cave_new_crossroads01_ice',
      type: 'middle',
      size: [12, 12, 12],
      minPlaceOrder: 1,
      weight: 5,
      connections: [
        { pos: [6, -3, 0], allowDoor, type: 'ice' },
        { pos: [-6, -3, 0], allowDoor },
        { pos: [0, -3, 6], allowDoor, type: 'ice' },
        { pos: [0, -3, -6], allowDoor, type: 'ice' },
      ],
      items: [
      ],
      dist: [0],
    },
    {
      id: 'cave_new_crossroads03',
      type: 'middle',
      size: [12, 12, 12],
      weight: 10,
      connections: [
        { pos: [0, -3, -6], allowDoor },
        { pos: [1.3, -3, 6], allowDoor },
        { pos: [-6, -3, 0], allowDoor },
      ],
      items: [
        // GameObject (1)
        locItem([
          locItem('Spawner_Ulv', 0.5, 3),
          locItem('Spawner_Ulv', 0.25),
        ], 0.5),
      ],
      dist: [0],
    },
    {
      id: 'new_crossroads02',
      type: 'middle',
      size: [12, 12, 12],
      weight: 10,
      connections: [
        { pos: [0, -3, -6], allowDoor },
        { pos: [0, -3, 6], allowDoor },
        { pos: [-6, -3, 0], allowDoor },
      ],
      items: [
        locItem('Pickable_MountainCaveCrystal', 0.25, 2),
      ],
      dist: [0],
    },
    {
      id: 'new_entrance02',
      type: 'start',
      size: [24, 18, 12],
      weight: 1,
      connections: [
        { pos: [-12, -3, 0], allowDoor },
        { pos: [-6, -3, 6], allowDoor },
        { pos: [-6, -3, -6], allowDoor },
        { pos: [12, 0, 0], entrance },
      ],
      items: [
        locItem('Pickable_MountainCaveCrystal', 0.25, 2),
      ],
      dist: [0],
    },
    /*{
      id: 'divider',
      type: 'divider',
      size: [0, 12, 12],
      endCapPriority: 1,
      weight: 1,
      connections: [{ pos: [0, -5, 0], allowDoor }],
      items: [],
      dist: [0],
    },
    {
      id: 'divider02',
      type: 'divider',
      size: [0, 12, 12],
      endCapPriority: 1,
      weight: 1,
      connections: [{ pos: [0, -5, 0], allowDoor }],
      items: [],
      dist: [0],
    },*/
    {
      id: 'dome_roof',
      type: 'end',
      size: [48, 20, 48],
      weight: 80,
      connections: [{ pos: [3.35, -10, 0], type: 'dome' }],
      items: [
        locItem([locItem('Pickable_MountainCaveCrystal', 0.8, 3)], 0.5),
        ...BATS,
      ],
      dist: [0],
    },
    {
      id: 'new_crossroads01_hole_to_deeproom',
      type: 'end',
      size: [24, 38, 24],
      weight: 20,
      connections: [
        { pos: [6, -7.75, -12], allowDoor },
        { pos: [6, 10, -12], allowDoor },
        { pos: [12, 10, -6], allowDoor },
        { pos: [6, 10, 12], allowDoor },
        { pos: [-12, 10, -6], allowDoor },
        { pos: [-12, 10, 6], allowDoor },
        { pos: [-6, 10, 12], allowDoor },
        { pos: [-2.1, -19.25, 0.9], type: 'deeproom' },
      ],
      items: [
        locItem('Vegvisir_DragonQueen', 0.25),
        // extraroof (2)/random x2
        locItem('Pickable_MountainCaveCrystal', 0.5 * 0.25, 2),
        // room/pillars
        locItem('Pickable_MountainCaveCrystal', 0.5 * 0.25, 2),
        // room/walls
        locItem('Pickable_MountainCaveCrystal', 0.25),
        // crystals
        locItem('Pickable_MountainCaveCrystal', 0.5, 3),
        // bats x3
        locItem(BATS, 3),
      ],
      dist: [0],
    },
    {
      id: 'dome_roof_from_deeproom_corner1',
      type: 'middle',
      size: [48, 20, 48],
      minPlaceOrder: 1,
      weight: 1000,
      connections: [
        { pos: [6, -10, 0], type: 'dome' },
        { pos: [-2.65, 10, 6], type: 'deeproom' },
      ],
      items: [
        // crystals
        locItem([locItem('Pickable_MountainCaveCrystal', 0.8, 3)], 0.5),
        ...BATS,
        locItem('Spawner_Bat'),
        locItem('Spawner_Bat', 0.5, 4),
      ],
      dist: [0],
    },
    {
      id: 'dome_roof_from_deeproom_corner2',
      type: 'middle',
      size: [48, 20, 48],
      minPlaceOrder: 1,
      weight: 1000,
      connections: [
        { pos: [6, -10, 0], type: 'dome' },
        { pos: [-2.65, 10, 6], type: 'deeproom' },
      ],
      items: [
        // crystals
        locItem([locItem('Pickable_MountainCaveCrystal', 0.8, 3)], 0.5),
        ...BATS,
        locItem('Spawner_Bat'),
        locItem('Spawner_Bat', 0.5, 4),
      ],
      dist: [0],
    },
    {
      id: 'dome_roof_from_deeproom_corner3',
      type: 'middle',
      size: [48, 20, 48],
      minPlaceOrder: 1,
      weight: 1000,
      connections: [
        { pos: [6, -10, 0], type: 'dome' },
        { pos: [-2.65, 10, 6], type: 'deeproom' },
      ],
      items: [
        // crystals
        locItem([locItem('Pickable_MountainCaveCrystal', 0.8, 3)], 0.5),
        ...BATS,
        locItem('Spawner_Bat'),
        locItem('Spawner_Bat', 0.5, 4),
      ],
      dist: [0],
    },
    {
      id: 'dome_roof_from_deeproom_corner4',
      type: 'middle',
      size: [48, 20, 48],
      minPlaceOrder: 1,
      weight: 1000,
      connections: [
        { pos: [6, -10, 0], type: 'dome' },
        { pos: [-2.65, 10, 6], type: 'deeproom' },
      ],
      items: [
        // crystals
        locItem([locItem('Pickable_MountainCaveCrystal', 0.8, 3)], 0.5),
        ...BATS,
        locItem('Spawner_Bat'),
        locItem('Spawner_Bat', 0.5, 4),
      ],
      dist: [0],
    },
    {
      id: 'dome_middle',
      type: 'middle',
      size: [48, 24, 48],
      minPlaceOrder: 1,
      weight: 10,
      connections: [
        { pos: [0, 12, 0], type: 'dome' },
        { pos: [0, -12, 0], type: 'dome' },
      ],
      items: [
        // crystals
        locItem([locItem('Pickable_MountainCaveCrystal', 0.8, 3)], 0.5),
        // bats
        ...BATS,
        locItem('RuneStone_CaveMan'),
      ],
      dist: [0],
    },
    {
      id: 'dome_bottom_lake',
      type: 'end',
      size: [48, 12, 48],
      minPlaceOrder: 1,
      weight: 20,
      connections: [{ pos: [0, 6, 0], type: 'dome' }],
      items: [
        // Camp
        locItem([
          locItem('fire_pit'),
          locItem('RuneStone_CaveMan'),
          locItem('Pickable_Fishingrod'),
        ]),
        // crystals
        locItem([
          locItem('Pickable_MountainCaveCrystal', 0.5, 2),
          locItem('Pickable_MountainCaveCrystal', 0.75, 2),
          locItem('Pickable_MountainCaveCrystal', 1, 2),
          locItem('Spawner_StoneGolem', 0.5),
        ], 0.4),
        // crystals (2)
        locItem([
          locItem('Pickable_MountainCaveCrystal', 1, 2),
          locItem('Pickable_MountainCaveCrystal', 0.5),
          locItem('Spawner_StoneGolem', 0.5),
        ], 0.4),
        // crystals (3)
        locItem([
          locItem('Spawner_StoneGolem'),
          locItem('Pickable_MountainCaveCrystal', 1, 3),
        ], 1),
      ],
      dist: [0],
    },
    {
      id: 'dome_bottom_endcap',
      type: 'end',
      size: [48, 0, 48],
      minPlaceOrder: 1,
      weight: 1,
      connections: [{ pos: [0, 0, 0], type: 'dome' }],
      items: [
        locItem('Pickable_MountainCaveCrystal', 0.66, 10),
      ],
      dist: [0],
    },
  ]
}

const EGGS: LocationItem[] = [
  locItem('SeekerEgg', 1, 3),
  locItem('SeekerEgg', 0.5, 7),
  locItem('Pickable_RoyalJelly'),
];

const TICKS: LocationItem[] = [
  locItem('Spawner_Tick_stared', 1, 2),
  locItem('Spawner_Tick_stared', 0.5, 2),
];

export const dvergrTown: DungeonRoomsConfig = {
  type: 'dungeon',
  prefix: 'dvergr_',
  // minRooms: 16,
  // maxRooms: 96,
  // minRequiredRooms: 1,
  // requiredRooms: room_TREASURE, room_TREASURE2
  rooms: [
    {
      id: 'entrance01',
      type: 'start',
      size: [32, 16, 8],
      weight: 1,
      connections: [
        { pos: [-16, 2, 0], type: 'dvergr', entrance },
        { pos: [-4, 2, -4], type: 'dvergr', allowDoor },
        { pos: [-4, 2, 4], type: 'dvergr', allowDoor },
        { pos: [12, -6, -4], type: 'dvergr', allowDoor },
        { pos: [4, 2, -4], type: 'dvergr', allowDoor },
        { pos: [16, 2, 0], type: 'dvergr', allowDoor },
        { pos: [4, 2, 4], type: 'dvergr', allowDoor },
        { pos: [12, 2, -4], type: 'dvergr', allowDoor },
        { pos: [12, 2, 4], type: 'dvergr', allowDoor },
        { pos: [16, -6, 0], type: 'dvergr', allowDoor },
        { pos: [12, -6, 4], type: 'dvergr', allowDoor },
      ],
      items: [
        locItem(EGGS, 0.45, 2),
      ],
      dist: [0, 0.5],
    },
    {
      id: 'entrance02',
      type: 'start',
      size: [24, 16, 8],
      weight: 1,
      connections: [
        { pos: [12, 2, 0], type: 'dvergr', allowDoor, entrance },
        { pos: [0, -6, -4], type: 'dvergr', allowDoor },
        { pos: [0, 2, -4], type: 'dvergr', allowDoor },
        { pos: [0, 2, 4], type: 'dvergr', allowDoor },
        { pos: [0, -6, 4], type: 'dvergr', allowDoor },
      ],
      items: [
        locItem(EGGS, 0.45, 2),
      ],
      dist: [0, 0.5],
    },
    {
      id: 'stair01',
      type: 'middle',
      size: [16, 16, 8],
      weight: 1,
      connections: [
        { pos: [4, -6, -4], type: 'dvergr', allowDoor },
        { pos: [8, 2, 0], type: 'dvergr', allowDoor },
        { pos: [4, 2, -4], type: 'dvergr', allowDoor },
        { pos: [4, 2, 4], type: 'dvergr', allowDoor },
        { pos: [8, -6, 0], type: 'dvergr', allowDoor },
        { pos: [4, -6, 4], type: 'dvergr', allowDoor },
      ],
      items: [],
      dist: [1],
    },
    {
      id: 'stair02',
      type: 'middle',
      size: [24, 16, 8],
      weight: 1,
      connections: [
        { pos: [-12, 2, 0], type: 'dvergr', allowDoor },
        { pos: [-8, 2, -4], type: 'dvergr', allowDoor },
        { pos: [-8, 2, 4], type: 'dvergr', allowDoor },
        { pos: [8, -6, -4], type: 'dvergr', allowDoor },
        { pos: [0, 2, -4], type: 'dvergr', allowDoor },
        { pos: [12, 2, 0], type: 'dvergr', allowDoor },
        { pos: [0, 2, 4], type: 'dvergr', allowDoor },
        { pos: [8, 2, -4], type: 'dvergr', allowDoor },
        { pos: [8, 2, 4], type: 'dvergr', allowDoor },
        { pos: [12, -6, 0], type: 'dvergr', allowDoor },
        { pos: [8, -6, 4], type: 'dvergr', allowDoor },
      ],
      items: [
        // room (3)/eggs
        locItem(EGGS, 0.45),
        // enemies
        locItem('Spawner_Seeker', 1, 2),
      ],
      dist: [1],
    },
    {
      id: 'stair03',
      type: 'middle',
      size: [16, 16, 8],
      weight: 1,
      connections: [
        { pos: [-8, 2, 0], type: 'dvergr', allowDoor },
        { pos: [8, -6, 0], type: 'dvergr', allowDoor },
      ],
      items: [
        // room (3)/dvergrtown_gate_stair/
        locItem('dvergrprops_lantern', 0.25),
      ],
      dist: [1],
    },
    {
      id: 'room01',
      type: 'middle',
      size: [8, 8, 8],
      weight: 1,
      connections: [
        { pos: [0, -2, -4], type: 'dvergr', allowDoor },
        { pos: [0, -2, 4], type: 'dvergr', allowDoor },
      ],
      items: [
        // room/dvergrtown_gate_stair x2
        locItem('dvergrprops_lantern', 0.25, 2),
        // room/eggs
        locItem(EGGS, 0.45),
        // enemies
        ...TICKS,
      ],
      dist: [1],
    },
    {
      id: 'room02',
      type: 'middle',
      size: [8, 8, 8],
      weight: 1,
      connections: [
        { pos: [0, -2, -4], type: 'dvergr', allowDoor },
        { pos: [0, -2, 4], type: 'dvergr', allowDoor },
        { pos: [-4, -2, 0], type: 'dvergr', allowDoor },
      ],
      items: [
        // room/dvergrtown_gate_stair x3
        locItem('dvergrprops_lantern', 0.25, 3),
        // room/eggs
        locItem(EGGS, 0.45),
        // enemies
        ...TICKS,
      ],
      dist: [1],
    },
    {
      id: 'room03',
      type: 'middle',
      size: [16, 8, 8],
      weight: 1,
      connections: [
        { pos: [4, -2, -4], type: 'dvergr', allowDoor },
        { pos: [4, -2, 4], type: 'dvergr', allowDoor },
        { pos: [-8, -2, 0], type: 'dvergr', allowDoor },
      ],
      items: [
        // {room,room (1)}/dvergrtown_gate_stair x3
        locItem('dvergrprops_lantern', 0.25, 3),
        // room/eggs
        locItem(EGGS, 0.45),
        // enemies
        ...TICKS,
      ],
      dist: [1],
    },
    {
      id: 'room04',
      type: 'middle',
      size: [16, 8, 8],
      weight: 1,
      connections: [
        { pos: [4, -2, -4], type: 'dvergr', allowDoor },
        { pos: [-4, -2, 4], type: 'dvergr', allowDoor },
      ],
      items: [
        locItem('dvergrprops_lantern', 0.25, 2),
        // room/eggs
        locItem(EGGS, 0.45),
        // enemies
        ...TICKS,
      ],
      dist: [1],
    },
    {
      id: 'corridor01',
      type: 'middle',
      size: [8, 8, 8],
      weight: 1,
      connections: [
        { pos: [0, -2, -4], type: 'dvergr', allowDoor },
        { pos: [0, -2, 4], type: 'dvergr', allowDoor },
      ],
      items: [
        locItem('dvergrprops_lantern', 0.25, 2),
        // room/eggs
        locItem([
          locItem('SeekerEgg', 0.5, 9),
          locItem('SeekerEgg', 1, 4),
          locItem('Pickable_RoyalJelly'),
        ], 0.45),
      ],
      dist: [1],
    },
    {
      id: 'corridor02',
      type: 'middle',
      size: [8, 8, 8],
      weight: 1,
      connections: [
        { pos: [-4, -2, 0], type: 'dvergr', allowDoor },
        { pos: [0, -2, 4], type: 'dvergr', allowDoor },
      ],
      items: [
        locItem('dvergrprops_lantern', 0.25, 2),
      ],
      dist: [1],
    },
    {
      id: 'stone_corridor01',
      type: 'middle',
      size: [8, 8, 8],
      minPlaceOrder: 3,
      weight: 5,
      connections: [
        { pos: [0, -2, -4], type: 'dvergr', allowDoor },
        { pos: [0, -2, 4], type: 'stone', allowDoor },
      ],
      items: [],
      dist: [1],
    },
    {
      id: 'stone_corridor02',
      type: 'middle',
      size: [8, 8, 8],
      minPlaceOrder: 3,
      weight: 5,
      connections: [
        { pos: [0, -2, -4], type: 'stone', allowDoor },
        { pos: [0, -2, 4], type: 'dvergr', allowDoor },
      ],
      items: [],
      dist: [1],
    },
    {
      id: 'stone_corridor03',
      type: 'middle',
      size: [8, 8, 8],
      minPlaceOrder: 3,
      weight: 5,
      connections: [
        { pos: [0, -2, -4], type: 'stone', allowDoor },
        { pos: [4, -2, 0.25], type: 'stone', allowDoor },
      ],
      items: [],
      dist: [1],
    },
    {
      id: 'stone_room01',
      type: 'middle',
      size: [8, 8, 8],
      minPlaceOrder: 2,
      weight: 10,
      connections: [
        { pos: [0, -2, -4], type: 'stone', allowDoor },
        { pos: [0, -2, 4], type: 'stone', allowDoor },
        { pos: [-4, -2, 0], type: 'stone', allowDoor },
        { pos: [4, -2, 0], type: 'stone', allowDoor },
      ],
      items: [
        locItem('dvergrtown_wood_support', 0.5, 4),
        // enemies
        locItem('Spawner_Seeker'),
        locItem('Spawner_Seeker', 0.5),
      ],
      dist: [1],
    },
    {
      id: 'stone_room02',
      type: 'middle',
      size: [8, 8, 8],
      minPlaceOrder: 3,
      weight: 5,
      connections: [
        { pos: [0, -2, -4], type: 'dvergr', allowDoor },
        { pos: [0, -2, 4], type: 'stone', allowDoor },
        { pos: [-4, -2, 0], type: 'stone', allowDoor },
        { pos: [4, -2, 0], type: 'stone', allowDoor },
      ],
      items: [
        // GameObject/wood
        locItem('dvergrtown_wood_support', 0.5, 4),
        // enemies
        locItem('Spawner_Seeker'),
        locItem('Spawner_Seeker', 0.25),
      ],
      dist: [1],
    },
    {
      id: 'stone_room03',
      type: 'middle',
      size: [8, 8, 8],
      minPlaceOrder: 2,
      weight: 10,
      connections: [
        { pos: [0, -2, -4], type: 'dvergr', allowDoor },
        { pos: [0, -2, 4], type: 'stone', allowDoor },
        { pos: [-4, -2, 0], type: 'stone', allowDoor },
        { pos: [4, -2, 0], type: 'dvergr', allowDoor },
      ],
      items: [
        // GameObject/wood
        locItem('dvergrtown_wood_support', 0.5, 4),
        // enemies
        locItem('Spawner_Seeker'),
        locItem('Spawner_Seeker', 0.25),
      ],
      dist: [1],
    },
    {
      id: 'stone_room04',
      type: 'middle',
      size: [16, 8, 8],
      minPlaceOrder: 2,
      weight: 10,
      connections: [
        { pos: [-4, -2, -4], type: 'stone', allowDoor },
        { pos: [4, -2, 4], type: 'stone', allowDoor },
        { pos: [-8, -2, 0], type: 'stone', allowDoor },
        { pos: [8, -2, 0], type: 'stone', allowDoor },
        { pos: [4, -2, -4], type: 'stone', allowDoor },
      ],
      items: [
        locItem('dvergrtown_wood_support', 0.5, 3),
        locItem(EGGS, 0.45),
        ...TICKS,
      ],
      dist: [1],
    },
    {
      id: 'stone_turn01',
      type: 'middle',
      size: [8, 8, 16],
      weight: 1,
      connections: [
        { pos: [-4, -2, -4], type: 'dvergr', allowDoor },
        { pos: [-4, -2, 4], type: 'dvergr', allowDoor },
        { pos: [4, -2, -4], type: 'dvergr', allowDoor },
        { pos: [4, -2, 4], type: 'dvergr', allowDoor },
      ],
      items: [
        locItem('dvergrtown_wood_support', 0.5, 5),
        locItem('dvergrtown_wood_beam', 0.5, 3),
        locItem('Spawner_Seeker'),
        locItem('Spawner_Seeker', 0.66),
      ],
      dist: [1],
    },
    {
      id: 'stone_stair01',
      type: 'middle',
      size: [24, 16, 8],
      weight: 1,
      connections: [
        { pos: [-12, 2, 0], type: 'dvergr', allowDoor },
        { pos: [12, -6, 0], type: 'stone', allowDoor },
        { pos: [8, -6, -4], type: 'stone', allowDoor },
        { pos: [8, -6, 4], type: 'stone', allowDoor },
      ],
      items: [
        // wood
        locItem([
          locItem('dvergrtown_wood_support', 1, 2),
          locItem('dvergrtown_wood_pole', 1),
        ], 0.5),
        locItem('dvergrtown_wood_support', 0.5, 4),
        locItem(EGGS, 0.45),
      ],
      dist: [1],
    },
    {
      id: 'stone_open01',
      type: 'middle',
      size: [24, 16, 16],
      weight: 5,
      connections: [
        { pos: [0, 2, 8], type: 'stone', allowDoor },
        { pos: [0, 2, -8], type: 'dvergr', allowDoor },
      ],
      items: [
        // room
        locItem('dvergrprops_lantern', 0.25),
        locItem('dvergrtown_wood_support'),
        locItem('dvergrtown_wood_beam', 1, 10),
        // enemies
        locItem('Spawner_Seeker'),
        locItem('Spawner_Seeker', 0.66, 2),
        // ..
        locItem('Vegvisir_SeekerQueen', 0.2),
      ],
      dist: [1],
    },
    {
      id: 'stone_fence01',
      type: 'middle',
      size: [16, 8, 16],
      weight: 1,
      connections: [
        { pos: [-8, -2, -4], type: 'dvergr', allowDoor },
        { pos: [-8, -2, 4], type: 'dvergr', allowDoor },
        { pos: [-4, -2, 8], type: 'dvergr', allowDoor },
        { pos: [-4, -2, -8], type: 'dvergr', allowDoor },
      ],
      items: [
        // enemies
        locItem('Spawner_Seeker'),
        locItem('Spawner_Seeker', 0.66),
      ],
      dist: [1],
    },
    {
      id: 'room_open01',
      type: 'middle',
      size: [24, 16, 16],
      weight: 5,
      connections: [
        { pos: [0, 2, 8], type: 'dvergr', allowDoor },
        { pos: [0, 2, -8], type: 'dvergr', allowDoor },
      ],
      items: [
        locItem('Spawner_Seeker'),
        locItem('Spawner_Seeker', 0.66, 2),
        locItem('Vegvisir_SeekerQueen', 0.2),
      ],
      dist: [1],
    },
    {
      id: 'room_open02',
      type: 'middle',
      size: [16, 16, 16],
      weight: 2,
      connections: [
        { pos: [-8, 2, -4], type: 'dvergr', allowDoor },
        { pos: [-8, 2, 4], type: 'dvergr', allowDoor },
        { pos: [-4, 2, 8], type: 'dvergr', allowDoor },
        { pos: [-4, 2, -8], type: 'dvergr', allowDoor },
      ],
      items: [
        locItem('Spawner_Seeker'),
        locItem('Spawner_Seeker', 0.66, 2),
        locItem('Vegvisir_SeekerQueen', 0.2),
      ],
      dist: [1],
    },
    {
      id: 'room_open03',
      type: 'middle',
      size: [24, 16, 16],
      weight: 5,
      connections: [
        { pos: [0, 2, 8], type: 'dvergr', allowDoor },
        { pos: [0, 2, -8], type: 'dvergr', allowDoor },
        { pos: [-12, 2, 0], type: 'dvergr', allowDoor },
      ],
      items: [
        locItem('dvergrprops_lantern', 0.25, 3),
        locItem('Spawner_Seeker'),
        locItem('Spawner_Seeker', 0.66, 2),
        locItem('Vegvisir_SeekerQueen', 0.2),
      ],
      dist: [1],
    },
    {
      id: 'room_open04',
      type: 'middle',
      size: [16, 8, 16],
      weight: 5,
      connections: [
        { pos: [-4, -2, -8], type: 'dvergr', allowDoor },
        { pos: [-8, -2, -4], type: 'dvergr', allowDoor },
        { pos: [-8, -2, 4], type: 'dvergr', allowDoor },
        { pos: [-4, -2, 8], type: 'dvergr', allowDoor },
        { pos: [4, -2, 8], type: 'dvergr', allowDoor },
        { pos: [8, -2, 4], type: 'dvergr', allowDoor },
        { pos: [8, -2, -4], type: 'dvergr', allowDoor },
        { pos: [4, -2, -8], type: 'dvergr', allowDoor },
      ],
      items: [
        locItem('dvergrprops_lantern', 0.25, 8),
        // eggs_hanging
        locItem('CreepProp_egg_hanging01', 0.66, 12),
        // enemies
        locItem('Spawner_Seeker'),
        locItem('Spawner_Seeker', 0.66, 2),
        locItem('Spawner_SeekerBrute', 0.75),
      ],
      dist: [1],
    },
    {
      id: 'roombig_corner01',
      type: 'middle',
      size: [16, 12, 16],
      weight: 1,
      connections: [
        { pos: [-4, -2, -8], type: 'dvergr', allowDoor },
        { pos: [-8, -2, -4], type: 'dvergr', allowDoor },
        { pos: [4, -2, -8], type: 'dvergr', allowDoor },
        { pos: [-8, -2, 4], type: 'dvergr', allowDoor },
        { pos: [0, 0, 8], type: 'dvergropen', allowDoor },
        { pos: [8, 0, 0], type: 'dvergropen', allowDoor },
      ],
      items: [
        locItem('dvergrprops_lantern', 0.25, 4),
        // enemies
        locItem('Spawner_Seeker'),
        locItem('Spawner_Seeker', 0.66, 2),
        locItem('Spawner_SeekerBrute', 0.25),
        // hangingeggs
        locItem('CreepProp_egg_hanging01', 0.66, 9),
        locItem('Pickable_RoyalJelly'),
      ],
      dist: [1],
    },
    {
      id: 'roombig_side01',
      type: 'middle',
      size: [16, 12, 16],
      weight: 1,
      connections: [
        { pos: [-8, -2, -4], type: 'dvergr', allowDoor },
        { pos: [-8, -2, 4], type: 'dvergr', allowDoor },
        { pos: [8, 0, 0], type: 'dvergropen', allowDoor },
        { pos: [0, 0, 8], type: 'dvergropen', allowDoor },
        { pos: [0, 0, -8], type: 'dvergropen', allowDoor },
      ],
      items: [
        // enemies
        locItem('Spawner_Seeker'),
        locItem('Spawner_Seeker', 0.66, 2),
        locItem('Spawner_SeekerBrute'),
        // dvergrtown_gate_stair x2
        locItem('dvergrprops_lantern', 0.25, 2),
        // hangingeggs
        locItem('CreepProp_egg_hanging01', 0.66, 12),
        locItem('Pickable_RoyalJelly'),
      ],
      dist: [1],
    },
    {
      id: 'roombig_side02',
      type: 'middle',
      size: [16, 12, 16],
      weight: 1,
      connections: [
        { pos: [-8, -2, -4], type: 'dvergr', allowDoor },
        { pos: [-8, -2, 4], type: 'dvergr', allowDoor },
        { pos: [8, 0, 0], type: 'dvergropen', allowDoor },
        { pos: [0, 0, 8], type: 'dvergropen', allowDoor },
        { pos: [0, 0, -8], type: 'dvergropen', allowDoor },
      ],
      items: [
        // enemies
        locItem('Spawner_Seeker'),
        locItem('Spawner_Seeker', 0.66, 2),
        locItem('Spawner_SeekerBrute'),
        // dvergrtown_gate_stair x2
        locItem('dvergrprops_lantern', 0.25, 2),
        // hangingeggs
        locItem('CreepProp_egg_hanging01', 0.66, 12),
        locItem('Pickable_RoyalJelly'),
      ],
      dist: [1],
    },
    {
      id: 'roombig_open01',
      type: 'middle',
      size: [16, 12, 16],
      weight: 5,
      connections: [
        { pos: [8, 0, 0], type: 'dvergropen', allowDoor },
        { pos: [0, 0, 8], type: 'dvergropen', allowDoor },
        { pos: [0, 0, -8], type: 'dvergropen', allowDoor },
        { pos: [-8, 0, 0], type: 'dvergropen', allowDoor },
      ],
      items: [
        // enemies
        locItem('Spawner_Seeker'),
        locItem('Spawner_Seeker', 0.66, 2),
        locItem('Spawner_SeekerBrute'),
        // hangingeggs
        locItem('CreepProp_egg_hanging01', 0.66, 12),
        locItem('Pickable_RoyalJelly'),
      ],
      dist: [1],
    },
    {
      id: 'roombig_open02',
      type: 'middle',
      size: [16, 20, 16],
      weight: 3,
      connections: [
        { pos: [8, -4, 0], type: 'dvergropen', allowDoor },
        { pos: [0, -4, 8], type: 'dvergropen', allowDoor },
        { pos: [0, -4, -8], type: 'dvergropen', allowDoor },
        { pos: [-8, -4, 0], type: 'dvergropen', allowDoor },
        { pos: [-4, 4, -8], type: 'dvergr', allowDoor },
        { pos: [-8, 4, -4], type: 'dvergr', allowDoor },
        { pos: [-8, 4, 4], type: 'dvergr', allowDoor },
        { pos: [-4, 4, 8], type: 'dvergr', allowDoor },
        { pos: [4, 4, 8], type: 'dvergr', allowDoor },
        { pos: [8, 4, 4], type: 'dvergr', allowDoor },
        { pos: [8, 4, -4], type: 'dvergr', allowDoor },
        { pos: [4, 4, -8], type: 'dvergr', allowDoor },
      ],
      items: [
        // enemies
        locItem('Spawner_Seeker', 1, 2),
        locItem('Spawner_Seeker', 0.5, 3),
        locItem('Spawner_SeekerBrute', 0.75),
        locItem('Spawner_SeekerBrute', 0.25),
        // room x4/dvergrtown_gate_corner (1)
        locItem('dvergrprops_lantern', 0.25, 8),
        // hangingeggs
        locItem('CreepProp_egg_hanging01', 0.66, 12),
        locItem('Pickable_RoyalJelly'),
      ],
      dist: [1],
    },
    {
      id: 'roombig_corridor01',
      type: 'middle',
      size: [16, 12, 16],
      weight: 1,
      connections: [
        { pos: [-8, -2, -4], type: 'dvergr', allowDoor },
        { pos: [-8, -2, 4], type: 'dvergr', allowDoor },
        { pos: [0, 0, 8], type: 'dvergropen', allowDoor },
        { pos: [0, 0, -8], type: 'dvergropen', allowDoor },
        { pos: [8, -2, -4], type: 'dvergr', allowDoor },
        { pos: [8, -2, 4], type: 'dvergr', allowDoor },
      ],
      items: [
        // enemies
        locItem('Spawner_Seeker'),
        locItem('Spawner_Seeker', 0.66, 2),
        locItem('Spawner_SeekerBrute'),
        // dvergrtown_gate_stair x4
        locItem('dvergrprops_lantern', 0.25, 4),
        // hangingeggs
        locItem('CreepProp_egg_hanging01', 0.66, 12),
        locItem('Pickable_RoyalJelly'),
      ],
      dist: [1],
    },
    {
      id: 'roombig_corridor02',
      type: 'middle',
      size: [16, 12, 16],
      weight: 1,
      connections: [
        { pos: [-8, -2, -4], type: 'dvergr', allowDoor },
        { pos: [-8, -2, 4], type: 'dvergr', allowDoor },
        { pos: [0, 0, 8], type: 'dvergropen', allowDoor },
        { pos: [0, 0, -8], type: 'dvergropen', allowDoor },
        { pos: [8, -2, -4], type: 'dvergr', allowDoor },
        { pos: [8, -2, 4], type: 'dvergr', allowDoor },
      ],
      items: [
        // enemies
        locItem('Spawner_Seeker'),
        locItem('Spawner_Seeker', 0.66, 2),
        locItem('Spawner_SeekerBrute'),
        // dvergrtown_gate_stair x4
        locItem('dvergrprops_lantern', 0.25, 4),
        // hangingeggs
        locItem('CreepProp_egg_hanging01', 0.66, 12),
        locItem('Pickable_RoyalJelly'),
      ],
      dist: [1],
    },
    {
      id: 'roombig_windows01',
      type: 'middle',
      size: [16, 12, 16],
      weight: 1,
      connections: [
        { pos: [-8, 0, 0], type: 'dvergropen', allowDoor },
      ],
      items: [
        // enemies
        locItem('Spawner_SeekerBrute'),
        // random
        locItem([
          locItem('blackmarble_altar_crystal'),
          locItem('Pickable_BlackCoreStand', 0.66, 4),
          locItem('Spawner_SeekerBrute'),
          // enemies
          ...TICKS,
        ], 0.5),
        // hangingeggs
        locItem('CreepProp_egg_hanging01', 0.66, 6),
        locItem('Pickable_RoyalJelly'),
      ],
      dist: [1],
    },
    {
      id: 'roombig_toStone01',
      type: 'middle',
      size: [8, 12, 16],
      weight: 3,
      connections: [
        { pos: [-4, 0, 0], type: 'dvergropen', allowDoor },
        { pos: [4, -4, 4], type: 'stone', allowDoor },
        { pos: [4, -4, -4], type: 'stone', allowDoor },
      ],
      items: [
        // GameObject (1)/GameObject
        locItem('Vegvisir_SeekerQueen', 0.5 * 0.2),
        // wood
        locItem([
          locItem('dvergrtown_wood_pole', 1, 2),
          locItem('dvergrtown_wood_support'),
          // wood
          locItem([
            locItem('dvergrtown_wood_pole', 1, 2),
            locItem('dvergrtown_wood_support'),
          ], 0.66),
        ], 0.66),
        // wood (1)
        locItem([
          locItem('dvergrtown_wood_pole', 1, 2),
        ], 0.66),
        // wood (2)
        locItem([
          locItem('dvergrtown_wood_pole', 1, 2),
          locItem('dvergrtown_wood_support'),
        ], 0.66),
        // wood (3)
        locItem([
          locItem('dvergrtown_wood_support'),
        ], 0.66),
      ],
      dist: [1],
    },
    {
      id: 'roombig_toStone02',
      type: 'middle',
      size: [8, 12, 16],
      weight: 3,
      connections: [
        { pos: [-4, 0, 0], type: 'dvergropen', allowDoor },
        { pos: [4, -4, 4], type: 'stone', allowDoor },
        { pos: [4, -4, -4], type: 'stone', allowDoor },
      ],
      items: [
        // GameObject (1)/GameObject
        locItem('Vegvisir_SeekerQueen', 0.5 * 0.2),
        // wood (1)
        locItem([
          locItem('dvergrtown_wood_pole', 1, 2),
        ], 0.66),
        // wood (2)
        locItem([
          locItem('dvergrtown_wood_pole', 1, 2),
          locItem('dvergrtown_wood_support'),
        ], 0.66),
        // wood (3)
        locItem([
          locItem('dvergrtown_wood_support'),
        ], 0.66),
      ],
      dist: [1],
    },
    // roombig_endcap02: disabled
    {
      id: 'roombig_endcap02',
      type: 'end',
      size: [16, 12, 0],
      weight: 1,
      connections: [{ pos: [0, 0, 0], type: 'dvergropen', allowDoor }],
      items: [
        // random (1)
        locItem([
          locItem('blackmarble_altar_crystal'),
          locItem('Pickable_BlackCoreStand', 0.66, 2),
          // enemies
          ...TICKS,
        ], 0.3),
      ],
      dist: [1],
    },
    {
      id: 'room_TREASURE',
      type: 'middle',
      size: [8, 8, 8],
      weight: 4,
      minPlaceOrder: 2,
      connections: [
        { pos: [4, -2, 0], type: 'dvergr', allowDoor },
      ],
      items: [
        locItem('TreasureChest_dvergrtown', 0.5),
        locItem('TreasureChest_dvergrtown'),
        locItem('Pickable_DvergrMineTreasure', 0.5, 2),
        locItem('Pickable_DvergrMineTreasure', 0.33),
        locItem('Vegvisir_SeekerQueen', 0.2),
        locItem('Pickable_BlackCoreStand', 0.75, 4),
      ],
      dist: [1],
    },
    {
      id: 'room_TREASURE2',
      type: 'middle',
      size: [8, 8, 8],
      weight: 6,
      minPlaceOrder: 3,
      connections: [
        { pos: [4, -2, 0], type: 'dvergr', allowDoor },
      ],
      items: [
        // treasure
        locItem('TreasureChest_dvergrtown', 1, 2),
        locItem('Pickable_BlackCoreStand', 1, 2),
      ],
      dist: [1],
    },
    {
      id: 'room_endcap01',
      type: 'end',
      size: [8, 8, 0],
      endCapPriority: 5,
      weight: 5,
      connections: [{ pos: [0, -2, 0], type: 'dvergr', allowDoor }],
      items: [
        locItem('blackmarble_altar_crystal', 0.2),
      ],
      dist: [1],
    },
    {
      id: 'room_endcap02',
      type: 'end',
      size: [8, 8, 0],
      endCapPriority: 5,
      weight: 5,
      connections: [{ pos: [0, -2, 0], type: 'dvergr', allowDoor }],
      items: [
        locItem('Pickable_BlackCoreStand', 0.2),
      ],
      dist: [1],
    },
    {
      id: 'room_endcap03',
      type: 'end',
      size: [8, 8, 8],
      endCapPriority: 5,
      weight: 5,
      minPlaceOrder: 3,
      connections: [{ pos: [0, -2, -4], type: 'dvergr', allowDoor }],
      items: [
        locItem('dvergrprops_pickaxe', 0.5, 4),
        // GameObject/enemies
        locItem('Spawner_Tick_stared', 1, 2),
        locItem('Spawner_Tick_stared', 0.33, 2),
        // GameObject/wood
        locItem('dvergrtown_wood_support', 0.5),
        // eggs
        locItem(EGGS, 0.55),
      ],
      dist: [1],
    },
    {
      id: 'stone_endcap01',
      type: 'end',
      size: [8, 8, 0],
      endCapPriority: 5,
      weight: 5,
      connections: [{ pos: [0, -2, 0], type: 'stone', allowDoor }],
      items: [],
      dist: [1],
    },
    {
      id: 'stone_endcap02',
      type: 'end',
      size: [8, 8, 8],
      weight: 5,
      minPlaceOrder: 3,
      connections: [{ pos: [0, -2, -4], type: 'stone', allowDoor }],
      items: [
        ...TICKS,
      ],
      dist: [1],
    },
    {
      id: 'stone_endcap03',
      type: 'end',
      size: [8, 8, 8],
      weight: 5,
      minPlaceOrder: 3,
      connections: [{ pos: [0, -2, -4], type: 'stone', allowDoor }],
      items: [
        locItem('Spawner_Tick_stared', 1, 2),
        locItem('Spawner_Tick_stared', 0.33, 2),
        locItem('Vegvisir_SeekerQueen', 0.2),
      ],
      dist: [1],
    },
  ],
};
