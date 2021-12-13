import React, { useLayoutEffect, useRef } from 'react';

import type { ValueProps } from '../../parts/types';
import type { ZDO } from '../types';

import { stableHashCode } from '../../../model/utils';
import * as Terrain from '../../../file/TerrainComp';

const TerrainHash = stableHashCode('TCData');

export function TerrainComp({ value }: ValueProps<ZDO>) {
  const bytes = value.byteArrays.get(TerrainHash);
  const data = bytes && Terrain.read(bytes);
  const ref = useRef<HTMLCanvasElement | null>();
  useLayoutEffect(() => {
    const ctx = ref.current?.getContext('2d');
    const imageData = data?.paintMask;
    if (ctx == null || imageData == null) return;
    ctx.putImageData(imageData, 0, 0);
  }, [data]);
  return <React.Fragment key="TCData">
    <dt>colored</dt>
    <dd><canvas width={64} height={64} ref={r => ref.current = r} /></dd>
  </React.Fragment>;
}
