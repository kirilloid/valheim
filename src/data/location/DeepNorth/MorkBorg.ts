import { locItem } from '../../../model/game';
import { morkhalla } from '../../rooms';
import { loc } from '../common';

export default loc(
  8, 'MorkBorg', ['DeepNorth'],
  { components: [],
    biomeArea: 7, quantity: 40,
    minApart: 275, terrainDelta: [0, 300], radius: [0, 30], minAlt: 30,
    items: [
      locItem('Morkhalla_RandomEye'),
    ],
    dungeon: morkhalla,
  },
);
