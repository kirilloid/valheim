import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  2, 'ShipWreck01', ['BlackForest', 'Swamp', 'Plains', 'Ocean'],
  { quantity: 25, group: 'Shipwreck', minApart: 1024, terrainDelta: [0, 10], minAlt: -1, maxAlt: 1, radius: [20, 10],
    items: [
      locItem('shipwreck_karve_bottomboards', 0.5),
      locItem('shipwreck_karve_bow'),
      locItem('shipwreck_karve_dragonhead', 0.5),
      locItem('shipwreck_karve_bottomboards', 0.5),
      locItem('shipwreck_karve_chest', 0.749),
    ]
  },
  'ShipWreck',
);
