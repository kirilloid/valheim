import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  7, 'Runestone_Ashlands', ['Ashlands'],
  { type: 'runestone',
    biomeArea: 7, quantity: 75, minApart: 128,
    slopeRotation: true,
    terrainDelta: [0, 10], minAlt: 0, radius: [12, 12],
    items: [locItem('Runestone_Ashlands')],
  },
  'Runestone_Ashlands',
);