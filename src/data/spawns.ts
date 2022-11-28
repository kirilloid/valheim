import type { EntityId } from '../types';
import { creatures } from './creatures';
import { items } from './weapons';

export const spawnedByMap: Record<EntityId, EntityId> = {};

for (const creature of creatures) {
  for (const attackVariety of creature.attacks) {
    for (const attack of attackVariety.attacks) {
      if ('spawn' in attack) {
        for (const spawn of attack.spawn) {
          spawnedByMap[spawn] = creature.id;
        }
      }
    }
  }
}

for (const weapon of items) {
  if (weapon.type === 'weapon') {
    for (const attack of weapon.attacks) {
      if (attack.type === 'summon') {
        spawnedByMap[attack.summons] = weapon.id;
      }
    }
  }
}
