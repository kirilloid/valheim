import { items as weapons } from './weapons';
import { items as armors } from './armors';
import { arrows } from './arrows';
import { resources } from './resources';
import { CraftingStation, EntityId, Item } from '../types';

export const resourceMap: Record<EntityId, Item[]> = {};
export const stationsMap = new Map<CraftingStation, Item[]>();

function addToMap(item: Item) {
  const { recipe } = item;
  if (item.disabled) return;
  if (recipe == null) return;
  const materials = 'value' in recipe
    ? { 'Coins': recipe.value }
    : 'biomes' in recipe
    ? {}
    : recipe.materials;
  const station = 'source' in recipe ? recipe.source.station : null;
  for (const res of Object.keys(materials)) {
    (resourceMap[res] ?? (resourceMap[res] = [])).push(item);
  }
  if (station) {
    const stationList = stationsMap.get(station) ?? [];
    stationList.push(item);
    stationsMap.set(station, stationList);
  }
}

weapons.forEach(addToMap);
armors.forEach(addToMap);
resources.forEach(addToMap);
arrows.forEach(addToMap);
