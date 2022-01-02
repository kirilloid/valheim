import type { DamageModifiers, Effect, Item, Shield } from '../types';

import { items as armors } from '../data/armors';
import { effects } from '../data/effects';
import { resources } from '../data/resources';
import { items } from '../data/weapons';

export const shields = items.filter(i => !i.disabled && i.type === 'shield') as Shield[];

function resistHash(mods: Partial<DamageModifiers>) {
  return Object.entries(mods)
    .sort((a, b) => a[0].localeCompare(b[0]) || a[1]!.localeCompare(b[1]!))
    .map(([type, mod]) => `${type}:${mod}`)
    .join('-');
}
export const allItems = new Map<string, { damageModifiers: Partial<DamageModifiers>; items: (Item | Effect)[] }>();

function addMod(item: Item | Effect, damageModifiers?: Partial<DamageModifiers>) {
  if (!damageModifiers) return;
  const hash = resistHash(damageModifiers);
  const el = allItems.get(hash) ?? { damageModifiers, items: [] };
  el.items.push(item);
  allItems.set(hash, el);
}

function addToItems(
  item: Item & { damageModifiers?: Partial<DamageModifiers> },
  extraDamageModifiers?: Partial<DamageModifiers>
) {
  const damageModifiers = extraDamageModifiers ?? item.damageModifiers;
  addMod(item, damageModifiers);
}

function addEffect(effect: Effect) {
  const { damageModifiers } = effect;
  addMod(effect, damageModifiers);
}

for (const r of resources) {
  if (r.Potion != null) addToItems(r, r.Potion.damageModifiers);
}
for (const a of armors) {
  if (a.type === 'armor') addToItems(a);
}
for (const e of effects) {
  addEffect(e);
}
