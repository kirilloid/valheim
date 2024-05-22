import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  6, 'Mistlands_RoadPost1', ['Mistlands'],
  { type: 'misc',
    biomeArea: 3, quantity: 500,
    terrainDelta: [0, 10], radius: [20, 16],
    items: [
      locItem('blackmarble_post01'),
      locItem('dverger_demister'),
      locItem('Spawner_DvergerMage', 0.5),
      locItem('Spawner_DvergerArbalest', 0.5),
    ],
  },
  'Mistlands_RoadPost',
);
