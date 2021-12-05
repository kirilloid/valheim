import React, { useLayoutEffect, useRef, useState } from 'react';
import { wait } from '../../model/utils';
import { Biome, WorldGenerator as WorldGen } from '../../model/world-generator';

const biomeColors = [
  0xff5ba791, // Meadows
  0xff3b5e34, // Black forest
  0xff5771a3, // Swamp
  0xffffffff, // Mountain
  0xff31c7c7, // Plains
  0xff990000, // Ocean
  0xff343434, // Mistlands
  0xff0000ff, // Ashlands
  0xffffffff, // Deep North
] as const;

async function drawSeedOnto(world: WorldGen, imageData: ImageData, size: number, onProgress: (progress: number) => void) {
  const pixels = new Uint32Array(imageData.data.buffer);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const worldX = (2 * x / size - 1) * 10500;
      const worldY = (1 - 2 * y / size) * 10500;
      if (worldX ** 2 + worldY ** 2 > 10500 ** 2) {
        pixels[size * y + x] = 0; // dark space
      } else {
        const biome = world.getBiome(worldX, worldY);
        const height = world.getHeight(worldX, worldY);
        if (height < 28 && biome !== Biome.Ocean) {
          // const c = Math.round(128 * height / 30);
          // putRgb(x, y, [c, c, c + 127]);
          pixels[size * y + x] = 0xFFFF8080;
        } else {
          pixels[size * y + x] = biomeColors[biome];
        }
      }
    }
    onProgress(y);
    if (y % 10 === 0) {
      await wait(10);
    }
  }
  onProgress(size);
}

const WorldMap = React.memo((props: { seed: string }) => {
  const { seed } = props;
  const SIZE = 960;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [progress, setProgress] = useState(0);
  const MAX_SCALE = 5;
  const baseSize = (SIZE / 2 ** MAX_SCALE) ** 2;
  const totalProgress = baseSize * (4 ** (MAX_SCALE + 1) / 3);
  useLayoutEffect(() => {
    if (seed === '') return;
    const canvas = canvasRef.current;
    if (canvas == null) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    (async function (canvas: HTMLCanvasElement) {
      const world = new WorldGen(seed);
      let currentProgress = 0;
      for (let scale = MAX_SCALE; scale >= 0; scale--) {
        const size = SIZE / (2 ** scale); 
        const imageData = ctx.createImageData(size, size);
        await drawSeedOnto(world, imageData, size, y => {
          setProgress(currentProgress + y * size)
        });
        currentProgress += size ** 2;
        canvas.width = size;
        canvas.height = size;
        ctx.putImageData(imageData, 0, 0);
      }
    }(canvas));
  }, [seed]);
  return <>
    <progress max={totalProgress} value={progress} style={{ width: '100%' }} />
    <canvas width={SIZE} height={SIZE} ref={r => canvasRef.current = r}
      style={{ margin: '0 auto', imageRendering: 'pixelated', width: `${SIZE}px`, height: `${SIZE}px` }} />
  </>
});

export function WorldGenerator() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [seed, setSeed] = useState('');

  return (<>
    <div>
      <input ref={r => inputRef.current = r} type="text" />
      <button onClick={() => setSeed(inputRef.current?.value ?? '')}>Generate</button>
    </div>
    <WorldMap seed={seed} />
  </>);
}
