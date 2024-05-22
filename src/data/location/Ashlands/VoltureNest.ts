import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  7, 'VoltureNest', ['Ashlands'],
  { type: 'misc',
    biomeArea: 3, quantity: 350, minApart: 100,
    terrainDelta: [0, 5], minAlt: 0, radius: [16, 12],
    items: [
      locItem('asksvin_carrion'),
      locItem('asksvin_carrion', 0.5, 2),
      locItem('asksvin_carrion2', 0.5, 3),
      locItem('Pickable_VoltureEgg', 0.5, 6),
      locItem('cliff_ashlands6', 0.4, 16),
    ],
  },
  'VoltureNest',
);
