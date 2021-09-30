import { Biome, Creature } from '../types';
import { creatures } from './creatures';
import { locationToBiome, objectLocationMap } from './location';

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
  const biomes = [...creature.locations, ...(objectLocationMap[creature.id] ?? []).map(locationToBiome)];
  for (const biome of biomes) {
    const group = groupedCreatures[biome];
    if (group && !group.includes(creature)) {
      group.push(creature);
    }
  }
}

