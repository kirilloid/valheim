import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  6, 'Mistlands_GuardTower2_new', ['Mistlands'],
  { type: 'misc',
    biomeArea: 2, quantity: 75, group: 'Dvergr', minApart: 128,
    randomRotation: false, slopeRotation: true,
    terrainDelta: [0, 10], minAlt: 4, radius: [20, 24],
    customMusic: 'Music_DvergrTower2',
    items: [
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
      locItem('dvergrprops_bed', 0.5, 3),
      locItem('dvergrprops_crate_long'),
    ],
  },
  'Mistlands_GuardTower',
);
