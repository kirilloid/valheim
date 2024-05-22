import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  5, 'StoneHenge3', ['Plains'],
  { quantity: 5, group: 'Stonehenge', minApart: 1000, minAlt: 5, radius: [20, 30],
    customMusic: 'Music_StoneHenge',
    items: [
      locItem([
        locItem('GoblinBrute', 0.5, 2),
        locItem('GoblinBrute', 1, 1),
        locItem('TreasureChest_plains_stone', 1, 1),
      ], 0.5, 1),
      locItem('Vegvisir_GoblinKing', 0.4),
      // locItem([locItem('Rock_3', 1, 3)], 0.5),
      // locItem([locItem('Rock_3', 1, 5)], 0.5),
    ],
  },
  'StoneHengeL',
);
