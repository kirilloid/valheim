import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  2, 'StoneHouse3', ['BlackForest'],
  { quantity: 200, radius: [20, 6],
    items: [
      locItem('Greydwarf'),
      locItem('TreasureChest_blackforest'),
    ],
  },
  'StoneHouse',
);
