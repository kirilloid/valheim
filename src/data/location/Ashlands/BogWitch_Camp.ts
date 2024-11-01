import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  3, 'BogWitch_Camp', ['Swamp'],
  { biomeArea: 2, quantity: 10, prioritized: true, unique: true, minApart: 1000,
    iconPlaced: true, randomRotation: true, terrainDelta: [0, 2],
    minDistance: 3000, maxDistance: 8000, radius: [24, 0],
    customMusic: 'Music_Haldor2',
    items: [
      locItem('BogWitch'),
      locItem('BogWitchKvastur'),
    ]
  },
);