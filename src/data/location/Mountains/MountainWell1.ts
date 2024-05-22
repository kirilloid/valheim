import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  4, 'MountainWell1', ['Mountain'],
  {
    quantity: 25, minApart: 25600, radius: [20, 14],
    items: [
      locItem('TreasureChest_mountains', 0.75),
    ],
  },
  'MountainWell',
);
