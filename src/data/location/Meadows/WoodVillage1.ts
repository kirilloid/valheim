import { woodvillage } from '../../rooms';
import { loc } from '../common';

export default loc( // draugr village
1, 'WoodVillage1', ['Meadows'],
{ components: ['DungeonGenerator'],
  customMusic: 'Music_MeadowsVillageFarm',
  quantity: 15, group: 'woodvillage', minApart: 256, terrainDelta: [0, 4], minDistance: 2000, maxDistance: 10000, radius: [20, 32],
  items: [],
  camp: woodvillage,
},
'WoodVillage',
);
