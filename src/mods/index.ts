import {
  data as backpackRemakeData,
  recipes as backpackRemakeRecipes,
} from './backpacks-remake';

import {
  data as epicLootData,
  recipes as epicLootRecipes,
} from './epic-loot';

import {
  data as fantasyArmouryData,
  recipes as fantasyArmouryRecipes,
} from './fantasy-armoury';

import {
  data as odinArchitectData,
  recipes as odinArchitectRecipes,
} from './odin-architect';

export const data = {
  backpackRemakeData,
  epicLootData,
  fantasyArmouryData,
  odinArchitectData,
};

export const recipes = {
  backpackRemakeRecipes,
  epicLootRecipes,
  fantasyArmouryRecipes,
  odinArchitectRecipes,
};

export const modLinks: Record<string, { nexus?: number; thunderstore?: string }> = {
  EpicLoot: { nexus: 387, thunderstore: 'RandyKnapp/EpicLoot' },
  OdinArchitect: { nexus: 1174, thunderstore: 'OdinPlus/OdinArchitect' },
  BackPacks_Remake: { thunderstore: 'OdinPlus/BackPacks_Remake' },
};
