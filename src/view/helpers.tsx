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
import { creatures } from '../model/creatures';

export function durability(values: [number, number], level?: number): string | number {
  if (values[0] === Infinity) return 'indestructible';
  if (values[1] === 0) return values[0]
  return showPair(values, level);
}

export function showPair(values: number | [number, number], level?: number): string | number {
  if (typeof values === 'number') return values;
  return level == null ? values.join('+') : values[0] + values[1] * (level - 1)
}

export function rangeBy<T>(values: [T, T], fn: (arg: T) => string, separator = '–'): string {
  return `${fn(values[0])}${separator}${fn(values[1])}`;
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

export function findDropChanceFromCreature(id: EntityId) {
  for (const creature of creatures) {
    for (const drop of creature.drop) {
      if (drop.item === id) {
        return drop.chance;
      }
    }
  }
  return 0;
}

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

export function InlineObject({ id, className, ...props }: { id: EntityId } & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const translate = useContext(TranslationContext);
  const obj = data[id];
  if (!obj) {
    return <span className="error">#{id}</span>
  }
  const { dlc, season, disabled } = obj;
  const dlcClass = dlc ? `dlc dlc--${dlc}` : '';
  const seasonClass = season ? `season season--${season}` : '';
  const disabledClass = disabled ? 'disabled' : '';
  const fullClass = [className ?? '', dlcClass, seasonClass, disabledClass].join(' ');
  return <Link to={`/obj/${id}`} className={fullClass} {...props}>{translate(id)}</Link>
}

export function InlineObjectWithIcon({ id }: { id: EntityId }) {
  const item = data[id];
  return <>
    <ItemIcon item={item} />
    {' '}
    <InlineObject id={id} />
  </>
}

export function Materials(props: { materials: Record<EntityId, number>, iconSize: number }) {
  const { materials } = props;
  const maxTier = Object.keys(materials).reduce((a, id) => Math.max(a, data[id]?.tier ?? 0), 0);
  return <span className="SearchItem__recipe">
    <List separator=''>{Object
      .entries(materials)
      .filter(([key]) => (data[key]?.tier ?? 0) >= maxTier - 2)
      .flatMap(([key, val]) => <>
        <ItemIcon key={`${key}_icon`} item={data[key]} size={props.iconSize} />
        <span key={`${key}_value`}>{val}</span>
      </>)}</List>
  </span>
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

export class StatCounter {
  _min = 1e9;
  _max = -1e9;
  _total = 0;
  _num = 0;
  add(val: number) {
    this._min = Math.min(this._min, val);
    this._max = Math.max(this._max, val);
    this._total += val;
    this._num++;
  }
  get min() {
    return this._min;
  }
  get max() {
    return this._max;
  }
  get avg() {
    return this._total / this._num;
  }
}

export function addStatCounters(a: StatCounter, b: StatCounter): StatCounter {
  const result = new StatCounter();
  result._min = Math.min(a._min, b._min);
  result._max = Math.max(a._max, b._max);
  result._total = a._total + b._total;
  result._num = a._num + b._num;
  return result;
}
