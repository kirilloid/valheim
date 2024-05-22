import { locItem } from '../../../model/game';
import { loc } from '../common';
import { POT_FLOOR_RED, ROOF1, ROOF2, TIP } from './_parts';

export default loc(
  7, 'CharredTowerRuins1', ['Ashlands'],
  { type: 'misc',
    biomeArea: 7, quantity: 30, group: 'towerruins', minApart: 100,
    terrainDelta: [0, 4], minAlt: 0, radius: [22, 12],
    customMusic: 'Music_Ashlands_Ruins 3',
    items: [
      locItem([ // pillar (x4)
        locItem('Ashlands_Floor'),
        locItem('Pickable_SmokePuff', 0.33),
        locItem([ // pillar2
          locItem('Ashlands_Pillar4'),
          locItem([ // pillar3
            ROOF1(1, true),
            ROOF2(2, false),
            ROOF1(2, false),
            ROOF2(1, true),
          ], 0.9),
          locItem([ // pillar3
            ROOF1(1, false),
            ROOF2(3, true),
            TIP,
            ROOF1(2, true),
            ROOF2(1, false),
          ], 0.9),
        ], 0.9),
        locItem('Ashlands_Floor'),
        locItem('Ashlands_Floor', 0.5, 14),
        POT_FLOOR_RED(locItem('Ashlands_Floor')),
      ], 0.6, 4),
      locItem([ // pillar (x12)
        locItem('Ashlands_Floor', 1, 2),
        locItem('Ashlands_Floor', 0.5, 6),
        locItem([ // pillar2
          locItem('Ashlands_Pillar4'),
          locItem([ // pillar3
            ROOF1(1, false),
            ROOF2(1, false),
          ], 0.9),
          locItem([ // pillar3
            ROOF1(1, false),
            ROOF2(1, false),
            TIP,
          ], 0.9),
        ], 0.9),
        locItem('piece_blackwood_bench', 0.5),
        locItem([ // wall
          locItem('Ashlands_Floor'),
          locItem([ // wall1
            locItem('Ashlands_Floor'),
            locItem('Ashlands_Ruins_Wall_Window_4x6_broken6', 0.9),
            locItem('Ashlands_Ruins_Wall_Top_wHole', 0.75),
          ], 0.9),
        ], 0.9),
        locItem([ // wall
          locItem('Ashlands_Floor'),
          locItem([ // wall1
            locItem('Ashlands_Floor'),
            locItem('Ashlands_Ruins_Wall_Window_4x6_broken4', 0.9),
          ], 0.9),
        ], 0.9),
        locItem([ // wall
          locItem('Ashlands_Floor', 1, 2),
          locItem([ // wall1
            locItem('Ashlands_Floor', 1, 2),
            locItem('Ashlands_Ruins_Wall_Window_4x6_broken2', 0.9),
          ], 0.9),
        ], 0.9),
      ], 0.5, 12),
      locItem('Ashlands_floor_large', 1, 18),
    ],
  },
  'CharredTowerRuins_big',
);
