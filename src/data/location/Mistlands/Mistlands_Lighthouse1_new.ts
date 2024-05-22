import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  6, 'Mistlands_Lighthouse1_new', ['Mistlands'],
  { type: 'misc',
    biomeArea: 2, quantity: 100, group: 'Dvergr', minApart: 128,
    randomRotation: false, slopeRotation: true,
    terrainDelta: [0, 40], minAlt: 1, maxAlt: 20, radius: [20, 20],
    customMusic: 'Music_DvergrTower2',
    items: [
      locItem([
        locItem('Pickable_DvergrLantern', 0.75, 3),
        locItem('dvergrprops_table'),
        locItem('Pickable_DvergrStein', 0.2),
        locItem('dvergrprops_stool', 0.75, 3),
        locItem('dvergrprops_chair', 0.75, 2),
      ], 0.75),
      locItem([
        locItem('dvergrprops_table'),
        locItem('Pickable_DvergrStein', 0.2, 2),
        locItem('dvergrprops_stool', 0.75, 2),
        locItem('dvergrprops_chair', 0.75, 1),
      ], 0.75),
      locItem('Spawner_DvergerArbalest', 1, 2),
      locItem('Spawner_DvergerArbalest', 0.5),
      locItem('Spawner_DvergerMage', 1, 3),
      locItem('dvergrprops_bed', 0.5, 3),
      locItem('dverger_guardstone'),
      locItem('dvergrprops_crate_long'),
    ],
  },
  'Mistlands_Lighthouse',
);
