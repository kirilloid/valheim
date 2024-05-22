import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  4, 'MountainGrave01', ['Mountain'],
  {
    quantity: 100, minApart: 50, terrainDelta: [0, 2], minAlt: 100, radius: [20, 3.93],
    items: [
      // locItem('Pickable_MountainRemains01_buried'),
      locItem('BoneFragments'),
      locItem('SilverNecklace', 0.506),
      locItem('MountainGraveStone01', 1, 3),
      locItem('MountainGraveStone01', 0.5, 6),
    ],
  },
  'MountainGrave',
);
