import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  6, 'Mistlands_GuardTower1_ruined_new', ['Mistlands'],
  { type: 'misc',
    biomeArea: 2, quantity: 80, group: 'Dvergr', minApart: 128,
    randomRotation: false, slopeRotation: true,
    terrainDelta: [0, 10], minAlt: 2, radius: [20, 20],
    customMusic: 'Music_DvergrTower2',
    items: [
      // floor1
      locItem([
        locItem('Spawner_Seeker'),
        locItem('Spawner_Seeker', 0.5),
      ], 0.75),
      // roof
      locItem([
        locItem('Spawner_Seeker'),
        locItem('Spawner_Seeker', 0.5),
      ], 0.5),
      locItem('Spawner_Seeker', 0.5, 3),
    ],
  },
  'Mistlands_GuardTower',
);
