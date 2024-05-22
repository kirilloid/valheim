import { locItem } from '../../../model/game';
import { dvergrTown } from '../../rooms';
import { loc } from '../common';

export default loc(
  6, 'Mistlands_DvergrBossEntrance1', ['Mistlands'],
  { type: 'dungeon',
    biomeArea: 2, quantity: 5, prioritized: true, group: 'DvergrBoss', minApart: 2048,
    randomRotation: false, slopeRotation: true,
    terrainDelta: [0, 40], maxAlt: 20, radius: [32, 32],
    // FIXME
    dungeon: undefined,
    items: [
      // fort
        // wall
          locItem('dvergrtown_4x2x1', 1, 6),
          locItem('dvergrtown_stair'),
          // pillar
          locItem([locItem('CreepProp_pillarhalf02', 1, 2)], 0.6),
          locItem('dvergrtown_base', 1, 4),
          locItem('dvergrtown_1x1x1', 1, 4),
          locItem('dvergrtown_2x2x2_enforced', 1, 8),
          locItem('blackmarble_head01'),
          locItem('CreepProp_hanging01', 0.6, 6),
          locItem('CreepProp_wall01', 0.5, 7),
          locItem('CreepProp_entrance1', 0.5, 7),
          locItem('CreepProp_entrance1', 0.5, 2),
          locItem('dverger_demister_broken'),
      locItem([ // room
        locItem('caverock_curvedwallbig', 1, 34),
        locItem('caverock_floorsmall'),
      ]),
      locItem([ // floor
        locItem('blackmarble_2x2x2', 1, 142),
        locItem('blackmarble_2x2x1', 1, 17),
        locItem('blackmarble_floor_triangle', 1, 4),
        locItem('blackmarble_floor_large', 1, 3),
        locItem('dvergrtown_floor_large', 1, 3),
      ]),
      locItem([ // wall
        locItem([ // wall (x7)
          locItem('blackmarble_2x2x1'),
          locItem('blackmarble_2x2x2', 1, 18),
          locItem('blackmarble_floor_large'),
          locItem('blackmarble_2x2_enforced', 1, 4),
          locItem('blackmarble_stair', 1, 4), // 18 + 2*7
          locItem('blackmarble_slope_1x2', 1, 2),
          locItem('blackmarble_slope_inverted_1x2', 1, 2),
          locItem('blackmarble_1x1', 1, 2),
          locItem('blackmarble_head01'),
          locItem([ // vines1
            locItem('vines', 1, 5),
            locItem('vines', 0.5, 1),
          ], 0.4),
          locItem([ // vines2
            locItem('vines', 1, 5),
          ], 0.4),
          locItem('blackmarble_base_1', 1, 2),
          locItem('dvergrprops_curtain'),
          locItem('dverger_demister_broken', 1, 2),
          locItem('blackmarble_floor_triangle'),
        ], 1, 8),
        locItem([ // reinforce _ & (3)
          locItem('blackmarble_floor_large', 1, 2),
          locItem([ // vines1
            locItem('vines', 1, 2),
            locItem('vines', 0.5, 3),
          ], 0.4),
          locItem('blackmarble_2x2x2', 1, 3),
          locItem('blackmarble_2x2_enforced'),
          locItem('dvergrprops_banner'),
          locItem('blackmarble_base_2', 1, 2),
          locItem('dverger_demister_ruins'),
          locItem('blackmarble_post01'),
        ], 1, 2),
        locItem([ // reinforce (1) & (4)
          locItem('blackmarble_floor_large', 1, 2),
          locItem([ // vines1
            locItem('vines', 1, 2),
            locItem('vines', 0.5, 3),
          ], 0.4),
          locItem('blackmarble_2x2x2', 1, 10),
          locItem('blackmarble_2x2x1', 1, 4),
          locItem('blackmarble_2x2_enforced'),
          locItem('dvergrprops_banner'),
          locItem('blackmarble_base_2', 1, 2),
        ], 1, 2),
        locItem([ // reinforce (2) & (5)
          locItem('blackmarble_floor_large', 1, 2),
          locItem([ // vines1
            locItem('vines', 1, 2),
            locItem('vines', 0.5, 3),
          ], 0.4),
          locItem('blackmarble_2x2x2', 1, 13),
          locItem('blackmarble_2x2x1', 1, 5),
          locItem('blackmarble_2x2_enforced'),
          locItem('dvergrprops_banner'),
          locItem('blackmarble_base_2', 1, 2),
        ], 1, 2),
      ]),
      locItem([ // cliffs
        locItem('cliff_mistlands2', 1, 6),
        locItem('cliff_mistlands2', 0.5, 3),
        locItem('cliff_mistlands1', 0.8, 5),
      ]),
      locItem([ // marble
        locItem('blackmarble_1x1', 1, 12),
        locItem('blackmarble_2x2x2', 1, 3),
      ]),
      // locItem('RuneStone_Mistlands_bosshint'),
      locItem([ // furniture
        locItem('dvergrprops_barrel', 1, 3),
        locItem('piece_blackmarble_bench'),
        locItem('dvergrprops_stool', 0.5, 4),
        locItem('dvergrprops_chair', 0.5, 2),
        locItem('dvergrprops_table', 1, 2),
        locItem('Pickable_DvergrStein', 0.33, 5),
        locItem('dvergrprops_lantern'),
        locItem('Pickable_DvergrLantern', 0.5, 2),
        // via shelves
        locItem('Pickable_DvergrStein', 0.25, 2),
      ]),
      locItem('SeekerQueen'),
      locItem('Spawner_Seeker', 1, 4),
    ],
    needsKey: 'DvergrKey',
  },
  'Mistlands_Boss',
);
