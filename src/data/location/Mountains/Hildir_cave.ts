import { locItem } from '../../../model/game';
import { hildirCaves } from '../../rooms';
import { loc } from '../common';

export default loc( // Environment: CavesHildir
  4, 'Hildir_cave', ['Mountain'],
  { components: [],
    biomeArea: 2, quantity: 3, prioritized: true,
    minApart: 2000, terrainDelta: [0, 40], minAlt: 200, radius: [32, 15], minDistance: 1000,
    dungeon: hildirCaves,
    items: [
      // interior
      locItem('Fenring_Cultist_Hildir'),
      // exterior
      // room
      locItem('caverock_pillar', 0.75, 4),
      locItem('caverock_curvedrock', 1, 23),
      // icegroup
      locItem([
        locItem('caverock_ice_stalagmite'),
        locItem('caverock_ice_stalagtite'),
      ], 0.75, 4),
      locItem('MountainKit_brazier_blue', 1, 2),
      locItem('ice_rock1', 1, 3),
    ],
  },
  'Hildir_cave',
);
