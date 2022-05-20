import React, { useLayoutEffect, useRef } from 'react';
import classNames from 'classnames';

import type { Biome, EntityId } from '../../../types';

import { WORLD_SIZE } from '../../../model/game';
import { nop, runGenerator, Vector3 } from '../../../model/utils';
import { stableHashCode } from '../../../model/hash';

import { creatures } from '../../../data/creatures';
import { resources } from '../../../data/resources';
import { objects } from '../../../data/objects';

const HIGHLIGHT_MARKER_LIMIT = 1000;

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

const prefabToBiomeColor = new Map<number, number>();

function addBiome(biomes: Set<Biome>, id: EntityId): void {
  if (biomes.size !== 1) return;
  for (const biome of biomes) {
    prefabToBiomeColor.set(
      stableHashCode(id),
      biomeColors[biome],
    );
  }
}

for (const creature of creatures) {
  const biomes = new Set(creature.spawners.flatMap(spawner => spawner.biomes));
  addBiome(biomes, creature.id);
}

for (const resource of resources) {
  const biomes = new Set(resource.grow?.flatMap(g => g.locations));
  addBiome(biomes, resource.id);
}

for (const object of objects) {
  const biomes = new Set(object.grow?.flatMap(g => g.locations));
  addBiome(biomes, object.id);
}

prefabToBiomeColor.set(stableHashCode('Fish1'), blueWater);
prefabToBiomeColor.set(stableHashCode('Fish2'), blueWater);
prefabToBiomeColor.set(stableHashCode('Fish3'), biomeColors.Ocean);

const ZoneCtrlHash = stableHashCode('_ZoneCtrl');

export type ZdoLike = { position: Vector3; prefab: number };

function useDrawMap(
  ref: React.MutableRefObject<HTMLCanvasElement | null>,
  zdos: ZdoLike[],
  SIZE: number,
  setProgress: (progress: number | undefined) => void = nop,
) {
  const WORLD_SIZE_HINTED = WORLD_SIZE - (WORLD_SIZE % SIZE);
  useLayoutEffect(function drawMap() {
    const canvas = ref.current;
    if (canvas == null) return;
    const ctx = canvas.getContext('2d');
    if (ctx == null) return;
    ctx.clearRect(0, 0, SIZE, SIZE);
    ctx.fillStyle = '#0003';
    ctx.beginPath();
    ctx.arc(SIZE / 2, SIZE / 2, SIZE / 2, 0, 2 * Math.PI);
    ctx.fill();
    const imageData = ctx.getImageData(0, 0, SIZE, SIZE);
    const pixels = new Uint32Array(imageData.data.buffer);

    function setDot(x: number, y: number, color: number) {
      pixels[y * SIZE + x] = color;
      // pixels[y * SIZE + x + 1] = color;
      // pixels[y * SIZE + x - 1] = color;
      // pixels[(y - 1) * SIZE + x] = color;
      // pixels[(y + 1) * SIZE + x] = color;
    }

    runGenerator(
      (function* (): Generator<number, void, void> {
        let i = 0;
        for (const zdo of zdos) {
          const x = Math.round(zdo.position.x / WORLD_SIZE_HINTED * SIZE + SIZE / 2);
          const y = Math.round(SIZE / 2 - zdo.position.z / WORLD_SIZE_HINTED * SIZE);
          const color = prefabToBiomeColor.get(zdo.prefab) ?? 0;
          if (color !== 0) {
            setDot(x, y, color);
          } else if (zdo.position.y < 20) {
            if (zdo.prefab !== ZoneCtrlHash) {
              setDot(x, y, biomeColors.Ocean);
            }
          } else if (zdo.position.y < 28) {
            setDot(x, y, blueWater);
          }
          if ((i++ & 0xFFFF) === 0) yield i;
        }
      }()),
      setProgress,
    ).then(() => {
      ctx.putImageData(imageData, 0, 0);
      setProgress(undefined);
    });
  }, [zdos, ref, setProgress, SIZE, WORLD_SIZE_HINTED]);
}

function useDrawSelected(
  ref: React.MutableRefObject<HTMLCanvasElement | null>,
  zdos: ZdoLike[] | undefined,
  SIZE: number,
) {
  const WORLD_SIZE_HINTED = WORLD_SIZE - (WORLD_SIZE % SIZE);
  useLayoutEffect(function drawMap() {
    const ctx = ref.current?.getContext('2d');
    if (ctx == null) return nop;
    const clear = () => ctx.clearRect(0, 0, SIZE, SIZE);
    if (zdos == null) return clear;
    if (zdos.length < HIGHLIGHT_MARKER_LIMIT) return clear;
    const imageData = ctx.getImageData(0, 0, SIZE, SIZE);
    const pixels = new Uint32Array(imageData.data.buffer);

    function setDot(x: number, y: number, color: number) {
      pixels[y * SIZE + x] = color;
      pixels[y * SIZE + x + 1] = color;
      pixels[y * SIZE + x - 1] = color;
      pixels[(y - 1) * SIZE + x] = color;
      pixels[(y + 1) * SIZE + x] = color;
    }

    for (const zdo of zdos) {
      const x = Math.round(zdo.position.x / WORLD_SIZE_HINTED * SIZE + SIZE / 2);
      const y = Math.round(SIZE / 2 - zdo.position.z / WORLD_SIZE_HINTED * SIZE);
      setDot(x, y, 0xff0080ff);
    }

    ctx.putImageData(imageData, 0, 0);
    return clear;
  }, [ref, zdos, SIZE, WORLD_SIZE_HINTED]);
}

export function ZdoMap({ zdos, selected, current, markerSize, onProgress }: {
  zdos: ZdoLike[],
  selected?: ZdoLike[],
  current?: ZdoLike,
  markerSize: number,
  onProgress?: (progress?: number) => void,
}) {
  const terrainCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const markersCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const HI_RES = 2624;
  const MID_RES = 1312;

  useDrawMap(terrainCanvasRef, zdos, MID_RES, onProgress);
  useDrawSelected(markersCanvasRef, selected, HI_RES);

  return <>
    <canvas width={MID_RES} height={MID_RES} ref={terrainCanvasRef}
      style={{ width: HI_RES, height: HI_RES, imageRendering: 'pixelated' }}/>
    <canvas width={HI_RES} height={HI_RES} ref={markersCanvasRef}
      style={{ position: 'absolute', left: 0, top: 0 }} />
    {selected != null && selected.length < HIGHLIGHT_MARKER_LIMIT && <>
      {selected.map((zdo, i) => <div key={i} className={classNames('Map__marker', {
        'Map__marker--selected': current === zdo
      })} style={{
        left: Math.round(zdo.position.x / WORLD_SIZE * HI_RES + HI_RES / 2) - markerSize / 2,
        bottom: Math.round(zdo.position.z / WORLD_SIZE * HI_RES + HI_RES / 2) - markerSize / 2,
      }}></div>)}
    </>}
  </>
}
