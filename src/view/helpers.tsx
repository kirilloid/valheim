import React, { useContext } from 'react';

import {
  AttackProfile,
  DamageModifier,
  DamageModifiers,
  DamageProfile,
  DamageType,
  ItemSpecial as TItemSpecial
} from '../types';
import { Icon } from './Icon';
import { TranslationContext } from '../translation.effect';
import { applyDamageModifier, getTotalDamage, playerDamageModifiers } from '../model/combat';
import { SkillType } from '../model/skills';

export function durability(values: [number, number], level?: number): string | number {
  if (values[0] === Infinity) return 'indestructible';
  if (values[1] === 0) return values[0]
  return showPair(values, level);
}

export function showPair(values: number | [number, number], level?: number): string | number {
  if (typeof values === 'number') return values;
  return level == null ? values.join('+') : values[0] + values[1] * (level - 1)
}

export function ShortWeaponDamage({ damage, skill }: { damage: DamageProfile, skill: SkillType }) {
  const result: (JSX.Element | string)[] = [];
  if (damage[DamageType.Pickaxe]) {
    result.push(
      <Icon key="Pickaxes" type="skills" id="Pickaxes" size={16} />,
      String(damage[DamageType.Pickaxe]),
    );
  }
  if (damage[DamageType.Chop]) {
    result.push(
      <Icon key="Woodcutting" type="skills" id="Woodcutting" size={16} />,
      String(damage[DamageType.Chop]),
    );
  }
  // tools
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
  result.push(
    <Icon type="skills" id={SkillType[skill]!} size={16} />,
    ...Object.entries(obj)
      .filter(kv => kv[1])
      .map(kv => <span key={kv[0]} className={`damage--${kv[0]}`}>{kv[1]}</span>)
      .flatMap((item, i) => i ? ['+', item] : [item])
  );
  return <>{result}</>
}

export const toPrecision = (precision: number, value: number): string => {
  return String(Number(value.toPrecision(precision)));
};

export const averageAttacksDamage = (attacks: AttackProfile[]) => {
  let nr = 0;
  let total = 0;
  for (const attack of attacks) {
    if ('dmg' in attack) {
      nr++;
      total += getTotalDamage(applyDamageModifier(attack.dmg, playerDamageModifiers));
    }
  }
  const avg = total / nr;
  return avg && toPrecision(3, avg);
};

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
    .map(([type, dmg]) => <span key={type} className={`damage--${type}`}>{dmg}</span>)
    .flatMap((item, i) => i ? ['+', item] : [item]);
}

function damageTypesList(list: DamageModifier[]): string {
  return list.map(v => DamageType[v]).join(', ');
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
  const modGroups = {
    [DamageModifier.VeryWeak]: [] as DamageModifier[],
    [DamageModifier.Weak]: [] as DamageModifier[],
    [DamageModifier.Resistant]: [] as DamageModifier[],
    [DamageModifier.VeryResistant]: [] as DamageModifier[],
    [DamageModifier.Immune]: [] as DamageModifier[],
  };
  for (const [key, val] of Object.entries(mods)) {
    if (val && val in modGroups) {
      modGroups[val as keyof typeof modGroups].push(key as unknown as DamageModifier);
    }
  }
  const keys = [
    DamageModifier.VeryWeak,
    DamageModifier.Weak,
    DamageModifier.Resistant,
    DamageModifier.VeryResistant,
    DamageModifier.Immune,
  ] as const;
  return <>{
    keys
      .filter(key => modGroups[key]?.length > 0)
      .flatMap(key => [
        <dt key={'t'+ key}>{translate(`ui.damageModifier.${DamageModifier[+key]}`)}</dt>,
        <dd key={'d'+ key}>{damageTypesList(modGroups[key])}</dd>,
      ])
  }</>;
}
