import { locItem } from '../../../model/game';
import { forestcrypt } from '../../rooms';
import { loc } from '../common';

export default loc( // Environment: CryptHildir
  2, 'Hildir_crypt', ['BlackForest'],
  { components: [],
    biomeArea: 2, quantity: 3, prioritized: true,
    minApart: 3000, terrainDelta: [0, 2], minAlt: 1, radius: [21, 18], minDistance: 3000,
    items: [
      locItem('Skeleton_Hildir'),
    ],
    dungeon: forestcrypt,
  },
  'Hildir_crypt',
);
