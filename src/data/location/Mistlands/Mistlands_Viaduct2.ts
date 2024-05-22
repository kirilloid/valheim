import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  6, 'Mistlands_Viaduct2', ['Mistlands'],
  { type: 'misc',
    biomeArea: 2, quantity: 150, group: 'Harbour', minApart: 64,
    terrainDelta: [4, 40], minAlt: -1, maxAlt: 25, radius: [20, 8],
    items: [
      // bridge
      locItem('iron_wall_2x2'),
      locItem('vines', 1, 12),
      locItem('blackmarble_out_1', 1, 4),
      locItem('blackmarble_outcorner', 1, 5),
      locItem('blackmarble_2x2x2', 1, 19),
      locItem('blackmarble_2x2x2', 0.5, 7),
      locItem('blackmarble_arch', 0.9, 12),
      locItem('blackmarble_head_big02'),
      locItem('blackmarble_head_big01'),
      locItem('iron_floor_2x2', 1, 16),
      locItem([
        locItem('blackmarble_2x2x2', 0.5),
        locItem('iron_floor_2x2'),
      ], 0.5),

      // pillar
      locItem('blackmarble_out_1', 1, 16),
      locItem('blackmarble_2x2x2', 1, 19),
      locItem('blackmarble_2x2_enforced', 1, 8),
      locItem('blackmarble_column_3', 1, 4),
      locItem('cliff_mistlands2'),
      locItem('blackmarble_outcorner', 1, 3),
      locItem('vines', 1, 87),
      locItem('iron_wall_2x2', 1, 25),
      // MIST AREA R=20 chance=0.25
    ],
  },
  'Mistlands_Viaduct',
);
