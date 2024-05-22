import { locItem } from '../../../model/game';
import { forestcrypt } from '../../rooms';
import { loc } from '../common';

export default loc(
  2, 'Crypt2', ['BlackForest'],
  { type: 'dungeon', components: ['DungeonGenerator'],
    quantity: 200, minApart: 128, terrainDelta: [0, 2], radius: [21, 12],
    items: [locItem('Skeleton', 1, 3)],
    dungeon: forestcrypt, 
  },
  'Crypt',
);
