import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  2, 'GDKing', ['BlackForest'],
  { type: 'altar',
    biomeArea: 6, quantity: 4, prioritized: true, minApart: 3000, terrainDelta: [0, 5],
    minDistance: 1000, maxDistance: 7000, radius: [20, 25],
    items: [
      locItem('StatueSeed'),
      locItem('gd_king'),
    ],
  }
);
