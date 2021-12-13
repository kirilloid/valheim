import React from 'react';

import type { ValueProps } from '../../parts/types';
import type { ZDO } from '../types';

import { stableHashCode } from '../../../model/utils';

export const enumComp = (key: string, options: [number, string][]) => {
  const hash = stableHashCode(key);
  const htmlOptions = options.map(([value, text]) => <option value={value} key={value}>{text}</option>);
  return ({ value: zdo, onChange }: ValueProps<ZDO>) => {
    const value = zdo.ints.get(hash) ?? '';
    return <React.Fragment key={key}>
      <dt>{key}</dt>
      <dd>
        <select value={value} onChange={e => {
          zdo.ints.set(hash, Number(e.target.value));
          onChange(zdo);
        }}>
          {htmlOptions}
        </select>
      </dd>
    </React.Fragment>;
  };
};
