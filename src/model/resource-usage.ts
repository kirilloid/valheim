import { items as weapons } from './weapons';
import { items as armors } from './armors';
import { arrows } from './arrows';
import { resources } from './resources';
import { Item } from '../types';

export const resourceMap: Record<string, Item[]> = {};

function addToMap(item: Item) {
  const { recipe } = item; 
  if (recipe == null) return;
  const materials = 'value' in recipe ? { 'Coins': recipe.value } : recipe.materials;
  for (const res of Object.keys(materials)) {
    (resourceMap[res] ?? (resourceMap[res] = [])).push(item);
  }
}

weapons.forEach(addToMap);
armors.forEach(addToMap);
resources.forEach(addToMap);
arrows.forEach(addToMap);
