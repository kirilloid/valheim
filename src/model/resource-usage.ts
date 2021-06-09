import { items as weapons } from './weapons';
import { items as armors } from './armors';
import { arrows } from './arrows';
import { resources } from './resources';
import { CraftingStation, EntityId, Item, Piece } from '../types';
import { pieces } from './building';

export const resourceCraftMap: Record<EntityId, Item[]> = {};
export const resourceBuildMap: Record<EntityId, Piece[]> = {};
export const stationsMap = new Map<CraftingStation, (Item | Piece)[]>();

function addToMap<T extends Item | Piece>(map: Record<EntityId, T[]>, item: T) {
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
