import React, { useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { defaultMemoize, createSelector } from 'reselect';
import classNames from 'classnames';

import '../../../css/ZdoData.css';

import type { ValueProps } from '../../parts/types';
import type { ZDODataLike } from '../../../file/types';

import { EMPTY_RESULT, getSearcher, getPlayersData, SearchEntry, SearchIndex } from '../../../model/zdo-selectors';

import { PanView } from '../../parts/PanView';
import { TranslationContext } from '../../../effects';
import { ZdoLike, ZdoMap } from './map';
import { ItemEditor } from './editor';
import { lerp, lerpStep } from '../../../model/utils';
import { prefabHashes } from '../../../data/zdo';
import { getZdoInChunk, iterateZdos, removeZdoAtChunkIndex } from '../../../file/types';

const getItems = createSelector(
  (obj: { zdoData: ZDODataLike; indices: SearchIndex[] }) => obj.zdoData,
  (obj: { zdoData: ZDODataLike; indices: SearchIndex[] }) => obj.indices,
  (zdoData, indices) => indices.map((si) => {
    const zdo = getZdoInChunk(zdoData, si);
    return zdo ? { position: zdo.position, prefab: zdo.prefab } : undefined;
  }).filter((item): item is ZdoLike => item !== undefined),
);

function MapUI({ zdos, selected, current, size, total }: { zdos: Iterable<ZdoLike>; selected: ZdoLike[]; current?: ZdoLike; size: number; total: number }) {
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
      {progress != null && <progress max={total} value={progress} className="Map__progress" />}
    </div>
    <div>x: {Math.round((pos.x - 1312) * 8)} y: {Math.round((1312 - pos.y) * 8)}</div>
  </>;
}

const getSearcherCached = defaultMemoize(getSearcher);
const getPlayersDataCached = defaultMemoize(getPlayersData);
const searchSliceCached = defaultMemoize((indices: SearchIndex[], zdoData: ZDODataLike) => indices.slice(0, 1000)
  .map((searchIndex, typeIdx) => {
    const zdo = getZdoInChunk(zdoData, searchIndex);
    const position = zdo?.position;
    return <option key={`${searchIndex.chunkId}_${searchIndex.index}_${searchIndex.container}`} value={typeIdx}>
      {position ? `${position.x.toFixed(3)} / ${position.z.toFixed(3)}` : '[missing]'}
      {searchIndex.container > -1 ? ` [${searchIndex.container}]` : null}
    </option>
  }));

const getWidth = () => document.querySelector<HTMLDivElement>('div.App')?.offsetWidth ?? Math.min(window.innerWidth, 960);

export const ZdoData = React.memo(function ZdoData(props: ValueProps<ZDODataLike> & { time: number; allowDelete?: boolean }) {
  const translate = useContext(TranslationContext);

  const [entry, setEntry] = useState<SearchEntry | undefined>();
  const [term, setTerm] = useState('');
  const [index, setIndex] = useState(0); // last mile
  const [version, setVersion] = useState(0);
  const [mapExpanded, setMapExpanded] = useState(false);
  const [width, setWidth] = useState(0);
  const players = getPlayersDataCached(iterateZdos(props.value));

  const zdoSearcher = getSearcherCached(props.value, translate);
  const searchIndices = entry?.indices ?? EMPTY_RESULT;
  const searchIndex = searchIndices[index];
  const zdo = searchIndex ? getZdoInChunk(props.value, searchIndex) : undefined;

  useLayoutEffect(() => {
    setWidth(getWidth());
  }, [setWidth]);

  useEffect(() => {
    const onResize = () => setWidth(getWidth());
    window.addEventListener('resize', onResize, false);
    return () => window.removeEventListener('resize', onResize, false);
  }, [setWidth]);

  const updateTerm = useCallback(e => setTerm(e.target.value), [setTerm]);
  const clearEntry = useCallback(() => {
    setEntry(undefined);
    setIndex(0);
  }, [setEntry, setIndex]);
  const updateIndex = useCallback(e => setIndex(+e.target.value), [setIndex]);

  return <div className={classNames('ZdoData', {
    'ZdoData--map-expanded': mapExpanded,
  })}>
    <div className="ZdoData__Map">
      <div style={{ position: 'absolute', right: 0, zIndex: 1 }} onClick={() => setMapExpanded(s => !s)}>{mapExpanded ? 'Collapse' : 'Expand'}</div>
      <MapUI
        size={mapExpanded ? width : 329}
        total={props.value.totalZDOs}
        zdos={iterateZdos(props.value)}
        selected={getItems({ zdoData: props.value, indices: searchIndices })}
        current={zdo} />
    </div>
    <div className="ZdoData__Selector">
      {entry
        ? <span>{entry.text} <button className="btn" onClick={clearEntry}>&times;</button></span>
        : <>
            <input value={term} onChange={updateTerm}/>
            <ul style={{ position: 'absolute' }}>
              {zdoSearcher(term).map(se => <li key={se.id} onClick={() => {
                setTerm('');
                setEntry(se);
              }}>
                [{se.indices.length}] {se.text}
              </li>)}
            </ul>
          </>
      }
      {searchIndices.length > 1 && <>
        {searchIndices.length > 1000 && <><br/><em>Only first 1000 objects are listed</em></>}
        <br />
        <select onChange={updateIndex} value={index}>
          {searchSliceCached(searchIndices, props.value)}
        </select>
      </>}
    </div>
    {zdo != null && searchIndex != null && <div className="ZdoData__Editor">
      <ItemEditor
        zdo={zdo}
        playersData={players}
        time={props.time}
        onChange={() => {
          setVersion(version + 1);
          props.onChange(props.value);
        }}
        containerIndex={searchIndex.container}
        onItemLinkClicked={zdo => {
          const id = prefabHashes.get(zdo.prefab);
          if (id == null) return;
          const se = zdoSearcher(translate(id))[0];
          if (se == null) return;
          const index = se.indices.findIndex(si => getZdoInChunk(props.value, si) === zdo);
          setEntry(se);
          setIndex(index === -1 ? 0 : index);
        }}
        version={version}
      />
      {props.allowDelete && <>
        <hr style={{ width: '100%' }} />
        <section>
          <button className="btn btn--danger"
            onClick={() => {
              const newValue = removeZdoAtChunkIndex(props.value, searchIndex);
              if (searchIndices.length === 1) {
                setEntry(undefined);
                setIndex(0);
              } else if (index + 1 === searchIndices.length) {
                setIndex(index - 1);
              }
              props.onChange(newValue);
            }}>
            {translate('ui.delete')}
          </button>
        </section>
      </>}
    </div>}
  </div>;
});
