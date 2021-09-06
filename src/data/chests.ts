import type { GeneralDrop } from '../types';

export const chestDrops: Record<string, GeneralDrop> = {
  blackforest: {
    num: [2, 4],
    options: [
      { item: 'Feathers', num: [2, 4], },
      { item: 'ArrowFlint', num: [5, 10], },
      { item: 'Coins', num: [5, 30], },
      { item: 'Amber', num: [1, 2], },
    ],
  },
  fCrypt: {
    num: [2, 4],
    options: [
      { item: 'Feathers', num: [5, 15], },
      { item: 'ArrowFlint', num: [5, 10], },
      { item: 'Coins', num: [5, 50], },
      { item: 'Amber', num: [1, 3], },
    ],
  },
  forestCrypt: {
    num: [2, 4],
    options: [
      { item: 'Feathers', num: [1, 10], },
      { item: 'ArrowFlint', num: [5, 10], },
      { item: 'Ruby', num: [1, 2], },
      { item: 'Coins', num: [10, 30], },
      { item: 'Amber', num: [1, 3], },
    ],
  },
  heath: {
    num: [2, 3],
    options: [
      { item: 'Barley', num: [2, 4], weight: 0.5, },
      { item: 'BlackMetalScrap', num: [2, 5], },
      { item: 'Needle', num: [2, 5], },
      { item: 'Coins', num: [10, 40], },
      { item: 'SharpeningStone', num: [1, 1], weight: 0.1, },
    ],
  },
  meadows: {
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
  meadowsBuried: {
    num: [2, 3],
    options: [
      { item: 'ArrowFire', num: [10, 15], },
      { item: 'Coins', num: [20, 50], },
      { item: 'Ruby', num: [1, 3], },
      { item: 'AmberPearl', num: [1, 2], },
      { item: 'SilverNecklace', num: [1, 1], },
    ],
  },
  mountains: {
    num: [2, 4],
    options: [
      { item: 'Coins', num: [16, 41], },
      { item: 'Amber', num: [1, 6], },
      { item: 'Coins', num: [30, 55], },
      { item: 'AmberPearl', num: [2, 5], },
      { item: 'Ruby', num: [1, 2], },
      { item: 'Obsidian', num: [5, 10], },
      { item: 'ArrowFrost', num: [5, 10], },
    ],
  },
  plainsStone: {
    num: [2, 4],
    options: [
      { item: 'Feathers', num: [1, 10], },
      { item: 'ArrowFlint', num: [5, 10], },
      { item: 'AncientSeed', num: [1, 1], weight: 0.5, },
      { item: 'Coins', num: [5, 30], },
      { item: 'Amber', num: [1, 3], },
    ],
  },
  sunkenCrypt: {
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
  swamp: {
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
  trollCave: {
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
};
