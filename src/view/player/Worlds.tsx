import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

import type { ValueProps } from '../parts/types';
import type { MapData as TMapData, Player } from './types';
import { read, write } from '../../file/MapData';

const mapDataCache = new Map<BigInt, TMapData>();

function MapData({ mapData, id, onChange }: { mapData: TMapData; id: BigInt; onChange: (mapData: TMapData) => void }) {
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
        const offset = ((SIZE - y - 1) * tileSize + x) * (tileSize / SIZE);
        const bitThey = (mapData.exploredOthers[offset >> 3]! >> (offset & 7)) & 1;
        const bitMe = (mapData.explored[offset >> 3]! >> (offset & 7)) & 1;
        imageData.data[(y * SIZE + x) * 4 + 3] += bitMe ? 255 : bitThey ? 128 : 0;
      }
    }
    ctx.putImageData(imageData, 0, 0);
  }, [mapData]);

  return <section>
    <h2>Unknown world {Number(id).toString(16)}</h2>
    {mapData.version < 7 && <p>
      This world data uses old format. Do you want to upgrade &amp; save 4MB?
      {' '}
      <button className="btn btn--primary" onClick={() => onChange({ ...mapData, version: 7 })}>
        Upgrade
      </button>
    </p>}
    <p>map pins: {mapData.pins.length ?? '—'}</p>
    <p>explored:</p>
    <canvas ref={canvasRef} width={SIZE} height={SIZE} />
  </section>
}

export function Worlds({ value: worlds, onChange } : ValueProps<Player['worlds']>) {
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
    if (mapDataPacked == null) {
      setMapData(undefined);
      return;
    }
    const mapDataUnpacked = read(mapDataPacked);
    mapDataCache.set(hash, mapDataUnpacked);
    setMapData(mapDataUnpacked);
  }, [worlds, hash]);

  const updateMapData = useCallback((md: TMapData) => {
    const mapData = write(md);
    const world = worlds.get(hash);
    if (world != null) {
      worlds.set(hash, { ...world, mapData });
      mapDataCache.set(hash, md);
      onChange(worlds);
    }
  }, [hash, worlds, onChange]);

  if (worlds.size === 0) {
    return <span>This character hasn't visited any worlds yet</span>
  }

  return <>
    <select value={hash.toString()} onChange={e => setHash(BigInt(e.target.value))}>
      {entries.map(e => <option value={e[0].toString()} key={Number(e[0])}>{e[0].toString(16)}</option>)}
    </select>
    {mapData && <MapData mapData={mapData} id={hash} onChange={md => {
      updateMapData(md);
      setMapData(md);
    }} />}
  </>
}
