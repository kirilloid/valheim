import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  2, 'Greydwarf_camp1', ['BlackForest'],
  { biomeArea: 2, quantity: 300, minApart: 128, radius: [20, 10],
    customMusic: 'Music_GreydwarfCamp',
    items: [
      locItem('Greydwarf_Root', 1, 3),        
      locItem('Spawner_GreydwarfNest'),
    ]
  },
  'Greydwarf_camp',
);
