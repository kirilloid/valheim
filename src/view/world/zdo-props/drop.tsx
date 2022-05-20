import React, { useContext } from 'react';

import type { ValueProps } from '../../parts/types';
import type { ZDO } from '../types';

import { stableHashCode as hash } from '../../../model/hash';
import { prefabHashes } from '../../../data/zdo';
import { TranslationContext } from '../../../effects';

export function DropComp({ value: zdo }: ValueProps<ZDO>) {
  const translate = useContext(TranslationContext);
  const length = zdo.ints.get(hash('drops')) ?? 0;
  const items = [];
  
  for (let i = 0; i < length; i++) {
    const itemHash = zdo.ints.get(hash(`drop_hash${i}`));
    const num = zdo.ints.get(hash(`drop_amount${i}`));
    const item = itemHash != null ? prefabHashes.get(itemHash) : undefined;
    if (item != null && num != null) {
      items.push({ item, num });
    }
  }
  return <React.Fragment key="drop">
    <dt>drop:</dt>
    <dd><ul>{items.map(({ item, num }) =>
      <li key={item}>{translate(item)} &times; {num}</li>)}</ul></dd>
  </React.Fragment>;
}