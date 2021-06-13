import { mapValues } from 'lodash-es';
import { Arrow, Attack, Creature, DamageModifier, DamageModifiers, damageModifiersValues, DamageProfile, DamageType, Pair, Weapon } from "../types";
import { effects } from './effects';
import { animations } from './weapons';

function applyArmor(damage: number, armor: number): number {
  return armor < damage / 2
    ? damage - armor
    : damage ** 2 / (armor * 4);
}

export const playerDamageModifiers: DamageModifiers = {
  blunt: 'normal',
  slash: 'normal',
  pierce: 'normal',
  chop: 'ignore',
  pickaxe: 'ignore',
  fire: 'normal',
  frost: 'normal',
  lightning: 'normal',
  poison: 'normal',
  spirit: 'immune',
};

export function addDamage(d1: DamageProfile, d2: DamageProfile): DamageProfile {
  const keys = new Set([...Object.keys(d1), ...Object.keys(d2)]);

  return Object.fromEntries(
    [...keys].map(type => [type, (d1[type as any as DamageType] ?? 0) + (d2[type as any as DamageType] ?? 0)])
  );
}

export function multiplyDamage(damage: DamageProfile, mul: number): DamageProfile {
  return Object.fromEntries(Object.entries(damage).map(([type, value]) => [type, (value as number) * mul]));
}

export function getPhysicalDamage(damage: DamageProfile): number {
  const { blunt = 0, pierce = 0, slash = 0 } = damage;
  return blunt + pierce + slash;
}

export function hpBonus({ players = 1, stars = 0 }: { players?: number, stars?: number }) {
  return (1 + (players - 1) * 0.4) * (1 + stars);
}

export function dmgBonus({ players = 1, stars = 0 }: { players?: number, stars?: number }) {
  return (1 + (players - 1) * 0.04) * (1 + stars * 0.5);
}

export function applyDamageModifier(damage: DamageProfile, modifiers: DamageModifiers): DamageProfile {
  return mapValues(damage, (val, type: DamageType) => val == null ? val : val * damageModifiersValues[modifiers[type]])
}

function getBlockableDamage(damage: DamageProfile): DamageProfile {
  const { poison: _, ...other } = damage;
  return other;
}

export function getWeaponSkillFactor(skill: number): Pair<number> {
  return [
    (0.25 + 0.006 * skill),
    Math.min(0.55 + 0.006 * skill, 1)
   ];
}

export function getCreatureDamageRandomFactor(): number {
  return 0.875;
}

export function getTotalDamage(damage: DamageProfile): number {
  return Object.values(damage).reduce<number>((a, b) => a + (b ?? 0), 0);
}

type DamageOverTime = {
  total: number;
  time: number;
  period: number;
};

export function doAttack(
  damage: DamageProfile,
  modifiers: DamageModifiers,
  armor: number,
  isPlayer: boolean,
) {
  const { poison, ...derivedDamage } = applyDamageModifier(damage, modifiers);
  const blockableDamage = getTotalDamage(getBlockableDamage(derivedDamage));
  const resDamage = armor ? applyArmor(blockableDamage, armor) : blockableDamage;
  const { fire, spirit, ...rest } = multiplyDamage(derivedDamage, resDamage / blockableDamage);
  let overTime: Partial<Record<'fire' | 'spirit' | 'poison', DamageOverTime>> = {};
  if (fire) overTime.fire = { total: fire, time: 5, period: 1 };
  if (spirit) overTime.spirit = { total: spirit, time: 3, period: 0.5 };
  if (poison) {
    const ttl = 1 + Math.floor(Math.sqrt((isPlayer ? 5 : 1) * poison));
    overTime.poison = { total: poison, time: ttl, period: 1 };
  }
  return { damage: rest, overTime };
}

function getAttackStats(weapon: Weapon, attack: Attack, skillLvl: number) {
  const animationTimes = animations[attack.animation];
  const drawTime = (weapon.holdDurationMin ?? 0) * (1 - skillLvl / 100);
  const times = weapon.slot === 'bow'
    ? animationTimes.map(t => t + drawTime)
    : animationTimes;
  const totalTime = times.reduce((a, b) => a + b, 0);

  const drawStamina = weapon.holdDurationMin != null ? drawTime * 5 + 3 * FRAME : 0;
  const attackStamina = attack.stamina * (1 - 0.33 * skillLvl / 100) * times.length;
  const totalStamina = drawStamina + attackStamina;

  const comboTotal = attack.type !== 'proj' && times.length > 1
    ? times.length + (attack.chainCombo - 1)
    : 1;

  return {
    times,
    totalStamina,
    totalTime,
    comboTotal,
  }
}

const FRAME = 1 / 50;

const wetEffect = effects.find(e => e.id === 'Wet');
const wetModifiers = wetEffect?.damageModifiers;

const overrideResistance = (original: DamageModifier, override: DamageModifier | undefined): DamageModifier => {
  if (original === 'ignore') return original;
  if (original === 'veryResistant' && override === 'resistant') return original;
  if (original === 'veryWeak' && override === 'weak') return original;
  return override ?? original;
};

const modifyResistances = (
  original: DamageModifiers,
  override: Partial<DamageModifiers>
) => {
  return mapValues<DamageModifiers, DamageModifier>(
    original,
    (val: DamageModifier, key) => key in override
      ? overrideResistance(val, override[key as DamageType])
      : val
  );
};

const wetModifyResistances = wetModifiers
  ? (damageModifiers: DamageModifiers): DamageModifiers => modifyResistances(damageModifiers, wetModifiers)
  : (damageModifiers: DamageModifiers): DamageModifiers => damageModifiers;

export interface WeaponConfig {
  item: Weapon;
  level: number;
  skill: number;
  arrow: Arrow;
}

export function attackCreature(
  { item, level, skill, arrow }: WeaponConfig,
  attack: Attack,
  creature: Creature,
  isWet: boolean,
  backstab: boolean,
) {
  const weaponDamage = addDamage(item.damage[0], multiplyDamage(item.damage[1], level - 1));
  const totalDamage = item.slot === 'bow'
    ? addDamage(weaponDamage, arrow.damage)
    : weaponDamage;
  const damageModifiers = isWet
    ? wetModifyResistances(creature.damageModifiers)
    : creature.damageModifiers;
  const [skillMin, skillMax] = getWeaponSkillFactor(skill);
  const skillAvg = (skillMin + skillMax) / 2;
  const { damage, overTime } = doAttack(totalDamage, damageModifiers, 0, false);
  const singleHit = getTotalDamage(addDamage(damage, mapValues(overTime, d => d?.total)));

  const damageFixed = getTotalDamage(damage) * skillAvg;

  const { times, totalStamina, totalTime, comboTotal } = getAttackStats(item, attack, skill);

  const multiplier = attack.mul?.damage ?? 1;
  const backstabBonus = backstab ? item.backstab : 1;

  let wastedDamage = 0;
  let overTimeTotal = 0;
  function updateDamage(dot: DamageOverTime | undefined, skillMul: number, stack: boolean, extinguished: boolean) {
    if (dot == null) return;
    for (const t of times) {
      const total = dot.total * skillMul * (stack ? comboTotal : 1);
      const { time, period } = dot;
      const ticks = (extinguished ? 1 : t) / period;
      const maxTicks = Math.ceil(time / period);
      const inflicted = total / maxTicks * Math.min(ticks, maxTicks);
      overTimeTotal += inflicted;
      wastedDamage += total - inflicted;
    }
  }

  const { fire, spirit, poison } = overTime;
  updateDamage(fire, skillMax, true, isWet);
  updateDamage(spirit, skillMax, true, isWet);
  updateDamage(poison, skillAvg, false, false);

  const totalDamageNum = (damageFixed * comboTotal + overTimeTotal) * multiplier;
  const dpSec = totalDamageNum / totalTime;
  const dpSta = totalDamageNum / totalStamina;
  
  return {
    singleHit: [
      skillMin * singleHit * multiplier * backstabBonus,
      skillMax * singleHit * multiplier * backstabBonus,
    ] as Pair<number>,
    wasteRatio: wastedDamage / (wastedDamage + overTimeTotal),
    dpSec,
    dpSta,
  };
}
