import { locItem } from '../../model/game';

import { DungeonRoomsConfig, Theme } from './types';

// Morkhalla_Floor_20_broken -> random BlobMorkBig
// ? Morkhalla_Floor_20_broken2 -> random Morkhalla_Floor_RandomHole x4

const Morkhalla_Stairs_12 = locItem([
  locItem('Morkhalla_RandomEye'),
  locItem('Morkhalla_RandomLoot'),
  locItem('BlobMorkBig', 0.2),
]);

const fire = locItem([
  locItem('Morkhalla_firepit'),
  locItem('Morkhalla_Stool', 1, 2),
  locItem('Morkhalla_Bench'),
  locItem('Spawner_JotunWitch'),
  locItem('Spawner_JotunWarrior'),
], 0.5);

const Morkhalla_Wall_20 = locItem('Morkhalla_RandomWallDeco', 1, 2);
const Morkhalla_Floor_20_broken = locItem('BlobMorkBig', 0.33 * 0.66);
const Morkhalla_Floor_20_broken2 = locItem('Morkhalla_Floor_RandomHole', 1, 4);
const Morkhalla_Floor_20_broken3 = locItem('Morkhalla_Floor_RandomHole', 1, 2);

export const morkhalla: DungeonRoomsConfig = {
  type: 'dungeon',
  prefix: 'morkhalla_',
  rooms: [
    {
      id: 'endcap01',
      theme: Theme.Morkhalla,
      type: 'end',
      size: [60, 20, 60],
      weight: 1,
      connections: [
        { pos: [20, 10, -20], type: 'stair' },
      ],
      items: [
        // in rooms
        locItem('Morkhalla_firepit', 1, 2),
        // room (5)
        locItem('Morkhalla_firepit', 0.75, 4),
        locItem('Morkhalla_coal_pile_memorial', 1, 4),
        locItem('JotunWitch', 1),
        locItem('JotunWitch', 0.5),
        locItem('JotunWarrior', 1),
        locItem('JotunWarrior', 0.5),
        locItem('JotunWarrior', 0.25),
        locItem('JotunWarriorDualWield', 1),
        locItem('JotunWarriorDualWield', 0.5),
        locItem('JotunWarriorDualWield', 0.25),
        // spawn1
        locItem([
          locItem('JotunWarrior'),
          locItem('JotunWitch', 0.5),
          locItem('JotunWarriorDualWield', 0.5),
          locItem('TreasureChest_morkhalla'),
        ], 0.5),
        // spawn2
        locItem([
          locItem('JotunWarrior'),
          locItem('JotunWitch', 0.5),
          locItem('JotunWarriorDualWield', 0.5),
          locItem('TreasureChest_morkhalla', 1, 2),
        ], 0.5),
        // spawn3
        locItem([
          locItem('JotunWarrior', 1, 2),
          locItem('JotunWarrior', 0.5, 2),
          locItem('TreasureChest_morkhalla'),
          locItem('TreasureChest_morkhalla', 0.5),
        ], 0.5),
        // spawn4
        locItem([
          locItem('JotunWarrior'),
          locItem('JotunWitch', 0.5),
          locItem('JotunWarriorDualWield', 0.5),
          locItem('TreasureChest_morkhalla'),
        ], 0.5),
        locItem('TreasureChest_morkhalla', 0.5),
        locItem('BlackIce_Start'),
        locItem('Vegvisir_DNBoss'),
      ],
      dist: [0.5, 0.5],
    },
    {
      id: 'endcap02',
      theme: Theme.Morkhalla,
      type: 'end',
      size: [60, 20, 60],
      weight: 1,
      connections: [
        { pos: [20, 10, 20], type: 'stair2' },
      ],
      items: [
        // room
        locItem('Morkhalla_WeaponStand', 0.5, 5),
        // room (1)
        locItem('Morkhalla_Trainingdummy1', 0.5, 5), 
        locItem('Morkhalla_Trainingdummy2', 0.5, 5), 
        // room (4)
        locItem('Morkhalla_WeaponStand', 0.5, 5),
        // room (5)
        locItem('Morkhalla_Trainingdummy1', 0.5, 5), // dummies
        locItem('Morkhalla_Trainingdummy1'), 
        locItem('Morkhalla_Trainingdummy2', 0.5, 4), 
        locItem('Morkhalla_firepit', 0.75, 4), // furniture
        locItem('Morkhalla_Table', 0.75, 6),
        locItem('Morkhalla_Bench', 0.75, 8),
        locItem('Morkhalla_Stool', 0.75, 8),
        // GameObject - room (6)
        locItem('Morkhalla_firepit'),
        // - dining
        locItem([locItem('Morkhalla_Bench', 0.5, 5)], 0.5),
        // room (8)
        locItem('Morkhalla_firepit', 1, 2),
        // - training
        locItem([
          locItem('Morkhalla_WeaponStand', 0.5, 3),
          locItem('Morkhalla_Trainingdummy2', 0.5, 3),
          locItem('Morkhalla_Trainingdummy1', 0.5, 2),
        ], 0.5),
        // room (11) - furniture
        locItem('Morkhalla_firepit'),
        locItem('Morkhalla_Stool', 0.5, 2),
        locItem('Morkhalla_Bench', 0.5),
        // - dining
        locItem([
          locItem('Morkhalla_Table'),
          locItem('Morkhalla_Bench'),
        ], 0.5),
        // room (11) - furniture
        locItem('Morkhalla_firepit'),
        locItem('Morkhalla_Stool', 0.5, 2),
        locItem('Morkhalla_Bench', 0.5),
        // - dining
        locItem([
          locItem('Morkhalla_Stool', 0.5, 2),
          locItem('Morkhalla_Table'),
          locItem('Morkhalla_Bench', 0.5),
        ], 0.5),
        // spawn0
        locItem([
          locItem('JotunWitch'),
          locItem('JotunWitch', 0.25),
          locItem('JotunWarriorDualWield', 0.5),
          locItem('JotunWarrior'),
        ], 0.5),
        // spawn1
        locItem([
          locItem('JotunWarrior'),
          locItem('JotunWitch', 0.5),
          locItem('TreasureChest_morkhalla'),
        ], 0.5),
        // spawn2
        locItem([
          locItem('JotunWarrior'),
          locItem('JotunWarriorDualWield', 0.5),
          locItem('JotunWarrior', 0.25, 2),
          locItem('TreasureChest_morkhalla', 1, 2),
        ], 0.5),
        // spawn3
        locItem([
          locItem('JotunWarrior'),
          locItem('JotunWitch', 0.5),
          locItem('TreasureChest_morkhalla'),
        ], 0.5),
        // spawn4
        locItem([
          locItem('JotunWarriorDualWield'),
          locItem('JotunWarrior', 0.5),
          locItem('JotunWarrior', 0.25, 2),
          locItem('TreasureChest_morkhalla', 0.5),
          locItem('TreasureChest_morkhalla'),
        ], 0.5),
        // spawn5
        locItem([
          locItem('JotunWarrior'),
          locItem('JotunWarriorDualWield', 0.5),
          locItem('JotunWitch', 0.25),
          locItem('TreasureChest_morkhalla'),
        ], 0.5),
        // spawn6
        locItem([
          locItem('JotunWarrior'),
          locItem('JotunWarriorDualWield', 0.5),
        ], 0.5),
        locItem('BlackIce_Start'),
        locItem('Vegvisir_DNBoss'),
      ],
      dist: [0.5, 0.5],
    },
    {
      id: 'entrance01',
      theme: Theme.Morkhalla,
      type: 'start',
      size: [60, 30, 60],
      weight: 1,
      connections: [
        { pos: [-20, 15, 20], type: 'stair' },
      ],
      items: [
        // topfloor
        // room
        Morkhalla_Wall_20,
        Morkhalla_Wall_20,
        Morkhalla_Floor_20_broken,
        // room (1)
        Morkhalla_Wall_20,
        // room (2)
        Morkhalla_Wall_20,
        // room (3)
        // room (4)
        Morkhalla_Wall_20,
        // room (5)
        // middlefloor
        // room
        // room (1)
        Morkhalla_Wall_20,
        Morkhalla_Floor_20_broken,
        // room (2)
        Morkhalla_Stairs_12,
        Morkhalla_Wall_20,
        // room (3)
        Morkhalla_Wall_20,
        // room (4)
        // room (5)
        Morkhalla_Wall_20,
        // bottomfloor
        // room
        locItem('Spawner_JotunWitch'),
        // room (1)
        Morkhalla_Wall_20,
        Morkhalla_Wall_20,
        // room (2)
        locItem('Morkhalla_RandomWallDeco', 0.5, 2),
        locItem([locItem('Morkhalla_RandomWallDeco', 0.5, 2)], 0.5),
        // room (3)
        Morkhalla_Stairs_12,
        // room (4)
        Morkhalla_Stairs_12,
        // room (5)
        Morkhalla_Wall_20,
        Morkhalla_Wall_20,
        // -
        locItem('Morkhalla_ChestAncient', 0.5, 2),
        locItem('Morkhalla_RandomRubble', 1, 21),
      ],
      dist: [0.5, 0.5],
    },
    {
      id: 'entrance02',
      theme: Theme.Morkhalla,
      type: 'start',
      size: [60, 30, 60],
      weight: 1,
      connections: [
        { pos: [-20, -15, -20], type: 'stair2' },
      ],
      items: [
        // topfloor
        // room
        Morkhalla_Wall_20,
        // room (1)
        Morkhalla_Wall_20,
        Morkhalla_Wall_20,
        Morkhalla_Floor_20_broken,
        // room (2)
        // room (3)
        // room (4)
        // room (5)
        Morkhalla_Wall_20,
        Morkhalla_Wall_20,
        // middlefloor
        // room
        Morkhalla_Wall_20,
        // room (1)
        Morkhalla_Wall_20,
        // room (2)
        Morkhalla_Stairs_12,
        Morkhalla_Wall_20,
        // room (3)
        // room (4)
        Morkhalla_Stairs_12,
        // room (5)
        // bottomfloor
        // room
        Morkhalla_Wall_20,
        Morkhalla_Stairs_12,
        // room (1)
        Morkhalla_Wall_20,
        Morkhalla_Wall_20,
        // room (2)
        locItem('Spawner_JotunWitch'),
        // room (3)
        Morkhalla_Wall_20,
        Morkhalla_Stairs_12,
        // room (4)
        Morkhalla_Wall_20,
        Morkhalla_Wall_20,
        Morkhalla_Floor_20_broken,
        // room (5)
        Morkhalla_Wall_20,
        Morkhalla_Wall_20,
        // -
        locItem('Morkhalla_RandomRubble', 1, 18),
      ],
      dist: [0.5, 0.5],
    },
    {
      id: 'floor01',
      theme: Theme.Morkhalla,
      type: 'middle',
      size: [60, 10, 60],
      weight: 1,
      connections: [
        { pos: [20, 5, -20], type: 'stair' },
        { pos: [-20, -5, 20], type: 'stair' },
      ],
      items: [
        // room
        Morkhalla_Stairs_12,
        // room (1)
        Morkhalla_Wall_20,
        // room (2)
        Morkhalla_Wall_20,
        Morkhalla_Wall_20,
        // room (3)
        Morkhalla_Wall_20,
        Morkhalla_Wall_20,
        Morkhalla_Wall_20,
        // room (4)
        fire,
        // room (5)
        Morkhalla_Wall_20,
        // -
        locItem('Morkhalla_RandomSpawner', 1, 4),
        locItem('Morkhalla_RandomRubble', 1, 11),
      ],
      dist: [0.5, 0.5],
    },
    {
      id: 'floor01_tall',
      theme: Theme.Morkhalla,
      type: 'middle',
      size: [60, 20, 60],
      weight: 1,
      connections: [
        { pos: [20, 10, -20], type: 'stair' },
        { pos: [-20, -10, 20], type: 'stair' },
      ],
      items: [
        // room
        Morkhalla_Wall_20,
        fire,
        // room (1)
        Morkhalla_Wall_20,
        // room (2)
        Morkhalla_Wall_20,
        Morkhalla_Wall_20,
        // room (3)
        Morkhalla_Stairs_12,
        // room (4)
        Morkhalla_Wall_20,
        Morkhalla_Wall_20,
        Morkhalla_Floor_20_broken2,
        // room (5)
        Morkhalla_Wall_20,
        // room (6)
        Morkhalla_Wall_20,
        Morkhalla_Wall_20,
        Morkhalla_Floor_20_broken,
        // room (7)
        Morkhalla_Wall_20,
        // room (8)
        Morkhalla_Wall_20,
        Morkhalla_Wall_20,
        // - no_floor
        locItem('Morkhalla_ChestAncient', 1, 2),
        // room (9)
        // room (10)
        Morkhalla_Wall_20,
        Morkhalla_Floor_20_broken,
        // room (11)
        Morkhalla_Stairs_12,
        locItem('Morkhalla_RandomSpawner', 1, 4),
        // rugs
        locItem('Morkhalla_RandomRubble', 1, 10),
      ],
      dist: [0.5, 0.5],
    },
    {
      id: 'floor02',
      theme: Theme.Morkhalla,
      type: 'middle',
      size: [60, 10, 60],
      weight: 1,
      connections: [
        { pos: [20, 5, -20], type: 'stair' },
        { pos: [20, -5, - 20], type: 'stair' },
      ],
      items: [
        // room (6)
        // room (7)
        Morkhalla_Wall_20,
        Morkhalla_Floor_20_broken,
        // room (8)
        Morkhalla_Wall_20,
        Morkhalla_Wall_20,
        // room (9)
        Morkhalla_Wall_20,
        Morkhalla_Wall_20,
        // room (10)
        Morkhalla_Wall_20,
        Morkhalla_Wall_20,
        // room (11)
        Morkhalla_Wall_20,
        Morkhalla_Floor_20_broken3,
        // -
        locItem('Morkhalla_RandomSpawner', 1, 7),
        locItem('Morkhalla_RandomRubble', 1, 10),
      ],
      dist: [0.5, 0.5],
    },
    {
      id: 'floor02_tall',
      theme: Theme.Morkhalla,
      type: 'middle',
      size: [60, 20, 60],
      weight: 1,
      connections: [
        { pos: [20, 10, -20], type: 'stair' },
        { pos: [-20, -10, 20], type: 'stair' },
      ],
      items: [
        // room (5)
        Morkhalla_Wall_20,
        Morkhalla_Floor_20_broken2,
        // room (4)
        Morkhalla_Wall_20,
        Morkhalla_Wall_20,
        Morkhalla_Floor_20_broken,
        // room (3)
        Morkhalla_Wall_20,
        Morkhalla_Stairs_12,
        // room (2)
        Morkhalla_Stairs_12,
        // room (1)
        Morkhalla_Wall_20,
        // room
        Morkhalla_Wall_20,
        // room (6)
        Morkhalla_Wall_20,
        Morkhalla_Wall_20,
        // room (7)
        Morkhalla_Wall_20,
        Morkhalla_Floor_20_broken2,
        // room (8)
        // room (9)
        // room (10)
        Morkhalla_Wall_20,
        Morkhalla_Floor_20_broken,
        // room (11)
        Morkhalla_Stairs_12,
        // -
        locItem('Morkhalla_RandomRubble', 1, 12),
      ],
      dist: [0.5, 0.5],
    },
    {
      id: 'floor03',
      theme: Theme.Morkhalla,
      type: 'middle',
      size: [60, 10, 60],
      weight: 1,
      connections: [
        { pos: [20, 5, -20], type: 'stair' },
        { pos: [-20, -5, -20], type: 'stair2' },
      ],
      items: [
        // room (6)
        Morkhalla_Stairs_12,
        // room (7)
        Morkhalla_Wall_20,
        // room (8)
        fire,
        // room (9)
        Morkhalla_Wall_20,
        Morkhalla_Wall_20,
        Morkhalla_Floor_20_broken3,
        // room (10)
        Morkhalla_Wall_20,
        Morkhalla_Wall_20,
        Morkhalla_Floor_20_broken3,
        // room (11)
        Morkhalla_Wall_20,
        Morkhalla_Floor_20_broken3,
        // -
        locItem('Morkhalla_RandomSpawner', 1, 6),
        // rugs
        locItem('Morkhalla_RandomRubble', 1, 11),
      ],
      dist: [0.5, 0.5],
    },
    {
      id: 'floor03_tall',
      theme: Theme.Morkhalla,
      type: 'middle',
      size: [60, 20, 60],
      weight: 1,
      connections: [
        { pos: [20, 10, -20], type: 'stair' },
        { pos: [-20, -10, -20], type: 'stair2' },
      ],
      items: [
        // room
        Morkhalla_Wall_20,
        Morkhalla_Stairs_12,
        // room (1)
        Morkhalla_Wall_20,
        Morkhalla_Floor_20_broken2,
        // room (2)
        Morkhalla_Wall_20,
        Morkhalla_Wall_20,
        // room (3)
        fire,
        // room (4)
        Morkhalla_Wall_20,
        Morkhalla_Wall_20,
        Morkhalla_Floor_20_broken,
        Morkhalla_Wall_20,
        // room (5)
        Morkhalla_Wall_20,
        Morkhalla_Floor_20_broken,
        // room (6)
        // room (7)
        Morkhalla_Wall_20,
        Morkhalla_Floor_20_broken2,
        // room (8)
        Morkhalla_Wall_20,
        Morkhalla_Wall_20,
        Morkhalla_Wall_20,
        // room (9)
        Morkhalla_Floor_20_broken,
        // room (10)
        Morkhalla_Wall_20,
        Morkhalla_Floor_20_broken2,
        // room (11)
        Morkhalla_Stairs_12,
        // -
        locItem('Morkhalla_RandomSpawner', 1, 4),
        locItem('Morkhalla_RandomRubble', 1, 20),
      ],
      dist: [0.5, 0.5],
    },
    {
      id: 'floor04',
      theme: Theme.Morkhalla,
      type: 'middle',
      size: [60, 10, 60],
      weight: 1,
      connections: [
        { pos: [-20, -5, 20], type: 'stair' },
        { pos: [20, 5, 20], type: 'stair2' },
      ],
      items: [
        // room (6)
        fire,
        // room (7)
        Morkhalla_Wall_20,
        // room (8)
        Morkhalla_Stairs_12,
        // room (9)
        Morkhalla_Wall_20,
        Morkhalla_Floor_20_broken3,
        Morkhalla_Wall_20,
        // room (10)
        Morkhalla_Wall_20,
        Morkhalla_Wall_20,
        Morkhalla_Floor_20_broken3,
        // room (11)
        Morkhalla_Wall_20,
        Morkhalla_Floor_20_broken2,
        // -
        locItem('Morkhalla_RandomSpawner', 1, 2),
        locItem('Morkhalla_RandomRubble', 1, 7),
      ],
      dist: [0.5, 0.5],
    },
    {
      id: 'floor04_tall',
      theme: Theme.Morkhalla,
      type: 'middle',
      size: [60, 20, 60],
      weight: 1,
      connections: [
        { pos: [20, 10, -20], type: 'stair' },
        { pos: [-20, -10, -20], type: 'stair2' },
      ],
      items: [
        // room
        Morkhalla_Stairs_12,
        // room (1)
        Morkhalla_Wall_20,
        // room (2)
        Morkhalla_Wall_20,
        Morkhalla_Wall_20,
        // room (3)
        fire,
        // room (4)
        Morkhalla_Wall_20,
        Morkhalla_Wall_20,
        Morkhalla_Floor_20_broken2,
        // room (5)
        // room (6)
        // room (7)
        Morkhalla_Wall_20,
        Morkhalla_Floor_20_broken2,
        // room (8)
        Morkhalla_Wall_20,
        Morkhalla_Floor_20_broken,
        Morkhalla_Wall_20,
        // room (9)
        Morkhalla_Floor_20_broken2,
        // room (10)
        // room (11)
        Morkhalla_Stairs_12,
        // -
        locItem('Morkhalla_RandomSpawner', 1, 2),
        locItem('Morkhalla_RandomRubble', 1, 13),
      ],
      dist: [0.5, 0.5],
    },
    {
      id: 'floor05',
      theme: Theme.Morkhalla,
      type: 'middle',
      size: [60, 10, 60],
      weight: 1,
      connections: [
        { pos: [20, 5, 20], type: 'stair2' },
        { pos: [-20, -5, -20], type: 'stair2' },
      ],
      items: [
        // room (6)
        Morkhalla_Wall_20,
        Morkhalla_Wall_20,
        Morkhalla_Floor_20_broken,
        // room (7)
        Morkhalla_Wall_20,
        Morkhalla_Wall_20,
        // room (8)
        Morkhalla_Stairs_12,
        // room (9)
        Morkhalla_Floor_20_broken2,
        // room (10)
        Morkhalla_Wall_20,
        Morkhalla_Wall_20,
        fire,
        // room (11)
        Morkhalla_Wall_20,
        locItem([ // random
          locItem('Morkhalla_RandomSpawner', 1, 2),
        ], 0.5),
        // -
        locItem('Morkhalla_RandomSpawner', 1, 1),
        locItem('Morkhalla_RandomRubble', 1, 11),
      ],
      dist: [0.5, 0.5],
    },
    {
      id: 'floor05_tall',
      theme: Theme.Morkhalla,
      type: 'middle',
      size: [60, 20, 60],
      weight: 1,
      connections: [
        { pos: [20, -10, -20], type: 'stair' },
        { pos: [20, 10, 20], type: 'stair2' },
      ],
      items: [
        // room (6)
        Morkhalla_Stairs_12,
        // room (7)
        Morkhalla_Wall_20,
        Morkhalla_Wall_20,
        Morkhalla_Wall_20,
        // room (8)
        Morkhalla_Wall_20,
        Morkhalla_Wall_20,
        // room (9)
        fire,
        // room (10)
        Morkhalla_Wall_20,
        // room (11)
        Morkhalla_Wall_20,
        Morkhalla_Wall_20,
        Morkhalla_Floor_20_broken2,
        // room (12)
        // room (13)
        Morkhalla_Wall_20,
        Morkhalla_Wall_20,
        // room (14)
        Morkhalla_Stairs_12,
        // room (15)
        Morkhalla_Wall_20,
        Morkhalla_Floor_20_broken,
        Morkhalla_Wall_20,
        // room (16)
        Morkhalla_Wall_20,
        Morkhalla_Wall_20,
        // room (17)
        Morkhalla_Wall_20,
        Morkhalla_Wall_20,
        Morkhalla_Floor_20_broken2,
        // -
        locItem('Morkhalla_RandomSpawner', 1, 6),
        locItem('Morkhalla_RandomRubble', 1, 8),
      ],
      dist: [0.5, 0.5],
    },
    {
      id: 'floor06',
      theme: Theme.Morkhalla,
      type: 'middle',
      size: [60, 10, 60],
      weight: 1,
      connections: [
        { pos: [20, 5, -20], type: 'stair2' },
        { pos: [-20, -5, 20], type: 'stair2' },
      ],
      items: [
        // room
        Morkhalla_Stairs_12,
        // room (1)
        Morkhalla_Wall_20,
        Morkhalla_Floor_20_broken3,
        // room (2)
        Morkhalla_Wall_20,
        Morkhalla_Wall_20,
        // room (3)
        Morkhalla_Wall_20,
        Morkhalla_Wall_20,
        Morkhalla_Wall_20,
        Morkhalla_Floor_20_broken,
        // room (4)
        fire,
        // room (5)
        Morkhalla_Wall_20,
        Morkhalla_Floor_20_broken,
        // -
        locItem('Morkhalla_RandomSpawner', 1, 2),
        locItem('Morkhalla_RandomRubble', 1, 11),
      ],
      dist: [0.5, 0.5],
    },
    {
      id: 'floor06_tall',
      theme: Theme.Morkhalla,
      type: 'middle',
      size: [60, 20, 60],
      weight: 1,
      connections: [
        { pos: [-20, 10, -20], type: 'stair2' },
        { pos: [-20, -10, -20], type: 'stair2' },
      ],
      items: [
        // room
        Morkhalla_Stairs_12,
        // room (1)
        Morkhalla_Wall_20,
        Morkhalla_Floor_20_broken,
        // room (2)
        Morkhalla_Wall_20,
        Morkhalla_Floor_20_broken2,
        Morkhalla_Wall_20,
        // room (3)
        fire,
        // room (4)
        Morkhalla_Wall_20,
        Morkhalla_Wall_20,
        Morkhalla_Floor_20_broken3,
        // room (5)
        Morkhalla_Wall_20,
        Morkhalla_Floor_20_broken,
        // room (6)
        // room (7)
        Morkhalla_Wall_20,
        Morkhalla_Floor_20_broken2,
        // room (8)
        Morkhalla_Wall_20,
        Morkhalla_Floor_20_broken,
        Morkhalla_Wall_20,
        // room (9)
        // room (10)
        Morkhalla_Wall_20,
        // room (11)
        // -
        locItem('Morkhalla_ChestAncient'),
        locItem('Morkhalla_ChestAncient', 0.5, 2),
        locItem('Morkhalla_RandomSpawner', 1, 2),
        locItem('Morkhalla_RandomRubble', 1, 20),
      ],
      dist: [0.5, 0.5],
    },
  ],
};
