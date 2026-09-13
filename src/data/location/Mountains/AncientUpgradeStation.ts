import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  4, 'AncientUpgradeStation', ['Mountain'],
  { quantity: 10, group: 'AncientUpgradeStation', minApart: 400, minDistance: 500,
    terrainDelta: [0, 40], minAlt: 100, radius: [22, 20],
    items: [
      locItem('UpgradeStation'),
      locItem('RuneStone_UpgradeStation'),
    ],
  },
);
