import { resources } from './resources';
import { items as weapons } from './weapons';
import { items as armors } from './armors';
import { arrows } from './arrows';
import { EntityGroup, GameComponent, GameObject, ItemSet } from '../types';
import { tools } from './tools';
import { pieces } from './building';
import { creatures } from './creatures';
import { ships, carts } from './transport';
import { objects, structures } from './objects';
import * as mods from '../mods';

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
  objects,
  structures,
  resources,
]) {
  addCollection(coll);
}

for (const group of Object.values(mods)) {
  addCollection(group);
}

// resgister sets
for (const item of Object.values(data)) {
  const set = (item as any).set as ItemSet | undefined;
  if (set != null) set.items.push(item.id);
}

if (typeof window !== 'undefined') {
  (window as any).objectDB = data;
}

export const extraData: Record<string, GameComponent[]> = {
  LocationProxy: ['LocationProxy'],
  _TerrainCompiler: ['TerrainComp'],
  TarLiquid: ['LiquidVolume'],

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
  goblin_banner: ['WearNTear'],
  goblin_bed: ['WearNTear'],
  goblin_fence: ['WearNTear'],
  goblin_pole: ['WearNTear'],
  goblin_pole_small: ['WearNTear'],
  goblin_roof_45d: ['WearNTear'],
  goblin_roof_45d_corner: ['WearNTear'],
  goblin_roof_cap: ['WearNTear'],
  goblin_stairs: ['WearNTear'],
  goblin_stepladder: ['WearNTear'],
  goblin_totempole: ['WearNTear'],
  goblin_woodwall_1m: ['WearNTear'],
  goblin_woodwall_2m: ['WearNTear'],
  goblin_woodwall_2m_ribs: ['WearNTear'],

  Beech_Sapling: ['Plant'],
  FirTree_Sapling: ['Plant'],
  PineTree_Sapling: ['Plant'],
  Birch_Sapling: ['Plant'],
  Oak_Sapling: ['Plant'],
  sapling_seedturnip: ['Plant'],
  sapling_seedcarrot: ['Plant'],
  sapling_seedonion: ['Plant'],

  TrophyDraugrFem: ['ItemDrop'],

  Player_tombstone: ['Container'],
  CargoCrate: ['Container'],

  BonePileSpawner: ['CreatureSpawner'],
  Spawner_Bat: ['CreatureSpawner'],
  Spawner_Blob: ['CreatureSpawner'],
  Spawner_BlobElite: ['CreatureSpawner'],
  Spawner_BlobTar_respawn_30: ['CreatureSpawner'],
  Spawner_Boar: ['CreatureSpawner'],
  Spawner_Cultist: ['CreatureSpawner'],
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
  Spawner_Ulv: ['CreatureSpawner'],
  Spawner_Wraith: ['CreatureSpawner'],

  Draugr_Ranged: ['BaseAI', 'Humanoid', 'MonsterAI', 'VisEquipment'],
  GoblinArcher: ['BaseAI', 'Humanoid', 'MonsterAI', 'VisEquipment'],
  Skeleton_NoArcher: ['BaseAI', 'Humanoid', 'MonsterAI', 'VisEquipment'],

};

for (const { ragdollId } of creatures) {
  if (ragdollId) {
    extraData[ragdollId] = ['Ragdoll'];
  }
}
