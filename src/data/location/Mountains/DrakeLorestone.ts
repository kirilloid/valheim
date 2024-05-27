import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  4, 'DrakeLorestone', ['Mountain'],
  { quantity: 50, group: 'Runestones', minApart: 12800, radius: [20, 4],
    items: [locItem('RuneStone_Drake')],
  }
);
