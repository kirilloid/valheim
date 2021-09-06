import { resources } from './resources';
import { items as weapons } from './weapons';
import { items as armors } from './armors';
import { arrows } from './arrows';
import { GameObject } from '../types';
import { tools } from './tools';
import { pieces } from './building';
import { creatures } from './creatures';
import { ships, carts } from './transport';
import { destructibles } from './objects';
import { plants } from './plants';

export const data: Record<string, GameObject> = {};

function addCollection(coll: GameObject[]) {
  coll.forEach(e => data[e.id] = e);
}

for (const coll of [
  creatures,
  weapons,
  armors,
  arrows,
  tools,
  pieces,
  ships,
  carts,
  destructibles,
  plants,
  resources,
]) {
  addCollection(coll);
}
