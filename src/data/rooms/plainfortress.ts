import { locItem } from '../../model/game';
import { LocationItem } from '../../types';

import { DungeonRoomsConfig, Theme } from './types';

const FLOOR_CLUTTER: LocationItem = locItem([
  locItem('goblin_trashpile', 0.75, 3),
  locItem('goblin_strawpile', 0.75, 3),
  locItem('fulling_trap', 0.5, 3),
], 0.5);

export const plainfortress: DungeonRoomsConfig = {
  type: 'dungeon',
  prefix: 'plainsfortress_Hildir_',
  rooms: [
    {
      id: 'Start',
      theme: Theme.PlainsFortHildir,
      type: 'start',
      size: [19, 8, 19],
      weight: 1,
      connections: [
        { pos: [0, 4, 0], type: 'floor0' },
      ],
      items: [
        locItem('Spawner_GoblinBrute_Hildir'),
        locItem('Goblin', 1, 2),
        locItem('GoblinArcher', 1, 2),
        locItem('GoblinShaman', 1, 2),
        locItem('TreasureChest_heath', 0.3, 1),
        locItem('TreasureChest_heath_hildir', 1, 2),
        locItem('TreasureChest_heath_hildir', 0.5, 1),
      ],
      dist: [0, 1],
    },
    {
      id: 'Floor0',
      theme: Theme.PlainsFortHildir,
      type: 'middle',
      size: [19, 8, 19],
      weight: 1,
      connections: [
        { pos: [0, -4, 0], type: 'floor0' },
        { pos: [0, 4, 0], type: 'floor1' },
        // 16x { pos: [?, -4, ?], type: 'wall' },
        // 16x { pos: [?, 0, ?], type: 'wall' },
        { pos: [0, 0, 0], type: 'middlewall' },
      ],
      items: [
        // wood
        locItem('goblin_trashpile', 1, 4),
        locItem('goblin_trashpile', 0.5, 3),
        locItem('goblin_strawpile', 0.75, 4),
        locItem('fulling_trap', 0.5, 3),
        // wall
        locItem('crypt_hangingskeleton', 0.5, 2),
        locItem('crypt_hangingchain', 0.5),
        locItem('TreasureChest_heath', 0.3),
        // doors (1)
        locItem('dungeon_sunkencrypt_irongate_rusty', 1, 3),
        // enemies
        locItem('Goblin', 1, 2),
        locItem('GoblinArcher'),
        locItem('GoblinShaman'),
        locItem('GoblinArcher', 0.5),
        locItem('GoblinShaman', 0.5),
      ],
      dist: [0, 1],
    },
    {
      id: 'Floor1',
      theme: Theme.PlainsFortHildir,
      type: 'middle',
      size: [19, 8, 19],
      weight: 1,
      connections: [
        { pos: [0, -4, 0], type: 'floor1' },
        { pos: [0, 4, 0], type: 'floor2' },
        // 5x { pos: [?, -4, ?], type: 'window' },
        // 11x { pos: [?, -4, ?], type: 'wall' },
        // 16x { pos: [?, 0, ?], type: 'wall' },
        { pos: [0, 0, 0], type: 'middlewall' },
      ],
      items: [
        // wood
        locItem('goblin_trashpile', 0.5, 3),
        locItem('fulling_trap', 0.5, 3),
        locItem('goblin_strawpile', 0.75, 4),
        // stair
        // wall
        locItem('crypt_hangingskeleton', 0.5, 2),
        locItem('crypt_hangingchain', 0.5),
        locItem('TreasureChest_heath', 0.3),
        // doors
        locItem('dungeon_sunkencrypt_irongate_rusty', 1, 3),
        // enemies
        locItem('Goblin', 1, 2),
        locItem('GoblinArcher', 0.66, 2),
        locItem('GoblinShaman', 0.66, 2),
      ],
      dist: [1],
    },
    {
      id: 'Floor2',
      theme: Theme.PlainsFortHildir,
      type: 'middle',
      size: [19, 8, 19],
      weight: 2,
      connections: [
        { pos: [0, -4, 0], type: 'floor2' },
        { pos: [0, 4, 0], type: 'floor2' },
        // 10x { pos: [?, -4, ?], type: 'wall' },
        // 5x { pos: [?, -4, ?], type: 'balcony' },
        // 1x { pos: [?, -4, ?], type: 'window' },
        // 13x { pos: [?, 0, ?], type: 'wall' },
        // 3x { pos: [?, 0, ?], type: 'window' },
        { pos: [0, 0, 0], type: 'middlewall' },
      ],
      items: [
        // wood
        locItem('goblin_trashpile', 0.5, 3),
        locItem('fulling_trap', 0.5, 3),
        locItem('goblin_strawpile', 0.75, 4),
        // stair
        // wall
        locItem('crypt_hangingskeleton', 0.5, 2),
        locItem('crypt_hangingchain', 0.5),
        locItem('TreasureChest_heath', 0.3),
        // doors
        locItem('dungeon_sunkencrypt_irongate_rusty', 1, 3),
        // enemies
        locItem('Goblin', 1, 4),
        locItem('Goblin', 0.5, 2),
      ],
      dist: [1],
    },
    {
      id: 'Floor2_1',
      theme: Theme.PlainsFortHildir,
      type: 'middle',
      size: [19, 8, 19],
      weight: 1,
      connections: [
        { pos: [0, -4, 0], type: 'floor2' },
        { pos: [0, 4, 0], type: 'floor2' },
        // 9x { pos: [?, -4, ?], type: 'wall' },
        // 5x { pos: [?, -4, ?], type: 'balcony' },
        // 2x { pos: [?, -4, ?], type: 'window' },
        // 14x { pos: [?, 0, ?], type: 'wall' },
        // 2x { pos: [?, 0, ?], type: 'window' },
        { pos: [0, 0, 0], type: 'middlewall' },
      ],
      items: [
        // wood
        locItem('goblin_trashpile', 0.75, 9),
        locItem('fulling_trap', 0.5, 10),
        locItem('goblin_strawpile', 0.75, 14),
        // stair
        // wall
        locItem('crypt_hangingskeleton', 0.5, 2),
        locItem('crypt_hangingchain', 0.5),
        locItem('TreasureChest_heath', 0.3),
        // doors
        locItem('dungeon_sunkencrypt_irongate_rusty', 1, 3),
        // enemies
        locItem('Goblin', 1, 4),
        locItem('Goblin', 0.5, 2),
      ],
      dist: [1],
    },
    {
      id: 'Floor2_2',
      theme: Theme.PlainsFortHildir,
      type: 'middle',
      size: [19, 8, 19],
      weight: 1,
      connections: [
        { pos: [0, -4, 0], type: 'floor2' },
        { pos: [0, 4, 0], type: 'floor2' },
        // 16x { pos: [?, -4, ?], type: 'wall' },
        // 16x { pos: [?, 0, ?], type: 'wall' },
        { pos: [0, 0, 0], type: 'middlewall' },
      ],
      items: [
        // wood
        locItem('goblin_trashpile', 0.5, 4),
        locItem('fulling_trap', 0.5, 4),
        locItem('goblin_strawpile', 0.75, 5),
        // stair
        // wall
        locItem('crypt_hangingskeleton', 0.5, 2),
        locItem('crypt_hangingchain', 0.5),
        locItem('TreasureChest_heath', 0.3),
        // enemies
        locItem('Goblin', 1, 2),
        locItem('GoblinArcher', 0.5),
        locItem('GoblinArcher', 0.75),
        locItem('GoblinShaman', 0.25),
        // doors
        locItem('dungeon_sunkencrypt_irongate_rusty', 1, 3),
      ],
      dist: [1],
    },
    {
      id: 'Floor2_3',
      theme: Theme.PlainsFortHildir,
      type: 'middle',
      size: [19, 8, 19],
      weight: 2,
      connections: [
        { pos: [0, -4, 0], type: 'floor2' },
        { pos: [0, 4, 0], type: 'floor2' },
        // 16x { pos: [?, -4, ?], type: 'wall' },
        // 16x { pos: [?, 0, ?], type: 'wall' },
        { pos: [0, 0, 0], type: 'middlewall' },
      ],
      items: [
        // wood
        locItem('goblin_trashpile', 0.5, 4),
        locItem('fulling_trap', 0.5, 4),
        locItem('goblin_strawpile', 0.75, 5),
        // stair
        // wall
        locItem('crypt_hangingskeleton', 0.5, 2),
        locItem('crypt_hangingchain', 0.5, 2),
        locItem('TreasureChest_heath', 0.3),
        // enemies
        locItem('Goblin', 1, 2),
        locItem('GoblinArcher', 0.5),
        locItem('GoblinArcher', 0.75),
        locItem('GoblinShaman', 0.25),
        // doors
        locItem('dungeon_sunkencrypt_irongate_rusty', 1, 3),
      ],
      dist: [1],
    },
    {
      id: 'Floor2_4',
      theme: Theme.PlainsFortHildir,
      type: 'middle',
      size: [19, 8, 19],
      weight: 2,
      connections: [
        { pos: [0, -4, 0], type: 'floor2' },
        { pos: [0, 4, 0], type: 'floor2' },
        // 10x { pos: [?, -4, ?], type: 'wall' },
        // 5x { pos: [?, -4, ?], type: 'balcony' },
        // 1x { pos: [?, -4, ?], type: 'window' },
        // 14x { pos: [?, 0, ?], type: 'wall' },
        // 2x { pos: [?, 0, ?], type: 'window' },
        { pos: [0, 0, 0], type: 'middlewall' },
      ],
      items: [
        // wood
        locItem('goblin_trashpile', 0.5, 4),
        locItem('fulling_trap', 0.5, 4),
        locItem('goblin_strawpile', 0.75, 5),
        // stair
        // wall
        locItem('crypt_hangingskeleton', 0.5, 2),
        locItem('crypt_hangingchain', 0.5, 2),
        locItem('TreasureChest_heath', 0.3),
        // doors
        locItem('dungeon_sunkencrypt_irongate_rusty', 1, 3),
        // enemies
        locItem('GoblinArcher', 1, 2),
        locItem('GoblinArcher', 0.5),
        locItem('GoblinShaman', 0.5),
      ],
      dist: [1],
    },
    {
      id: 'endcap_balcony',
      theme: Theme.PlainsFortHildir,
      type: 'end',
      size: [4, 4, 0],
      weight: 2,
      connections: [
        { pos: [0, -2, 0], type: 'balcony' },
      ],
      items: [
        locItem('GoblinArcher'),
        locItem('CastleKit_groundtorch', 1, 2),
        locItem('goblin_pole', 1, 2),
        locItem('goblin_roof_45d', 1, 2),
      ],
      dist: [0.5, 0.25, 0.125, 0.125],
    },
    {
      id: 'endcap_balcony1',
      theme: Theme.PlainsFortHildir,
      type: 'end',
      size: [4, 4, 0],
      weight: 2,
      connections: [
        { pos: [0, -2, 0], type: 'balcony' },
      ],
      items: [
        locItem('CastleKit_groundtorch'),
        locItem('wood_beam', 1, 4),
        locItem('wood_beam_26', 1, 4),
        locItem('darkwood_roof', 1, 4),
      ],
      dist: [0.5, 0.25, 0.125, 0.125],
    },
    {
      id: 'endcap_balcony_wall',
      theme: Theme.PlainsFortHildir,
      type: 'end',
      size: [4, 4, 0],
      weight: 2,
      connections: [
        { pos: [0, -2, 0], type: 'balcony' },
      ],
      items: [
        locItem([
          locItem('goblin_woodwall_1m', 0.33, 2),
        ], 0.5),
      ],
      dist: [0.5, 0.25, 0.125, 0.125],
    },
    {
      id: 'endcap_barred',
      theme: Theme.PlainsFortHildir,
      type: 'end',
      size: [4, 4, 0],
      weight: 3,
      connections: [
        { pos: [0, -2, 0], type: 'balcony' },
      ],
      items: [
        locItem('CastleKit_groundtorch'),
        locItem('iron_wall_1x1_rusty', 1, 2),
        locItem('goblin_woodwall_1m', 0.4),
      ],
      dist: [0.5, 0.25, 0.125, 0.125],
    },
    {
      id: 'endcap_goblinbalcony',
      theme: Theme.PlainsFortHildir,
      type: 'end',
      size: [4, 4, 0],
      weight: 1,
      connections: [
        { pos: [0, -2, 0], type: 'balcony' },
      ],
      items: [
        locItem('goblin_roof_45d', 1, 2),
        locItem('goblin_pole', 1, 4),
        locItem('goblin_woodwall_2m', 1, 2),
        locItem('GoblinArcher'),
      ],
      dist: [0.5, 0.25, 0.125, 0.125],
    },
    {
      id: 'endcap_goblinbalcony1',
      theme: Theme.PlainsFortHildir,
      type: 'end',
      size: [4, 4, 0],
      weight: 1,
      connections: [
        { pos: [0, -2, 0], type: 'balcony' },
      ],
      items: [
        locItem('goblin_pole', 1, 4),
        locItem('goblin_woodwall_2m', 1, 2),
        locItem('goblin_woodwall_2m_ribs', 0.66, 4),
        locItem('piece_groundtorch_wood', 1, 2),
        locItem('GoblinArcher'),
      ],
      dist: [0.5, 0.25, 0.125, 0.125],
    },
    {
      id: 'endcap_hole',
      theme: Theme.PlainsFortHildir,
      type: 'end',
      size: [4, 4, 0],
      weight: 4,
      connections: [
        { pos: [0, -2, 0], type: 'wall' },
      ],
      items: [
        locItem('SunkenKit_int_wall_1x2'),
      ],
      dist: [0.5, 0.25, 0.125, 0.125],
    },
    {
      id: 'endcap_hole1',
      theme: Theme.PlainsFortHildir,
      type: 'end',
      size: [4, 4, 0],
      weight: 4,
      connections: [
        { pos: [0, -2, 0], type: 'wall' },
      ],
      items: [
        locItem('SunkenKit_int_wall_1x2'),
      ],
      dist: [0.5, 0.25, 0.125, 0.125],
    },
    {
      id: 'endcap_hole2',
      theme: Theme.PlainsFortHildir,
      type: 'end',
      size: [4, 4, 0],
      weight: 1,
      connections: [
        { pos: [0, -2, 0], type: 'wall' },
      ],
      items: [],
      dist: [0.5, 0.25, 0.125, 0.125],
    },
    {
      id: 'endcap_hole3',
      theme: Theme.PlainsFortHildir,
      type: 'end',
      size: [4, 4, 0],
      weight: 1,
      connections: [
        { pos: [0, -2, 0], type: 'wall' },
      ],
      items: [],
      dist: [0.5, 0.25, 0.125, 0.125],
    },
    {
      id: 'endcap_hole4',
      theme: Theme.PlainsFortHildir,
      type: 'end',
      size: [4, 4, 0],
      weight: 4,
      connections: [
        { pos: [0, -2, 0], type: 'wall' },
      ],
      items: [],
      dist: [0.5, 0.25, 0.125, 0.125],
    },
    {
      id: 'endcap_middlewall01',
      theme: Theme.PlainsFortHildir,
      type: 'end',
      size: [8, 8, 0],
      weight: 2,
      endCapPriority: 2,
      connections: [
        { pos: [0, 0, 0], type: 'middlewall' },
      ],
      items: [
        locItem('dungeon_sunkencrypt_irongate_rusty'),
        locItem('goblin_bed', 0.5, 2),
        locItem('crypt_hangingskeleton', 0.5, 4),
      ],
      dist: [1],
    },
    {
      id: 'endcap_middlewall02',
      theme: Theme.PlainsFortHildir,
      type: 'end',
      size: [8, 8, 0],
      weight: 2,
      endCapPriority: 2,
      connections: [
        { pos: [0, 0, 0], type: 'middlewall' },
      ],
      items: [
        FLOOR_CLUTTER,
        locItem([
          locItem('iron_wall_1x1_rusty', 1, 16),
          locItem('goblin_bed', 0.5, 2),
          locItem('crypt_hangingskeleton', 0.5, 2),
          locItem('crypt_hangingchain', 0.5, 2),
        ], 0.5),
      ],
      dist: [1],
    },
    {
      id: 'endcap_middlewall03',
      theme: Theme.PlainsFortHildir,
      type: 'end',
      size: [8, 8, 0],
      weight: 2,
      endCapPriority: 2,
      connections: [
        { pos: [0, 0, 0], type: 'middlewall' },
      ],
      items: [
        locItem('dungeon_sunkencrypt_irongate_rusty', 1, 2),
        locItem('goblin_bed', 0.5, 2),
        locItem('crypt_hangingskeleton', 1, 2),
        locItem('crypt_hangingchain', 1, 2),
      ],
      dist: [1],
    },
    {
      id: 'endcap_middlewall04',
      theme: Theme.PlainsFortHildir,
      type: 'end',
      size: [8, 8, 0],
      weight: 3,
      endCapPriority: 3,
      connections: [
        { pos: [0, 0, 0], type: 'middlewall' },
      ],
      items: [
        FLOOR_CLUTTER,
        locItem([ // wall1 + wall2
          locItem('dungeon_sunkencrypt_irongate_rusty'),
          locItem('goblin_bed', 0.5),
          locItem('crypt_hangingskeleton', 0.5, 2),
        ], 0.5, 2),
      ],
      dist: [1],
    },
    {
      id: 'endcap_middlewall05',
      theme: Theme.PlainsFortHildir,
      type: 'end',
      size: [8, 8, 0],
      weight: 1,
      endCapPriority: 1,
      connections: [
        { pos: [0, 0, 0], type: 'middlewall' },
      ],
      items: [
        locItem('goblin_bed', 0.5, 3),
        locItem([ // ROOM
          locItem('goblin_trashpile', 0.75, 2),
          locItem('goblin_strawpile', 0.75, 2),
          locItem('fulling_trap', 0.5, 2),
        ], 0.5),
      ],
      dist: [1],
    },
    {
      id: 'endcap_middlewall06',
      theme: Theme.PlainsFortHildir,
      type: 'end',
      size: [8, 8, 0],
      weight: 1,
      endCapPriority: 1,
      connections: [
        { pos: [0, 0, 0], type: 'middlewall' },
      ],
      items: [
        locItem('goblin_trashpile', 0.75, 5),
        locItem('goblin_strawpile', 0.75, 5),
        locItem('fulling_trap', 0.5, 5),
      ],
      dist: [1],
    },
    {
      id: 'endcap_middlewall07',
      theme: Theme.PlainsFortHildir,
      type: 'end',
      size: [8, 8, 0],
      weight: 3,
      endCapPriority: 3,
      connections: [
        { pos: [0, 0, 0], type: 'middlewall' },
      ],
      items: [
        locItem([ // wall1
          locItem('goblin_bed', 0.5, 1),
          locItem('crypt_hangingskeleton', 0.5, 2),
          locItem('crypt_hangingchain', 0.5, 2),
          locItem('iron_wall_1x1_rusty', 1, 12),
          locItem([locItem('iron_wall_1x1_rusty', 1, 4)], 0.5),
        ], 0.5),
        locItem([ // wall2
          locItem('goblin_bed', 0.5, 1),
          locItem('crypt_hangingskeleton', 0.5, 2),
          locItem('dungeon_sunkencrypt_irongate_rusty'),
        ], 0.5),
      ],
      dist: [1],
    },
    {
      id: 'endcap_middlewall08',
      theme: Theme.PlainsFortHildir,
      type: 'end',
      size: [8, 8, 0],
      weight: 3,
      endCapPriority: 3,
      connections: [
        { pos: [0, 0, 0], type: 'middlewall' },
      ],
      items: [
        locItem([ // wall1
          locItem('goblin_bed', 0.5, 1),
          locItem('crypt_hangingskeleton', 0.5, 3),
          locItem('crypt_hangingchain', 0.5, 2),
          locItem('dungeon_sunkencrypt_irongate_rusty'),
        ], 0.5),
        locItem([ // ROOM
          locItem('goblin_strawpile', 0.75, 4),
          locItem('goblin_trashpile', 0.75, 3),
          locItem('fulling_trap', 0.5, 3),
          locItem('TreasureChest_heath', 0.3),
        ], 0.5),
      ],
      dist: [1],
    },
    {
      id: 'endcap_wall',
      theme: Theme.PlainsFortHildir,
      type: 'end',
      size: [4, 4, 0],
      weight: 6,
      endCapPriority: 6,
      connections: [
        { pos: [0, -2, 0], type: 'wall' },
      ],
      items: [],
      dist: [1],
    },
    {
      id: 'endcap_wall1',
      theme: Theme.PlainsFortHildir,
      type: 'end',
      size: [4, 4, 0],
      weight: 6,
      endCapPriority: 6,
      connections: [
        { pos: [0, -2, 0], type: 'wall' },
      ],
      items: [
        locItem([
          locItem('goblin_woodwall_1m', 0.33, 2),
        ], 0.5),
      ],
      dist: [1],
    },
    {
      id: 'endcap_window_barred',
      theme: Theme.PlainsFortHildir,
      type: 'end',
      size: [4, 4, 0],
      weight: 4,
      endCapPriority: 4,
      connections: [
        { pos: [0, -2, 0], type: 'window' },
      ],
      items: [
        locItem('CastleKit_groundtorch'),
        locItem('iron_wall_1x1_rusty', 1, 2),
        locItem('goblin_woodwall_1m', 0.4),
      ],
      dist: [1],
    },
    {
      id: 'endcap_window_hole',
      theme: Theme.PlainsFortHildir,
      type: 'end',
      size: [4, 4, 0],
      weight: 2,
      endCapPriority: 2,
      connections: [
        { pos: [0, -2, 0], type: 'window' },
      ],
      items: [],
      dist: [1],
    },
    {
      id: 'endcap_window_hole1',
      theme: Theme.PlainsFortHildir,
      type: 'end',
      size: [4, 4, 0],
      weight: 2,
      endCapPriority: 2,
      connections: [
        { pos: [0, -2, 0], type: 'window' },
      ],
      items: [],
      dist: [1],
    },
    {
      id: 'Endcap',
      theme: Theme.PlainsFortHildir,
      type: 'end',
      size: [19, 2, 19],
      weight: 1,
      connections: [
        { pos: [0, -1, 0], type: 'floor2' },
      ],
      items: [
        locItem('GoblinArcher', 1, 2),
        locItem('CastleKit_groundtorch', 0.8, 8),
      ],
      dist: [0, 1],
    },
  ],
};
