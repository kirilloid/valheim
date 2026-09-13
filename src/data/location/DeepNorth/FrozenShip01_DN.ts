import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  2, 'FrozenShip01_DN', ['DeepNorth'],
  { quantity: 50, group: 'FrozenShip', minApart: 64, terrainDelta: [0, 100],
    randomRotation: false,
    slopeRotation: true,
    // snapToWater: true,
    minDistance: 8000, maxDistance: 9750,
    minAlt: -15, maxAlt: -5, radius: [20, 10],
    items: [
      // lots of ice
      locItem('frozenship'),
    ]
  },
  'FrozenShip_DN',
);
