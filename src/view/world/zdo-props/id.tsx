import React from 'react';

import type { ValueProps } from '../../parts/types';
import type { ZDO } from '../types';

import { stableHashCode } from '../../../model/utils';

export const idComp = (key: string) => {
  const hash = stableHashCode(key);
  return ({ value: zdo }: ValueProps<ZDO>) => {
    const value = zdo.longs.get(hash);
    return <React.Fragment key={key}>
      <dt>{key}</dt>
      <dd>{value ? value.toString() : '—'}</dd>
    </React.Fragment>;
  };
};
