import React, { useContext } from 'react';

import type { Item, ItemSet } from '../../../types';
import type { InvItem } from './types';

import { EpicLootData, getEpicLootData, LegendaryItemSet } from '../../../mods/epic-loot';

import { TranslationContext } from '../../../effects';
import { SetBonus } from './set-bonus';

function EpicLootSetBonusTooltip({ set, item, equippedItems }: { set: ItemSet | undefined; item: Item; equippedItems: InvItem[] }) {
  const translate = useContext(TranslationContext);
  if (set == null) return null;
  const equippedItemIds = new Set<string>(equippedItems.map(invItem => invItem.id));
  const equippedTotal = set.items.filter(id => equippedItemIds.has(id)).length;
  return <div className="InvTooltip__Set">
    <header className="InvTooltip__SetHeader">Set: {set.name} ({equippedTotal}/{set.items.length})</header>
    <ul className="InvTooltip__SetItems">
      {set.items.map(id => <li key={id}
        className={equippedItemIds.has(item.id)
          ? 'InvTooltip__SetItem--equipped'
          : 'InvTooltip__SetItem--unequipped'}
      >{translate(id)}</li>)}
    </ul>
    <ul className="InvTooltip__SetBonuses">
      {set.bonus.map((bonus, n) => bonus == null ? null : <li key={n}
        className={n + 1 <= equippedTotal 
          ? 'InvTooltip__SetItem--equipped'
          : 'InvTooltip__SetItem--unequipped'}
      >({n + 1}) <SetBonus bonus={bonus} /></li>)}
    </ul>
  </div>
}

function EpicLootLegendarySetBonusTooltip({ set, item, equippedItems }: { set: LegendaryItemSet | undefined; item: Item; equippedItems: InvItem[] }) {
  const translate = useContext(TranslationContext);
  if (set == null) return null;
  const equippedLegendaryItemIds = new Set(
    equippedItems
      .map(invItem => getEpicLootData(invItem)?.legendaryId)
      .filter(Boolean)
  );
  let equippedTotal = 0;
  const equippedByIndex: boolean[] = [];
  for (const id of set.items) {
    const equipped = equippedLegendaryItemIds.has(id);
    if (equipped) equippedTotal++;
    equippedByIndex.push(equipped);
  }
  return <div className="InvTooltip__Set">
    <header className="InvTooltip__SetHeader">Set: {translate(`ui.mod.EpicLoot.legendarySet.${set.name}`)} ({equippedTotal}/{set.items.length})</header>
    <ul className="InvTooltip__SetItems">
      {set.items.map((id, i) => <li key={id}
        className={equippedByIndex[i]
          ? 'InvTooltip__SetItem--equipped'
          : 'InvTooltip__SetItem--unequipped'}
      >{translate(`ui.mod.EpicLoot.legendary.${id}`)}</li>)}
    </ul>
    <ul className="InvTooltip__SetBonuses">
      {set.effects.map((effect, n) => effect != null && Object.entries(effect).flatMap(([key, value], i) => <li key={n * 10 + i}
          className={n + 1 <= equippedTotal 
            ? 'InvTooltip__SetItem--equipped'
            : 'InvTooltip__SetItem--unequipped'}
        >({n + 1}) {translate(`ui.mod.EpicLoot.effect.${key}`, value!)}</li>))
      }
    </ul>
  </div>
}

function EpicLootTooltipBaseProps({ effects, rarity, augmentedIndex }: EpicLootData) {
  const translate = useContext(TranslationContext);
  return <ul className={`InvTooltip__EpicLoot EpicLoot--${rarity}`}>{
    Object.entries(effects).map(([key, value], i) => <li key={key} className={augmentedIndex === i ? 'EpicLoot--Augmented' : ''}>
      {translate(`ui.mod.EpicLoot.effect.${key}`, value!)}
    </li>)}
  </ul>
}

export const SetName = React.memo(({ epicLoot }: { epicLoot: EpicLootData | undefined }) => {
  const translate = useContext(TranslationContext);
  const rarityClass = `EpicLoot--${epicLoot?.rarity ?? 'Generic'}`;
  return epicLoot
    ? <p>
        {epicLoot.set?.name && <div className={rarityClass}>{translate(`ui.mod.EpicLoot.legendarySet.${epicLoot.set.name}`)}</div>}
        {epicLoot.legendaryId && <div className={rarityClass}>{translate(`ui.mod.EpicLoot.legendary.${epicLoot.legendaryId}`)}</div>}
      </p>
    : null
});

export function SetBonusTooltip({ set, item, epicLoot, equippedItems }: { set: any; item: Item; epicLoot: EpicLootData; equippedItems: InvItem[] }) {
  return <>
    <EpicLootSetBonusTooltip set={set} item={item} equippedItems={equippedItems} />
    <EpicLootLegendarySetBonusTooltip set={epicLoot.set} item={item} equippedItems={equippedItems} />
    <EpicLootTooltipBaseProps {...epicLoot} />
  </>
}
