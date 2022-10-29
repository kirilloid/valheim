import React, { CSSProperties } from 'react';

import type { Item } from '../../../types';
import type { InvItem } from './types';
import { getEpicLootData, getMaxDurability } from '../../../mods/epic-loot';

import { data } from '../../../data/itemDB';

import { ItemIcon } from '../../parts/Icon';

export function InvItemView({ invItem, style, onTooltip }: {
  invItem?: InvItem,
  style?: CSSProperties,
  onTooltip: (invItem: InvItem) => void,
}) {
  if (invItem == null) {
    return <div className="Inventory__Item" style={style} />;
  }
  const item = data[invItem.id] as Item | undefined;
  if (item == null) {
    return <div className="Inventory__Item" style={style} onMouseMove={() => onTooltip(invItem)}>
      <div className="InvItem__Icon">
        <ItemIcon item={item} size={64} />
      </div>
    </div>;
  }

  const epicLoot = getEpicLootData(invItem);

  const [, maxDurability] = getMaxDurability(invItem, item, epicLoot);
  const classes = ['Inventory__Item'];
  if (invItem.equipped) {
    classes.push('Inventory__Item--equipped');
  }
  if (epicLoot) {
    classes.push('Inventory__Item--EpicLoot');
    if (epicLoot.rarity !== 'Generic') {
      classes.push(`Inventory__Item--EpicLoot-${epicLoot.rarity}`);
    }
  }

  const { variant } = invItem;

  return <div
    className={classes.join(' ')}
    style={style}
  >
    <div className="InvItem__Icon InvItem__Icon--shadow">
      <ItemIcon item={item} size={64} variant={variant} />
    </div>
    <div className="InvItem__Icon" onMouseMove={() => onTooltip(invItem)}>
      <ItemIcon item={item} size={64} variant={variant} />
    </div>
    {(item.maxLvl ?? 1) > 1 && <div className="InvItem__quality text-outline">
      {invItem.quality}
    </div>}
    {(item.stack ?? 1) > 1 && <div className="InvItem__stack text-outline">
      {invItem.stack}/{item.stack}
    </div>}
    {isFinite(maxDurability) && <div className="InvItem__durability">
      <div className="InvItem__durability-value" style={{ width: `${100 * invItem.durability / maxDurability}%` }} />
    </div>}
  </div>
}

