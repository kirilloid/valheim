import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  2, 'FrozenShip03_DN', ['DeepNorth'],
  { quantity: 50, group: 'FrozenShip', minApart: 64, terrainDelta: [0, 100],
    // snapToWater: true,
    minDistance: 8000, maxDistance: 9750,
    minAlt: -15, maxAlt: -5, radius: [20, 16],
    items: [
      // lots of ice
      locItem('frozenship02', 0.5),
      locItem('frozenship03', 0.5),
      locItem('frozenship03', 0.5),
    ]
  },
  'FrozenShip_DN',
);
