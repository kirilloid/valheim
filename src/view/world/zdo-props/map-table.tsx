import React from 'react';

import type { ValueProps } from '../../parts/types';
import type { ZDO } from '../types';

import { stableHashCode } from '../../../model/hash';
import * as MapData from '../../../file/MapData';

const MapTableHash = stableHashCode('data');

export function MapTable({ value }: ValueProps<ZDO>) {
  const bytes = value.byteArrays.get(MapTableHash);
  const [data, setData] = React.useState<MapData.SharedData | null>(null);

  const percent = React.useMemo(() => {
    if (!data) return NaN;
    let total = 0;
    for (let byte of data.explored) {
      byte = (byte & 0x55) + ((byte >> 1) & 0x55);
      byte = (byte & 0x33) + ((byte >> 2) & 0x33);
      byte = (byte & 0x0F) + ((byte >> 4) & 0x0F);
      total += byte;
    }
    return total / MapData.TILE_SIZE ** 2 / Math.PI * 4;
  }, [data]);

  React.useEffect(() => {
    if (bytes) {
      MapData.readShared(bytes).then(setData);
    }
  }, [bytes]);

  if (!data) return <><dt>explored</dt><dd>n/a</dd></>;
  return <>
    <dt>explored</dt><dd>{Math.round(percent * 100)}%</dd>
    <dt>map pins</dt><dd>{data.pins.length}</dd>
  </>;
}
