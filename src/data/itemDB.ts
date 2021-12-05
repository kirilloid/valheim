import { resources } from './resources';
import { items as weapons } from './weapons';
import { items as armors } from './armors';
import { arrows } from './arrows';
import { EntityGroup, GameObject } from '../types';
import { tools } from './tools';
import { pieces } from './building';
import { creatures } from './creatures';
import { ships, carts } from './transport';
import { objects } from './objects';
import { treasures } from './treasures';

export const data: Record<string, GameObject> = {};

function addCollection(coll: GameObject[]) {
  for (const e of coll) {
    data[e.id] = e;
    if (e.group) {
      (groups[e.group] ?? (groups[e.group] = [])).push(e);
    }
  }
}

export const groups: Partial<Record<EntityGroup, GameObject[]>> = {};

for (const coll of [
  creatures,
  weapons,
  armors,
  arrows,
  tools,
  pieces,
  ships,
  carts,
  treasures,
  objects,
  resources,
]) {
  addCollection(coll);
}

(window as any).objectDB = data;

data.LocationProxy = { components: ['LocationProxy'] } as GameObject;
data._TerrainCompiler = { components: ['TerrainComp'] } as GameObject;
data.DG_ForestCrypt = 
data.DG_GoblinCamp =
data.DG_MeadowsFarm =
data.DG_MeadowsVillage =
data.DG_SunkenCrypt = { components: ['DungeonGenerator'] } as GameObject;
