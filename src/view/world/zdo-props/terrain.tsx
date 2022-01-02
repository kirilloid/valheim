import React, { useLayoutEffect, useRef } from 'react';

import type { ValueProps } from '../../parts/types';
import type { ZDO } from '../types';

import { lerp, stableHashCode } from '../../../model/utils';
import { colorMap } from '../../../model/color-map';
import * as Terrain from '../../../file/TerrainComp';

const TerrainHash = stableHashCode('TCData');

export function TerrainComp({ value }: ValueProps<ZDO>) {
  const bytes = value.byteArrays.get(TerrainHash);
  const data = bytes && Terrain.read(bytes);
  const heightRef = useRef<HTMLCanvasElement>(null);
  const paintRef = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    const canvas = heightRef.current;
    if (canvas == null) return;
    const ctx = canvas.getContext('2d');
    if (ctx == null || data == null) return;
    const side = Math.round(Math.sqrt(data.levelDelta.length));
    canvas.width = side;
    canvas.height = side;
    const imageData = ctx.createImageData(side, side);
    for (const [i, dy] of data.levelDelta.entries()) {
      const index = Math.round(lerp(0, 255, (dy + 8) / 16));
      imageData.data[i * 4 + 0] = colorMap[index * 3 + 0]!;
      imageData.data[i * 4 + 1] = colorMap[index * 3 + 1]!;
      imageData.data[i * 4 + 2] = colorMap[index * 3 + 2]!;
      imageData.data[i * 4 + 3] = 0xFF;
    }
    if (imageData == null) return;
    ctx.putImageData(imageData, 0, 0);
  }, [heightRef, data]);

  useLayoutEffect(() => {
    const ctx = paintRef.current?.getContext('2d');
    const imageData = data?.paintMask;
    if (ctx == null || imageData == null) return;
    ctx.putImageData(imageData, 0, 0);
  }, [paintRef, data]);

  return <React.Fragment key="TCData">
    <dt>height</dt>
    <dd><canvas width={64} height={64} ref={heightRef} /></dd>
    <dt>colored</dt>
    <dd><canvas width={64} height={64} ref={paintRef} /></dd>
  </React.Fragment>;
}
