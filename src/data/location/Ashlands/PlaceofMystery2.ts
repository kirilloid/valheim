import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  7, 'PlaceofMystery2', ['Ashlands'],
  { type: 'misc',
    biomeArea: 2, quantity: 1, prioritized: true, group: 'PlaceofMystery', minApart: 2048,
    terrainDelta: [0, 5], minAlt: 0, radius: [24, 12],
    items: [
      locItem('Pickable_Swordpiece2'),
      locItem('Spawner_CharredStone_Elite'),
      locItem('GraveStone_Broken_CharredTwitcherNest', 0.5, 16),
      locItem('GraveStone_CharredTwitcherNest', 0.5, 20),
      locItem('Pickable_MoltenCoreStand', 1, 4),
    ],
  },
  'PlaceofMystery',
);
