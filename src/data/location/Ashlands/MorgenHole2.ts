import { locItem } from '../../../model/game';
import { loc } from '../common';
import * as P from './_partsMorgenhole';

export default loc(
  7, 'MorgenHole2', ['Ashlands'],
  { type: 'misc',
    biomeArea: 2, quantity: 40, group: 'MorgenHole', minApart: 200,
    terrainDelta: [0, 10], minAlt: 0, radius: [24, 24],
    items: [
      // exterior
      locItem(P.exterior),
      // interior
      locItem([
        locItem(P.bones),
        locItem(P.randomwall2, 0.25),
        locItem(P.randomwall3, 0.5),
        locItem(P.randomwall4, 0.5),
        locItem(P.chest),
        locItem('Morgen'),
        locItem('Vegvisir_placeofmystery_2', 0.2),
      ]),
    ],
  },
  'MorgenHole',
);
