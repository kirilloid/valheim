import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  3, 'Grave1', ['Swamp'],
  { biomeArea: 6, quantity: 200, minAlt: 0.5, radius: [20, 12.04],
    items: [
      locItem('TreasureChest_swamp', 0.5),
      locItem('Spawner_DraugrPile', 1, 2),
      locItem('BonePileSpawner', 1, 1),
    ],
  },
  'Grave',
);
