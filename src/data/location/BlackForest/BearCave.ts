import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  2, 'BearCave', ['BlackForest'],
  { type: 'dungeon',
    biomeArea: 2, quantity: 50, minApart: 256,
    terrainDelta: [5, 10], minAlt: 5, radius: [24, 12],
    customMusic: 'BlackForestLocationMusic',
    items: [
      // entrance
      locItem('Pickable_ForestCryptRemains03', 0.66),
      locItem('FirTree', 0.5),
      locItem([
        locItem('FirTree'),
        locItem('Beehive'),
      ], 0.5),
      locItem('BlueberryBush', 0.5, 3),
      // growing
      locItem('Pickable_Mushroom_yellow', 0.5, 22),
      locItem('Bear', 0.75),
    ],
  },
);
