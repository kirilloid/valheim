import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';

import { prefabNames } from '../../data/prefabs';
import { TranslationContext } from '../../effects';
import { stableHashCode } from '../../model/utils';
// import type { ValueProps } from '../parts/types';
import type { ZDOData, ZDO } from './types';

const buildHashMap = (values: string[]) => new Map(values.map(key => [stableHashCode(key), key]));

const hashToIdMap = buildHashMap(prefabNames);
const getId = (map: Map<number, string>, hash: number): string => map.get(hash) ?? `unknown_${(hash >>> 0).toString(16).padStart(8, '0')}`;

const specialKeys = buildHashMap([
  // uncategorized
  'health', 'location', 'seed',
  // BaseAI
  'huntplayer', 'spawnpoint', 'patrolPoint', 'patrol',
  // Container
  'addedDefaultItems', 'InUse', 'items',
  // Destructible
  'Health0',
  // Beehive
  'product',
  // Character
  'max_health', 'noise',
  // CookingStation
  'fuel', 'slot0', 'slotstatus0', 'slot1', 'slotstatus1', 'slot2', 'slotstatus2', 'slot3', 'slotstatus3', 'slot4', 'slotstatus4',
  // ItemDrop
  'durability', 'stack', 'quality', 'variant', 'crafterID', 'crafterName',
  // Player
  'Stealth', 'stamina',
  // Ragdoll
  'Hue', 'Saturation', 'Value',
  // Saddle
  'stamina',
  // Ship
  'rudder', 'forward',
  // Smelter
  'accTime', 'bakeTimer', 'queued',
  // Tameable
  'TameTimeLeft',
  // Tombstone
  'SpawnPoint',
  // WearNTear
  'support',
  // ZNetView
  'scale',
]);

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
      {[...zdoGroups.entries()].map(([id, items]) => <option key={id} value={id}>
        {translate(id)} ({items.length})
      </option>)}
    </select><br/>
    {currentId !== "" && <>
      <select onChange={e => {
        setIndex(+e.target.value);
      }} value={index}>
        {currentItems.map((item, idx) => <option key={idx} value={idx}>
          {item.position.x} / {item.position.z}
        </option>)}
      </select><br />
    </>}
    {currentItem != null && <dl>
      <dt>position</dt><dd>{currentItem.position.x} / {currentItem.position.z}</dd>
      <dt>sector</dt><dd>{currentItem.sector.x} / {currentItem.sector.y}</dd>
      <ZdoSpecialData data={currentItem.floats} stringify={String} />
      <ZdoSpecialData data={currentItem.vec3} stringify={v => `${v.x} / ${v.z}`} />
      <ZdoSpecialData data={currentItem.quats} stringify={JSON.stringify} />
      <ZdoSpecialData data={currentItem.ints} stringify={String} />
      <ZdoSpecialData data={currentItem.strings} stringify={String} />
      <ZdoSpecialData data={currentItem.byteArrays} stringify={arr => ([] as number[]).map.call(arr, v => v.toString(16).padStart(2, '0')).join('')} />
    </dl>}
  </>;
}
