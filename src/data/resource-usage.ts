import { Cart, CraftingStation, Destructible, EntityId, Item, Piece, Ship } from '../types';
import { items as weapons } from './weapons';
import { items as armors } from './armors';
import { arrows } from './arrows';
import { resources } from './resources';
import { pieces } from './building';
import { destructibles } from './objects';
import { ships, carts } from './transport';

export const resourceCraftMap: Record<EntityId, Item[]> = {};
export const resourceBuildMap: Record<EntityId, (Piece | Ship | Cart)[]> = {};
export const stationsMap = new Map<CraftingStation, (Item | Piece | Ship | Cart)[]>();
export const miningMap = new Map<EntityId, Destructible[]>();

function addToMap<T extends Item | Piece | Ship | Cart>(map: Record<EntityId, T[]>, item: T) {
  const { recipe } = item;
  if (item.disabled) return;
  if (recipe == null) return;
  const materials = 'value' in recipe
    ? { 'Coins': recipe.value }
    : 'locations' in recipe
    ? {}
    : recipe.materials;
  const station = 'source' in recipe ? recipe.source.station : null;
  for (const res of Object.keys(materials)) {
    (map[res] ?? (map[res] = [])).push(item);
  }
  if (station) {
    const stationList = stationsMap.get(station) ?? [];
    stationList.push(item);
    stationsMap.set(station, stationList);
  }
}

const addToCraftMap = (item: Item) => addToMap(resourceCraftMap, item);
weapons.forEach(addToCraftMap);
armors.forEach(addToCraftMap);
resources.forEach(addToCraftMap);
arrows.forEach(addToCraftMap);

pieces.forEach(p => addToMap(resourceBuildMap, p));
ships.forEach(s => addToMap(resourceBuildMap, s));
carts.forEach(c => addToMap(resourceBuildMap, c));

const parents: Record<EntityId, Destructible> = {};

for (const d of destructibles) {
  for (const c of d.parts) {
    parents[c.id] = d;
  }
}

for (const d of destructibles) {
  for (const gd of d.drop) {
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
