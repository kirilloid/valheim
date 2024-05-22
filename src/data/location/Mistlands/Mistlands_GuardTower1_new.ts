import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  6, 'Mistlands_GuardTower1_new', ['Mistlands'],
  { type: 'misc',
    biomeArea: 2, quantity: 75, group: 'Dvergr', minApart: 128,
    randomRotation: false, slopeRotation: true,
    terrainDelta: [0, 10], minAlt: 2, radius: [20, 24],
    customMusic: 'Music_DvergrTower2',
    items: [
      // fort
      locItem([
        // floor
        locItem([
          locItem('dvergrprops_chair', 0.75, 4),
          locItem('dverger_guardstone'),
          locItem('Pickable_DvergrLantern', 0.5),
          locItem('dvergrprops_table', 1, 2),
        ]),
        // floor1/random
        locItem([
          locItem('dvergrprops_stool', 0.75),
          locItem('dvergrprops_stool', 0.5),
          locItem('dvergrprops_chair', 0.75, 2),
          locItem('dvergrprops_table'),
          locItem('Pickable_DvergrStein', 0.2),
        ], 0.5),
        // room/random
        locItem([
          locItem('Pickable_DvergrLantern', 0.75),
          locItem('dvergrprops_table'),
          locItem('dvergrprops_stool', 0.75, 2),
          locItem('dvergrprops_chair', 0.75, 2),
        ], 0.75),
        // stair
        locItem('dvergrtown_stair_corner_wood_left', 1, 14),
        locItem('dvergrprops_wood_pole', 1, 5),
      ]),
      // ..
      locItem([
        locItem('dvergrprops_crate', 1, 3),
        locItem('dvergrprops_crate', 0.5, 2),
      ], 1, 2),
      locItem('Spawner_DvergerArbalest', 1, 3),
      locItem('Spawner_DvergerArbalest', 0.5),
      locItem('Spawner_DvergerMage', 1, 2),
      locItem('Spawner_DvergerMage', 0.5, 2),
      locItem('dvergrprops_wood_stakewall', 0.66, 6),
      locItem('Pickable_DvergrLantern', 0.75, 2),
      locItem('dvergrprops_bed', 0.5, 4),
      locItem('dvergrprops_crate_long'),
    ],
  },
  'Mistlands_GuardTower',
);
