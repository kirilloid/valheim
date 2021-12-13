import React from 'react';

import type { ValueProps } from '../../parts/types';
import type { ZDO } from '../types';

import { stableHashCode } from '../../../model/utils';
import { Color } from '../../ColorEditor';

export const colorComp = (key: string) => {
  const hash = stableHashCode(key);
  return ({ value: zdo, onChange }: ValueProps<ZDO>) => {
    const vector = zdo.vec3.get(hash) ?? { x: 1, y: 1, z: 1 };
    return <React.Fragment key={key}>
      <dt>{key}</dt>
      <dd><Color value={vector} onChange={val => {
        zdo.vec3.set(hash, val);
        onChange(zdo);
      }} /></dd>
    </React.Fragment>;
  };
};
