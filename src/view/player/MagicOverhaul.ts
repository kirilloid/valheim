import type { PlayerData } from './types';
import type { DamageProfile, Item, Pair, Weapon } from '../../types';

import { Class } from '../../mods/magic-overhaul';
import { multiplyDamage } from '../../model/combat';

type SkillData = {
  exp: number,
  level: number,
};

type Data = {
  class: Class,
  souls: number,
  skills: Map<Class, SkillData>
};

export function readCharClass(playerData: PlayerData): Class | undefined {
  const charClassStr = playerData.knownTexts.get('MOclass');
  if (charClassStr == null) return undefined;
  return Number(charClassStr) as Class;
}

export function readExtraSkills(playerData: PlayerData): Data | undefined {
  const texts = playerData.knownTexts;
  const charClass = readCharClass(playerData);
  if (charClass == null) return undefined;

  const skills = new Map<number, SkillData>();
  for (const cl of Object.values(Class)) {
    if (typeof cl === 'string') continue;
    if (cl === Class.NONE) continue;

    const name = `MOskillv2-${cl}`;
    const val = texts.get(name);
    if (val != null) {
      const split = val.split('|');
      if (split.length < 2) continue;
      const level = parseInt(split[0]!);
      const exp = parseFloat(split[1]!);
      skills.set(cl, { level, exp });
    } else {
      skills.set(cl, { level: 0, exp: 0 });
    }
  }

  const souls = Number(texts.get('MODKsouls'));

  return {
    class: charClass,
    skills,
    souls,
  };
}

export function modifyClassItemStats(item: Item, cls: Class | undefined): Item {
  const moveSpeed = -0.1;
  if (cls == null) return item;
  switch (item.type) {
    case 'weapon':
      const classWeaponId = `${Class[cls]!.replace('DeathKnight', 'DK')}Weapon`;
      if (item.id !== classWeaponId) return item;
      const damage: Pair<DamageProfile> = [
        multiplyDamage(item.damage[0], 0.75),
        multiplyDamage(item.damage[1], 0.75),
      ];
      const block: Weapon['block'] = typeof item.block === 'number'
        ? item.block * 0.75
        : [item.block[0] * 0.75, item.block[1]];
      return { ...item, damage, block, moveSpeed };
    case 'armor':
      const classHelmetId = `${Class[cls]!.replace('DeathKnight', 'DK')}Helmet`;
      if (item.id !== classHelmetId) return item;
      const armor: Pair<number> = [item.armor[0] * 0.75, item.armor[1] * 0.75];
      return { ...item, armor, moveSpeed };
  }
  return item;
}
