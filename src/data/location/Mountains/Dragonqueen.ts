import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  4, 'Dragonqueen', ['Mountain'],
  { type: 'altar',
    biomeArea: 2, quantity: 3, prioritized: true,
    minApart: 3000, terrainDelta: [0, 4], maxDistance: 8000, minAlt: 150, maxAlt: 500, radius: [12, 20],
    items: [locItem('Dragon')],
  },
);
