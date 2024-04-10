import { locItem } from '../../model/game';

import { CampConfig, Theme } from './types';

export const woodvillage: CampConfig = {
  type: 'camp',
  prefix: `meadowsvillage_`,
  perimeter: [
    {
      id: 'house2',
      theme: Theme.MeadowsVillage,
      size: [13, 8, 13],
      weight: 40,
      items: [
        // house
        locItem('wood_floor', 1, 12),
        locItem('goblin_bed', 0.5, 2),
        locItem('wood_door', 0.5),
        locItem('wood_roof_45', 0.8, 8),
        locItem('woodwall', 1, 15),
        locItem('wood_roof_top_45', 0.5, 3),
        locItem('wood_roof_top_45', 0.66),
        locItem('wood_beam_45', 1, 14),
        locItem('wood_wall_roof_top_45', 0.75, 3),
        locItem('wood_wall_roof_45', 1, 4),
        locItem('Beehive', 0.2),
        locItem('wood_pole2', 1, 4),
        // 
        locItem('TreasureChest_meadows', 0.5),
        locItem('Spawner_Draugr_Ranged'),
        locItem('Spawner_Draugr', 0.75, 2),
      ],
      dist: [0.73, 0.27],
    },
    {
      id: 'road1',
      theme: Theme.MeadowsVillage,
      size: [4, 8, 17],
      weight: 5,
      items: [
        locItem('stake_wall', 1, 2),
        locItem('wood_pole_log_4', 1, 2),
        locItem('wood_gate', 1, 2),
      ],
      dist: [0.53, 0.40, 0.07],
    },
    {
      id: 'stakewall3',
      theme: Theme.MeadowsVillage,
      size: [8, 8, 3],
      weight: 5,
      items: [
        locItem('stake_wall', 0.66, 3),
        locItem('stake_wall', 0.5, 2),
      ],
      dist: [0.07, 0.13, 0.40, 0.07, 0.33],
    },
    {
      id: 'tower',
      theme: Theme.MeadowsVillage,
      size: [9, 8, 9],
      weight: 5,
      items: [
        // walls
        locItem('woodwall', 1, 18),
        locItem('wood_wall_half', 0.75, 8),
        // floor
        locItem('wood_floor', 1, 6),
        locItem('wood_floor_1x1', 1, 6),
        locItem('wood_stepladder', 1, 3),
        locItem('wood_door'),
        // roof
        locItem('wood_beam_45', 0.5, 4),
        locItem('wood_roof_45', 0.5, 4),
        locItem('wood_beam', 1, 2),
        locItem('wood_pole_log_4', 1, 4),
        locItem('wood_wall_roof_45', 1, 4),
        locItem('Beehive', 0.33),
        // frame
        locItem('woodwall', 1, 5),
        locItem('wood_pole_log_4', 1, 4),
        // enemies
        locItem('Spawner_Draugr', 0.75, 2),
        locItem('Spawner_Draugr_Ranged', 0.9, 2),
      ],
      dist: [0.67, 0.27, 0.06],
    },
    {
      id: 'towerruin',
      theme: Theme.MeadowsVillage,
      size: [15, 8, 15],
      weight: 5,
      items: [
        // walls
        locItem('woodwall', 1, 10),
        locItem('woodwall', 0.75, 1),
        locItem('woodwall', 0.5, 3),
        // floor
        locItem('wood_floor', 1, 4),
        locItem('wood_door'),
        locItem('wood_stepladder', 1, 2),
        locItem('wood_floor_1x1'),
        // roof
        locItem('wood_pole_log_4'),
        locItem('Beehive', 0.33),
        
        // frame
        locItem('wood_pole_log_4', 1, 3),
        locItem('woodwall', 0.75, 2),
        // enemies
        locItem('Spawner_Draugr', 0.5, 2),
      ],
      dist: [1],
    },
  ],
  inner: [
    {
      id: 'greathall',
      theme: Theme.MeadowsVillage,
      size: [16, 8, 20],
      weight: 1,
      items: [
        // walls
        locItem('woodwall', 1, 34),
        locItem('wood_gate', 1, 2),
        locItem('wood_wall_half', 1, 2),
        // floor
        locItem('wood_floor', 1, 30),
        locItem('wood_wall_half', 1, 6),
        locItem('wood_beam', 1, 4),
        locItem('wood_pole', 1, 2),
        locItem('wood_stair', 1, 2),
        locItem('wood_floor_1x1', 1, 8),
        // roof
        locItem('wood_roof_45', 1, 12),
        locItem('wood_wall_roof_45', 1, 16),
        locItem('wood_roof_ocorner', 0.75, 4),
        locItem('wood_roof', 0.75, 12),
        locItem('wood_roof_icorner', 1, 5),
        locItem('wood_beam_45', 1, 10),
        locItem('wood_beam', 1, 7),
        // randomroof
        locItem([
          locItem('wood_beam_45', 1, 8),
          locItem('wood_roof_45', 1, 5),
          locItem('wood_beam', 1, 6),
          locItem('woodwall', 1, 8),
          locItem('wood_pole2', 1, 2),
        ], 0.5),
        // randomroof2
        locItem('wood_roof_45', 1, 7),
        // furniture
        locItem('piece_throne01', 0.5),
        locItem('piece_chair02', 0.5, 6),
        locItem('stone_wall_2x1', 1, 4),
        locItem('stone_wall_1x1', 1, 2),
        // spawners
        locItem('Spawner_DraugrPile'),
        locItem('Spawner_Draugr', 0.75, 3),
        locItem('Spawner_Draugr_Ranged', 0.75, 2),
        locItem('Spawner_Draugr_Elite'),
        locItem('TreasureChest_meadows', 0.75, 3),
      ],
      dist: [0.4, 0.6],
    },
    {
      id: 'greathallruin',
      theme: Theme.MeadowsVillage,
      size: [16, 8, 20],
      weight: 1,
      items: [
        // walls
        locItem('woodwall', 1, 30),
        locItem('woodwall', 0.5, 4),
        locItem('wood_gate', 1, 2),
        locItem('wood_wall_half', 1, 2),
        // floor
        locItem('wood_floor', 0.5, 24),
        locItem('wood_floor', 1, 2),
        locItem('wood_wall_half', 1, 6),
        locItem('wood_beam'),
        locItem('wood_pole', 1, 2),
        locItem('wood_stair'),
        locItem('wood_stair', 0.5),
        locItem('wood_floor_1x1', 1, 8),
        // roof
        locItem('wood_roof_45', 0.5, 6),
        locItem('wood_roof_45', 0.75, 2),
        locItem('wood_roof', 0.5, 12),
        locItem('wood_roof_ocorner', 0.5, 4),
        locItem('wood_roof_icorner', 0.5, 2),
        locItem('wood_roof_icorner_45', 0.5),
        locItem('wood_roof_icorner_45'),
        locItem('wood_beam_45', 1, 4),
        locItem('wood_wall_roof_45', 1, 3),
        locItem('wood_wall_roof_45', 0.75),
        // randomroof
        locItem([
          locItem('wood_beam', 1, 3),
          locItem('wood_beam_45', 1, 2),
          locItem('wood_roof_45', 1, 2),
        ], 0.5),
        // frame
        locItem('woodwall', 1, 2),
        locItem('woodwall', 0.5, 2),
        locItem('wood_pole_log_4', 1, 11),
        locItem('wood_pole_log_4', 0.5, 23),
        locItem('wood_beam_45', 1, 1),
        locItem('wood_beam_45', 0.5, 7),
        // furniture
        locItem('piece_chair02', 0.5, 3),
        locItem('stone_wall_2x1', 0.5, 4),
        locItem('stone_wall_1x1', 0.5, 2),
        // spawners
        locItem('Spawner_DraugrPile'),
        locItem('Spawner_Draugr', 0.75, 2),
        locItem('Spawner_Draugr_Ranged', 0.75),
        // 
        locItem('Beehive', 0.33),
      ],
      dist: [0.67, 0.27, 0.06],
    },
    {
      id: 'house1',
      theme: Theme.MeadowsVillage,
      size: [13, 8, 13],
      weight: 1,
      items: [
        // house
        locItem('wood_floor', 1, 12),
        locItem('goblin_bed', 0.5, 2),
        locItem('wood_door', 0.5),
        locItem('wood_roof_45', 0.8, 8),
        locItem('woodwall', 1, 15),
        locItem('wood_roof_top_45', 0.5, 2),
        locItem('wood_roof_top_45', 0.66),
        locItem('wood_roof_top_45', 0.8),
        locItem('wood_beam_45', 1, 14),
        locItem('wood_wall_roof_top_45', 0.75, 2),
        locItem('wood_wall_roof_top_45', 0.5),
        locItem('wood_wall_roof_45', 1, 4),
        locItem('Beehive', 0.2),
        locItem('wood_pole2', 1, 4),
        // 
        locItem('TreasureChest_meadows', 0.5),
        locItem('Spawner_Draugr_Ranged'),
        locItem('Spawner_Draugr', 0.75, 2),
      ],
      dist: [0.07, 0.20, 0.40, 0.13, 0.20],
    },
    {
      id: 'longhouse',
      theme: Theme.MeadowsVillage,
      size: [16, 8, 16],
      weight: 1,
      items: [
        // house
        // floor
        locItem('wood_floor', 1, 24),
        // walls
        locItem('woodwall', 1, 22),
        locItem('woodwall', 0.5, 2),
        locItem('wood_door'),
        locItem('wood_pole_log_4', 1, 4),
        locItem('wood_pole2', 1, 22),
        // roof
        locItem('wood_beam_45', 0.75, 15),
        locItem('wood_beam_45', 1, 5),
        locItem('wood_beam_26', 1, 6),
        locItem('wood_beam'),
        locItem('wood_wall_roof_45', 1, 4),
        // randomroof
        locItem([
          locItem('wood_roof', 1, 8),
          locItem('wood_roof_45', 1, 2),
          locItem('wood_beam'),
        ], 0.5),
        // randomroof2
        locItem([
          locItem('wood_roof', 0.5, 4),
          locItem('wood_roof', 1, 2),
          locItem('wood_beam_26', 1, 2),
        ], 0.5),
        // randomroof3
        locItem([
          locItem('wood_beam', 1, 4),
          locItem('wood_beam_26', 1, 4),
        ], 0.5),
        // furniture
        locItem('piece_chair', 0.5),
        locItem('piece_chair02', 0.5, 2),
        locItem('piece_table', 0.5),
        locItem('TreasureChest_meadows', 0.75),
        locItem('goblin_bed', 0.5, 3), // double spawn chance script
        // enemies
        locItem('Spawner_DraugrPile'),
        locItem('Spawner_Draugr', 0.75, 2),
        locItem('Spawner_Draugr_Ranged', 0.75, 2),
        locItem('Spawner_Draugr_Elite', 0.75),
      ],
      dist: [0.33, 0.40, 0.27],
    },
    {
      id: 'longhouseruin',
      theme: Theme.MeadowsVillage,
      size: [16, 8, 16],
      weight: 1,
      items: [
        // house
        // floor
        locItem('wood_floor', 1, 24),
        locItem('woodwall', 1, 20),
        locItem('wood_pole_log_4', 1, 4),
        locItem('wood_pole2', 1, 10),
        locItem('wood_door'),
        // roof
        locItem('wood_beam_45', 0.5, 4),
        locItem('wood_beam_45', 1, 16),
        locItem('wood_roof_45', 0.5, 12),
        locItem('wood_wall_roof_45', 0.5, 4),
        locItem('wood_roof', 0.5, 4),
        // furniture
        locItem('piece_chair', 0.5),
        locItem('piece_chair02', 0.5, 2),
        locItem('piece_table', 0.5),
        locItem('goblin_bed', 0.5, 3), // double spawn chance script
        locItem('Beehive', 0.33),
        // enemies
        locItem('Spawner_DraugrPile', 0.5),
        locItem('Spawner_Draugr', 0.75),
        locItem('Spawner_Draugr_Ranged', 0.75),
      ],
      dist: [0.2, 0.6, 0.2],
    },
  ],
};
