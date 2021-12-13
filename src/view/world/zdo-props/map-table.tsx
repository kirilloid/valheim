import React from 'react';

import type { ValueProps } from '../../parts/types';
import type { ZDO } from '../types';

import { stableHashCode } from '../../../model/utils';
import * as MapData from '../../../file/MapData';

const MapTableHash = stableHashCode('data');

export function MapTable({ value }: ValueProps<ZDO>) {
  const bytes = value.byteArrays.get(MapTableHash);
  if (!bytes) return <><dt>explored</dt><dd>n/a</dd></>;
  const data = MapData.read(bytes);
  let total = 0;
  for (let byte of data.explored) {
    byte = (byte & 0x55) + ((byte >> 1) & 0x55);
    byte = (byte & 0x33) + ((byte >> 2) & 0x33);
    byte = (byte & 0x0F) + ((byte >> 4) & 0x0F);
    total += byte;
  }
  const percent = total / data.tileSize ** 2 / Math.PI * 4;
  return <><dt>explored</dt><dd>{Math.round(percent * 100)}%</dd></>;
}
