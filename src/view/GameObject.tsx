import { useParams } from 'react-router-dom';

import type * as T from '../types';
import { assertNever } from '../model/utils';
import { data } from '../model/objects';
import { Armor } from './Armor';
import { Weapon, Shield } from './Weapon';
import { Food } from './Food';
import { Potion } from './Potion';
import { Valuable } from './Valuable';
import { Creature } from './Creature';
import { Arrow } from './Arrow';
import { GenericItem } from './GenericItem';
import { Tool } from './Tool';
import { Piece } from './Piece';
import { Ship } from './Ship';
import { Cart } from './Cart';

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
  if (item == null) return <>Entity with id '{id}' not found!</>
  return <Item item={item} level={level} />;
}

function Item({ item, level }: { item: T.GameObject, level?: number }) {
  switch (item.type) {
    case 'creature':
      return <Creature creature={item} level={level} />;
    case 'armor':
      return <Armor item={item} level={level} />
    case 'weapon':
      return <Weapon item={item} level={level} />
    case 'shield':
      return <Shield item={item} level={level} />
    case 'food':
      return <Food item={item} />
    case 'potion':
      return <Potion item={item} />
    case 'valuable':
      return <Valuable item={item} />
    case 'ammo':
      return <Arrow item={item} />
    case 'tool':
      return <Tool item={item} level={level} />
    case 'piece':
      return <Piece item={item} />
    case 'ship':
      return <Ship item={item} />
    case 'cart':
      return <Cart item={item} />
    case 'item':
    case 'trophy':
      return <GenericItem item={item} />
    default:
      return assertNever(item);
  }
}
