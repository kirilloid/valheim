import React from 'react';

import type { ValueProps } from '../../parts/types';
import type { ZDO } from '../types';

import { stableHashCode } from '../../../model/utils';
import { locations } from '../../../data/location';

const locationHashes = new Map<number, string>();
for (const loc of locations) {
  for (const variation of loc.variations) {
    const key = loc.id + variation.subtype;
    const hash = stableHashCode(key);
    locationHashes.set(hash, key);
  }
}

export const hashedLocationComp = (key: string) => {
  const hash = stableHashCode(key);
  return ({ value: zdo }: ValueProps<ZDO>) => {
    const value = zdo.ints.get(hash) ?? 0;
    return <React.Fragment key={key}>
      <dt>{key}</dt>
      <dd>{locationHashes.get(value)}</dd>
    </React.Fragment>;
  };
};
