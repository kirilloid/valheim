import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  3, 'SwampWell1', ['Swamp'],
  {
    quantity: 25, minApart: 1024, minAlt: -1, radius: [20, 10],
    items: [
      locItem('Draugr_Elite', 0.321, 2),
      locItem('piece_groundtorch_green', 1, 1),
    ],
  },
  'SwampWell',
);
