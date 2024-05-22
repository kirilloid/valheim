import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  2, 'StoneTowerRuins10', ['BlackForest'],
  { quantity: 80, group: 'Stonetowerruins', minApart: 200, terrainDelta: [0, 2], minAlt: 2, radius: [20, 7],
    customMusic: 'BlackForestLocationMusic',
    items: [
      locItem([locItem('Skeleton', 0.5, 2)], 0.25),
      locItem([
        locItem('TreasureChest_blackforest'),
        locItem('Skeleton', 0.5, 2),
      ], 0.5),
      locItem('Skeleton', 0.5, 3),
      locItem('Crow', 1, 2),
    ],
  },
  'StoneTowerRuinsF',
);
