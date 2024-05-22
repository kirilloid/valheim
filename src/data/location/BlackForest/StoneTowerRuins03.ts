import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  2, 'StoneTowerRuins03', ['BlackForest'],
  { quantity: 80, group: 'Stonetowerruins', minApart: 200, terrainDelta: [0, 2], minAlt: 2, radius: [20, 9],
    customMusic: 'BlackForestLocationMusic',
    items: [
      locItem([
        locItem('Skeleton', 1, 6),
        locItem('TreasureChest_blackforest'),
      ], 0.33),
      locItem([locItem('Greydwarf', 1, 3)], 0.5),
      locItem('Crow', 1, 2),
      // lvl1
      locItem([
        locItem('Beehive', 0.281),
        locItem('TreasureChest_blackforest'),
        locItem('Greydwarf', 0.5),
        locItem('Greydwarf_Elite', 0.5),
        locItem('Vegvisir_GDKing', 0.3),
      ], 0.818),
    ],
  },
  'StoneTowerRuinsF',
);
