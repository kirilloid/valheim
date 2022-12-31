import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import '../css/ModLinks.css';

import {
  Biome,
  Creature,
  DamageModifiers,
  DamageProfile,
  DamageType,
  Effect,
  EntityId,
  GameLocationId,
  GameObject,
  ItemSpecial as TItemSpecial,
  PointLight,
} from '../types';
import { applyDamageModifiers, getTotalDamage, playerDamageModifiers } from '../model/combat';
import { SkillType } from '../model/skills';

import { locationBiomes } from '../data/location';
import { data } from '../data/itemDB';
import { creatures } from '../data/creatures';
import { effects } from '../data/effects';

import { TranslationContext, Translator, useRuneTranslate } from '../effects';
import { ItemIcon, SkillIcon } from './parts/Icon';

export function durability(values: [number, number], level?: number): string | number {
  if (values[0] === Infinity) return '—';
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

export function showPercent(x: number) {
  return `${(x * 100).toFixed(1).replace(/\.0$/, '')}%`;
}

export function ShortWeaponDamage({ damage, skill }: { damage: DamageProfile, skill: SkillType | null }) {
  const result: (JSX.Element | string)[] = [];
  const { chop, pickaxe, ...restDmg } = damage;
  if (pickaxe) {
    result.push(
      <SkillIcon key="Pickaxes" skill="Pickaxes" useAlt size={16} />,
      String(pickaxe),
    );
  }
  if (chop) {
    result.push(
      <SkillIcon key="WoodCutting" skill="WoodCutting" useAlt size={16} />,
      String(chop),
    );
  }
  if (skill) result.push(<SkillIcon key={skill} skill={SkillType[skill]} useAlt size={16} />);
  result.push(
    ...Object.entries(restDmg)
      .filter(kv => kv[1])
      .map(([type, value]) => <span key={type} className={`damage--${type}`} title={type}>{value}</span>)
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
      total += getTotalDamage(applyDamageModifiers(attack.dmg, playerDamageModifiers));
    }
  }
  const avg = total / nr;
  return avg && toPrecision(3, avg);
};

export function shortCreatureDamage(damage: DamageProfile) {
  return <List separator="+">{
    Object.entries(damage)
      .filter(kv => kv[1])
      .map(([type, dmg]) => <span key={type} title={type} className={`damage--${type}`}>{dmg}</span>)
  }</List>
}

const allDamageTypes: DamageType[] = ['blunt', 'slash', 'pierce', 'chop', 'pickaxe', 'fire', 'frost', 'lightning', 'poison', 'spirit'];

function damageTypesList(translate: Translator, list: DamageType[]): string {
  if (list.length >= 8) {
    const set = new Set(allDamageTypes);
    for (const dm of list) set.delete(dm);
    const combined = [...set].map(id => translate(`ui.damageType.${id}`)).join(', ');
    return translate('ui.allBut', combined);
  }
  return list.map(id => translate(`ui.damageType.${id}`)).join(', ');
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

export function List({ children, separator = ', ' }: { children: JSX.Element[], separator?: string | JSX.Element }) {
  return <>{children.flatMap((item, i) => i ? [separator, item] : [item])}</>;
}

export function itemClasses(obj: GameObject | Effect) {
  const classes: string[] = [];
  const { disabled } = obj;
  if (obj.type === 'effect') return classes;
  const { dlc, season, mod } = obj;
  if (dlc) classes.push('dlc', `dlc--${dlc}`);
  if (season) classes.push('season', `season--${season}`);
  if (mod) classes.push('modded');
  if (disabled) classes.push('disabled');
  return classes;
}

export function InlineObject({ id, className, ...props }: { id: EntityId } & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const runeTranslate = useRuneTranslate();
  const obj = data[id] ?? effects.find(e => e.id === id);
  if (!obj) {
    return <span className="error">#{id}</span>
  }
  const classes = itemClasses(obj);
  if (className) classes.push(className);
  return <Link to={`/obj/${id}`} className={classes.join(' ')} {...props}>{runeTranslate(obj)}</Link>
}

export function ModLinks({ nexus, thunderstore }: { nexus?: number; thunderstore?: string }) {
  const parts: JSX.Element[] = [];
  if (thunderstore != null) {
    parts.push(<a target="_blank" rel="noreferrer" className="ModLink ModLink--thunderstore" key="thunderstore"
      href={`https://valheim.thunderstore.io/package/${thunderstore}/`}>
      <img src="/icons/thunderstore.ico" alt="" className="ModLink__icon" />
      {' '}
      <span className="ModLink__text">thunderstore</span>
    </a>);
  }
  if (nexus != null) {
    parts.push(<a target="_blank" rel="noreferrer" className="ModLink ModLink--nexus" key="nexus"
      href={`https://www.nexusmods.com/valheim/mods/${nexus}`}>
      <img src="/icons/nexusmods.ico" alt="" className="ModLink__icon" />
      {' '}
      <span className="ModLink__text">nexus</span>
    </a>);
  }
  return <span className="ModLinks"><List separator=" | ">{parts}</List></span>;
}

export function InlineObjectWithIcon({ id, variant, nobr, size }: {
  id: EntityId;
  variant?: number;
  nobr?: boolean;
  size?: number;
}) {
  const item = data[id];
  const display = nobr ? 'inline-block' : 'inline';
  return <span style={{ display }}>
    <ItemIcon item={item} variant={variant} useAlt={false} size={size} />
    {' '}
    <InlineObject id={id} />
  </span>
}

export function Materials(props: { materials: Record<EntityId, number>, iconSize: number }) {
  const { materials } = props;
  // const maxTier = Object.keys(materials).reduce((a, id) => Math.max(a, data[id]?.tier ?? 0), 0);
  return <span className="SearchItem__recipe">
    <List separator=''>{Object
      .entries(materials)
      // .filter(([key]) => (data[key]?.tier ?? 0) >= maxTier - 2)
      .map(([key, val]) => <React.Fragment key={key}>
        <ItemIcon item={data[key]} size={props.iconSize} />{val}
      </React.Fragment>)}</List>
  </span>
}

export function Resistances({ mods }: { mods: Partial<DamageModifiers> }) {
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
        <dd key={'d'+ key}>{damageTypesList(translate, modGroups[key])}</dd>,
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

export function Switch({ children, className }: { children: (JSX.Element | string)[]; className?: string }) {
  return <div className={classNames('Switch', className ?? '')}>
    {children.map(c => <span className="Switch__Option">{c}</span>)}
  </div>
}

export function Light({ color, intensity, range }: PointLight) {
  return <div className="Light" style={{
    width: intensity * 8,
    height: intensity * 8,
    backgroundColor: color,
    boxShadow: `0 0 ${range * 8}px ${range * 2}px ${color}`,
  }} />
}

export function downloadFile(array: ArrayBufferView, name: string) {
  // Create a link and set the URL using `createObjectURL`
  const link = document.createElement('a');
  link.style.display = 'none';
  link.href = URL.createObjectURL(new Blob([array]));
  link.download = name;

  // It needs to be added to the DOM so it can be clicked
  document.body.appendChild(link);
  link.click();

  // To make this work on Firefox we need to wait
  // a little while before removing it.
  setTimeout(() => {
    URL.revokeObjectURL(link.href);
    link.remove();
  }, 0);
}

const boldRegex = /\*(.+?)\*/g;
export function markdown(str: string) {
  const result: (JSX.Element | string)[] = [];
  let lastIndex = 0;
  boldRegex.lastIndex = 0;
  do {
    const match = boldRegex.exec(str);
    if (match == null) break;
    result.push(str.slice(lastIndex, match.index));
    result.push(<b>{match[1]}</b>);
    lastIndex = match.index + match[0]!.length;
  } while (true);
  result.push(str.slice(lastIndex));
  return result;
}