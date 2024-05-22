import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  4, 'StoneTowerRuins04', ['Mountain'],
  { biomeArea: 3, quantity: 50, group: 'Mountainruin', minApart: 128, slopeRotation: true, terrainDelta: [6, 40], minAlt: 150, radius: [20, 12.28],
    customMusic: 'Music_MountainCottage',
    items: [
      locItem([
        locItem('TreasureChest_mountains', 0.66),
        locItem('Vegvisir_DragonQueen', 0.7),
      ], 0.9),
      locItem([locItem('Draugr', 1, 3)], 0.33),
    ],
  },
  'StoneTowerRuinsM',
);
