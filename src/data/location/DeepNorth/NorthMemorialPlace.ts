import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  8, 'NorthMemorialPlace', ['DeepNorth'],
  { components: [],
    biomeArea: 2, quantity: 15, group: 'memorialplace',
    minApart: 400, minAlt: 2, terrainDelta: [0, 300], radius: [0, 25],
    customMusic: 'Music_DN_Memorial',
    items: [
      locItem([
        locItem('MemorialStone_Small'),
        locItem('Pickable_ForestCryptRemains03'),
        locItem('TreasureChest_memorial_buried', 0.5),
      ], 1, 3),
      locItem([
        locItem('MemorialStone_Small'),
        locItem('Pickable_ForestCryptRemains03'),
        locItem('TreasureChest_memorial_buried', 0.5),
      ], 0.9, 2),
      locItem([
        locItem('MemorialStone_Medium'),
        locItem('Pickable_ForestCryptRemains03'),
        locItem('TreasureChest_memorial_buried', 0.5),
      ], 1, 2),
      locItem([
        locItem('MemorialStone_Medium'),
        locItem('Pickable_ForestCryptRemains03'),
        locItem('TreasureChest_memorial_buried', 0.5),
      ], 0.9, 2),
      // MemorialRune
      locItem([
        locItem('RuneStone_Memorial1'),
        locItem('Pickable_ForestCryptRemains03'),
        locItem('TreasureChest_memorial_buried'),
      ]),
      locItem('Vegvisir_DNBoss'),
      locItem('offeraltar_memorialsite'), // FallenWarrior
    ],
  },
);
