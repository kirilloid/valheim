import { Plant } from '../types';

export const plants: Plant[] = [
  {
    type: 'plant',
    id: 'Beech_Sapling',
    tier: 2,
    subtype: 'tree',
    growTime: [3000, 5000],
    growsInto: 'Beech1',
    cultivatedGround: false,
    destroyUnhealthy: true,
    freeSpaceRadius: 2,
    biomes: ['Meadows', 'BlackForest', 'Plains'],
  },
  {
    type: 'plant',
    id: 'PineTree_Sapling',
    tier: 2,
    subtype: 'tree',
    growTime: [3000, 5000],
    growsInto: 'PineTree_01',
    cultivatedGround: false,
    destroyUnhealthy: true,
    freeSpaceRadius: 2,
    biomes: ['Meadows', 'BlackForest', 'Plains'],
  },
  {
    type: 'plant',
    id: 'FirTree_Sapling',
    tier: 2,
    subtype: 'tree',
    growTime: [3000, 5000],
    growsInto: 'FirTree',
    cultivatedGround: false,
    destroyUnhealthy: true,
    freeSpaceRadius: 2,
    biomes: ['Meadows', 'BlackForest', 'Mountain', 'Plains'],
  },
  {
    type: 'plant',
    id: 'sapling_turnip',
    tier: 3,
    subtype: 'vegetable',
    growTime: [4000, 5000],
    growsInto: 'Turnip',
    cultivatedGround: true,
    destroyUnhealthy: true,
    freeSpaceRadius: 0.5,
    biomes: ['Meadows', 'BlackForest', 'Swamp', 'Plains'],
  },
  {
    type: 'plant',
    id: 'sapling_barley',
    tier: 5,
    subtype: 'crop',
    growTime: [4000, 5000],
    growsInto: 'Barley',
    cultivatedGround: true,
    destroyUnhealthy: true,
    freeSpaceRadius: 0.5,
    biomes: ['Plains'],
  },
  {
    type: 'plant',
    id: 'sapling_carrot',
    tier: 3,
    subtype: 'vegetable',
    growTime: [4000, 5000],
    growsInto: 'Carrot',
    cultivatedGround: true,
    destroyUnhealthy: true,
    freeSpaceRadius: 0.5,
    biomes: ['Meadows', 'BlackForest', 'Plains'],
  },
  {
    type: 'plant',
    id: 'SeedCarrot',
    tier: 2,
    subtype: 'vegetable',
    growTime: [4000, 5000],
    growsInto: 'CarrotSeeds',
    cultivatedGround: true,
    destroyUnhealthy: true,
    freeSpaceRadius: 0.5,
    biomes: ['Meadows', 'BlackForest', 'Plains'],
  },
  {
    type: 'plant',
    id: 'sapling_flax',
    tier: 5,
    subtype: 'crop',
    growTime: [4000, 5000],
    growsInto: 'Flax',
    cultivatedGround: true,
    destroyUnhealthy: true,
    freeSpaceRadius: 0.5,
    biomes: ['Plains'],
  },
  {
    type: 'plant',
    id: 'SeedTurnip',
    tier: 3,
    subtype: 'vegetable',
    growTime: [4000, 5000],
    growsInto: 'TurnipSeeds',
    cultivatedGround: true,
    destroyUnhealthy: true,
    freeSpaceRadius: 0.5,
    biomes: ['Meadows', 'BlackForest', 'Swamp', 'Plains'],
  },
];