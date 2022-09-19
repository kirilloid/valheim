import React from 'react';

import type { ValueProps } from '../../parts/types';
import type { ZDO } from '../types';
import type { PlayersData } from '../../../model/zdo-selectors';

import { stableHashCode } from '../../../model/hash';

export const idComp = (key: string) => {
  const hash = stableHashCode(key);
  return ({ value: zdo, playersData }: ValueProps<ZDO> & { playersData: PlayersData }) => {
    const value = zdo.longs.get(hash);
    const name = value != null ? playersData.names.get(value) : undefined;
    return <React.Fragment key={key}>
      <dt>{key}</dt>
      <dd>{name ? `${name} (${value})` : value ? `#${value}` : '—'}</dd>
    </React.Fragment>;
  };
};
