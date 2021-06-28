import { Biome, Creature } from '../types';
import { creatures } from './creatures';
import { locationToBiome } from './location';

export const groupedCreatures: Record<Biome, Creature[]> = {
  Meadows: [],
  BlackForest: [],
  Swamp: [],
  Ocean: [],
  Mountain: [],
  Plains: [],
  Mistlands: [],
  DeepNorth: [],
  Ashlands: [],
};

for (const creature of creatures) {
  if (creature.hp === 1) continue;
  for (const loc of creature.locations) {
    const biome = locationToBiome(loc);
    const group = groupedCreatures[biome];
    if (group && !group.includes(creature)) {
      group.push(creature);
    }
  }
}

