import React from 'react';

import type { ValueProps } from '../../parts/types';
import type { ZDO } from '../types';

import { stableHashCode } from '../../../model/utils';
import { objects } from '../../../data/zdo';

export const hashedItemComp = (key: string) => {
  const hash = stableHashCode(key);
  return ({ value: zdo }: ValueProps<ZDO>) => {
    const value = zdo.ints.get(hash) ?? 0;
    return <React.Fragment key={key}>
      <dt>{key}</dt>
      <dd>{objects.get(value)}</dd>
    </React.Fragment>;
  };
};
