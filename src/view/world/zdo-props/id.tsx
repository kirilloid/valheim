import React from 'react';

import type { ValueProps } from '../../parts/types';
import type { ZDO } from '../types';

import { stableHashCode } from '../../../model/hash';

export const idComp = (key: string) => {
  const hash = stableHashCode(key);
  return ({ value: zdo, playersMap }: ValueProps<ZDO> & { playersMap?: Map<bigint, string> }) => {
    const value = zdo.longs.get(hash);
    const name = value != null ? playersMap?.get(value) : undefined;
    return <React.Fragment key={key}>
      <dt>{key}</dt>
      <dd>{name ? `${name} (${value})` : value ? `#${value}` : '—'}</dd>
    </React.Fragment>;
  };
};
