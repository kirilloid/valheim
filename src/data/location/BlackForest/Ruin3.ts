import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  5, 'Ruin3', ['Plains'],
  { quantity: 50, group: 'Goblintower', minApart: 512, radius: [20, 10],
    items: [
      locItem('TreasureChest_heath'),
      locItem('Goblin', 1, 2),
    ],
  },
  'RuinP',
);
