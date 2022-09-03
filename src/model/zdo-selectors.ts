import { defaultMemoize } from 'reselect';

import type { ZDO } from '../file/types';
import type { Biome as BiomeUnion, EntityId } from '../types';
import type { WorldData, ZoneSystemData } from '../file/World';

import { Vector2i } from './utils';
import { stableHashCode } from './hash';
import { WORLD_RADIUS, ZONE_SIZE } from './game';
import { WorldGenerator, Biome as BiomeEnum } from './world-generator';

import { getId, prefabHashes } from '../data/zdo';
import { data } from '../data/itemDB';
import { locationHashes } from '../data/location-hashes';
import { modPrefabNames } from '../data/prefabs';

import { readBase64 } from '../file/base64';
import { read } from '../file/Inventory';
import { match } from '../data/search';
import { locations } from '../data/location';
import { stripExtraData } from '../mods/epic-loot';

const locationHASH = stableHashCode('location');

const idPaths: Record<string, string[]> = {
  // visual
  // 'vfx_swamp_mist', 'vfx_firework_test', 'Flies', 'FireFlies',
  // 'BlackForestLocationMusic', 'FrostCavesShrineReveal', 'FrostCavesSanctumMusic',
  // 'ZoneCtrl',
  
  // terraforming
  // '_TerrainCompiler',
  // 'raise', 'digg', 'digg_v2', 'mud_road', // actually flatten
  // 'replant', 'cultivate', 'path', 'paved_road'
  ...Object.fromEntries(
    [
      'Haldor',
      'BossStone_Bonemass',
      'BossStone_DragonQueen', 'dragoneggcup',
      'BossStone_Eikthyr',
      'BossStone_TheElder',
      'BossStone_Yagluth', 'goblinking_totemholder',
      'RockFinger', 'RockFinger_frac',
      'RockFingerBroken', 'RockFingerBroken_frac',
      'RockThumb', 'RockThumb_frac',
    ].map(id => [id, ['unique']])
  ),
};

for (const [mod, prefabs] of Object.entries(modPrefabNames)) {
  for (const id of prefabs) {
    idPaths[id] = ['modded', mod, id];
  }
}

const HASH_ZONE_CTRL = stableHashCode('_ZoneCtrl');
const HASH_LOCATION = stableHashCode('LocationProxy');
const HASH_SEED = stableHashCode('seed');

export function zoneId({ x, y }: Vector2i) {
  return (y + 256) * 512 + x + 256;
}

const getZoneZdos = defaultMemoize((zdos: ZDO[]) => zdos.filter(zdo => zdo.prefab === HASH_ZONE_CTRL));

export const getZoneIds = (world: WorldData) => {
  const { zoneSystem } = world;
  if (zoneSystem != null) {
    return zoneSystem.generatedZones.map(zoneId);
  }
  return getZoneZdos(world.zdo.zdos).map(z => zoneId(z.sector));
}

// since active zone
export const getActiveZoneIds = (zdos: ZDO[]) => {
  const zones = getZoneZdos(zdos);
  const allZoneIds = new Set<number>(zones.map(zdo => zoneId(zdo.sector)));
  const activeZoneIds = new Set<number>();
  outer:
  for (const id of allZoneIds) {
    for (let dy = -2; dy <= 2; dy++) {
      for (let dx = -2; dx <= 2; dx++) {
        if (!allZoneIds.has(id + dx + dy * 512)) {
          continue outer;
        }
      }
    }
    activeZoneIds.add(id);
  }
  return activeZoneIds;
};

const OWNER = stableHashCode('owner');
const OWNER_NAME = stableHashCode('ownerName');

const CRAFTER_ID = stableHashCode('crafterID');
const CRAFTER_NAME = stableHashCode('crafterName');

export const getPlayers = (zdos: ZDO[]): Map<bigint, string> => {
  const map = new Map<bigint, string>();
  for (const zdo of zdos) {
    const objId = getId(prefabHashes, zdo.prefab);
    const components = data[objId]?.components;
    if (components?.includes('Bed')) {
      const id = zdo.longs.get(OWNER);
      const name = zdo.strings.get(OWNER_NAME);
      if (id != null && name != null) map.set(id, name);
    }
    if (components?.includes('ItemDrop')) {
      const id = zdo.longs.get(CRAFTER_ID);
      const name = zdo.strings.get(CRAFTER_NAME);
      if (id && name) map.set(id, stripExtraData(name));
    }
  }
  return map;
};

const LWT_HASH = stableHashCode('lastWorldTime');
export function* getMaxTime(zdos: ZDO[]): Generator<number, number, void> {
  let maxTime = 0;
  for (const [i, zdo] of zdos.entries()) {
    if ((i & 0xFFF) === 0) yield i / zdos.length;
    const id = prefabHashes.get(zdo.prefab);
    const obj = id != null ? data[id] : undefined;
    if (obj == null || obj.components?.includes('BaseAI')) continue;
    const ticks = zdo.longs.get(LWT_HASH);
    if (ticks == null) continue;
    const days = Number(ticks) / 1e7;
    maxTime = Math.max(maxTime, days);
  }
  yield 1;
  return maxTime;
};

export type SearchIndex = { item: number; container: number; };
export type SearchEntry = { id: string; text: string; subtype: string; indices: SearchIndex[] };

const itemsHash = stableHashCode('items');

export const EMPTY_RESULT: SearchIndex[] = [];

export const getSearcher = (
  zdos: ZDO[],
  translate: (arg: string) => string
): (term: string) => SearchEntry[] => {
  const idMap: Record<EntityId, SearchIndex[]> = {};
  function add(id: string, idx: number, cIdx: number) {
    if (idMap[id] == null) idMap[id] = [];
    idMap[id]?.push({ item: idx, container: cIdx });
  }
  for (const [i, zdo] of zdos.entries()) {
    const id = getId(prefabHashes, zdo.prefab);
    if (id === 'LocationProxy') {
      const locationHashed = zdo.ints.get(locationHASH) ?? 0;
      const location = locationHashes.get(locationHashed) ?? `_unknown_${(locationHashed >>> 0).toString(16)}`;
      const typeId = locations.find(loc => loc.id === location)?.typeId;
      if (typeId != null) {
        add(typeId, i, -1);
      } else {
        add(id, i, -1);
      }
    } else {
      add(id, i, -1);
      if (data[id]?.components?.includes('Container')) {
        const value = zdo.strings.get(itemsHash);
        const items = value ? read(readBase64(value)).items : [];      
        for (const [ci, { id }] of items.entries()) add(id, i, ci);
      }
      if (data[id]?.components?.includes('ArmorStand')) {
        for (const ci of [0, 1, 2, 3, 4, 5, 6]) {
          const id = zdo.strings.get(stableHashCode(`${i}_item`));
          if (id == null) continue;
          add(id, i, ci);
        }
      }
      if (data[id]?.components?.includes('ItemStand')) {
        const id = zdo.strings.get(stableHashCode('item'));
        if (id) add(id, i, 0);
      }
    }
  }
  return (term: string) => {
    const result: SearchEntry[] = [];
    for (const item of match(term)) {
      const indices = idMap[item.id];
      if (indices == null) continue;
      result.push({
        id: item.id,
        indices,
        subtype: item.type,
        text: translate(item.i18nKey),
      });
    }
    if ((term in idMap) && result.findIndex(r => r.id === term) === -1) {
      const indices = idMap[term]!;
      result.push({
        id: term,
        indices,
        subtype: 'custom',
        text: term,
      });
    }
    return result;
  }
};

function getWorldSeed(zdos: ZDO[]) {
  for (const zdo of zdos) {
    if (zdo.prefab === HASH_LOCATION) {
      const locationSeed = zdo.ints.get(HASH_SEED);
      if (locationSeed == null) continue;
      const { x, y } = zdo.sector;
      return (locationSeed - x * 4271 - y * 9187) | 0;    
    }
  }
}

export type DiscoveryStat = { zoneIds: Set<number>; total: number };
export type DiscoveryStats = Record<BiomeUnion, DiscoveryStat>;

export function* getGeneratedPercent(
  world: WorldData,
  resolutionStep: number
): Generator<number, DiscoveryStats | undefined, void> {
  const seed = getWorldSeed(world.zdo.zdos);
  if (seed == null) return undefined;
  const gen = new WorldGenerator(seed);
  const allZoneIds = new Set<number>(getZoneIds(world));

  const stats: DiscoveryStats = {
    Meadows: { zoneIds: new Set(), total: 0 },
    BlackForest: { zoneIds: new Set(), total: 0 },
    Ocean: { zoneIds: new Set(), total: 0 },
    Swamp: { zoneIds: new Set(), total: 0 },
    Mountain: { zoneIds: new Set(), total: 0 },
    Plains: { zoneIds: new Set(), total: 0 },
    Mistlands: { zoneIds: new Set(), total: 0 },
    Ashlands: { zoneIds: new Set(), total: 0 },
    DeepNorth: { zoneIds: new Set(), total: 0 },
  };

  let i = 0;
  for (let y = -164; y <= 164; y += resolutionStep) {
    for (let x = -164; x <= 164; x += resolutionStep) {
      if (x * x + y * y > 164 * 164) continue;
      const id = zoneId({ x, y });
      if ((i++ & 0xFF) === 0) yield (y + 164) / 328;
      if ((x * x + y * y) * ZONE_SIZE * ZONE_SIZE > WORLD_RADIUS * WORLD_RADIUS) continue;
      const biomeInt = gen.getBiome(x * ZONE_SIZE, y * ZONE_SIZE);
      const biomeStr = BiomeEnum[biomeInt] as BiomeUnion;
      stats[biomeStr].total++;
      if (allZoneIds.has(id)) {
        stats[biomeStr].zoneIds.add(id);  
      }
    }
  }
  return stats;
}

function removeFromZoneSystem(zoneSystem: ZoneSystemData | undefined, zoneIds: Set<number>): ZoneSystemData | undefined {
  if (zoneSystem == null) return undefined;
  const generatedZones = zoneSystem.generatedZones.filter(zone => !zoneIds.has(zoneId(zone)));
  return {
    ...zoneSystem,
    generatedZones,
  };
}

export function* removeZoneIds(value: WorldData, zoneIds: Set<number>): Generator<number, WorldData, void> {
  const zoneSystem = removeFromZoneSystem(value.zoneSystem, zoneIds);
  const zdos: ZDO[] = [];
  for (const [i, zdo] of value.zdo.zdos.entries()) {
    if ((i & 0xFFF) === 0) yield i / value.zdo.zdos.length;
    if (!zoneIds.has(zoneId(zdo.sector))) zdos.push(zdo);
  }
  return {
    ...value,
    zdo: { ...value.zdo, zdos },
    zoneSystem,
  };
}
