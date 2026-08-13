import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  1, 'Dolmen02', ['Meadows', 'BlackForest'],
  { biomeArea: 3, quantity: 100, terrainDelta: [0, 2], radius: [20, 8],
    customMusic: 'BlackForestLocationMusic',
    items: [
      locItem('Spawner_Skeleton_Meadows_night_noarcher', 0.5),
      locItem('stone_wall_2x1'),
      // dolmen
      locItem('RockDolmen_2'),
      locItem('Rock_7', 1, 4),
      // loot
      locItem('Pickable_DolmenTreasure', 0.2),
      // -
      locItem('Pickable_ForestCryptRemains01', 0.5),
      locItem('Rock_7', 0.5),
    ],
  },
  'Dolmen',
);
