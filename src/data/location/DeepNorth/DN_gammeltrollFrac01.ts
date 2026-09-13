import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  8, 'DN_gammeltrollFrac01', ['DeepNorth'],
  { components: [],
    biomeArea: 7, quantity: 30,
    terrainDelta: [0, 4], radius: [0, 8], minAlt: 5,
    // beacon: 20,
    items: [
      locItem('TrollFrost_Frac_legs'),
    ],
  },
  'DN_gammeltrollFrac',
);
