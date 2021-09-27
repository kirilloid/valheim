import { Cart, CraftingStation, EntityId, Item, PhysicalObject, Piece, Ship } from '../types';
import { items as weapons } from './weapons';
import { items as armors } from './armors';
import { arrows } from './arrows';
import { resources } from './resources';
import { pieces } from './building';
import { objects } from './objects';
import { ships, carts } from './transport';
import { tools } from './tools';
import { assertNever } from '../model/utils';

export const resourceCraftMap: Record<EntityId, Item[]> = {};
export const resourceBuildMap: Record<EntityId, (Piece | Ship | Cart)[]> = {};
export const stationsMap = new Map<CraftingStation, (Item | Piece | Ship | Cart)[]>();
export const miningMap = new Map<EntityId, PhysicalObject[]>();

function addToMap<T extends Item | Piece | Ship | Cart>(map: Record<EntityId, T[]>, item: T) {
  const { recipe } = item;
  if (item.disabled) return;
  if (recipe == null) return;
  function addItem(res: EntityId, item: T) {
    (map[res] ?? (map[res] = [])).push(item);
  }
  function addStation(station: CraftingStation, item: T) {
    const stationList = stationsMap.get(station) ?? [];
    stationList.push(item);
    stationsMap.set(station, stationList);
  }
  switch (recipe.type) {
    case 'trader':
      addItem('Coins', item);
      break;
    case 'craft_one':
      for (const res of Object.keys(recipe.materials)) {
        addItem(res, item);
      }
      addStation(recipe.source.station, item);
      break;
    case 'craft_upg':
      for (const res of Object.keys(recipe.materials)) {
        addItem(res, item);
      }
      for (const res of Object.keys(recipe.materialsPerLevel)) {
        if (!(res in recipe.materials)) {
          addItem(res, item);
        }
      }
      addStation(recipe.source.station, item);
      break;
    case 'craft_piece':
      for (const res of Object.keys(recipe.materials)) {
        addItem(res, item);
      }
      addStation(recipe.station, item);
      break;
    default:
      assertNever(recipe);
  }
}

const addToCraftMap = (item: Item) => addToMap(resourceCraftMap, item);
weapons.forEach(addToCraftMap);
armors.forEach(addToCraftMap);
resources.forEach(addToCraftMap);
arrows.forEach(addToCraftMap);
tools.forEach(addToCraftMap);

pieces.forEach(p => addToMap(resourceBuildMap, p));
ships.forEach(s => addToMap(resourceBuildMap, s));
carts.forEach(c => addToMap(resourceBuildMap, c));

const parents: Record<EntityId, PhysicalObject> = {};

for (const d of objects) {
  for (const c of d.destructible?.parts ?? []) {
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
