import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  8, 'DN_hut01', ['DeepNorth'],
  { components: [],
    biomeArea: 2, quantity: 40, group: 'northvillage', minApart: 100,
    minAlt: 40, terrainDelta: [0, 4], radius: [0, 12],
    items: [
      locItem('TreasureChest_deepnorth_village'),
      locItem('prop_ashwood_bed'),
    ],
  },
  'DN_hut',
);
