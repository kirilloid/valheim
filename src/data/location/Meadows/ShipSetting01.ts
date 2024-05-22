import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  1, 'ShipSetting01', ['Meadows'],
  { quantity: 100, minApart: 128, radius: [20, 24],
    items: [
      locItem('BoneFragments', 1, 2),
      locItem('Rock_4', 1, 24),
      locItem('TreasureChest_meadows_buried', 0.8, 1),
    ],
  },
  'ShipSetting',
);
