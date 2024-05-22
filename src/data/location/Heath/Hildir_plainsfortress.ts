import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  5, 'Hildir_plainsfortress', ['Plains'],
  { components: [],
    biomeArea: 2, quantity: 3, prioritized: true,
    minApart: 3000, terrainDelta: [0, 4], minAlt: 8, radius: [32, 32],
    // FIXME camp / dungeon: ?
    items: [
      locItem('GoblinShaman_Hildir'),
      locItem('GoblinBrute_Hildir'),
      locItem('GoblinBruteBros'),
    ],
  },
  'Hildir_plainsfortress',
);
