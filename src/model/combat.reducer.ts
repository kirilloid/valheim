import type { Biome, Creature, EntityId, Weapon } from '../types';
import type { WeaponConfig } from './combat';
import { creatures } from './creatures';
import { SkillType } from './skills';
import { assertNever } from './utils';
import { items } from './weapons';
import { arrows } from './arrows';

export const enabledItems = items.filter(i => !i.disabled && i.type === 'weapon') as Weapon[]; 

export type CombatStat = 'single' | 'hits' | 'dps' | 'dpsta';

export interface CombatState {
  weapons: WeaponConfig[];
  creature: Creature;
  biome: Biome;
  backstab: boolean;
  isWet: boolean;
  stat: CombatStat;
}

const CHANGE_CREATURE = 'CHANGE_CREATURE' as const;
const changeCreature = (id: EntityId, biome: Biome) => ({ type: CHANGE_CREATURE, id, biome });

const CHANGE_WEAPON = 'CHANGE_WEAPON' as const;
const changeWeapon = (index: number, id: EntityId, smart: boolean) => ({ type: CHANGE_WEAPON, index, id, smart });

const ADD_WEAPON = 'ADD_WEAPON' as const;
const addWeapon = () => ({ type: ADD_WEAPON });

const REMOVE_WEAPON = 'REMOVE_WEAPON' as const;
const removeWeapon = (index: number) => ({ type: REMOVE_WEAPON, index });

const CHANGE_SKILL = 'CHANGE_SKILL' as const;
const changeSkill = (index: number, level: number, smart: boolean) => ({ type: CHANGE_SKILL, index, level, smart });

const CHANGE_LEVEL = 'CHANGE_LEVEL' as const;
const changeLevel = (index: number, level: number) => ({ type: CHANGE_LEVEL, index, level });

const CHANGE_ARROW = 'CHANGE_ARROW' as const;
const changeArrow = (index: number, id: EntityId) => ({ type: CHANGE_ARROW, index, id });

const CHANGE_BACKSTAB = 'CHANGE_BACKSTAB' as const;
const changeBackstab = (backstab: boolean) => ({ type: CHANGE_BACKSTAB, backstab });

const CHANGE_IS_WET = 'CHANGE_IS_WET' as const;
const changeIsWet = (isWet: boolean) => ({ type: CHANGE_IS_WET, isWet });

const CHANGE_STAT = 'CHANGE_STAT' as const;
const changeStat = (stat: CombatStat) => ({ type: CHANGE_STAT, stat });

export const actionCreators = {
  changeWeapon,
  addWeapon,
  removeWeapon,
  changeSkill,
  changeLevel,
  changeArrow,
  changeCreature,
  changeBackstab,
  changeIsWet,
  changeStat,
};

export type ActionCreators = typeof actionCreators;
export type Action = ReturnType<ActionCreators[keyof ActionCreators]>;

const skills = new Map<SkillType | null, number>();

export const defaultWeapon: WeaponConfig = {
  item: enabledItems.find(w => w.id === 'Bow')!,
  level: 1,
  skill: 0,
  arrow: arrows[1]!,
};

export const defaultCreature = creatures.find(c => c.id === 'Greyling')!;

export function reducer(state: CombatState, action: Action): CombatState {
  switch (action.type) {
    case CHANGE_CREATURE: {
      const { id, biome } = action;
      const creature = creatures.find(c => c.id === id);
      if (creature == null) return state;
      if (creature.faction === 'SeaMonsters') return { ...state, creature, biome, isWet: true }
        // mountain
        else if (creature.tier === 4) return { ...state, creature, biome, isWet: false };
        else return { ...state, creature, biome };
    }
    case CHANGE_BACKSTAB: {
      const { backstab } = action;
      return { ...state, backstab };
    }
    case CHANGE_IS_WET: {
      const { isWet } = action;
      return { ...state, isWet };
    }
    case CHANGE_STAT: {
      const { stat } = action;
      return { ...state, stat };
    }
    case CHANGE_WEAPON: {
      const item = enabledItems.find(w => w.id === action.id);
      if (item == null) return state;
      const weapons = state.weapons.map((w, i) => i !== action.index ? w : {
        item,
        level: item.maxLvl,
        skill: skills.get(item.skill) ?? w.skill,
        arrow: w.arrow,
      })
      return { ...state, weapons };
    }
    case ADD_WEAPON: {
      const weapon = state.weapons.slice(-1)[0] ?? defaultWeapon;
      const weapons = state.weapons.concat([weapon]);
      return { ...state, weapons };
    }
    case REMOVE_WEAPON: {
      const weapons = state.weapons.filter((_, i) => i !== action.index);
      return { ...state, weapons };
    }
    case CHANGE_SKILL: {
      const { index, level, smart } = action;
      const { skill } = state.weapons[index]!.item;
      skills.set(skill, level);
      if (smart) {
        const weapons = state.weapons.map(w => w.item.skill === skill ? ({ ...w, skill: level }) : w);
        return { ...state, weapons };
      } else {
        const weapons = state.weapons.map((w, i) => i === index ? ({ ...w, skill: level }) : w);
        return { ...state, weapons };
      }
    }
    case CHANGE_LEVEL: {
      const { index, level } = action;
      const weapons = state.weapons.map((w, i) => i === index ? { ...w, level } : w);
      return { ...state, weapons };
    }
    case CHANGE_ARROW: {
      const arrow = arrows.find(a => a.id === action.id);
      if (arrow == null) return state;
      const weapons = state.weapons.map((w, i) => i === action.index ? { ...w, arrow } : w);
      return { ...state, weapons };
    }
    default:
      return assertNever(action);
  }
}