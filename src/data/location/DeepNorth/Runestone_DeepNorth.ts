import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  2, 'Runestone_DeepNorth', ['DeepNorth'],
  { type: 'runestone', quantity: 70, group: 'Runestones', minApart: 128, radius: [20, 12], terrainDelta: [0, 10], minAlt: 0,
  items: [locItem('RuneStone_DeepNorth')] }
);
