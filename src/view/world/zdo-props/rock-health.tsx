import React from 'react';

import type { ValueProps } from '../../parts/types';
import type { ZDO } from '../types';

import { stableHashCode } from '../../../model/utils';
import { readBase64 } from './base64';

const healthHash = stableHashCode('health');
export function RockHealthComp({ value }: ValueProps<ZDO>) {
  const str = value.strings.get(healthHash);
  let values: number[] = [];
  if (!str) {
    return <>
      <dt><em>untouched</em></dt><dd></dd>
    </>
  }
  if (str) {
    const pkg = readBase64(str);
    values = pkg.readArray(pkg.readFloat);
  }
  const total = values.reduce((a, b) => a + Math.max(b, 0), 0);
  const broken = values.filter(v => v <= 0);
  return <>
    <dt>pieces</dt>
    <dd>{values.length}</dd>
    <dt>broken</dt>
    <dd>{broken.length}</dd>
    <dt>remaining durability</dt>
    <dd>{Math.round(total * 100) / 100}</dd>
  </>;
}
