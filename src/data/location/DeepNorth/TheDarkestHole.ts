import { locItem } from '../../../model/game';
import { loc } from '../common';

// disabled
export default loc(
  8, 'TheDarkestHole', ['DeepNorth'],
  { components: [],
    biomeArea: 2, quantity: 1, prioritized: true, group: 'thehole',
    minApart: 60, terrainDelta: [0, 300], minAlt: 20, radius: [20, 32],
    items: [
      // interior
      locItem('Pickable_GlowWorm', 0.6, 6),
      locItem('HoleRock_root1', 0.2, 170),
      locItem('HoleRock_root1', 0.8, 18),
      locItem('HoleRock_root1', 0.6, 45),
      // exterior
      // -walls
      locItem('HoleRock_curved1', 1, 11),
      locItem('HoleRock_curved2', 1, 3),
      locItem('StumpHole'),
      locItem('Pinetree_Snow_dead', 0.66, 15),
    ],
  },
);
