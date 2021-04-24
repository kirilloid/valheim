import { useParams } from 'react-router-dom';

import { assertNever } from '../model/utils';
import data from '../model/objects';
import { creatures } from '../model/creatures';
import { Armor } from './Armor';
import { Weapon } from './Weapon';
import { Food } from './Food';
import { Valuable } from './Valuable';
import { GenericItem } from './GenericItem';
import { Creature as CreatureView } from './Creature';

export function GameObject() {
  const { id } = useParams<{id: string}>();
  return Item(id)
      ?? Creature(id)
      ?? <>Entity with id '{id}' not found!</>
}

function Creature(id: string) {
  const creature = creatures.find(c => c.id === id);
  if (creature == null) {
    return null;
  }
  return CreatureView(creature);
}

function Item(id: string) {
  const item = data[id];
  if (item == null) {
    return null;
  }
  switch (item.type) {
    case 'armor':
      return Armor(item);
    case 'weap':
      return Weapon(item);
    case 'food':
      return Food(item);
    case 'value':
      return Valuable(item);
    case 'item':
      return GenericItem(item);
    default:
      return assertNever(item);
  }
}
