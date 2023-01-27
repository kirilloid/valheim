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

function add(creature: Creature, biome: Biome) {
  const group = groupedCreatures[biome];
  if (group && !group.includes(creature)) {
    group.push(creature);
  }
}

for (const creature of creatures) {
  if (creature.hp === 1) continue;
  const biomes = [
    ...new Set(creature.spawners.flatMap(s => s.biomes)),
    ...(objectLocationMap[creature.id] ?? []).map(locationToBiome)
  ];
  for (const biome of biomes) {
    add(creature, biome);
    for (const attackVariety of creature.attacks) {
      for (const attack of attackVariety.attacks) {
        if ('spawn' in attack) {
          for (const id of attack.spawn) {
            const spawned = creatures.find(c => c.id === id);
            if (spawned) {
              add(spawned, biome);
            }
          }
        }
      }
    }
  }
}

const mistile = creatures.find(c => c.id === 'Mistile');
if (mistile != null) {
  groupedCreatures.Mistlands.push(mistile);
}

export const defaultCreature = creatures.find(c => c.id === 'Greyling')!;
export const creatureBiome = (creature: Creature) => creature.spawners[0]?.biomes[0] ?? locationToBiome(objectLocationMap[creature.id]?.[0]!);
