import React from 'react';

import type { ValueProps } from '../../parts/types';
import type { ZDO } from '../types';

import { stableHashCode } from '../../../model/hash';

type ExtrasProps = {
  readOnly?: boolean;
  label?: string;
  min?: number;
  max?: number;
};

export const floatComp = (key: string, extraProps: ExtrasProps = {}) => {
  const hash = stableHashCode(key);
  return ({ value: zdo, onChange, max }: ValueProps<ZDO> & { max?: number }) => {
    const defaultValue = 0;
    const value = zdo.floats.get(hash) ?? '';
    return <React.Fragment key={key}>
      <dt>{extraProps.label ?? key}</dt>
      <dd>
        <input type="number" inputMode="numeric"
          max={max}
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
