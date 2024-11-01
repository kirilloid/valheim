import type { Cart, EntityId, Item, ItemRecipe, PhysicalObject, Piece, Ship, Siege } from '../types';
import { pieces } from './building';
import { objects } from './objects';
import { ships, carts, siege } from './transport';
import { assertNever } from '../model/utils';
import { recipes } from './recipes';
import { recipes as modsRecipes } from '../mods';
import { data } from './itemDB';

export const resourceCraftMap: Record<EntityId, Item[]> = {};
export const resourceBuildMap: Record<EntityId, (Piece | Ship | Cart | Siege)[]> = {};
export type Produced = Item | Piece | Ship | Cart | Siege;
export const stationsMap = new Map<EntityId | null, Map<number, Produced[]>>();
export const miningMap = new Map<EntityId, PhysicalObject[]>();

function addToMap<T extends Item | Piece | Ship | Cart | Siege>(map: Record<EntityId, T[]>, item: T, recipe: ItemRecipe | Piece['recipe']) {
  if (item.disabled) return;
  if (recipe == null) return;
  function addItem(res: EntityId, item: T) {
    if (map[res]?.at(-1) === item) return;
    (map[res] ?? (map[res] = [])).push(item);
  }
  function addStation(station: EntityId | null, level: number, item: T) {
    const stationList = stationsMap.get(station) ?? new Map<number, Produced[]>();
    const stationLevel = stationList.get(level) ?? [];
    stationLevel.push(item);
    stationList.set(level, stationLevel);
    stationsMap.set(station, stationList);
  }
  switch (recipe.type) {
    case 'haldor':
    case 'hildir':
    case 'bogWitch':
      addItem('Coins', item);
      break;
    case 'craft':
      for (const res of Object.keys(recipe.materials)) {
        addItem(res, item);
      }
      for (const res of Object.keys(recipe.materialsPerLevel)) {
        if (!(res in recipe.materials)) {
          addItem(res, item);
        }
      }
      addStation(recipe.source.station, recipe.source.level ?? 0, item);
      break;
    case 'craft_piece':
      for (const res of Object.keys(recipe.materials)) {
        addItem(res, item);
      }
      addStation(recipe.station, 0, item);
      break;
    default:
      assertNever(recipe);
  }
}

function registerRecipes(recipes: ItemRecipe[]) {
  for (const recipe of recipes) {
    const item = data[recipe.item] as Item | undefined;
    if (item == null) {
      console.error(`Registering a recipe for ${recipe.item}, but the item doesn't exist`);
    } else {
      addToMap(resourceCraftMap, item, recipe);
    }
  }
}
registerRecipes(recipes);
for (const modRecipes of Object.values(modsRecipes)) {
  registerRecipes(modRecipes);
}

pieces.forEach(p => addToMap(resourceBuildMap, p, p.recipe));
ships.forEach(s => addToMap(resourceBuildMap, s, s.recipe));
carts.forEach(c => addToMap(resourceBuildMap, c, c.recipe));
siege.forEach(c => addToMap(resourceBuildMap, c, c.recipe));

const parents: Record<EntityId, PhysicalObject> = {};

for (const d of objects) {
  for (const c of d.Destructible?.parts ?? []) {
    parents[c.id] = d;
  }
}

for (const d of objects) {
  for (const gd of d.drop ?? []) {
    for (const { item } of gd.options) {
      if (!miningMap.has(item)) {
        miningMap.set(item, []);
      }
      let p = d;
      while (parents[p.id]) { p = parents[p.id]!; }
      miningMap.get(item)!.push(p);
    }
  }
}
