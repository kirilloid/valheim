import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  1, 'Eikthyrnir', ['Meadows'],
  { type: 'altar',
    biomeArea: 2, quantity: 3, prioritized: true, maxDistance: 1000, radius: [20, 10],
    items: [
      locItem('StatueDeer'),
      locItem('Eikthyr'),
    ],
  },
);
