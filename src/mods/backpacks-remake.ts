import { workbenchRecipe } from '../model/recipe';
import type { GameObject, Item, ItemRecipe } from '../types';

const items: Item[] = [
  {
    id: 'CapeLeatherBackpack',
    tier: 1,
    type: 'armor', slot: 'shoulders',
    components: ['ItemDrop', 'Container'],
    // Container: [2, 1]
    maxLvl: 1,
    armor: [0, 0],
    weight: 4,
    durability: [500, 50],
    moveSpeed: 0,
  },
  {
    id: 'CapeIronBackpack',
    tier: 3,
    type: 'armor', slot: 'shoulders',
    components: ['ItemDrop', 'Container'],
    // Container: [4, 2]
    maxLvl: 1,
    armor: [0, 0],
    weight: 4,
    durability: [1000, 50],
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
    durability: [1500, 50],
    moveSpeed: 0,
  },
];

export const data: GameObject[] = [
  ...items,
].map(item => ({ ...item, mod: 'BackPacks_Remake' }))

export const recipes: ItemRecipe[] = [
  workbenchRecipe(1, { LeatherScraps: 30, DeerHide: 5 }, { LeatherScraps: 20, DeerHide: 5 }, 'CapeLeatherBackpack'),
  workbenchRecipe(1, { Iron: 8,LeatherScraps: 60, DeerHide: 5 }, { Iron: 20, LeatherScraps: 5 }, 'CapeIronBackpack'),
  workbenchRecipe(1, { Silver: 20, LeatherScraps: 60, WolfPelt: 7 }, { Silver: 50, WolfPelt: 5 }, 'CapeSilverBackpack'),
];
