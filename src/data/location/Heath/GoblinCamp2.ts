import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  5, 'GoblinCamp2', ['Plains'],
  { quantity: 200, minApart: 250, randomRotation: false, minAlt: 2, radius: [20, 30],
    customMusic: 'Music_FulingCamp',
    items: [
      locItem('TreasureChest_heath', 0.5, 3),
      locItem([locItem('Flax', 0.5, 10)], 0.3, 3),
      locItem([locItem('Barley', 0.5, 10)], 0.3, 3),
      locItem('GoblinTotem', 0.6, 3),
      locItem('Goblin', 0.5, 20),
      locItem('GoblinBrute', 0.75, 4),
      locItem('GoblinShaman', 0.75, 4),
    ]
  },
  'GoblinCamp',
);
