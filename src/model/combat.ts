import { DamageModifier, DamageModifiers, damageModifiersValues, DamageProfile, DamageType } from "../types";

function applyArmor(damage: number, armor: number): number {
  return armor < damage / 2
    ? damage - armor
    : damage ** 2 / (armor * 4);
}

export function multiplyDamage(damage: DamageProfile, mul: number): DamageProfile {
  return Object.fromEntries(Object.entries(damage).map(([type, value]) => [type, (value as number) * mul]));
}

export function getPhysicalDamage(damage: DamageProfile): number {
  const {
    [DamageType.Blunt]: blunt = 0,
    [DamageType.Pierce]: pierce = 0,
    [DamageType.Slash]: slash = 0,
  } = damage;
  return blunt + pierce + slash;
}

export function hpBonus(baseHp: number, { players = 1, stars = 0 }: { players?: number, stars?: number }) {
    return baseHp * (1 + (players - 1) * 0.4) * (1 + stars);
}

export function dmgBonus(baseHp: number, { players = 1, stars = 0 }: { players?: number, stars?: number }) {
    return baseHp * (1 + (players - 1) * 0.04) * (1 + stars * 0.5);
}

export function attack(
  damage: DamageProfile,
  modifiers: DamageModifiers,
  armor: number,
  isPlayer: boolean,
) {
  let derivedDamage: DamageProfile = {};
  let totalDamage = 0;
  for (let modifier = DamageType.Damage; modifier <= DamageType.Spirit; modifier++) {
    const mod = modifier === DamageType.Damage ? DamageModifier.Normal : modifiers[modifier];
    const dmg = (damage[modifier] ?? 0) * damageModifiersValues[mod];
    if (modifier !== DamageType.Poison) {
      totalDamage += dmg;
    }
    derivedDamage[modifier] = dmg;
  }
  const resDamage = armor ? applyArmor(totalDamage, armor) : totalDamage;
  const poisionDamage = derivedDamage[DamageType.Poison];
  derivedDamage = multiplyDamage(derivedDamage, resDamage / totalDamage);
  derivedDamage[DamageType.Poison] = poisionDamage;
  const {
    [DamageType.Fire]: fire,
    [DamageType.Poison]: poison,
    [DamageType.Spirit]: spirit,
    ...rest
  } = derivedDamage;
  let overTime: Partial<Record<DamageType, [total: number, time: number, period: number]>> = {};
  if (fire) overTime[DamageType.Fire] = [fire, 5, 1];
  if (spirit) overTime[DamageType.Spirit] = [spirit, 3, 0.5];
  if (poison) {
    const ttl = 1 + Math.floor(Math.sqrt((isPlayer ? 5 : 1) * poison));
    overTime[DamageType.Poison] = [poison, ttl, 1];
  }
  return { damage: rest, overTime };
}
