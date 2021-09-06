import type { Biome, BiomeConfig, Creature, Destructible, EntityId, GameLocationId, GeneralDrop, LocationConfig } from '../types';
import { chestDrops } from './chests';
import { creatures } from './creatures';
import { destructibles } from './objects';
import { data } from './itemDB';
import { resources } from './resources';

export const locationBiomes: Record<GameLocationId, Biome> = {};

export const locationToBiome = (loc: GameLocationId | Biome) => (locationBiomes[loc as GameLocationId] ?? loc) as Biome;

function biome(id: Biome, tier: number, active: boolean) {
  return {
    id,
    tier,
    active,
    destructibles: [],
    creatures: [],
    locations: [],
    resources: [],
  };
}

export const biomes: BiomeConfig[] = [
  biome('Meadows', 1, true),
  biome('BlackForest', 2, true),
  biome('Swamp', 3, true),
  biome('Mountain', 4, true),
  biome('Plains', 5, true),
  biome('Ocean', 3, true),
  biome('Mistlands', 0, false),
  biome('Ashlands', 3, false),
  biome('DeepNorth', 0, false),
];

function loc(
  id: GameLocationId,
  variations: string[],
  biomes: Biome[],
  quantity: number,
  {
    type = 'misc',
    minAlt = 1,
    maxAlt = 1000,
    minApart = 0,
    minDistance = 0,
    maxDistance = 10000,
    vegvisir,
    chest,
  }: {
    type?: LocationConfig['type'],
    vegvisir?: { chance: number; boss: EntityId };
    minAlt?: number,
    maxAlt?: number,
    minApart?: number,
    minDistance?: number,
    maxDistance?: number,
    chest?: GeneralDrop,
  }
): LocationConfig[] {
  const vars = Math.max(variations.length, 1);
  return biomes.map(biome => ({
    id,
    biome,
    quantity: quantity * vars,
    type,
    vegvisir,
    minApart,
    altitude: [minAlt, maxAlt],
    distance: [minDistance, maxDistance],
    destructibles: [],
    creatures: [],
    resources: [],
    chest,
  }));
}

export const locations: LocationConfig[] = [
  // meadows
  ...loc('StartTemple', [], ['Meadows'], 1, { minAlt: 3, vegvisir: { chance: 1, boss: 'Eikthyr' } }),
  ...loc('StoneCircle', [], ['Meadows'], 25, { minApart: 200 }),
  ...loc('WoodHouse', ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'], ['Meadows'], 20, { chest: chestDrops.meadows }),
  ...loc('WoodFarm', ['1'], ['Meadows'], 10, { minApart: 128, minDistance: 500, maxDistance: 2000 }),
  ...loc('WoodVillage', ['1'], ['Meadows'], 15, { minApart: 256, minDistance: 2000 }),
  ...loc('ShipSetting', ['01'], ['Meadows'], 100, { minApart: 128, chest: chestDrops.meadowsBuried }),
  ...loc('Runestone_Meadows', [], ['Meadows'], 100, { minApart: 128, type: 'runestone' }),
  ...loc('Runestone_Boars', [], ['Meadows'], 50, { minApart: 128, type: 'runestone' }),
  ...loc('Eikthyrnir', [], ['Meadows'], 3, { type: 'altar', maxDistance: 1000 }),
  // black forest
  ...loc('Crypt', ['2', '3', '4'], ['BlackForest'], 200, { type: 'dungeon', minApart: 128, chest: chestDrops.fCrypt, vegvisir: { chance: 0.5, boss: 'gd_king' } }),
  ...loc('Greydwarf_camp', ['1'], ['BlackForest'], 300, { minApart: 128 }),
  ...loc('Ruin', ['1', '2'], ['BlackForest'], 200, { vegvisir: { chance: 0.15, boss: 'gd_king' } }),
  ...loc('StoneTowerRuinsF', ['03', '07', '08', '09', '10'], ['BlackForest'], 80, { minAlt: 2, minApart: 200 }),
  ...loc('StoneHouse', ['3', '4'], ['BlackForest'], 200, {}),
  ...loc('Runestone_Greydwarfs', [], ['BlackForest'], 50, { maxDistance: 2000, minApart: 128, type: 'runestone' }),
  // ...loc('Runestone_BlackForest', [], ['BlackForest'], 0, { minApart: 128, type: 'runestone' }),
  ...loc('TrollCave', ['02'], ['BlackForest'], 250, { type: 'dungeon', minAlt: 3, chest: chestDrops.trollCave }),
  ...loc('Vendor_BlackForest', [], ['BlackForest'], 10, {}),
  ...loc('GDKing', [], ['BlackForest'], 4, { type: 'altar', minDistance: 1000, maxDistance: 7000 }),
  // swamp
  ...loc('Grave', ['1'], ['Swamp'], 50, {}),
  ...loc('SwampRuin', ['1', '2'], ['Swamp'], 50, { minApart: 512, vegvisir: { chance: 0.15, boss: 'Bonemass' } }),
  ...loc('InfestedTree', ['01'], ['Swamp'], 700, {}),
  ...loc('SwampHut', ['1', '2', '3', '4', '5'], ['Swamp'], 50 /* 25 for 5 */, { chest: chestDrops.swamp }),
  ...loc('SwampWell', ['1'], ['Swamp'], 25, {}),
  ...loc('FireHole', [], ['Swamp'], 200, { minAlt: 0.5 }),
  ...loc('Runestone_Draugr', [], ['Swamp'], 50, { type: 'runestone', minApart: 128 }),
  ...loc('SunkenCrypt', ['4'], ['Swamp'], 400, { type: 'dungeon', minApart: 64, minAlt: 0, maxAlt: 2, chest: chestDrops.sunkenCrypt, vegvisir: { chance: 0.5, boss: 'Bonemass' } }),
  ...loc('Runestone_Swamps', [], ['Swamp'], 100, { type: 'runestone', minApart: 128 }),
  ...loc('Bonemass', [], ['Swamp'], 5, { minDistance: 2000, minApart: 3000 }),
  // ocean
  ...loc('Leviathan', [''], ['Ocean'], 200, { minApart: 100, minAlt: -1000, maxAlt: -30 }), // 21 barnacles
  // mountain
  ...loc('DrakeNest', ['01'], ['Mountain'], 200, { minApart: 100, minAlt: 100 }),
  ...loc('Waymarker', ['01', '02'], ['Mountain'], 50, { minAlt: 100 }),
  ...loc('AbandonedLogCabin', ['02', '03', '04'], ['Mountain'], 33 /* 50 for 04 */, { minAlt: 100, minApart: 128 }),
  ...loc('MountainGrave', ['01'], ['Mountain'], 100, { minAlt: 100, minApart: 128, type: 'runestone' }),
  ...loc('DrakeLorestone', [], ['Mountain'], 50, { minAlt: 100, minApart: 50 }),
  ...loc('MountainWell', ['1'], ['Mountain'], 25, { minAlt: 100, minApart: 256 }),
  ...loc('StoneTowerRuinsM', ['04', '05'], ['Mountain'], 50, { vegvisir: { chance: 0.15, boss: 'Dragon' }, minAlt: 150 }),
  ...loc('Runestone_Mountains', [], ['Mountain'], 100, { minApart: 128, type: 'runestone' }),
  ...loc('DragonQueen', [], ['Mountain'], 3, { type: 'altar', minApart: 3000, maxDistance: 8000, minAlt: 150, maxAlt: 500 }),
  // plains
  ...loc('GoblinCamp', ['2'], ['Plains'], 200, { minApart: 250, chest: chestDrops.heath }),
  ...loc('StoneTower', ['1', '3'], ['Plains'], 50, { minApart: 512 }),
  ...loc('Ruin', ['3'], ['Plains'], 50, { minApart: 512 }),
  ...loc('StoneHengeS', ['1', '2', '3', '4'], ['Plains'], 5, { minApart: 1000, minAlt: 5 }),
  ...loc('StoneHengeL', ['5', '6'], ['Plains'], 20, { minApart: 500, minAlt: 2, vegvisir: { chance: 0.15, boss: 'GoblinKing' } }),
  ...loc('Runestone_Plains', [], ['Plains'], 100, { type: 'runestone' }),
  ...loc('GoblinKing', [], ['Plains'], 4, { type: 'altar', minApart: 3000 }),
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
  biomes.find(b => b.id === biome)?.locations.push(loc as GameLocationId);
}

function addToLocation(
  loc: string,
  items: EntityId[],
  creatures: Creature[],
  destructibles: Destructible[],
) {
  if (loc in locationBiomes) {
    const gameLocation = locations.find(l => l.id === loc);
    if (gameLocation != null) {
      gameLocation.resources.push(...items);
      gameLocation.creatures.push(...creatures);
      gameLocation.destructibles.push(...destructibles);
    }
  }
  const biomeId = locationToBiome(loc);
  const biome = biomes.find(b => b.id === biomeId);
  if (biome != null) {
    biome.resources.push(...items);
    biome.creatures.push(...creatures);
    biome.destructibles.push(...destructibles);
  }
}

for (const destr of destructibles) {
  for (const loc of destr.grow.flatMap(g => g.locations)) {
    addToLocation(loc, [], [], [destr]);
  }
}

for (const { id, grow } of resources) {
  if (!grow) continue;
  for (const loc of grow.flatMap(g => g.locations)) {
    addToLocation(loc, [id], [], []);
  }
}

for (const creature of creatures) {
  for (const loc of creature.locations) {
    const items = creature.drop.map(d => d.item);
    addToLocation(loc, items, [creature], []);
  }
}

for (const loc of locations) {
  loc.resources = [...new Set(loc.resources)];
  if (loc.vegvisir) {
    loc.tags = ['vegvisir'];
  }
}

for (const biome of biomes) {
  biome.resources = [...new Set(biome.resources)]
    // thanks oozers spawning blobs
    .filter(id => data[id]?.type !== 'creature');
  biome.creatures = [...new Set(biome.creatures)].sort((a, b) => a.hp - b.hp);
  biome.locations = [...new Set(biome.locations)];
}
