import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

import type { ValueProps } from '../parts/types';
import type { MapData as TMapData, Player } from './types';
import { read } from '../../file/MapData';

const mapDataCache = new Map<BigInt, TMapData>();

function MapData({ mapData }: { mapData: TMapData }) {
  const SIZE = 512;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useLayoutEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx == null) return;
    ctx.clearRect(0, 0, SIZE, SIZE);
    ctx.strokeStyle = '#888';
    ctx.beginPath();
    ctx.arc(SIZE / 2, SIZE / 2, SIZE / 2, 0, Math.PI * 2, true);
    ctx.stroke();
    const imageData = ctx.getImageData(0, 0, SIZE, SIZE);
    const { tileSize } = mapData;
    const SIZE_2 = (SIZE / 2) ** 2;
    for (let y = 0; y < SIZE; y++) {
      for (let x = 0; x < SIZE; x++) {
        const dx = (x - SIZE / 2);
        const dy = (y - SIZE / 2);
        if (dx * dx + dy * dy > SIZE_2) continue;
        const offset = (y * tileSize + x) * (tileSize / SIZE);
        const bitThey = (mapData.exploredOthers[offset >> 3]! >> (offset & 7)) & 1;
        const bitMe = (mapData.explored[offset >> 3]! >> (offset & 7)) & 1;
        imageData.data[(y * SIZE + x) * 4 + 3] += bitMe ? 255 : bitThey ? 128 : 0;
      }
    }
    ctx.putImageData(imageData, 0, 0);
  }, [mapData]);
  return <>
    {' '}
    map pins: {mapData.pins.length ?? '—'}
    <br/>
    explored:
    <br/>
    <canvas ref={canvasRef} width={SIZE} height={SIZE} />
  </>
}

export function Worlds({ value: worlds } : ValueProps<Player['worlds']>) {
  const entries = [...worlds.entries()];
  const [hash, setHash] = useState(entries[0]?.[0] ?? BigInt(0));
  const [mapData, setMapData] = useState<TMapData>();
  useEffect(function drawMap() {
    const world = worlds.get(hash);
    if (mapDataCache.has(hash)) {
      setMapData(mapDataCache.get(hash));
      return;
    }
    const mapDataPacked = world?.mapData;
    if (mapDataPacked == null) return;
    const mapDataUnpacked = read(mapDataPacked);
    mapDataCache.set(hash, mapDataUnpacked);
    setMapData(mapDataUnpacked);
  }, [worlds, hash])
  if (worlds.size === 0) {
    return <span>You character hasn't visited any worlds yet</span>
  }
  return <>
    <select value={hash.toString()} onChange={e => setHash(BigInt(e.target.value))}>
      {entries.map(e => <option value={e[0].toString()} key={e[0].toString()}>{e[0].toString(16)}</option>)}
    </select>
    {mapData && <MapData mapData={mapData} />}
  </>
}
