import { locItem } from '../../model/game';

import { CampConfig, Theme } from './types';

export const fortressRuins: CampConfig = {
  type: 'camp',
  prefix: 'FortressRuins',
  perimeter: [
  ],
  inner: [
    {
      id: '23',
      theme: Theme.FortressRuins,
      size: [10, 4, 10],
      weight: 1,
      items: [
        locItem('charred_shieldgenerator'),
        locItem('Charred_Twitcher', 1),
        locItem('Charred_Twitcher', 0.5),
        locItem('Charred_Twitcher', 0.25),
        locItem('Charred_Twitcher', 0.13),
      ],
      dist: [],
    },
    {
      id: '_new01',
      theme: Theme.FortressRuins,
      size: [20, 4, 20],
      weight: 1,
      items: [
        // corners
        locItem([
          locItem('Ashlands_Ruins_Ramp', 0.8, 2),
          locItem('Ashlands_Ruins_Ramp_Upsidedown', 0.6, 2),
          locItem('Ashlands_Pillar4', 1, 2),
          locItem('Ashlands_Ruins_Floor_3x3_broken2', 0.5, 1),
          // peak
          locItem([
            locItem('Ashlands_Pillar4_tip_broken1'),
            locItem('Ashlands_Pillar4_tip_broken2'),
          ], 0.5),
        ], 1, 2),
        locItem([
          locItem('Ashlands_Ruins_Ramp', 0.8, 2),
          locItem('Ashlands_Ruins_Ramp_Upsidedown', 0.6, 2),
          locItem('Ashlands_Pillar4', 1, 2),
          locItem('Ashlands_Ruins_Floor_3x3_broken1', 0.5, 1),
          // peak
          locItem([
            locItem('Ashlands_Pillar4_tip_broken1'),
            locItem('Ashlands_Pillar4_tip_broken2'),
          ], 0.5),
        ], 1, 2),
        // wall
        locItem([
          locItem('Ashlands_Ruins_Wall_Window_4x6_broken6'),
          locItem('Ashlands_Ruins_Wall_Window_4x6_broken5'),
          locItem('Ashlands_Ruins_Wall_Window_4x6_broken2', 0.5),
          locItem('Ashlands_Ruins_Wall_Window_4x6_broken4', 0.5),
          // wall1
          locItem([
            locItem('Ashlands_Ruins_Wall_Window_4x6_broken3'),
            locItem('Ashlands_Ruins_Wall_Window_4x6_broken2'),
            locItem('Ashlands_Ruins_Wall_Window_4x6_broken4'),
            locItem('Ashlands_Ruins_TopStone', 0.75, 6),
            locItem('Ashlands_Ruins_Floor_3x3_broken1', 0.5, 1),
            locItem('Ashlands_Ruins_Wall_Window_4x6_broken6'),
            locItem('Ashlands_Ruins_Floor_3x3_broken2', 0.5, 1),
          ], 0.5),
          // wall2
          locItem([
            locItem('Ashlands_Ruins_Wall_Window_4x6_broken3'),
            locItem('Ashlands_Ruins_Wall_Window_4x6_broken5'),
            locItem('Ashlands_Ruins_TopStone', 0.75, 6),
            locItem('Ashlands_Ruins_Floor_3x3_broken1', 0.5, 1),
            locItem('Ashlands_Ruins_Floor_3x3_broken3', 0.5),
          ], 0.5),
        ], 0.75),
        // wall (1)
        locItem([
          locItem('Ashlands_Ruins_Wall_Window_4x6_broken4'),
          // wall1
          locItem([
            locItem('Ashlands_Ruins_Wall_Window_4x6_broken5'),
            locItem('Ashlands_Ruins_Wall_Window_4x6_broken3'),
            locItem('Ashlands_Ruins_Wall_Window_4x6_broken2'),
            locItem('Ashlands_Ruins_Wall_Window_4x6_broken4'),
            locItem('Ashlands_Ruins_TopStone', 0.75, 4),
            locItem('Ashlands_Ruins_Floor_3x3_broken1', 0.5),
          ], 0.5),
          // wall2
          locItem([
            locItem('Ashlands_Ruins_Wall_Window_4x6_broken3'),
            locItem('Ashlands_Ruins_Wall_Window_4x6_broken5'),
            locItem('Ashlands_Ruins_Wall_Window_4x6_broken6'),
            locItem('Ashlands_Ruins_TopStone', 0.75, 8),
            locItem('Ashlands_Ruins_Floor_3x3_broken2', 0.5),
            locItem('Ashlands_Ruins_Floor_3x3_broken3', 0.5),
            locItem('Ashlands_Ruins_Wall_Window_4x6_broken6'),
            locItem('Ashlands_Ruins_Wall_Window_4x6_broken2'),
          ], 0.5),
        ], 0.75),
        // wall (2)
        locItem([
          locItem('Ashlands_Ruins_Wall_Window_4x6_broken6'),
          locItem('Ashlands_Ruins_Wall_Window_4x6_broken2', 0.5),
          locItem('Ashlands_Ruins_Wall_Window_4x6_broken4', 0.5),
          // wall1
          locItem([
            locItem('Ashlands_Ruins_Wall_Window_4x6_broken2'),
            locItem('Ashlands_Ruins_Wall_Window_4x6_broken4'),
            locItem('Ashlands_Ruins_TopStone', 0.75, 4),
          ], 0.5),
          // wall2
          locItem([
            locItem('Ashlands_Ruins_Wall_Window_4x6_broken3'),
            locItem('Ashlands_Ruins_Wall_Window_4x6_broken5'),
            locItem('Ashlands_Ruins_TopStone', 0.75, 8),
            locItem('Ashlands_Ruins_Floor_3x3_broken1', 0.5),
            locItem('Ashlands_Ruins_Floor_3x3_broken2', 0.5),
            locItem('Ashlands_Ruins_Floor_3x3_broken3', 0.5),
            locItem('Ashlands_Ruins_Wall_Window_4x6_broken3'),
            locItem('Ashlands_Ruins_Wall_Window_4x6_broken6'),
            locItem('Ashlands_Ruins_Wall_Window_4x6_broken5'),
          ], 0.5),
        ], 0.75),
        // wall (3)
        locItem([
          locItem('Ashlands_Ruins_Wall_Window_4x6_broken5', 0.5),
          locItem('Ashlands_Ruins_Wall_Window_4x6_broken2'),
          // wall1
          locItem([
            locItem('Ashlands_Ruins_Wall_Window_4x6_broken3'),
            locItem('Ashlands_Ruins_Wall_Window_4x6_broken4'),
            locItem('Ashlands_Ruins_TopStone', 0.75, 7),
            locItem('Ashlands_Ruins_Floor_3x3_broken1', 0.5),
            locItem('Ashlands_Ruins_Floor_3x3_broken2', 0.5),
            locItem('Ashlands_Ruins_Wall_Window_4x6_broken6'),
            locItem('Ashlands_Ruins_Wall_Window_4x6_broken3'),
            locItem('Ashlands_Ruins_Wall_Window_4x6_broken4'),
          ], 0.5),
          // wall2
          locItem([
            locItem('Ashlands_Ruins_Wall_Window_4x6_broken6'),
            locItem('Ashlands_Ruins_Wall_Window_4x6_broken2'),
            locItem('Ashlands_Ruins_Wall_Window_4x6_broken5'),
            locItem('Ashlands_Ruins_TopStone', 0.75, 5),
            locItem('Ashlands_Ruins_Wall_Window_4x6_broken3'),
          ], 0.5),
        ], 0.75),
        // floor
        locItem([
          locItem('Ashlands_Ruins_Floor_3x3_broken1', 0.5, 9),
          locItem('Ashlands_Ruins_Floor_3x3_broken2', 0.5, 8),
          locItem('Ashlands_Ruins_Floor_3x3_broken3', 0.5, 7),
        ]),
        // ferns
        locItem([
          locItem('FernAshlands', 0.9, 14),
          locItem('Pickable_Fiddlehead', 0.1, 14),
        ]),
        locItem('charred_shieldgenerator'),
      ],
      dist: [],
    },
    {
      id: '_shieldgen',
      theme: Theme.FortressRuins,
      size: [8, 4, 8],
      weight: 1,
      items: [
        locItem('charred_shieldgenerator'),
        locItem('Charred_Twitcher', 1),
        locItem('Charred_Twitcher', 0.5),
        locItem('Charred_Twitcher', 0.25),
        locItem('Charred_Twitcher', 0.13),
      ],
      dist: [],
    },
  ],
};
