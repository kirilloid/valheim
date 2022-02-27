import { defaultMemoize } from 'reselect';

import type { ZDO } from '../file/types';
import type { Biome as BiomeUnion, Pair } from '../types';

import { assertNever, stableHashCode, Vector2i } from './utils';
import { WORLD_RADIUS, ZONE_SIZE } from './game';
import { WorldGenerator, Biome as BiomeEnum } from './world-generator';

import { getId, prefabHashes } from '../data/zdo';
import { data } from '../data/itemDB';
import { mapping } from '../data/mapping';
import { locationHashes } from '../data/location-hashes';
import { modPrefabNames } from '../data/prefabs';

import { WorldData } from '../file/World';
import { locations } from '../data/location';

const locationHASH = stableHashCode('location');
const creatorHASH = stableHashCode('creator');

const idPaths: Record<string, string[]> = {
  ...Object.fromEntries(
    [
      'vfx_swamp_mist', 'vfx_firework_test', 'Flies', 'FireFlies',
      'BlackForestLocationMusic', 'FrostCavesShrineReveal', 'FrostCavesSanctumMusic',
    ]
      .map(id => [id, ['visual / effects', id]])
  ),
  ...Object.fromEntries(
    ['_TerrainCompiler',
      'raise', 'digg', 'digg_v2', 'mud_road', // actually flatten
      'replant', 'cultivate', 'path', 'paved_road'
    ]
      .map(id => [id, ['terraforming']])
  ),
  ...Object.fromEntries(
    ['Raft', 'Karve', 'Longship', 'Cart']
      .map(id => [id, ['transport']])
  ),
  Player_tombstone: ['tomb'],
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
  _ZoneCtrl: ['zone'],
  TarLiquid: ['misc', 'TarLiquid'],
};

for (const [mod, prefabs] of Object.entries(modPrefabNames)) {
  for (const id of prefabs) {
    idPaths[id] = ['modded', mod, id];
  }
}

function getPath(id: string, zdo: ZDO): string[] {
  const paths = idPaths[id];
  if (paths != null) return paths; 
  if (id.startsWith('DG_')) return ['dungeon', id];
  if (id.startsWith('Trophy')) return ['trophy'];
  if (id.startsWith('Pickable_')) return ['resource', id];
  if (id === 'LocationProxy') {
    const locationHashed = zdo.ints.get(locationHASH) ?? 0;
    const location = locationHashes.get(locationHashed) ?? `_unknown_${(locationHashed >>> 0).toString(16)}`;
    const typeId = locations.find(loc => loc.id === location)?.typeId;
    return ['location', typeId ? `ui.location.${typeId}` : id];
  }
  const obj = data[id] ?? data[mapping.get(id) ?? ''];
  switch (obj?.type) {
    case 'object':
      return [obj.subtype, obj.id];
    case 'creature':
      return ['creature', obj.id];
    case 'item':
      return ['resource', id];
    case 'trophy':
    case 'weapon':
    case 'shield':
    case 'armor':
    case 'ammo':
    case 'tool':
      return ['item', id];
    case 'structure':
      return ['structures (world\'s)', id];
    case 'piece':
      const creator = zdo.longs.get(creatorHASH);
      return creator
        ? ['structures (player\'s)', id]
        : ['structures (world\'s)', id];
    case 'ship':
    case 'cart':
      return ['transport', id];
    case undefined:
      return ['_unknown', id];
    default:
      return assertNever(obj);
  }
}

type ZdoNode<T> = {
  type: 'node',
  total: number;
  children: Record<string, ZdoTree<T>>
}

type ZdoLeaf<T> = {
  type: 'leaf',
  total: number,
  children: T[],
};

export type ZdoTree<T> = ZdoNode<T> | ZdoLeaf<T>;

const createNode = <T,>(): ZdoNode<T> => ({
  type: 'node',
  total: 0,
  children: Object.create(null),
});

const createLeaf = <T,>(): ZdoLeaf<T> => ({ type: 'leaf', total: 0, children: [] });

const HASH_ZONE_CTRL = stableHashCode('_ZoneCtrl');
const HASH_LOCATION = stableHashCode('LocationProxy');

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

export const getTree = (zdos: ZDO[]) => {
  const root = createNode<number>();
  for (const [i, zdo] of zdos.entries()) {
    const id = getId(prefabHashes, zdo.prefab);
    if (id.startsWith('Spawner_')) continue;
    const path = getPath(id, zdo);
    let node = root;
    for (const [pi, part] of path.entries()) {
      node.total++;
      // leaf
      if (pi === path.length - 1) {
        const nextNode = node.children[part] ?? (node.children[part] = createLeaf<number>());
        if (nextNode.type === 'node') {
          console.error('Inconsistent path Expected leaf at ', path, ' got node');
          break;
        }
        nextNode.total++;
        nextNode.children.push(i);
      // node
      } else {
        const nextNode = node.children[part] ?? (node.children[part] = createNode<number>());
        if (nextNode.type === 'leaf') {
          console.error('Inconsistent path. Expected node at ', path.slice(0, i + 1), ', got leaf');
          break;
        }
        node = nextNode;
      }
    }
  }
  return root;
};

function getWorldSeed(zdos: ZDO[]) {
  for (const zdo of zdos) {
    if (zdo.prefab === HASH_LOCATION) {
      const locationSeed = zdo.ints.get(stableHashCode('seed'));
      if (locationSeed == null) return undefined;
      const { x, y } = zdo.sector;
      return (locationSeed - x * 4271 - y * 9187) | 0;    
    }
  }
}

export type DiscoveryStats = Record<BiomeUnion, Pair<number>>

export function getGeneratedPercent(world: WorldData, resolutionStep: number) {
  const seed = getWorldSeed(world.zdo.zdos);
  if (seed == null) return undefined;
  const gen = new WorldGenerator(seed);
  const allZoneIds = new Set<number>(getZoneIds(world));

  const stats: DiscoveryStats = {
    Meadows: [0, 0],
    BlackForest: [0, 0],
    Ocean: [0, 0],
    Swamp: [0, 0],
    Mountain: [0, 0],
    Plains: [0, 0],
    Mistlands: [0, 0],
    Ashlands: [0, 0],
    DeepNorth: [0, 0],
  };

  for (let y = -164; y <= 164; y += resolutionStep) {
    for (let x = -164; x <= 164; x += resolutionStep) {
      const id = zoneId({ x, y });
      if ((x * x + y * y) * ZONE_SIZE * ZONE_SIZE > WORLD_RADIUS * WORLD_RADIUS) continue;
      const biomeInt = gen.getBiome(x * ZONE_SIZE, y * ZONE_SIZE);
      const biomeStr = BiomeEnum[biomeInt] as BiomeUnion;
      stats[biomeStr][1]++;
      if (allZoneIds.has(id)) {
        stats[biomeStr][0]++;  
      }
    }
  }
  return stats;
}
