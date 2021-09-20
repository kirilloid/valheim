import {
  Arrow,
  Attack,
  AttackProfile,
  Creature,
  DamageModifier,
  DamageModifiers,
  damageModifiersValues,
  DamageProfile,
  DamageType,
  NormalAttackProfile,
  Pair,
  Shield,
  Weapon,
} from '../types';
import { addStatCounters, StatCounter } from '../view/helpers';
import { effects } from '../data/effects';
import { animations } from '../data/weapons';
import { lerp, mapValues } from './utils';

function applyArmorTotal(damage: number, armor: number): number {
  return armor < damage / 2
    ? damage - armor
    : damage ** 2 / (armor * 4);
}

function applyArmor(damage: DamageProfile, armor: number): DamageProfile {
  const total = getTotalDamage(getBlockableDamage(damage));
  const mul = applyArmorTotal(total, armor) / total;
  return mapValues(damage, (v, k) => k === 'chop' || k === 'pickaxe' ? v : v * mul);
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

export function applyDamageModifiers(damage: DamageProfile, modifiers: DamageModifiers): DamageProfile {
  return mapValues(damage, (val, type: DamageType) => val == null ? val : val * damageModifiersValues[modifiers[type]])
}

function getBlockableDamage(damage: DamageProfile): DamageProfile {
  const { chop, pickaxe, ...rest } = damage;
  return rest;
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

export function getTotalDamage(damage: Partial<DamageProfile>): number {
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
  block: number,
  armor: number,
  isPlayer: boolean,
) {
  let overTime: Partial<Record<'fire' | 'spirit' | 'poison', DamageOverTime>> = {};
  // resist
  const afterBlock = applyArmor(damage, block);
  const afterRes = applyDamageModifiers(afterBlock, modifiers);
  const afterArmor = applyArmor(afterRes, armor);
  // armor
  const { fire, spirit, poison, ...rest } = afterArmor;
  if (fire) {
    overTime.fire = { total: fire, time: 5, period: 1 };
  }
  if (spirit) {
    overTime.spirit = { total: spirit, time: 3, period: 0.5 };
  }
  if (poison) {
    const ttl = 1 + Math.floor(Math.sqrt((isPlayer ? 5 : 1) * poison));
    overTime.poison = { total: poison, time: ttl, period: 1 };
  }
  const total = getTotalDamage(afterArmor);
  if (total <= 0.1) {
    return { instant: {}, overTime: {}, total: 0 };
  }
  return { instant: rest, overTime, total };
}

function getAttackStats(weapon: Weapon, attack: Attack, skillLvl: number) {
  const animationTimes = animations[attack.animation];
  const drawTime = (weapon.holdDurationMin ?? 0) * lerp(1, 0.2, skillLvl / 100);
  const times = animationTimes.map(t => t + drawTime);
  const totalTime = times.reduce((a, b) => a + b, 0);

  const drawStamina = weapon.holdDurationMin != null ? drawTime * (weapon.holdStaminaDrain ?? 0) + 3 * FRAME : 0;
  const attackStamina = attack.stamina * lerp(1, 0.67, skillLvl / 100) * times.length;
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

/**
 * orig\over No Re We Im Ig VR VW
 *  Normal         x  v        x
 *  Resist         x  v        x
 *  Weak              v         
 *  Immune            v         
 *  Ignore   x  x  x  x  x  x  x
 *  VeRes       x  x  v        x
 *  VeWeak         x  v         
 */
const overrideResistance = (original: DamageModifier, override: DamageModifier | undefined): DamageModifier => {
  if (original === 'ignore') return original;
  if (original === 'veryResistant' && override === 'resistant') return original;
  if (original === 'veryWeak' && override === 'weak') return original;
  if (original === 'resistant' && override === 'weak') return original;
  if (original === 'resistant' || original === 'veryResistant' || original === 'immune'
  &&  override === 'weak' || override === 'veryWeak')
    return original;
  return override ?? original;
};

const modifyResistances = (
  original: DamageModifiers,
  override: Partial<DamageModifiers>
) => {
  return mapValues<DamageType, DamageModifier>(
    original,
    (val, key) => key in override
      ? overrideResistance(val, override[key])
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

export interface ShieldConfig {
  item: Shield;
  level: number;
  skill: number;
}

export interface AttackStats {
  singleHit: Pair<number>,
  averageHit: Pair<number>,
  dpSec: number,
  dpSta: number,
}

export function attackCreature(
  { item, level, skill, arrow }: WeaponConfig,
  attack: Attack,
  creature: Creature,
  isWet: boolean,
  backstab: boolean,
): AttackStats {
  const weaponDamage = addDamage(item.damage[0], multiplyDamage(item.damage[1], level - 1));
  const totalDamage = item.slot === 'bow'
    ? addDamage(weaponDamage, arrow.damage)
    : weaponDamage;
  const damageModifiers = isWet
    ? wetModifyResistances(creature.damageModifiers)
    : creature.damageModifiers;
  const [skillMin, skillMax] = item.skill == null
    ? [1, 2] // ooze bomb
    : getWeaponSkillFactor(skill);
  const skillAvg = (skillMin + skillMax) / 2;
  const { instant, overTime, total } = doAttack(totalDamage, damageModifiers, 0, 0, false);
  const singleHit = total;

  const damageFixed = getTotalDamage(instant);

  const { times, totalStamina, totalTime, comboTotal } = getAttackStats(item, attack, skill);

  const multiplier = attack.mul?.damage ?? 1;
  const backstabBonus = backstab && item.skill !== null ? item.backstab : 1;

  const { fire, spirit, poison } = overTime;
  if (isWet) {
    if (fire) fire.total /= 5;
    if (spirit) spirit.total /= 5;
  }
  let overTimeTotal = ((fire?.total ?? 0) + (spirit?.total ?? 0)) * skillAvg * comboTotal;

  if (poison != null) {
    const maxHit = comboTotal - times.length + 1;
    for (const t of times) {
      const total = poison.total * skillAvg * maxHit;
      const { time, period } = poison;
      const ticks = t / period;
      const maxTicks = Math.ceil(time / period);
      const inflicted = total / maxTicks * Math.min(ticks, maxTicks);
      overTimeTotal += inflicted;
    }
  }

  const totalDamageNum = (damageFixed * skillAvg * comboTotal + overTimeTotal) * multiplier;
  const dpSec = totalDamageNum / totalTime;
  const dpSta = totalDamageNum / totalStamina;
  
  return {
    singleHit: [
      singleHit * skillMin * multiplier * backstabBonus,
      singleHit * skillMax * multiplier * backstabBonus,
    ],
    averageHit: [
      (damageFixed * skillMin + overTimeTotal) * multiplier / comboTotal,
      (damageFixed * skillMax + overTimeTotal) * multiplier / comboTotal,
    ],
    dpSec,
    dpSta,
  };
}

function overTimeSummary(overTime: Partial<Record<DamageType, DamageOverTime>>): DamageOverTime {
  let total = 0;
  let time = 0;
  let period = 100;
  for (const entry of Object.values(overTime)) {
    if (!entry) continue;
    total += entry.total;
    time = Math.max(time, entry.time);
    period = Math.min(period, entry.period);
  }
  return { total, time, period };
}

export type AttackPlayerStats = {
  blockChance: StatCounter;
  instant: StatCounter;
  overTime: StatCounter;
};

export function attackPlayer(
  damage: DamageProfile,
  isWet: boolean,
  resists: Partial<DamageModifiers>[],
  armor: number,
  block: number,
): AttackPlayerStats {
  // TODO: optimize calculations
  const ITERATIONS = 100;
  const mods = resists.reduce(modifyResistances, playerDamageModifiers);
  const damageModifiers = isWet ? wetModifyResistances(mods) : mods;
  const skillMin = 0.75;
  const skillMax = 1;

  let instantStats = new StatCounter();
  let overTimeStats = new StatCounter();
  let zeroes = new StatCounter();

  for (let i = 0; i < ITERATIONS; i++) {
    const skillFactor = skillMin + (skillMax - skillMin) * i / (ITERATIONS - 1);
    const stats = doAttack(multiplyDamage(damage, skillFactor), damageModifiers, block, armor, true);
    const { total } = stats;
    const overTime = overTimeSummary(stats.overTime);
    const instant = total - overTime.total;
    zeroes.add(total === 0 ? 1 : 0);
    instantStats.add(instant);
    overTimeStats.add(overTime.total);
  }

  return {
    blockChance: zeroes,
    instant: instantStats,
    overTime: overTimeStats,
  };
}

export const emptyAttackPlayerStats: () => AttackPlayerStats = () => ({
  blockChance: new StatCounter(),
  instant: new StatCounter(),
  overTime: new StatCounter(),
});

export function addAttackPlayerStats(a: AttackPlayerStats, b: AttackPlayerStats): AttackPlayerStats {
  return {
    blockChance: addStatCounters(a.blockChance, b.blockChance),
    instant: addStatCounters(a.instant, b.instant),
    overTime: addStatCounters(a.overTime, b.overTime),
  };
}

export function isNormalAttackProfile(ap: AttackProfile): ap is NormalAttackProfile {
  return 'dmg' in ap;
}
