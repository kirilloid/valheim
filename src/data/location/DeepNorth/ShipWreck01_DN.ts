import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  2, 'ShipWreck01_DN', ['DeepNorth'],
  { quantity: 170, terrainDelta: [0, 2], radius: [20, 10], minAlt: -0.5, maxAlt: 0.5,
    items: [
      locItem('shipwreck_vikingship_chest', 0.75),
      locItem('shipwreck_vikingship_front', 1, 2),
      locItem('shipwreck_vikingship_mast1', 0.75, 2),
      locItem('shipwreck_vikingship_frontpiece'),
      locItem('shipwreck_vikingship_rear'),
    ]
  },
  'ShipWreckDN',
);
