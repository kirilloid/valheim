import React, { useContext } from 'react';

import type { GameComponent } from '../../../types';
import type { ZDO } from '../types';

import { data, extraData } from '../../../data/itemDB';
import { getId, keys, prefabHashes } from '../../../data/zdo';

import { InterfaceFields } from '../zdo-props';
import { ItemIcon } from '../../parts/Icon';
import { TranslationContext } from '../../../effects';
import { flip, stableHashCode } from '../../../model/utils';
import { ValueProps } from '../../parts/types';
import { ContainedItemComp } from '../zdo-props/items';
import { List } from '../../helpers';
import { VirtualItem } from '../../../model/zdo-containers';

function ZdoSpecialData<T>(props: { data?: Map<number, T>, stringify: (value: T) => string }) {
  if (props == null) return null;
  const { data, stringify } = props;
  if (!data) return null;
  return <>{[...data.entries()]
    .map(([key, value]) => <React.Fragment key={key}>
      <dt>{getId(keys, key)}</dt><dd>{stringify(value)}</dd>
    </React.Fragment>)
  }</>;
}

function getComponents(id: string | undefined): GameComponent[] {
  if (id == null) return [];
  return (extraData[id] ?? []).concat(data[id]?.components ?? []);
}

const variantHash = stableHashCode('variant');

function Editor({ value: zdo, onChange, playersMap, index, components }: ValueProps<ZDO> & { playersMap: Map<bigint, string>; index: number; components: GameComponent[] }) {
  if (components.length === 0) {
    return <>
      <ZdoSpecialData data={zdo.floats} stringify={String} />
      <ZdoSpecialData data={zdo.vec3} stringify={v => `${v.x.toFixed(3)} / ${v.y.toFixed(3)} / ${v.z.toFixed(3)}`} />
      <ZdoSpecialData data={zdo.quats} stringify={v =>
        `x: ${v.x.toFixed(3)}, y: ${v.y.toFixed(3)}, z: ${v.z.toFixed(3)}, w: ${v.w.toFixed(3)}`} />
      <ZdoSpecialData data={zdo.ints} stringify={String} />
      <ZdoSpecialData data={zdo.longs} stringify={String} />
      <ZdoSpecialData data={zdo.strings} stringify={String} />
      <ZdoSpecialData data={zdo.byteArrays} stringify={arr => ([] as number[]).map.call(arr, v => v.toString(16).padStart(2, '0')).join('')} />
    </>
  }
  if (index > -1) {
    return <ContainedItemComp value={zdo} onChange={onChange} index={index} />
  }
  const editors = components.flatMap(cmp => InterfaceFields[cmp] ?? []);
  return <List separator="">{editors.map((C, i) => <C key={i} value={zdo} onChange={onChange} playersMap={playersMap} />)}</List>
}

export const ItemEditor = React.memo(({
  zdo,
  onChange,
  containerIndex,
  playersMap,
}: {
  zdo: ZDO,
  onChange: (value: ZDO) => void,
  containerIndex: number,
  version: number,
  playersMap: Map<bigint, string>
}) => {
  const translate = useContext(TranslationContext);

  const currentId = prefabHashes.get(zdo.prefab);
  const item = currentId != null ? data[currentId] : undefined;
  const components = getComponents(currentId);
  const vItem = VirtualItem(zdo, containerIndex, onChange);

  return <>
    <h2>{
      vItem
      ? <><ItemIcon item={data[vItem.id]} variant={vItem.variant} /> {translate(vItem.id)} (<ItemIcon item={item} />)</>
      : <><ItemIcon item={item} variant={zdo.ints.get(variantHash)} /> {currentId && translate(currentId)}</>
    }</h2>
    <dl>
      <dt>position</dt><dd>{zdo.position.x.toFixed(3)} / {zdo.position.z.toFixed(3)} / {zdo.position.y.toFixed(3)}</dd>
      {Math.abs(zdo.rotation.x) > 0.5 && components.includes('Ship') && <>
        <dt>Warning</dt>
        <dd>
          Ship seems to be turned over <button className="btn btn--primary" onClick={() => {
            zdo.rotation = flip(zdo.rotation);
            onChange(zdo);
          }}>flip</button> it back
        </dd>
      </>}
      <dt>zone</dt><dd>{zdo.sector.x} / {zdo.sector.y}</dd>
      <Editor value={zdo} onChange={onChange} playersMap={playersMap} components={components} index={containerIndex} />
    </dl>
  </>;
});
ItemEditor.displayName = 'ItemEditor';
