import React, { useContext } from 'react';

import type { ValueProps } from '../../parts/types';
import type { ZDO } from '../types';

import { stableHashCode } from '../../../model/utils';
import * as Inventory from '../../../file/Inventory';
import { readBase64 } from '../../../file/base64';
import { data } from '../../../data/itemDB';

import { TranslationContext } from '../../../effects';
import { ItemIcon } from '../../parts/Icon';

const itemsHash = stableHashCode('items');

export function ItemsComp({ value: zdo }: ValueProps<ZDO>) {
  const translate = useContext(TranslationContext);
  const value = zdo.strings.get(itemsHash);
  const items = value ? Inventory.read(readBase64(value)).items : [];
  return <React.Fragment key="items">
    <dt>items</dt>
    <dd><ul>{items.map((item, i) => <li key={i}>
      {item.stack}&times; <ItemIcon item={data[item.id]} useAlt={false} size={16} />{' '}{translate(item.id)}
    </li>)}</ul></dd>
  </React.Fragment>;
}