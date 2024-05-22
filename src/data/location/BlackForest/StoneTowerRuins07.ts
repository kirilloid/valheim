import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  2, 'StoneTowerRuins07', ['BlackForest'],
  { quantity: 80, group: 'Stonetowerruins', minApart: 200, terrainDelta: [0, 2], minAlt: 2, radius: [20, 9],
    customMusic: 'BlackForestLocationMusic',
    items: [
      locItem([
        locItem('TreasureChest_blackforest'),
        locItem('Skeleton', 1),
        locItem('Skeleton', 0.5),
      ], 0.25),
      locItem([locItem('Skeleton')], 0.25, 2),
      locItem('Skeleton', 1, 2),
      locItem('Crow', 1, 2),
    ],
  },
  'StoneTowerRuinsF',
);
