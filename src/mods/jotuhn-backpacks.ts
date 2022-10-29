import { workbenchRecipe } from '../model/recipe';
import type { GameObject, Item, ItemRecipe } from '../types';

const items: Item[] = [
  {
    id: 'CapeIronBackpack',
    tier: 3,
    type: 'armor', slot: 'shoulders',
    components: ['ItemDrop', 'Container'],
    // Container: [4, 2]
    maxLvl: 1,
    armor: [0, 0],
    weight: 4,
    durability: [1000, 0],
    moveSpeed: 0,
  },
  {
    id: 'CapeSilverBackpack',
    tier: 4,
    type: 'armor', slot: 'shoulders',
    components: ['ItemDrop', 'Container'],
    // Container: [6, 4]
    maxLvl: 1,
    armor: [0, 0],
    weight: 4,
    durability: [1000, 0],
    moveSpeed: 0,
  },
];

export const data: GameObject[] = [
  ...items,
].map(item => ({ ...item, mod: 'JotunnBackpacks' }))

export const recipes: ItemRecipe[] = [
  workbenchRecipe(1, { LeatherScraps: 8, DeerHide: 2, Bronze: 2 }, { }, 'CapeIronBackpack'),
  workbenchRecipe(1, { LeatherScraps: 8, WolfPelt: 2, Silver: 2 }, {  }, 'CapeSilverBackpack'),
];
