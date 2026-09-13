import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  8, 'ShipSetting03', ['DeepNorth'],
  { components: [],
    biomeArea: 7, quantity: 50, group: 'shipsetting', minApart: 64,
    radius: [20, 24], terrainDelta: [0, 2], minAlt: 2,
    items: [
      locItem([
        locItem('Pickable_MorkHallaTreasure_Group', 0.5),
        locItem('Pickable_MorkHallaTreasure', 0.5),
      ], 1, 3),
    ],
  },
  'ShipSetting',
);
