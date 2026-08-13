import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  1, 'Dolmen01', ['Meadows', 'BlackForest'],
  // skeleton_no_archer, N, *, once 50%
  { biomeArea: 3, quantity: 100, terrainDelta: [0, 2], radius: [20, 8],
    customMusic: 'BlackForestLocationMusic',
    items: [
      locItem('Spawner_Skeleton_Meadows_night_noarcher', 0.5),
      // dolmen
      locItem('RockDolmen_1'),
      locItem('Rock_7', 0.5, 1),
      locItem('Rock_7', 1, 3),
      // -
      locItem('Pickable_ForestCryptRemains01', 0.5),
      // loot
      locItem('Pickable_DolmenTreasure', 0.1),
      // -
      locItem('Rock_7', 0.5, 2),
    ],
  },
  'Dolmen',
);
