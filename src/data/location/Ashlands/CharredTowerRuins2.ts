import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  7, 'CharredTowerRuins2', ['Ashlands'],
  { type: 'misc',
    biomeArea: 7, quantity: 40, minApart: 100,
    terrainDelta: [0, 4], minAlt: 0, radius: [12, 12],
    items: [
      // wall
      locItem([ // pillar
        locItem('Ashlands_Pillar4'),
        locItem([ // pillar3
          locItem('Ashlands_Ruins_twist_PillarBase'),
          locItem([ // arch
            locItem('Ashlands_Ruins_twist_PillarBaseSmall'),
            locItem([ // arch2
              locItem('Ashlands_Ruins_twist_ArchBig', 0.9, 2),
            ], 0.9),
          ], 0.9),
        ], 0.95),
      ], 0.95, 8),
      locItem('Ashlands_WallBlock', 1, 5 * 6),
      locItem('AshlandsTree6_big', 0.5),
    ],
  },
  'CharredTowerRuins_small',
);
