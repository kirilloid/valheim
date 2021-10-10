import type { WeaponConfig } from './combat';
import { State, CombatStat, defaultWeapon, enabledItems } from './off_calc.reducer';
import { arrows } from '../data/arrows';
import { creatures } from '../data/creatures';
import { defaultCreature, creatureBiome } from '../data/combat_creatures';

function serializeWeapon(weapon: WeaponConfig): string {
  const levelPart = weapon.level === weapon.item.maxLvl ? '' : `-${weapon.level}`;
  return `${weapon.item.id}${levelPart}-${weapon.skill}`
         + (weapon.item.slot === 'bow' ? `-${weapon.arrow.id}` : '')
}

export function serializeState(state: State): string {
  const { isWet, backstab, creature, stat, weapons } = state;
  return `${isWet ? 'wet-' : ''}${backstab ? 'unaware-' : ''}${creature.id}-${stat}-${weapons.map(serializeWeapon).join('-or-')}`;
}

const weaponRegex = /(\w+)(?:-(\d+))?-(\d+)(?:-(\w+))?/;

function parseWeapon(str: string): WeaponConfig {
  const [, id, level, skill, arrow] = str.match(weaponRegex) ?? [];
  const weapon = (id && enabledItems.find(w => w.id === id)) || enabledItems[0]!;
  return {
    item: weapon,
    level: Number(level) || weapon.maxLvl,
    skill: Number(skill) || 0,
    arrow: (arrow && arrows.find(a => a.id === arrow)) || arrows[0]!,
  };
}

export function getInitialState(params: string | undefined): State {
  const match = params?.match(/(wet-)?(unaware-)?(\w+)-(\w+)-/);
  if (params == null || match == null) {
    return {
      weapons: [defaultWeapon],
      creature: defaultCreature,
      biome: 'Meadows',
      backstab: false,
      isWet: false,
      stat: 'dps',
    };
  }
  
  const isWet = match[1] != null;
  const backstab = match[2] != null;
  const [,,, creatureId, stat] = match;
  const weaponsStr = params.slice(match[0]!.length);
  const weapons = weaponsStr.split('-or-').map(parseWeapon) ?? [];
  if (weapons.length === 0) {
    weapons.push(defaultWeapon);
  }
  const creature = creatures.find(c => c.id === creatureId) ?? defaultCreature;

  return {
    weapons,
    creature,
    biome: creatureBiome(creature),
    backstab,
    isWet,
    stat: stat as CombatStat,
  };
}
