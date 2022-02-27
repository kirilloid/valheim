import React, { useContext } from 'react';

import type { ValueProps } from '../../parts/types';
import type { ZDO } from '../types';

import { stableHashCode } from '../../../model/utils';
import * as Inventory from '../../../file/Inventory';
import { readBase64 } from '../../../file/base64';
import { data } from '../../../data/itemDB';

import { TranslationContext } from '../../../effects';
import { ItemIcon } from '../../parts/Icon';
import { extractExtraData } from '../../../mods/epic-loot';
import { Shield } from '../../../types';

const itemsHash = stableHashCode('items');

export function ItemsComp({ value: zdo }: ValueProps<ZDO>) {
  const translate = useContext(TranslationContext);
  const value = zdo.strings.get(itemsHash);
  const items = value ? Inventory.read(readBase64(value)).items : [];
  return <React.Fragment key="items">
    <dt>items</dt>
    <dd><ul>{items.map((item, i) => {
      const extraData = extractExtraData(item);
      return <li key={i}>
        {item.stack}&times;{' '}
        <ItemIcon item={data[item.id]} variant={item.variant} useAlt={false} size={16} />
        {' '}
        <span className={extraData != null ? 'EpicLoot--' + extraData.rarity : ''}>{translate(item.id)}</span>
      </li>;
    })}</ul></dd>
  </React.Fragment>;
}

const itemHash = stableHashCode('item');
const variantHash = stableHashCode('variant');

export function ItemComp({ value: zdo }: ValueProps<ZDO>) {
  const translate = useContext(TranslationContext);
  const id = zdo.strings.get(itemHash);
  const variant = zdo.ints.get(variantHash);
  const item = id != null ? data[id] : undefined;
  return <React.Fragment key="items">
    <dt>item</dt>
    <dd>{item != null
      ? <> 
        <ItemIcon item={item} variant={variant} useAlt={false} size={16} />
        {' '}
        <span>{translate(item.id)}</span>
      </>
      : '—'
    }</dd>
  </React.Fragment>;
}