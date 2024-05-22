import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  6, 'Mistlands_RockSpire1', ['Mistlands'],
  { type: 'misc',
    biomeArea: 2, quantity: 200, minApart: 60,
    terrainDelta: [2, 99], minAlt: -10, radius: [20, 4],
    items: [
      locItem('cliff_mistlands2', 1, 10),
      locItem([
        locItem('blackmarble_post01'),
        locItem('dverger_demister'),
      ], 0.2, 2),
      locItem([ // statues
        // statue (1)
        locItem('blackmarble_head_big02'),
        locItem([ // random
          locItem('blackmarble_floor'),
          locItem('blackmarble_column_1', 0.5),
        ], 0.5),
        locItem('blackmarble_2x2x2'),
        // statue (2)
        locItem('blackmarble_head_big01'),
        locItem('blackmarble_slope_1x2', 0.5),
        locItem('blackmarble_2x2x2'),
      ], 0.2),
      locItem([ // statues
        // statue (3)
        locItem('blackmarble_head_big02'),
        locItem('blackmarble_column_2', 0.5),
        locItem('blackmarble_2x2x2'),
        // statue (4)
        locItem([ // random
          locItem('blackmarble_floor'),
          locItem('blackmarble_slope_1x2', 0.5),
        ], 0.5),
        locItem('blackmarble_head_big01'),
        locItem('blackmarble_2x2x2'),
      ], 0.2),
    ],
  },
  'Mistlands_RockSpire',
);
