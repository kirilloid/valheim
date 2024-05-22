import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  1, 'Dolmen01', ['Meadows', 'BlackForest'],
  // skeleton_no_archer, N, *, once 50%
  { biomeArea: 3, quantity: 100, terrainDelta: [0, 2], radius: [20, 8],
    customMusic: 'BlackForestLocationMusic',
    items: [
      locItem('BoneFragments', 0.5, 1),
      locItem('Pickable_DolmenTreasure', 0.1),
      // locItem('Rock_4', 1, 3),
      // locItem('Rock_4', 0.5, 3),
    ],
  },
  'Dolmen',
);
