import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  6, 'Mistlands_GuardTower3_ruined_new', ['Mistlands'],
  { type: 'misc',
    biomeArea: 2, quantity: 50, group: 'Dvergr', minApart: 128,
    randomRotation: false, slopeRotation: true,
    terrainDelta: [0, 10], minAlt: 11, radius: [20, 20],
    customMusic: 'Music_DvergrTower2',
    items: [
      locItem('YggaShoot_small1', 0.5, 5),
      locItem('Spawner_Seeker', 0.5, 4),        
    ],
  },
  'Mistlands_GuardTower',
);
