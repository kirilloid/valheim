import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  5, 'StoneHenge6', ['Plains'],
  { quantity: 20, group: 'Stonehenge', minApart: 500, minAlt: 2, radius: [20, 16],
    customMusic: 'Music_StoneHenge',
    items: [
      locItem([locItem('Rock_3', 1, 3)], 0.5),
      locItem([locItem('Rock_3', 1, 5)], 0.5),
    ],
  },
  'StoneHengeS',
);
