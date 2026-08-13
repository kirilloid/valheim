import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  1, 'Dolmen03', ['Meadows', 'BlackForest'],
  { biomeArea: 3, quantity: 50, terrainDelta: [0, 2], radius: [20, 10],
    customMusic: 'BlackForestLocationMusic',
    items: [
      locItem('Spawner_Skeleton_Meadows_night_noarcher', 0.5),
      // dolmen
      locItem('RockDolmen_3'),
      locItem('Rock_7', 1, 5),
      locItem('Rock_7', 0.5, 1),
      // loot
      locItem('Pickable_DolmenTreasure', 0.3),
      // -
      locItem('Pickable_ForestCryptRemains01', 0.5),
      locItem('Pickable_ForestCryptRemains02'),
      locItem('Rock_7', 0.5, 2),
    ],
  },
  'Dolmen',
);
