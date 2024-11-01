import type {
  Biome,
  BiomeConfig,
  Creature,
  DungeonGenConfig,
  EntityId,
  Fish,
  GameLocationId,
  LocationConfig,
  LocationItem,
  Pair,
} from '../../types';

import * as L from './locations';

import { fullDestructible, objects } from '../objects';
import { data } from '../itemDB';
import { resources } from '../resources';
import {
  Distribution, DropDist,
  mergeDist, power, powerDist, scaleDist,
  sum, sumDist, gatherDrop, mul, weightedAdd
} from '../../model/dist';
import { mapValues } from '../../model/utils';
import { creatures } from '../creatures';
import { fishes } from '../fish';
import { spawners } from '../spawners';
import { CamplaceConfig, RoomConfig } from '../rooms/types';

export const locationBiomes: Record<GameLocationId, Biome> = {};

export const locationToBiome = (loc: GameLocationId | Biome) => (locationBiomes[loc as GameLocationId] ?? loc) as Biome;

function biome(emoji: string, id: Biome, tier: number, active: boolean): BiomeConfig {
  return {
    id,
    active,
    tier,
    emoji,
    destructibles: new Set(),
    creatures: new Set(),
    locations: [],
    resources: new Set(),
  };
}

export const biomes: BiomeConfig[] = [
  biome('⛳', 'Meadows', 1, true),
  biome('🌲', 'BlackForest', 2, true),
  biome('🐸', 'Swamp', 3, true),
  biome('⛰️', 'Mountain', 4, true),
  biome('🍂', 'Plains', 5, true),
  biome('🌊', 'Ocean', 3, true),
  biome('🌫', 'Mistlands', 6, true),
  biome('🔥', 'Ashlands', 7, true),
  biome('🧊', 'DeepNorth', 8, false),
];

const biomeMap = Object.fromEntries(biomes.map(b => [b.id, b])) as Record<Biome, BiomeConfig>;

export const biomeTiers = Object.fromEntries(biomes.map(b => [b.id as Biome, b.tier]));

export function area(id: Biome | GameLocationId): BiomeConfig | LocationConfig | undefined {
  return biomes.find(b => b.id === id)
      ?? locationsTypeIdMap.get(id)
}

export const locations: LocationConfig[] = [
  // locations, sortOrder: 3
  L.StoneCircle,
  L.StartTemple,
  L.Eikthyrnir,
  L.GoblinKing,
  L.Greydwarf_camp1,
  // Greydwarf_camp2: disabled
  // Greydwarf_camp3: disabled
  L.Runestone_Greydwarfs,
  L.Grave1,
  L.SwampRuin1,
  L.SwampRuin2,
  L.FireHole,
  L.Runestone_Draugr,
  // Castle: disabled
  // Fort1: disabled
  // xmastree: disabled
  L.GDKing,
  L.Bonemass,
  // Meteorite
  L.Crypt2,
  L.Ruin1,
  L.Ruin2,
  // Pillar 1: disabled
  // Pillar 2: disabled
  // StoneHouse1: disabled
  // StoneHouse1_heath: [quantity=0]
  // StoneHouse2_heath: [quantity=0]
  // StoneHouse5_heath: [quantity=0]
  // StoneHouse2: disabled
  L.StoneHouse3,
  L.StoneHouse4,
  // StoneHouse5: disabled
  L.Ruin3,
  // GoblinCamp1: disabled
  L.GoblinCamp2,
  L.StoneTower1,
  // StoneTower2: disabled
  L.StoneTower3,
  // StoneTower4: disabled
  L.StoneHenge1,
  L.StoneHenge2,
  L.StoneHenge3,
  L.StoneHenge4,
  L.StoneHenge5,
  L.StoneHenge6,
  L.WoodHouse1,
  L.WoodHouse2,
  L.WoodHouse3,
  L.WoodHouse4,
  L.WoodHouse5,
  L.WoodHouse6,
  L.WoodHouse7,
  L.WoodHouse8,
  L.WoodHouse9,
  L.WoodHouse10,
  L.WoodHouse11,
  L.WoodHouse12,
  L.WoodHouse13,
  L.WoodFarm1,
  L.WoodVillage1,
  // TrollCave: disabled
  L.TrollCave02,
  // SunkenCrypt1: disabled
  // SunkenCrypt2: disabled
  // SunkenCrypt3: disabled
  L.SunkenCrypt4,
  L.Dolmen01,
  L.Dolmen02,
  L.Dolmen03,
  L.Crypt3,
  L.Crypt4,
  L.InfestedTree01,
  L.SwampHut1,
  L.SwampHut2,
  L.SwampHut3,
  L.SwampHut4,
  L.SwampHut5,
  L.SwampWell1,
  L.StoneTowerRuins04,
  L.StoneTowerRuins05,
  L.StoneTowerRuins03,
  L.StoneTowerRuins07,
  L.StoneTowerRuins08,
  L.StoneTowerRuins09,
  L.StoneTowerRuins10,
  L.Vendor_BlackForest,
  L.Hildir_camp,
  L.ShipSetting01,
  L.Dragonqueen,
  L.Hildir_cave,
  L.Hildir_crypt,
  L.Hildir_plainsfortress,
  L.DrakeNest01,
  L.Waymarker01,
  L.Waymarker02,
  L.AbandonedLogCabin02,
  L.AbandonedLogCabin03,
  L.AbandonedLogCabin04,
  L.MountainGrave01,
  L.DrakeLorestone,
  L.MountainWell1,
  // MountainCave01: disabled
  L.ShipWreck01,
  L.ShipWreck02,
  L.ShipWreck03,
  L.ShipWreck04,
  L.Runestone_Meadows,
  L.Runestone_Boars,
  L.Runestone_Swamps,
  L.Runestone_Mountains,
  L.Runestone_BlackForest,
  L.Runestone_Plains,
  // DevHouse1: disabled
  // DevSoundTest: disabled
  // DevHouse2: disabled
  // DevHouse3: disabled
  // DevWall1: disabled
  // DevFloor1: disabled
  // DevGround1: disabled
  // DevGround2: disabled

  // locations_cp1, sortOrder: 3
  L.TarPit1,
  L.TarPit2,
  L.TarPit3,

  // locations_mountaincaves, sortOrder: 3
  L.MountainCave02,

  // locations_mistlands, sortOrder: 3
  L.Mistlands_GuardTower1_new,
  L.Mistlands_GuardTower1_ruined_new,
  L.Mistlands_GuardTower1_ruined_new2,
  L.Mistlands_GuardTower2_new,
  L.Mistlands_GuardTower3_new,
  L.Mistlands_GuardTower3_ruined_new,
  L.Mistlands_Lighthouse1_new,
  L.Mistlands_Excavation1,
  L.Mistlands_Excavation2,
  L.Mistlands_Excavation3,
  L.Mistlands_Harbour1,
  L.Mistlands_Viaduct1,
  L.Mistlands_Viaduct2,
  L.Mistlands_RockSpire1,
  L.Mistlands_Giant1,
  L.Mistlands_Giant2,
  L.Mistlands_DvergrTownEntrance1,
  L.Mistlands_DvergrTownEntrance2,
  L.Mistlands_DvergrBossEntrance1,
  L.Mistlands_RoadPost1,
  L.Mistlands_StatueGroup1,
  L.Mistlands_Statue1,
  L.Mistlands_Statue2,
  L.Mistlands_Swords1,
  L.Mistlands_Swords2,
  L.Mistlands_Swords3,
  L.Runestone_Mistlands,

  // locations_ashlands
  L.FaderLocation,
  L.PlaceofMystery1,
  L.PlaceofMystery2,
  L.PlaceofMystery3,
  L.CharredFortress,
  L.FortressRuins,
  L.CharredRuins1,
  L.Runestone_Ashlands,
  L.LeviathanLava,
  L.SulfurArch,
  L.CharredStone_Spawner,
  L.VoltureNest,
  L.CharredTowerRuins1,
  L.CharredTowerRuins1_dvergr,
  L.CharredTowerRuins2,
  L.CharredTowerRuins3,
  L.AshlandRuins,
  L.MorgenHole1,
  L.MorgenHole2,
  L.MorgenHole3,
  L.CharredRuins2,
  L.CharredRuins3,
  L.CharredRuins4,
  L.BogWitch_Camp,
];


export const dungeons: DungeonGenConfig[] = [
  {
    id: 'MeadowsFarm',
    type: 'CampRadial',
    rooms: [20, 30],
    maxTilt: 25,
    radius: [18, 32],
    perimeterSections: 10,
    perimeterBuffer: 0,
  },
  {
    id: 'MeadowsVillage',
    type: 'CampRadial',
    rooms: [20, 30],
    maxTilt: 25,
    radius: [28, 32],
    perimeterSections: 10,
    perimeterBuffer: 0,
  },
  {
    id: 'ForestCrypt',
    type: 'Dungeon',
    rooms: [20, 40],
    minRequiredRooms: 2,
    requiredRooms: [1,2,3,4,5].map(id => `forestcrypt_new_BurialChamber0${id}`),
    doorTypes: ['dungeon_forestcrypt_door'],
    doorChance: 0.5,
  },
  {
    id: 'SunkenCrypt',
    type: 'Dungeon',
    rooms: [20, 30],
    minRequiredRooms: 0,
    requiredRooms: [],
    doorTypes: ['dungeon_sunkencrypt_irongate'],
    doorChance: 0.3,
  },
  {
    id: 'MountainCave',
    type: 'Dungeon',
    rooms: [3, 64],
    minRequiredRooms: 3,
    requiredRooms: [1,2,3].map(id => `cave_shrine_shrine0${id}`),
    doorTypes: [
      'cloth_hanging_door_double',
      'caverock_ice_pillar_wall',
    ],
    doorChance: 0.2,
  },
  {
    id: 'GoblinCamp',
    type: 'CampRadial',
    rooms: [15, 25],
    maxTilt: 25,
    radius: [15, 30],
    perimeterSections: 10,
    perimeterBuffer: 2,
  },
  {
    id: 'Mistlands_DvergrTown',
    type: 'Dungeon',
    rooms: [16, 96],
    minRequiredRooms: 1,
    requiredRooms: [
      'dvergr_room_TREASURE',
      'dvergr_room_TREASURE2'
    ],
    doorTypes: [
      'dvergrtown_creep_door', // stone
      'dvergrtown_creep_door', // dvergr
      'dvergrtown_slidingdoor', // dvergr
      'dvergrtown_wood_wall02', // dvergr
    ],
    doorChance: 0.9,
  },
  {
    id: 'Mistlands_DvergrBoss',
    type: 'Dungeon',
    rooms: [512, 512],
    minRequiredRooms: 1,
    requiredRooms: [
      'dvergr_bossroom_COMPLETESTAIR04',
    ],
    doorTypes: [],
    doorChance: 0,
  },
  {
    id: 'FortressRuins',
    type: 'CampRadial',
    rooms: [20, 30],
    maxTilt: 25,
    radius: [30, 32],
    perimeterSections: 12,
    perimeterBuffer: 0,
  /*minRequiredRooms: 1,
    requiredRooms: [
      'FortressRuins23',
      'FortressRuins_new01',
      'FortressRuins_shieldgen',
    ], */
  },
];

export const locationsIdMap = new Map(locations.map(l => [l.id, l]));
export const locationsTypeIdMap = new Map(locations.map(l => [l.typeId, l]));

for (const loc of locations) {
  for (const lb of loc.biomes) {
    const biome = biomes.find(b => b.id === lb);
    if (!biome) continue;
    biome.locations.push(loc.typeId);
    locationBiomes[loc.typeId] = biome.id;
  }
}

function addToBiome(
  biomeId: Biome,
  items: EntityId[],
  creatures: (Creature | Fish)[],
  destructibles: EntityId[],
) {
  const biome = biomes.find(b => b.id === biomeId);
  if (biome != null) {
    for (const i of items) biome.resources.add(i);
    for (const c of creatures) biome.creatures.add(c);
    for (const d of destructibles) biome.destructibles.add(d);
  }
}

for (const obj of objects) {
  for (const loc of (obj.grow ?? []).flatMap(g => g.locations)) {
    addToBiome(loc, [], [], [obj.id]);
  }
}

for (const creature of creatures) {
  for (const spawner of creature.spawners) {
    for (const biome of spawner.biomes) {
      const killed = spawner.killed;
      const biomeConfig = biomes.find(b => b.id === biome);
      if (!biomeConfig) continue;
      if (killed != null && (data[killed]?.tier ?? 0) >= biomeConfig.tier) continue;
      const items = creature.drop.map(drop => drop.item);
      addToBiome(biome, items, [creature], []);
    }
  }
}

for (const fish of fishes) {
  for (const biome of fish.spawners.flatMap(g => g.biomes)) {
    addToBiome(biome, [], [fish], []);
  }
}

for (const { id, grow } of resources) {
  if (!grow) continue;
  for (const loc of grow.flatMap(g => g.locations)) {
    addToBiome(loc, [id], [], []);
  }
}

export const objectLocationMap: Record<EntityId, GameLocationId[]> = {};

function collectItems(items: LocationItem[]): DropDist {
  const result: DropDist = {};
  for (const { item, number, chance } of items) {
    const baseDist = typeof item !== 'string'
      ? collectItems(item)
      : { [item]: [0, 1] } ;
    const dist = mapValues(baseDist, v => power(weightedAdd(v, [1], chance), number));
    mergeDist(result, dist);
  }
  return result;
}

function collectRooms(rooms: (RoomConfig | CamplaceConfig)[]): DropDist {
  const result: DropDist = {};
  for (const room of rooms) {
    const base = collectItems(room.items);
    for (const [item, dist] of Object.entries(base)) {
      const total = powerDist(dist, room.dist);
      result[item] = mul(result[item] ?? [1], total);
    }
  }
  return result;
}

function addToDist(drop: DropDist, item: EntityId, dist: Distribution): void {
  drop[item] = sum([drop[item] ?? [], dist]);
}

function addToBiomes<T>(biomes: Biome[], reader: (biome: BiomeConfig) => Set<T>, item: T) {
  for (const b of biomes) {
    reader(biomeMap[b]).add(item);
  }
}

function addDistToLocation(loc: LocationConfig, drop: DropDist) {
  for (const [item, dist] of Object.entries(drop)) {
    const obj = data[item];
    if (obj == null) {
      console.error(`Prefab '${item}' exists in location '${loc.id}', but wasn't found in objectDB`);
      continue;
    }
    switch (obj.type) {
      case 'piece':
        addToDist(loc.destructibles, item, dist);
        break;
      case 'object':
        addToDist(loc.destructibles, item, dist);
        const items = gatherDrop(obj.drop ?? []);
        for (const [tItem, tDist] of Object.entries(items)) {
          addToDist(loc.resources, tItem, powerDist(tDist, dist));
        }
        if ('Vegvisir' in obj) {
          (loc.tags ?? (loc.tags = [])).push('vegvisir');
        }
        break;
      case 'creature':
        addToDist(loc.creatures, item, dist);
        break;
      case 'spawner':
        const spawner = spawners.find(s => s.id === item);
        if (spawner != null) {
          addToDist(loc.creatures, spawner.spawn, dist);
        }
        break;
      default:
        addToDist(loc.resources, item, dist);
    }
    if (obj.type === 'object') {
      if (obj.Destructible) {
        const drops = fullDestructible(obj)?.drop ?? [];
        const items = gatherDrop(drops);
        for (const [tItem, tDist] of Object.entries(items)) {
          addToDist(loc.resources, tItem, powerDist(tDist, dist));
        }
      }
    }
  }
}

function addToMap(id: GameLocationId, item: EntityId): void {
  const obj = data[item];
  if (obj == null) return;
  const typeId = locationsIdMap.get(id)?.typeId;
  if (typeId != null) {
    (objectLocationMap[item] ?? (objectLocationMap[item] = [])).push(typeId);
  }
  const loc = locationsIdMap.get(id);
  if (!loc) return;
  for (const biomeId of loc.biomes) {
    const biome = biomes.find(b => b.id === biomeId);
    if (biome == null) continue;
    switch (obj.type) {
      case 'piece':
        addToBiomes(loc.biomes, b => b.destructibles, item);
        break;
      case 'object':
        addToBiomes(loc.biomes, b => b.destructibles, item);
        for (const drop of obj.drop ?? []) {
          for (const option of drop.options) {
            addToMap(id, option.item);
          }
        }
        if ('Vegvisir' in obj) {
          (loc.tags ?? (loc.tags = [])).push('vegvisir');
        }
        break;
      case 'spawner':
        const creature = data[obj.spawn];
        addToBiomes(loc.biomes, b => b.creatures, creature);
        break;
      case 'creature':
        addToBiomes(loc.biomes, b => b.creatures, obj);
        obj.drop.forEach(({ item }) => {
          addToBiomes(loc.biomes, b => b.resources, item);
        });
        break;
      default:
        addToBiomes(loc.biomes, b => b.resources, item);
    }
  }
}

function addToMapRec(id: GameLocationId, { item }: LocationItem): void {
  if (typeof item === 'string') {
    addToMap(id, item);
  } else {
    item.forEach(child => addToMapRec(id, child));
  }
}

export const musicToLocation: Record<string, GameLocationId[]> = {};

for (const loc of locations) {
  const { items, dungeon, camp, customMusic } = loc;
  if (customMusic) {
    (musicToLocation[customMusic] ?? (musicToLocation[customMusic] = [])).push(loc.id)
  }
  for (const item of items) {
    addToMapRec(loc.id, item);
  }
  if (dungeon != null) {
    for (const { items } of dungeon.rooms) {
      for (const item of items) {
        addToMapRec(loc.id, item);
      }
    }
  }
  if (camp != null) {
    for (const { items } of camp.inner) {
      for (const item of items) {
        addToMapRec(loc.id, item);
      }
    }
    for (const { items } of camp.perimeter) {
      for (const item of items) {
        addToMapRec(loc.id, item);
      }
    }
  }
}

for (const biome of biomes) {
  // biome.resources = [...new Set(biome.resources)]
    // thanks oozers spawning blobs
    // .filter(id => data[id]?.type !== 'creature');
  // biome.creatures = [...new Set(biome.creatures)].sort((a, b) => a.hp - b.hp);
  biome.locations = [...new Set(biome.locations)];
}

for (const id in objectLocationMap) {
  objectLocationMap[id] = [...new Set(objectLocationMap[id])];
}

const computedLocations = new Map<GameLocationId, LocationConfig>();

export function getLocationDetails(typeId: GameLocationId): LocationConfig | undefined {
  if (computedLocations.has(typeId)) {
    return computedLocations.get(typeId)!;
  }
  const locs = locations.filter(loc => loc.typeId === typeId);
  const total: DropDist[] = [];
  if (!locs.length) return undefined;
  const biomes = new Set<Biome>();
  const quantity = locs.reduce((total, loc) => total + loc.quantity, 0);
  let biomeArea = 0;
  const distance: Pair<number> = [10000, 0];
  const altitude: Pair<number> = [1000, -1000];
  const terrainDelta: Pair<number> = [90, 0];
  let needsKey: EntityId | undefined;
  for (const loc of locs) {
    if (!computedLocations.has(loc.id)) {
      const varDrop = collectItems(loc.items);
      const { dungeon, camp } = loc;
      if (dungeon) {
        mergeDist(varDrop, collectRooms(dungeon.rooms));
      }
      if (camp) {
        mergeDist(varDrop, collectRooms(camp.inner));
        mergeDist(varDrop, collectRooms(camp.perimeter));
      }
      const variantShare = loc.quantity / quantity;
      total.push(scaleDist(varDrop, variantShare));
      addDistToLocation(loc, varDrop);
      computedLocations.set(loc.id, loc);
    }
    loc.biomes.forEach(b => biomes.add(b));
    biomeArea |= loc.biomeArea;
    distance[0] = Math.min(distance[0], loc.distance[0]);
    distance[1] = Math.max(distance[1], loc.distance[1]);
    altitude[0] = Math.min(altitude[0], loc.altitude[0]);
    altitude[1] = Math.max(altitude[1], loc.altitude[1]);
    terrainDelta[0] = Math.min(terrainDelta[0], loc.terrainDelta[0]);
    terrainDelta[1] = Math.max(terrainDelta[1], loc.terrainDelta[1]);
    needsKey = needsKey ?? loc.needsKey;
  }
  const result: LocationConfig = {
    typeId: typeId,
    id: typeId,
    type: locs[0]!.type,
    tier: Math.min(...locs.map(l => l.tier)),
    quantity,
    biomes: [...biomes],
    biomeArea,
    prioritized: locs.some(loc => loc.prioritized),
    centerFirst: locs.some(loc => loc.centerFirst),
    unique: locs.every(loc => loc.unique),
    group: locs.reduce((total, loc) => total || loc.group, ''),
    minApart: Math.min(...locs.map(loc => loc.minApart)),
    maxApart: Math.max(...locs.map(loc => loc.maxApart)),
    iconAlways: locs.every(loc => loc.iconAlways),
    iconPlaced: locs.every(loc => loc.iconPlaced),
    randomRotation: locs.some(loc => loc.randomRotation),
    slopeRotation: locs.every(loc => loc.slopeRotation),
    terrainDelta,
    inForest: null,
    distance,
    altitude,
    radius: [0, 0],
    destructibles: {},
    creatures: {},
    resources: {},
    customMusic: locs.reduce<string | undefined>((a, b) => a ?? b.customMusic, undefined),
    needsKey,
    items: [],
  };
  addDistToLocation(result, sumDist(total));
  computedLocations.set(typeId, result);
  return result;
}

export const locationsSorted: LocationConfig[] = [
  ...locations.filter(l => l.prioritized),
  ...locations.filter(l => !l.prioritized),
];
