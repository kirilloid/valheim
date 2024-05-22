import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  6, 'Mistlands_Giant2', ['Mistlands'],
  { type: 'misc',
    biomeArea: 2, quantity: 100, prioritized: true, group: 'Giant', minApart: 256,
    terrainDelta: [0, 4], minAlt: -1, radius: [20, 10],
    items: [
      locItem('giant_ribs'),
      // MIST AREA R=30
    ],
  },
  'Mistlands_Giant',
);
