import React, { useContext } from 'react';

import type { ValueProps } from '../../parts/types';
import type { ZDO } from '../types';

import { groupBy } from '../../../model/utils';
import { stableHashCode as strHash } from '../../../model/hash';
import { TranslationContext } from '../../../effects';

export function SmelterQueueComp({ value: zdo }: ValueProps<ZDO>) {
  const translate = useContext(TranslationContext);
  const length = zdo.ints.get(strHash('queued')) ?? 0;
  const items = [];
  for (let i = 0; i < length; i++) {
    items.push(zdo.strings.get(strHash(`item${i}`))!);
  }
  const pairs = Object.entries(groupBy(items, x => x));
  return <React.Fragment key="queue">
    <dt>queue:</dt>
    <dd>{pairs.length > 0
      ? <ul>{pairs.map(([key, list]) =>
          <li key={key}>{translate(key)} &times; {list.length}</li>)}
        </ul>
      : <em>empty</em>
    }</dd>
  </React.Fragment>;
}