import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  6, 'Mistlands_Swords3', ['Mistlands'],
  { type: 'misc',
    biomeArea: 2, quantity: 33, group: 'GiantArmor', minApart: 256,
    terrainDelta: [0, 10], minAlt: -1, radius: [20, 8],
    items: [
      // MIST AREA R=20 chance=0.5
      locItem('cliff_mistlands2'),
      // random
      locItem([
        locItem('giant_sword1'),
      ], 0.66),
      // random (1)
      locItem([
        locItem('giant_sword2', 0.75, 2),
        locItem('giant_sword1', 0.75),
      ], 0.66),
    ],
  },
  'Mistlands_GiantArmor',
);
