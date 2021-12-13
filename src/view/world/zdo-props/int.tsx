import React from 'react';

import type { ValueProps } from '../../parts/types';
import type { ZDO } from '../types';

import { stableHashCode } from '../../../model/utils';

type ExtrasProps = {
  readonly?: boolean;
  min?: number;
  max?: number;
}

export const intComp = (key: string, extraProps: ExtrasProps = {}) => {
  const hash = stableHashCode(key);
  return ({ value: zdo, onChange }: ValueProps<ZDO>) => {
    const value = zdo.ints.get(hash) ?? '';
    return <React.Fragment key={key}>
      <dt>{key}</dt>
      <dd>
        <input type="number"
          {...extraProps}
          value={value}
          onChange={e => {
            zdo.ints.set(hash, Number(e.target.value));
            onChange(zdo);
          }} />
      </dd>
    </React.Fragment>;
  };
};
