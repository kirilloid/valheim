import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import { WORLD_SIZE } from '../../model/game';
import { stableHashCode } from '../../model/utils';
import { generateZones } from '../../model/worker/generate-zones';
import { generateTerrain } from '../../model/worker/generate-terrain';
import { RegisteredLocation } from '../../model/zone-system';
import { PanView } from '../parts/PanView';

const WorldMap = React.memo((props: { seed: string }) => {
  const { seed } = props;
  const SIZE = 2048;
  function canvas2worldCoord(c: number): number {
    return (c / SIZE - 0.5) * WORLD_SIZE;
  }
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mapProgress, setMapProgress] = useState(0);
  const [locProgress, setLocProgress] = useState(0);
  const [locations, setLocations] = useState<RegisteredLocation[]>([]);
  const [zoom, setZoom] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useLayoutEffect(() => {
    if (seed === '') return;
    const canvas = canvasRef.current;
    if (canvas == null) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const numSeed = stableHashCode(seed);
    return generateTerrain(numSeed, SIZE, 3, (data) => {
      const array = new Uint8ClampedArray(data.buffer);
      const imageData = new ImageData(array, data.width, data.height);
      ctx.putImageData(imageData, data.x, data.y);
      setMapProgress(data.progress);
    });
  }, [seed]);

  useEffect(() => {
    if (seed === '') return;
    const numSeed = stableHashCode(seed);
    return generateZones(numSeed, setLocProgress, setLocations);
  }, [seed]);

  return <>
    <dl className="overlay">
      <dt>world map</dt><dd><progress max={1} value={mapProgress} style={{ width: '100%', height: 16 }} /></dd>
      <dt>locations</dt><dd><progress max={1} value={locProgress} style={{ width: '100%', height: 16 }} /></dd>
    </dl>
    <div className="overlay">zoom: {Math.round(zoom * 100)}%</div>
    <div className="overlay">position: {Math.round(canvas2worldCoord(pos.x))} / {-Math.round(canvas2worldCoord(pos.y))}</div>
    <div style={{ position: 'absolute', top: 40, bottom: 0, left: 0, right: 0 }}>
      <PanView maxZoom={20} onZoomChange={setZoom} onMouseMove={setPos}>
        <canvas width={SIZE} height={SIZE} ref={r => canvasRef.current = r}
          style={{ margin: '0 auto', imageRendering: 'pixelated', width: `${SIZE}px`, height: `${SIZE}px` }} />
      </PanView>
    </div>
  </>
});

export function WorldGenerator() {
  const inputRef = useRef<HTMLInputElement>(null);
  const params = useParams<{ seed?: string }>();
  const [seed, setSeed] = useState(params.seed ?? '');
  const history = useHistory();

  useEffect(() => {
    const input = inputRef.current;
    if (input != null) input.value = seed;
  }, [seed]);

  return (<>
    <section className="overlay">
      <h1>World Generator</h1>
      <input ref={inputRef} type="text" placeholder="Enter seed" />
      <button className="btn" onClick={() => {
        const newSeed = inputRef.current?.value ?? '';
        const path = newSeed.length ? `/world-gen/${newSeed}` : '/world-gen';
        if (history.location.pathname !== path) {
          history.replace(path);
        }
        setSeed(newSeed);
      }}>Generate</button>
    </section>
    <WorldMap seed={seed} />
  </>);
}
