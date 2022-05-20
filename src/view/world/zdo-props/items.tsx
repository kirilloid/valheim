import React, { useContext } from 'react';

import type { ValueProps } from '../../parts/types';
import type { ZDO } from '../types';
import type { Item } from '../../../types';

import { stableHashCode } from '../../../model/hash';
import { VirtualItem } from '../../../model/zdo-containers';
import * as Inventory from '../../../file/Inventory';
import { readBase64 } from '../../../file/base64';
import { data } from '../../../data/itemDB';

import { TranslationContext } from '../../../effects';
import { ItemIcon } from '../../parts/Icon';
import { extractExtraData, getMaxDurability } from '../../../mods/epic-loot';
import { yesNo } from '../../helpers';

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

function ItemPropEditor({ label, prop, value, max, onChange }: {
  label: string;
  prop: string;
  value: number;
  onChange: (value: number) => void;
  max: number;
}) {
  return <>
    <dt><label htmlFor={prop}>{label}</label></dt>
    <dd><input type="number" id={prop} value={value} max={max}
      onChange={e => onChange(Number(e.target.value))} /></dd>
  </>
}

export function ContainedItemComp({
  value: zdo,
  onChange,
  index,
}: ValueProps<ZDO> & { index: number }) {
  const item = VirtualItem(zdo, index, onChange);
  const translate = useContext(TranslationContext);
  if (item == null) return null;
  const obj = data[item.id] as Item | undefined;
  if (obj == null) return null;
  const extraData = extractExtraData(item);
  const maxStack = obj.stack ?? 1;
  const maxDurability = getMaxDurability(item, obj, extraData)[1];
  const maxQuality = obj.maxLvl ?? 1;
  const variants = obj.variants ?? 0;
  
  return <>
    {maxDurability > 0 && (
      isFinite(maxDurability)
      ? <ItemPropEditor key="durability"
          label={translate('ui.durability')}
          prop='durability'
          value={item.durability}
          max={maxDurability}
          onChange={value => {
            item.durability = value;
            onChange(zdo);
          }}
        />
      : <React.Fragment key="durability">
          <dt><label>{translate('ui.durability')}</label></dt>
          <dd>Indestructible</dd>
        </React.Fragment>
    )}
    {maxStack > 1 && <ItemPropEditor key="stack"
      label={translate('ui.stack')}
      prop='stack'
      value={item.stack}
      max={maxStack}
      onChange={value => {
        item.stack = value;
        onChange(zdo);
      }}
    />}
    {maxQuality > 1 && <ItemPropEditor key="quality"
      label={translate('ui.quality')}
      prop='quality'
      value={item.quality}
      max={maxQuality}
      onChange={value => {
        item.quality = value;
        onChange(zdo);
      }}
    />}
    {variants > 0 && <ItemPropEditor key="variant"
      label={translate('ui.variant')}
      prop='variant'
      value={item.variant}
      max={variants - 1}
      onChange={value => {
        item.variant = value;
        onChange(zdo);
      }}
    />}
    {extraData != null && <>
      <dt>rarity</dt><dd>{extraData.rarity}</dd>
      {Object.entries(extraData?.effects ?? {})
        .map(([key, val], i) => <React.Fragment key={key}>
          <dt>{extraData.augmentedIndex === i ? <em>augmented</em> : ''}</dt>
          <dd>{translate(`ui.mod.EpicLoot.effect.${key}`, val)}</dd>
        </React.Fragment>)}
    </>}
  </>;
};

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