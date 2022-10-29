import React, { useContext } from 'react';

import type { Item } from '../../../types';
import type { InvItem } from './types';
import { getEpicLootData, getMaxDurability } from '../../../mods/epic-loot';

import { TranslationContext } from '../../../effects';

export const Durability = React.memo(({ invItem, item }: { invItem: InvItem; item: Item }) => {
  const translate = useContext(TranslationContext);
  const epicLoot = getEpicLootData(invItem);
  const [maxDurability, resultMaxDurability] = getMaxDurability(invItem, item, epicLoot);
  const rarityClass = `EpicLoot--${epicLoot?.rarity ?? 'Generic'}`;

  if (!isFinite(maxDurability)) return null;
  if (!isFinite(resultMaxDurability)) return <div>
    {translate('ui.durability')}
    {': '}
    <span className={rarityClass}>{translate('ui.mod.EpicLoot.effect.Indestructible')}</span>
  </div>
  return <div>
    {translate('ui.durability')}
    {': '}
    <span className={maxDurability === resultMaxDurability ? 'InvTooltip__value' : rarityClass}>{Math.round(100 * invItem.durability / resultMaxDurability)}%</span>
    {' '}
    <span className="InvTooltip__extra">({Math.round(invItem.durability)}/{resultMaxDurability})</span>
  </div>
});
