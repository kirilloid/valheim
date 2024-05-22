import { locItem } from '../../../model/game';
import { loc } from '../common';
import { TIP } from './_parts';

export default loc(
  7, 'FaderLocation', ['Ashlands'],
  { type: 'altar',
    biomeArea: 2, quantity: 5, prioritized: true, group: 'FaderBoss', minApart: 2048,
    slopeRotation: true,
    terrainDelta: [0, 40], maxAlt: 300, radius: [32, 12],
    items: [
      locItem([ // GameObject
        // wall (1)
        locItem('Ashlands_Ruins_Wall_Window_4x6_broken3'),
        locItem('Ashlands_Ruins_Wall_Window_4x6_broken2'),
        locItem('Ashlands_Ruins_Ramp_Upsidedown'),
        locItem('Ashlands_Pillar4', 1, 2),
        locItem('Ashlands_Ruins_Ramp_Upsidedown'),
        // wall
        locItem('Ashlands_Pillar4', 1, 4),
        locItem('Ashlands_Ruins_Wall_Broken3_4x6', 1, 2),
        locItem('Ashlands_Ruins_Wall_Broken4_4x6', 1, 2),
        locItem('Ashlands_Ruins_Wall_Broken5_4x6', 1, 2),
        locItem('Ashlands_Ruins_Wall_Window_4x6_broken3'),
        locItem('Ashlands_Ruins_Ramp_Upsidedown', 1, 2),
        locItem('Ashlands_Ruins_Wall_Window_4x6_broken2'),
        locItem('Ashlands_Pillar4_tip3_broken1'),
        TIP,
        // wall (10)
        locItem('Ashlands_Ruins_Ramp_Upsidedown', 1, 2),
        locItem('Ashlands_Pillar4', 1, 2),
        locItem('Ashlands_Ruins_Wall_Window_4x6_broken6'),
        locItem('Ashlands_Ruins_Wall_Window_4x6_broken5'),
        locItem('Ashlands_Ruins_Wall_Window_4x6_broken4'),
        // wall (11)
        locItem('Ashlands_Pillar4', 1, 4),
        locItem('Ashlands_Ruins_Wall_Broken3_4x6', 1, 2),
        locItem('Ashlands_Ruins_Wall_Broken4_4x6', 1, 2),
        locItem('Ashlands_Ruins_Wall_Broken5_4x6', 1, 2),
        locItem('Ashlands_Ruins_twist_PillarBase'),
        locItem('Ashlands_Ruins_twist_PillarBaseSmall'),
        locItem('Ashlands_Ruins_PillarBase3_double'),
        locItem('Ashlands_Pillar4_tip3_broken1'),
        TIP,
        locItem('Ashlands_Ruins_Wall_Window_4x6_broken6'),
        locItem('Ashlands_Ruins_Wall_Window_4x6_broken5'),
        locItem('Ashlands_Ruins_Wall_Window_4x6_broken4'),
        locItem('Ashlands_Ruins_Ramp_Upsidedown', 1, 2),
      ], 1, 8),
      locItem([ // GameObject / wall
        // pillar
        locItem('Ashlands_Pillar4'),
        // pillar3
        locItem('Ashlands_Ruins_twist_PillarBase'),
        // arch
        locItem('Ashlands_Ruins_twist_PillarBaseSmall'),
        // arch2
        locItem('Ashlands_Ruins_twist_ArchBig', 1, 2),
      ], 1, 4),
      // graves
      locItem('GraveStone_CharredFaderLocation', 0.5, 20 * 3),
      locItem('Fader'),
    ],
  },
  'FaderLocation',
);
