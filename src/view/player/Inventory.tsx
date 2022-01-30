import React, { CSSProperties } from 'react';
import classNames from 'classnames';

import type { Item } from '../../types';
import type { Inventory, Inventory as TInventory } from './types';

import '../../css/Inventory.css';

import { data } from '../../data/itemDB';

import { ItemIcon } from '../parts/Icon';

type InvItem = TInventory['items'][number];

const INVENTORY_WIDTH = 8;
const INVENTORY_HEIGHT = 4;
const INVENTORY_SIZE = INVENTORY_WIDTH * INVENTORY_HEIGHT;

export function InvItemView({ invItem, style }: { invItem?: InvItem, style?: CSSProperties }) {
  if (invItem == null) {
    return <div className="Inventory__Item" style={style} />;
  }
  const item = data[invItem.id] as Item | undefined;
  if (item == null) {
    return <div className="Inventory__Item" style={style}>
      <div className="InvItem__Icon">
        <ItemIcon item={item} size={64} />
      </div>
    </div>;
  }

  let durabilityPercent: number | undefined = undefined;
  if ('durability' in item && item.durability[0] !== Infinity) {
    const maxDurability = item.durability[0] + item.durability[1] * (invItem.quality - 1);
    durabilityPercent = invItem.durability / maxDurability;
  }

  return <div
    className={classNames(
      'Inventory__Item',
      { 'Inventory__Item--equipped': invItem.equipped }
    )}
    style={style}
  >
    <div className="InvItem__Icon InvItem__Icon--shadow">
      <ItemIcon item={item} size={64} />
    </div>
    <div className="InvItem__Icon">
      <ItemIcon item={item} size={64} />
    </div>
    {(item.maxLvl ?? 1) > 1 && <div className="InvItem__quality text-outline">
      {invItem.quality}
    </div>}
    {(item.stack ?? 1) > 1 && <div className="InvItem__stack text-outline">
      {invItem.stack}/{item.stack}
    </div>}
    {durabilityPercent != null && <div className="InvItem__durability">
      <div className="InvItem__durability-value" style={{ width: `${100 * durabilityPercent}%` }} />
    </div>}
  </div>
}

export function Inventory({ inventory, extras } : { inventory: TInventory, extras: TInventory[] }) {

  const invMap: (InvItem | undefined)[] = Array.from({ length: INVENTORY_SIZE });
  for (const invItem of inventory.items) {
    const { x, y } = invItem.gridPos;
    invMap[y * INVENTORY_WIDTH + x] = invItem;
  }

  let hasUnknownItems = invMap.some(e => e != null && data[e.id] == null);
  const extraItems = extras.map(inv => inv.items);
  const outOfRangeItems = [];

  for (const e of inventory.items) {
    if (e.gridPos.x >= INVENTORY_WIDTH
    || e.gridPos.y >= INVENTORY_HEIGHT) {
      outOfRangeItems.push(e);
    }
  }
  const hasOutOfRangePos = outOfRangeItems.length > 0;
  if (hasOutOfRangePos) {
    extraItems.push(outOfRangeItems);
  }

  return <>
    <div className="Inventory">
      <div className="Inventory__container">
        {invMap.map((invItem, idx) => {
          const x = idx % INVENTORY_WIDTH;
          const y = Math.floor(idx / INVENTORY_WIDTH);
          const style={
            left: x * 69,
            top: y * 69,
          };
          return <InvItemView key={idx} invItem={invItem} style={style} />
        })}
      </div>
    </div>
    <p>version: {inventory.version}</p>
    {hasUnknownItems && <p className="warning">
      There are unknown items in your inventory possible reasons:
      <ul>
        <li>This program is out of date</li>
        <li>You use mods</li>
        <li>Your inventory is corrupted</li>
      </ul>
    </p>}
    {hasOutOfRangePos && <p className="warning">
      There are items outside of standard inventory. <br />
      If you use mods like V+, then it's OK
    </p>}
    {extraItems.length > 0 && extraItems.map(
      group => <div className="Inventory-extra">{
        group.map(
          (e, i) => <InvItemView key={i} invItem={e} />
        )}
      </div>
    )}
  </>
}
