import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  7, 'CharredTowerRuins3', ['Ashlands'],
  { type: 'misc',
    biomeArea: 7, quantity: 40, minApart: 500,
    terrainDelta: [0, 4], minAlt: 0, radius: [12, 12],
    items: [
      locItem('Spawner_CharredTwitcherNest'),
      locItem('GraveStone_Broken_CharredTwitcherNest', 0.5, 10),
      locItem('GraveStone_CharredTwitcherNest', 0.5, 10),
    ],
  },
  'CharredTowerRuins_small',
);
