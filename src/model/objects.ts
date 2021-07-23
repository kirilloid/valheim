import { resources } from './resources';
import { items as weapons } from './weapons';
import { items as armors } from './armors';
import { arrows } from './arrows';
import { GameObject } from '../types';
import { tools } from './tools';
import { pieces } from './building';
import { creatures } from './creatures';
import { ships, carts } from './transport';
import { destructibles } from './destructibles';
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

/*

skeletal remains (buried): 50% silver necklace

mudpile (beacon)
- hp: 1
mudpile_frac:
- hp: 5
- drop: 30%
  - 100 IronScrap
  - 1 WitheredBone
- beaconRange: 25

HeathRockPillar gives 350-400 stone

rock4_heath_frac:
  children: 132
  hp: 50
  drops: 4-8 of Stone

rock2_heath_frac:
  children: 122
  hp: 50
  drops: 4-8 of Stone

*/
