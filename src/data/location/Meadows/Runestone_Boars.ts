import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  1, 'Runestone_Boars', ['Meadows'],
  { type: 'runestone', quantity: 50, group: 'Runestones', minApart: 128, radius: [8, 20],
    items: [
      locItem('Boar', 1, 1),
      locItem('Boar', 0.5, 8),
    ],
  }
);
