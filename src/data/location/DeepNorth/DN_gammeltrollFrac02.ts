import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  8, 'DN_gammeltrollFrac02', ['DeepNorth'],
  { components: [],
    biomeArea: 7, quantity: 30,
    terrainDelta: [0, 10], radius: [0, 8], minAlt: 10,
    // beacon: 20,
    items: [
      locItem('TrollFrost_Frac_arm'),
    ],
  },
  'DN_gammeltrollFrac',
);
