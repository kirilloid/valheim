import { DungeonRoomsConfig, RoomConfig, Theme } from './types';

import { locItem } from '../../model/game';

const BATS = [
  locItem('Spawner_Bat', 1, 2),
  locItem('Spawner_Bat', 0.75),
  locItem('Spawner_Bat', 0.5, 2),
];

const allowDoor = true;

const rooms: RoomConfig[] = [
  {
    id: 'shrine_lootencap06',
    theme: Theme.Cave | Theme.CaveHildir,
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
    theme: Theme.Cave | Theme.CaveHildir,
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
    theme: Theme.Cave | Theme.CaveHildir,
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
    theme: Theme.Cave | Theme.CaveHildir,
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
    theme: Theme.Cave | Theme.CaveHildir,
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
    theme: Theme.Cave | Theme.CaveHildir,
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
    theme: Theme.Cave | Theme.CaveHildir,
    type: 'end',
    size: [0, 12, 12],
    weight: 1,
    endCapPriority: 1,
    connections: [{ pos: [0, -4, 0] }],
    items: [
      locItem([ // wall
        locItem('CastleKit_metal_groundtorch_unlit', 1, 2),
        locItem('CastleKit_groundtorch_blue', 1, 2),
      ], 0.66),
      locItem('Pickable_MountainCaveRandom'),
      locItem('cloth_hanging_door'),
    ],
    dist: [0],
  },
  {
    id: 'shrine_endcap_noshrine02',
    theme: Theme.Cave | Theme.CaveHildir,
    type: 'end',
    size: [0, 12, 12],
    weight: 1,
    endCapPriority: 1,
    connections: [{ pos: [0, -4, 0] }],
    items: [
      locItem([ // wall
        locItem('TreasureChest_mountaincave'),
        locItem('CastleKit_metal_groundtorch_unlit', 1, 2),
        locItem('CastleKit_groundtorch_blue', 1, 2),
      ], 0.66),
    ],
    dist: [0],
  },
  {
    id: 'shrine_endcap01',
    theme: Theme.Cave | Theme.CaveHildir,
    type: 'end',
    size: [0, 6, 6],
    weight: 1,
    endCapPriority: 1,
    connections: [{ pos: [0, -2.5, 0], type: 'shrine' }],
    items: [
      locItem('lox_ribs', 0.5, 2),
      locItem('Pickable_MeatPile', 0.66, 3),
    ],
    dist: [0],
  },
  {
    id: 'shrine_endcap02',
    theme: Theme.Cave | Theme.CaveHildir,
    type: 'end',
    size: [0, 6, 6],
    weight: 1,
    endCapPriority: 1,
    connections: [{ pos: [0, -2.5, 0], type: 'shrine' }],
    items: [
      locItem('Pickable_ForestCryptRemains01', 0.33),
      locItem('Pickable_ForestCryptRemains02', 0.33),
      locItem('Pickable_ForestCryptRemains03', 0.33),
      locItem('fenrirhide_hanging', 0.5),
    ],
    dist: [0],
  },
  {
    id: 'shrine_endcap03',
    theme: Theme.Cave | Theme.CaveHildir,
    type: 'end',
    size: [0, 6, 6],
    weight: 1,
    endCapPriority: 1,
    connections: [{ pos: [0, -2.5, 0], type: 'shrine' }],
    items: [
      locItem('fenrirhide_hanging', 0.5),
      locItem('mountainkit_chair', 0.5, 3),
      locItem('Fenring_Cultist_Hildir'),
    ],
    dist: [0],
  },
  {
    id: 'shrine_endcap04',
    theme: Theme.Cave | Theme.CaveHildir,
    type: 'end',
    size: [0, 6, 6],
    weight: 1,
    endCapPriority: 1,
    connections: [{ pos: [0, -2.5, 0], type: 'shrine' }],
    items: [
      locItem('lox_ribs', 0.5, 2),
      locItem('Pickable_MeatPile', 0.66, 3),
      locItem('Fenring_Cultist_Hildir'),
    ],
    dist: [0],
  },
  {
    id: 'shrine_endcap05',
    theme: Theme.Cave | Theme.CaveHildir,
    type: 'end',
    size: [0, 6, 6],
    weight: 0.5,
    endCapPriority: 1,
    connections: [{ pos: [0, -2.5, 0], type: 'shrine' }],
    items: [
      locItem([ // wall
        locItem('TreasureChest_mountaincave'),
        locItem('CastleKit_metal_groundtorch_unlit', 0.75, 2),
        locItem('CastleKit_groundtorch_blue', 0.75, 2),
      ], 0.66),
      locItem('Fenring_Cultist_Hildir'),
    ],
    dist: [0],
  },
  {
    id: 'shrine_endcap',
    theme: Theme.Cave | Theme.CaveHildir,
    type: 'end',
    size: [0, 6, 6],
    weight: 1,
    endCapPriority: 1,
    connections: [{ pos: [0, -2.5, 0], type: 'shrine' }],
    items: [
      locItem('Fenring_Cultist_Hildir'),
    ],
    dist: [0],
  },
  {
    id: 'new_deeproom_bottom_shrine',
    theme: Theme.Cave | Theme.CaveHildir,
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
      locItem('MountainKit_brazier_blue', 0.66, 5),
      locItem('cloth_hanging_door_double', 0.66, 2),
      locItem('Spawner_Ulv', 0.5, 4),
    ],
    dist: [0],
  },
  {
    id: 'shrine_hole01',
    theme: Theme.Cave | Theme.CaveHildir,
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
    items: [
      // braziers x2
      locItem('MountainKit_brazier', 0.66, 6),
      locItem('MountainKit_brazier_blue', 0.66, 6),
      locItem([locItem('Pickable_ForestCryptRemains02', 0.33)], 0.5),
      locItem([
        locItem('Pickable_ForestCryptRemains01', 0.33),
        locItem('Pickable_ForestCryptRemains02', 0.33),
        locItem('Pickable_ForestCryptRemains03', 0.33),
        locItem('Pickable_MeatPile', 0.66),
        locItem('Ulv', 0.5, 3),
      ], 0.5),
    ],
    dist: [0],
  },
  {
    id: 'shrine_room01',
    theme: Theme.Cave | Theme.CaveHildir,
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
    items: [
      // braziers
      locItem('MountainKit_brazier', 0.66, 4),
      locItem('MountainKit_brazier_blue', 0.66, 4),
      locItem([ // dirtcorner x4
        locItem('Pickable_ForestCryptRemains01', 0.33),
        locItem('Pickable_ForestCryptRemains02', 0.33),
        locItem('Pickable_ForestCryptRemains03', 0.33),
        locItem('Pickable_MeatPile', 0.66),
      ], 0.5, 4),
      locItem([ // chairs
        locItem('mountainkit_chair', 0.5, 7),
        locItem('mountainkit_table'),
      ], 0.75),
      locItem('Ulv', 1, 2),
      locItem('Ulv', 0.5, 6),
    ],
    dist: [0],
  },
  {
    id: 'shrine_room02',
    theme: Theme.Cave | Theme.CaveHildir,
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
    items: [
      // braziers
      locItem('MountainKit_brazier', 0.66, 4),
      locItem('MountainKit_brazier_blue', 0.66, 4),
      // dirtcenter
      locItem('Pickable_MeatPile', 0.66, 3),
      locItem('lox_ribs', 1, 2),
      locItem([ // dirtcorner x4
        locItem('Pickable_ForestCryptRemains01', 0.33),
        locItem('Pickable_ForestCryptRemains02', 0.33),
        locItem('Pickable_ForestCryptRemains03', 0.33),
        locItem('Pickable_MeatPile', 0.66),
      ], 0.5, 4),
      // EnemiesRoom
      locItem('Ulv', 1, 2),
      locItem('Ulv', 0.5, 6),
    ],
    dist: [0],
  },
  {
    id: 'shrine_shrine03_HILDIR',
    theme: Theme.CaveHildir,
    type: 'middle',
    size: [12, 9, 20],
    minPlaceOrder: 3,
    weight: 300,
    connections: [
      { pos: [6, -1, -4], type: 'shrine', allowDoor },
      { pos: [-6, -1, -4], type: 'shrine', allowDoor },
      { pos: [0, -1, -10], type: 'shrine', allowDoor },
    ],
    items: [
      // braziers
      locItem('MountainKit_brazier_blue', 1, 6),
      // loot
      locItem('hanger', 1, 2),
      locItem([ // dirtcenter x4
        locItem('Pickable_ForestCryptRemains01', 0.33),
        locItem('Pickable_ForestCryptRemains02', 0.33), // minus one 02
        locItem('Pickable_ForestCryptRemains03', 0.33),
      ], 0.5, 4),
      locItem('Fenring_Cultist_Hildir'),
      locItem('Pickable_MeatPile', 0.66, 2),
    ],
    dist: [0],
  },
  {
    id: 'shrine_shrine03',
    theme: Theme.Cave,
    type: 'middle',
    size: [12, 9, 20],
    minPlaceOrder: 3,
    weight: 600,
    connections: [
      { pos: [6, -1, -4], type: 'shrine', allowDoor },
      { pos: [-6, -1, -4], type: 'shrine', allowDoor },
      { pos: [0, -1, -10], type: 'shrine', allowDoor },
    ],
    items: [
      // braziers
      locItem('MountainKit_brazier', 0.66, 4),
      locItem('MountainKit_brazier_blue', 0.66, 4),
      // loot
      locItem('hanger', 1, 2),
      // SacredPillar x4
      locItem('Pickable_MountainCaveRandom', 1, 4),
      // EnemiesShrine
      locItem('Fenring_Cultist', 1, 1),
      locItem('Fenring_Cultist', 0.5, 2),
      locItem('Fenring_Cultist_Hildir'),
      locItem([ // dirtcenter x4
        locItem('Pickable_ForestCryptRemains01', 0.33),
        locItem('Pickable_ForestCryptRemains02', 0.33),
        locItem('Pickable_ForestCryptRemains03', 0.33),
      ], 0.5, 4),
      locItem('Pickable_MeatPile', 0.66, 6),
      locItem('WolfStatue'),
    ],
    dist: [0],
  },
  {
    id: 'shrine_shrine02',
    theme: Theme.Cave,
    type: 'middle',
    size: [12, 9, 20],
    minPlaceOrder: 3,
    weight: 600,
    connections: [{ pos: [0, -1, -10], type: 'shrine', allowDoor }],
    items: [
      // braziers
      locItem('MountainKit_brazier', 1, 2),
      locItem('MountainKit_brazier_blue', 1, 2),
      // loot
      locItem('hanger', 1, 2),
      // SacredPillar x4
      locItem('Pickable_MountainCaveRandom', 1, 4),
      // EnemiesShrine
      locItem('Fenring_Cultist', 1, 1),
      locItem('Fenring_Cultist', 0.5, 2),
      locItem('Fenring_Cultist_Hildir'),
      locItem([ // dirtcenter x4
        locItem('Pickable_ForestCryptRemains01', 0.33),
        locItem('Pickable_ForestCryptRemains02', 0.33),
        locItem('Pickable_ForestCryptRemains03', 0.33),
      ], 0.5, 4),
      locItem('Pickable_MeatPile', 0.66, 6),
      locItem('WolfStatue'),
    ],
    dist: [0],
  },
  {
    id: 'shrine_shrine01',
    theme: Theme.Cave,
    type: 'middle',
    size: [12, 9, 12],
    minPlaceOrder: 3,
    weight: 600,
    connections: [{ pos: [0, -1, -6], type: 'shrine', allowDoor }],
    items: [
      // braziers
      locItem('MountainKit_brazier', 1, 2),
      locItem('MountainKit_brazier_blue', 1, 2),
      // loot
      locItem('hanger', 1, 2),
      // SacredPillar x2
      locItem('Pickable_MountainCaveRandom', 1, 2),
      // EnemiesShrine
      locItem('Fenring_Cultist'),
      locItem('Fenring_Cultist', 0.5),
      locItem('Fenring_Cultist_Hildir'),
      locItem([ // dirtcenter x2
        locItem('Pickable_ForestCryptRemains01', 0.33),
        locItem('Pickable_ForestCryptRemains02', 0.33),
        locItem('Pickable_ForestCryptRemains03', 0.33),
      ], 0.5, 2),
      locItem('Pickable_MeatPile', 0.66, 3),
      locItem('WolfStatue'),
    ],
    dist: [0],
  },
  {
    id: 'shrine_corridor07',
    theme: Theme.Cave | Theme.CaveHildir,
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
    theme: Theme.Cave | Theme.CaveHildir,
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
      locItem('MountainKit_brazier', 1, 2),
      locItem('MountainKit_brazier_blue', 1, 2),
      locItem('Spawner_Ulv', 0.66, 3),
    ],
    dist: [0],
  },
  {
    id: 'shrine_corridor05',
    theme: Theme.Cave | Theme.CaveHildir,
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
    theme: Theme.Cave | Theme.CaveHildir,
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
    theme: Theme.Cave | Theme.CaveHildir,
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
    theme: Theme.Cave | Theme.CaveHildir,
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
      locItem('Spawner_Ulv', 0.66, 2),
    ],
    dist: [0],
  },
  {
    id: 'shrine_corridor01',
    theme: Theme.Cave | Theme.CaveHildir,
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
    theme: Theme.Cave | Theme.CaveHildir,
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
    theme: Theme.Cave | Theme.CaveHildir,
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
    theme: Theme.Cave | Theme.CaveHildir,
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
    theme: Theme.Cave | Theme.CaveHildir,
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
    theme: Theme.Cave | Theme.CaveHildir,
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
    theme: Theme.Cave | Theme.CaveHildir,
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
    theme: Theme.Cave | Theme.CaveHildir,
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
    theme: Theme.Cave | Theme.CaveHildir,
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
    theme: Theme.Cave | Theme.CaveHildir,
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
    theme: Theme.Cave | Theme.CaveHildir,
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
    theme: Theme.Cave | Theme.CaveHildir,
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
    theme: Theme.Cave | Theme.CaveHildir,
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
      locItem('Pickable_MountainCaveCrystal', 0.33, 6),
    ],
    dist: [0],
  },
  {
    id: 'new_sloperoom04',
    theme: Theme.Cave | Theme.CaveHildir,
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
      locItem('Pickable_MountainCaveCrystal', 0.33, 3),
    ],
    dist: [0],
  },
  {
    id: 'new_sloperoom03',
    theme: Theme.Cave | Theme.CaveHildir,
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
    theme: Theme.Cave | Theme.CaveHildir,
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
      locItem([ // narrow
        locItem('Pickable_MountainCaveCrystal', 0.33, 3),
      ], 0.25),
      locItem('Pickable_MountainCaveCrystal', 0.33, 3),
      // EnemiesRoom
      locItem('Spawner_Ulv', 0.5, 3),
    ],
    dist: [0],
  },
  {
    id: 'new_sloperoom01',
    theme: Theme.Cave | Theme.CaveHildir,
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
    theme: Theme.Cave | Theme.CaveHildir,
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
    theme: Theme.Cave | Theme.CaveHildir,
    type: 'end',
    size: [0, 12, 12],
    minPlaceOrder: 1,
    endCapPriority: 1,
    weight: 0.5,
    connections: [{ pos: [0, -3, 0], type: 'slope' }],
    items: [
      locItem([ // ice
        locItem('caverock_ice_stalagmite', 0.5),
        locItem('caverock_ice_stalagtite'),
      ], 0.66, 9),
    ],
    dist: [0],
  },
  {
    id: 'new_iceendcap02_crystal',
    theme: Theme.Cave | Theme.CaveHildir, // ???
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
    theme: Theme.Cave | Theme.CaveHildir,
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
    theme: Theme.Cave | Theme.CaveHildir,
    type: 'end',
    size: [0, 12, 12],
    endCapPriority: 1,
    weight: 1,
    connections: [{ pos: [0, -3, 0], type: 'ice' }],
    items: [
      locItem('caverock_ice_pillar_wall', 0.2),
      locItem([ // ice
        locItem('caverock_ice_stalagmite', 0.5),
        locItem('caverock_ice_stalagtite'),
      ], 0.66, 8),
      locItem('RuneStone_Cavepainting4', 0.5),
      locItem('Fenring_Cultist_Hildir'),
    ],
    dist: [0],
  },
  {
    id: 'new_iceendcap_painting03',
    theme: Theme.Cave | Theme.CaveHildir,
    type: 'end',
    size: [0, 12, 12],
    endCapPriority: 1,
    weight: 1,
    connections: [{ pos: [0, -3, 0], type: 'ice' }],
    items: [
      locItem('caverock_ice_pillar_wall', 0.2),
      locItem([ // ice
        locItem('caverock_ice_stalagmite', 0.5),
        locItem('caverock_ice_stalagtite'),
      ], 0.66, 8),
      locItem('RuneStone_Cavepainting3', 0.5),
      locItem('Fenring_Cultist_Hildir'),
    ],
    dist: [0],
  },
  {
    id: 'new_iceendcap_painting02',
    theme: Theme.Cave | Theme.CaveHildir,
    type: 'end',
    size: [0, 12, 12],
    endCapPriority: 1,
    weight: 1,
    connections: [{ pos: [0, -3, 0], type: 'ice' }],
    items: [
      locItem('caverock_ice_pillar_wall', 0.2),
      locItem([ // ice
        locItem('caverock_ice_stalagmite', 0.5),
        locItem('caverock_ice_stalagtite'),
      ], 0.66, 8),
      locItem('RuneStone_Cavepainting2', 0.5),
      locItem('Fenring_Cultist_Hildir'),
    ],
    dist: [0],
  },
  {
    id: 'new_iceendcap_painting01',
    theme: Theme.Cave | Theme.CaveHildir,
    type: 'end',
    size: [0, 12, 12],
    endCapPriority: 1,
    weight: 1,
    connections: [{ pos: [0, -3, 0], type: 'ice' }],
    items: [
      locItem('caverock_ice_pillar_wall', 0.2),
      locItem([ // ice
        locItem('caverock_ice_stalagmite', 0.5),
        locItem('caverock_ice_stalagtite'),
      ], 0.66, 8),
      locItem('RuneStone_Cavepainting1', 0.5),
      locItem('Fenring_Cultist_Hildir'),
    ],
    dist: [0],
  },
  {
    id: 'new_iceendcap_moderstone',
    theme: Theme.Cave | Theme.CaveHildir,
    type: 'end',
    size: [0, 12, 12],
    endCapPriority: 1,
    weight: 0.5,
    connections: [{ pos: [0, -3, 0] }],
    items: [
      locItem([ // ice
        locItem('caverock_ice_stalagmite', 0.5),
        locItem('caverock_ice_stalagtite'),
      ], 0.66, 8),
      locItem('Vegvisir_DragonQueen', 0.25),
      locItem('Fenring_Cultist_Hildir'),
    ],
    dist: [0],
  },
  {
    id: 'new_icecorridor07',
    theme: Theme.Cave | Theme.CaveHildir,
    type: 'middle',
    size: [12, 12, 12],
    weight: 10,
    connections: [
      { pos: [6, -3, 0], type: 'ice', allowDoor },
      { pos: [-6, -3, 0], type: 'ice', allowDoor },
    ],
    items: [
      locItem([locItem('caverock_ice_stalagtite', 1, 2)], 0.66, 2),
      locItem([locItem('caverock_ice_stalagtite')], 0.66, 3),
      // crystals
      locItem([locItem('Pickable_MountainCaveCrystal', 0.8, 4)], 0.5),
    ],
    dist: [0],
  },
  {
    id: 'new_icecorridor06',
    theme: Theme.Cave | Theme.CaveHildir,
    type: 'middle',
    size: [12, 12, 12],
    weight: 5,
    connections: [
      { pos: [6, -3, 0], type: 'ice', allowDoor },
      { pos: [-6, -3, 0], type: 'ice', allowDoor },
    ],
    items: [
      locItem([ // extraroof
        locItem('Pickable_MountainCaveCrystal', 0.75 * 0.5),
        locItem('Pickable_MountainCaveCrystal', 0.75 * 0.5 * 0.5),
      ], 0.5),
    ],
    dist: [0],
  },
  {
    id: 'new_icecorridor05',
    theme: Theme.Cave | Theme.CaveHildir,
    type: 'middle',
    size: [12, 12, 12],
    weight: 10,
    connections: [
      { pos: [6, -3, 0], type: 'ice', allowDoor },
      { pos: [-6, -3, 0], type: 'ice', allowDoor },
      { pos: [0, -3, -6], type: 'ice', allowDoor },
    ],
    items: [
      locItem([ // icegroup x3
        locItem('caverock_ice_stalagmite', 0.5),
        locItem('caverock_ice_stalagtite'),
      ], 0.66, 15),
      locItem([ // treasure
        locItem('Spawner_Ulv', 0.5, 4),
      ], 0.25),
      // ..
      locItem('Pickable_MountainCaveCrystal', 0.25),
    ],
    dist: [0],
  },
  {
    id: 'new_icecorridor04',
    theme: Theme.Cave | Theme.CaveHildir,
    type: 'middle',
    size: [12, 12, 12],
    weight: 5,
    connections: [
      { pos: [6, -3, 0], type: 'ice', allowDoor },
      { pos: [-6, -3, 0], type: 'ice', allowDoor },
    ],
    items: [
      locItem('Pickable_MountainCaveCrystal', 0.25),
    ],
    dist: [0],
  },
  {
    id: 'new_icecorridor03',
    theme: Theme.Cave | Theme.CaveHildir,
    type: 'middle',
    size: [12, 12, 12],
    weight: 5,
    connections: [
      { pos: [6, -3, 0], type: 'ice', allowDoor },
      { pos: [-6, -3, 0], type: 'ice', allowDoor },
    ],
    items: [
      locItem([ // icegroup x2
        locItem('caverock_ice_stalagmite', 0.5),
        locItem('caverock_ice_stalagtite'),
      ], 0.66, 11),
      // GameObject
      locItem('Pickable_MountainCaveCrystal', 0.5 * 0.5)
    ],
    dist: [0],
  },
  {
    id: 'new_icecorridor02',
    theme: Theme.Cave | Theme.CaveHildir,
    type: 'middle',
    size: [12, 12, 12],
    weight: 5,
    connections: [
      { pos: [6, -3, 0], type: 'ice', allowDoor },
      { pos: [-6, -3, 0], type: 'ice', allowDoor },
    ],
    items: [
      locItem([ // icegroup x5
        locItem('caverock_ice_stalagmite', 0.5),
        locItem('caverock_ice_stalagtite'),
      ], 0.66, 26),
      // treasure
      locItem([
        locItem('Spawner_Ulv', 0.5, 4),
      ], 0.25),
    ],
    dist: [0],
  },
  {
    id: 'new_icecorridor01',
    theme: Theme.Cave | Theme.CaveHildir,
    type: 'middle',
    size: [12, 12, 12],
    weight: 5,
    connections: [
      { pos: [6, -2, 0], allowDoor },
      { pos: [-6, -4.75, 0], type: 'ice', allowDoor },
    ],
    items: [
      locItem([ // icegroup x3
        locItem('caverock_ice_stalagmite', 0.5),
        locItem('caverock_ice_stalagtite'),
      ], 0.66, 14),
      locItem('Pickable_MountainCaveCrystal', 0.25, 2),
    ],
    dist: [0],
  },
  {
    id: 'new_endcap02_crystal',
    theme: Theme.Cave | Theme.CaveHildir,
    type: 'end',
    size: [0, 12, 12],
    endCapPriority: 1,
    minPlaceOrder: 1,
    weight: 3,
    connections: [{ pos: [0, -3, 0] }],
    items: [
      // crystals
      locItem('Pickable_MountainCaveCrystal', 0.8, 4),
      locItem('Fenring_Cultist_Hildir'),
    ],
    dist: [0],
  },
  {
    id: 'new_endcap02',
    theme: Theme.Cave | Theme.CaveHildir,
    type: 'end',
    size: [0, 12, 12],
    endCapPriority: 1,
    minPlaceOrder: 1,
    weight: 3,
    connections: [{ pos: [0, -3, 0] }],
    items: [
      locItem('Fenring_Cultist_Hildir'),
    ],
    dist: [0],
  },
  {
    id: 'new_endcap_painting_04',
    theme: Theme.Cave | Theme.CaveHildir,
    type: 'end',
    size: [0, 12, 12],
    endCapPriority: 1,
    weight: 1,
    connections: [{ pos: [0, -3, 0] }],
    items: [
      locItem([
        locItem('caverock_ice_stalagmite', 0.5),
        locItem('caverock_ice_stalagtite'),
      ], 0.66, 8),
      locItem('RuneStone_Cavepainting4'),
      locItem('Fenring_Cultist_Hildir'),
    ],
    dist: [0],
  },
  {
    id: 'new_endcap_painting_03',
    theme: Theme.Cave | Theme.CaveHildir,
    type: 'end',
    size: [0, 12, 12],
    endCapPriority: 1,
    weight: 1,
    connections: [{ pos: [0, -3, 0] }],
    items: [
      locItem([
        locItem('caverock_ice_stalagmite', 0.5),
        locItem('caverock_ice_stalagtite'),
      ], 0.66, 8),
      locItem('RuneStone_Cavepainting3'),
      locItem('Fenring_Cultist_Hildir'),
    ],
    dist: [0],
  },
  {
    id: 'new_endcap_painting_02',
    theme: Theme.Cave | Theme.CaveHildir,
    type: 'end',
    size: [0, 12, 12],
    endCapPriority: 1,
    weight: 1,
    connections: [{ pos: [0, -3, 0] }],
    items: [
      locItem([
        locItem('caverock_ice_stalagmite', 0.5),
        locItem('caverock_ice_stalagtite'),
      ], 0.66, 8),
      locItem('RuneStone_Cavepainting2'),
      locItem('Fenring_Cultist_Hildir'),
    ],
    dist: [0],
  },
  {
    id: 'new_endcap_painting_01',
    theme: Theme.Cave | Theme.CaveHildir,
    type: 'end',
    size: [0, 12, 12],
    endCapPriority: 1,
    weight: 1,
    connections: [{ pos: [0, -3, 0] }],
    items: [
      locItem([
        locItem('caverock_ice_stalagmite', 0.5),
        locItem('caverock_ice_stalagtite'),
      ], 0.66, 8),
      locItem('RuneStone_Cavepainting1'),
      locItem('Fenring_Cultist_Hildir'),
    ],
    dist: [0],
  },
  {
    id: 'new_endcap_moderstone',
    theme: Theme.Cave | Theme.CaveHildir,
    type: 'end',
    size: [0, 12, 12],
    endCapPriority: 1,
    weight: 0.5,
    connections: [{ pos: [0, -3, 0] }],
    items: [
      locItem([
        locItem('caverock_ice_stalagmite', 0.5),
        locItem('caverock_ice_stalagtite'),
      ], 0.66, 8),
      locItem('Vegvisir_DragonQueen', 0.25),
      locItem('Fenring_Cultist_Hildir'),
    ],
    dist: [0],
  },
  {
    id: 'new_corridor09',
    theme: Theme.Cave | Theme.CaveHildir,
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
    theme: Theme.Cave | Theme.CaveHildir,
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
    theme: Theme.Cave | Theme.CaveHildir,
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
    theme: Theme.Cave | Theme.CaveHildir,
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
    theme: Theme.Cave | Theme.CaveHildir,
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
    theme: Theme.Cave | Theme.CaveHildir,
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
    theme: Theme.Cave | Theme.CaveHildir,
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
    theme: Theme.Cave | Theme.CaveHildir,
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
    id: 'new_crossroads01_hole_shrine',
    theme: Theme.Cave | Theme.CaveHildir,
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
    id: 'new_crossroads01_hole_long',
    theme: Theme.Cave | Theme.CaveHildir,
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
    id: 'new_crossroads01_hole_ice',
    theme: Theme.Cave | Theme.CaveHildir,
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
    id: 'new_crossroads01',
    theme: Theme.Cave | Theme.CaveHildir,
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
    id: 'new_crossroads01_ice',
    theme: Theme.Cave | Theme.CaveHildir,
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
    id: 'new_crossroads03',
    theme: Theme.Cave | Theme.CaveHildir,
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
    theme: Theme.Cave | Theme.CaveHildir,
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
    theme: Theme.Cave | Theme.CaveHildir,
    type: 'start',
    size: [24, 18, 12],
    weight: 1,
    connections: [
      { pos: [-12, -3, 0], allowDoor },
      { pos: [-6, -3, 6], allowDoor },
      { pos: [-6, -3, -6], allowDoor },
      { pos: [12, 0, 0], entrance: true },
    ],
    items: [
      locItem('Pickable_MountainCaveCrystal', 0.25, 2),
    ],
    dist: [0],
  },
  /*{
    id: 'divider',
    theme: Theme.Cave | Theme.CaveHildir,
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
    theme: Theme.Cave | Theme.CaveHildir,
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
    theme: Theme.Cave,
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
    theme: Theme.Cave,
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
    theme: Theme.Cave,
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
    theme: Theme.Cave,
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
    theme: Theme.Cave,
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
    theme: Theme.Cave,
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
    theme: Theme.Cave,
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
    theme: Theme.Cave,
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
    theme: Theme.Cave,
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
];
export const frostCaves: DungeonRoomsConfig = {
  type: 'dungeon',
  prefix: 'cave_',
  rooms: rooms.filter(r => r.theme & Theme.Cave),
};

export const hildirCaves: DungeonRoomsConfig = {
  type: 'dungeon',
  prefix: 'cave_',
  rooms: rooms.filter(r => r.theme & Theme.CaveHildir),
}
