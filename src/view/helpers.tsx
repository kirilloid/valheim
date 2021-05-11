import React, { useContext } from 'react';
import { groupBy } from 'lodash-es';

import {
  DamageModifier,
  DamageModifiers,
  DamageProfile,
  DamageType,
  ItemSpecial as TItemSpecial
} from '../types';
import { Icon } from './Icon';
import { TranslationContext } from '../translation.effect';

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
    .flatMap((item, i) => i ? ['+', item] : [item]);
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
    .flatMap((item, i) => i ? ['+', item] : [item]);
}

function damageTypesList(list: [string, any][]): string {
  return list.map(([v]) => DamageType[v as any]).join(', ');
} 

export function ItemSpecial({ special }: { special: TItemSpecial }) {
  const translate = useContext(TranslationContext);
  if (special == null) return null;
  return (<>
    <dt>{translate(`ui.itemSpecial`)}</dt>
    <dd>{translate(`ui.itemSpecial.${special}`)}</dd>
  </>);
}

export function Resistances({ mods }: { mods: DamageModifiers }) {
  const translate = useContext(TranslationContext);
  const res = groupBy(Object.entries(mods), ([, val]) => val);
  const result = [];
  for (const [key, val] of Object.entries(res)) {
    if (key === String(DamageModifier.Normal)
    ||  key === String(DamageModifier.Ignore)) {
      continue;
    }
    result.push(
      <dt>{translate(`ui.damageModifier.${DamageModifier[+key]}`)}</dt>,
      <dd>{damageTypesList(val)}</dd>,
    );
  };
  return <>{result}</>;
}
