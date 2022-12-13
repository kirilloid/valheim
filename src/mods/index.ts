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
  data as odinFoodBarrelsData,
  recipes as odinFoodBarrelsRecipes,
} from './odins-food-barrels';

import {
  data as odinArchitectData,
  recipes as odinArchitectRecipes,
} from './odin-architect';

import {
  data as boneAppetitData,
  recipes as boneAppetitRecipes,
} from './bone-appetit';

import {
  data as jewelCraftingData,
  recipes as jewelCraftingRecipes,
} from './jewel-crafting';

import {
  data as magicOverhaulData,
  recipes as magicOverhaulRecipes,
} from './magic-overhaul';

export const data = {
  backpackRemakeData,
  epicLootData,
  fantasyArmouryData,
  odinFoodBarrelsData,
  odinArchitectData,
  boneAppetitData,
  jewelCraftingData,
  magicOverhaulData,
};

export const recipes = {
  backpackRemakeRecipes,
  epicLootRecipes,
  fantasyArmouryRecipes,
  odinFoodBarrelsRecipes,
  odinArchitectRecipes,
  boneAppetitRecipes,
  jewelCraftingRecipes,
  magicOverhaulRecipes,
};

type ModConfig = ({ nexus: number; } | { thunderstore: string; }) & {
  version: string;
  fullSupport: boolean;
};

export const modLinks: Record<string, ModConfig> = {
  EpicLoot: {
    nexus: 387,
    thunderstore: 'RandyKnapp/EpicLoot',
    version: '0.8.8',
    fullSupport: true,
  },
  JewelCrafting: {
    nexus: 387,
    thunderstore: 'Smoothbrain/Jewelcrafting',
    version: '1.2.5',
    fullSupport: true,
  },
  MagicOverhaul: {
    thunderstore: 'KGvalheim/MagicOverhaul',
    version: '1.5.594',
    fullSupport: true,
  },
  // OdinPlus
  OdinArchitect: {
    nexus: 1174,
    thunderstore: 'OdinPlus/OdinArchitect',
    version: '0.1.3',
    fullSupport: true,
  },
  PotionsPlus: {
    thunderstore: 'OdinPlus/PotionsPlus',
    version: '0.0.5',
    fullSupport: false,
  },
  JotunnBackpacks: {
    nexus: 1416,
    thunderstore: 'EmrikNorth_and_Aedenthorn/JotunnBackpacks',
    version: '2.0.0',
    fullSupport: true,
  },
  BackPacks_Remake: {
    thunderstore: 'OdinPlus/BackPacks_Remake',
    version: '0.0.5',
    fullSupport: true,
  },
  BuildIt: {
    nexus: 1174,
    thunderstore: 'OdinPlus/BuildIt',
    version: '1.3.1',
    fullSupport: false,
  },
  BagualPack: {
    thunderstore: 'OdinPlus/BagualPack',
    version: '???',
    fullSupport: false,
  },
  GuildPack: {
    thunderstore: 'OdinPlus/GuildPack',
    version: '0.2.0',
    fullSupport: false,
  },
  OdinBanners: {
    thunderstore: 'OdinPlus/OdinBanners',
    version: '???',
    fullSupport: false,
  },
  OdinHorse: {
    thunderstore: 'OdinPlus/OdinHorse',
    version: '0.2.0',
    fullSupport: false,
  },
  GoodestBoy: {
    thunderstore: 'OdinPlus/GoodestBoy',
    version: '???',
    fullSupport: false,
  },
  RunicPack: {
    thunderstore: 'OdinPlus/RunicPack',
    version: '1.0.1',
    fullSupport: false,
  },
  OdinsFoodBarrels: {
    thunderstore: 'OdinPlus/OdinsFoodBarrels',
    version: '1.0.3',
    fullSupport: true,
  },
  ChickenBoo: {
    thunderstore: 'OdinPlus/ChickenBoo',
    version: '2.1.1',
    fullSupport: false,
  },
  StarHeim: {
    thunderstore: 'OdinPlus/StarHeim',
    version: '???',
    fullSupport: false,
  },
  // armories
  Fantasy_Armoury: {
    thunderstore: 'Horem/Fantasy_Armoury',
    version: '0.0.5',
    fullSupport: true,
  },
  DoOrDieMonsters: {
    thunderstore: 'Horem/DoOrDieMonsters',
    version: '0.5.3',
    fullSupport: false,
  },
  Forsaken: {
    nexus: 799,
    version: '???',
    fullSupport: false,
  },
  EpicValheimsAdditions: {
    thunderstore: 'Huntardys/EpicValheimsAdditions',
    version: '???',
    fullSupport: false,
  },
  Hugos_Armory: {
    thunderstore: 'HugotheDwarf/Hugos_Armory',
    version: '7.0.1',
    fullSupport: false,
  },
  JudesEquipment: {
    thunderstore: 'GoldenJude/Judes_Equipment',
    version: '1.2.1',
    fullSupport: false,
  },
  Terraheim: {
    nexus: 803,
    thunderstore: 'DasSauerkraut/Terraheim',
    version: '1.7.4',
    fullSupport: false,
  },
  ChaosWarriorArmor: {
    nexus: 1215,
    version: '???',
    fullSupport: false,
  },
  // skills & others
  ValheimLevelSystemVLS: {
    nexus: 1599,
    thunderstore: 'Detalhes/ValheimLevelSystemVLS',
    version: '1.2.4',
    fullSupport: true,
  },
  BoneAppetit: {
    nexus: 1250,
    thunderstore: 'RockerKitten/BoneAppetit',
    version: '3.0.4',
    fullSupport: true,
  },
  // buildings
  MoreGates: {
    nexus: 1087,
    version: '1.0.8',
    fullSupport: false,
  },
};
