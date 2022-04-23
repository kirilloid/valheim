import React, { useContext, useEffect, useRef, useState } from 'react';
import { defaultMemoize, createSelector } from 'reselect';

import '../../../css/ZdoData.css';

import type { ValueProps } from '../../parts/types';
import type { ZDOData } from '../types';

import { EMPTY_RESULT, getSearcher, SearchEntry } from '../../../model/zdo-selectors';

import { PanView } from '../../parts/PanView';
import { TranslationContext } from '../../../effects';
import { ZdoLike, ZdoMap } from './map';
import { ItemEditor } from './editor';
import { lerp, lerpStep } from '../../../model/utils';

const getItems = createSelector<{ zdos: ZdoLike[], indices: number[] }, ZdoLike[], number[], ZdoLike[]>(
  obj => obj.zdos,
  obj => obj.indices,
  (zdos, indices) => indices.map(i => zdos[i]!),
);

function MapUI({ zdos, selected, current }: { zdos: ZdoLike[]; selected: ZdoLike[]; current?: ZdoLike }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [progress, setProgress] = useState<number | undefined>(0);
  const outerRef = useRef<HTMLDivElement>(null);
  const t = lerpStep(1, 3, Math.log10(selected.length));
  const markerSize = lerp(8, 3, t);
  
  useEffect(() => {
    outerRef.current?.style.setProperty('--marker-size', `${markerSize}px`);
  }, [markerSize])

  return <>
    <div ref={outerRef} style={{ width: 329, height: 329, position: 'relative', border: '1px solid var(--color-text)' }}>
      <PanView onMouseMove={setPos}>
        <ZdoMap zdos={zdos} selected={selected} current={current} markerSize={markerSize} onProgress={setProgress} />
      </PanView>
      {progress != null && <progress max={zdos.length} value={progress} className="Map__progress" />}
    </div>
    <div>x: {Math.round((pos.x - 1312) * 8)} y: {Math.round((1312 - pos.y) * 8)}</div>
  </>;
}

const getSearcherCached = defaultMemoize(getSearcher);

export const ZdoData = React.memo(function ZdoData(props: ValueProps<ZDOData>) {
  const translate = useContext(TranslationContext);
  const zdos = props.value.zdos;
  const [entry, setEntry] = useState<SearchEntry | undefined>();
  const [term, setTerm] = useState('');
  const [index, setIndex] = useState(0); // last mile
  const [version, setVersion] = useState(0);

  const zdoSearcher = getSearcherCached(zdos, translate);
  const searchIndices = entry?.indices ?? EMPTY_RESULT;
  const searchIndex = searchIndices[index];
  const zdo = searchIndex ? zdos[searchIndex.item] : undefined;

  return <div className="ZdoData">
    <div className="ZdoData__Map">
      <MapUI zdos={zdos} selected={getItems({ zdos, indices: searchIndices.map(i => i.item) })} current={zdo} />
    </div>
    <div className="ZdoData__Selector">
      {entry
        ? <span>{entry.text} <button className="btn" onClick={() => setEntry(undefined)}>&times;</button></span>
        : <>
            <input value={term} onChange={e => setTerm(e.target.value)}/>
            <ul style={{ position: 'absolute' }}>
              {zdoSearcher(term).map(se => <li key={se.id} onClick={() => {
                setTerm('');
                setEntry(se);
              }}>
                {se.text}
              </li>)}
            </ul>
          </>
      }
      {searchIndices.length > 1 && <>
        {searchIndices.length > 1000 && <><br/><em>Only first 1000 objects are listed</em></>}
        <br />
        <select onChange={e => {
          setIndex(+e.target.value);
        }} value={index}>
          {searchIndices.slice(0, 1000).map((globalIdx, typeIdx) => {
            const item = zdos[globalIdx.item]!;
            return <option key={`${globalIdx.item}_${globalIdx.container}`} value={typeIdx}>
              {item.position.x.toFixed(3)} / {item.position.z.toFixed(3)}
              {globalIdx.container > -1 ? ` [${globalIdx.container}]` : null}
            </option>
          })}
        </select>
      </>}
    </div>
    {zdo != null && searchIndex != null && <div className="ZdoData__Editor">
      <ItemEditor
        value={zdo}
        onChange={() => {
          setVersion(version + 1);
          props.onChange(props.value);
        }}
        containerIndex={searchIndex.container}
        version={version}
      />
      <hr style={{ width: '100%' }} />
      <section>
        <button className="btn btn--danger"
          onClick={() => {
            const newValue = {
              ...props.value,
              zdos: zdos.filter((_, i) => i !== index),
            };
            if (searchIndices.length === 1) {
              setEntry(undefined);
              setIndex(0);
            } else if (index + 1 === searchIndices.length) {
              setIndex(index - 1);
            }
            props.onChange(newValue);
          }}>
          Delete object
        </button>
      </section>
    </div>}
  </div>;
});
