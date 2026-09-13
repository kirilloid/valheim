import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  8, 'ShipSetting02', ['DeepNorth'],
  { components: [],
    biomeArea: 7, quantity: 100, group: 'shipsetting', minApart: 64,
    radius: [20, 24], terrainDelta: [0, 2], minAlt: 2,
    items: [
      locItem('Pickable_MorkHallaTreasure_Group', 0.5),
      locItem('Pickable_MorkHallaTreasure', 0.5),
    ],
  },
  'ShipSetting',
);
