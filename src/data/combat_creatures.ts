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
  const biomes = [
    ...new Set(creature.spawners.flatMap(s => s.biomes)),
    ...(objectLocationMap[creature.id] ?? []).map(locationToBiome)
  ];
  for (const biome of biomes) {
    const group = groupedCreatures[biome];
    if (group && !group.includes(creature)) {
      group.push(creature);
    }
  }
}

export const defaultCreature = creatures.find(c => c.id === 'Greyling')!;
export const creatureBiome = (creature: Creature) => creature.spawners[0]?.biomes[0] ?? locationToBiome(objectLocationMap[creature.id]?.[0]!);
