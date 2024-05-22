import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  3, 'InfestedTree01', ['Swamp'],
  { quantity: 700, minAlt: -1, radius: [20, 5],
    items: [
      locItem('GuckSack', 0.66, 6),
      locItem('GuckSack_small', 0.25, 3),
    ],
  },
  'InfestedTree',
);
