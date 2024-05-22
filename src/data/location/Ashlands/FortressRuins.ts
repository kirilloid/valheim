import { fortressRuins } from '../../rooms';
import { loc } from '../common';

export default loc(
  7, 'FortressRuins', ['Ashlands'],
  { components: ['DungeonGenerator'],
    biomeArea: 7, quantity: 200, group: 'zigg', maxApart: 60,
    terrainDelta: [0, 4], minAlt: 0, radius: [32, 12],
    items: [],
    camp: fortressRuins,
  },
  'FortressRuins',
);
