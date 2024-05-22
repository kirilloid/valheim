import { locItem } from '../../../model/game';
import { loc } from '../common';

export default   loc(
  7, 'LeviathanLava', ['Ashlands'],
  { type: 'misc',
    biomeArea: 3, quantity: 100,
    slopeRotation: true,
    terrainDelta: [0, 10], minAlt: 10, radius: [12, 12], // lava: true
    items: [locItem('LeviathanLava')],
  },
  'LeviathanLava',
);
