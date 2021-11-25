import { CraftingStation, Item } from "../types";

const CRAFT_TIME = 4;

export const items: Item[] = [
// PRE-CRAFT AGE
  { id: 'ArmorRagsLegs',
    tier: 0,
    type: 'armor', slot: 'legs',
    armor: [1, 1],
    weight: 2,
    maxLvl: 2,
    durability: [200, 50],
    moveSpeed: 0,
    recipe: {
      type: 'craft_upg',
      time: CRAFT_TIME,
      materials: { LeatherScraps: 5 },
      materialsPerLevel: { LeatherScraps: 5 },
      source: { station: CraftingStation.Workbench, level: 0 },
      upgrade: { station: CraftingStation.Workbench, level: 1 },
    }
  },
  { id: 'ArmorRagsChest',
    tier: 0,
    type: 'armor', slot: 'body',
    armor: [1, 1],
    weight: 2,
    maxLvl: 2,
    durability: [200, 50],
    moveSpeed: 0,
    recipe: {
      type: 'craft_upg',
      time: CRAFT_TIME,
      materials: { LeatherScraps: 5 },
      materialsPerLevel: { LeatherScraps: 5 },
      source: { station: CraftingStation.Workbench, level: 0 },
      upgrade: { station: CraftingStation.Workbench, level: 1 },
    }
  },
// STONE AGE
  { id: 'ArmorLeatherLegs',
    tier: 1,
    type: 'armor', slot: 'legs',
    armor: [2, 2],
    weight: 5,
    maxLvl: 4,
    durability: [400, 100],
    moveSpeed: 0,
    recipe: {
      type: 'craft_upg',
      time: CRAFT_TIME,
      materials: { DeerHide: 6 },
      materialsPerLevel: { DeerHide: 6, BoneFragments: 5 },
      source: { station: CraftingStation.Workbench, level: 2 },
      upgrade: { station: CraftingStation.Workbench, level: 3 },
    }
  },
  { id: 'ArmorLeatherChest',
    tier: 1,
    type: 'armor', slot: 'body',
    armor: [2, 2],
    weight: 1,
    maxLvl: 4,
    durability: [400, 100],
    moveSpeed: 0,
    recipe: {
      type: 'craft_upg',
      time: CRAFT_TIME,
      materials: { DeerHide: 6 },
      materialsPerLevel: { DeerHide: 6, BoneFragments: 5 },
      source: { station: CraftingStation.Workbench, level: 2 },
      upgrade: { station: CraftingStation.Workbench, level: 3 },
    }
  },
  { id: 'HelmetLeather',
    tier: 1,
    type: 'armor', slot: 'head',
    armor: [2, 2],
    weight: 1,
    maxLvl: 4,
    durability: [400, 100],
    moveSpeed: 0,
    recipe: {
      type: 'craft_upg',
      time: CRAFT_TIME,
      materials: { DeerHide: 6 },
      materialsPerLevel: { DeerHide: 6, BoneFragments: 5 },
      source: { station: CraftingStation.Workbench, level: 2 },
      upgrade: { station: CraftingStation.Workbench, level: 3 },
    }
  },
  { id: 'CapeDeerHide',
    tier: 1,
    type: 'armor', slot: 'shoulders',
    armor: [1, 1],
    weight: 4,
    maxLvl: 4,
    durability: [400, 50],
    moveSpeed: 0,
    recipe: {
      type: 'craft_upg',
      time: CRAFT_TIME,
      materials: { DeerHide: 4, BoneFragments: 5 },
      materialsPerLevel: { DeerHide: 4, BoneFragments: 5 },
      source: { station: CraftingStation.Workbench, level: 2 },
      upgrade: { station: CraftingStation.Workbench, level: 3 },
    }
  },
  // troll
  { id: 'ArmorTrollLeatherLegs',
    tier: 1,
    type: 'armor', slot: 'legs',
    armor: [6, 2],
    weight: 5,
    maxLvl: 4,
    durability: [500, 200],
    moveSpeed: 0,
    recipe: {
      type: 'craft_upg',
      time: CRAFT_TIME,
      materials: { TrollHide: 5 },
      materialsPerLevel: { TrollHide: 2 },
      source: { station: CraftingStation.Workbench, level: 2 },
      upgrade: { station: CraftingStation.Workbench, level: 3 },
    }
  },
  { id: 'ArmorTrollLeatherChest',
    tier: 1,
    type: 'armor', slot: 'body',
    armor: [6, 2],
    weight: 5,
    maxLvl: 4,
    durability: [500, 200],
    moveSpeed: 0,
    recipe: {
      type: 'craft_upg',
      time: CRAFT_TIME,
      materials: { TrollHide: 5 },
      materialsPerLevel: { TrollHide: 2 },
      source: { station: CraftingStation.Workbench, level: 2 },
      upgrade: { station: CraftingStation.Workbench, level: 3 },
    }
  },
  { id: 'HelmetTrollLeather',
    tier: 1,
    type: 'armor', slot: 'head',
    armor: [6, 2],
    weight: 1,
    maxLvl: 4,
    durability: [500, 200],
    moveSpeed: 0,
    recipe: {
      type: 'craft_upg',
      time: CRAFT_TIME,
      materials: { TrollHide: 5, BoneFragments: 3 },
      materialsPerLevel: { TrollHide: 2, BoneFragments: 1 },
      source: { station: CraftingStation.Workbench, level: 2 },
      upgrade: { station: CraftingStation.Workbench, level: 3 },
    }
  },
  { id: 'CapeTrollHide',
    tier: 1,
    type: 'armor', slot: 'shoulders',
    armor: [1, 1],
    weight: 4,
    maxLvl: 4,
    durability: [500, 50],
    moveSpeed: 0,
    recipe: {
      type: 'craft_upg',
      time: CRAFT_TIME,
      materials: { TrollHide: 10, BoneFragments: 10 },
      materialsPerLevel: { TrollHide: 5, BoneFragments: 5 },
      source: { station: CraftingStation.Workbench, level: 2 },
      upgrade: { station: CraftingStation.Workbench, level: 3 },
    }
  },
// BRONZE AGE
  { id: 'ArmorBronzeLegs',
    tier: 2,
    type: 'armor', slot: 'legs',
    armor: [8, 2],
    weight: 5,
    maxLvl: 4,
    durability: [1000, 200],
    moveSpeed: -0.05,
    recipe: {
      type: 'craft_upg',
      time: CRAFT_TIME,
      materials: { Bronze: 5, DeerHide: 2 },
      materialsPerLevel: { Bronze: 3 },
      source: { station: CraftingStation.Forge, level: 1 },
      upgrade: { station: CraftingStation.Forge, level: 2 },
    }
  },
  { id: 'ArmorBronzeChest',
    tier: 2,
    type: 'armor', slot: 'body',
    armor: [8, 2],
    weight: 10,
    maxLvl: 4,
    durability: [1000, 200],
    moveSpeed: -0.05,
    recipe: {
      type: 'craft_upg',
      time: CRAFT_TIME,
      materials: { Bronze: 5, DeerHide: 2 },
      materialsPerLevel: { Bronze: 3 },
      source: { station: CraftingStation.Forge, level: 1 },
      upgrade: { station: CraftingStation.Forge, level: 2 },
    }
  },
  { id: 'HelmetBronze',
    tier: 2,
    type: 'armor', slot: 'head',
    armor: [8, 2],
    weight: 3,
    maxLvl: 4,
    durability: [1000, 200],
    moveSpeed: 0,
    recipe: {
      type: 'craft_upg',
      time: CRAFT_TIME,
      materials: { Bronze: 5, DeerHide: 2 },
      materialsPerLevel: { Bronze: 3 },
      source: { station: CraftingStation.Forge, level: 1 },
      upgrade: { station: CraftingStation.Forge, level: 2 },
    }
  },
// IRON AGE
  { id: 'ArmorIronLegs',
    tier: 3,
    type: 'armor', slot: 'legs',
    armor: [14, 2],
    weight: 15,
    maxLvl: 4,
    durability: [1000, 200],
    moveSpeed: -0.05,
    recipe: {
      type: 'craft_upg',
      time: CRAFT_TIME,
      materials: { Iron: 20, DeerHide: 2 },
      materialsPerLevel: { Iron: 5 },
      source: { station: CraftingStation.Forge, level: 2 },
      upgrade: { station: CraftingStation.Forge, level: 3 },
    }
  },
  { id: 'ArmorIronChest',
    tier: 3,
    type: 'armor', slot: 'body',
    armor: [14, 2],
    weight: 15,
    maxLvl: 4,
    durability: [1000, 200],
    moveSpeed: -0.05,
    recipe: {
      type: 'craft_upg',
      time: CRAFT_TIME,
      materials: { Iron: 20, DeerHide: 2 },
      materialsPerLevel: { Iron: 5 },
      source: { station: CraftingStation.Forge, level: 2 },
      upgrade: { station: CraftingStation.Forge, level: 3 },
    }
  },
  { id: 'HelmetIron',
    tier: 3,
    type: 'armor', slot: 'head',
    armor: [14, 2],
    weight: 3,
    maxLvl: 4,
    durability: [1000, 200],
    moveSpeed: 0,
    recipe: {
      type: 'craft_upg',
      time: CRAFT_TIME,
      materials: { Iron: 20, DeerHide: 2 },
      materialsPerLevel: { Iron: 5 },
      source: { station: CraftingStation.Forge, level: 2 },
      upgrade: { station: CraftingStation.Forge, level: 3 },
    }
  },
// SILVER AGE
  { id: 'ArmorWolfLegs',
    tier: 4,
    type: 'armor', slot: 'legs',
    armor: [20, 2],
    weight: 15,
    maxLvl: 4,
    durability: [1000, 200],
    moveSpeed: -0.05,
    recipe: {
      type: 'craft_upg',
      time: CRAFT_TIME,
      materials: { Silver: 20, WolfPelt: 5, WolfFang: 4 },
      materialsPerLevel: { Silver: 5, WolfPelt: 2, WolfFang: 1 },
      source: { station: CraftingStation.Forge, level: 2 },
      upgrade: { station: CraftingStation.Forge, level: 3 },
    }
  },
  { id: 'ArmorWolfChest',
    tier: 4,
    type: 'armor', slot: 'body',
    armor: [20, 2],
    weight: 15,
    maxLvl: 4,
    durability: [1000, 200],
    moveSpeed: -0.05,
    damageModifiers: { frost: 'resistant' },
    recipe: {
      type: 'craft_upg',
      time: CRAFT_TIME,
      materials: { Silver: 20, WolfPelt: 5, Chain: 1 },
      materialsPerLevel: { Silver: 5, WolfPelt: 2 },
      source: { station: CraftingStation.Forge, level: 2 },
      upgrade: { station: CraftingStation.Forge, level: 3 },
    }
  },
  { id: 'HelmetDrake',
    tier: 4,
    type: 'armor', slot: 'head',
    armor: [20, 2],
    weight: 3,
    maxLvl: 4,
    durability: [1000, 200],
    moveSpeed: 0,
    recipe: {
      type: 'craft_upg',
      time: CRAFT_TIME,
      materials: { Silver: 20, WolfPelt: 2, TrophyHatchling: 2 },
      materialsPerLevel: { Silver: 5 },
      source: { station: CraftingStation.Forge, level: 2 },
      upgrade: { station: CraftingStation.Forge, level: 3 },
    }
  },
  { id: 'CapeWolf',
    tier: 4,
    type: 'armor', slot: 'shoulders',
    armor: [1, 1],
    weight: 4,
    maxLvl: 4,
    durability: [1000, 50],
    moveSpeed: 0,
    damageModifiers: { frost: 'resistant' },
    recipe: {
      type: 'craft_upg',
      time: CRAFT_TIME,
      materials: { Silver: 4, WolfPelt: 6, TrophyWolf: 1 },
      materialsPerLevel: { Silver: 2, WolfPelt: 4 },
      source: { station: CraftingStation.Workbench, level: 2 },
      upgrade: { station: CraftingStation.Workbench, level: 3 },
    }
  },
// BLACK AGE
  { id: 'ArmorPaddedGreaves',
    tier: 5,
    type: 'armor', slot: 'legs',
    armor: [26, 2],
    weight: 10,
    maxLvl: 4,
    durability: [1000, 200],
    moveSpeed: -0.05,
    recipe: {
      type: 'craft_upg',
      time: CRAFT_TIME,
      materials: { Iron: 10, LinenThread: 20 },
      materialsPerLevel: { Iron: 3 },
      source: { station: CraftingStation.Forge, level: 2 },
      upgrade: { station: CraftingStation.Forge, level: 3 },
    }
  },
  { id: 'ArmorPaddedCuirass',
    tier: 5,
    type: 'armor', slot: 'body',
    armor: [26, 2],
    weight: 10,
    maxLvl: 4,
    durability: [1000, 200],
    moveSpeed: -0.05,
    recipe: {
      type: 'craft_upg',
      time: CRAFT_TIME,
      materials: { Iron: 10, LinenThread: 20 },
      materialsPerLevel: { Iron: 3 },
      source: { station: CraftingStation.Forge, level: 2 },
      upgrade: { station: CraftingStation.Forge, level: 3 },
    }
  },
  { id: 'HelmetPadded',
    tier: 5,
    type: 'armor', slot: 'head',
    armor: [26, 2],
    weight: 3,
    maxLvl: 4,
    durability: [1000, 200],
    moveSpeed: 0,
    recipe: {
      type: 'craft_upg',
      time: CRAFT_TIME,
      materials: { Iron: 10, LinenThread: 15 },
      materialsPerLevel: { Iron: 5 },
      source: { station: CraftingStation.Forge, level: 2 },
      upgrade: { station: CraftingStation.Forge, level: 3 },
    }
  },
  { id: 'CapeLinen',
    tier: 5,
    type: 'armor', slot: 'shoulders',
    armor: [1, 1],
    weight: 4,
    maxLvl: 4,
    durability: [1500, 50],
    moveSpeed: 0,
    recipe: {
      type: 'craft_upg',
      time: CRAFT_TIME,
      materials: { LinenThread: 20, Silver: 1 },
      materialsPerLevel: { LinenThread: 4 },
      source: { station: CraftingStation.Workbench, level: 2 },
      upgrade: { station: CraftingStation.Workbench, level: 3 },
    }
  },
  { id: 'CapeLox',
    tier: 5,
    type: 'armor', slot: 'shoulders',
    armor: [1, 1],
    weight: 4,
    maxLvl: 4,
    durability: [1200, 50],
    moveSpeed: 0,
    damageModifiers: { frost: 'resistant' },
    recipe: {
      type: 'craft_upg',
      time: CRAFT_TIME,
      materials: { LoxPelt: 6, Silver: 2 },
      materialsPerLevel: { LoxPelt: 2 },
      source: { station: CraftingStation.Workbench, level: 2 },
      upgrade: { station: CraftingStation.Workbench, level: 3 },
    }
  },
  // non-systematic
  { id: 'HelmetYule',
    tier: 0,
    type: 'armor', slot: 'head',
    armor: [2, 0],
    weight: 1,
    maxLvl: 1,
    durability: [Infinity, 0],
    moveSpeed: 0,
    recipe: { type: 'trader', value: 100 }
  },
  { id: 'HelmetDverger',
    tier: 2,
    type: 'armor', slot: 'head',
    special: 'light',
    armor: [0, 0],
    weight: 1,
    maxLvl: 1,
    durability: [Infinity, 0],
    moveSpeed: 0,
    recipe: { type: 'trader', value: 620 }
  },
  { id: 'BeltStrength',
    tier: 2,
    type: 'armor', slot: 'util',
    special: 'strength',
    armor: [0, 0],
    weight: 2,
    maxLvl: 1,
    durability: [Infinity, 0],
    moveSpeed: 0,
    recipe: { type: 'trader', value: 950 }
  },
  { id: 'Wishbone',
    tier: 4,
    type: 'armor', slot: 'util',
    special: 'search',
    armor: [0, 0],
    weight: 0.1,
    floating: true,
    maxLvl: 1,
    durability: [Infinity, 0],
    moveSpeed: 0,
    stack: 1,
  },
  { id: 'HelmetOdin',
    dlc: 'beta',
    tier: 0,
    type: 'armor', slot: 'head',
    armor: [1, 0],
    weight: 1,
    maxLvl: 1,
    durability: [300, 0],
    moveSpeed: 0,
    recipe: {
      type: 'craft_upg',
      time: CRAFT_TIME,
      materials: { LeatherScraps: 10, Coal: 4 },
      materialsPerLevel: {},
      source: { station: CraftingStation.Workbench, level: 1 },
      upgrade: { station: CraftingStation.Workbench, level: 1 },
    },
  },
  { id: 'CapeOdin',
    dlc: 'beta',
    tier: 0,
    type: 'armor', slot: 'shoulders',
    armor: [2, 0],
    weight: 4,
    maxLvl: 1,
    durability: [1500, 0],
    moveSpeed: 0,
    recipe: {
      type: 'craft_upg',
      time: CRAFT_TIME,
      materials: { LeatherScraps: 10, Coal: 4 },
      materialsPerLevel: {},
      source: { station: CraftingStation.Workbench, level: 1 },
      upgrade: { station: CraftingStation.Workbench, level: 1 },
    },
  },
  { id: 'CapeTest',
    tier: -1,
    disabled: true,
    type: 'armor', slot: 'shoulders',
    armor: [1, 1],
    weight: 4,
    maxLvl: 4,
    durability: [100, 50],
    moveSpeed: 0,
  },
  /*
  GoblinBrute_Backbones       head
  GoblinBrute_ExecutionerCap  head
  GoblinBrute_ArmGuard        body
  GoblinBrute_HipCloth        legs
  GoblinBrute_LegBones        util
  GoblinBrute_ShoulderGuard   shoulders
  GoblinHelmet                body
  GoblinLegband               ???
  GoblinLoin                  ???
   */
];
