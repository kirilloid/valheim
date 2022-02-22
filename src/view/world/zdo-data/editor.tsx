import React, { useContext } from 'react';

import type { GameComponent } from '../../../types';
import type { ZDO } from '../types';

import { data, extraData } from '../../../data/itemDB';
import { getId, keys, objects } from '../../../data/zdo';

import { InterfaceFields } from '../zdo-props';
import { ItemIcon } from '../../parts/Icon';
import { TranslationContext } from '../../../effects';

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

export const ItemEditor = React.memo(({ zdo, onChange }: { zdo: ZDO, onChange: (value: ZDO) => void, version: number }) => {
  const translate = useContext(TranslationContext);

  const currentId = objects.get(zdo.prefab);
  const item = currentId != null ? data[currentId] : undefined;
  const eComponents = getComponents(currentId);
  const components = eComponents.flatMap(cmp => InterfaceFields[cmp] ?? []);

  return <>
    <h2><ItemIcon item={item} /> {currentId && translate(currentId)}</h2>
    <dl>
      <dt>position</dt><dd>{zdo.position.x.toFixed(3)} / {zdo.position.z.toFixed(3)} / {zdo.position.y.toFixed(3)}</dd>
      <dt>zone</dt><dd>{zdo.sector.x} / {zdo.sector.y}</dd>
      {eComponents.length > 0
        ? components.map((C, i) => <C key={i} value={zdo} onChange={onChange} />)
        : <>
          <ZdoSpecialData data={zdo.floats} stringify={String} />
          <ZdoSpecialData data={zdo.vec3} stringify={v => `${v.x.toFixed(3)} / ${v.y.toFixed(3)} / ${v.z.toFixed(3)}`} />
          <ZdoSpecialData data={zdo.quats} stringify={v =>
            `x: ${v.x.toFixed(3)}, y: ${v.y.toFixed(3)}, z: ${v.z.toFixed(3)}, w: ${v.w.toFixed(3)}`} />
          <ZdoSpecialData data={zdo.ints} stringify={String} />
          <ZdoSpecialData data={zdo.longs} stringify={String} />
          <ZdoSpecialData data={zdo.strings} stringify={String} />
          <ZdoSpecialData data={zdo.byteArrays} stringify={arr => ([] as number[]).map.call(arr, v => v.toString(16).padStart(2, '0')).join('')} />
        </>}
    </dl>
  </>;
});
ItemEditor.displayName = 'ItemEditor';
