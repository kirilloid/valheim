import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  6, 'Mistlands_Viaduct1', ['Mistlands'],
  { type: 'misc',
    biomeArea: 2, quantity: 100, group: 'Harbour', minApart: 128,
    randomRotation: false, slopeRotation: true,
    terrainDelta: [2, 40], minAlt: -1, maxAlt: 15, radius: [20, 24],
    items: [
      locItem([ // GameObject
        // bridge
        locItem('blackmarble_arch', 0.9, 12),
        locItem('blackmarble_2x2x2', 1, 20),
        locItem('blackmarble_head_big02'),
        locItem('blackmarble_head_big01'),
        locItem('iron_floor_2x2', 1, 14),
        // pillar
        locItem('blackmarble_outcorner', 1, 8),
        locItem('blackmarble_out_1', 1, 20),
        locItem('blackmarble_2x2x2', 1, 21),
        locItem('blackmarble_2x2_enforced', 1, 8),
        locItem('cliff_mistlands2'),
        locItem('iron_wall_2x2', 1, 26),
        locItem('vines', 1, 89),
      ]),
      locItem([ // GameObject (1)
        // bridge
        locItem('blackmarble_arch', 0.9, 8),
        locItem('blackmarble_2x2x2', 1, 16),
        locItem('blackmarble_2x2x2', 0.5, 4),
        locItem('vines', 0.5, 14),
        locItem('iron_floor_2x2', 1, 14),
        locItem('iron_wall_2x2', 1, 2),
        locItem([ // random (0) + (1)
          locItem('blackmarble_arch', 0.9, 2),
          locItem('blackmarble_2x2x2'),
          locItem('iron_floor_2x2'),
        ], 0.5, 2),
        locItem([ // random (2) + (3)
          locItem('blackmarble_2x2x2', 0.5),
          locItem('iron_floor_2x2'),
        ], 0.5, 2),
        locItem([ // random
          locItem('blackmarble_2x2x2', 1, 3),
          locItem('blackmarble_outcorner', 1, 2),
          locItem('blackmarble_head_big02'),
          locItem('blackmarble_arch', 0.9, 2),
        ], 0.5),
        locItem([ // random
          locItem('blackmarble_arch', 0.9, 2),
          locItem('blackmarble_2x2x2', 1, 2),
          locItem('blackmarble_head_big01'),
          locItem('blackmarble_outcorner', 1, 2),
          locItem('blackmarble_2x2x1'),
        ], 0.5),
        locItem('blackmarble_out_1', 1, 7),
        locItem('blackmarble_2x2x1'),
        locItem('blackmarble_outcorner', 1, 4),
        // pillar
        locItem('blackmarble_out_1', 1, 13),
        locItem('blackmarble_2x2x2', 1, 18),
        locItem('blackmarble_2x2_enforced', 1, 8),
        locItem('blackmarble_column_3', 1, 4),
        locItem('blackmarble_2x2x1', 1, 2),
        locItem('iron_wall_2x2', 1, 24),
        locItem('vines', 1, 75),
        locItem('cliff_mistlands2'),
      ], 0.8),
      locItem([ // GameObject (2)
        // bridge
        locItem('vines', 0.5, 36),
        locItem('blackmarble_arch', 0.9, 4),
        locItem('blackmarble_2x2x2', 1, 19),
        locItem('blackmarble_2x2x2', 0.5, 3),
        locItem([ // random (0) + (1)
          locItem('blackmarble_arch', 0.9, 2),
          locItem('blackmarble_2x2x2'),
          locItem('iron_floor_2x2'),
        ], 0.5, 2),
        locItem('iron_floor_2x2', 1, 14),
        locItem('blackmarble_out_1', 20),
        locItem('blackmarble_outcorner', 1, 4),
        locItem('blackmarble_2x2x1', 1, 3),
        locItem('blackmarble_2x2_enforced', 1, 2),
        locItem('iron_wall_2x2', 1, 7),
        locItem([ // random
          locItem('blackmarble_arch', 0.9, 4),
          locItem('blackmarble_2x2x2', 1, 3),
          locItem('blackmarble_2x2x2', 0.5),
          locItem([
            locItem('blackmarble_2x2x2', 0.5),
            locItem('iron_floor_2x2'),
          ], 0.5, 2),
        ], 0.5, 2),
        locItem([ // random
          locItem('blackmarble_arch', 0.9, 2),
          locItem('blackmarble_2x2x2', 1, 3),
          locItem('blackmarble_head_big02'),
          locItem('blackmarble_outcorner', 1, 2),
        ], 0.5),
        locItem([ // random
          locItem('blackmarble_arch', 0.9, 2),
          locItem('blackmarble_head_big01'),
          locItem('blackmarble_2x2x2', 1, 3),
          locItem('blackmarble_outcorner', 1, 2),
          locItem('blackmarble_2x2x1'),
        ], 0.5),
        // pillar
        locItem('vines', 1, 53),
        locItem('blackmarble_2x2_enforced', 1, 6),
        locItem('cliff_mistlands2'),
        locItem('blackmarble_column_3', 1, 4),
        locItem('blackmarble_2x2x2', 1, 11),
        locItem('iron_wall_2x2', 1, 19),
      ], 0.8),
      // MIST AREA R=30 chance=0.25
    ],
  },
  'Mistlands_Viaduct',
);
