import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  4, 'Waymarker01', ['Mountain'],
  { quantity: 50, terrainDelta: [0, 2], minAlt: 100, radius: [20, 3],
    items: [locItem('marker01')],
  },
  'Waymarker',
);
