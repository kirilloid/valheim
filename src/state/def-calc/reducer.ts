import type { Biome, Creature, EntityId, Shield } from '../../types';
import { shields } from './items';
import { assertNever } from '../../model/utils';

import { creatures, maxLvl } from '../../data/creatures';

export interface State {
  enemy: {
    creature: Creature;
    biome: Biome;
    variety: number;
    stars: number;
  };

  players: number;
  shield?: {
    item: Shield;
    level: number;
    skill: number;
  };
  armor: number;
  resTypes: string[];
}

const CHANGE_CREATURE = 'CHANGE_CREATURE' as const;
const changeCreature = (id: EntityId, biome: Biome) => ({ type: CHANGE_CREATURE, id, biome });

const CHANGE_STARS = 'CHANGE_STARS' as const;
const changeStars = (stars: number) => ({ type: CHANGE_STARS, stars });

const CHANGE_VARIETY = 'CHANGE_VARIETY' as const;
const changeVariety = (variety: number) => ({ type: CHANGE_VARIETY, variety });

const CHANGE_PLAYERS = 'CHANGE_PLAYERS' as const;
const changePlayers = (players: number) => ({ type: CHANGE_PLAYERS, players });

const CHANGE_SHIELD = 'CHANGE_SHIELD' as const;
const changeShield = (id: EntityId) => ({ type: CHANGE_SHIELD, id });

const CHANGE_SKILL = 'CHANGE_SKILL' as const;
const changeSkill = (skill: number) => ({ type: CHANGE_SKILL, skill });

const CHANGE_LEVEL = 'CHANGE_LEVEL' as const;
const changeLevel = (level: number) => ({ type: CHANGE_LEVEL, level });

const CHANGE_ARMOR = 'CHANGE_ARMOR' as const;
const changeArmor = (armor: number) => ({ type: CHANGE_ARMOR, armor });

const CHANGE_RES_TYPE = 'CHANGE_RES_TYPE' as const;
const changeResType = (resType: string, toggle: boolean) => ({ type: CHANGE_RES_TYPE, resType, toggle });

export const actionCreators = {
  changeCreature,
  changeStars,
  changeVariety,
  changePlayers,
  changeShield,
  changeSkill,
  changeLevel,
  changeArmor,
  changeResType,
};

export type ActionCreators = typeof actionCreators;
export type Action = ReturnType<ActionCreators[keyof ActionCreators]>;

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case CHANGE_CREATURE: {
      const { id, biome } = action;
      const creature = creatures.find(c => c.id === id);
      if (creature == null) return state;
      const stars = Math.min(maxLvl(creature) - 1, state.enemy.stars);
      return { ...state, enemy: { creature, biome, variety: 0, stars } };
    }
    case CHANGE_STARS: {
      const { stars } = action;
      return { ...state, enemy: { ...state.enemy, stars } };
    }
    case CHANGE_VARIETY: {
      const { variety } = action;
      return { ...state, enemy: { ...state.enemy, variety } };
    }
    case CHANGE_PLAYERS: {
      const { players } = action;
      return { ...state, players };
    }
    case CHANGE_RES_TYPE: {
      const { resType, toggle } = action;
      const { resTypes: items } = state;
      const newItems = toggle
        ? items.concat([resType])
        : items.filter(e => e !== resType);
      return { ...state, resTypes: newItems };
    }
    case CHANGE_SHIELD: {
      if (action.id === '') {
        return { ...state, shield: undefined };
      }
      const item = shields.find(s => s.id === action.id);
      if (item == null) return state;
      return { ...state, shield: { level: item.maxLvl, skill: 0, ...state.shield, item } };
    }
    case CHANGE_LEVEL: {
      const { level } = action;
      return state.shield ? { ...state, shield: { ...state.shield, level } } : state;
    }
    case CHANGE_SKILL: {
      const { skill } = action;
      return state.shield ? { ...state, shield: { ...state.shield, skill } } : state;
    }
    case CHANGE_ARMOR: {
      const { armor } = action;
      return { ...state, armor };
    }
    default:
      return assertNever(action);
  }
}
