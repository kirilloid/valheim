import { locItem } from '../../model/game';

import { DungeonRoomsConfig, Theme } from './types';

const allowDoor = true;

export const forestcrypt: DungeonRoomsConfig = {
  type: 'dungeon',
  prefix: 'forestcrypt_',
  rooms: [
    // forestcrypt_entrance: disabled
    {
      id: 'entrance_large',
      theme: Theme.ForestCrypt | Theme.ForestCryptHildir,
      type: 'start',
      size: [12, 12, 20],
      weight: 1,
      connections: [
        { pos: [0, -3.5, 10] },
        { pos: [0, 0.5, -10], entrance: true },
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
      theme: Theme.ForestCrypt | Theme.ForestCryptHildir,
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
      theme: Theme.ForestCrypt | Theme.ForestCryptHildir,
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
      theme: Theme.ForestCrypt | Theme.ForestCryptHildir,
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
      theme: Theme.ForestCrypt | Theme.ForestCryptHildir,
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
      theme: Theme.ForestCrypt | Theme.ForestCryptHildir,
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
      theme: Theme.ForestCrypt | Theme.ForestCryptHildir,
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
      theme: Theme.ForestCrypt | Theme.ForestCryptHildir,
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
      theme: Theme.ForestCrypt | Theme.ForestCryptHildir,
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
      theme: Theme.ForestCrypt,
      type: 'end',
      size: [2, 4, 2],
      weight: 1,
      endCapPriority: 1,
      connections: [{ pos: [0, -1.5, -1] }],
      items: [
        locItem('MushroomYellow', 0.2, 5),
      ],
      dist: [0.003, 0.009, 0.026, 0.055, 0.112, 0.154, 0.157, 0.146, 0.125, 0.079, 0.048, 0.03, 0.022, 0.013, 0.01, 0.005, 0.004, 0.001, 0.001],
    },
    {
      id: 'EndCap2_hildir',
      theme: Theme.ForestCryptHildir,
      type: 'end',
      size: [2, 4, 2],
      weight: 1,
      endCapPriority: 1,
      connections: [{ pos: [0, -1.5, -1] }],
      items: [
        locItem('MushroomYellow', 0.2, 5),
        locItem('Spawner_Skeleton_hildir'),
      ],
      dist: [0.003, 0.009, 0.026, 0.055, 0.112, 0.154, 0.157, 0.146, 0.125, 0.079, 0.048, 0.03, 0.022, 0.013, 0.01, 0.005, 0.004, 0.001, 0.001],
    },
    {
      id: 'EndCap3',
      theme: Theme.ForestCrypt | Theme.ForestCryptHildir,
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
      id: 'EndCap3_hildir',
      theme: Theme.ForestCryptHildir,
      type: 'end',
      size: [2, 4, 2],
      weight: 1,
      endCapPriority: 1,
      connections: [{ pos: [0, -1.5, -1] }],
      items: [
        locItem('crypt_skeleton_chest'),
        locItem('Spawner_Skeleton_hildir'),
        locItem('CastleKit_groundtorch', 0.8),
      ],
      dist: [0.001, 0.006, 0.029, 0.048, 0.114, 0.124, 0.155, 0.142, 0.115, 0.093, 0.073, 0.04, 0.028, 0.012, 0.007, 0.008, 0.002, 0.002, 0, 0.001],
    },
    {
      id: 'room_16',
      theme: Theme.ForestCrypt | Theme.ForestCryptHildir,
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
      theme: Theme.ForestCrypt | Theme.ForestCryptHildir,
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
      theme: Theme.ForestCrypt,
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
      theme: Theme.ForestCrypt,
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
      theme: Theme.ForestCrypt,
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
      theme: Theme.ForestCrypt,
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
      theme: Theme.ForestCrypt,
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
    {
      id: 'chamber_hildir',
      theme: Theme.ForestCryptHildir,
      type: 'middle',
      size: [20, 12, 20],
      minPlaceOrder: 3,
      weight: 10,
      connections: [
        { pos: [-10, -4, 0], allowDoor },
        { pos: [-5, -4, 0], allowDoor },
      ],
      items: [
        // Props
        locItem('MushroomYellow', 0.2, 10),
        // Treasure / Loot
        locItem('Pickable_ForestCryptRandom', 0.5, 9),
        // chests
        locItem('crypt_skeleton_chest', 1, 3),
        locItem('CastleKit_groundtorch', 1, 3),
        locItem('CastleKit_groundtorch', 0.66, 3),
        locItem('CastleKit_groundtorch', 0.8, 2),
        locItem('Spawner_Skeleton_hildir'),
      ],
      dist: [0, 1],
    },
  ],
};

