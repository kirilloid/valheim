import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  1, 'Dolmen02', ['Meadows', 'BlackForest'],
  { biomeArea: 3, quantity: 100, terrainDelta: [0, 2], radius: [20, 8],
    customMusic: 'BlackForestLocationMusic',
    items: [
      locItem('BoneFragments', 0.5, 1),
      locItem('Pickable_DolmenTreasure', 0.2),
      // locItem('Rock_4', 1, 4),
      // locItem('Rock_4', 0.5, 1),
    ],
  },
  'Dolmen',
);
