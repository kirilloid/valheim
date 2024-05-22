import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  2, 'Ruin2', ['BlackForest'],
  { quantity: 200, radius: [20, 9.89],
    customMusic: 'BlackForestLocationMusic',
    items: [
      locItem('Greydwarf_Elite', 0.2, 1),
      locItem('Greydwarf', 1, 5),
      locItem('Greydwarf', 0.2, 1),
      locItem('TreasureChest_blackforest', 0.3),
      locItem('barrell', 0.3),
      locItem('Vegvisir_GDKing', 0.3),
      locItem('Crow', 1, 2),
      /*
      locItem('stone_wall', 1, 63),
      locItem('stone_arch', 1),
      locItem('wood_door', 1),
      locItem('piece_chair', 1),
      */
    ],
  },
  'RuinB',
);
