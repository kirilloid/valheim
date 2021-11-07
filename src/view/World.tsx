import React, { useLayoutEffect, useRef, useState } from 'react';
import { Biome, WorldGenerator } from '../model/world-generator';

const biomeColors = [
  [32, 192, 32], // Meadows
  [0, 128, 0], // Black forest
  [64, 64, 0], // Swamp
  [224, 224, 224], // Mountain
  [192, 160, 128], // Plains
  [0, 0, 128], // Ocean
  [32, 48, 32], // Mistlands
  [192, 64, 64], // Ashlands
  [192, 192, 255], // Deep North
] as const;

async function drawSeedOnto(seed: string, imageData: ImageData, SIZE: number, onProgress: (progress: number) => void) {
  const world = new WorldGenerator(seed);
  function putRgb(x: number, y: number, rgb: readonly [number, number, number]): void {
    imageData.data[(SIZE * y + x) * 4 + 0] = rgb[0];
    imageData.data[(SIZE * y + x) * 4 + 1] = rgb[1];
    imageData.data[(SIZE * y + x) * 4 + 2] = rgb[2];
    imageData.data[(SIZE * y + x) * 4 + 3] = 255;
  }
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const worldX = (2 * x / SIZE - 1) * 10500;
      const worldY = (1 - 2 * y / SIZE) * 10500;
      if (worldX ** 2 + worldY ** 2 > 10500 ** 2) {
        putRgb(x, y, [0, 0, 0]); // dark space
      } else {
        const biome = world.getBiome(worldX, worldY);
        const height = world.getHeight(worldX, worldY);
        if (height < 30 && biome !== Biome.Ocean) {
          putRgb(x, y, [128, 128, 255]);
        }
        putRgb(x, y, biomeColors[biome]);
      }
    }
    onProgress(y);
    if (y % 10 === 0) {
      await new Promise(resolve => setTimeout(resolve, 10));
    }
  }
}

const WorldMap = React.memo((props: { seed: string }) => {
  const { seed } = props;
  const SIZE = 640;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [progress, setProgress] = useState(0);
  useLayoutEffect(() => {
    if (seed === '') return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const imageData = ctx.getImageData(0, 0, SIZE, SIZE);
    drawSeedOnto(seed, imageData, SIZE, setProgress)
      .then(() => ctx.putImageData(imageData, 0, 0));
  }, [seed]);
  return <>
    <progress max={SIZE} value={progress} style={{ width: '100%' }} />
    <canvas width={SIZE} height={SIZE} ref={r => canvasRef.current = r} />
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
