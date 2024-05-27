import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  3, 'Bonemass', ['Swamp'],
  { type: 'altar',
    biomeArea: 6, quantity: 5, prioritized: true, minApart: 3000, terrainDelta: [0, 4],
    minDistance: 2000, minAlt: 0, maxAlt: 2, radius: [20, 19.79],
    items: [
      locItem('Bonemass'),
      locItem('RuneStone_Bonemass'),
    ],
  }
);
