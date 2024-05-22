import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  6, 'Mistlands_Excavation3', ['Mistlands'],
  { type: 'misc',
    biomeArea: 2, quantity: 40, group: 'Excavation', minApart: 96,
    randomRotation: false, slopeRotation: true,
    terrainDelta: [0, 5], minAlt: 4, maxAlt: 100, radius: [20, 17],
    customMusic: 'Music_DvergrExcavationSite2',
    items: [
      // fort/excavation
      locItem('dvergrtown_wood_crane'),
      locItem('dvergrprops_crate', 1, 6),
      // ..
      locItem('Spawner_Seeker', 1, 2),
      locItem('Spawner_Seeker', 0.5, 4),
    ],
  },
  'Mistlands_Excavation',
);
