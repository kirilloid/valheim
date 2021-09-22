import type { TreasureChest } from '../types';

const oneOfEach = true;

export const chests: TreasureChest[] = [
  {
    type: 'treasure',
    id: 'Pickable_DolmenTreasure',
    tier: 0,
    drop: {
      num: [1, 1],
      options: [
        { item: 'Coins', num: [2, 15] },
        { item: 'AmberPearl', num: [1, 3] },
        { item: 'Amber', num: [1, 5] },
      ],
    },
  },
  {
    type: 'treasure',
    id: 'TreasureChest_Meadows',
    tier: 1,
    drop: {
      num: [2, 3],
      options: [
        { item: 'Feathers', num: [1, 3], },
        { item: 'Coins', num: [5, 15], },
        { item: 'Amber', num: [1, 1], },
        { item: 'ArrowFlint', num: [10, 20], },
        { item: 'Torch', num: [1, 1], },
        { item: 'Flint', num: [2, 4], },
      ],
    },
  },
  {
    type: 'treasure',
    id: 'TreasureChest_meadows_buried',
    tier: 4,
    drop: {
      oneOfEach,
      num: [2, 3],
      options: [
        { item: 'ArrowFire', num: [10, 15], },
        { item: 'Coins', num: [20, 50], },
        { item: 'Ruby', num: [1, 3], },
        { item: 'AmberPearl', num: [1, 2], },
        { item: 'SilverNecklace', num: [1, 1], },
      ],
    },
  },
  {
    type: 'treasure',
    id: 'shipwreck_karve_chest',
    tier: 2,
    drop: {
      num: [1, 4],
      options: [
        { item: 'Coins', num: [50, 100], weight: 5 },
        { item: 'AmberPearl', num: [1, 10], weight: 5 },
        { item: 'Ruby', num: [1, 2], },
      ],
    },  
  },
  {
    type: 'treasure',
    id: 'TreasureChest_blackforest',
    tier: 2,
    // damageModifiers: mod([1,1,1,1,1,1,1,3,3,3]),
    drop: {
      num: [2, 3],
      oneOfEach,
      options: [
        { item: 'Feathers', num: [2, 4], },
        { item: 'ArrowFlint', num: [5, 10], },
        { item: 'Coins', num: [5, 30], },
        { item: 'Amber', num: [1, 2], },
      ],
    },
  },
  {
    type: 'treasure',
    id: 'TreasureChest_forest_crypt',
    tier: 2,
    drop: {
      num: [2, 4],
      options: [
        { item: 'Feathers', num: [1, 10], },
        { item: 'ArrowFlint', num: [5, 10], },
        { item: 'Ruby', num: [1, 2], },
        { item: 'Coins', num: [10, 30], },
        { item: 'Amber', num: [1, 3], },
      ],
    },
  },
  {
    type: 'treasure',
    id: 'TreasureChest_trollcave',
    tier: 2,
    drop: {
      oneOfEach,
      num: [3, 5],
      options: [
        { item: 'Wood', num: [10, 30], },
        { item: 'Stone', num: [10, 30], },
        { item: 'Ruby', num: [1, 2], },
        { item: 'Coins', num: [20, 50], },
        { item: 'DeerHide', num: [2, 4], },
        { item: 'BoneFragments', num: [10, 15], },
        { item: 'LeatherScraps', num: [3, 5], },
      ],
    },
  },
  {
    type: 'treasure',
    id: 'Pickable_ForestCryptRandom',
    tier: 2,
    drop: {
      num: [1, 1],
      options: [
        { item: 'Coins', num: [5, 20] },
        { item: 'Ruby', num: [1, 2] },
        { item: 'Amber', num: [1, 5] },
        { item: 'AmberPearl', num: [1, 3] },
      ]
    },
  },
  {
    type: 'treasure',
    id: 'TreasureChest_swamp',
    tier: 3,
    drop: {
      oneOfEach,
      num: [2, 3],
      options: [
        { item: 'WitheredBone', num: [1, 1], weight: 0.5, },
        { item: 'ArrowIron', num: [10, 15], },
        { item: 'ArrowPoison', num: [10, 15], },
        { item: 'Coins', num: [20, 60], },
        { item: 'Amber', num: [1, 5], },
        { item: 'AmberPearl', num: [1, 3], },
        { item: 'Ruby', num: [1, 3], },
        { item: 'Chain', num: [1, 1], },
        { item: 'ElderBark', num: [20, 30], },
      ],
    },
  },
  {
    type: 'treasure',
    id: 'TreasureChest_sunkencrypt',
    tier: 3,
    drop: {
      oneOfEach,
      num: [2, 3],
      options: [
        { item: 'WitheredBone', num: [1, 1], weight: 0.5, },
        { item: 'ArrowIron', num: [10, 15], },
        { item: 'ArrowPoison', num: [10, 15], },
        { item: 'Coins', num: [20, 60], },
        { item: 'Amber', num: [1, 5], },
        { item: 'AmberPearl', num: [1, 3], },
        { item: 'Ruby', num: [1, 3], },
        { item: 'Chain', num: [1, 3], },
        { item: 'ElderBark', num: [20, 30], },
        { item: 'IronScrap', num: [10, 20], weight: 2 },
      ],
    },
  },
  {
    type: 'treasure',
    id: 'TreasureChest_mountains',
    tier: 4,
    drop: {
      oneOfEach,
      num: [2, 4],
      options: [
        { item: 'OnionSeeds', num: [3, 9], },
        { item: 'Amber', num: [1, 6], },
        { item: 'Coins', num: [30, 55], },
        { item: 'AmberPearl', num: [2, 5], },
        { item: 'Ruby', num: [1, 2], },
        { item: 'Obsidian', num: [5, 10], },
        { item: 'ArrowFrost', num: [5, 10], },
      ],
    },
  },
  {
    type: 'treasure',
    id: 'TreasureChest_Plains',
    tier: 5,
    drop: {
      num: [2, 3],
      options: [
        { item: 'Barley', num: [2, 4], weight: 0.5, },
        { item: 'BlackMetalScrap', num: [2, 5], },
        { item: 'Needle', num: [2, 5], },
        { item: 'Coins', num: [10, 40], },
        { item: 'SharpeningStone', weight: 0.1, },
      ],
    },
  },
  {
    type: 'treasure',
    tier: 5,
    id: 'TreasureChest_Plains_stone',
    drop: {
      num: [2, 4],
      options: [
        { item: 'Feathers', num: [5, 10], },
        { item: 'ArrowObsidian', num: [5, 10], },
        { item: 'SilverNecklace', weight: 0.5 },
        { item: 'Coins', num: [66, 99], },
        { item: 'GoblinTotem', weight: 0.1, },
      ],
    },
  },
];
