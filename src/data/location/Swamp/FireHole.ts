import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  3, 'FireHole', ['Swamp'],
  { biomeArea: 2, quantity: 75, minApart: 16, minAlt: -1, radius: [20, 5],
    items: [
      locItem('Surtling', 1, 3), // Spawner_imp_respawn: once in 5 minutes
    ],
  }
);
