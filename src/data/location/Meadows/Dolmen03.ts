import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  1, 'Dolmen03', ['Meadows', 'BlackForest'],
  { biomeArea: 3, quantity: 50, terrainDelta: [0, 2], radius: [20, 10],
    customMusic: 'BlackForestLocationMusic',
    items: [
      locItem('BoneFragments', 0.5, 1),
      locItem('BoneFragments', 1, 1),
      locItem('Pickable_DolmenTreasure', 0.3),
      // locItem('Rock_4', 1, 5),
      // locItem('Rock_4', 0.5, 3),
    ],
  },
  'Dolmen',
);
