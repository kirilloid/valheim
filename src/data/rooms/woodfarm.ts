import { locItem } from '../../model/game';

import { CampConfig, Theme } from './types';

export const woodfarm: CampConfig = {
  type: 'camp',
  prefix: `woodfarm_`,
  perimeter: [
    {
      id: 'outhouse',
      theme: Theme.MeadowsFarm,
      size: [10, 8, 10],
      weight: 0.5,
      items: [
        locItem('Mushroom', 0.33, 4),
      ],
      dist: [1],
    },
    {
      id: 'tower',
      theme: Theme.MeadowsFarm,
      size: [13, 8, 13],
      weight: 10,
      items: [
        locItem([ // random_roof
          locItem('wood_pole'),
          locItem('wood_roof_top_45'),
          locItem('wood_wall_roof_top_45', 1, 2),
        ], 0.5),
        locItem('wood_pole', 1, 7),
        locItem('wood_wall_half', 1, 3),
        locItem('wood_floor'),
        locItem('wood_stepladder', 1, 2),
        locItem('wood_floor_1x1', 1, 2),
        locItem('wood_pole2', 1, 10),
        locItem('Beehive', 0.2),
      ],
      dist: [0.9, 0.1],
    },
    {
      id: 'fence1',
      theme: Theme.MeadowsFarm,
      size: [12, 8, 5],
      weight: 6,
      items: [
        locItem('wood_fence', 0.5, 5),
      ],
      dist: [0.4, 0.3, 0.3],
    },
    {
      id: 'fence2',
      theme: Theme.MeadowsFarm,
      size: [9, 8, 4],
      weight: 6,
      items: [
        locItem('wood_fence', 0.5, 3),
      ],
      dist: [0.2, 0.1, 0.4, 0.3],
    },
    {
      id: 'road1',
      theme: Theme.MeadowsFarm,
      size: [6, 8, 17],
      weight: 6,
      items: [
        // Signpost
        locItem([
          locItem('wood_pole2', 1, 2),
          locItem('sign_notext', 1, 3),
        ], 0.2),
      ],
      dist: [0.7, 0.3],
    },
  ],
  inner: [
    {
      id: 'turnipfield',
      theme: Theme.MeadowsFarm,
      size: [12, 8, 9],
      weight: 5,
      items: [
        locItem('wood_fence', 0.5, 12),
        locItem('Raspberry', 0.4, 6),
        locItem('Boar', 0.33),
      ],
      dist: [0.1, 0.1, 0.3, 0.3, 0, 0.1, 0, 0.1],
    },
    {
      id: 'farmhouse1',
      theme: Theme.MeadowsFarm,
      size: [15, 8, 15],
      weight: 8,
      items: [
        locItem('goblin_bed', 0.5),
        locItem('wood_door', 0.66),
        locItem('wood_roof_45', 0.8, 4),
        locItem('wood_roof_45', 0.66, 4),
        locItem('wood_roof_45', 1, 8),
        locItem('wood_beam_45', 1, 4),
        locItem('wood_wall', 1),
        locItem('wood_wall_roof_45', 1, 4),
        locItem('wood_wall_roof_top_45', 0.66, 2),
        locItem('wood_floor', 1, 12),
      ],
      dist: [0.5, 0.1, 0.2, 0.2],
    },
    {
      id: 'farmhouse2',
      theme: Theme.MeadowsFarm,
      size: [15, 8, 15],
      weight: 6,
      items: [
        locItem('goblin_bed', 0.5, 2),
        locItem('wood_door', 0.5),
        locItem('wood_roof_45', 0.8, 8),
        locItem('wood_roof_45', 1, 8),
        locItem('wood_beam_45', 1, 4),
        locItem('wood_wall_half', 1, 14),
        locItem('wood_wall_roof_45', 1, 4),
        locItem('wood_wall_roof_top_45', 0.75, 2),
        locItem('wood_floor', 1, 12),
        locItem('Beehive', 0.2),
        locItem('TreasureChest_meadows'),
      ],
      dist: [0.3, 0.4, 0.1, 0.1, 0.1],
    },
    {
      id: 'farmhouse3',
      theme: Theme.MeadowsFarm,
      size: [15, 8, 17],
      weight: 4,
      items: [
        locItem('goblin_bed', 0.5, 3),
        locItem('wood_door', 0.5),
        locItem('wood_floor', 1, 18),
        locItem('wood_roof_45', 0.8, 8),
        locItem('wood_roof_45', 1, 16),
        locItem('wood_roof_top_45', 0.8, 2),
        locItem('wood_wall_half', 1, 18),
        locItem('wood_wall_roof_top_45', 0.75, 2),
        locItem('wood_beam_45', 1, 4),
        locItem('wood_wall_roof_45', 1, 4),
        // random
        locItem([
          locItem('wood_roof_top_45', 0.8, 4),
        ], 0.5),
        locItem('TreasureChest_meadows', 0.9),
        locItem('Beehive', 0.2),
      ],
      dist: [0.6, 0.2, 0.2],
    },
    {
      id: 'signpost',
      theme: Theme.MeadowsFarm,
      size: [2, 8, 2],
      weight: 0.1,
      items: [
        locItem('wood_pole2', 1, 2),
        locItem('sign_notext', 1, 3),
      ],
      dist: [0.4, 0.4, 0.2],
    },
    {
      id: 'woodpile',
      theme: Theme.MeadowsFarm,
      size: [10, 8, 10],
      weight: 0.5,
      items: [
        locItem('wood_stack'),
        locItem('wood_stack', 0.5, 3),
      ],
      dist: [0.6, 0.3, 0.1],
    },
    {
      id: 'henpen',
      theme: Theme.MeadowsFarm,
      size: [15, 8, 15],
      weight: 3,
      items: [
        // random_roof
        locItem([
          locItem('wood_roof'),
          locItem('wood_wall_half', 1, 4),
          locItem('wood_wall_roof', 1, 2),
          locItem('wood_pole', 1, 9),
          locItem('wood_floor'),
        ], 0.75),
        locItem('Boar', 0.33, 2),
        locItem('wood_fence', 0.5, 15),
        locItem('Dandelion', 0.2, 6),
      ],
      dist: [0.6, 0.3, 0.1],
    },
    {
      id: 'yard',
      theme: Theme.MeadowsFarm,
      size: [15, 8, 15],
      weight: 3,
      items: [
        locItem('piece_maypole', 0.1),
        locItem('Boar', 0.33, 3),
        locItem('wood_fence', 0.5, 16),
      ],
      dist: [0.7, 0.2, 0.1],
    },
  ],
};
