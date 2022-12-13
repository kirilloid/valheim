import { useParams } from 'react-router-dom';

import type * as T from '../../types';
import { assertNever } from '../../model/utils';
import { data } from '../../data/itemDB';

import { Armor } from './Armor';
import { Weapon, Shield } from './Weapon';
import { Creature } from './Creature';
import { Arrow } from './Arrow';
import { GenericItem } from './GenericItem';
import { Tool } from './Tool';
import { Piece } from './Piece';
import { Ship } from './Ship';
import { Cart } from './Cart';
import { PhysicalObject } from './PhysicalObject';
import { SpoilerAlert } from '../parts/Spoiler';
import { Structure } from './Structure';
import { Fish } from './Fish';
import { Spawner } from './Spawner';

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
  return <>
    <SpoilerAlert tier={item.tier} />
    <Item item={item} level={level} />
  </>;
}

function Item({ item, level }: { item: T.GameObject, level?: number }) {
  switch (item.type) {
    case 'spawner':
      return <Spawner spawner={item} />;
    case 'creature':
      return <Creature creature={item} level={level} />;
    case 'fish':
      return <Fish fish={item} level={level} />;
    case 'armor':
      return <Armor item={item} level={level} />
    case 'weapon':
      return <Weapon item={item} level={level} />
    case 'shield':
      return <Shield item={item} level={level} />
    case 'arrow':
    case 'bolt':
    case 'missile':
      return <Arrow item={item} />
    case 'tool':
      return <Tool item={item} level={level} />
    case 'object':
      return <PhysicalObject item={item} />
    case 'structure':
      return <Structure item={item} />
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
