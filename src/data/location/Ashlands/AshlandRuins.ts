import { loc } from '../common';
import { charredRuins } from '../../rooms';

export default loc(
  7, 'AshlandRuins', ['Ashlands'],
  { components: ['DungeonGenerator'],
    biomeArea: 2, quantity: 100, minApart: 16,
    terrainDelta: [0, 4], minAlt: 0, radius: [12, 12],
    customMusic: 'Music_Ashlands_Ruins 3',
    items: [],
    camp: charredRuins,
  },
  'AshlandRuins',
);
