import type { DamageModifiers, Item, Resource, Shield } from '../types';

import { items as armors } from '../data/armors';
import { effects } from '../data/effects';
import { resources } from '../data/resources';
import { items } from '../data/weapons';
import { creatures } from '../data/creatures';

export const shields = items.filter(i => !i.disabled && i.type === 'shield') as Shield[];

export const defaultCreature = creatures.find(c => c.id === 'Greyling')!;

function resistHash(mods: Partial<DamageModifiers>) {
  return Object.entries(mods)
    .sort((a, b) => a[0].localeCompare(b[0]) || a[1]!.localeCompare(b[1]!))
    .map(([type, mod]) => `${type}:${mod}`)
    .join('-');
}
export const allItems = new Map<string, { damageModifiers: Partial<DamageModifiers>; items: Item[] }>();

function addMod(item: Item, damageModifiers?: Partial<DamageModifiers>) {
  if (!damageModifiers) return;
  const hash = resistHash(damageModifiers);
  const el = allItems.get(hash) ?? { damageModifiers, items: [] };
  el.items.push(item);
  allItems.set(hash, el);
}

function addToItems(item: Item & { damageModifiers?: Partial<DamageModifiers> }) {
  const { damageModifiers } = item;
  addMod(item, damageModifiers);
}

function addPower(item: Resource) {
  const { power } = item;
  if (!power) return;
  const effect = effects.find(eff => eff.id === power);
  if (!effect) return;
  const { damageModifiers } = effect;
  addMod(item, damageModifiers);
}

for (const r of resources) {
  if (r.type === 'potion') addToItems(r);
  if (r.type === 'trophy') addPower(r);
}
for (const a of armors) {
  if (a.type === 'armor') addToItems(a);
}
