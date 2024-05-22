import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  4, 'AbandonedLogCabin04', ['Mountain'],
  { quantity: 50, group: 'Abandonedcabin', minApart: 128, minAlt: 100, radius: [20, 10],
    customMusic: 'Music_MountainCottage',
    items: [
      locItem('TreasureChest_mountains'),
      locItem('Skeleton', 0.5, 2),
      locItem('StoneGolem', 0.1, 2),
    ],  
  },
  'AbandonedLogCabin',
);
