import { locItem } from '../../../model/game';
import { loc } from '../common';

export const SwampHut1 = loc(
  3, 'SwampHut1', ['Swamp'],
  { biomeArea: 3, quantity: 50, group: 'Swamphut', minApart: 128, minAlt: -2, radius: [20, 8],
    items: [
      locItem([
        locItem('TreasureChest_blackforest'),
        locItem('Wraith'),
      ], 0.1),
    ],
  },
  'SwampHut',
);

export const SwampHut2 = loc(
  3, 'SwampHut2', ['Swamp'],
  { quantity: 50, group: 'Swamphut', minApart: 128, minAlt: 2, radius: [20, 8],
    items: [
      locItem([
        locItem('TreasureChest_blackforest'),
        locItem('Wraith'),
      ], 0.1),
    ],
  },
  'SwampHut',
);

export const SwampHut3 = loc(
  3, 'SwampHut3', ['Swamp'],
  { quantity: 50, group: 'Swamphut', minApart: 128, minAlt: 2, radius: [20, 8],
    items: [
      locItem([
        // locItem('TreasureChest_blackforest'),
        locItem('Wraith'),
      ], 0.1),
    ],
  },
  'SwampHut',
);

export const SwampHut4 = loc(
  3, 'SwampHut4', ['Swamp'],
  { quantity: 50, group: 'Swamphut', minApart: 128, minAlt: -1, radius: [20, 8],
    items: [
      locItem([
        locItem('TreasureChest_blackforest'),
        locItem('Draugr', 1, 2),
        locItem('Draugr_Ranged', 0.2),
        locItem('Draugr_Ranged', 0.3),
      ], 0.75),
    ],
  },
  'SwampHut',
);

export const SwampHut5 = loc(
  3, 'SwampHut5', ['Swamp'], // tower
  { quantity: 25, group: 'Swamphut', minApart: 128, minAlt: -1, radius: [20, 10],
    items: [
      locItem([
        locItem('TreasureChest_blackforest'),
        locItem('Wraith'),
      ], 0.1),
      locItem('Crow', 1, 2),
    ],
  },
  'SwampHut',
);