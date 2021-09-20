import type { Biome, BiomeConfig, Creature, Destructible, EntityId, GameLocationId, GeneralDrop, LocationConfig } from '../types';
import { chestDrops } from './chests';
import { creatures } from './creatures';
import { destructibles } from './objects';
import { data } from './itemDB';
import { resources } from './resources';
import { singleDrop } from '../model/game';

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
  biome('Mistlands', 6, false),
  biome('Ashlands', 7, false),
  biome('DeepNorth', 8, false),
];

export const biomeTiers = Object.fromEntries(biomes.map(b => [b.id as Biome, b.tier]));

export function area(id: Biome | GameLocationId): BiomeConfig | LocationConfig | undefined {
  return biomes.find(b => b.id === id)
      ?? locations.find(l => l.id === id)
}

function loc(
  tier: number,
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
    items,
  }: {
    type?: LocationConfig['type'],
    vegvisir?: { chance: number; boss: EntityId };
    minAlt?: number,
    maxAlt?: number,
    minApart?: number,
    minDistance?: number,
    maxDistance?: number,
    chest?: GeneralDrop,
    items?: { item: GeneralDrop, num: number, chance: number }[],
  }
): LocationConfig[] {
  const vars = Math.max(variations.length, 1);
  return biomes.map(biome => ({
    id,
    tier,
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
    items,
  }));
}

export const locations: LocationConfig[] = [
  // meadows
  ...loc(1, 'StartTemple', [], ['Meadows'], 1, { minAlt: 3, vegvisir: { chance: 1, boss: 'Eikthyr' } }),
  ...loc(1, 'StoneCircle', [], ['Meadows'], 25, { minApart: 200 }),
  ...loc(1, 'WoodHouse', ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'], ['Meadows'], 20, {
    // 1,2: chest + beehive 25%
    // 3: lean-to
    chest: chestDrops.meadows
  }),
  ...loc(1, 'WoodFarm', ['1'], ['Meadows'], 10, { minApart: 128, minDistance: 500, maxDistance: 2000 }),
  ...loc(1, 'WoodVillage', ['1'], ['Meadows'], 15, { minApart: 256, minDistance: 2000 }),
  ...loc(1, 'ShipSetting', ['01'], ['Meadows'], 100, { minApart: 128, chest: chestDrops.meadowsBuried }),
  ...loc(1, 'Runestone_Meadows', [], ['Meadows'], 100, { minApart: 128, type: 'runestone' }),
  ...loc(1, 'Runestone_Boars', [], ['Meadows'], 50, { minApart: 128, type: 'runestone' }),
  ...loc(1, 'Eikthyrnir', [], ['Meadows'], 3, { type: 'altar', maxDistance: 1000 }),
  // black forest
  ...loc(2, 'Crypt', ['2', '3', '4'], ['BlackForest'], 200, { type: 'dungeon', minApart: 128, chest: chestDrops.fCrypt, vegvisir: { chance: 0.5, boss: 'gd_king' } }),
  ...loc(2, 'Greydwarf_camp', ['1'], ['BlackForest'], 300, {
    minApart: 128,
    /*
      greydwarf spawner:
        greydwarf 5
        greydwarf_elite 1
        greydwarf_shaman 1
        interval: 10
        drop: singleDrop('AncientSeed')
      3 root:
        100hp
        drop: {
          num: [2, 4],
          options: { item: 'Wood' },
          options: { item: 'Resin' },
        }
     */
  }),
  ...loc(2, 'Ruin', ['1', '2'], ['BlackForest'], 200, {
    /*
    # 1
      5 graydwarf
      1 graydwarf_shaman
      chest
    # 2
      chest
      barrel: {
        num: [2, 3],
        options: [
          { item: 'Blueberries', num: [2, 4] },
          { item: 'DeerHide', num: [2, 3] },
          { item: 'Flint', num: [2, 3] },
          { item: 'Coal', num: [5, 8] },
          { item: 'GreydwarfEeye', num: [2, 4] },
          { item: 'Resin', num: [3, 6] },
          { item: 'LeatherScraps', num: [2, 3] },
          { item: 'TinOre', num: [2, 3] },
        ]
      }
      6 greydwarf 100%
      1 greydwarf 20%
      1 greydwarf_elite 20%
     */
    vegvisir: { chance: 0.3, boss: 'gd_king' }
  }),
  ...loc(2, 'StoneTowerRuinsF', ['03', '07', '08', '09', '10'], ['BlackForest'], 80, {
    minAlt: 2,
    minApart: 200,
    chest: chestDrops.blackforest,
    /*
    # 03
      beehive 28.1%
      chest
      1 graydwarf 50%
      1 graydwarf_elite 50%
      vegvisir 30%
      3 graydwarves 50%
      Loot 30%
        6 skeletons
        1 chest
    # 07
      random_roof 25%
        chest
        skeleton
        skeleton 50%
      2x random_roof 25%
        skeleton
      2 skeleton
    # 08
      random_roof 25%
        2 skeleton 50%
      random_roof 25%
        chest
        skeleton 50%
      3 skeleton
    # 09
      random_roof 50%
        chest
        4 skeleton 33%
      3 skeleton 33%
    # 10
      random_roof 25%
        2 skeleton 50%
      random_roof 25%
        chest
        2 skeleton 50%
      3 skeleton 50%
    */
  }),
  ...loc(2, 'StoneHouse', ['3', '4'], ['BlackForest'], 200, {}),
  ...loc(2, 'Runestone_Greydwarfs', [], ['BlackForest'], 50, { maxDistance: 2000, minApart: 128, type: 'runestone' }),
  // ...loc('Runestone_BlackForest', [], ['BlackForest'], 0, { minApart: 128, type: 'runestone' }),
  ...loc(2, 'TrollCave', ['02'], ['BlackForest'], 250, {
    type: 'dungeon',
    minAlt: 3,
    chest: chestDrops.trollCave,
    items: [
      { item: singleDrop('BoneFragments'), num: 3, chance: 0.66 }, // entrance
      { item: singleDrop('YellowMushroom'), num: 12, chance: 0.5 }, // growing
      { item: chestDrops.trollCave!, num: 2, chance: 0.75 }, // chests
      { item: { // pickups
          num: [1, 1],
          options: [
            { item: 'Coins', num: [5, 20] },
            { item: 'Ruby', num: [1, 2] },
            { item: 'Amber', num: [1, 5] },
            { item: 'AmberPearl', num: [1, 3] },
          ]
        },
        num: 9,
        chance: 0.5,
      }
    ],
    // Troll: 0.33
  }),
  ...loc(2, 'Vendor_BlackForest', [], ['BlackForest'], 10, {}),
  ...loc(2, 'GDKing', [], ['BlackForest'], 4, { type: 'altar', minDistance: 1000, maxDistance: 7000 }),
  // swamp
  ...loc(3, 'Grave', ['1'], ['Swamp'], 50, {}),
  ...loc(3, 'SwampRuin', ['1', '2'], ['Swamp'], 50, { minApart: 512, vegvisir: { chance: 0.15, boss: 'Bonemass' } }),
  ...loc(3, 'InfestedTree', ['01'], ['Swamp'], 700, {}),
  ...loc(3, 'SwampHut', ['1', '2', '3', '4', '5'], ['Swamp'], 50 /* 25 for 5 */, { chest: chestDrops.swamp }),
  ...loc(3, 'SwampWell', ['1'], ['Swamp'], 25, {}),
  ...loc(3, 'FireHole', [], ['Swamp'], 200, { minAlt: 0.5 }),
  ...loc(3, 'Runestone_Draugr', [], ['Swamp'], 50, { type: 'runestone', minApart: 128 }),
  ...loc(3, 'SunkenCrypt', ['4'], ['Swamp'], 400, { type: 'dungeon', minApart: 64, minAlt: 0, maxAlt: 2, chest: chestDrops.sunkenCrypt, vegvisir: { chance: 0.5, boss: 'Bonemass' } }),
  ...loc(3, 'Runestone_Swamps', [], ['Swamp'], 100, { type: 'runestone', minApart: 128 }),
  ...loc(3, 'Bonemass', [], ['Swamp'], 5, { minDistance: 2000, minApart: 3000 }),
  // ocean
  ...loc(3, 'Leviathan', [''], ['Ocean'], 200, { minApart: 100, minAlt: -1000, maxAlt: -30 }), // 21 barnacles
  // mountain
  ...loc(4, 'DrakeNest', ['01'], ['Mountain'], 200, { minApart: 100, minAlt: 100 }),
  ...loc(4, 'Waymarker', ['01', '02'], ['Mountain'], 50, { minAlt: 100 }),
  ...loc(4, 'AbandonedLogCabin', ['02', '03', '04'], ['Mountain'], 33 /* 50 for 04 */, { minAlt: 100, minApart: 128 }),
  ...loc(4, 'MountainGrave', ['01'], ['Mountain'], 100, { minAlt: 100, minApart: 128, type: 'runestone' }),
  ...loc(4, 'DrakeLorestone', [], ['Mountain'], 50, { minAlt: 100, minApart: 50 }),
  ...loc(4, 'MountainWell', ['1'], ['Mountain'], 25, { minAlt: 100, minApart: 256 }),
  ...loc(4, 'StoneTowerRuinsM', ['04', '05'], ['Mountain'], 50, { vegvisir: { chance: 0.15, boss: 'Dragon' }, minAlt: 150 }),
  ...loc(4, 'Runestone_Mountains', [], ['Mountain'], 100, { minApart: 128, type: 'runestone' }),
  ...loc(4, 'DragonQueen', [], ['Mountain'], 3, { type: 'altar', minApart: 3000, maxDistance: 8000, minAlt: 150, maxAlt: 500 }),
  // plains
  ...loc(5, 'GoblinCamp', ['2'], ['Plains'], 200, { minApart: 250, chest: chestDrops.heath }),
  ...loc(5, 'StoneTower', ['1', '3'], ['Plains'], 50, { minApart: 512 }),
  ...loc(5, 'Ruin', ['3'], ['Plains'], 50, { minApart: 512 }),
  ...loc(5, 'StoneHengeS', ['1', '2', '3', '4'], ['Plains'], 5, { minApart: 1000, minAlt: 5 }),
  ...loc(5, 'StoneHengeL', ['5', '6'], ['Plains'], 20, { minApart: 500, minAlt: 2, vegvisir: { chance: 0.15, boss: 'GoblinKing' } }),
  ...loc(5, 'Runestone_Plains', [], ['Plains'], 100, { type: 'runestone' }),
  ...loc(5, 'TarPit', ['1', '2', '3'], ['Plains'], 100, {
    minApart: 128,
    minAlt: 5,
    maxAlt: 60,
    // maxTerrainDelta: 1.5
    /*
    # 1
      7x Growth 50%
      2x Growth spawner 1 in 1 hour
      4x Pickable_TarBig
      12x Pickable_Tar
    # 2
      7x Growth 50%
      2x Growth spawner 1 in 1 hour
      4x Pickable_TarBig
      8x Pickable_Tar
    # 3
      4x Growth 50%
      2x Growth spawner 1 in 1 hour
      4x Pickable_TarBig
      8x Pickable_Tar
    */ 
  }),
  ...loc(5, 'GoblinKing', [], ['Plains'], 4, { type: 'altar', minApart: 3000 }),
  // Ashlands
  ...loc(7, 'Meteorite', [], ['Ashlands'], 500, {}),
  // mixed
  ...loc(1, 'Dolmen', ['01', '02', '03'], ['Meadows', 'BlackForest'], 100 /* 50 for 03 */, {}),
  ...loc(2, 'ShipWreck', ['01', '02', '03', '04'], ['BlackForest', 'Swamp', 'Plains', 'Ocean'], 25, { minApart: 1024, minAlt: -1, maxAlt: 1, chest: chestDrops.shipwreck_karve_chest }),
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
  addToLocation(loc.id, loc.chest?.options.map(opt => opt.item) ?? [], [], []);
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
