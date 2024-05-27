import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  2, 'Runestone_Greydwarfs', ['BlackForest'],
  { type: 'runestone',
    quantity: 25, group: 'Runestones', minApart: 128, maxDistance: 2000, radius: [20, 8],
    customMusic: 'Music_GreydwarfCamp',
    items: [
      locItem('RuneStone_Greydwarfs', 1, 4),
      locItem('FirTree_oldLog', 1, 4),
    ]
  }
);
