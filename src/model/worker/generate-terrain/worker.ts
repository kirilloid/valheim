import type { MessageFromWorker, MessageToWorker } from './types';

import { Biome, WorldGenerator } from '../../world-generator';
import { WORLD_RADIUS } from '../../game';

/* eslint-disable no-restricted-globals */
const ctx: Worker = self as any;

function sendMessage(message: MessageFromWorker, transferables: Transferable[]) {
  ctx.postMessage(message, transferables);
}

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

function generateChunk(
  world: WorldGenerator,
  worldSize: number,
  // number of sampling
  chunkSize: number,
  canvasSize: number,
  blockSize: number,
  chunkX: number,
  chunkY: number
): ArrayBuffer {
  const buffer = new ArrayBuffer(4 * (canvasSize ** 2));
  const pixels = new Uint32Array(buffer);
  const WORLD_RADIUS_2 = WORLD_RADIUS ** 2;
  for (let y = 0; y < chunkSize; y++) {
    for (let x = 0; x < chunkSize; x++) {
      const worldX = +(2 * (x + chunkSize * chunkX + 0.25) * blockSize / worldSize - 1) * WORLD_RADIUS;
      const worldY = -(2 * (y + chunkSize * chunkY + 0.25) * blockSize / worldSize - 1) * WORLD_RADIUS;
      // dark space
      if (worldX * worldX + worldY * worldY > WORLD_RADIUS_2) continue;
      const biome = world.getBiome(worldX, worldY);
      const height = world.getHeight(worldX, worldY);
      const color = 
        height < 30 && biome !== Biome.Ocean && biome !== Biome.Swamp
        ? 0xFFFF8080
        : biomeColors[biome];
      if (blockSize === 1) {
        pixels[chunkSize * y + x] = color;
      } else {
        for (let sy = 0; sy < blockSize; sy++) {
          for (let sx = 0; sx < blockSize; sx++) {
            pixels[canvasSize * (y * blockSize + sy) + (x * blockSize + sx)] = color;
          }
        }
      }
    }
  }
  return buffer;
}

function *generateTerrainChunks(data: MessageToWorker): Generator<MessageFromWorker, void, void> {
  const world = new WorldGenerator(data.seed);
  const totalChunks = (4 ** (data.iterations + 1) - 1) / 3;
  let progress = 0;
  const worldSize = data.side;
  const chunkSize = worldSize >> data.iterations;
  for (let scale = 0; scale <= data.iterations; scale++) {
    const CHUNKS = 1 << scale;
    const blockSize = 1 << (data.iterations - scale);
    const canvasSize = chunkSize * blockSize;
    for (let y = 0; y < CHUNKS; y++) {
      for (let x = 0; x < CHUNKS; x++) {
        progress++;
        const buffer = generateChunk(world, worldSize, chunkSize, canvasSize, blockSize, x, y);
        yield {
          progress: progress / totalChunks,
          buffer,
          width: canvasSize,
          height: canvasSize,
          x: x * canvasSize,
          y: y * canvasSize,
        };
      }
    }
  }
}

async function generateTerrain(data: MessageToWorker) {
  for (const item of generateTerrainChunks(data)) {
    sendMessage(item, [item.buffer]);
  };
}

ctx.addEventListener('message', async (event: MessageEvent<MessageToWorker>) => {
  generateTerrain(event.data);
});

export {};
