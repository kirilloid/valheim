import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  1, 'StartTemple', ['Meadows'],
  { biomeArea: 2, quantity: 1, prioritized: true, centerFirst: true, iconAlways: true, inForest: [1, 5], minAlt: 3, radius: [20, 25],
    items: [
      locItem('BossStone_Eikthyr'),
      locItem('BossStone_TheElder'),
      locItem('BossStone_Bonemass'),
      locItem('BossStone_DragonQueen'),
      locItem('BossStone_Yagluth'),
      locItem('BossStone_TheQueen'),
      locItem('BossStone_Fader'),
      locItem('StartPlatform'),
      locItem('Vegvisir_Eikthyr'),
      locItem('Bush01', 1, 2),
      locItem('RaspberryBush', 1, 2),
      locItem('Pickable_Mushroom', 1, 2),
      locItem('Pickable_Branch', 1, 2),
      locItem('Pickable_Branch', 0.744),
      locItem('Pickable_Branch', 0.758),
      // stone
      locItem('Pickable_Stone', 0.5),
      locItem('Pickable_Stone', 0.739),
      locItem('Pickable_Stone', 1, 3),
      locItem('Pickable_Stone', 0.506),
      locItem('Pickable_Stone', 0.702),
      locItem('Pickable_Stone', 0.488),
    ],
  },
);
