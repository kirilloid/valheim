import type { Biome, BiomeConfig, GameLocation, LocationConfig } from '../types';
import { creatures } from './creatures';

export const locationBiomes: Record<GameLocation, Biome> = {
  BonemassAltar: 'Swamp',
  BurialChamber: 'BlackForest',
  DraugrVillage: 'Meadows',
  EggNest: 'Mountain',
  EikthyrAltar: 'Meadows',
  ElderAltar: 'BlackForest',
  FireGeyser: 'Swamp',
  ForestTower: 'BlackForest',
  GoblinVillage: 'Plains',
  ModerAltar: 'Mountain',
  MountainCastle: 'Mountain',
  MountainTower: 'Mountain',
  StoneHedge: 'Plains',
  SunkenCrypt: 'Swamp',
  SwampStoneCircle: 'Swamp',
  TrollCave: 'BlackForest',
  YagluthAltar: 'Plains',
};

export const locationToBiome = (loc: GameLocation | Biome): Biome => locationBiomes[loc as GameLocation] ?? loc;

export const biomes: BiomeConfig[] = [
  {
    id: 'Meadows',
    active: true,
    creatures: [],
    locations: [],
    resources: [],
  },
  {
    id: 'BlackForest',
    active: true,
    creatures: [],
    locations: [],
    resources: [],
  },
];

export const locations: LocationConfig[] = [
  {
    id: 'EikthyrAltar',
    isDungeon: false,
    creatures: [],
    resources: [],
  },
];

for (const [loc, biome] of Object.entries(locationBiomes)) {
  biomes.find(b => b.id === biome)?.locations.push(loc as GameLocation);
}
for (const creature of creatures) {
  for (const loc of creature.locations) {
    const items = creature.drop.map(d => d.item);
    if (loc in locationBiomes) {
      const gameLocation = locations.find(l => l.id === loc);
      if (gameLocation == null) continue;
      gameLocation.creatures.push(creature);
      gameLocation.resources.push(...items);
    }
    const biomeId = locationToBiome(loc);
    const biome = biomes.find(b => b.id === biomeId);
    if (biome == null) continue;
    biome.creatures.push(creature);
    biome.resources.push(...items);
  }
}