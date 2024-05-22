import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  2, 'StoneHouse4', ['BlackForest'],
  { quantity: 200, radius: [20, 7],
    items: [
      locItem('Greydwarf', 0.5, 2),
    ],
  },
  'StoneHouse',
);
