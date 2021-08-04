import React, { useContext } from 'react';

import {
  Biome,
  Creature,
  DamageModifiers,
  DamageProfile,
  DamageType,
  EntityId,
  GameLocationId,
  GeneralDrop,
  ItemSpecial as TItemSpecial,
  SimpleDrop
} from '../types';
import { ItemIcon, SkillIcon } from './Icon';
import { TranslationContext } from '../effects';
import { applyDamageModifier, getTotalDamage, playerDamageModifiers } from '../model/combat';
import { SkillType } from '../model/skills';
import { locationBiomes } from '../model/location';
import { Link } from 'react-router-dom';
import { data } from '../model/objects';

export function durability(values: [number, number], level?: number): string | number {
  if (values[0] === Infinity) return 'indestructible';
  if (values[1] === 0) return values[0]
  return showPair(values, level);
}

export function showPair(values: number | [number, number], level?: number): string | number {
  if (typeof values === 'number') return values;
  return level == null ? values.join('+') : values[0] + values[1] * (level - 1)
}

export function rangeBy<T>(value: [T, T], fn: (arg: T) => string): string {
  return `${fn(value[0])}–${fn(value[1])}`;
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
  if (skill) result.push(<SkillIcon key={skill} skill={skill} useAlt size={16} />);
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
  return <List separator="+">{
    Object.entries(obj)
      .filter(kv => kv[1])
      .map(([type, dmg]) => <span key={type} className={`damage--${type}`}>{dmg}</span>)
  }</List>
}

const allDamageTypes: DamageType[] = ['blunt', 'slash', 'pierce', 'chop', 'pickaxe', 'fire', 'frost', 'lightning', 'poison', 'spirit'];

function damageTypesList(list: DamageType[]): string {
  if (list.length >= 8) {
    const set = new Set(allDamageTypes);
    for (const dm of list) set.delete(dm);
    return `All but ${[...set].join(', ')}`;
  }
  return list.join(', ');
} 

export function yesNo(arg?: boolean) {
  return arg ? '✔️' : '❌';
}

export function ItemSpecial({ special }: { special: TItemSpecial }) {
  const translate = useContext(TranslationContext);
  if (special == null) return null;
  return (<>
    <dt>{translate(`ui.itemSpecial`)}</dt>
    <dd>{translate(`ui.itemSpecial.${special}`)}</dd>
  </>);
}

export function List({ children, separator = ', ' }: { children: JSX.Element[], separator?: string }) {
  return <>{children.flatMap((item, i) => i ? [separator, item] : [item])}</>;
}

export function InlineObject({ id }: { id: EntityId }) {
  const translate = useContext(TranslationContext);
  return <Link to={`/obj/${id}`}>{translate(id)}</Link>
}

export function InlineObjectWithIcon({ id }: { id: EntityId }) {
  return <>
    <ItemIcon item={data[id]} />
    {' '}
    <InlineObject id={id} />
  </>
}

export function Resistances({ mods }: { mods: DamageModifiers }) {
  const translate = useContext(TranslationContext);
  const modGroups = {
    veryWeak: [] as DamageType[],
    weak: [] as DamageType[],
    resistant: [] as DamageType[],
    veryResistant: [] as DamageType[],
    immune: [] as DamageType[],
  };
  for (const [key, val] of Object.entries(mods)) {
    if (val && val !== 'normal' && val !== 'ignore') {
      modGroups[val].push(key as unknown as DamageType);
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

export function Area({ area }: { area: Biome | GameLocationId }) {
  const translate = useContext(TranslationContext);
  if (area in locationBiomes) {
    const biome = locationBiomes[area as GameLocationId];
    return <>
      <Link to={`/loc/${area}`}>{translate(`ui.location.${area}`)}</Link>
      {' '}
      (<Link to={`/biome/${biome}`}>{translate(`ui.biome.${biome}`)}</Link>)
    </>;
  } else {
    return <Link to={`/biome/${area}`}>{translate(`ui.biome.${area}`)}</Link>;
  }
}
