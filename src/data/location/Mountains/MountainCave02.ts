import { locItem } from '../../../model/game';
import { frostCaves } from '../../rooms';
import { loc } from '../common';

export default loc(
  5, 'MountainCave02', ['Mountain'],
  { type: 'dungeon', components: ['DungeonGenerator'],
    biomeArea: 3, quantity: 160, group: 'mountaincaves', minApart: 200,
    terrainDelta: [0, 40], minAlt: 100, maxAlt: 5000, radius: [32, 15],
    items: [
      locItem('Bat', 0.5, 12),
      locItem('Ulv', 0.3, 8),
      locItem('Fenring_Cultist', 0.2, 10),
      locItem('Pickable_Fishingrod', 0.1, 2),
      locItem('Pickable_Hairstrands01', 0.4, 6),
      locItem('Pickable_Hairstrands02', 0.4, 6),
      locItem('Pickable_MountainCaveCrystal', 0.4, 8),
      locItem('Pickable_MountainCaveObsidian', 0.4, 12),
      locItem('Pickable_MeatPile', 0.3, 3),
      locItem('Pickable_MountainCaveRandom', 0.4, 10),
    ],
    dungeon: frostCaves,
  },
  'MountainCave',
);
