import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  6, 'Mistlands_Statue2', ['Mistlands'],
  { type: 'misc',
    biomeArea: 3, quantity: 200,
    randomRotation: false, slopeRotation: true,
    terrainDelta: [0, 10], minAlt: 2, radius: [20, 6],
    items: [
      locItem('blackmarble_head_big02'),
      locItem('blackmarble_2x2x2'),
      locItem('vines', 0.5, 7),
    ],
  },
  'Mistlands_Statue',
);
