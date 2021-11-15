import React, { useLayoutEffect, useRef, useState } from 'react';
import { Biome, WorldGenerator } from '../model/world-generator';

const biomeColors = [
  [145, 167, 91], // Meadows
  [52, 94, 59], // Black forest
  [163, 113, 87], // Swamp
  [255, 255, 255], // Mountain
  [199, 199, 49], // Plains
  [0, 0, 153], // Ocean
  [52, 52, 52], // Mistlands
  [255, 0, 0], // Ashlands
  [255, 255, 255], // Deep North
] as const;

async function drawSeedOnto(world: WorldGenerator, imageData: ImageData, size: number, onProgress: (progress: number) => void) {
  function putRgb(x: number, y: number, rgb: readonly [number, number, number]): void {
    imageData.data[(size * y + x) * 4 + 0] = rgb[0];
    imageData.data[(size * y + x) * 4 + 1] = rgb[1];
    imageData.data[(size * y + x) * 4 + 2] = rgb[2];
    imageData.data[(size * y + x) * 4 + 3] = 255;
  }
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const worldX = (2 * x / size - 1) * 10500;
      const worldY = (1 - 2 * y / size) * 10500;
      if (worldX ** 2 + worldY ** 2 > 10500 ** 2) {
        putRgb(x, y, [0, 0, 0]); // dark space
      } else {
        const biome = world.getBiome(worldX, worldY);
        const height = world.getHeight(worldX, worldY);
        if (height < 28 && biome !== Biome.Ocean) {
          // const c = Math.round(128 * height / 30);
          // putRgb(x, y, [c, c, c + 127]);
          putRgb(x, y, [128, 128, 255]);
        } else {
          putRgb(x, y, biomeColors[biome]);
        }
      }
    }
    onProgress(y);
    if (y % 10 === 0) {
      await new Promise(resolve => setTimeout(resolve, 10));
    }
  }
  onProgress(size);
}

const WorldMap = React.memo((props: { seed: string }) => {
  const { seed } = props;
  const SIZE = 640;
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
      const world = new WorldGenerator(seed);
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

export function World() {
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
