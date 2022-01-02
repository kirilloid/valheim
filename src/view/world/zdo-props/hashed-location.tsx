import React from 'react';

import type { ValueProps } from '../../parts/types';
import type { ZDO } from '../types';

import { stableHashCode } from '../../../model/utils';
import { locationHashes } from '../../../data/location-hashes';

export const hashedLocationComp = (key: string) => {
  const hash = stableHashCode(key);
  return ({ value: zdo }: ValueProps<ZDO>) => {
    const value = zdo.ints.get(hash) ?? 0;
    return <React.Fragment key={key}>
      <dt>{key}</dt>
      <dd>{locationHashes.get(value) ?? (value >>> 0).toString(16).padStart(8, '0')}</dd>
    </React.Fragment>;
  };
};
