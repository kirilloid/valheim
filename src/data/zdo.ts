import React from 'react';

import type { ZDO } from '../file/World';

import * as Inventory from '../file/Inventory';
import * as LiquidData from '../file/LiquidData';
import { PackageReader, PackageWriter } from '../file/Package';
import { crc32, stableHashCode } from '../model/utils';
import { prefabNames } from './prefabs';

const buildHashMap = (values: string[]) => new Map(values.map(key => [stableHashCode(key), key]));

type Lens<T, R> = [read: (arg: T) => R | undefined, write: (arg: T, val: R) => T];
function combine<A, B, C>(a: Lens<A, B>, b: Lens<B, C>): Lens<A, C>;
function combine<A, B, C, D>(a: Lens<A, B>, b: Lens<B, C>, c: Lens<C, D>): Lens<A, D>;
function combine<A, B, C, D, E>(a: Lens<A, B>, b: Lens<B, C>, c: Lens<C, D>, d: Lens<D, E>): Lens<A, E>;
function combine<A, B, C, D, E, F>(a: Lens<A, B>, b: Lens<B, C>, c: Lens<C, D>, d: Lens<D, E>, e: Lens<E, F>): Lens<A, F>;
function combine<T>(...lenses: Lens<T, T>[]): Lens<T, T> {
  return lenses.reduceRight(([read0, write0], [read1, write1]) => [
    a => {
      const b = read0(a);
      return b == null ? undefined : read1(b);
    },
    (a, c) => {
      const b = read0(a);
      if (b == null) return a;
      return write0(a, write1(b, c));
    },
  ]);
};

const converter = <T, R>(fn: (arg: T) => R, inv: (arg: R) => T): Lens<T, R> => [fn, (_, v) => inv(v)];

const zdoMap = <T>(reader: (zdo: ZDO) => Map<number, T>): Lens<ZDO, Map<number, T>> => [reader, v => v];
const map = <T>(key: number): Lens<Map<number, T>, T> => [
  map => map.get(key),
  (map, val) => {
    if (val != null) map.set(key, val);
    return map;
  },
];

interface ZDOPropperty<T> {
  read(zdo: ZDO): T;
  write(zdo: ZDO, value: T): void;
  show(value: T): React.ReactNode | string;
}

function base<Key extends string, T extends Object>(
  fieldName: Key,
  hashFn: (arg: string) => number,
  getMap: (zdo: ZDO) => Map<number, T>,
  defaultValue: T,
  show: (arg: T) => React.ReactNode | string = (arg: T) => arg.toString(),
): ZDOPropperty<T> {
  const hash = hashFn(fieldName);
  return {
    read(zdo: ZDO): T {
      return getMap(zdo).get(hash) ?? defaultValue;
    },
    write(zdo: ZDO, value: T): void {
      getMap(zdo).set(hash, value);
    },
    show,
  };
}

function baseP<Key extends string, T, R extends Object = T>(
  fieldName: Key,
  hashFn: (arg: string) => number,
  getMap: (zdo: ZDO) => Map<number, T>,
  defaultValue: R,
  unpack: (arg: T) => R,
  pack: (arg: R) => T,
  show: (arg: R) => React.ReactNode | string = (arg: R) => arg.toString(),
): ZDOPropperty<R> {
  const hash = hashFn(fieldName);
  return {
    read(zdo: ZDO): R {
      const val = getMap(zdo).get(hash);
      return val == null ? defaultValue : unpack(val);
    },
    write(zdo: ZDO, value: R): void {
      getMap(zdo).set(hash, pack(value));
    },
    show,
  };
}

const boolProp = (key: string, hashFn = stableHashCode) => combine(
  zdoMap(zdo => zdo.ints),
  map(hashFn(key)),
  converter(v => v === 1, v => v ? 1 : 0),
);

const intProp = (key: string, hashFn = stableHashCode) => combine(
  zdoMap(zdo => zdo.ints),
  map(hashFn(key)),
);

const floatProp = (key: string, hashFn = stableHashCode) => combine(
  zdoMap(zdo => zdo.floats),
  map(hashFn(key)),
);

const stringProp = (key: string, hashFn = stableHashCode) => combine(
  zdoMap(zdo => zdo.strings),
  map(hashFn(key)),
);

const idProp = (key: string, hashFn = stableHashCode) => combine(
  zdoMap(zdo => zdo.longs),
  map(hashFn(key)),
);

const vectorProp = (key: string, hashFn = stableHashCode) => combine(
  zdoMap(zdo => zdo.vec3),
  map(hashFn(key)),
);
// const ZERO_VECTOR = { x: 0, y: 0, z: 0, };
// v => `${v.x.toFixed(3)} / ${v.y.toFixed(3)} / ${v.z.toFixed(3)}`,

const quaternionProp = (key: string, hashFn = stableHashCode) => combine(
  zdoMap(zdo => zdo.quats),
  map(hashFn(key)),
);
// const QUATERNION_IDENTITY = { x: 0, y: 0, z: 0, w: 1 };
// v => `${v.x.toFixed(3)} / ${v.y.toFixed(3)} / ${v.z.toFixed(3)} / ${v.w.toFixed(3)}`,

const VALHEIM_DATE = new Date(Date.UTC(2021, 1, 6, 9));
const timeProp = (key: string, hashFn = stableHashCode) => combine(
  zdoMap(zdo => zdo.longs),
  map(hashFn(key)),
  converter(
    ticks => new Date(Number((ticks ?? BigInt(0)) / BigInt(10000))),
    date => date ? BigInt(date.getTime()) : BigInt(0)
  ),
);

const hashedItemProp = (key: string, hashFn = stableHashCode) => combine(
  zdoMap(zdo => zdo.strings),
  map(hashFn(key)),
  converter(
    str => str ? stableHashCode(str) : 0,
    hash => hash && objects.get(hash) || '',
  )
);

const encoder = new TextEncoder();
const decoder = new TextDecoder();

const base64 = <T>(
  reader: (pkg: PackageReader) => T,
  writer: (pkg: PackageWriter, value: T) => void,
): Lens<string, T> => converter(
  (value: string): T => {
    const binaryStr = btoa(value);
    const bytes = encoder.encode(binaryStr);
    const pkg = new PackageReader(bytes);
    return reader(pkg);
  },
  (value: T): string => {
    const pkg = new PackageWriter();
    writer(pkg, value);
    const bytes = pkg.flush();
    return atob(decoder.decode(bytes));
  }
);


const itemsProp = (key: string, hashFn = stableHashCode) => combine(
  zdoMap(zdo => zdo.strings),
  map(hashFn(key)),
  base64(Inventory.read, Inventory.write),
);

type CookingStatus = 'raw' | 'cooked' | 'burnt' | 'none';
const cookingStatus: CookingStatus[] = ['raw', 'cooked', 'burnt'];
const cookingStatusProp = (key: string, hashFn = stableHashCode) => combine(
  zdoMap(zdo => zdo.ints),
  map(hashFn(key)),
  converter(
    val => val == null ? 'none' : cookingStatus[val] ?? 'none',
    val => cookingStatus.indexOf(val),
  )
);

const liquidProp = (key: string, hashFn = stableHashCode) => combine(
  zdoMap(zdo => zdo.byteArrays),
  map(hashFn(key)),
  converter(LiquidData.read, LiquidData.write),
);

const rockHealthProp = (key: string, hashFn = stableHashCode) => combine(
  zdoMap(zdo => zdo.strings),
  map(hashFn(key)),
  base64(
    pkg => pkg.readArray(pkg.readFloat),
    (pkg, value) => pkg.writeArray(pkg.writeFloat, value),
  ),
);

type PrivateAreaPlayers = { id: bigint, name: string };
const privateAreaLens: Lens<ZDO, PrivateAreaPlayers[]> = [
  (zdo) => {
    const length = zdo.ints.get(stableHashCode('permitted')) ?? 0;
    const pairs = [];
    for (let i = 0; i < length; i++) {
      const id = zdo.longs.get(stableHashCode(`pu_id${i}`))!;
      const name = zdo.strings.get(stableHashCode(`pu_name${i}`))!;
      pairs.push({ id, name });
    }
    return pairs;
  },
  (zdo, players) => {
    const length = players.length;
    zdo.ints.set(stableHashCode('permitted'), length);
    for (const [i, player] of players.entries()) {
      zdo.longs.set(stableHashCode(`pu_id${i}`), player.id);
      zdo.strings.set(stableHashCode(`pu_name${i}`), player.name);
    }
    return zdo;
  },
];

const queueLens: Lens<ZDO, string[]> = [
  (zdo) => {
    const length = zdo.ints.get(stableHashCode('queued')) ?? 0;
    const items = [];
    for (let i = 0; i < length; i++) {
      const item = zdo.strings.get(stableHashCode(`item${i}`))!;
      items.push(item);
    }
    return items;
  },
  (zdo, items) => {
    const length = items.length;
    zdo.ints.set(stableHashCode('queued'), length);
    for (const [i, item] of items.entries()) {
      zdo.strings.set(stableHashCode(`item${i}`), item);
    }
    return zdo;
  },
];

const InterfaceFields = {
  BaseAI: [
    boolProp('huntplayer'),
    vectorProp('spawnpoint'),
    vectorProp('patrolPoint'),
    vectorProp('patrol'),
    timeProp('spawntime'),
    timeProp('lastWorldTime'),
    boolProp('haveTarget'),
    boolProp('alert'),
  ],
  Bed: [idProp('owner'), stringProp('ownerName')],
  Beehive: [
    timeProp('lastTime'),
    intProp('level'),
    floatProp('product'),
  ],
  Character: [
    floatProp('max_health'),
    floatProp('noise'),
    intProp('level'),
    quaternionProp('tiltrot'),
    vectorProp('BodyVelocity'),
  ],
  Container: [
    boolProp('addedDefaultItems'),
    boolProp('InUse'),
    itemsProp('items'),
  ],
  CookingStation: [
    timeProp('StartTime'),
    'fuel',
    ...[0, 1, 2, 3, 4].flatMap(idx => [
      stringProp(`slot${idx}`),
      floatProp(`slot${idx}`),
      cookingStatusProp(`slotstatus${idx}`),
    ]),
  ],
  Corpse: [timeProp('timeOfDeath')],
  CreatureSpawner: [timeProp('alive_time'), /*zdoIdProp('spawn_id')*/],
  Door: [intProp('state')],
  DropItem: [timeProp('SpawnTime')],
  DungeonGenerator: ['rooms', 'room<num>', 'room<num>_pos', 'room<num>_rot',],
  Fermenter: ['Content', 'StartTime',],
  Fireplace: [floatProp('fuel'), timeProp('lastTime')],
  Fish: [vectorProp('spawnpoint'),],
  // FishingFloat: ['RodOwner', 'CatchID',],
  // Human: ['IsBlocking',],
  ItemDrop: [
    floatProp('durability'),
    intProp('stack'),
    intProp('quality'),
    intProp('variant'),
    idProp('crafterID'),
    stringProp('crafterName'),
  ],
  ItemStand: [stringProp('item')],
  Leviathan: [intProp('submerged')],
  LiquidVolume: [liquidProp('LiquidData')],
  LocationProxy: [intProp('location'), intProp('seed'),],
  LootSpawner: [timeProp('spawn_time'),],
  // MapTable: ['data',],
  MineRock: ['Health<num>',],
  MineRock5: [rockHealthProp('health')],
  MonsterAI: [
    boolProp('DespawnInDay'),
    boolProp('EventCreature'),
    boolProp('sleeping'),
  ],
  Pickable: [boolProp('picked'), timeProp('picked_time')],
  PickableItem: [
    hashedItemProp('itemPrefab'),
    intProp('itemStack'),
  ],
  Piece: [idProp('creator')],
  Plant: [timeProp('plantTime')],
  Player: [
    // 'emoteID', 'emote', 'emote_oneshot',
    floatProp('Stealth'),
    floatProp('stamina'),
    boolProp('DebugFly'),
    idProp('playerID'),
    stringProp('playerName'),
    boolProp('wakeup'),
    boolProp('dead'),
    boolProp('dodgeinv'),
    intProp('baseValue'),
    boolProp('pvp'),
  ],
  PrivateArea: [privateAreaLens],
  Procreation: [intProp('lovePoints'), boolProp('pregnant')],
  // Ragdoll: ['Hue', 'Saturation', 'Value', 'InitVel', 'drops', 'drop_hash<num>', 'drop_amount<num>',],
  // RandomAnimation: ['<name>', 'RA_<name>',],
  RandomFlyingBird: [vectorProp('spawnpoint'), boolProp('landed'),],
  Saddle: [idProp('user'), floatProp('stamina'),],
  SE_Man: [intProp('seAttrib')], // ColdResistance = 1, DoubleImpactDamage = 2, SailingPower = 4,
  Ship: [
    floatProp('rudder'),
    intProp('forward'), // Stop, Back, Slow, Half, Full,
  ],
  ShipConstructor: [timeProp('spawntime'), boolProp('done'),],
  Sign: [stringProp('text'),],
  // Spawner: ['<b_|e_><creature><num>',],
  Smelter: [
    floatProp('fuel'),
    floatProp('accTime'),
    floatProp('bakeTimer'),
    timeProp('StartTime'),
    stringProp('SpawnOre'),
    intProp('SpawnAmount'),
    queueLens,
  ],
  Tameable: [
    stringProp('TamedName'),
    floatProp('TameTimeLeft'),
    timeProp('TameLastFeeding'),
    boolProp('HaveSaddle'),
  ],
  // Teleport: ['target',], ZDOID
  TerrainCompiler: ['TCData',],
  Tombstone: ['timeOfDeath', 'SpawnPoint',],
  TreeBase: [floatProp('health')],
  VisEquipment: [
    intProp('ModelIndex'),
    vectorProp('SkinColor'),
    vectorProp('HairColor'),
    hashedItemProp('RightItem'), intProp('RightItemVariant'),
    hashedItemProp('RightBackItem'), intProp('RightBackItemVariant'),
    hashedItemProp('LeftItem'), intProp('LeftItemVariant'),
    hashedItemProp('LeftBackItem'), intProp('LeftBackItemVariant'),
    hashedItemProp('ChestItem'),
    hashedItemProp('LegItem'),
    hashedItemProp('HelmetItem'),
    hashedItemProp('ShoulderItem'), intProp('ShoulderItemVariant'),
    stringProp('BeardItem'),
    stringProp('HairItem'),
    hashedItemProp('UtilityItem'),
  ],
  WearNTear: [floatProp('health'), floatProp('support')],
  ZNetView: [vectorProp('scale')],
  ZSyncTransform: [
    vectorProp('vel'),
    vectorProp('scale'),
    vectorProp('body_vel'),
    vectorProp('body_avel'),
    vectorProp('relPos'),
    stringProp('attachJoint'),
    // zdoidProp('parentID'),
  ],
} as const;

export const keys = buildHashMap([
  // BaseAI
  'huntplayer', 'spawnpoint', 'patrolPoint', 'patrol', 'spawntime', 'lastWorldTime', 'haveTarget', 'alert',
  // Bed
  'owner', 'ownerName',
  // Beehive
  'product', 'level',
  // Character
  'max_health', 'noise', 'level', 'tiltrot', 'BodyVelocity',
  // Container
  'addedDefaultItems', 'InUse', 'items',
  // CookingStation
  'StartTime', 'fuel', 'slot0', 'slotstatus0', 'slot1', 'slotstatus1', 'slot2', 'slotstatus2', 'slot3', 'slotstatus3', 'slot4', 'slotstatus4',
  // Corpse
  'timeOfDeath',
  // CreatureSpawner
  'alive_time', 'spawn_id',
  // Door
  'state',
  // DropItem
  'SpawnTime',
  // DungeonGenerator
  'rooms', 'room<num>', 'room<num>_pos', 'room<num>_rot',
  // Fermenter
  'Content', 'StartTime',
  // Fireplace
  'fuel', 'lastTime',
  // Fisth
  'spawnpoint',
  // FishingFloat
  'RodOwner', 'CatchID',
  // Human
  'IsBlocking',
  // ItemDrop
  'durability', 'stack', 'quality', 'variant', 'crafterID', 'crafterName',
  // ItemStand
  'item',
  // Leviathan
  'submerged',
  // LiquidVolumne
  'LiquidData',
  // LocationProxy
  'location', 'seed',
  // LootSpawner
  'spawn_time',
  // MapTable
  'data',
  // MineRock
  'Health<num>',
  // MineRock5
  'health', // base64 float array
  // MonsterAI
  'DespawnInDay', 'EventCreature', 'sleeping',
  // Pickable
  'picked', 'picked_time',
  // PickableItem
  'itemPrefab', 'itemStack',
  // Piece
  'creator',
  // Plant
  'plantTime',
  // Player
  'Stealth', 'stamina', 'emoteID', 'emote', 'emote_oneshot', 'baseValue',
  // PrivateArea
  'permitted', 'pu_id<num>', 'pu_name<num>',
  // Procreation
  'lovePoints', 'pregnant',
  // Ragdoll
  'Hue', 'Saturation', 'Value', 'InitVel', 'drops', 'drop_hash<num>', 'drop_amount<num>',
  // RandomAnimation
  '<name>', 'RA_<name>',
  // RandomFlyingBird
  'spawnpoint', 'landed',
  // Saddle
  'user', 'stamina',
  // SE_Man
  'seAttrib',
  // Ship
  'rudder', 'forward',
  // ShipConstructor
  'spawntime', 'done',
  // Sign
  'text',
  // Spawner
  '<b_|e_><creature><num>',
  // Smelter
  'accTime', 'bakeTimer', 'SpawnAmount', 'SpawnOre', 'queued', 'item<num>',
  // Tameable
  'TameTimeLeft', 'HaveSaddle', 'TamedName', 'TameLastFeeding',
  // Teleport
  'target',
  // TerrainCompiler
  'TCData',
  // Tombstone
  'timeOfDeath', 'SpawnPoint',
  // TreeBase
  'health',
  // VisEquipment
  'ModelIndex', 'SkinColor', 'HairColor',
  'RightItem', 'RightItemVariant',
  'RightBackItem', 'RightBackItemVariant',
  'LeftItem', 'LeftItemVariant',
  'LeftBackItem', 'LeftBackItemVariant',
  'ChestItem', 'LegItem', 'HelmetItem',
  'ShoulderItem', 'ShoulderItemVariant',
  'BeardItem', 'HairItem', 'UtilityItem', 
  // WearNTear
  'health', 'support',
  // ZNetView
  'scale',
  // ZSyncTransform
  'vel', 'scale', 'body_vel', 'body_avel', 'relPos', 'attachJoint', 'parentID',
]);

for (const name of ['alert', 'inWater', 'onGround', 'encumbered', 'flying', 'sleeping', 'equipping', 'blocking', 'crouching', 'intro', 'forward_speed', 'sideway_speed', 'turn_speed', 'statei', 'statef', 'flapping', 'crafting']) {
  const hash = (crc32(name) + 438569) & 0xFFFFFFFF;
  keys.set(hash, name);
}

export const objects = buildHashMap(prefabNames);
export const getId = (map: Map<number, string>, hash: number): string => map.get(hash) ?? `!unknown_${(hash >>> 0).toString(16).padStart(8, '0')}`;
