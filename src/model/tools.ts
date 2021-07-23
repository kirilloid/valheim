import { CraftingStation, Tool } from "../types";
import { pieces } from "./building";
import { plants } from "./plants";

export const tools: Tool[] = [
  {
    id: 'Hammer',
    type: 'tool',
    special: 'build',
    tier: 0,
    weight: 2,
    maxLvl: 3,
    durability: [100, 100],
    produces: pieces.map(p => p.id),
    recipe: {
      type: 'craft_upg',
      time: 4,
      materials: { Wood: 3, Stone: 2 },
      materialsPerLevel: { Wood: 1, Stone: 1 },
      source: { station: CraftingStation.Inventory, level: 0 },
      upgrade: { station: CraftingStation.Workbench, level: 2 },
    }
  },
  {
    id: 'Hoe',
    type: 'tool',
    special: 'ground',
    tier: 1,
    weight: 2,
    maxLvl: 3,
    durability: [200, 200],
    produces: [],
    recipe: {
      type: 'craft_upg',
      time: 4,
      materials: { Wood: 5, Stone: 2 },
      materialsPerLevel: { Wood: 1, Stone: 1 },
      source: { station: CraftingStation.Inventory, level: 0 },
      upgrade: { station: CraftingStation.Workbench, level: 2 },
    }
  },
  {
    id: 'Cultivator',
    type: 'tool',
    special: 'garden',
    tier: 2,
    weight: 2,
    maxLvl: 3,
    durability: [200, 200],
    produces: plants.map(p => p.id),
    recipe: {
      type: 'craft_upg',
      time: 4,
      materials: { RoundLog: 5, Bronze: 5 },
      materialsPerLevel: { RoundLog: 1, Bronze: 1 },
      source: { station: CraftingStation.Forge, level: 1 },
      upgrade: { station: CraftingStation.Forge, level: 2 },
    }
  },
  {
    id: 'FishingRod',
    type: 'tool',
    special: 'fishing',
    tier: 2,
    weight: 1.5,
    floating: true,
    maxLvl: 1,
    durability: [Infinity, 0],
    produces: ['Fish'],
    recipe: { type: 'trader', value: 350 }
  },
];
