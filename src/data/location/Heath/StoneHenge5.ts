import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  5, 'StoneHenge5', ['Plains'],
  { quantity: 20, group: 'Stonehenge', minApart: 500, minAlt: 2, radius: [20, 16],
    customMusic: 'Music_StoneHenge',
    items: [
      locItem([locItem('Goblin', 0.54, 3)], 0.75),
      locItem('Vegvisir_GoblinKing', 0.4),
      // locItem([locItem('Rock_3', 1, 4)], 0.75),
      // locItem('Rock_3', 1, 4),
    ],
  },
  'StoneHengeS',
);
