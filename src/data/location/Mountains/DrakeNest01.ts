import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  4, 'DrakeNest01', ['Mountain'],
  { quantity: 200, minApart: 100, minAlt: 100, maxAlt: 2000, radius: [20, 5],
    items: [
      locItem('Hatchling', 0.66, 3),
      locItem('DragonEgg'),
    ],
  },
  'DrakeNest',
);
