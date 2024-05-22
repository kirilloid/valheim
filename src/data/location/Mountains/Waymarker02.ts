import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  4, 'Waymarker02', ['Mountain'],
  { quantity: 50, terrainDelta: [0, 2], minAlt: 100, radius: [20, 3],
    items: [locItem('marker02')],
  },
  'Waymarker',
);
