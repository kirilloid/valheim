import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  6, 'Mistlands_GuardTower1_ruined_new2', ['Mistlands'],
  { type: 'misc',
    biomeArea: 2, quantity: 20, group: 'Dvergr', minApart: 128,
    randomRotation: false, slopeRotation: true,
    terrainDelta: [0, 10], minAlt: 2, radius: [20, 20],
    customMusic: 'Music_DvergrTower2',
    items: [
      locItem('Spawner_Seeker', 0.5, 3),        
      locItem('YggaShoot3'),        
    ],
  },
  'Mistlands_GuardTower',
);
