import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  1, 'CombatRuin01', ['Meadows'],
  { biomeArea: 3, quantity: 5, terrainDelta: [0, 1.5], inForest: [0.5, 1], radius: [20, 13],
    minApart: 2000, minDistance: 1500, minAlt: 5,
    items: [
      // ... lots of wooden stuff
      locItem('Pickable_ForestCryptRemains02', 0.8),
      locItem('Pickable_ForestCryptRemains03', 0.8),
      locItem('TreasureChest_meadows_combat'),
      locItem('BonePileSpawner'),
    ],
  },
  'CombatRuin',
);
