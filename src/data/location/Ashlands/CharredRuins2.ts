import { locItem } from '../../../model/game';
import { loc } from '../common';
import { ARCH_TIP, FLOOR_AND_POTS, PEAK, POT_FLOOR_GREEN, POT_FLOOR_RED, STAIR_W_STONE } from './_parts';

export default loc(
  7, 'CharredRuins2', ['Ashlands'],
  { type: 'misc',
    biomeArea: 2, quantity: 100,
    terrainDelta: [0, 6], minAlt: -10, radius: [15, 12],
    customMusic: 'Music_Ashlands_Ruins',
    items: [
      locItem([ // wingpart (1)
        locItem([ // corner
          locItem([ // floor
            locItem('Ashlands_Ruins_Wall_Window_4x6_broken4'),
            FLOOR_AND_POTS(),
          ], 0.5),
          locItem('Ashlands_Pillar4'),
          locItem('Ashlands_Ruins_Wall_Window_4x6_broken5'),
          locItem('Ashlands_Ruins_Wall_Window_4x6_broken6'),
          // wall_and_vine
          locItem('Ashlands_Ruins_Wall_Window_4x6_broken2'),
          locItem('VineAsh'),
          locItem('Ashlands_Ruins_Floor_3x3_broken1'),
          locItem('Ashlands_Ruins_Floor_3x3_broken3', 0.5),
          STAIR_W_STONE,
          locItem('Ashland_Steepstair'),
          locItem([ // corner (1)
            locItem('Ashlands_Ruins_Wall_Window_4x6_broken2'),
            locItem('Ashlands_Ruins_Wall_Window_4x6_broken4'),
            locItem('Ashlands_Pillar4'),
            locItem('Ashlands_Arch2_Broken1'),
            locItem('Ashland_Steepstair'),
            POT_FLOOR_RED(locItem('Ashlands_Ruins_Floor_3x3_broken2')),
            locItem([ // corner (2)
              locItem('Ashlands_Ruins_Wall_Window_4x6_broken3'),
              locItem('Ashlands_Ruins_Wall_Window_4x6_broken4'),
              locItem('Ashlands_Ruins_Floor_3x3_broken3', 0.5),
              locItem('Ashlands_Pillar4'),
              locItem([ // corner (3)
                locItem([ // arch (1)
                  ARCH_TIP(),
                  ARCH_TIP(),
                  locItem('Ashlands_Arch2_Broken1', 1, 2),
                  locItem('Ashlands_Ruins_Wall_Window_4x6_broken5'),
                  locItem('Ashlands_Ruins_Wall_Window_4x6_broken6', 0.5),
                  locItem('Ashlands_Ruins_Wall_Window_4x6_broken5'),
                  PEAK(),
                  FLOOR_AND_POTS(locItem('Vegvisir_Fader', 0.1)),
                ], 0.9),
                locItem('Ashlands_Pillar4'),
              ], 0.9),
            ], 0.9),
          ], 0.9),
        ], 0.6),
        locItem([ // corner (1)
          locItem('Ashlands_Ruins_Wall_Window_4x6_broken4', 1, 3),
          locItem('Ashlands_Pillar4'),
          locItem('Ashlands_Ruins_Wall_Window_4x6_broken2'),
          locItem('Ashlands_Ruins_Floor_3x3_broken3', 0.5),
          locItem('Ashlands_Ruins_Floor_3x3_broken2', 0.5),
          locItem('Ashland_Steepstair'),
          POT_FLOOR_RED(
            locItem('Ashlands_Ruins_Wall_Window_4x6_broken6'),
            locItem('Ashlands_Ruins_Floor_3x3_broken2'),
          ),
          locItem([ // corner (1)
            STAIR_W_STONE,
            locItem('Ashlands_Ruins_Wall_Window_4x6_broken3', 1, 3),
            locItem('Ashlands_Ruins_Wall_Window_4x6_broken6', 1, 2),
            locItem('Ashlands_Ruins_Wall_Window_4x6_broken4', 1, 1),
            locItem('Ashlands_Pillar4'),
            locItem('Ashlands_Ruins_Floor_3x3_broken3', 0.5, 2),
            STAIR_W_STONE,
            locItem('Ashlands_Arch2_Broken1', 1, 2),
            locItem('Ashland_Steepstair'),
            locItem([ // corner (2)
              locItem('Ashlands_Ruins_Wall_Window_4x6_broken5'),
              locItem('Ashlands_Ruins_Wall_Window_4x6_broken2', 1, 2),
              locItem('Ashlands_Pillar4'),
              locItem('Ashlands_Ruins_Floor_3x3_broken1', 0.5),
              locItem('Ashlands_Arch2_Broken1'),
              locItem([ // corner (3)
                PEAK(),
                locItem([ // arch
                  locItem([ // arch2
                    locItem([ // tip
                      locItem('Ashlands_Arch2_Broken2'),
                      locItem('Ashlands_Arch2_Broken1'),
                    ], 0.6),
                    locItem('Ashlands_Arch2_Broken1'),
                  ], 0.9),
                  locItem('Ashlands_Arch2_Broken1'),
                ], 0.9),
                locItem([ // arch / arch2
                  ARCH_TIP(),
                  locItem('Ashlands_Arch2_Broken1'),
                ], 0.9 * 0.9),
                locItem('Ashlands_Ruins_Wall_Window_4x6_broken3'),
                locItem('Ashlands_Ruins_Wall_Window_4x6_broken4', 0.5),
                locItem('Ashlands_Pillar4'),
                locItem([ // random
                  locItem('Ashlands_Ruins_Wall_Window_4x6_broken6'),
                  locItem('Ashlands_Arch2_Broken1'),
                ], 0.5),
              ], 0.9),
            ], 0.9),
            POT_FLOOR_GREEN(locItem('Ashlands_Ruins_Floor_3x3_broken3')),
          ], 0.9),
          POT_FLOOR_GREEN(locItem('Ashlands_Ruins_Floor_3x3_broken2')),
        ], 1),
        locItem([ // corner (2)
          // wall_and_vine
          locItem('Ashlands_Ruins_Wall_Window_4x6_broken3'),
          locItem('VineAsh'),
          locItem('Ashlands_Ruins_Wall_Window_4x6_broken3'),
          locItem('Ashlands_Ruins_Floor_3x3_broken3', 0.5),
          locItem('Ashlands_Pillar4'),
          locItem([ // corner (1)
            locItem('Ashlands_Ruins_Wall_Window_4x6_broken4'),
            locItem('Ashlands_Ruins_Wall_Window_4x6_broken5'),
            locItem('Ashlands_Ruins_Wall_Window_4x6_broken6'),
            locItem('Ashlands_Pillar4'),
            locItem([ // corner (2)
              locItem('Ashlands_Ruins_Wall_Window_4x6_broken2'),
              locItem('Ashlands_Ruins_Floor_3x3_broken3', 0.5),
              locItem('Ashlands_Pillar4'),
              locItem([ // corner (3)
                locItem([ // arch
                  locItem([ // tip
                    locItem('Ashlands_Pillar4_tip2_broken1'),
                    locItem('Ashlands_Pillar4_tip2_broken2', 0.6),
                    locItem('Ashlands_Arch2_Broken2', 1, 2),
                    locItem([ // arch2
                      PEAK(
                        locItem('Ashlands_Arch2_Broken2', 1, 2),
                        locItem('Ashlands_Arch2_Broken2', 0.5, 2),
                      ),
                    ], 0.9),
                  ], 0.6),
                  locItem('Ashlands_Arch2_Broken1', 1, 2),
                ], 0.9),
                locItem('Ashlands_Ruins_Wall_Window_4x6_broken4', 0.5),
                locItem('Ashlands_Ruins_Wall_Window_4x6_broken5'),
                locItem('Ashlands_Ruins_Wall_Window_4x6_broken3'),
                STAIR_W_STONE,
                locItem('Ashlands_Pillar4'),
                PEAK(),
              ], 0.9),
            ], 0.9),
            POT_FLOOR_GREEN(locItem('Ashlands_Ruins_Floor_3x3_broken2')),
          ], 0.9),
        ], 0.6),
        locItem([ // corner (3)
          locItem('Ashlands_Ruins_Wall_Window_4x6_broken5'),
          locItem('Ashlands_Ruins_Wall_Window_4x6_broken2'),
          locItem('Ashlands_Ruins_Wall_Window_4x6_broken6'),
          locItem('Ashlands_Pillar4'),
          // wall_and_vine
          locItem('Ashlands_Ruins_Wall_Window_4x6_broken2'),
          locItem('VineAsh'),
          locItem('Ashlands_Ruins_Floor_3x3_broken1'),
          STAIR_W_STONE,
          locItem([ // corner (1)
            locItem('Ashlands_Ruins_Wall_Window_4x6_broken2'),
            locItem('Ashlands_Ruins_Wall_Window_4x6_broken5'),
            locItem('Ashlands_Ruins_Wall_Window_4x6_broken6', 0.5),
            locItem('Ashlands_Ruins_Floor_3x3_broken3', 0.5),
            locItem('Ashlands_Pillar4'),
            locItem('Ashlands_Ruins_Wall_Window_4x6_broken4'),
            POT_FLOOR_RED(locItem('Ashlands_Ruins_Floor_3x3_broken2')),
            locItem([ // corner (2)
              locItem('Ashlands_Ruins_Wall_Window_4x6_broken3'),
              STAIR_W_STONE,
              locItem('Ashland_Steepstair'),
              locItem('Ashlands_Ruins_Wall_Window_4x6_broken4'),
              locItem('Ashlands_Ruins_Floor_3x3_broken2', 0.5),
              locItem('Ashlands_Pillar4'),
              locItem('Ashlands_Ruins_Wall_Window_4x6_broken3'),
              locItem([ // corner (3)
                locItem('Ashland_Steepstair'),
                locItem('Ashlands_Ruins_Wall_Window_4x6_broken5', 0.5),
                locItem('Ashlands_Ruins_Wall_Window_4x6_broken2'),
                locItem('Ashlands_Ruins_Floor_3x3_broken1', 0.5),
                locItem('Ashlands_Pillar4'),
                locItem('Ashlands_Arch2_Broken1'),
                locItem([ // arch (1)
                  locItem('Ashlands_Arch2_Broken2', 0.6), // tip
                  ARCH_TIP(),
                  locItem('Ashlands_Arch2_Broken1', 1, 2),
                ], 0.9),
                PEAK(),
              ], 0.9),
              FLOOR_AND_POTS(),
            ], 0.9),
          ], 0.9),
          POT_FLOOR_RED(locItem('Ashlands_Ruins_Floor_3x3_broken2')),
        ], 0.6),
        locItem('Ashlands_Ruins_Wall_4x6', 1, 4),
        locItem('Ashlands_Pillar4', 1, 4),
        locItem('Ashlands_Ruins_Wall_Broken4_4x6', 1, 2),
        locItem('Ashlands_Ruins_Wall_Broken5_4x6', 0.5, 3),
        locItem('Ashlands_Ruins_Wall_Broken3_4x6', 1, 2),
      ], 1),
      locItem([ // wingpart (2)
        locItem([ // corner (2)
          // wall_and_vine
          locItem('Ashlands_Ruins_Wall_Window_4x6_broken3'),
          locItem('VineAsh'),
          locItem('Ashlands_Ruins_Wall_Window_4x6_broken3'),
          locItem('Ashlands_Ruins_Floor_3x3_broken3', 0.5),
          locItem('Ashlands_Pillar4'),
          locItem([ // corner (1)
            locItem('Ashlands_Ruins_Wall_Window_4x6_broken4'),
            locItem('Ashlands_Ruins_Wall_Window_4x6_broken5'),
            locItem('Ashlands_Ruins_Wall_Window_4x6_broken6', 0.5),
            locItem('Ashlands_Ruins_Floor_3x3_broken2', 0.5),
            locItem('Ashlands_Pillar4'),
            locItem('Ashland_Steepstair'),
            STAIR_W_STONE,
            locItem([ // corner (2)
              locItem('Ashlands_Ruins_Wall_Window_4x6_broken2'),
              locItem('Ashlands_Pillar4'),
              locItem([ // corner (3)
                locItem([ // arch
                  ARCH_TIP(
                    locItem([ // arch2
                      locItem([ // peak
                        locItem('Ashlands_Arch2_Broken2', 1, 2),
                        locItem('Ashlands_Arch2_Broken2', 0.5, 2),
                        locItem('Ashlands_Pillar4_tip3_broken1'),
                        locItem([ // peak2
                          locItem('Ashlands_Pillar4_tip3_broken2'),
                          locItem('Ashlands_Pillar4_tip3_broken3', 0.8),
                        ], 0.6),
                      ], 0.6),
                      locItem('Ashlands_Arch2_Broken1'),
                    ], 0.9),
                  ),
                  locItem('Ashlands_Arch2_Broken1', 1, 2),
                ], 0.9),
                locItem('Ashlands_Ruins_Wall_Window_4x6_broken5'),
                PEAK(),
              ], 0.9),
            ], 0.9),
          ], 0.9),
        ], 0.6),
        locItem([ // corner (3)
          locItem('Ashlands_Ruins_Wall_Window_4x6_broken5'),
          locItem('Ashlands_Ruins_Wall_Window_4x6_broken2'),
          locItem('Ashlands_Ruins_Wall_Window_4x6_broken6'),
          locItem('Ashlands_Pillar4'),
          // wall_and_vine
          locItem('Ashlands_Ruins_Wall_Window_4x6_broken3'),
          locItem('VineAsh'),
          locItem('Ashlands_Pillar4'),
          locItem('Ashlands_Ruins_Wall_Broken3_4x6'),
          locItem('Ashlands_Ruins_Wall_Broken5_4x6', 0.5),
          locItem('Ashlands_Ruins_Wall_Broken4_4x6'),
          locItem([ // corner (1)
            locItem('Ashlands_Ruins_Wall_Window_4x6_broken2'),
            locItem('Ashlands_Ruins_Wall_Window_4x6_broken5'),
            locItem('Ashlands_Ruins_Wall_Window_4x6_broken6', 0.5),
            locItem('Ashlands_Pillar4'),
            locItem('Ashland_Steepstair'),
            POT_FLOOR_RED(locItem('Ashlands_Ruins_Floor_3x3_broken3')),
            locItem([ // corner (2)
              locItem('Ashlands_Ruins_Wall_Window_4x6_broken3'),
              locItem('Ashlands_Ruins_Wall_Window_4x6_broken4'),
              locItem('Ashlands_Pillar4'),
              STAIR_W_STONE,
              locItem('Ashland_Steepstair'),
              STAIR_W_STONE,
              locItem([ // corner (3)
                locItem('Ashlands_Arch2_Broken1', 1, 2),
                PEAK(),
              ], 0.9),
              POT_FLOOR_RED(locItem('Ashlands_Ruins_Floor_3x3_broken1')),
            ], 0.9),
            locItem([ // corner (3)
              locItem('Ashlands_Ruins_Wall_Window_4x6_broken5', 0.5),
              locItem('Ashlands_Arch2_Broken1'),
              POT_FLOOR_GREEN(locItem('Ashlands_Ruins_Floor_3x3_broken2')),
              FLOOR_AND_POTS(),
            ], 0.9),
          ], 0.9),
          POT_FLOOR_RED(locItem('Ashlands_Ruins_Floor_3x3_broken1')),
        ], 0.6),
        locItem('Ashlands_Ruins_Wall_4x6'),
        locItem('Ashlands_Pillar4'),
        locItem('Ashlands_Ruins_Wall_Broken4_4x6'),
      ], 0.6),
      locItem([ // wingpart
        locItem([ // corner / corner (1)
          locItem('Ashlands_Ruins_Wall_Broken4_4x6', 1, 2),
          locItem('Ashlands_Ruins_Wall_Broken3_4x6'),
          locItem('Ashlands_Ruins_Wall_Broken5_4x6', 0.5),
          locItem('Ashlands_Pillar4'),
          locItem([ // corner (2)
            STAIR_W_STONE,
            locItem('Ashlands_Ruins_Floor_3x3_broken1', 0.5, 2),
            locItem('Ashlands_Ruins_Wall_Window_4x6_broken3', 0.5),
            STAIR_W_STONE,
            locItem('Ashland_Steepstair', 1, 2),
            locItem('Ashlands_Ruins_Wall_Window_4x6_broken3'),
            locItem('Ashlands_Ruins_Wall_Window_4x6_broken4'),
            locItem('Ashlands_Ruins_Floor_3x3_broken3', 0.5),
            locItem('Ashlands_Pillar4'),
            locItem('Ashlands_Arch2_Broken1', 1, 2),
            locItem('Ashlands_Ruins_Wall_Window_4x6_broken6'),
            locItem([ // corner (3)
              locItem([ // arch (1)
                ARCH_TIP(),
                ARCH_TIP(
                  locItem([ // peak
                    locItem('Ashlands_Pillar4_tip2_broken2', 0.5, 2),
                    locItem('Ashlands_Pillar4_tip2_broken2', 1, 2),
                    locItem('Ashlands_Pillar4_tip3_broken1'),
                    locItem([ // peak2
                      locItem('Ashlands_Pillar4_tip3_broken2'),
                      locItem('Ashlands_Pillar4_tip3_broken3', 0.8),
                    ], 0.6),
                  ], 0.6),
                ),
                locItem('Ashlands_Arch2_Broken1', 1, 2),
              ], 0.9),
              locItem('Ashlands_Ruins_Wall_Window_4x6_broken5', 0.5),
              locItem('Ashlands_Pillar4'),
              PEAK(),
              locItem('Ashlands_Ruins_Wall_Window_4x6_broken2'),
            ], 0.9),
          ], 0.9),
        ], 0.6 * 0.9),
        locItem([ // corner (1)
          locItem('Ashlands_Ruins_Wall_Broken3_4x6', 1, 2),
          locItem('Ashlands_Pillar4'),
          locItem([ // corner (1)
            locItem('Ashlands_Ruins_Wall_Broken5_4x6', 0.5),
            // wall_and_vine
            locItem('Ashlands_Ruins_Wall_Window_4x6_broken6'),
            locItem('VineAsh'),
            locItem([ // corner (2)
              locItem('Ashlands_Ruins_Wall_Window_4x6_broken5'),
              locItem('Ashlands_Ruins_Wall_Window_4x6_broken2'),
              locItem('Ashlands_Pillar4'),
              locItem([ // corner (3)
                PEAK(),
                locItem([ // arch
                  locItem([ // arch2
                    ARCH_TIP(),
                    locItem('Ashlands_Arch2_Broken1'),
                  ], 0.9),
                  locItem('Ashlands_Arch2_Broken1'),
                ], 0.9),
                locItem('Ashlands_Ruins_Wall_Window_4x6_broken3'),
                locItem('Ashlands_Ruins_Wall_Window_4x6_broken4', 0.5),
                locItem('Ashlands_Pillar4'),
                locItem('Ashlands_Ruins_Wall_Window_4x6_broken6', 0.5),
                STAIR_W_STONE,
                locItem('Ashland_Steepstair'),
              ], 0.9),
              POT_FLOOR_RED(locItem('Ashlands_Ruins_Floor_3x3_broken1')),
            ], 0.9),
          ], 0.9),
        ], 0.6),
      ], 0.6),
      locItem([ // wingpart (3)
        locItem([ // corner / corner (1) / corner (2)
          locItem('Ashlands_Ruins_Floor_3x3_broken3', 0.5),
          locItem([ // corner (3)
            locItem([ // arch (1)
              ARCH_TIP(),
              ARCH_TIP(
                locItem([ // peak
                  locItem('Ashlands_Arch2_Broken2', 1, 2),
                  locItem('Ashlands_Arch2_Broken2', 0.5, 2),
                  locItem('Ashlands_Pillar4_tip3_broken1'),
                  locItem([ // peak2
                    locItem('Ashlands_Pillar4_tip3_broken2'),
                    locItem('Ashlands_Pillar4_tip3_broken3', 0.8),
                  ], 0.6),
                ], 0.6),
              ),
              locItem('Ashlands_Arch2_Broken1', 1, 2),
            ], 0.9),
            locItem('Ashlands_Ruins_Wall_Window_4x6_broken6', 0.5),
            locItem('Ashlands_Ruins_Wall_Window_4x6_broken5', 0.5),
            locItem('Ashlands_Pillar4'),
            PEAK(),
            locItem('Ashlands_Ruins_Wall_Window_4x6_broken2', 0.5),
          ], 0.9),
        ], 0.6 * 0.9 * 0.9),
        locItem('Ashlands_Pillar4'),
        locItem('Ashlands_Ruins_Wall_Broken4_4x6'),
        locItem('Ashlands_Ruins_Wall_Broken3_4x6'),
        locItem('Ashlands_Ruins_Wall_Broken5_4x6', 0.5),
      ], 0.6),
      locItem('AshCrow', 0.5, 4),
    ],
  },
  'CharredRuins_small',
);
