import { useParams } from 'react-router-dom';

import type * as T from '../types';
import { assertNever } from '../model/utils';
import { data } from '../model/objects';
import { creatures } from '../model/creatures';
import { Armor } from './Armor';
import { Weapon } from './Weapon';
import { Food } from './Food';
import { Potion } from './Potion';
import { Valuable } from './Valuable';
import { Creature } from './Creature';
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
  const item = data[id];
  if (item != null) return <Item item={item} level={level} />;
  const creature = creatures.find(c => c.id === id);
  if (creature != null) return <Creature creature={creature} level={level} />;
  return <>Entity with id '{id}' not found!</>
}

function Item({ item, level }: { item: T.Item | T.Piece, level?: number }) {
  switch (item.type) {
    case 'armor':
      return <Armor item={item} level={level} />
    case 'weapon':
      return <Weapon item={item} level={level} />
    case 'food':
      return <Food item={item} />
    case 'potion':
      return <Potion item={item} />
    case 'value':
      return <Valuable item={item} />
    case 'ammo':
      return <Arrow item={item} />
    case 'tool':
      return <Tool item={item} level={level} />
    case 'piece':
      return <Piece item={item} />
    case 'item':
      return <GenericItem item={item} />
    default:
      return assertNever(item);
  }
}
