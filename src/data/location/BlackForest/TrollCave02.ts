import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  2, 'TrollCave02', ['BlackForest'],
  { type: 'dungeon',
    biomeArea: 2, quantity: 200, minApart: 256,
    randomRotation: false, slopeRotation: true,
    terrainDelta: [5, 10], minAlt: 3, radius: [24, 12],
    customMusic: 'BlackForestLocationMusic',
    items: [
      // entrance
      locItem('BoneFragments', 0.66, 3),
      locItem('Troll', 0.33, 1),
      // growing
      locItem('MushroomYellow', 0.5, 12),
      locItem([
        locItem('TreasureChest_trollcave', 0.75, 2),
        locItem('Troll', 1, 1),
      ], 0.75),
      // pickups
      locItem('Pickable_ForestCryptRandom', 0.5, 9),
    ],
  },
  'TrollCave',
);
