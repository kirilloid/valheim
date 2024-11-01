import type { State } from './reducer';
import { allItems, blockers, getItemById } from './items';
import type { BlockerConfig } from '../../model/combat';
import { isNotNull } from '../../model/utils';

import { creatures, maxLvl, minLvl } from '../../data/creatures';
import { defaultCreature, creatureBiome } from '../../data/combat_creatures';

const defaultEnemy = {
  creature: defaultCreature,
  biome: creatureBiome(defaultCreature),
  stars: 0,
  variety: 0,
};

const item = blockers.shields[0]!;
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

export function serializeBlocker(blocker: BlockerConfig | undefined): string {
  if (blocker == null) return '';
  const { item, level, skill } = blocker;
  const levelPart = level === item.maxLvl ? '' : `*${level}`;
  return `${item.id}${levelPart}-${skill}`;
}

function serializeItems(resTypes: string[]): string {
  if (resTypes.length === 0) return '';
  const items = resTypes
    .map(hash => allItems.get(hash)?.items[0]?.id)
    .filter(isNotNull)
    .join(',');
  return `-items:${items}`;
}

export function serializeState(state: State): string {
  const enemy = serializeEnemy(state.enemy);
  const armor = state.armor ? `-armor:${state.armor}` : '';
  const shield = serializeBlocker(state.blocker);
  const shieldPart = shield ? `-shield:${shield}` : '';
  const players = state.players > 1 ? `-players:${state.players}` : '';
  const resTypes = serializeItems(state.resTypes);
  return `${enemy}-vs${armor}${shieldPart}${players}${resTypes}`;
}

function parseEnemy(url?: string): State['enemy'] {
  const match = url?.match(/(\w+)(?:-(\w+))?(?:\*(\d+))?/);
  if (match == null) return defaultEnemy;
  const [, id, varietyName, stars = '0'] = match;
  const creature = creatures.find(c => c.id === id);
  if (creature == null || creature.attacks.length === 0) return defaultEnemy;
  const variety = Math.max(creature.attacks.findIndex(a => a.variety === varietyName), 0);
  return {
    creature,
    biome: creatureBiome(creature),
    variety,
    stars: Math.max(minLvl(creature) - 1, Math.min(maxLvl(creature) - 1, +stars)),
  }
}

export function parseShield(url?: string): BlockerConfig | undefined {
  const match = url?.match(/^(\w+)(?:\*(\d+)?)?(?:-(\d+))?$/);
  if (match == null) return undefined;
  const [, id, level, skill = '0'] = match;
  const item = getItemById(id);
  if (item == null) return undefined;
  return {
    item,
    level: (level && +level) || item.maxLvl,
    skill: +skill || 0,
  };
}

export function parseState(params?: string): State {
  const match = params?.match(/^(.*)-vs(?:-armor:(\d+))?(?:-shield:(.*?))?(?:-players:(\d+))?(?:-items:([\w,]+)?)?$/);
  if (match == null) {
    return {
      enemy: defaultEnemy,
      players: 1,
      blocker: defaultShield,
      armor: 0,
      resTypes: [],
    };
  }
    
  const [, enemy, armor = '0', shield, players = '1', items = ''] = match;
  const itemIds = new Set<string | undefined>(items ? items.split(',') : []);
  const resTypes: string[] = [];
  for (let [resType, { items }] of allItems.entries()) {
    if (itemIds.has(items[0]?.id)) {
      resTypes.push(resType);
    }
  }

  return {
    enemy: parseEnemy(enemy),
    players: +players,
    blocker: parseShield(shield),
    armor: +armor,
    resTypes,
  }
}
