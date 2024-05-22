import { locItem } from "../../../model/game";
import { loc } from "../common";
import { ARCH_TIP, FLOOR_AND_POTS, PEAK, POT_FLOOR_GREEN, POT_FLOOR_RED, STAIR_W_STONE } from "./_parts";

export default loc(
  7, 'CharredRuins3', ['Ashlands'],
  { type: 'misc',
    biomeArea: 2, quantity: 100,
    terrainDelta: [0, 6], minAlt: -10, radius: [12, 12],
    items: [
      locItem([ // base
        locItem('Ashlands_Pillar4'),
        locItem('Ashlands_Ruins_Wall_Broken3_4x6', 1, 2),
        locItem('Ashlands_Ruins_Wall_Broken5_4x6', 0.5),
        locItem([ // base (2)
          locItem('Ashlands_Pillar4'),
          locItem('Ashlands_Ruins_Wall_Broken4_4x6', 1, 2),
          locItem([ // wall_and_vine
            locItem('Ashlands_Ruins_Wall_Broken5_4x6'),
            locItem('VineAsh'),
          ], 0.6),
          locItem([ // base (3)
            STAIR_W_STONE,
            locItem('Ashlands_Ruins_Wall_Broken5_4x6', 0.5),
            locItem('Ashlands_Ruins_Floor_3x3_broken3', 0.5),
            locItem('Ashlands_Ruins_Wall_Broken3_4x6', 1, 2),
            locItem('Ashlands_Pillar4'),
            locItem([ // corner
              locItem('Ashlands_Pillar4'),
              locItem('Ashlands_Ruins_Wall_Window_4x6_broken5'),
              locItem('Ashlands_Ruins_Wall_Window_4x6_broken6'),
              locItem('Ashland_Steepstair'),
              locItem('Ashlands_Ruins_Wall_Window_4x6_broken2'),
              POT_FLOOR_GREEN(locItem('Ashlands_Ruins_Floor_3x3_broken1')),
              locItem([ // corner (1)
                locItem('Ashlands_Ruins_Wall_Window_4x6_broken2'),
                locItem('Ashlands_Ruins_Wall_Window_4x6_broken4'),
                locItem('Ashlands_Pillar4'),
                POT_FLOOR_RED(locItem('Ashlands_Ruins_Floor_3x3_broken2')),
                locItem([ // corner (2)
                  locItem('Ashlands_Ruins_Wall_Window_4x6_broken3'),
                  locItem('Ashlands_Ruins_Wall_Window_4x6_broken4'),
                  locItem('Ashlands_Ruins_Floor_3x3_broken3', 0.5),
                  locItem('Ashlands_Pillar4'),
                  locItem([ // corner (3)
                    locItem('Ashlands_Ruins_Wall_Window_4x6_broken5'),
                    locItem('Ashlands_Pillar4'),
                    locItem('Ashlands_Ruins_Wall_Window_4x6_broken6', 0.5),
                    STAIR_W_STONE,
                    locItem('Ashlands_Ruins_Wall_Window_4x6_broken2'),
                    locItem('Ashlands_Ruins_Floor_3x3_broken1', 0.5),
                    locItem([ // arch (1)
                      ARCH_TIP(),
                      ARCH_TIP(),
                      locItem('Ashlands_Arch2_Broken1', 1, 2),
                    ], 0.9),
                    PEAK(),
                  ], 0.9),
                ], 0.9),
              ], 0.9),
            ], 0.9),
          ], 0.9),
        ], 0.9),
      ], 0.9),
      locItem([ // base (1)
        locItem('Ashlands_Pillar4'),
        locItem('Ashlands_Ruins_Wall_Broken4_4x6', 1, 2),
        locItem([ // base (2)
          locItem('Ashlands_Pillar4'),
          locItem('Ashlands_Ruins_Wall_Broken3_4x6', 1, 2),
          locItem([ // base (3)
            locItem('Ashlands_Pillar4'),
            locItem('Ashlands_Ruins_Wall_Broken4_4x6', 1, 2),
            locItem([ // corner (1)
              STAIR_W_STONE,
              locItem('Ashlands_Ruins_Wall_Window_4x6_broken4', 1, 2),
              locItem('Ashlands_Pillar4'),
              locItem('Ashlands_Ruins_Floor_3x3_broken2', 0.5),
              locItem([ // corner (1)
                locItem('Ashlands_Ruins_Wall_Window_4x6_broken3', 1, 2),
                locItem('Ashlands_Ruins_Wall_Window_4x6_broken6', 1, 2),
                locItem('Ashlands_Pillar4'),
                locItem('Ashlands_Ruins_Floor_3x3_broken3', 0.5),
                locItem('Ashland_Steepstair'),
                locItem([ // corner (2)
                  locItem('Ashlands_Ruins_Wall_Window_4x6_broken5'),
                  locItem('Ashlands_Ruins_Wall_Window_4x6_broken2'),
                  locItem('Ashlands_Pillar4'),
                  POT_FLOOR_GREEN(locItem('Ashlands_Ruins_Floor_3x3_broken2')),
                  POT_FLOOR_RED(locItem('Ashlands_Ruins_Floor_3x3_broken1')),
                  locItem([ // corner (3)
                    PEAK(),
                    locItem([ // arch
                      locItem([ // arch2
                        ARCH_TIP(),
                        locItem('Ashlands_Arch2_Broken1'),
                      ], 0.9),
                      locItem('Ashlands_Arch2_Broken1'),
                    ], 0.9),
                    locItem('Ashlands_Ruins_Wall_Window_4x6_broken3', 0.5),
                    locItem('Ashlands_Ruins_Wall_Window_4x6_broken4', 0.5),
                    locItem('Ashlands_Pillar4'),
                  ], 0.9),
                ], 0.9),
              ], 0.9),
            ], 0.9),
          ], 0.9),
        ], 0.9),
      ], 0.9),
      locItem([ // base (3)
        locItem('Ashlands_Pillar4'),
        locItem('Ashlands_Ruins_Wall_Broken3_4x6', 1, 2),
        locItem('Ashlands_Ruins_Wall_Broken5', 0.5),
        locItem([ // base (3)
          locItem('Ashlands_Pillar4'),
          locItem('Ashlands_Ruins_Wall_Broken3_4x6', 1, 2),
          locItem('Ashland_Steepstair'),
          // wall_and_wine
          locItem('Ashlands_Ruins_Wall_Broken5_4x6'),
          locItem('VineAsh'),
          locItem([ // base (4)
            locItem('Ashlands_Pillar4'),
            locItem('Ashlands_Ruins_Wall_Broken3_4x6', 1, 2),
            locItem('Ashlands_Ruins_Wall_Broken5_4x6', 0.5),
            locItem([ // corner (3)
              locItem('Ashlands_Ruins_Wall_Window_4x6_broken5'),
              locItem('Ashlands_Ruins_Wall_Window_4x6_broken2'),
              locItem('Ashlands_Ruins_Wall_Window_4x6_broken6'),
              locItem('Ashlands_Pillar4'),
              POT_FLOOR_RED(locItem('Ashlands_Ruins_Floor_3x3_broken2')),
              locItem([ // corner (1)
                STAIR_W_STONE,
                locItem('Ashlands_Ruins_Wall_Window_4x6_broken2'),
                locItem('Ashlands_Ruins_Wall_Window_4x6_broken5'),
                locItem('Ashlands_Ruins_Wall_Window_4x6_broken6', 0.5),
                locItem('Ashlands_Ruins_Floor_3x3_broken3', 0.5),
                locItem('Ashlands_Pillar4'),
                locItem([ // corner (2)
                  locItem('Ashland_Steepstair'),
                  locItem('Ashlands_Ruins_Wall_Window_4x6_broken3'),
                  locItem('Ashlands_Ruins_Wall_Window_4x6_broken4'),
                  locItem('Ashlands_Pillar4'),
                  locItem([ // corner (3)
                    locItem('Ashlands_Ruins_Wall_Window_4x6_broken5'),
                    locItem('Ashlands_Ruins_Wall_Window_4x6_broken2'),
                    locItem('Ashlands_Pillar4'),
                    locItem('Ashlands_Arch2_Broken1', 1, 2),
                    PEAK(),
                    FLOOR_AND_POTS(locItem('Ashlands_Ruins_Wall_Window_4x6_broken6')),
                  ], 0.9),
                ], 0.9),
              ], 0.9),
            ], 0.9),
          ], 0.9),
        ], 0.9),
      ], 0.9),
      locItem([ // base (2)
        locItem('Ashlands_Pillar4'),
        locItem('Ashlands_Ruins_Wall_Broken4_4x6', 1, 2),
        locItem('Ashlands_Ruins_Wall_Broken5_4x6', 0.5, 2),
        locItem([ // base (4)
          locItem('Ashlands_Pillar4'),
          locItem('Ashlands_Ruins_Floor_3x3_broken3'),
          locItem('Ashlands_Ruins_Wall_Broken3_4x6'),
          locItem([ // wall_and_vine
            locItem('Ashlands_Ruins_Wall_Broken5_4x6', 0.5),
            locItem('VineAsh'),
          ]),
          locItem('Ashlands_Ruins_Wall_Broken3_4x6'),
          locItem([ // wall_and_vine
            locItem('Ashlands_Ruins_Wall_Broken5_4x6'),
            locItem('VineAsh'),
          ], 0.6),
          STAIR_W_STONE,
          locItem([ // base (5)
            locItem('Ashlands_Pillar4'),
            locItem('Ashlands_Ruins_Wall_Broken4_4x6', 1, 2),
            locItem('Ashlands_Ruins_Wall_Broken5_4x6', 0.5, 2),
            locItem('Ashland_Steepstair'),
            locItem([ // corner (2)
              locItem('Ashlands_Ruins_Wall_Window_4x6_broken3', 1, 2),
              locItem('Ashlands_Pillar4'),
              locItem('Ashlands_Ruins_Wall_Window_4x6_broken5'),
              locItem('Ashlands_Pillar4'),
              locItem([ // corner (1)
                locItem('Ashlands_Ruins_Wall_Window_4x6_broken4'),
                locItem('Ashlands_Ruins_Wall_Window_4x6_broken5'),
                locItem('Ashlands_Ruins_Wall_Window_4x6_broken6'),
                locItem('Ashlands_Pillar4'),
                locItem([POT_FLOOR_GREEN(locItem('Ashlands_Ruins_Floor_3x3_broken2'))], 0.5),
                locItem([ // corner (2)
                  locItem('Ashlands_Ruins_Wall_Window_4x6_broken2'),
                  locItem('Ashlands_Ruins_Floor_3x3_broken3', 0.5),
                  locItem('Ashlands_Pillar4'),
                  locItem([ // corner (3)
                    locItem('Ashland_Steepstair'),
                    STAIR_W_STONE,
                    locItem('Ashlands_Ruins_Wall_Window_4x6_broken4'),
                    locItem('Ashlands_Ruins_Wall_Window_4x6_broken5'),
                    locItem('Ashlands_Ruins_Wall_Window_4x6_broken3', 0.5),
                    locItem('Ashlands_Pillar4'),
                    locItem([ // arch
                      locItem([ // tip
                        locItem('Ashlands_Arch2_Broken2', 1, 2),
                        locItem('Ashlands_Pillar4_tip2_broken1'),
                        locItem('Ashlands_Pillar4_tip2_broken2', 0.6),
                        locItem([ // arch2
                          PEAK(
                            locItem('Ashlands_Arch2_Broken2', 1, 2),
                            locItem('Ashlands_Arch2_Broken2', 0.5, 2),
                          ),
                          locItem('Ashlands_Arch2_Broken1'),
                        ], 0.9),
                      ], 0.6),
                      locItem('Ashlands_Arch2_Broken1', 1, 2),
                    ], 0.9),
                    PEAK(),
                  ], 0.9),
                ], 0.9),
              ], 0.9),
            ], 0.9),
          ], 0.9),
        ], 0.9),
      ]),
      locItem('AshCrow', 0.5, 4),
    ],
  },
  'CharredRuins_small',
);
