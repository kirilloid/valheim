import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  7, 'CharredTowerRuins1_dvergr', ['Ashlands'],
  { type: 'misc',
    biomeArea: 7, quantity: 30, group: 'towerruins', minApart: 100,
    terrainDelta: [0, 4], minAlt: 0, radius: [22, 12],
    items: [
/*        locItem([ // pillar
        locItem('Ashlands_Floor'),
        locItem('Pickable_SmokePuff', 0.33),
        locItem([ // pillar2
          locItem('Ashlands_Pillar4'),
          locItem([ // pillar3
            ROOF1(1, true),
            ROOF2(2, false),
            ROOF1(2, false),
            locItem([ // roof2
              locItem('Ashlands_ArchRoofDamaged_half2', 0.66),
              TIP,
            ], 0.9),
          ], 0.9, 2),
        ], 0.9),
      ], 1, 12 + 0.6 * 4), */
      locItem('Pickable_SmokePuff', 0.6 * 0.33, 4),
      locItem('Pickable_Fiddlehead', 0.9 ** 3 * 0.5, 64),
      locItem('fire_pit_iron'),
      locItem('DvergerAshlands', 1, 2),
      locItem('DvergerAshlands', 0.75, 3),
      locItem('dvergrprops_wood_stakewall', 0.8, 12),
      locItem('dvergrprops_barrel', 1),
      locItem('dvergrprops_barrel', 0.5),
      locItem('dvergrprops_lantern_standing', 0.5, 3),
      locItem('dvergrprops_stool', 0.5, 4),
      // floor
      locItem('Ashlands_Floor', 1, 21),
      locItem('dvergrprops_crate_ashlands', 1, 5),
      locItem('dvergrprops_crate_ashlands', 0.5, 4),
    ],
  },
  'CharredTowerRuins_big',
);
