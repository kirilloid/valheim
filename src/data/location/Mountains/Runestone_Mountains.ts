import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  4, 'Runestone_Mountains', ['Mountain'],
  { type: 'runestone', quantity: 100, group: 'Runestones', minApart: 12800, radius: [20, 8],
    items: [locItem('RuneStone_Mountains')]
  }
);
