import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  7, 'SulfurArch', ['Ashlands'],
  { type: 'misc',
    biomeArea: 3, quantity: 200, minApart: 40,
    terrainDelta: [0, 6], minAlt: 10, radius: [30, 12],
    items: [
      locItem('cliff_ashlands3_Arch_1'),
      locItem('Pickable_SulfurRock', 0.4, 20),
      locItem('cliff_ashlands6', 0.45, 18),
    ],
  },
  'SulfurArch',
);
