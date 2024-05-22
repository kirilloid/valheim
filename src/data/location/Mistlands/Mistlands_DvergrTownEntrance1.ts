import { locItem } from '../../../model/game';
import { dvergrTown } from '../../rooms';
import { loc } from '../common';

export default loc(
  6, 'Mistlands_DvergrTownEntrance1', ['Mistlands'],
  { type: 'dungeon', components: ['DungeonGenerator'],
    biomeArea: 2, quantity: 120, prioritized: true, group: 'DvergrDungeon', minApart: 256,
    randomRotation: false, slopeRotation: true,
    terrainDelta: [5, 40], minAlt: 12, radius: [32, 20],
    items: [
      // fort
      locItem([ // gate
        locItem('blackmarble_floor_large'),
        locItem('blackmarble_2x2x2', 1, 4),
        locItem('blackmarble_2x2_enforced', 1, 4),
        locItem('blackmarble_slope_1x2', 1, 2),
        locItem('blackmarble_slope_inverted_1x2', 1, 2),
        locItem('blackmarble_2x2x1', 1, 7),
        locItem('blackmarble_head01'),
        locItem('blackmarble_stair'),
        locItem('blackmarble_base_2', 1, 3),
        locItem('dverger_demister_broken', 1, 2),
        locItem([ // vines1
          locItem('vines', 1, 4),
          locItem('vines', 0.5, 3),
        ], 0.4),
        locItem([ // vines2
          locItem('vines', 1, 4),
          locItem('vines', 0.5, 2),
        ], 0.4),
        locItem('blackmarble_base_2', 1, 3),
      ]),
      locItem([ // wall (x5)
        locItem('blackmarble_floor_large'),
        locItem('blackmarble_2x2x2', 1, 6),
        locItem('blackmarble_2x2_enforced', 1, 4),
        locItem('blackmarble_2x2x1', 1, 6),
        locItem('blackmarble_1x1', 1, 4),
        locItem('blackmarble_head02'),
        locItem([ // vines1
          locItem('vines', 1, 4),
          locItem('vines', 0.5, 3),
        ], 0.4),
        locItem([ // vines2
          locItem('vines', 1, 4),
          locItem('vines', 0.5, 2),
        ], 0.4),
        locItem('blackmarble_base_2', 1, 3),
      ], 1, 5),
      locItem([ // reinforce (x6)
        locItem([ // vines1
          locItem('vines', 1, 2),
          locItem('vines', 0.5, 2),
        ], 0.4),
        locItem('blackmarble_2x2x2', 1, 2),
        locItem('blackmarble_2x2_enforced', 1, 1),
        locItem('blackmarble_column_3', 1, 2),
        locItem('blackmarble_floor', 1, 1),
        locItem('blackmarble_base_2', 1, 2),
      ], 1, 6),
      locItem([ // floor (x2)
        locItem('blackmarble_floor_triangle', 1, 11),
        locItem('blackmarble_floor', 1, 21),
        locItem('blackmarble_2x2x1', 1, 18),
        locItem('blackmarble_2x2x2', 1, 3),
      ]),
      locItem([ // stair (x4)
        // stair
        locItem('blackmarble_column_3', 1, 2),
        // stair (1)
        locItem('blackmarble_stair'),
        locItem('blackmarble_stair_corner'),
        locItem('blackmarble_2x2x1'),
        locItem('blackmarble_floor', 1, 2),
        // stair (2)
        locItem('blackmarble_2x2x2', 1, 4),
        locItem('blackmarble_stair', 1, 2),
        locItem('blackmarble_stair_corner', 1, 2),
        locItem('blackmarble_floor'),
        // stair (3)
        locItem('blackmarble_stair', 1, 2),
        locItem('blackmarble_stair_corner'),
        locItem('blackmarble_2x2x1', 1, 3),
      ]),
      locItem([ // mine
        locItem('dvergrtown_wood_beam', 1, 2),
        locItem('dvergrtown_wood_support'),
        locItem('dvergrtown_2x2x1', 1, 2),
        locItem('dvergrtown_4x2x1', 1, 1),
        locItem('dvergrrock_curvedrock', 1, 11),
        locItem('CreepProp_hanging01', 0.6, 6),
        locItem([ // pillar
          locItem('CreepProp_pillarhalf02', 1, 2)
        ], 0.6, 2),
        locItem('CreepProp_wall01', 0.5, 2),
      ]),
      locItem([ // statues
        // statue
        locItem('blackmarble_head_big01'),
        locItem([ // random
          locItem('blackmarble_tip', 1, 4),
        ], 0.5),
        locItem('blackmarble_column_3'),
        locItem('vines', 1, 11),
        // statue (1)
        locItem('blackmarble_head_big02'),
        locItem([ // random
          locItem('blackmarble_floor'),
          locItem('blackmarble_column_1'),
        ], 0.5),
        locItem('blackmarble_column_3'),
        locItem('vines', 1, 11),
        // statue (2)
        locItem('blackmarble_head_big01'),
        locItem('blackmarble_slope_1x2', 0.5),
        locItem('blackmarble_column_3'),
        locItem('vines', 1, 7),
        // statue (3)
        locItem('blackmarble_head_big02'),
        locItem('vines', 1, 7),
        locItem('blackmarble_column_3'),
        locItem('blackmarble_column_2'),
        // statue (4)
        locItem('blackmarble_head_big01'),
        locItem([ // random
          locItem('blackmarble_floor'),
          locItem('blackmarble_slope_1x2', 0.5),
        ], 0.5),
        locItem('blackmarble_column_3'),
        locItem('vines', 1, 7),
        // statue (5)
        locItem('blackmarble_post01'),
        locItem('dverger_demister_ruins'),
      ]),
      locItem('Spawner_Seeker', 1, 5),
      locItem('dvergrprops_wood_stakewall', 0.66, 6),
    ],
    dungeon: dvergrTown,
  },
  'Mistlands_DvergrTown',
);
