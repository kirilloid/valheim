import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  2, 'StoneTowerRuins09', ['BlackForest'],
  { quantity: 80, group: 'Stonetowerruins', minApart: 200, terrainDelta: [0, 2], minAlt: 2, radius: [20, 7],
    customMusic: 'BlackForestLocationMusic',
    items: [
      locItem([
        locItem('TreasureChest_blackforest'),
        locItem('Skeleton', 0.33, 4),
      ], 0.5),
      locItem('Skeleton', 0.33, 3),
      locItem('Crow', 1, 2),
    ],
  },
  'StoneTowerRuinsF',
);
