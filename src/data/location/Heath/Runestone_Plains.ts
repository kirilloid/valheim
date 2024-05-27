import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  5, 'Runestone_Plains', ['Plains'],
  { type: 'runestone', quantity: 100, group: 'Runestones', minApart: 128, radius: [20, 8],
    items: [locItem('RuneStone_Plains')],
  }
);

