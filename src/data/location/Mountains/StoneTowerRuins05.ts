import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  4, 'StoneTowerRuins05', ['Mountain'],
  { biomeArea: 3, quantity: 50, group: 'Mountainruin', minApart: 128, slopeRotation: true, terrainDelta: [6, 40], minAlt: 150, radius: [20, 22],
    customMusic: 'Music_MountainCottage',
    items: [
      // corner towers
      locItem([locItem('Skeleton', 0.33, 3)], 0.33, 4),
      // central towers
      locItem([
        locItem('Skeleton', 0.33, 3),
        locItem('TreasureChest_mountains'),
      ], 0.5),
      // spawn
      locItem('Skeleton', 0.33, 4),
      locItem('BonePileSpawner', 0.5),
    ],
  },
  'StoneTowerRuinsM',
);
