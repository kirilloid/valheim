import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  3, 'Runestone_Draugr', ['Swamp'],
  { type: 'runestone',
    quantity: 50, group: 'Runestones', minApart: 128, minAlt: 0.5, radius: [20, 8],
    items: [
      locItem('Draugr', 1, 3),
      locItem('piece_groundtorch_green', 1, 2),
      // locItem('stone_wall_2x2', 1, 1),
    ]  
  }
);
