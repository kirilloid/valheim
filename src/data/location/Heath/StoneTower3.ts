import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  5, 'StoneTower3', ['Plains'],
  { quantity: 50, group: 'Goblintower', minApart: 512, radius: [20, 14],
    customMusic: 'Music_FulingCamp',
    items: [
      locItem('Goblin', 0.54, 10),
      locItem([
        locItem('TreasureChest_heath', 1, 1),
        locItem('Goblin', 0.54, 2),
      ], 0.5, 1),
    ],
  },
  'StoneTower',
);
