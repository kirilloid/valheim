import React, { useContext, useLayoutEffect, useRef, useState } from 'react';

import type { Biome } from '../../types';
import type { ValueProps } from '../parts/types';
import type { ZDOData, ZDO } from './types';

import { WORLD_SIZE } from '../../model/game';
import { data } from '../../data/itemDB';
import { getId, keys, objects } from '../../data/zdo';
import { InterfaceFields } from './ZDOProps';
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

export function ZdoData(props: ValueProps<ZDOData>) {
  const { zdos } = props.value;
  const translate = useContext(TranslationContext);
  const zdoGroups = new Map<string, ZDO[]>();
  const [currentId, setCurrentId] = useState('');
  const [index, setIndex] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  for (const zdo of zdos) {
    const id = getId(objects, zdo.prefab);
    if (zdoGroups.has(id)) {
      zdoGroups.get(id)!.push(zdo);
    } else {
      zdoGroups.set(id, [zdo]);
    }
  }
  const currentItems = zdoGroups.get(currentId) ?? [];
  const currentItem = currentItems[index];

  const SIZE = 320;
  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (canvas == null) return;
    const ctx = canvas.getContext('2d');
    if (ctx == null) return;
    ctx.fillStyle = '#ccc';
    ctx.fillRect(0, 0, SIZE, SIZE);
    ctx.fillStyle = '#fff';
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

  const components = data[currentId]?.components?.flatMap(cmp => InterfaceFields[cmp] ?? []) ?? [];

  return <>
    <canvas width={SIZE} height={SIZE} ref={canvasRef} style={{ float: 'right' }} />
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
    {currentItem != null && <><dl>
      <dt>position</dt><dd>{currentItem.position.x} / {currentItem.position.z}</dd>
      <dt>sector</dt><dd>{currentItem.sector.x} / {currentItem.sector.y}</dd>
      {components.map(C => <C zdo={currentItem} />)}
      </dl>
      <hr />
      <dl>
      <ZdoSpecialData data={currentItem.floats} stringify={String} />
      <ZdoSpecialData data={currentItem.vec3} stringify={v => `${v.x.toFixed(3)} / ${v.y.toFixed(3)} / ${v.z.toFixed(3)}`} />
      <ZdoSpecialData data={currentItem.quats} stringify={v =>
        `x: ${v.x.toFixed(3)}, y: ${v.y.toFixed(3)}, z: ${v.z.toFixed(3)}, w: ${v.w.toFixed(3)}`} />
      <ZdoSpecialData data={currentItem.ints} stringify={String} />
      <ZdoSpecialData data={currentItem.longs} stringify={String} />
      <ZdoSpecialData data={currentItem.strings} stringify={String} />
      <ZdoSpecialData data={currentItem.byteArrays} stringify={arr => ([] as number[]).map.call(arr, v => v.toString(16).padStart(2, '0')).join('')} />
    </dl></>}
  </>;
}
