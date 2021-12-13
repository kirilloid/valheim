import React from 'react';

import type { ValueProps } from '../../parts/types';
import type { ZDO } from '../types';

import { stableHashCode } from '../../../model/utils';

type ExtrasProps = {
  readonly?: boolean;
  min?: number;
  max?: number;
};

export const floatComp = (key: string, extraProps: ExtrasProps = {}) => {
  const hash = stableHashCode(key);
  return ({ value: zdo, onChange }: ValueProps<ZDO>) => {
    const defaultValue = 0;
    const value = zdo.floats.get(hash) ?? '';
    return <React.Fragment key={key}>
      <dt>{key}</dt>
      <dd>
        <input type="number"
          {...extraProps}
          placeholder={String(defaultValue)}
          value={value}
          onChange={e => {
            zdo.floats.set(hash, Number(e.target.value));
            onChange(zdo);
          }} />
      </dd>
    </React.Fragment>;
  };
};
