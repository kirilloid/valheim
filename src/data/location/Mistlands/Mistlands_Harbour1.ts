import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  6, 'Mistlands_Harbour1', ['Mistlands'],
  { type: 'misc',
    biomeArea: 1, quantity: 100, group: 'Harbour', minApart: 64,
    randomRotation: false, slopeRotation: true, // snapToWater,
    terrainDelta: [2, 20], minAlt: -1, maxAlt: -0.25, radius: [20, 20],
    items: [
      // pier/crates(3)/
      locItem('dvergrprops_crate', 0.5, 3),
      // random/
      // random(1)
      locItem([
        locItem('Spawner_DvergerArbalest', 0.5),
      ], 0.5),
      // crates(2)
      locItem([
        locItem('dvergrprops_crate', 1, 2),
        // random
        locItem([
          locItem('dvergrprops_crate'),
          locItem('dvergrprops_crate', 0.5, 2),
        ], 0.5),
        locItem('Spawner_DvergerMage'),
      ], 0.25),
      // excavation
      locItem('dvergrtown_wood_crane'),
      locItem('dverger_guardstone'),
      locItem([
        locItem('Spawner_DvergerMage'),
        locItem('dvergrprops_crate_long'),
      ], 0.66),
      // ..
      locItem('Spawner_DvergerArbalest', 0.75),
    ],
  },
  'Mistlands_Harbour',
);
