import { Arrow, CraftingStation } from '../types';
import { dmg } from '../model/game';

export const arrows: Arrow[] = [
  { type: 'ammo', id: 'ArrowWood', tier: 1, weight: 0.1, stack: 100,
    damage: dmg({ pierce: 22 }), knockback: 10,
    recipe: {
      type: 'craft_one',
      time: 2, materials: { Wood: 8 },
      source: { station: CraftingStation.Workbench, level: 1 },
      number: 20,
    }
  },
  { type: 'ammo', id: 'ArrowFire', tier: 1, weight: 0.1, stack: 100,
    damage: dmg({ pierce: 11, fire: 22 }), knockback: 10,
    recipe: {
      type: 'craft_one',
      time: 2, materials: { Wood: 8, Resin: 2, Feathers: 2 },
      source: { station: CraftingStation.Workbench, level: 2 },
      number: 20,
    }
  },
  { type: 'ammo', id: 'ArrowFlint', tier: 1, weight: 0.1, stack: 100,
    damage: dmg({ pierce: 26 }), knockback: 10,
    recipe: {
      type: 'craft_one',
      time: 2, materials: { Wood: 8, Flint: 2, Feathers: 2 },
      source: { station: CraftingStation.Workbench, level: 2 },
      number: 20,
    }
  },
  { type: 'ammo', id: 'ArrowBronze', tier: 2, weight: 0.1, stack: 100,
    damage: dmg({ pierce: 32 }), knockback: 10,
    recipe: {
      type: 'craft_one',
      time: 2, materials: { Wood: 8, Bronze: 1, Feathers: 2 },
      source: { station: CraftingStation.Forge, level: 1 },
      number: 20,
    }
  },
  { type: 'ammo', id: 'ArrowIron', tier: 3, weight: 0.1, stack: 100,
    damage: dmg({ pierce: 42 }), knockback: 10,
    recipe: {
      type: 'craft_one',
      time: 2, materials: { Wood: 8, Iron: 1, Feathers: 2 },
      source: { station: CraftingStation.Forge, level: 2 },
      number: 20,
    }
  },
  { type: 'ammo', id: 'ArrowSilver', tier: 4, weight: 0.1, stack: 100,
    damage: dmg({ pierce: 52, spirit: 20 }), knockback: 10,
    recipe: {
      type: 'craft_one',
      time: 2, materials: { Wood: 8, Silver: 1, Feathers: 2 },
      source: { station: CraftingStation.Forge, level: 3 },
      number: 20,
    }
  },
  { type: 'ammo', id: 'ArrowObsidian', tier: 4, weight: 0.1, stack: 100,
    damage: dmg({ pierce: 52 }), knockback: 10,
    recipe: {
      type: 'craft_one',
      time: 2, materials: { Wood: 8, Obsidian: 4, Feathers: 2 },
      source: { station: CraftingStation.Workbench, level: 3 },
      number: 20,
    }
  },
  { type: 'ammo', id: 'ArrowPoison', tier: 4, weight: 0.1, stack: 100,
    damage: dmg({ pierce: 26, poison: 52 }), knockback: 10,
    recipe: {
      type: 'craft_one',
      time: 2, materials: { Wood: 8, Obsidian: 4, Feathers: 2, Ooze: 2 },
      source: { station: CraftingStation.Workbench, level: 3 },
      number: 20,
    }
  },
  { type: 'ammo', id: 'ArrowFrost', tier: 4, weight: 0.1, stack: 100,
    damage: dmg({ pierce: 26, frost: 52 }), knockback: 10,
    recipe: {
      type: 'craft_one',
      time: 2, materials: { Wood: 8, Obsidian: 4, Feathers: 2, FreezeGland: 1 },
      source: { station: CraftingStation.Workbench, level: 4 },
      number: 20,
    }
  },
  { type: 'ammo', id: 'ArrowNeedle', tier: 5, weight: 0.1, stack: 100,
    damage: dmg({ pierce: 62 }), knockback: 15,
    recipe: {
      type: 'craft_one',
      time: 2, materials: { Needle: 4, Feathers: 2 },
      source: { station: CraftingStation.Workbench, level: 4 },
      number: 20,
    }
  },
  /*{ type: 'ammo', id: 'draugr_arrow', tier: -1, weight: 1, stack: 20,
    damage: dmg({ pierce: 15 }), knockback: 35,
  },*/
];  