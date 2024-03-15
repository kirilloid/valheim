import type { Bomb, DamageModifiers, Effect, EntityId, Item, Shield, Weapon } from '../../types';

import { items as armors } from '../../data/armors';
import { effects } from '../../data/effects';
import { resources } from '../../data/resources';
import { items } from '../../data/weapons';

const enabledWeapons = items
  .filter(i => !i.disabled)
  .filter((i): i is Weapon | Shield => i.type !== 'bomb');

export const blockers = {
  shields: [] as Shield[],
  weapons2H: [] as Weapon[],
  weapons: []as Weapon[],
};

for (const item of enabledWeapons) {
  if (item.type === 'shield') {
    blockers.shields.push(item);
  } else if (item.slot === 'both') {
    blockers.weapons2H.push(item); 
  } else {
    blockers.weapons.push(item);
  }
}

export function getItemById(id: EntityId | undefined): Weapon | Shield | undefined {
  return enabledWeapons.find(i => i.id === id);
}

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
