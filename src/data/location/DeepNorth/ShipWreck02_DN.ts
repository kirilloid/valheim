import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  2, 'ShipWreck02_DN', ['DeepNorth'],
  { quantity: 120, minApart: 0, terrainDelta: [0, 2], radius: [20, 10], minAlt: -0.5, maxAlt: 1,
    items: [
      locItem('shipwreck_karve_bow'),
      locItem('shipwreck_karve_chest', 0.749),
      locItem('shipwreck_karve_stern'),
      locItem('shipwreck_karve_bottomboards'),
    ]
  },
  'ShipWreckDN',
);
