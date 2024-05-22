import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  1, 'StartTemple', ['Meadows'],
  { biomeArea: 2, quantity: 1, prioritized: true, centerFirst: true, iconAlways: true, inForest: [1, 5], minAlt: 3, radius: [20, 25],
    items: [
      locItem('BossStone_Bonemass'),
      locItem('BossStone_DragonQueen'),
      locItem('BossStone_Eikthyr'),
      locItem('BossStone_TheElder'),
      locItem('BossStone_Yagluth'),
      locItem('BossStone_TheQueen'),
      locItem('BossStone_Fader'),
      locItem('Vegvisir_Eikthyr'),
      locItem('Raspberry', 1, 2),
      locItem('Mushroom', 1, 2),
      // branches: Pickable_Branch
      locItem('Wood', 1, 2),
      locItem('Wood', 0.744),
      locItem('Wood', 0.758),
      // stone
      locItem('Stone', 0.5),
      locItem('Stone', 0.739),
      locItem('Stone', 1, 3),
      locItem('Stone', 0.506),
      locItem('Stone', 0.702),
      locItem('Stone', 0.488),
    ],
  },
);

