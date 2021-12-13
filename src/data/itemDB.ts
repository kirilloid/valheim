import { resources } from './resources';
import { items as weapons } from './weapons';
import { items as armors } from './armors';
import { arrows } from './arrows';
import { EntityGroup, GameComponent, GameObject } from '../types';
import { tools } from './tools';
import { pieces } from './building';
import { creatures } from './creatures';
import { ships, carts } from './transport';
import { objects } from './objects';
import { treasures } from './treasures';

import { mapping } from './mapping';

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

for (const [auxId, mainId] of mapping.entries()) {
  const obj = data[mainId];
  if (obj != null) data[auxId] = obj;
}

(window as any).objectDB = data;

export const extraData: Record<string, GameComponent[]> = {
  LocationProxy: ['LocationProxy'],
  _TerrainCompiler: ['TerrainComp'],

  BlueberryBush: ['Pickable'],
  RaspberryBush: ['Pickable'],

  DG_ForestCrypt: ['DungeonGenerator'],
  DG_GoblinCamp: ['DungeonGenerator'],
  DG_MeadowsFarm:['DungeonGenerator'],
  DG_MeadowsVillage: ['DungeonGenerator'],
  DG_SunkenCrypt: ['DungeonGenerator'],

  BossStone_Bonemass: ['ItemStand'],
  BossStone_DragonQueen: ['ItemStand'],
  BossStone_Eikthyr: ['ItemStand'],
  BossStone_TheElder: ['ItemStand'],
  BossStone_Yagluth: ['ItemStand'],

  shipwreck_karve_bottomboards: ['Destructible'],
  shipwreck_karve_bow: ['Destructible'],
  shipwreck_karve_dragonhead: ['Destructible'],
  shipwreck_karve_stern: ['Destructible'],
  shipwreck_karve_sternpost: ['Destructible'],
  sign_notext: ['WearNTear'],

  sapling_seedturnip: ['Plant'],
  sapling_seedcarrot: ['Plant'],
  TrophyDraugrFem: ['ItemDrop'],

  Player_tombstone: ['Container'],

  BonePileSpawner: ['CreatureSpawner'],
  Spawner_Blob: ['CreatureSpawner'],
  Spawner_BlobElite: ['CreatureSpawner'],
  Spawner_Boar: ['CreatureSpawner'],
  Spawner_Draugr: ['CreatureSpawner'],
  Spawner_Draugr_Elite: ['CreatureSpawner'],
  Spawner_Draugr_Ranged: ['CreatureSpawner'],
  Spawner_DraugrPile: ['CreatureSpawner'],
  Spawner_Ghost: ['CreatureSpawner'],
  Spawner_Goblin: ['CreatureSpawner'],
  Spawner_GoblinArcher: ['CreatureSpawner'],
  Spawner_GoblinBrute: ['CreatureSpawner'],
  Spawner_GoblinShaman: ['CreatureSpawner'],
  Spawner_Greydwarf: ['CreatureSpawner'],
  Spawner_Greydwarf_Elite: ['CreatureSpawner'],
  Spawner_Greydwarf_Shaman: ['CreatureSpawner'],
  Spawner_Hatchling: ['CreatureSpawner'],
  Spawner_imp_respawn: ['CreatureSpawner'],
  Spawner_Skeleton: ['CreatureSpawner'],
  Spawner_Skeleton_night_noarcher: ['CreatureSpawner'],
  Spawner_Skeleton_poison: ['CreatureSpawner'],
  Spawner_Skeleton_respawn_30: ['CreatureSpawner'],
  Spawner_StoneGolem: ['CreatureSpawner'],
  Spawner_Troll: ['CreatureSpawner'],
  Spawner_Wraith: ['CreatureSpawner'],

  Fish1: ['Fish'],
  Fish2: ['Fish'],
  Fish3: ['Fish'],
  GoblinArcher: ['BaseAI', 'Humanoid', 'MonsterAI', 'VisEquipment'],
  Skeleton_NoArcher: ['BaseAI', 'Humanoid', 'MonsterAI', 'VisEquipment'],

  deer_ragdoll: ['Ragdoll'],
  Greydwarf_ragdoll: ['Ragdoll'],
  Greydwarf_Shaman_ragdoll: ['Ragdoll'],
};
