import React, { useContext, useLayoutEffect, useRef } from 'react';

import type { GameComponent, Piece } from '../../types';
import type { ZDO } from './types';
import { crc32, groupBy, stableHashCode as strHash } from '../../model/utils';

import { PackageReader } from '../../file/Package';
import * as Terrain from '../../file/TerrainComp';
import * as MapData from '../../file/MapData';
import { read as readInventory } from '../../file/Inventory';

import { TranslationContext } from '../../effects';
import { Color } from '../ColorEditor';
import { roomHashes } from '../../data/roomHashes';
import { locations } from '../../data/location';
import { objects } from '../../data/zdo';
import { data } from '../../data/itemDB';
import { getStructuralIntegrity } from '../../data/building';

const locationHashes = new Map<number, string>();
for (const loc of locations) {
  for (const variation of loc.variations) {
    const key = loc.id + variation.subtype;
    const hash = strHash(key);
    locationHashes.set(hash, key);
  }
}

function readBase64(base64: string): PackageReader {
  const binaryStr = atob(base64);
  const bytes = new Uint8Array(binaryStr.length);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = binaryStr.charCodeAt(i);
  }
  return new PackageReader(bytes);
}

const readonly = true;

const boolComp = (key: string, { readonly = false, hashFn = strHash } = {}) => {
  const hash = hashFn(key);
  return ({ zdo }: { zdo: ZDO }) => {
    const value = zdo.ints.get(hash) === 1;
    return <React.Fragment key={key}>
      <dt>{key}</dt>
      <dd><input type="checkbox" disabled={readonly} checked={value} onChange={e => zdo.ints.set(hash, e.target.checked ? 1 : 0)} /></dd>
    </React.Fragment>;
  };
};

const stringComp = (key: string) => ({ zdo }: { zdo: ZDO }) => {
  const hash = strHash(key);
  const str = zdo.strings.get(hash) ?? '';
  return <React.Fragment key={key}>
    <dt>{key}</dt>
    <dd><input type="text" value={str} onChange={e => zdo.strings.set(hash, e.target.value)} /></dd>
  </React.Fragment>;
};

const floatComp = (key: string, defaultReader?: (zdo: ZDO) => number) => {
  const hash = strHash(key);
  return ({ zdo }: { zdo: ZDO }) => {
    const defaultValue = defaultReader ? defaultReader(zdo) : 0;
    const value = zdo.floats.get(hash) ?? '';
    return <React.Fragment key={key}>
      <dt>{key}</dt>
      <dd>
        <input type="number"
          placeholder={String(defaultValue)}
          value={value}
          onChange={e => zdo.floats.set(hash, Number(e.target.value))} />
      </dd>
    </React.Fragment>;
  };
};

const intComp = (key: string, { readonly = false } = {}) => {
  const hash = strHash(key);
  return ({ zdo }: { zdo: ZDO }) => {
    const value = zdo.ints.get(hash) ?? '';
    return <React.Fragment key={key}>
      <dt>{key}</dt>
      <dd>{readonly
        ? value
        : <input type="number"
            value={value}
            onChange={e => zdo.ints.set(hash, Number(e.target.value))} />
      }</dd>
    </React.Fragment>;
  };
};

const enumComp = (key: string, options: [number, string][]) => {
  const hash = strHash(key);
  const htmlOptions = options.map(([value, text]) => <option value={value} key={value}>{text}</option>);
  return ({ zdo }: { zdo: ZDO }) => {
    const value = zdo.ints.get(hash) ?? '';
    return <React.Fragment key={key}>
      <dt>{key}</dt>
      <dd>
        <select value={value} onChange={e => zdo.ints.set(hash, Number(e.target.value))}>
          {htmlOptions}
        </select>
      </dd>
    </React.Fragment>;
  };
};

const idComp = (key: string) => ({ zdo }: { zdo: ZDO }) => {
  const hash = strHash(key);
  const value = zdo.longs.get(hash);
  return <React.Fragment key={key}>
    <dt>{key}</dt>
    <dd>{value ?? '—'}</dd>
  </React.Fragment>;
};

const SCALE = BigInt(10000000);
const DEFAULT = BigInt(0);
const timeComp = (key: string) => {
  const hash = strHash(key);
  return ({ zdo }: { zdo: ZDO }) => {
    const value = Number((zdo.longs.get(hash) ?? DEFAULT) / SCALE);
    return <React.Fragment key={key}>
      <dt>{key}</dt>
      <dd><input type="number" value={value} onChange={e => zdo.longs.set(hash, BigInt(e.target.value) * SCALE)} /></dd>
    </React.Fragment>;
  };
};

const vectorComp = (key: string) => {
  const hash = strHash(key);
  return ({ zdo }: { zdo: ZDO }) => {
    const vector = zdo.vec3.get(hash);
    return  <React.Fragment key={key}>
      <dt>{key}</dt>
      <dd>
        {vector != null && <>
          <label>x: <input type="number" value={vector.x} onChange={e => vector.x = +e.target.value} style={{ width: '5em' }} /></label>
          <label>y: <input type="number" value={vector.y} onChange={e => vector.y = +e.target.value} style={{ width: '5em' }} /></label>
          <label>z: <input type="number" value={vector.z} onChange={e => vector.z = +e.target.value} style={{ width: '5em' }} /></label>
        </>}
      </dd>
    </React.Fragment>;
  };
};

const colorComp = (key: string) => {
  const hash = strHash(key);
  return ({ zdo }: { zdo: ZDO }) => {
    const vector = zdo.vec3.get(hash) ?? { x: 1, y: 1, z: 1 };
    return <React.Fragment key={key}>
      <dt>{key}</dt>
      <dd><Color value={vector} onChange={val => zdo.vec3.set(hash, val)} /></dd>
    </React.Fragment>;
  };
};

const hashedItemComp = (key: string) => {
  const hash = strHash(key);
  return ({ zdo }: { zdo: ZDO }) => {
    const value = zdo.ints.get(hash) ?? 0;
    return <React.Fragment key={key}>
      <dt>{key}</dt>
      <dd>{objects.get(value)}</dd>
    </React.Fragment>;
  };
};

const hashedLocationComp = (key: string) => {
  const hash = strHash(key);
  return ({ zdo }: { zdo: ZDO }) => {
    const value = zdo.ints.get(hash) ?? 0;
    return <React.Fragment key={key}>
      <dt>{key}</dt>
      <dd>{locationHashes.get(value)}</dd>
    </React.Fragment>;
  };
};

const MapTableHash = strHash('data');
function MapTable({ zdo }: { zdo: ZDO }) {
  const bytes = zdo.byteArrays.get(MapTableHash);
  if (!bytes) return <><dt>explored</dt><dd>n/a</dd></>;
  const data = MapData.read(bytes);
  let total = 0;
  for (let byte of data.explored) {
    byte = (byte & 0x55) + ((byte >> 1) & 0x55);
    byte = (byte & 0x33) + ((byte >> 2) & 0x33);
    byte = (byte & 0x0F) + ((byte >> 4) & 0x0F);
    total += byte;
  }
  const percent = total / data.tileSize ** 2 / Math.PI * 4;
  return <><dt>explored</dt><dd>{Math.round(percent * 100)}%</dd></>;
}

const healthHash = strHash('health');
function RockHealthComp({ zdo }: { zdo: ZDO }) {
  const str = zdo.strings.get(healthHash);
  let values: number[] = [];
  if (str) {
    const pkg = readBase64(str);
    values = pkg.readArray(pkg.readFloat);
  }
  return <><dt>health</dt><dd>{values.map(Math.round).join(', ')}</dd></>;
}

const TerrainHash = strHash('TCData');
function TerrainComp({ zdo }: { zdo: ZDO }) {
  const bytes = zdo.byteArrays.get(TerrainHash);
  const data = bytes && Terrain.read(bytes);
  const ref = useRef<HTMLCanvasElement | null>();
  useLayoutEffect(() => {
    const ctx = ref.current?.getContext('2d');
    const imageData = data?.paintMask;
    if (ctx == null || imageData == null) return;
    ctx.putImageData(imageData, 0, 0);
  }, [data]);
  return <React.Fragment key="TCData">
    <dt>colored</dt>
    <dd><canvas width={64} height={64} ref={r => ref.current = r} /></dd>
  </React.Fragment>;
}

const itemsHash = strHash('items');
function ItemsComp({ zdo }: { zdo: ZDO }) {
  const translate = useContext(TranslationContext);
  const value = zdo.strings.get(itemsHash);
  const items = value ? readInventory(readBase64(value)).items : [];
  return <React.Fragment key="items">
    <dt>items</dt>
    <dd><ul>{items.map(item => <li>
      {item.stack}&times; {translate(item.id)}
    </li>)}</ul></dd>
  </React.Fragment>;
}

function RoomsComp({ zdo }: { zdo: ZDO }) {
  const length = zdo.ints.get(strHash('rooms')) ?? 0;
  const rooms = [];
  for (let i = 0; i < length; i++) {
    const room = roomHashes.get(zdo.ints.get(strHash(`room${i}`))!)!;
    const pos = zdo.vec3.get(strHash(`room${i}_pos`))!;
    const rot = zdo.quats.get(strHash(`room${i}_rot`))!;
    rooms.push({ room, pos, rot });
  }
  return <React.Fragment key="rooms">
    <dt>items</dt>
    <dd>{rooms.length} rooms</dd>
  </React.Fragment>;
};

function PrivateAreaComp({ zdo }: { zdo: ZDO }) {
  const length = zdo.ints.get(strHash('permitted')) ?? 0;
  const players = [];
  for (let i = 0; i < length; i++) {
    const id = zdo.longs.get(strHash(`pu_id${i}`))!;
    const name = zdo.strings.get(strHash(`pu_name${i}`))!;
    players.push({ id, name });
  }
  return <React.Fragment key="items">
    <dt>permissions</dt>
    <dd><ul>{players.map(player => <li key={String(player.id)}>{player.name}</li>)}</ul></dd>
  </React.Fragment>;
}

function SmelterQueueComp({ zdo }: { zdo: ZDO }) {
  const translate = useContext(TranslationContext);
  const length = zdo.ints.get(strHash('queued')) ?? 0;
  const items = [];
  for (let i = 0; i < length; i++) {
    items.push(zdo.strings.get(strHash(`item${i}`))!);
  }
  const groups = groupBy(items, x => x);
  return <React.Fragment key="queue">
    <dt>queue:</dt>
    <dd><ul>{Object.entries(groups).map(([key, list]) =>
      <li key={key}>{translate(key)} &times; {list.length}</li>)}</ul></dd>
  </React.Fragment>;
}

const HEALTH_HASH = strHash('health');
const SUPPORT_HASH = strHash('support');
function WearNTearComp({ zdo }: { zdo: ZDO }) {
  const id = objects.get(zdo.prefab);
  const pieceWear = id != null ? (data[id] as Piece | undefined)?.wear : undefined;
  const floats = zdo.floats;
  const material = pieceWear?.materialType;
  const support = material != null ? getStructuralIntegrity(material) : undefined;
  const maxHp = pieceWear?.hp ?? 100;
  return <React.Fragment key="WearNTear">
    <dt>health</dt>
    <dd>
      <input type="number"
        min="0"
        max={maxHp}
        placeholder={String(maxHp)}
        value={floats.get(HEALTH_HASH)}
        onChange={e => floats.set(HEALTH_HASH, Number(e.target.value))} />
    </dd>
    {support != null && <dt>support</dt>}
    {support != null && <dd>
      <input type="number"
        min={support.minSupport}
        max={support.maxSupport}
        placeholder={String(support.maxSupport)}
        value={floats.get(SUPPORT_HASH)}
        onChange={e => floats.set(SUPPORT_HASH, Number(e.target.value))} />
    </dd>}
  </React.Fragment>
}

export const InterfaceFields: Partial<Record<GameComponent, React.ComponentType<{ zdo: ZDO }>[]>> = {
  BaseAI: [
    boolComp('huntplayer'),
    vectorComp('spawnpoint'),
    vectorComp('patrolPoint'),
    boolComp('patrol'),
    timeComp('spawntime'),
    timeComp('lastWorldTime'),
    boolComp('haveTarget'),
    boolComp('alert'),
  ],
  Bed: [idComp('owner'), stringComp('ownerName')],
  Beehive: [
    timeComp('lastTime'),
    intComp('level'),
    floatComp('product'),
  ],
  Character: [
    floatComp('max_health'),
    floatComp('noise'),
    enumComp('level', [[1, '0*'], [2, '1*'], [3, '2*']]),
    // quaternionComp('tiltrot'),
    vectorComp('BodyVelocity'),
  ],
  Container: [
    boolComp('addedDefaultItems', { readonly }),
    // boolComp('InUse'),
    ItemsComp,
  ],
  CookingStation: [
    timeComp('StartTime'),
    floatComp('fuel'),
    ...[0, 1, 2, 3, 4].flatMap(idx => [
      stringComp(`slot${idx}`),
      floatComp(`slot${idx}`),
      enumComp(`slotstatus${idx}`, [[0, 'raw'], [1, 'cooked'], [2, 'burnt']]),
    ]),
  ],
  Corpse: [timeComp('timeOfDeath')],
  CreatureSpawner: [
    timeComp('alive_time'),
    // zdoidProp('spawn_id'),
  ],
  Destructible: [floatComp('health')],
  Door: [enumComp('state', [[1, 'opened'], [0, 'closed'], [-1, 'opened opposite']])],
  DungeonGenerator: [RoomsComp],
  Fermenter: [stringComp('Content'), timeComp('StartTime')],
  Fireplace: [floatComp('fuel'), timeComp('lastTime')],
  Fish: [vectorComp('spawnpoint'),],
  FishingFloat: [idComp('RodOwner'), hashedItemComp('CatchID')],
  Humanoid: [boolComp('IsBlocking')],
  ItemDrop: [
    timeComp('SpawnTime'),
    floatComp('durability'),
    intComp('stack'),
    intComp('quality'),
    intComp('variant'),
    idComp('crafterID'),
    stringComp('crafterName'),
  ],
  ItemStand: [stringComp('item')],
  Leviathan: [boolComp('submerged', { hashFn: crc32 })],
  // LiquidVolume: [liquidProp('LiquidData')],
  LocationProxy: [hashedLocationComp('location'), intComp('seed', { readonly })],
  // LootSpawner: [timeComp('spawn_time'),],
  MapTable: [MapTable],
  MineRock: [floatComp('Health'), floatComp('Health0')],
  MineRock5: [RockHealthComp],
  MonsterAI: [
    boolComp('DespawnInDay'),
    boolComp('EventCreature'),
    boolComp('sleeping'),
  ],
  Pickable: [boolComp('picked'), timeComp('picked_time')],
  PickableItem: [
    hashedItemComp('itemPrefab'),
    intComp('itemStack'),
  ],
  Piece: [idComp('creator')],
  Plant: [timeComp('plantTime')],
  Player: [
    // 'emoteID', 'emote', 'emote_oneshot',
    floatComp('Stealth'),
    floatComp('stamina'),
    boolComp('DebugFly'),
    idComp('playerID'),
    stringComp('playerName'),
    boolComp('wakeup'),
    boolComp('dead'),
    boolComp('dodgeinv'),
    intComp('baseValue', { readonly }),
    boolComp('pvp'),
  ],
  PrivateArea: [PrivateAreaComp],
  Procreation: [intComp('lovePoints'), boolComp('pregnant')],
  Ragdoll: [
    floatComp('Hue'),
    floatComp('Saturation'),
    floatComp('Value'),
    vectorComp('InitVel'),
    // dropLens,
  ],
  // RandomAnimation: ['<name>', 'RA_<name>',],
  RandomFlyingBird: [vectorComp('spawnpoint'), boolComp('landed'),],
  Saddle: [idComp('user'), floatComp('stamina'),],
  // SEMan: [maskComp('seAttrib')], // ColdResistance = 1, DoubleImpactDamage = 2, SailingPower = 4,
  Ship: [
    floatComp('rudder'),
    enumComp('forward', [[1, 'Back'], [0, 'Stop'], [2, 'Slow'], [3, 'Half'], [4, 'Full']]),
  ],
  ShipConstructor: [timeComp('spawntime'), boolComp('done'),],
  Sign: [stringComp('text')],
  // SpawnSystem: ['<b_|e_><creature><num>',],
  Smelter: [
    floatComp('fuel'),
    floatComp('accTime'),
    floatComp('bakeTimer'),
    timeComp('StartTime'),
    stringComp('SpawnOre'),
    intComp('SpawnAmount'),
    SmelterQueueComp,
  ],
  Tameable: [
    stringComp('TamedName'),
    floatComp('TameTimeLeft'),
    timeComp('TameLastFeeding'),
    boolComp('HaveSaddle'),
  ],
  // Teleport: [zdoidProp('target')],
  TeleportWorld: [stringComp('tag')],
  TerrainComp: [TerrainComp],
  Tombstone: [
    timeComp('timeOfDeath'),
    vectorComp('SpawnPoint'),
  ],
  TreeBase: [floatComp('health')],
  TreeLog: [floatComp('health')],
  VisEquipment: [
    intComp('ModelIndex', { readonly }),
    colorComp('SkinColor'),
    colorComp('HairColor'),
    hashedItemComp('RightItem'), // intComp('RightItemVariant'),
    hashedItemComp('RightBackItem'), intComp('RightBackItemVariant'),
    hashedItemComp('LeftItem'), intComp('LeftItemVariant'),
    hashedItemComp('LeftBackItem'), intComp('LeftBackItemVariant'),
    hashedItemComp('ChestItem'),
    hashedItemComp('LegItem'),
    hashedItemComp('HelmetItem'),
    hashedItemComp('ShoulderItem'), intComp('ShoulderItemVariant'),
    stringComp('BeardItem'),
    stringComp('HairItem'),
    hashedItemComp('UtilityItem'),
  ],
  WearNTear: [WearNTearComp],
  ZNetView: [vectorComp('scale')],
  ZSyncTransform: [
    vectorComp('vel'),
    vectorComp('scale'),
    vectorComp('body_vel'),
    vectorComp('body_avel'),
    vectorComp('relPos'),
    stringComp('attachJoint'),
    // zdoidProp('parentID'),
  ],
};

