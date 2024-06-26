import { CampConfig, Theme } from './types';

import { locItem } from '../../model/game';

export const charredRuins: CampConfig = {
  type: 'camp',
  prefix: 'CharredRuins',
  perimeter: [
    {
      id: '9',
      theme: Theme.AshlandsRuins | Theme.FortressRuins,
      size: [20, 4, 2],
      weight: 2,
      items: [
        locItem([ // wall (1,5,6)
          locItem([ // pillar
          locItem('Ashlands_Pillar4', 1, 2),
            locItem([ // pillar3
              locItem('Ashlands_Ruins_twist_PillarBase'),
              locItem([ // arch
                locItem('Ashlands_Ruins_twist_PillarBaseSmall'),
                locItem([ // arch2
                  locItem('Ashlands_Ruins_twist_ArchBig', 0.8, 2),
                ], 0.9), 
              ], 0.9),
            ], 0.95),
          ], 0.95),
        ], 1, 3),
        locItem('Ashlands_WallBlock', 1, 8),
        locItem('Ashlands_WallBlock', 0.5, 8),
      ],
      dist: [0, 1],
    },
  ],
  inner: [
    {
      id: '12',
      theme: Theme.AshlandsRuins | Theme.FortressRuins,
      size: [10, 4, 18],
      weight: 1,
      items: [
        locItem('Ashlands_WallBlock', 1, 16),
        locItem('Ashlands_WallBlock', 0.5, 16),
        locItem([ // wall (1,2,3,4,5,6)
          locItem([ // pillar
          locItem('Ashlands_Pillar4', 1, 2),
            locItem([ // pillar3
              locItem('Ashlands_Ruins_twist_PillarBase'),
              locItem([ // arch
                locItem('Ashlands_Ruins_twist_PillarBaseSmall'),
                locItem([ // arch2
                  locItem('Ashlands_Ruins_twist_ArchBig', 0.8, 2),
                ], 0.9), 
              ], 0.9),
            ], 0.95),
          ], 0.95),
        ], 1, 6),
      ],
      dist: [0, 1],
    },
    {
      id: '13',
      theme: Theme.AshlandsRuins | Theme.FortressRuins,
      size: [8, 4, 8],
      weight: 1,
      items: [
        locItem('Ashlands_WallBlock', 0.4, 5),
        locItem('Ashlands_Pillar4', 0.5, 2),
        locItem('Ashlands_Ruins_twist_PillarBase', 0.5),
        locItem('Ashlands_Ruins_twist_PillarBaseSmall', 0.5),
        locItem('Ashlands_Ruins_twist_ArchBig', 0.5, 2),
      ],
      dist: [0, 1],
    },
    {
      id: '14',
      theme: Theme.AshlandsRuins | Theme.FortressRuins,
      size: [10, 4, 18],
      weight: 1,
      items: [
        locItem([ // pillar
          locItem('Ashlands_Pillar4', 1, 2),
          locItem([ // pillar3
          locItem('Ashlands_Ruins_twist_PillarBase'),
            locItem([ // arch
              locItem('Ashlands_Ruins_twist_PillarBaseSmall'),
              locItem([ // arch2
                locItem('Ashlands_Ruins_twist_ArchBig', 0.8),
              ], 0.9),
            ], 0.9),
          ], 0.95),
        ], 0.95, 10),
      ],
      dist: [0, 1],
    },
    {
      id: '15',
      theme: Theme.AshlandsRuins | Theme.FortressRuins,
      size: [10, 4, 10],
      weight: 1,
      items: [
        locItem('Ashlands_PillarBase3_double', 0.5, 4),
        locItem([ // GameObject / GameObject (1)
          locItem('Pickable_Fiddlehead', 0.5, 5),
          locItem('FernAshlands', 0.9, 5),
          locItem([ // GameObject
            locItem('Ashlands_ArchRoofDamaged_half1', 0.5, 4),
            locItem('Ashlands_ArchRoofDamaged_half2', 0.5, 4),
          ], 0.9),
        ], 0.9 * 0.75),
      ],
      dist: [0, 1],
    },
    {
      id: '16',
      theme: Theme.AshlandsRuins | Theme.FortressRuins,
      size: [6, 4, 10],
      weight: 0.5,
      items: [
        locItem([ // wall
          locItem('Ashlands_Ruins_Wall_Window_4x6_broken6', 0.5),
          locItem('Ashlands_Ruins_Wall_Window_4x6_broken4'),
          locItem('Ashlands_Ruins_Wall_Window_4x6_broken5'),
        ], 0.9),
      ],
      dist: [0, 1],
    },
    {
      id: '17',
      theme: Theme.AshlandsRuins | Theme.FortressRuins,
      size: [10, 4, 10],
      weight: 0.5,
      items: [
        locItem('Ashlands_Floor', 0.4, 14),
        locItem('Ashlands_Ruins_twist_PillarBase', 0.5, 2),
      ],
      dist: [0, 1],
    },
    {
      id: '23',
      theme: Theme.AshlandsRuins,
      size: [10, 4, 10],
      weight: 0.5,
      items: [
        locItem([
          // pillar
          locItem([
            locItem('Ashlands_Pillar4', 1, 2),
            // pillar3
            locItem([
              locItem('Ashlands_Ruins_twist_PillarBase'),
              // arch
              locItem([
                locItem('Ashlands_Ruins_twist_PillarBaseSmall'),
                locItem([
                  locItem('Ashlands_Ruins_twist_ArchBig', 0.9, 2),
                ], 0.9),
              ], 0.9),
            ], 0.95),
          ], 0.95),
        ], 1, 4),
        locItem('Morgen', 0.5),
      ],
      dist: [0, 1],
    },
    {
      id: '24',
      theme: Theme.AshlandsRuins | Theme.FortressRuins,
      size: [8, 4, 2],
      weight: 2,
      items: [
        locItem([ // pillar
          locItem([
            locItem('Ashlands_Pillar4', 1, 2),
            locItem([ // pillar3
              locItem('Ashlands_Ruins_twist_PillarBase'),
              locItem([ // arch
                locItem('Ashlands_Ruins_twist_PillarBaseSmall'),
                locItem([ // arch2
                  locItem('Ashlands_Ruins_twist_ArchBig', 0.8, 2),
                ], 0.9),
              ], 0.9),
            ], 0.95),
          ], 0.95),
        ], 1, 4),
        locItem('Ashlands_WallBlock', 1, 3),
        locItem('Ashlands_WallBlock', 0.5, 3),
      ],
      dist: [0, 1],
    },
    {
      id: '25',
      theme: Theme.AshlandsRuins | Theme.FortressRuins,
      size: [8, 4, 6],
      weight: 1,
      items: [
        locItem('Ashlands_Pillar4', 1, 2),
        locItem('Ashlands_Ruins_twist_PillarBase'),
        locItem('Ashlands_WallBlock', 1, 3),
        locItem('Ashlands_WallBlock', 0.5, 3),
      ],
      dist: [0, 1],
    },
    {
      id: '_new01',
      theme: Theme.AshlandsRuins,
      size: [20, 4, 20],
      weight: 10,
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
            locItem('Ashlands_Pillar4_tip_broken2', 0.5),
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
            locItem('Ashlands_Pillar4_tip_broken2', 0.5),
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
            locItem('Ashlands_Ruins_Floor_3x3_broken3', 0.5),
            locItem('Ashlands_Ruins_Ramp', 0.75, 2),
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
            locItem('Ashlands_Ruins_Ramp', 0.75, 2),
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
            locItem('Ashlands_Ruins_Ramp', 0.75, 2),
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
            locItem('Ashlands_Ruins_Floor_3x3_broken3', 0.5),
            locItem('Ashlands_Ruins_Ramp', 0.75, 2),
          ], 0.5),
        ], 0.75),
        // TODO: center
        // floor
        locItem([
          locItem('Ashlands_Ruins_Floor_3x3_broken1', 0.5, 9),
          locItem('Ashlands_Ruins_Floor_3x3_broken2', 0.5, 8),
          locItem('Ashlands_Ruins_Floor_3x3_broken3', 0.5, 8),
        ]),
        // ferns
        locItem([
          locItem('FernAshlands', 0.9, 15),
          locItem('Pickable_Fiddlehead', 0.1, 15),
        ]),
        locItem('Ashlands_floor_large', 1, 8),
      ],
      dist: [0, 1],
    },
    {
      id: '_new02',
      theme: Theme.AshlandsRuins,
      size: [12, 4, 12],
      weight: 5,
      items: [
        // chapel
          // wall
            // pillarroof
            locItem([ // pillar x4
              locItem('Ashlands_Floor'),
              locItem('Pickable_SmokePuff', 0.33),
              locItem([ // pillar2
              locItem('Ashlands_Pillar4'),
                locItem([ // pillar3
                  locItem([ // roof1
                    locItem('Ashlands_ArchRoofDamaged_half1', 0.66),
                    locItem('FernAshlands', 0.9),
                    locItem('Pickable_Fiddlehead', 0.2),
                  ], 0.9),
                  locItem([ // roof2
                    locItem('Ashlands_ArchRoofDamaged_half2'),
                    locItem('FernAshlands', 0.9),
                    locItem('Pickable_Fiddlehead', 0.2),
                    locItem([ // tip
                      locItem('Ashlands_Pillar4_tip_broken1'),
                      locItem('Ashlands_Pillar4_tip_broken2', 0.5),
                    ], 0.5),
                  ], 0.9),
                  locItem([ // tip
                    locItem('Ashlands_Pillar4_tip_broken1'),
                    locItem('Ashlands_Pillar4_tip_broken2', 0.5),
                  ], 0.5),
                ], 0.9),
              ], 0.9),
            ], 0.9, 4),
            // wall
              locItem([ // wall (1)
                locItem([ // base
                  locItem('Pickable_SmokePuff', 0.33),
                  locItem('Ashlands_Floor', 1, 3),
                  locItem([ // first
                    locItem('Ashlands_Ruins_Wall_Window_4x6_broken2'),
                    locItem([ // second
                      locItem('Ashlands_Ruins_Wall_Window_4x6_broken3'),
                      locItem('Ashlands_Ruins_Wall_Top_wHole'),
                    ], 0.9),
                  ], 0.9),
                ], 0.9),
              ], 0.9, 3),
              locItem([ // wall (2)
                locItem([ // base
                  locItem('Pickable_SmokePuff', 0.33),
                  locItem('Ashlands_Floor', 1, 3),
                  locItem([ // first
                    locItem('Ashlands_Ruins_Wall_Window_4x6_broken4'),
                    locItem('Ashlands_Ruins_Wall_Window_4x6_broken5'),
                    locItem([ // second
                      locItem('Ashlands_Ruins_Wall_Window_4x6_broken6', 0.5),
                      locItem('Ashlands_Ruins_Wall_Top_wHole'),
                    ], 0.9),
                  ], 0.9),
                ], 0.9),
              ], 0.9, 3),
              locItem([ // wall (3)
                locItem([ // base
                  locItem('Ashlands_Floor', 1, 3),
                  locItem([ // first
                    locItem('Ashlands_Ruins_Wall_Broken3_4x6'),
                    locItem('Ashlands_Ruins_Wall_Broken4_4x6'),
                    locItem([ // second
                      locItem('Ashlands_Ruins_Wall_Broken5_4x6', 0.5),
                      locItem('Ashlands_Ruins_Wall_Top_wHole'),
                    ], 0.9),
                  ], 0.9),
                ], 0.9),
              ], 0.9, 3),
          // floor
          locItem('Ashlands_Floor', 0.5, 12),
          locItem('Ashlands_Floor', 1, 13),
        // rubble
        locItem('Ashlands_Floor', 0.5, 10),
        locItem('Ashlands_floor_large', 1, 2),
      ],
      dist: [0, 1],
    },
    {
      id: '_new03',
      theme: Theme.AshlandsRuins,
      size: [12, 4, 12],
      weight: 5,
      items: [
        // chapel
        // wall -> pillarroof
        // pillar
        locItem([
          locItem('Pickable_SmokePuff', 0.33, 1),
          // pillar2
          locItem([
            locItem('Ashlands_Ruins_twist_PillarBase'),
            // pillar3
            locItem([
              locItem('Ashlands_PillarBase3_double'),
              // roof1
              locItem([
                locItem('Ashlands_ArchRoofDamaged_half1', 0.66),
                locItem('FernAshlands', 0.9),
                locItem('Pickable_Fiddlehead', 0.5),
              ], 0.9),
              // roof2
              locItem([
                locItem('Ashlands_ArchRoofDamaged_half2'),
                locItem('FernAshlands', 0.9),
                locItem('Pickable_Fiddlehead', 0.5),
              ], 0.9),
              // tip
              locItem([
                locItem('Ashlands_Pillar4_tip_broken1'),
                locItem('Ashlands_Pillar4_tip_broken2', 0.5),
              ], 0.5),
            ], 0.9),
          ], 0.9),
        ], 0.9, 4),
        // floor
        locItem('Ashlands_Floor', 1, 13),
        locItem('Ashlands_Floor', 0.5, 12),
        // rubble
        locItem('Ashlands_Floor', 0.5, 10),
        locItem('Ashlands_floor_large', 1, 2),
      ],
      dist: [0, 1],
    },
    {
      id: '_new04',
      theme: Theme.AshlandsRuins,
      size: [12, 4, 20],
      weight: 5,
      items: [
        // chapel
        // wall -> pillarroof
        // TODO: collect pillar1-pillar4
        //      -> wall
        // wall (1) -> base
        locItem([
          locItem('Pickable_SmokePuff', 0.33),
          locItem('Ashlands_Floor', 1, 3),
          locItem([ // first
            locItem('Ashlands_Ruins_Wall_Window_4x6_broken4'),
            locItem('Ashlands_Ruins_Wall_Window_4x6_broken5'),
            locItem([ // second
              locItem('Ashlands_Ruins_Wall_Window_4x6_broken6', 0.5),
              locItem('Ashlands_Ruins_Wall_Top_thin', 0.5),
            ], 0.9),
          ], 0.9),
        ], 0.81),
        // wall (2) -> base
        locItem([
          locItem('Ashlands_Floor', 1, 3),
          locItem([ // first
            locItem('Ashlands_Ruins_Wall_Broken3_4x6'),
            locItem('Ashlands_Ruins_Wall_Broken4_4x6'),
            locItem([ // second
              locItem('Ashlands_Ruins_Wall_Broken5_4x6', 0.5),
              locItem('Ashlands_Ruins_Wall_Top_thin', 0.5),
            ], 0.9),
          ], 0.9),
        ], 0.81),
        // floor
        locItem('Ashlands_Floor', 1, 13),
        locItem('Ashlands_Floor', 0.5, 12),
        // pillar
        locItem([
          locItem('Pickable_SmokePuff', 0.33, 1),
          // pillar2
          locItem([
            locItem('Ashlands_Ruins_twist_PillarBase'),
            // pillar3
            locItem([
              locItem('Ashlands_PillarBase3_double'),
              // roof1
              locItem([
                locItem('Ashlands_ArchRoofDamaged_half1', 0.66),
                locItem('FernAshlands', 0.9),
                locItem('Pickable_Fiddlehead', 0.5),
              ], 0.9),
              // roof2
              locItem([
                locItem('Ashlands_ArchRoofDamaged_half2'),
                locItem('FernAshlands', 0.9),
                locItem('Pickable_Fiddlehead', 0.5),
              ], 0.9),
              // tip
              locItem([
                locItem('Ashlands_Pillar4_tip_broken1'),
                locItem('Ashlands_Pillar4_tip_broken2', 0.5),
              ], 0.5),
            ], 0.9),
          ], 0.9),
        ], 0.9, 4),
        // chapel (1)
        // wall
        // pillarroof
        // pillar1
        locItem([
          locItem('Ashlands_Floor'),
          locItem('Pickable_SmokePuff', 0.33),
          // pillar2
          locItem([
            locItem('Ashlands_Pillar4'),
            // pillar3
            locItem([
              // roof1
              locItem([
                locItem('Ashlands_ArchRoofDamaged_half1', 0.66),
                locItem('FernAshlands', 0.9),
                locItem('Pickable_Fiddlehead', 0.5),
                // tip
                locItem([
                  locItem('Ashlands_Pillar4_tip_broken1'),
                  locItem('Ashlands_Pillar4_tip_broken2', 0.5),
                ], 0.5),
              ], 0.9),
              // roof2
              locItem([
                locItem('Ashlands_ArchRoofDamaged_half2'),
                locItem('FernAshlands', 0.9),
                locItem('Pickable_Fiddlehead', 0.5),
              ], 0.9),
              // tip
              locItem([
                locItem('Ashlands_Pillar4_tip_broken1'),
                locItem('Ashlands_Pillar4_tip_broken2', 0.5),
              ], 0.5),
            ], 0.9),
          ], 0.9),
        ], 0.9),
        // pillar2
        locItem([
          locItem('Pickable_SmokePuff', 0.33),
        ], 0.9),
        // pillar3
        locItem([
          locItem('Pickable_SmokePuff', 0.33),
        ], 0.9),
        // pillar4
        locItem([
          locItem('Ashlands_Floor'),
          locItem('Pickable_SmokePuff', 0.33),
          // pillar2
          locItem([
            locItem('Ashlands_Pillar4'),
            // pillar3
            locItem([
              // roof1
              locItem([
                locItem('Ashlands_ArchRoofDamaged_half1', 0.66),
              ], 0.9),
              // roof2
              locItem([
                locItem('Ashlands_ArchRoofDamaged_half2'),
                locItem('FernAshlands', 0.9),
                locItem('Pickable_Fiddlehead', 0.5),
              ], 0.9),
              // tip
              locItem([
                locItem('Ashlands_Pillar4_tip_broken1'),
                locItem('Ashlands_Pillar4_tip_broken2', 0.5),
              ], 0.5),
            ], 0.9),
          ], 0.9),
        ], 0.9),
        // floor
        locItem('Ashlands_Floor', 1, 8),
        locItem('Ashlands_Floor', 0.5, 12),
        // rubble
        locItem('Ashlands_Floor', 0.5, 14),
        locItem('Ashlands_floor_large', 1, 4),
      ],
      dist: [0, 1],
    },
    {
      id: '_new05',
      theme: Theme.AshlandsRuins,
      size: [20, 4, 20],
      weight: 5,
      items: [
        // ruin
        locItem([ // pillar3
          locItem('Pickable_SmokePuff', 0.33),
          // pillar2 ...
          locItem([
            locItem('Ashlands_Pillar4'),
            // pillar3
            locItem([
              // roof1
              locItem([
                locItem('Ashlands_ArchRoofDamaged_half1', 0.66),
              ], 0.9),
              // roof2
              locItem([
                locItem('Ashlands_ArchRoofDamaged_half2'),
                locItem('FernAshlands', 0.9, 3),
                locItem('Pickable_Fiddlehead', 0.5, 3),
              ], 0.9),
              // roof1
              locItem([
                locItem('Ashlands_ArchRoofDamaged_half1', 0.66),
                locItem('FernAshlands', 0.9, 2),
                locItem('Pickable_Fiddlehead', 0.5, 2),
              ], 0.9),
              // roof2
              locItem([
                locItem('Ashlands_ArchRoofDamaged_half2'),
                locItem('FernAshlands', 0.9, 1),
                locItem('Pickable_Fiddlehead', 0.5, 1),
              ], 0.9),
            ], 0.9),
            // pillar3
            locItem([
              // roof1
              locItem([
                locItem('Ashlands_ArchRoofDamaged_half1', 0.66),
              ], 0.9),
              // roof2
              locItem([
                locItem('Ashlands_ArchRoofDamaged_half2'),
                locItem('FernAshlands', 0.9, 3),
                locItem('Pickable_Fiddlehead', 0.5, 3),
              ], 0.9),
              // tip
              locItem([
                locItem('Ashlands_Pillar4_tip_broken1'),
                locItem('Ashlands_Pillar4_tip_broken2', 0.5),
              ], 0.9),
              // roof1
              locItem([
                locItem('Ashlands_ArchRoofDamaged_half1', 0.66),
                locItem('FernAshlands', 0.9, 2),
                locItem('Pickable_Fiddlehead', 0.5, 2),
              ], 0.9),
              // roof2
              locItem([
                locItem('Ashlands_ArchRoofDamaged_half2'),
                locItem('FernAshlands', 0.9, 1),
                locItem('Pickable_Fiddlehead', 0.5, 1),
              ], 0.9),
            ], 0.9),
          ], 0.9),
          locItem('Ashlands_Floor', 1, 2),
          locItem('Ashlands_Floor', 0.5, 7),
        ], 0.9),
        // chapel x3 ...
        locItem([ // chapel
          // wall -> pillarroof
          locItem([ // pillar2
            locItem('Pickable_SmokePuff', 0.33),
          ], 0.9),
          locItem([ // pillar3
            locItem('Pickable_SmokePuff', 0.33),
          ], 0.9),
          locItem([ // pillar4
            locItem('Ashlands_Floor'),
            locItem('Pickable_SmokePuff', 0.33),
            locItem([ // pillar2
              locItem('Ashlands_Pillar4'),
              locItem([ // pillar3
                locItem([ // roof1
                  locItem('Ashlands_ArchRoofDamaged_half1', 0.66),
                ], 0.9),
                locItem([ // roof2
                  locItem('Ashlands_ArchRoofDamaged_half2'),
                  locItem('FernAshlands', 0.9),
                  locItem('Pickable_Fiddlehead', 0.5),
                ], 0.9),
                locItem([ // tip
                  locItem('Ashlands_Pillar4_tip_broken1'),
                  locItem('Ashlands_Pillar4_tip_broken2', 0.5),
                ], 0.9),
              ], 0.9),
            ], 0.9),
          ], 0.9),
          // wall -> wall
          locItem([ // wall (1) -> base
            locItem('Pickable_SmokePuff', 0.33),
            locItem('Ashlands_Floor', 1, 3),
            locItem([ // first
              locItem('Ashlands_Ruins_Wall_Window_4x6_broken4'),
              locItem('Ashlands_Ruins_Wall_Window_4x6_broken5'),
              locItem([ // second
                locItem('Ashlands_Ruins_Wall_Window_4x6_broken6', 0.5),
                locItem('Ashlands_Ruins_Wall_Top_thin', 0.5),
              ], 0.9),
            ], 0.9),
          ], 0.81),
          locItem([ // wall (2) -> base
            locItem('Ashlands_Floor', 1, 3),
            locItem([ // first
              locItem('Ashlands_Ruins_Wall_Broken3_4x6'),
              locItem('Ashlands_Ruins_Wall_Broken4_4x6'),
              locItem([ // second
                locItem('Ashlands_Ruins_Wall_Broken5_4x6', 0.5),
                locItem('Ashlands_Ruins_Wall_Top_thin', 0.5),
              ], 0.9),
            ], 0.9),
          ], 0.81),
          // floor
          locItem('Ashlands_Floor', 1, 8),
          locItem('Ashlands_Floor', 0.5, 7),
        ], 0.75, 4),
        // rubble
        locItem('Ashlands_Floor', 0.5, 14),
        locItem('Ashlands_floor_large', 1, 8),
      ],
      dist: [0, 1],
    }
  ]
};

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
      dist: [0, 1],
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
      dist: [0, 1],
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
      dist: [0, 1],
    },
  ],
};
