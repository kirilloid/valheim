import type { State } from './def_calc.reducer';
import { allItems, defaultCreature, shields } from './def_calc.items';
import type { ShieldConfig } from './combat';
import { isNotNull } from './utils';

import { locationToBiome } from '../data/location';
import { creatures } from '../data/creatures';

const defaultEnemy = {
  creature: defaultCreature,
  biome: locationToBiome(defaultCreature.locations[0]!),
  stars: 0,
  variety: 0,
};

const item = shields[0]!;
const defaultShield = {
  item,
  level: item.maxLvl,
  skill: 0,
};

function serializeEnemy({ creature, stars, variety }: State['enemy']): string {
  const varStr = creature.attacks.length > 1 ? `-${creature.attacks[variety]?.variety}` : '';
  const starStr = stars ? `*${stars}`: '';
  return `${creature.id}${varStr}${starStr}`;
}

function serializeShield(shield: ShieldConfig | undefined): string {
  if (shield == null) return '';
  const { item, level, skill } = shield;
  const levelPart = level === item.maxLvl ? '' : `*${level}`;
  return `-${item.id}${levelPart}-${skill}`
}

export function serializeState(state: State): string {
  const enemy = serializeEnemy(state.enemy);
  const wet = state.isWet ? '-wet' : '';
  const armor = state.armor ? `-armor:${state.armor}` : '';
  const shield = serializeShield(state.shield);
  const players = state.players > 1 ? `-players:${state.players}` : '';
  const resTypes = state.resTypes.length > 0
    ? `-items:${state.resTypes.map(hash => allItems.get(hash)?.items[0]?.id).filter(isNotNull).join(',')}`
    : '';
  return `${enemy}-vs${wet}${armor}${shield}${players}${resTypes}`;
}

function parseEnemy(url?: string): State['enemy'] {
  const match = url?.match(/(\w+)(?:-(\w+))?(?:\*(\d+))?/);
  if (match == null) return defaultEnemy;
  const [, id, varietyName, stars = '0'] = match;
  const creature = creatures.find(c => c.id === id);
  if (creature == null) return defaultEnemy;
  const variety = Math.max(creature.attacks.findIndex(a => a.variety === varietyName), 0);
  return {
    creature,
    biome: locationToBiome(creature.locations[0]!),
    variety,
    stars: Math.min(+stars, creature.maxLvl - 1),
  }
}

function parseShield(url?: string): ShieldConfig | undefined {
  const match = url?.match(/(\w+)(?:\*(\d+)?(?:-(\d+)))?/);
  if (match == null) return undefined;
  const [, id, level, skill = '0'] = match;
  const item = shields.find(s => s.id === id);
  if (item == null) return undefined;
  return {
    item,
    level: level ? +level : item.maxLvl,
    skill: +skill,
  };
}

export function getInitialState(params?: string): State {
  const match = params?.match(/(.*)-vs(-wet)?(?:-armor:(\d+))?(.*)?(?:-players:(\d+))?(-items:([\w,]+)?)?/);
  if (match != null) {
    const [, enemy, wet, armor = '0', shield, players = '1', items = ''] = match;
    const itemIds = new Set<string | undefined>(items ? items.split('') : []);
    const resTypes = [];
    for (let [resType, { items }] of allItems.entries()) {
      if (itemIds.has(items[0]?.id)) {
        resTypes.push(resType);
      }
    }
    return {
      enemy: parseEnemy(enemy),
      players: +players,
      isWet: !!wet,
      shield: parseShield(shield),
      armor: +armor,
      resTypes,
    }
  }
  return {
    enemy: defaultEnemy,
    players: 1,
    isWet: false,
    shield: defaultShield,
    armor: 0,
    resTypes: [],
  };
}

