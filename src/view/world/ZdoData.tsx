import React, { useContext, useLayoutEffect, useRef, useState } from 'react';
import { defaultMemoize } from 'reselect';

import type { Biome, GameComponent } from '../../types';
import type { ValueProps } from '../parts/types';
import type { ZDOData, ZDO } from './types';

import { WORLD_SIZE } from '../../model/game';
import { data, extraData } from '../../data/itemDB';
import { getId, keys, objects } from '../../data/zdo';
import { InterfaceFields } from './zdo-props';
import { TranslationContext } from '../../effects';

const biomeColors: Record<Biome, number> = {
  Meadows: 0xff5ba791,
  BlackForest: 0xff3b5e34,
  Swamp: 0xff5771a3,
  Mountain: 0xffffffff,
  Plains: 0xff31c7c7,
  Ocean: 0xff990000,
  Mistlands: 0xff343434,
  Ashlands: 0xff0000ff,
  DeepNorth: 0xffffffff,
};
const blueWater = 0xFFFF8080;

export function ZdoSpecialData<T>(props: { data?: Map<number, T>, stringify: (value: T) => string }) {
  if (props == null) return null;
  const { data, stringify } = props;
  if (!data) return null;
  return <>{[...data.entries()]
    .map(([key, value]) => <React.Fragment key={key}>
      <dt>{getId(keys, key)}</dt><dd>{stringify(value)}</dd>
    </React.Fragment>)
  }</>;
}

const getGroups = defaultMemoize((zdos: ZDO[]) => {
  const zdoGroups = new Map<string, ZDO[]>();
  for (const zdo of zdos) {
    const id = getId(objects, zdo.prefab);
    if (zdoGroups.has(id)) {
      zdoGroups.get(id)!.push(zdo);
    } else {
      zdoGroups.set(id, [zdo]);
    }
  }
  return zdoGroups;
});

function getComponents(id: string | undefined): GameComponent[] {
  if (id == null) return [];
  return extraData[id] ?? data[id]?.components ?? [];
}

const ItemEditor = React.memo(({ zdo, onChange }: { zdo: ZDO, onChange: (value: ZDO) => void, version: number }) => {
  const currentId = objects.get(zdo.prefab);
  const eComponents = getComponents(currentId);
  const components = eComponents.flatMap(cmp => InterfaceFields[cmp] ?? []);
  return <>
    <dl>
      <dt>position</dt><dd>{zdo.position.x} / {zdo.position.z}</dd>
      <dt>sector</dt><dd>{zdo.sector.x} / {zdo.sector.y}</dd>
      {components.map(C => <C value={zdo} onChange={onChange} />)}
    </dl>
    <hr />
      <dl>
      <ZdoSpecialData data={zdo.floats} stringify={String} />
      <ZdoSpecialData data={zdo.vec3} stringify={v => `${v.x.toFixed(3)} / ${v.y.toFixed(3)} / ${v.z.toFixed(3)}`} />
      <ZdoSpecialData data={zdo.quats} stringify={v =>
        `x: ${v.x.toFixed(3)}, y: ${v.y.toFixed(3)}, z: ${v.z.toFixed(3)}, w: ${v.w.toFixed(3)}`} />
      <ZdoSpecialData data={zdo.ints} stringify={String} />
      <ZdoSpecialData data={zdo.longs} stringify={String} />
      <ZdoSpecialData data={zdo.strings} stringify={String} />
      <ZdoSpecialData data={zdo.byteArrays} stringify={arr => ([] as number[]).map.call(arr, v => v.toString(16).padStart(2, '0')).join('')} />
    </dl>
  </>
});

export function ZdoData(props: ValueProps<ZDOData>) {
  const { zdos } = props.value;
  const translate = useContext(TranslationContext);
  const [currentId, setCurrentId] = useState('');
  const [index, setIndex] = useState(0);
  const [version, setVersion] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const zdoGroups = getGroups(zdos);
  const currentItems = zdoGroups.get(currentId) ?? [];
  const currentItem = currentItems[index];

  const SIZE = 320;
  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (canvas == null) return;
    const ctx = canvas.getContext('2d');
    if (ctx == null) return;
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, SIZE, SIZE);
    ctx.fillStyle = '#ccc';
    ctx.beginPath();
    ctx.arc(SIZE / 2, SIZE / 2, SIZE / 2, 0, 2 * Math.PI);
    ctx.fill();
    const imageData = ctx.getImageData(0, 0, SIZE, SIZE);
    const pixels = new Uint32Array(imageData.data.buffer);

    for (const zdo of zdos) {
      const x = Math.round(zdo.position.x / WORLD_SIZE * SIZE + SIZE / 2);
      const y = Math.round(zdo.position.z / WORLD_SIZE * SIZE + SIZE / 2);
      const id = objects.get(zdo.prefab);
      if (id == null) continue;
      if (id === 'Fish3' || zdo.position.y < 20) {
        pixels[y * SIZE + x] = biomeColors.Ocean;
      } else if (id === 'Fish2' || id === 'Fish1' || zdo.position.y < 28) {
        pixels[y * SIZE + x] = blueWater;
      }
      const obj = data[id];
      if (obj == null) continue;
      if ('grow' in obj && obj.grow?.length === 1 && obj.grow[0]!.locations.length === 1) {
        const loc = obj.grow[0]!.locations[0]!;
        pixels[y * SIZE + x] = biomeColors[loc];
      }
    }
    ctx.putImageData(imageData, 0, 0);
  }, [zdos]);

  return <>
    <canvas width={SIZE} height={SIZE} ref={canvasRef} style={{ float: 'right', maxWidth: '100%', width: '320px' }} />
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
      {currentItems.length > 1000 && <><em>Only first 1000 objects are shown</em><br/></>}
      <select onChange={e => {
        setIndex(+e.target.value);
        setVersion(0);
      }} value={index}>
        {currentItems.slice(0, 1000).map((item, idx) => <option key={idx} value={idx}>
          {item.position.x.toFixed(3)} / {item.position.z.toFixed(3)}
        </option>)}
      </select>
      <br />
    </>}
    {currentItem != null && <ItemEditor
      zdo={currentItem}
      version={version}
      onChange={() => {
        setVersion(version + 1);
        props.onChange(props.value);
      }}
    />}
  </>;
}
