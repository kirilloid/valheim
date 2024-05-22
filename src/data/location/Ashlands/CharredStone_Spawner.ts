import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  7, 'CharredStone_Spawner', ['Ashlands'],
  { type: 'misc',
    biomeArea: 3, quantity: 350, minApart: 100,
    terrainDelta: [0, 10], minAlt: 0, radius: [20, 12],
    items: [
      locItem('Spawner_CharredStone'),
      locItem('GraveStone_Broken_CharredTwitcherNest', 0.5, 12),
      locItem('GraveStone_CharredTwitcherNest', 0.5, 12),
    ],
  },
  'CharredStone_Spawner',
);
