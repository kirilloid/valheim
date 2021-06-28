import type { Biome, Creature, EntityId, Shield, Weapon } from '../types';
import { creatures } from './creatures';
import { assertNever } from './utils';
import { items } from './weapons';
import { arrows } from './arrows';

export const shields = items.filter(i => !i.disabled && i.type === 'shield') as Shield[]; 

export interface State {
  creature: Creature;
  biome: Biome;
  stars: number;

  players: number;
  shield: Shield;
  level: number;
  blocking: number;
  armor: number;
  isWet: boolean;
}

const CHANGE_CREATURE = 'CHANGE_CREATURE' as const;
const changeCreature = (id: EntityId, biome: Biome) => ({ type: CHANGE_CREATURE, id, biome });

const CHANGE_STARS = 'CHANGE_STARS' as const;
const changeStars = (stars: number) => ({ type: CHANGE_STARS, stars });

const CHANGE_SHIELD = 'CHANGE_SHIELD' as const;
const changeShield = (id: EntityId) => ({ type: CHANGE_SHIELD, id });

const CHANGE_BLOCKING = 'CHANGE_BLOCKING' as const;
const changeSkill = (skill: number) => ({ type: CHANGE_BLOCKING, skill });

const CHANGE_LEVEL = 'CHANGE_LEVEL' as const;
const changeLevel = (level: number) => ({ type: CHANGE_LEVEL, level });

const CHANGE_ARMOR = 'CHANGE_ARMOR' as const;
const changeArmor = (armor: number) => ({ type: CHANGE_ARMOR, armor });

const CHANGE_IS_WET = 'CHANGE_IS_WET' as const;
const changeIsWet = (isWet: boolean) => ({ type: CHANGE_IS_WET, isWet });

export const actionCreators = {
  changeCreature,
  changeStars,
  changeShield,
  changeSkill,
  changeLevel,
  changeArmor,
  changeIsWet,
};

export type ActionCreators = typeof actionCreators;
export type Action = ReturnType<ActionCreators[keyof ActionCreators]>;

export const defaultCreature = creatures.find(c => c.id === 'Greyling')!;

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case CHANGE_CREATURE: {
      const { id, biome } = action;
      const creature = creatures.find(c => c.id === id);
      if (creature == null) return state;
      const stars = creature.maxLvl - 1;
      return { ...state, creature, biome, stars };
    }
    case CHANGE_STARS: {
      const { stars } = action;
      return { ...state, stars };
    }
    case CHANGE_IS_WET: {
      const { isWet } = action;
      return { ...state, isWet };
    }
    case CHANGE_SHIELD: {
      const item = shields.find(s => s.id === action.id);
      if (item == null) return state;
      return { ...state, shield: item };
    }
    case CHANGE_LEVEL: {
      const { level } = action;
      return { ...state, level };
    }
    case CHANGE_BLOCKING: {
      const { skill } = action;
      return { ...state, blocking: skill };
    }
    case CHANGE_ARMOR: {
      const { armor } = action;
      return { ...state, armor };
    }
    default:
      return assertNever(action);
  }
}