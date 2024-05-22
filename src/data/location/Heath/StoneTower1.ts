import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  5, 'StoneTower1', ['Plains'],
  { quantity: 50, group: 'Goblintower', minApart: 512, radius: [20, 14],
    customMusic: 'Music_FulingCamp',
    items: [
      locItem('goblin_totempole'),
      locItem('Goblin', 0.54, 6),
      locItem('GoblinTotem', 1, 1),
      locItem([
        locItem('TreasureChest_heath', 1, 1),
        locItem('Goblin', 0.54, 3),
      ], 0.5, 1),
    ],
  },
  'StoneTower',
);
