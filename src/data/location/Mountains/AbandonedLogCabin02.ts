import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  4, 'AbandonedLogCabin02', ['Mountain'],
  { quantity: 33, group: 'Abandonedcabin', minApart: 128, minAlt: 100, radius: [20, 10.51],
    customMusic: 'Music_MountainCottage',
    items: [
      locItem('StoneGolem', 0.5),
      locItem('StoneGolem', 0.1),
      locItem([
        locItem('wood_stack', 1),
        locItem('TreasureChest_mountains', 0.698),
      ], 0.764 * 0.648),
    ],
  },
  'AbandonedLogCabin',
);
