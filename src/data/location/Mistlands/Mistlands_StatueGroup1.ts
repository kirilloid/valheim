import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  6, 'Mistlands_StatueGroup1', ['Mistlands'],
  { type: 'misc',
    biomeArea: 3, quantity: 200, minApart: 32,
    randomRotation: false, slopeRotation: true,
    terrainDelta: [0, 10], minAlt: 2, radius: [20, 16],
    items: [
      locItem('blackmarble_column_3', 1, 5),
      locItem([ // statue
        locItem('blackmarble_head_big01'),
        locItem([ // random
          locItem('blackmarble_tip', 1, 4),
        ], 0.5),
        locItem([ // random1
          locItem('blackmarble_slope_1x2', 1, 2),
          locItem('blackmarble_1x1', 1, 4),
        ], 0.5),
        locItem('vines', 0.5, 11),
      ]),
      locItem([ // statue (1)
        locItem('blackmarble_head_big02'),
        locItem([ // random
          locItem('blackmarble_floor'),
          locItem('blackmarble_column_1', 0.5),
        ], 0.5),
        locItem('vines', 0.5, 7),
      ], 0.8),
      locItem([ // statue (2)
        locItem('blackmarble_head_big01'),
        locItem('blackmarble_slope_1x2', 0.5),
        locItem('vines', 0.5, 7),
      ], 0.7),
      locItem([ // statue (3)
        locItem('blackmarble_head_big02'),
        locItem('vines', 0.5, 7),
        locItem('blackmarble_column_2', 0.5),
      ], 0.7),
      locItem([ // statue (4)
        locItem('blackmarble_head_big01'),
        locItem([ // random
          locItem('blackmarble_floor'),
          locItem('blackmarble_slope_1x2', 0.5),
        ], 0.5),
        locItem('vines', 0.5, 7),
      ], 0.7),
    ],
  },
  'Mistlands_Statue',
);
