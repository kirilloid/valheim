import { woodfarm } from '../../rooms';
import { loc } from '../common';

export default loc(
  1, 'WoodFarm1', ['Meadows'],
  { components: ['DungeonGenerator'],
    customMusic: 'Music_MeadowsVillageFarm',
    quantity: 10, group: 'woodvillage', minApart: 128, terrainDelta: [0, 4], minDistance: 500, maxDistance: 2000, radius: [20, 32],
    items: [],
    camp: woodfarm,
  },
  'WoodFarm',
);
