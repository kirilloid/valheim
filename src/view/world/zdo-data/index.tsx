import React, { useContext, useEffect, useRef, useState } from 'react';
import { defaultMemoize, createSelector } from 'reselect';

import '../../../css/ZdoData.css';

import type { ValueProps } from '../../parts/types';
import type { ZDOData, ZDO } from '../types';

import { ZdoTree, getTree } from '../../../model/zdo-selectors';

import { PanView } from '../../parts/PanView';
import { TranslationContext } from '../../../effects';
import { ZdoMap } from './map';
import { ItemEditor } from './editor';
import { lerp, lerpStep } from '../../../model/utils';

const getItems = createSelector<{ zdos: ZDO[], indices: number[] }, ZDO[], number[], ZDO[]>(
  obj => obj.zdos,
  obj => obj.indices,
  (zdos, indices) => indices.map(i => zdos[i]!),
);

function MapUI({ zdos, selected }: { zdos: ZDO[], selected: ZDO[] }) {
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
        <ZdoMap zdos={zdos} selected={selected} markerSize={markerSize} onProgress={setProgress} />
      </PanView>
      {progress != null && <progress max={zdos.length} value={progress} className="Map__progress" />}
    </div>
    <div>x: {Math.round((pos.x - 1312) * 8)} y: {Math.round((1312 - pos.y) * 8)}</div>
  </>;
}

function Breadcumbs({ node, pathBefore, pathAfter, setPath }: {
  node: ZdoTree<number>,
  pathBefore: string[],
  pathAfter: string[],
  setPath: (path: string[]) => void,
}) {
  const translate = useContext(TranslationContext);
  const current = pathAfter[0];
  if (node.type === 'leaf') return null;
  const next = current != null ? node.children[current] : undefined;
  const size = Object.keys(node.children).length;
  if (size === 0) return null;
  return <>
    <p>
      <select
      onChange={e => e.target.value ? setPath(pathBefore.concat(e.target.value)) : setPath(pathBefore)}
        value={current ?? ''}>
        <option value="">All ({node.total})</option>
        {Object.entries(node.children)
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map(([id, child]) => <option key={id} value={id}>
            {translate(id)} ({child.total})
          </option>)}
      </select>
    </p>
    {next != null && current != null && <Breadcumbs node={next}
      pathBefore={pathBefore.concat(current)}
      pathAfter={pathAfter.slice(1)}
      setPath={setPath} />}
  </>;
}

const EMPTY_INDICES: number[] = [];
const getTreeCached = defaultMemoize(getTree);

export const ZdoData = React.memo(function ZdoData(props: ValueProps<ZDOData>) {
  // const zdos = filterItems(props.value.zdos);
  const zdos = props.value.zdos;
  const [path, setPath] = useState<string[]>([]);
  const [index, setIndex] = useState(0); // last mile
  const [version, setVersion] = useState(0);

  const zdoTree = getTreeCached(zdos);
  const selectedNode = path.reduce<ZdoTree<number> | undefined>(
    (node, part) => node?.type === 'node'
      ? node.children[part]
      : undefined,
    zdoTree,
  );
  const selectedLeaf = selectedNode?.type === 'leaf' ? selectedNode : undefined;
  const currentItemIndices = selectedLeaf?.children;
  const currentItemIndex = currentItemIndices?.[index];

  return <div className="ZdoData">
    <div className="ZdoData__Map">
      <MapUI zdos={zdos} selected={getItems({ zdos, indices: currentItemIndices ?? EMPTY_INDICES })} />
    </div>
    <div className="ZdoData__Selector">
      <Breadcumbs node={zdoTree} pathBefore={[]} pathAfter={path} setPath={e => {
        setPath(e);
        setIndex(0);
      }} />
      {currentItemIndices != null && currentItemIndices.length > 1 && <>
        {currentItemIndices.length > 1000 && <><em>Only first 1000 objects are listed</em><br/></>}
        <select onChange={e => {
            setIndex(+e.target.value);
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
    </div>
    {currentItemIndex != null && <div className="ZdoData__Editor">
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
            if (selectedLeaf?.children.length === 1) {
              setPath(path.slice(1));
              setIndex(0);
            } else if (index + 1 === selectedLeaf?.children.length) {
              setIndex(index - 1);
            } if (selectedLeaf == null) {
              setIndex(0);
            }
            props.onChange(newValue);
          }}>
          Delete object
        </button>
      </section>
    </div>}
  </div>;
});
