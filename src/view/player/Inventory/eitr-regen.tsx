import React, { useContext } from 'react';

import type { Item, Armor } from '../../../types';
import type { InvItem } from './types';

import { data } from '../../../data/itemDB';

import { TranslationContext } from '../../../effects';

function showEitrRegen(value: number) {
  return `+${value.toFixed(2).replace(/\.?0+$/, '')}/s`;
}

export const EitrRegen = React.memo(({ item, equippedItems }: { item: Item; equippedItems: InvItem[] }) => {
  const translate = useContext(TranslationContext);
  const eitrRegen = (item as any).eitrRegen ?? 0;
  let totalEitrRegen = 0;
  
  for (const invItem of equippedItems) {
    const _item = data[invItem.id];
    if (_item == null) continue;
    totalEitrRegen += (_item as any).eitrRegen ?? 0;
  }
  
  return eitrRegen
    ? <div>
        {translate('ui.eitrRegen')}
        {': '}
        <span className="InvTooltip__value">{showEitrRegen(eitrRegen)}</span>
        {' '}
        (Total: <span className="InvTooltip__extra">{showEitrRegen(totalEitrRegen)}</span>)
      </div>
    : null
});

