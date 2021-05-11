import { CraftingStation, Tool } from "../types";

export const tools: Tool[] = [
  {
    id: 'Hammer',
    type: 'tool',
    tier: 0,
    weight: 2,
    maxLvl: 3,
    durability: [100, 100],
    recipe: {
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
    tier: 1,
    weight: 2,
    maxLvl: 3,
    durability: [200, 200],
    recipe: {
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
    tier: 2,
    weight: 2,
    maxLvl: 3,
    durability: [200, 200],
    recipe: {
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
    tier: 2,
    weight: 1.5,
    floating: true,
    maxLvl: 1,
    durability: [Infinity, 0],
    recipe: { value: 350 }
  },
];
