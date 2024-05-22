import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  5, 'StoneHenge4', ['Plains'],
  { quantity: 5, group: 'Stonehenge', minApart: 1000, minAlt: 5, radius: [20, 30],
    customMusic: 'Music_StoneHenge',
    items: [
      locItem('GoblinBrute', 0.5, 2),
      locItem('Vegvisir_GoblinKing', 0.4),
    ],
  },
  'StoneHengeL',
);
