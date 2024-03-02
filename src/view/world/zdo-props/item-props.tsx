import React from 'react';

import type { ValueProps } from '../../parts/types';
import type { ZDO } from '../types';
import type { Item } from '../../../types';

import { stableHashCode } from '../../../model/hash';
import { prefabHashes } from '../../../data/zdo';
import { floatComp } from './float';
import { intComp } from './int';
import { data } from '../../../data/itemDB';

const Durability = floatComp('durability'); // only for wearables
const Stack = intComp('stack'); // maxStack
const Quality = intComp('quality'); // only if maxQuality 
const Variant = intComp('variant'); // shields and linen capes

const QUALITY = stableHashCode('quality');
const WORLD_LEVEL = stableHashCode('worldLevel');

export function ItemPropsComp({ value: zdo, onChange }: ValueProps<ZDO>) {
  const id = prefabHashes.get(zdo.prefab);
  const obj = id != null ? data[id] : undefined;
  const maxStack = (obj as Item)?.stack ?? 1;
  const maxDurability = (obj as any)?.durability;
  const maxQuality = (obj as Item)?.maxLvl ?? 1;
  const variants = (obj as Item)?.variants ?? 0;
  const quality = zdo.ints.get(QUALITY) ?? 1;
  const worldLevel = zdo.ints.get(WORLD_LEVEL);
  return <React.Fragment key="ItemProps">
    {!!maxDurability && <Durability value={zdo} onChange={onChange} max={maxDurability[0] + (quality - 1) * maxDurability[1]} />}
    {maxStack > 1 && <Stack value={zdo} onChange={onChange} max={maxStack} />}
    {maxQuality > 1 && <Quality value={zdo} onChange={onChange} max={maxQuality} />}
    {variants > 0 && <Variant value={zdo} onChange={onChange} max={variants - 1} />}
    {worldLevel != null && intComp('worldLevel', { min: 0, max: 10, readOnly: true })}
  </React.Fragment>;
};
