import { useParams } from 'react-router-dom';

import type { EntityId } from '../types';
import { assertNever } from '../model/utils';
import { data } from '../model/objects';
import { creatures } from '../model/creatures';
import { Armor } from './Armor';
import { Weapon } from './Weapon';
import { Food } from './Food';
import { Potion } from './Potion';
import { Valuable } from './Valuable';
import { Creature as CreatureView } from './Creature';
import { Arrow } from './Arrow';
import { GenericItem } from './GenericItem';
import { Tool } from './Tool';
import { Piece } from './Piece';

function parseLevel(level: string | undefined): number | undefined {
  if (level == null) return undefined;
  const intValue = parseInt(level);
  if (isNaN(intValue)) return undefined;
  return intValue;
}

export function GameObject() {
  const params = useParams<{id?: string, level?: string}>();
  const { id = '404' } = params; 
  const level = parseLevel(params.level);
  return Item(id, level)
      ?? Creature(id, level)
      ?? <>Entity with id '{id}' not found!</>
}

function Creature(id: EntityId, level?: number) {
  const creature = creatures.find(c => c.id === id);
  if (creature == null) {
    return null;
  }
  return CreatureView(creature, level);
}

function Item(id: string, level?: number) {
  const item = data[id];
  if (item == null) {
    return null;
  }
  switch (item.type) {
    case 'armor':
      return Armor(item, level);
    case 'weap':
      return Weapon(item, level);
    case 'food':
      return Food(item);
    case 'potion':
      return Potion(item);
    case 'value':
      return Valuable(item);
    case 'ammo':
      return Arrow(item);
    case 'tool':
      return Tool(item, level);
    case 'piece':
      return Piece(item);
    case 'item':
      return GenericItem(item);
    default:
      return assertNever(item);
  }
}
