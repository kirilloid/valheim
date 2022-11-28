import React from 'react';

import type { ValueProps } from '../../parts/types';
import type { ZDO } from '../types';

import { stableHashCode } from '../../../model/hash';

export const stringComp = (key: string, extraProps: { readOnly?: boolean } = {}) => {
  const hash = stableHashCode(key);
  return ({ value: zdo, onChange }: ValueProps<ZDO>) => {
    const value = zdo.strings.get(hash) ?? '';
    return <React.Fragment key={key}>
      <dt>{key}</dt>
      <dd><input type="text" value={value}
        readOnly={extraProps.readOnly}
        onChange={e => {
          zdo.strings.set(hash, e.target.value);
          onChange(zdo);
        }} /></dd>
    </React.Fragment>;
  };
};
