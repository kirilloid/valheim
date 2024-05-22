import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  3, 'SwampRuin1', ['Swamp'],
  { biomeArea: 6, quantity: 30, group: 'SwampRuin', minApart: 256, radius: [20, 12], minAlt: -0.5,
    items: [
      locItem('Vegvisir_Bonemass', 0.3),
      locItem('TreasureChest_swamp', 0.251),
      locItem('Draugr', 0.5, 2),
      locItem('Draugr_Elite', 0.321),
      locItem('Spawner_DraugrPile', 0.321),
      locItem('Crow', 1, 2),
    ],
  },
  'SwampRuin',
);
