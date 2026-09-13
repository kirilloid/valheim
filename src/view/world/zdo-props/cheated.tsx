import React from 'react';

import type { ValueProps } from '../../parts/types';
import type { ZDO } from '../types';

import { stableHashCode } from '../../../model/hash';

const hash = stableHashCode('cheated');

export function cheatedMark({ value: zdo }: ValueProps<ZDO>) {
  const value = zdo.ints.get(hash) === 1;
  return value ? <React.Fragment key="cheated">
    <dt>cheated</dt>
    <dd><em>this object was created via cheating</em></dd>
  </React.Fragment> : null;
};
