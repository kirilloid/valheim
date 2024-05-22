import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  2, 'Ruin1', ['BlackForest'],
  { quantity: 200, radius: [20, 10.7],
    customMusic: 'BlackForestLocationMusic',
    items: [
      locItem('Greydwarf', 1, 5),
      locItem('Greydwarf_Shaman', 1, 1),
      locItem('Crow', 1, 2),
      /*
      locItem('stone_wall_2x1', 1, 16),
      locItem([locItem('stone_wall_2x1', 1, 6)], 0.25),
      */
    ],
  },
  'RuinB',
);
