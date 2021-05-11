import React from 'react';
import { DamageProfile, DamageType } from '../types';
import { Icon } from './Icon';

export function durability(values: [number, number], level?: number): string | number {
  if (values[0] === Infinity) return 'indestructible';
  if (values[1] === 0) return values[0]
  return showPair(values, level);
}

export function showPair(values: number | [number, number], level?: number): string | number {
  if (typeof values === 'number') return values;
  return level == null ? values.join('+') : values[0] + values[1] * (level - 1)
}

export function shortWeaponDamage(damage: DamageProfile) {
  // tools
  if (damage[DamageType.Pickaxe]) {
    return <>
      <Icon type="skills" id="Pickaxes" size={16} />
      {damage[DamageType.Pickaxe]}
    </>
  }
  if (damage[DamageType.Chop]) {
    return <>
      <Icon type="skills" id="Woodcutting" size={16} />
      {damage[DamageType.Chop]}
    </>
  }
  // physical
  const physical = (damage[DamageType.Slash] ?? 0)
                + (damage[DamageType.Pierce] ?? 0)
                + (damage[DamageType.Blunt] ?? 0);
  // elemental
  const {
    [DamageType.Fire]: fire,
    [DamageType.Frost]: frost,
    [DamageType.Poison]: poison,
    [DamageType.Lightning]: lightning,
    [DamageType.Spirit]: spirit,
  } = damage;
  const obj = { physical, fire, frost, poison, lightning, spirit };
  return Object.entries(obj)
    .filter(kv => kv[1])
    .map(kv => <span className={`damage--${kv[0]}`}>{kv[1]}</span>)
    .flatMap((item, i) => i ? [' + ', item] : [item]);
}

export const weaponDamage = shortWeaponDamage;

export function shortCreatureDamage(damage: DamageProfile) {
  // physical
  const physical = (damage[DamageType.Slash] ?? 0)
                + (damage[DamageType.Pierce] ?? 0)
                + (damage[DamageType.Blunt] ?? 0);
  // elemental
  const {
    [DamageType.Fire]: fire,
    [DamageType.Frost]: frost,
    [DamageType.Poison]: poison,
    [DamageType.Lightning]: lightning,
    [DamageType.Spirit]: spirit,
  } = damage;
  const obj = { physical, fire, frost, poison, lightning, spirit };
  return Object.entries(obj)
    .filter(kv => kv[1])
    .map(kv => <span className={`damage--${kv[0]}`}>{kv[1]}</span>)
    .flatMap((item, i) => i ? [' + ', item] : [item]);
}