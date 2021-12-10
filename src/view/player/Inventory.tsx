import React from 'react';
import classNames from 'classnames';

import type { Item } from '../../types';
import type { Inventory as TInventory } from './types';

import '../../css/Inventory.css';

import { data } from '../../data/itemDB';

import { ItemIcon } from '../parts/Icon';

export function Inventory({ inventory } : { inventory: TInventory }) {
  return <div className="Inventory">
    {inventory.items.map(invItem => {
      const item = data[invItem.id] as Item | undefined;
      const { x, y } = invItem.gridPos;
      if (item == null) return null;
      return <div key={`${x}_${y}`} className={classNames('Inventory__Item', { 'Inventory__Item--equipped': invItem.equipped })}
        style={{
          left: x * 69 + 22,
          top: y * 69 + 16,
        }}>
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
        {'durability' in item && item.durability[0] !== Infinity && <div className="InvItem__durability">
          <div className="InvItem__durability-value" style={{ width: Math.round(56 * invItem.durability / (item.durability[0] + item.durability[1] * invItem.quality)) }}></div>
        </div>}
      </div>
    })}
  </div>
}