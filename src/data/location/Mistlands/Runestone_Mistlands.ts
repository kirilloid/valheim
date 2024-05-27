import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  6, 'Runestone_Mistlands', ['Mistlands'],
  { type: 'runestone',
    biomeArea: 3, quantity: 50, group: 'Runestones', minApart: 128,
    slopeRotation: true,
    terrainDelta: [0, 10], minAlt: -1, radius: [20, 12],
    items: [locItem('RuneStone_Mistlands')],
  },
  'Runestone_Mistlands',
);
