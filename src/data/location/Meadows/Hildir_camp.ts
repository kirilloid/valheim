import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  2, 'Hildir_camp', ['Meadows'],
  { biomeArea: 3, quantity: 10, prioritized: true, unique: true, minApart: 1000, iconPlaced: true, terrainDelta: [0, 2], minDistance: 3000, radius: [20, 24],
    customMusic: 'Music_Hildir',
    items: [
      locItem('ForceField'), // 32
      // RuneStones
      locItem('TraderRune', 1, 4),
      // chest1
      locItem([
        locItem('hildir_chest1'),
        locItem('hildir_clothesrack1', 1, 2),
        locItem('hildir_fabricsroll1', 1, 6),
        locItem('hildir_table1'),
      ]),
      // chest2
      locItem([
        locItem('hildir_chest2'),
        locItem('hildir_table2'),
        locItem('hildir_fabricsroll1', 1, 5),
        locItem('hildir_fabricsroll2', 1, 6),
        locItem('hildir_table1'),
      ]),
      // chest3
      locItem([
        locItem('hildir_chest3'),
        locItem('hildir_table2'),
        locItem('hildir_clothesrack2'),
        locItem('hildir_clothesrack3', 1, 2),
        locItem('hildir_fabricsroll1', 1, 4),
        locItem('hildir_table'),
        locItem('hildir_hatstand'),
        locItem('hildir_hatstand1'),
        locItem('hildir_hatstand2'),
      ]),
      // stuff
      locItem([
        locItem('hildir_tent'),
        locItem('hildir_maptable'),
        locItem('hildir_barrel', 1, 6),
        locItem('hildir_flowergirland', 1, 6),
        locItem('hildir_divan'),
        locItem('hildir_divan1'),
        locItem('hildir_carpet', 1, 9),
        locItem('hildir_lantern', 1, 3),
        locItem('hildir_tent2', 1, 2),
      ]),
      locItem('fire_pit_hildir'),
      locItem('Hildir'),
      locItem('hildir_wagon'),
      locItem('HildirsLox', 1, 2),
      // turnips
    ]
  },
);
