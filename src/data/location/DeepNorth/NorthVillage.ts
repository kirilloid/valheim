import { northvillage } from '../../rooms';
import { loc } from '../common';

export default loc(
  8, 'NorthVillage', ['DeepNorth'],
  { components: [],
    biomeArea: 2, quantity: 135, // groupMax: thehole
    minApart: 70, minAlt: 2, radius: [0, 32],
    items: [],
    camp: northvillage,
  },
);
