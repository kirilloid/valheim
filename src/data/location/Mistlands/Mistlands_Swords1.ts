import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  6, 'Mistlands_Swords1', ['Mistlands'],
  { type: 'misc',
    biomeArea: 2, quantity: 33, group: 'GiantArmor', minApart: 256,
    terrainDelta: [0, 10], minAlt: -1, radius: [20, 12],
    items: [
      // MIST AREA R=20 chance=0.5
      locItem('giant_sword1', 0.66),
      locItem('giant_sword2', 0.5),
      // laying sword
      locItem([
        locItem('giant_sword1', 0.5),
        locItem('giant_sword2'),
      ], 0.75),
      locItem('giant_helmet2'),
    ],
  },
  'Mistlands_GiantArmor',
);
