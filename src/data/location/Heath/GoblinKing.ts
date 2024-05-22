import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  5, 'GoblinKing', ['Plains'],
  { type: 'altar',
    biomeArea: 2, quantity: 4, prioritized: true, minApart: 3000, terrainDelta: [0, 4], radius: [20, 32],
    items: [locItem('GoblinKing')]
  },
);
