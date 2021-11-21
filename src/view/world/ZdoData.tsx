import React, { useContext, useState } from 'react';

import { prefabNames } from '../../data/prefabs';
import { TranslationContext } from '../../effects';
import { crc32, stableHashCode } from '../../model/utils';
// import type { ValueProps } from '../parts/types';
import type { ZDOData, ZDO } from './types';

const buildHashMap = (values: string[]) => new Map(values.map(key => [stableHashCode(key), key]));

const hashToIdMap = buildHashMap(prefabNames);
const getId = (map: Map<number, string>, hash: number): string => map.get(hash) ?? `!unknown_${(hash >>> 0).toString(16).padStart(8, '0')}`;

const specialKeys = buildHashMap([
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
  'LeftItem', 'LeftItemVariant', 'LeftBackItem', 'LeftBackItemVariant',
  'RightBackItem', 'ChestItem', 'LegItem', 'HelmetItem',
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
  specialKeys.set(hash, name);
}

export function ZdoSpecialData<T>(props: { data?: Map<number, T>, stringify: (value: T) => string }) {
  if (props == null) return null;
  const { data, stringify } = props;
  if (!data) return null;
  return <>{[...data.entries()]
    .map(([key, value]) => <React.Fragment key={key}>
      <dt>{getId(specialKeys, key)}</dt><dd>{stringify(value)}</dd>
    </React.Fragment>)
  }</>;
}

export function ZdoData({ value: { zdos } }: { value: ZDOData }) {
  const translate = useContext(TranslationContext);
  const zdoGroups = new Map<string, ZDO[]>();
  const [currentId, setCurrentId] = useState('');
  const [index, setIndex] = useState(0);
  for (const zdo of zdos) {
    const id = getId(hashToIdMap, zdo.prefab);
    if (zdoGroups.has(id)) {
      zdoGroups.get(id)!.push(zdo);
    } else {
      zdoGroups.set(id, [zdo]);
    }
  }
  const currentItems = zdoGroups.get(currentId) ?? [];
  const currentItem = currentItems[index];

  return <>
    <select onChange={e => {
      setCurrentId(e.target.value);
      setIndex(0);
    }} value={currentId}>
      <option value="">All ({zdos.length})</option>
      {[...zdoGroups.entries()]
        .sort((a, b) => translate(a[0]).localeCompare(translate(b[0])))
        .map(([id, items]) => <option key={id} value={id}>
          {translate(id)} ({items.length})
        </option>)}
    </select><br/>
    {currentId !== "" && <>
      <select onChange={e => {
        setIndex(+e.target.value);
      }} value={index}>
        {currentItems.map((item, idx) => <option key={idx} value={idx}>
          {item.position.x.toFixed(3)} / {item.position.z.toFixed(3)}
        </option>)}
      </select><br />
    </>}
    {currentItem != null && <dl>
      <dt>position</dt><dd>{currentItem.position.x} / {currentItem.position.z}</dd>
      <dt>sector</dt><dd>{currentItem.sector.x} / {currentItem.sector.y}</dd>
      <ZdoSpecialData data={currentItem.floats} stringify={String} />
      <ZdoSpecialData data={currentItem.vec3} stringify={v => `${v.x.toFixed(3)} / ${v.z.toFixed(3)}`} />
      <ZdoSpecialData data={currentItem.quats} stringify={v =>
        `x: ${v.x.toFixed(3)}, y: ${v.y.toFixed(3)}, z: ${v.z.toFixed(3)}, w: ${v.w.toFixed(3)}`} />
      <ZdoSpecialData data={currentItem.ints} stringify={String} />
      <ZdoSpecialData data={currentItem.strings} stringify={String} />
      <ZdoSpecialData data={currentItem.byteArrays} stringify={arr => ([] as number[]).map.call(arr, v => v.toString(16).padStart(2, '0')).join('')} />
    </dl>}
  </>;
}
