import React, { useContext } from 'react';

import {
  AttackProfile,
  Biome,
  Creature,
  DamageModifier,
  DamageModifiers,
  DamageProfile,
  GameLocationId,
  ItemSpecial as TItemSpecial
} from '../types';
import { SkillIcon } from './Icon';
import { TranslationContext } from '../translation.effect';
import { applyDamageModifier, getTotalDamage, playerDamageModifiers } from '../model/combat';
import { SkillType } from '../model/skills';
import { locationBiomes } from '../model/location';
import { Link } from 'react-router-dom';

export function durability(values: [number, number], level?: number): string | number {
  if (values[0] === Infinity) return 'indestructible';
  if (values[1] === 0) return values[0]
  return showPair(values, level);
}

export function showPair(values: number | [number, number], level?: number): string | number {
  if (typeof values === 'number') return values;
  return level == null ? values.join('+') : values[0] + values[1] * (level - 1)
}

export function showNumber(value: number): string {
  return value < 100
    ? value.toFixed(1).replace(/\.0$/, '')
    : String(Math.round(value));
}

export function ShortWeaponDamage({ damage, skill }: { damage: DamageProfile, skill: SkillType | null }) {
  const result: (JSX.Element | string)[] = [];
  if (damage.pickaxe) {
    result.push(
      <SkillIcon key="Pickaxes" skill={SkillType.Pickaxes} useAlt size={16} />,
      String(damage.pickaxe),
    );
  }
  if (damage.chop) {
    result.push(
      <SkillIcon key="WoodCutting" skill={SkillType.WoodCutting} useAlt size={16} />,
      String(damage.chop),
    );
  }
  // tools
  // physical
  const physical = (damage.slash ?? 0)
                 + (damage.pierce ?? 0)
                 + (damage.blunt ?? 0);
  // elemental
  const { fire, frost, poison, lightning, spirit } = damage;
  const obj = { physical, fire, frost, poison, lightning, spirit };
  if (skill) result.push(<SkillIcon skill={skill} useAlt size={16} />);
  result.push(
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

export const averageAttacksDamage = (creature: Creature) => {
  const attacks = creature.attacks.flatMap(a => a.attacks);
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
  const physical = (damage.slash ?? 0)
                 + (damage.pierce ?? 0)
                 + (damage.blunt ?? 0);
  // elemental
  const { fire, frost, poison, lightning, spirit } = damage;
  const obj = { physical, fire, frost, poison, lightning, spirit };
  return Object.entries(obj)
    .filter(kv => kv[1])
    .map(([type, dmg]) => <span key={type} className={`damage--${type}`}>{dmg}</span>)
    .flatMap((item, i) => i ? ['+', item] : [item]);
}

function damageTypesList(list: DamageModifier[]): string {
  return list.join(', ');
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
    veryWeak: [] as DamageModifier[],
    weak: [] as DamageModifier[],
    resistant: [] as DamageModifier[],
    veryResistant: [] as DamageModifier[],
    immune: [] as DamageModifier[],
  };
  for (const [key, val] of Object.entries(mods)) {
    if (val && val !== 'normal' && val !== 'ignore') {
      modGroups[val].push(key as unknown as DamageModifier);
    }
  }
  const keys = [
    'veryWeak',
    'weak',
    'resistant',
    'veryResistant',
    'immune',
  ] as const;
  return <>{
    keys
      .filter(key => modGroups[key]?.length > 0)
      .flatMap(key => [
        <dt key={'t'+ key}>{translate(`ui.damageModifier.${key}`)}</dt>,
        <dd key={'d'+ key}>{damageTypesList(modGroups[key])}</dd>,
      ])
  }</>;
}

export function yesNo(arg?: boolean) {
  return arg ? '✔️' : '❌';
}

export function Area({ area }: { area: Biome | GameLocationId }) {
  const translate = useContext(TranslationContext);
  if (area in locationBiomes) {
    return <>
      <Link to={`/loc/${area}`}>{translate(`ui.location.${area}`)}</Link>
      {' '}
      (<Link to={`/loc/${area}`}>{translate(`ui.biome.${locationBiomes[area as GameLocationId]}`)}</Link>)
    </>;
  } else {
    return <Link to={`/loc/${area}`}>{translate(`ui.biome.${area}`)}</Link>;
  }
}
