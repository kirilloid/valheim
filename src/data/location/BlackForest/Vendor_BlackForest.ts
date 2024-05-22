import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  2, 'Vendor_BlackForest', ['BlackForest'],
  { biomeArea: 2, quantity: 10, prioritized: true, unique: true, minApart: 512, iconPlaced: true, terrainDelta: [0, 2], minDistance: 1500, radius: [20, 12],
    customMusic: 'Music_Haldor2',
    items: [
      locItem('Halstein'),
      locItem('trader_wagon'),
      locItem('Haldor'),
      locItem('ForceField'), // 25
      // RuneStones
      locItem('TraderRune', 1, 4),
      // stuff
      locItem([
        locItem('TraderChest_static', 1, 6),
        locItem('barrell_static', 1, 5),
        locItem('fi_vil_container_barrel_small', 1, 7),
      ]),
      locItem('TraderTent'),
      locItem('TraderLamp'),
      locItem('fire_pit_haldor'),
      // carrots
    ]
  },
);
