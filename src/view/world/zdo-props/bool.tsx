import React from 'react';

import type { ValueProps } from '../../parts/types';
import type { ZDO } from '../types';

import { stableHashCode } from '../../../model/utils';

export const boolComp = (key: string, { readonly = false, hashFn = stableHashCode } = {}) => {
  const hash = hashFn(key);
  return ({ value: zdo, onChange }: ValueProps<ZDO>) => {
    const value = zdo.ints.get(hash) === 1;
    return <React.Fragment key={key}>
      <dt>{key}</dt>
      <dd><input type="checkbox" disabled={readonly} checked={value}
        onChange={e => {
          zdo.ints.set(hash, e.target.checked ? 1 : 0);
          onChange(zdo);
        }} /></dd>
    </React.Fragment>;
  };
};