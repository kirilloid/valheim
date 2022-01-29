import type { State } from './reducer';
import { allItems, shields } from './items';
import type { ShieldConfig } from '../../model/combat';
import { isNotNull } from '../../model/utils';

import { creatures, maxLvl } from '../../data/creatures';
import { defaultCreature, creatureBiome } from '../../data/combat_creatures';

const defaultEnemy = {
  creature: defaultCreature,
  biome: creatureBiome(defaultCreature),
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

export function serializeShield(shield: ShieldConfig | undefined): string {
  if (shield == null) return '';
  const { item, level, skill } = shield;
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
  const shield = serializeShield(state.shield);
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
  if (creature == null) return defaultEnemy;
  const variety = Math.max(creature.attacks.findIndex(a => a.variety === varietyName), 0);
  return {
    creature,
    biome: creatureBiome(creature),
    variety,
    stars: Math.min(+stars, maxLvl(creature) - 1),
  }
}

export function parseShield(url?: string): ShieldConfig | undefined {
  const match = url?.match(/^(\w+)(?:\*(\d+)?)?(?:-(\d+))?$/);
  if (match == null) return undefined;
  const [, id, level, skill = '0'] = match;
  const item = shields.find(s => s.id === id);
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
      shield: defaultShield,
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
    shield: parseShield(shield),
    armor: +armor,
    resTypes,
  }
}
