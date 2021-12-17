import React, { useContext, useState } from 'react';
import { defaultMemoize, createSelector } from 'reselect';

import type { ValueProps } from '../../parts/types';
import type { ZDOData, ZDO } from '../types';

import { getId, objects } from '../../../data/zdo';
import { TranslationContext } from '../../../effects';
import { PanView } from '../../parts/PanView';
import { ZdoMap } from './map';
import { ItemEditor } from './editor';

const getGroups = defaultMemoize((zdos: ZDO[]) => {
  const zdoGroups = new Map<string, number[]>();
  for (const [i, zdo] of zdos.entries()) {
    const id = getId(objects, zdo.prefab);
    if (zdoGroups.has(id)) {
      zdoGroups.get(id)!.push(i);
    } else {
      zdoGroups.set(id, [i]);
    }
  }
  return zdoGroups;
});

const getItems = createSelector<{ zdos: ZDO[], indices: number[] }, ZDO[], number[], ZDO[]>(
  obj => obj.zdos,
  obj => obj.indices,
  (zdos, indices) => indices.map(i => zdos[i]!),
);

export function ZdoData(props: ValueProps<ZDOData>) {
  const { zdos } = props.value;
  const translate = useContext(TranslationContext);
  const [currentId, setCurrentId] = useState('');
  const [index, setIndex] = useState(0);
  const [version, setVersion] = useState(0);

  const zdoGroups = getGroups(zdos);
  const currentItemIndices = zdoGroups.get(currentId) ?? [];
  const currentItemIndex = currentItemIndices[index];

  return <>
    <div style={{ float: 'right', width: 328, height: 328, border: '1px solid var(--color-text)' }}>
      <PanView>
        <ZdoMap zdos={zdos} selected={getItems({ zdos, indices: currentItemIndices })} />
      </PanView>
    </div>
    <select onChange={e => {
      setCurrentId(e.target.value);
      setIndex(0);
      setVersion(0);
    }} value={currentId}>
      <option value="">All ({zdos.length})</option>
      {[...zdoGroups.entries()]
        .sort((a, b) => translate(a[0]).localeCompare(translate(b[0])))
        .map(([id, items]) => <option key={id} value={id}>
          {translate(id)} ({items.length})
        </option>)}
    </select><br/>
    {currentId !== "" && <>
      {currentItemIndices.length > 1000 && <><em>Only first 1000 objects are listed</em><br/></>}
      <select onChange={e => {
        setIndex(+e.target.value);
        setVersion(0);
      }} value={index}>
        {currentItemIndices.slice(0, 1000).map((globalIdx, typeIdx) => {
          const item = zdos[globalIdx]!;
          return <option key={globalIdx} value={typeIdx}>
            {item.position.x.toFixed(3)} / {item.position.z.toFixed(3)}
          </option>
        })}
      </select>
      <br />
    </>}
    {currentItemIndex != null && <>
      <ItemEditor
        zdo={zdos[currentItemIndex]!}
        version={version}
        onChange={() => {
          setVersion(version + 1);
          props.onChange(props.value);
        }}
      />
      <hr style={{ width: '100%' }} />
      <section>
        <button className="btn btn--danger"
          onClick={() => {
            const newValue = {
              ...props.value,
              zdos: zdos.filter((_, i) => i !== currentItemIndex),
            };
            if (currentItemIndices.length === 1) {
              setCurrentId('');
              setIndex(0);
            } else if (index === currentItemIndices.length - 1) {
              setIndex(index - 1);
            } // else index is the same, it's ok to keep it as is
            props.onChange(newValue);
          }}>
          Delete object
        </button>
      </section>
    </>}
  </>;
}
