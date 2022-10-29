import React, { useContext } from 'react';

import type { Item, Weapon } from '../../../types';
import type { InvItem } from './types';

import { TranslationContext } from '../../../effects';

export const CommonStats = React.memo(({ invItem, item }: { invItem: InvItem; item: Item }) => {
  const translate = useContext(TranslationContext);
  const slot = (item as Weapon).slot as string | undefined;
  return <>
    {slot != null && <div>{translate(`ui.slot.${slot}`)}</div>}
    {invItem.crafterID ? <div>
      Crafted by: <span className="InvTooltip__value">{invItem.crafterName.replace(/^<\|c\|>(.*?)(<.*|$)/, '$1')}</span>
    </div> : null}
    <div>
      {translate('ui.weight')}:
      {' '}<span className="InvTooltip__value">{(invItem.stack * item.weight).toFixed(1)}</span>
    </div>
    {(item.maxLvl ?? 1) > 1 && <div>
      {translate('ui.quality')}: <span className="InvTooltip__value">{invItem.quality}</span>
    </div>}
    </>
});
