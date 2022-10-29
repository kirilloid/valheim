import React, { useContext } from 'react';

import type { Item, Weapon } from '../../../types';
import type { InventoryItem } from '../types';
import type { InvItem } from './types';
import { getEpicLootData } from '../../../mods/epic-loot';

import { data } from '../../../data/itemDB';

import { TranslationContext } from '../../../effects';

function showMoveSpeed(value: number) {
  return `${value > 0 ? '+' : ''}${Math.round(value * 100)}%`;
}

export const MoveSpeed = React.memo(({ invItem, item, equippedItems }: { invItem: InventoryItem; item: Item; equippedItems: InvItem[] }) => {
  const translate = useContext(TranslationContext);
  const epicLoot = getEpicLootData(invItem);
  const moveSpeed = (item as Weapon).moveSpeed as number | undefined;
  let totalMovementModifier = 0;
  
  for (const invItem of equippedItems) {
    const _item = data[invItem.id];
    if (_item == null) continue;
    const _extraData = getEpicLootData(invItem);
    if (_extraData?.effects.RemoveSpeedPenalty != null) continue;
    totalMovementModifier += (_item as Weapon).moveSpeed ?? 0;
  }
  
  return moveSpeed && epicLoot?.effects.RemoveSpeedPenalty == null
    ? <div>
        {translate('ui.moveSpeed')}
        {': '}
        <span className="InvTooltip__value">{showMoveSpeed(moveSpeed)}</span>
        {' '}
        (Total: <span className="InvTooltip__extra">{showMoveSpeed(totalMovementModifier)}</span>)
      </div>
    : null
});

