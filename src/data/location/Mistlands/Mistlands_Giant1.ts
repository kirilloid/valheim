import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  6, 'Mistlands_Giant1', ['Mistlands'],
  { type: 'misc',
    biomeArea: 2, quantity: 350, prioritized: true, group: 'Giant', minApart: 256,
    terrainDelta: [0, 3], minAlt: -1, radius: [20, 10],
    items: [
      locItem('giant_sword1', 0.25),
      locItem('giant_ribs'),
      locItem('giant_skull'),
      locItem('giant_brain'),
      locItem('Spawner_Tick', 0.5, 5),
      // MIST AREA R=30
    ],
  },
  'Mistlands_Giant',
);
