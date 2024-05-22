import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc( // $location_mausoleum
  7, 'PlaceofMystery3', ['Ashlands'],
  { type: 'misc',
    biomeArea: 2, quantity: 1, prioritized: true, group: 'PlaceofMystery', minApart: 2048,
    terrainDelta: [0, 5], minAlt: 0, radius: [24, 12],
    items: [
      // exterior
      // graves
      locItem([
        locItem('GraveStone_Broken_CharredTwitcherNest', 0.5, 10),  
        locItem('GraveStone_CharredTwitcherNest', 0.5, 9),
      ], 0.5),
      locItem('Spawner_CharredStone_Elite'),
      // interior
      locItem('Spawner_Charred_Dyrnwyn'), // Charred_Melee_Dyrnwyn lvl=[3,3]
    ],
  },
  'PlaceofMystery',
);
