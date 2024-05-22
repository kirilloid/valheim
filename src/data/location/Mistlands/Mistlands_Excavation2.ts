import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  6, 'Mistlands_Excavation2', ['Mistlands'],
  { type: 'dungeon',
  biomeArea: 2, quantity: 40, group: 'Excavation', minApart: 128,
  randomRotation: false, slopeRotation: true,
  terrainDelta: [0, 4], minAlt: 4, maxAlt: 100, radius: [20, 20],
    customMusic: 'Music_DvergrExcavationSite2',
    items: [
      // excavation
      locItem('trader_wagon_destructable'),
      locItem('giant_skull'),
      locItem('giant_brain'),
      locItem('dverger_guardstone'),
      // lanterns
      locItem('Pickable_DvergrLantern', 0.5, 6),
      // ..
      locItem('Spawner_DvergerMage', 0.5, 4),
      locItem('Spawner_DvergerArbalest', 0.5),
      locItem('Spawner_DvergerArbalest', 0.33, 5),
      locItem('Spawner_DvergerArbalest', 0.66, 2),
      locItem('dvergrprops_crate_long'),
    ],
  },
  'Mistlands_Excavation',
);
