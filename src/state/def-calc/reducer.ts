import type { Biome, Creature, EntityId, Shield, Weapon } from '../../types';
import { getItemById } from './items';
import { assertNever } from '../../model/utils';

import { creatures, maxLvl, minLvl } from '../../data/creatures';

export interface State {
  enemy: {
    creature: Creature;
    biome: Biome;
    variety: number;
    stars: number;
  };

  players: number;
  blocker?: {
    item: Shield | Weapon;
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

const CHANGE_BLOCKER = 'CHANGE_BLOCKER' as const;
const changeBlocker = (id: EntityId) => ({ type: CHANGE_BLOCKER, id });

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
  changeBlocker,
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
      const stars = Math.max(minLvl(creature), Math.min(maxLvl(creature) - 1, state.enemy.stars));
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
    case CHANGE_BLOCKER: {
      if (action.id === '') {
        return { ...state, blocker: undefined };
      }
      const hasMaxLvl = state.blocker?.level === state.blocker?.item.maxLvl;
      const item = getItemById(action.id);
      if (item == null) return state;
      const blocker = 
        state.blocker ? {
          item,
          level: hasMaxLvl ? item.maxLvl : state.blocker.level,
          skill: state.blocker.skill,
        } : {
          item,
          level: item.maxLvl,
          skill: 0,
        }
      return { ...state, blocker };
    }
    case CHANGE_LEVEL: {
      const { level } = action;
      return state.blocker ? { ...state, blocker: { ...state.blocker, level } } : state;
    }
    case CHANGE_SKILL: {
      const { skill } = action;
      return state.blocker ? { ...state, blocker: { ...state.blocker, skill } } : state;
    }
    case CHANGE_ARMOR: {
      const { armor } = action;
      return { ...state, armor };
    }
    default:
      return assertNever(action);
  }
}
