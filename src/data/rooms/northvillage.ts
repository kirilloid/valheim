import { locItem } from '../../model/game';

import { CampConfig, Theme } from './types';

export const northvillage: CampConfig = {
  type: 'camp',
  prefix: 'northvillage_',
  perimeter: [
    {
      id: 'fence1',
      theme: Theme.NorthVillage,
      size: [11, 8, 3],
      weight: 1,
      items: [
        locItem('wood_fence', 1, 2),
        locItem('wood_fence', 0.5, 2),
        locItem('ShadowPerson', 0.5),
      ],
      dist: [0, 1],
    },
    {
      id: 'fence2',
      theme: Theme.NorthVillage,
      size: [8, 8, 3],
      weight: 1,
      items: [
        locItem('wood_fence', 1, 1),
        locItem('wood_fence', 0.5, 2),
      ],
      dist: [0, 1],
    },
    {
      id: 'tower',
      theme: Theme.NorthVillage,
      size: [10, 25, 12],
      weight: 2,
      items: [
        // walls
        locItem('stave_wall_2x2', 1, 8 + 11 + 14 + 14),
        // top
        // beams
        locItem('stave_beam_67', 1, 4),
        locItem('stave_beam_4m', 1, 6),
        // walls -> outcropping
        locItem('scale_wall_2x2', 1, 9),
        locItem('stave_pole_2m', 1, 6),
        locItem('stave_beam_2m', 1, 7),
        locItem('scale_wall_roof_67', 1, 1),
        locItem('scale_wall_roof_67_flipped', 1, 3),
        // decor
        locItem('TreasureChest_deepnorth_village', 0.25 * 0.5),
        locItem('piece_chair', 0.5, 3),
        // roof
        locItem('darkwood_roof_icorner_67', 1, 2),
        locItem('darkwood_roof_67', 1, 2),
        // pillars
        locItem('stave_beam_67', 1, 25),
        locItem('stave_beam_4m', 1, 6),
        locItem('stave_beam_2m', 1, 2),
        locItem('stave_beam_45', 1, 7),
        // poles
        locItem('stave_pole_4m', 1, 15),
        // floor
        locItem('wood_floor', 1, 8),
        // entry
        locItem('darkwood_gate', 1, 2),
        locItem('stave_beam_4m', 1, 1),
        // beams
        locItem('stave_beam_4m', 1, 8),
        // ladders
        locItem('wood_stepladder', 1, 7),
        locItem('wood_floor_1x1', 1, 7),
        // RANDOM SPAWNS
        // top
        locItem([
          locItem('stave_beam_4m'),
          locItem('darkwood_roof_icorner_67'),
          locItem('darkwood_roof_67'),
        ], 0.4),
        // top
        locItem([
          locItem('scale_wall_2x2'),
          locItem('darkwood_roof_67', 1, 2),
        ], 0.5),
        // outcropping
        locItem([
          locItem('stave_beam_67', 1, 2),
          locItem('scale_wall_roof_67'),
          locItem('scale_wall_roof_67_flipped'),
          locItem('scale_halfwall_1x2', 1, 2),
          locItem('scale_quarterwall_1x1', 1, 2),
          locItem('darkwood_roof_67', 1, 2),
          locItem('darkwood_roof_icorner_67'),
          locItem('scale_wall_2x2', 1, 2),
          locItem('stave_beam_4m'),
          locItem('stave_pole_2m'),
          locItem('stave_beam_2m'),
          locItem('stave_beam_45'),
        ], 0.6),
        // outcropping
        locItem([
          locItem('stave_beam_67', 1, 2),
          locItem('darkwood_roof_67', 1, 2),
          locItem('scale_wall_roof_67'),
          locItem('scale_wall_2x2', 1, 2),
          locItem('stave_pole_2m'),
        ], 0.7),
        // wall
        locItem([
          locItem('stave_wall_2x2', 1, 5),
          locItem('stave_pole_4m'),
        ], 0.6),
        // pillar
        locItem([
          locItem('stave_beam_67', 1, 3),
          locItem('stave_beam_4m', 1, 2),
        ], 0.5),
        // WallSnow
        locItem('WallSnow2', 0.5),
        locItem('WallSnow3', 0.5, 12),
        locItem('WallSnow1', 0.5, 2),
      ],
      dist: [0, 1],
    },
  ],
  inner: [
    {
      id: 'granary',
      theme: Theme.NorthVillage,
      size: [15, 15, 15],
      weight: 2,
      items: [
        // base
        locItem('stave_pole_2m', 1, 8),
        locItem('stave_beam_4m', 1, 4),
        locItem('stave_beam_2m', 1, 6),
        locItem('wood_stair', 1, 2),
        // floor
        locItem('wood_floor', 1, 12),
        locItem('stave_beam_4m', 1, 6),
        // -> beams
        locItem('stave_beam_4m', 1, 4),
        locItem('stave_beam_2m', 1, 6),
        // floor (1)
        locItem('wood_floor'),
        locItem('stave_beam_4m', 1, 2),
        // walls
        locItem('scale_wall_2x2', 1, 12),
        locItem('scale_halfwall_1x2', 1, 10),
        locItem('stave_pole_4m', 1, 7),
        // roof
        locItem('wood_roof', 1, 7),
        locItem('scale_wall_roof_26', 1, 2),
        locItem('scale_halfwall_1x2', 1, 1),
        locItem('scale_wall_roof_26_flipped', 1, 1),
        locItem('stave_beam_26', 1, 6),
        locItem('stave_beam_2m', 1, 2),
        locItem('stave_beam_4m', 1, 1),
        // decor
        locItem('loot_deepNorth_Granary', 0.5, 10),
        locItem('prop_piece_cookingstation', 0.5),
        // random spawn
        locItem([
          locItem('wood_roof', 1, 3),
        ], 0.5),
        locItem([
          locItem('scale_halfwall_1x2', 1, 3),
          locItem('scale_wall_roof_26_flipped'),
          locItem('scale_wall_roof_26'),
          locItem('stave_wall_cross_26'),
        ], 0.4),
        locItem([
          locItem('stave_beam_2m'),
          locItem('stave_wall_cross_26'),
          locItem('stave_beam_26', 1, 2),
          locItem('scale_halfwall_1x2'),
          locItem('scale_wall_roof_26'),
          locItem('scale_wall_roof_26_flipped', 1, 2),
          locItem('wood_roof'),
        ], 0.6),
        locItem([
          locItem('wood_floor', 1, 3),
          locItem('stave_wall_2x2'),
          locItem('scale_halfwall_1x2'),
          locItem('wood_roof'),
          locItem('stave_beam_4m'),
          locItem('TreasureChest_deepnorth_village'),
        ], 0.8),
        locItem([
          locItem('scale_halfwall_1x2', 1, 2),
          locItem('wood_door'),
          locItem('stave_pole_4m'),
          locItem('stave_beam_2m'),
        ], 0.8),
        // WallSnow
        locItem('WallSnow2', 0.5, 4),
        locItem('WallSnow3', 0.5, 4),
        locItem('WallSnow1', 0.5, 3),
      ],
      dist: [0, 1],
    },
    {
      id: 'house1',
      theme: Theme.NorthVillage,
      size: [14, 20, 17],
      weight: 25,
      items: [
        // walls
        // - wall x3
        locItem('stave_wall_2x2', 1, 32),
        locItem('stave_beam_4m', 1, 2),
        // - upper x2
        locItem('scale_wall_roof_45', 1, 4),
        locItem('scale_wall_roof_45_flipped', 1, 2),
        locItem('stave_beam_45', 1, 8),
        locItem('stave_wall_cross_45', 1, 1),
        locItem('scale_wall_2x2', 1, 2),
        // roof
        locItem('darkwood_roof_45', 1, 18),
        locItem('stave_beam_4m', 1, 2),
        // entry
        locItem('stave_wall_2x2', 1, 4),
        locItem('darkwood_roof_45'),
        locItem('darkwood_roof_top_45'),
        locItem('darkwood_gate', 1, 2),
        locItem('stave_beam_4m', 1, 2),
        locItem('stave_deco_wall_2x2', 1, 2),
        locItem('stave_pole_2m'),
        // top
        locItem('stave_beam_67', 1, 2),
        locItem('stave_wall_cross_67'),
        locItem('darkwood_roof_67'),
        locItem('stave_pole_2m', 1, 4),
        locItem('scale_wall_roof_45_upsidedown', 1, 2),
        locItem('scale_wall_roof_45_upsidedown_flipped', 1, 2),
        locItem('scale_wall_2x2', 1, 3),
        locItem('stave_beam_45', 1, 4),
        // pillars
        locItem('stave_pole_4m', 1, 4),
        // floor
        locItem('wood_floor', 1, 24),
        locItem('wood_stair'),
        locItem('wood_wall_half', 1, 3),
        locItem('stave_deco_beam_2m', 1, 2),
        locItem('stave_beam_2m', 1, 3),
        // inside
        locItem('prop_chest_warderobe', 0.5),
        // - trophies
        locItem('prop_itemstand_TrophyGreydwarf', 0.75),
        locItem('prop_itemstand_TrophyGoblinShaman', 0.5),
        locItem('prop_itemstand_TrophyDraugrElite', 0.4),
        locItem('prop_itemstand_TrophySeekerBrute', 0.3),
        // -
        locItem('rug_wolf', 0.5),
        // - upper
        locItem([
          locItem('prop_bed02', 0.5),
          locItem('jute_carpet', 0.5),
          locItem('piece_banner04', 0.5, 2),
        ], 0.5),
        // - seating
        locItem([
          locItem('piece_table'),
          locItem('prop_piece_chair03', 0.5, 4),
          locItem('prop_FeastMeadows', 0.5),
        ], 0.5),
        locItem('prop_Tankard', 0.5, 3),
        locItem('TreasureChest_deepnorth_village', 0.5),
        locItem('prop_piece_brazierfloor01'),
        // RANDOM SPAWNS
        // outside
        locItem([
          locItem('rug_straw', 0.5, 3),
          locItem('prop_wood_stack', 0.5),
          locItem('prop_piece_workbench_ext1', 0.5),
          locItem('prop_piece_workbench_ext3', 0.5),
        ], 0.4),
        // top
        locItem([
          locItem('darkwood_roof_67', 1, 3),
          locItem('stave_beam_67', 1, 2),
          locItem('stave_wall_cross_67'),
          locItem('scale_wall_2x2'),
          locItem('stave_beam_4m'),
        ], 0.5),
        // roof
        locItem([
          locItem('darkwood_roof_45', 1, 2),
        ], 0.5),
        // upper wall
        locItem([
          locItem('scale_wall_2x2', 1, 2),
          locItem('scale_wall_roof_45_flipped', 1, 2),
          locItem('stave_beam_45', 1, 2),
        ], 0.5),
        // entry
        locItem([
          locItem('darkwood_roof_45'),
          locItem('stave_beam_45', 1, 4),
          locItem('stave_pole_2m'),
        ], 0.5),
        // inside
        locItem('wood_wall_half'),
        locItem('stave_deco_beam_2m'),
        // spawners
        locItem('ShadowPerson', 0.5, 3),
        // WallSnow
        locItem('WallSnow2', 0.5, 5),
        locItem('WallSnow3', 0.5, 5),
        locItem('WallSnow1', 0.5, 2),
      ],
      dist: [0, 1],
    },
    {
      id: 'house2',
      theme: Theme.NorthVillage,
      size: [16, 15, 22],
      weight: 25,
      items: [
        // walls
        // - wall x4
        locItem('stave_wall_2x2', 1, 18),
        locItem('stave_beam_4m', 1, 2),
        // - upper x2
        locItem('scale_wall_roof_67', 1, 3),
        locItem('scale_wall_roof_67_flipped', 1, 3),
        locItem('scale_wall_2x2', 1, 6),
        locItem('stave_beam_67', 1, 12),
        locItem('scale_halfwall_1x2', 1, 2),
        locItem('stave_wall_cross_67', 1, 2),
        // roof -> roof x2
        locItem('darkwood_roof_67', 1, 16),
        // - beam
        locItem('stave_beam_4m', 1, 3),
        // entry
        // - roof
        locItem([
          locItem('darkwood_roof_45'),
          locItem('darkwood_roof_top_45'),
          locItem('stave_beam_45'),
        ]),
        locItem('stave_deco_wall_2x2', 1, 2),
        locItem('wood_gate', 1, 2),
        locItem('stave_pole_4m', 1, 3),
        // pillars
        locItem('stave_pole_2m', 1, 4),
        // floor
        locItem('wood_floor', 1, 24),
        // decor
        // - bed
        locItem([
          locItem('prop_bed02', 0.5),
          locItem('piece_table', 0.5),
        ], 0.5),
        // - workarea
        locItem([
          locItem('prop_piece_workbench_ext2', 0.5),
          locItem('rug_wolf', 0.5),
          locItem('prop_piece_workbench_ext4', 0.5),
          locItem('TreasureChest_deepnorth_village', 0.5),
        ], 0.5),
        // - blue
        locItem([
          locItem('jute_carpet_blue', 0.5),
          locItem('piece_banner02', 0.5, 3),
        ], 0.5),
        // - seats
        locItem([locItem('piece_blackwood_bench01', 0.5, 2)], 0.5),
        locItem('prop_FeastAshlands', 0.5),
        locItem('prop_Tankard', 0.5, 4),
        locItem('prop_piece_brazierfloor01', 0.5),
        // - trophies
        locItem('prop_itemstand', 0.2),
        locItem('prop_itemstand', 0.4),
        locItem('prop_itemstand', 0.5),
        // RANDOM SPAWNS
        // outside
        locItem([
          locItem('prop_hearth', 0.5),
          locItem('prop_forge_ext5', 0.5),
          locItem('prop_forge_ext2', 0.5),
          locItem('loot_deepNorth_TimberHall', 0.5, 6),
        ], 0.15),
        // entry
        locItem([
          locItem('darkwood_roof_45'),
          locItem('stave_beam_45'),
          locItem('stave_pole_4m'),
          locItem('stave_wall_cross_45'),
        ], 0.6),
        // roof
        locItem([
          locItem('darkwood_roof_67', 1, 3),
        ], 0.7),
        // upper
        locItem([
          locItem('darkwood_roof_67', 1, 4),
        ], 0.4),
        // upper
        locItem([
          locItem('darkwood_roof_67'),
          locItem('scale_wall_roof_67'),
          locItem('scale_wall_roof_67_flipped'),
        ], 0.8),
        locItem('ShadowPerson', 0.5, 3),
        // WallSnow
        locItem('WallSnow3', 0.5, 11),
        locItem('WallSnow1', 0.5, 3),
      ],
      dist: [0, 1],
    },
    {
      id: 'stable',
      theme: Theme.NorthVillage,
      size: [14, 14, 14],
      weight: 2,
      items: [
        // house
        // poles
        locItem('stave_pole_4m', 1, 3),
        // decor
        locItem('rug_straw', 0.75, 10),
        // beams x2
        locItem('stave_beam_4m', 1, 2),
        locItem('stave_beam_2m', 1, 2),
        locItem('stave_beam_26', 1, 6),
        locItem('stave_wall_cross_26'),
        // roof
        locItem('wood_roof', 1, 9),
        // random spawn x3
        locItem([
          locItem('stave_beam_2m'),
          locItem('wood_roof', 1, 3),
          locItem('stave_beam_26'),
          locItem('stave_wall_cross_26'),
        ], 0.4),
        locItem([
          locItem('stave_beam_4m'),
          locItem('stave_pole_4m'),
          locItem('stave_beam_26'),
        ], 0.6),
        locItem([
          locItem('stave_deco_wall_2x2', 1, 4),
        ], 0.3),
        // bushes
        locItem('LingonberryBush', 0.5, 4),
        // WallSnow
        locItem('WallSnow2', 0.5, 2),
        locItem('WallSnow3', 0.5, 6),
      ],
      dist: [0, 1],
    },
    {
      id: 'turnipfield',
      theme: Theme.NorthVillage,
      size: [12, 8, 9],
      weight: 1,
      items: [
        locItem('ShadowPerson', 0.5, 2),
        locItem('wood_fence', 0.9, 10),
        locItem('wood_fence', 0.5, 2),
        locItem('Bush01_deepnorth', 0.6, 2),
        locItem('Bush01_deepnorth', 0.7, 2),
        locItem('Bush01_deepnorth', 0.9, 2),
        locItem('Bush01_deepnorth', 0.8, 2),
      ],
      dist: [0, 1],
    },
    {
      id: 'woodpile',
      theme: Theme.NorthVillage,
      size: [10, 8, 10],
      weight: 1,
      items: [
        locItem('wood_stack', 0.66, 4),
        locItem('wood_stack'),
      ],
      dist: [0, 1],
    },
  ],
};
