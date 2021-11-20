import type { Item } from '../../types';
import type { Inventory as TInventory } from './types';

import { data } from '../../data/itemDB';

import { ItemIcon } from '../parts/Icon';

export function Inventory({ inventory } : { inventory: TInventory }) {
  return <div style={{ position: 'relative', width: 560, height: 280, backgroundColor: '#503A2B' }}>
    {inventory.items.map(invItem => {
      const item = data[invItem.id] as Item | undefined;
      const { x, y } = invItem.gridPos;
      if (item == null) return null;
      return <div key={`${x}_${y}`} style={{
        position: 'absolute',
        left: x * 70 + 3,
        top: y * 70 + 3,
        width: 64,
        height: 64,
        backgroundColor: invItem.equiped ? '#5D97CC' : 'transparent',
      }}>
        <div style={{ position: 'absolute', left: 2, top: 2, filter: 'brightness(0) blur(2px) opacity(0.75)' }}>
          <ItemIcon item={item} size={64} />
        </div>
        <div style={{ position: 'absolute', left: 0, top: 0 }}>
          <ItemIcon item={item} size={64} />
        </div>
        {(item.maxLvl ?? 1) > 1 && <div className="text-outline"
            style={{ position: 'absolute', right: 4, top: 0, color: 'orange' }}>
          {invItem.quality}
        </div>}
        {(item.stack ?? 1) > 1 && <div className="text-outline"
            style={{ position: 'absolute', left: 4, right: 4, bottom: 0, color: 'white', textAlign: 'center' }}>
          {invItem.stack}/{item.stack}
        </div>}
        {'durability' in item && item.durability[0] !== Infinity && <div
            style={{ position: 'absolute', left: 4, right: 4, bottom: 4, height: 4, background: '#0008' }}>
          <div style={{ height: '100%', width: `${Math.round(56 * invItem.durability / (item.durability[0] + item.durability[1] * invItem.quality))}px`, backgroundColor: 'white' }}></div>
        </div>}
      </div>
    })}
  </div>
}