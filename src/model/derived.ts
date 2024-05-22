import type { Weapon } from '../types';

import { getRecipe } from '../data/recipes';
import { data } from '../data/itemDB';

export function isNotDerviedWeapon(item: Weapon) {
  const recipe = getRecipe(item.id);
  if (recipe == null) return false;
  if (recipe.type !== 'craft') return false;
  return Object.keys(recipe.materials).every(mat => data[mat]?.type !== 'weapon');
}
