import type { Biome, BiomeConfig, GameLocation, LocationConfig } from '../types';
import { creatures } from './creatures';

export const locationBiomes: Record<GameLocation, Biome> = {};

export const locationToBiome = (loc: GameLocation | Biome) => (locationBiomes[loc as GameLocation] ?? loc) as Biome;

function biome(id: Biome, active: boolean) {
  return {
    id,
    active,
    creatures: [],
    locations: [],
    resources: [],
  };
}

export const biomes: BiomeConfig[] = [
  biome('Meadows', true),
  biome('BlackForest', true),
  biome('Swamp', true),
  biome('Mountain', true),
  biome('Plains', true),
  biome('Mistlands', false),
  biome('Ashlands', false),
  biome('DeepNorth', false),
];

function loc(
  id: GameLocation,
  variations: string[],
  biomes: Biome[],
  quantity: number,
  {
    isAltar = false,
    isDungeon = false,
    isRuneStone = false,
    canHaveVegvisir = false,
    minAlt = 1,
    maxAlt = 1000,
    minApart = 0,
    minDistance = 0,
    maxDistance = 10000,
  }
): LocationConfig[] {
  const vars = Math.max(variations.length, 1);
  return biomes.map(biome => ({
    id,
    biome,
    quantity: quantity * vars,
    isAltar,
    isDungeon,
    isRuneStone,
    canHaveVegvisir,
    minApart,
    altitude: [minAlt, maxAlt],
    distance: [minDistance, maxDistance],
    creatures: [],
    resources: [],
  }));
}

const isAltar = true;
const isDungeon = true;
const canHaveVegvisir = true;
const isRuneStone = true;


export const locations: LocationConfig[] = [
  // meadows
  ...loc('StartTemple', [], ['Meadows'], 1, { minAlt: 3 }),
  ...loc('StoneCircle', [], ['Meadows'], 25, { minApart: 200 }),
  ...loc('WoodHouse', ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'], ['Meadows'], 20, {}),
  ...loc('WoodFarm', ['1'], ['Meadows'], 10, { minApart: 128, minDistance: 500, maxDistance: 2000 }),
  ...loc('WoodVillage', ['1'], ['Meadows'], 15, { minApart: 256, minDistance: 2000 }),
  ...loc('ShipSetting', ['01'], ['Meadows'], 100, { minApart: 128 }),
  ...loc('Runestone_Meadows', [], ['Meadows'], 100, { minApart: 128, isRuneStone }),
  ...loc('Runestone_Boars', [], ['Meadows'], 50, { minApart: 128, isRuneStone }),
  ...loc('Eikthyrnir', [], ['Meadows'], 3, { isAltar, maxDistance: 1000 }),
  // black forest
  ...loc('Crypt', ['2', '3', '4'], ['BlackForest'], 200, { isDungeon, minApart: 128 }),
  ...loc('Greydwarf_camp', ['1'], ['BlackForest'], 300, { minApart: 128 }),
  ...loc('Ruin', ['1', '2'], ['BlackForest'], 200, { canHaveVegvisir }),
  ...loc('StoneTowerRuinsBF', ['03', '07', '08', '09', '10'], ['BlackForest'], 80, { canHaveVegvisir, minAlt: 2, minApart: 200 }),
  ...loc('StoneHouse', ['3', '4'], ['BlackForest'], 200, { canHaveVegvisir }),
  ...loc('Runestone_Greydwarfs', [], ['BlackForest'], 50, { maxDistance: 2000, minApart: 128, isRuneStone }),
  // ...loc('Runestone_BlackForest', [], ['BlackForest'], 0, { minApart: 128, isRuneStone }),
  ...loc('TrollCave', ['02'], ['BlackForest'], 250, { isDungeon, minAlt: 3, }),
  ...loc('Vendor_BlackForest', [], ['BlackForest'], 10, {}),
  ...loc('GDKing', [], ['BlackForest'], 4, { isAltar, minDistance: 1000, maxDistance: 7000 }),
  // swamp
  ...loc('Grave', ['1'], ['Swamp'], 50, {}),
  ...loc('SwampRuin', ['1', '2'], ['Swamp'], 50, { minApart: 512 }),
  ...loc('InfestedTree', ['01'], ['Swamp'], 700, {}),
  ...loc('SwampHut', ['1', '2', '3', '4', '5'], ['Swamp'], 50 /* 25 for 5 */, {}),
  ...loc('SwampWell', ['1'], ['Swamp'], 25, {}),
  ...loc('FireHole', [], ['Swamp'], 200, { minAlt: 0.5 }),
  ...loc('Runestone_Draugr', [], ['Swamp'], 50, { isRuneStone, minApart: 128 }),
  ...loc('SunkenCrypt', ['4'], ['Swamp'], 400, { isDungeon, minApart: 64, minAlt: 0, maxAlt: 2, canHaveVegvisir }),
  ...loc('Runestone_Swamps', [], ['Swamp'], 100, { isRuneStone, minApart: 128 }),
  ...loc('Bonemass', [], ['Swamp'], 5, { minDistance: 2000, minApart: 3000 }),
  // mountain
  ...loc('DrakeNest', ['01'], ['Mountain'], 200, { minApart: 100, minAlt: 100 }),
  ...loc('Waymarker', ['01', '02'], ['Mountain'], 50, { minAlt: 100 }),
  ...loc('AbandonedLogCabin', ['02', '03', '04'], ['Mountain'], 33 /* 50 for 04 */, { minAlt: 100, minApart: 128 }),
  ...loc('MountainGrave', ['01'], ['Mountain'], 100, { minAlt: 100, minApart: 128, isRuneStone }),
  ...loc('DrakeLorestone', [], ['Mountain'], 50, { minAlt: 100, minApart: 50 }),
  ...loc('MountainWell', ['1'], ['Mountain'], 25, { minAlt: 100, minApart: 256 }),
  ...loc('StoneTowerRuinsM', ['04', '05'], ['Mountain'], 50, { canHaveVegvisir, minAlt: 150 }),
  ...loc('Runestone_Mountains', [], ['Mountain'], 100, { minApart: 128, isRuneStone }),
  ...loc('DragonQueen', [], ['Mountain'], 3, { isAltar, minApart: 3000, maxDistance: 8000, minAlt: 150, maxAlt: 500 }),
  // plains
  ...loc('GoblinCamp', ['2'], ['Plains'], 200, { minApart: 250 }),
  ...loc('StoneTower', ['1', '3'], ['Plains'], 50, { canHaveVegvisir, minApart: 512 }),
  ...loc('Ruin', ['3'], ['Plains'], 50, { canHaveVegvisir, minApart: 512 }),
  ...loc('StoneHengeS', ['1', '2', '3', '4'], ['Plains'], 5, { canHaveVegvisir, minApart: 1000, minAlt: 5 }),
  ...loc('StoneHengeL', ['5', '6'], ['Plains'], 20, { canHaveVegvisir, minApart: 500, minAlt: 2 }),
  ...loc('Runestone_Plains', [], ['Plains'], 100, { isRuneStone }),
  ...loc('GoblinKing', [], ['Plains'], 4, { isAltar, minApart: 3000 }),
  // Ashlands
  ...loc('Meteorite', [], ['Ashlands'], 500, {}),
  // mixed
  ...loc('Dolmen', ['01', '02', '03'], ['Meadows', 'BlackForest'], 100 /* 50 for 03 */, {}),
  ...loc('ShipWreck', ['01', '02', '03', '04'], ['BlackForest', 'Swamp', 'Plains', 'Ocean'], 25, { minApart: 1024, minAlt: -1, maxAlt: 1 }),
];

for (const loc of locations) {
  const biome = biomes.find(b => b.id === loc.biome);
  if (!biome) continue;
  biome.locations.push(loc.id);
  locationBiomes[loc.id] = biome.id;
}

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