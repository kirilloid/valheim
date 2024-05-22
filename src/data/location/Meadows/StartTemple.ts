import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  1, 'StartTemple', ['Meadows'],
  { quantity: 25, minApart: 200, maxDistance: 10000, radius: [20, 16],
    items: [locItem('Stone1_huge', 1, 5)] },
);
