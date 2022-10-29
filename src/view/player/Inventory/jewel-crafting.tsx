import React, { useContext } from 'react';

import type { InvItem } from './types';
import { GemEffect, getItemGemEffects } from '../../../mods/jewel-crafting';

import { TranslationContext } from '../../../effects';

export function JewelCraftingTooltip({ invItem }: { invItem: InvItem }) {
  const translate = useContext(TranslationContext);
  const effects = getItemGemEffects(invItem);
  if (effects == null) return null;

  const entries = [...effects.entries()].filter(([, value]) => value);
  if (entries.length === 0) return null;
  return <ul>{
    entries.map(([key, value]) => <li key={key}>
      {translate(`ui.mod.JewelCrafting.effect.${GemEffect[key]}`)}: {value}
    </li>)}
  </ul>
}