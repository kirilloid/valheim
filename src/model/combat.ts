import { mapValues } from 'lodash-es';
import { DamageModifiers, damageModifiersValues, DamageProfile, DamageType } from "../types";

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

export function getWeaponSkillFactor(skill: number): number {
  return (
    (0.25 + 0.006 * skill) +
    Math.min(0.55 + 0.006 * skill, 1)
  ) / 2;
}

export function getCreatureDamageRandomFactor(): number {
  return 0.875;
}

export function getTotalDamage(damage: DamageProfile): number {
  return Object.values(damage).reduce<number>((a, b) => a + (b ?? 0), 0);
}

export function attack(
  damage: DamageProfile,
  modifiers: DamageModifiers,
  armor: number,
  isPlayer: boolean,
) {
  const { poison, ...derivedDamage } = applyDamageModifier(damage, modifiers);
  const blockableDamage = getTotalDamage(getBlockableDamage(derivedDamage));
  const resDamage = armor ? applyArmor(blockableDamage, armor) : blockableDamage;
  const { fire, spirit, ...rest } = multiplyDamage(derivedDamage, resDamage / blockableDamage);
  let overTime: Partial<Record<DamageType, [total: number, time: number, period: number]>> = {};
  if (fire) overTime.fire = [fire, 5, 1];
  if (spirit) overTime.spirit = [spirit, 3, 0.5];
  if (poison) {
    const ttl = 1 + Math.floor(Math.sqrt((isPlayer ? 5 : 1) * poison));
    overTime.poison = [poison, ttl, 1];
  }
  return { damage: rest, overTime };
}
