import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  4, 'AbandonedLogCabin03', ['Mountain'],
  { quantity: 33, group: 'Abandonedcabin', minApart: 128, minAlt: 100, radius: [20, 10],
    customMusic: 'Music_MountainCottage',
    items: [
      locItem('TreasureChest_mountains'),
      locItem('wood_stack', 1),
      locItem('wood_stack', 0.2),
      locItem('Skeleton', 0.5, 2),
      locItem('StoneGolem', 0.1, 1),
    ],
  },
  'AbandonedLogCabin',
);
