import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { defaultMemoize, createSelector } from 'reselect';

import '../../../css/ZdoData.css';

import type { ValueProps } from '../../parts/types';
import type { ZDOData } from '../types';

import { EMPTY_RESULT, getSearcher, getPlayers, SearchEntry } from '../../../model/zdo-selectors';

import { PanView } from '../../parts/PanView';
import { TranslationContext } from '../../../effects';
import { ZdoLike, ZdoMap } from './map';
import { ItemEditor } from './editor';
import { lerp, lerpStep } from '../../../model/utils';
import classNames from 'classnames';

const getItems = createSelector<{ zdos: ZdoLike[], indices: number[] }, ZdoLike[], number[], ZdoLike[]>(
  obj => obj.zdos,
  obj => obj.indices,
  (zdos, indices) => indices.map(i => zdos[i]!),
);

function MapUI({ zdos, selected, current, size }: { zdos: ZdoLike[]; selected: ZdoLike[]; current?: ZdoLike; size: number }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [progress, setProgress] = useState<number | undefined>(0);
  const outerRef = useRef<HTMLDivElement>(null);
  const t = lerpStep(1, 3, Math.log10(selected.length));
  const markerSize = lerp(8, 3, t);
  
  useEffect(() => {
    outerRef.current?.style.setProperty('--marker-size', `${markerSize}px`);
  }, [markerSize])

  return <>
    <div ref={outerRef} style={{ width: size, height: size, position: 'relative', border: '1px solid var(--color-text)' }}>
      <PanView onMouseMove={setPos} size={size}>
        <ZdoMap zdos={zdos} selected={selected} current={current} markerSize={markerSize} onProgress={setProgress} />
      </PanView>
      {progress != null && <progress max={zdos.length} value={progress} className="Map__progress" />}
    </div>
    <div>x: {Math.round((pos.x - 1312) * 8)} y: {Math.round((1312 - pos.y) * 8)}</div>
  </>;
}

const getSearcherCached = defaultMemoize(getSearcher);
const getPlayersCached = defaultMemoize(getPlayers);

const getWidth = () => document.querySelector<HTMLDivElement>('div.App')?.offsetWidth ?? Math.min(window.innerWidth, 960);

export const ZdoData = React.memo(function ZdoData(props: ValueProps<ZDOData>) {
  const translate = useContext(TranslationContext);
  const zdos = props.value.zdos;
  const [entry, setEntry] = useState<SearchEntry | undefined>();
  const [term, setTerm] = useState('');
  const [index, setIndex] = useState(0); // last mile
  const [version, setVersion] = useState(0);
  const [mapExpanded, setMapExpanded] = useState(false);
  const [width, setWidth] = useState(0);
  const players = getPlayersCached(zdos);

  const zdoSearcher = getSearcherCached(zdos, translate);
  const searchIndices = entry?.indices ?? EMPTY_RESULT;
  const searchIndex = searchIndices[index];
  const zdo = searchIndex ? zdos[searchIndex.item] : undefined;

  useLayoutEffect(() => {
    setWidth(getWidth());
  }, [setWidth]);

  useEffect(() => {
    const onResize = () => setWidth(getWidth());
    window.addEventListener('resize', onResize, false);
    return () => window.removeEventListener('resize', onResize, false);
  }, [setWidth]);

  return <div className={classNames('ZdoData', {
    'ZdoData--map-expanded': mapExpanded,
  })}>
    <div className="ZdoData__Map">
      <div style={{ position: 'absolute', right: 0, zIndex: 1 }} onClick={() => setMapExpanded(s => !s)}>{mapExpanded ? 'Collapse' : 'Expand'}</div>
      <MapUI
        size={mapExpanded ? width : 329}
        zdos={zdos}
        selected={getItems({ zdos, indices: searchIndices.map(i => i.item) })}
        current={zdo} />
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
        zdo={zdo}
        playersMap={players}
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
