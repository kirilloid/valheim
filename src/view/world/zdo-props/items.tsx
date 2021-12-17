import React, { useContext } from 'react';

import type { ValueProps } from '../../parts/types';
import type { ZDO } from '../types';

import { stableHashCode } from '../../../model/utils';
import * as Inventory from '../../../file/Inventory';
import { readBase64 } from './base64';

import { TranslationContext } from '../../../effects';

const itemsHash = stableHashCode('items');

export function ItemsComp({ value: zdo }: ValueProps<ZDO>) {
  const translate = useContext(TranslationContext);
  const value = zdo.strings.get(itemsHash);
  const items = value ? Inventory.read(readBase64(value)).items : [];
  return <React.Fragment key="items">
    <dt>items</dt>
    <dd><ul>{items.map((item, i) => <li key={i}>
      {item.stack}&times; {translate(item.id)}
    </li>)}</ul></dd>
  </React.Fragment>;
}