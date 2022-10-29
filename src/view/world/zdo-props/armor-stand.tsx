import React, { useContext } from 'react';

import type { ValueProps } from '../../parts/types';
import type { ZDO } from '../types';

import { stableHashCode } from '../../../model/hash';
import { data } from '../../../data/itemDB';

import { TranslationContext } from '../../../effects';
import { ItemIcon } from '../../parts/Icon';
import { getEpicLootData } from '../../../mods/epic-loot';

/*
  zdo.Set(index + "_durability", itemData.m_durability);
  zdo.Set(index + "_stack", itemData.m_stack);
  zdo.Set(index + "_quality", itemData.m_quality);
  zdo.Set(index + "_variant", itemData.m_variant);
  zdo.Set(index + "_crafterID", itemData.m_crafterID);
  zdo.Set(index + "_crafterName", itemData.m_crafterName);
 */

/*
  slot: VisSlot, type: ItemType
  ---
  slot: Chest, types: Chest
  slot: Legs, types: Legs
  slot: Helmet, types: Helmet
  slot: BackLeft, types: Shield
  slot: BackRight, types: OneHandedWeapon, Bow, Tool, TwoHandedWeapon, Torch, Attach_Atgeir
  slot: Shoulder, types: Shoulder
  slot: Utility, types: Utility
 */
export function ArmorStandComp({ value: zdo }: ValueProps<ZDO>) {
  const translate = useContext(TranslationContext);
  const items = [0, 1, 2, 3, 4, 5, 6].map(i => zdo.strings.get(stableHashCode(`${i}_item`)));
  return <React.Fragment key="items">
    <dt>items</dt>
    <dd><ul>{items.map((id, i) => {
      const variant = zdo.ints.get(stableHashCode(`${i}_variant`))
      const crafterName = zdo.strings.get(stableHashCode(`${i}_crafterName`)) ?? '';
      const epicLoot = getEpicLootData({ crafterName });
      return !!id && <li key={i}>
        <ItemIcon variant={variant} item={data[id]} useAlt={false} size={16} />
        {' '}
        <span className={epicLoot != null ? 'EpicLoot--' + epicLoot.rarity : ''}>{translate(id)}</span>
      </li>;
    })}</ul></dd>
  </React.Fragment>;
}