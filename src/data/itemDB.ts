import { resources } from './resources';
import { recipes } from './recipes';
import { items as weapons } from './weapons';
import { items as armors } from './armors';
import { arrows } from './arrows';
import { EntityGroup, GameComponent, GameObject, ItemSet } from '../types';
import { tools } from './tools';
import { spawners } from './spawners';
import { pieces } from './building';
import { creatures } from './creatures';
import { fishes } from './fish';
import { ships, carts, siege } from './transport';
import { objects, structures } from './objects';
import { data as modsData, recipes as modsRecipes } from '../mods';

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
  fishes,
  weapons,
  armors,
  arrows,
  tools,
  spawners,
  pieces,
  ships,
  carts,
  siege,
  objects,
  structures,
  resources,
]) {
  addCollection(coll);
}

for (const group of Object.values(modsData)) {
  addCollection(group);
}

// resgister sets
for (const item of Object.values(data)) {
  const set = (item as any).set as ItemSet | undefined;
  if (set != null) set.items.push(item.id);
}

if (typeof window !== 'undefined') {
  (window as any).objectDB = data;
  (window as any).recipes = recipes.concat(...Object.values(modsRecipes));
}

export const extraData: Record<string, GameComponent[]> = {
  LocationProxy: ['LocationProxy'],
  _TerrainCompiler: ['TerrainComp'],
  TarLiquid: ['LiquidVolume'],
  raise: ['TerrainModifier'],
  raise_v2: ['TerrainModifier'],
  digg: ['TerrainModifier'],
  digg_v2: ['TerrainModifier'],
  digg_v3: ['TerrainModifier'],
  // actually flatten
  mud_road: ['TerrainModifier'],
  mud_road_v2: ['TerrainModifier'],
  paved_road: ['TerrainModifier'],
  paved_road_v2: ['TerrainModifier'],

  DG_ForestCrypt: ['DungeonGenerator'],
  DG_GoblinCamp: ['DungeonGenerator'],
  DG_MeadowsFarm:['DungeonGenerator'],
  DG_MeadowsVillage: ['DungeonGenerator'],
  DG_SunkenCrypt: ['DungeonGenerator'],
  DG_Cave: ['DungeonGenerator'],
  DG_DvergrTown: ['DungeonGenerator'],
  DG_DvergrBoss: ['DungeonGenerator'],

  BossStone_Bonemass: ['ItemStand'],
  BossStone_DragonQueen: ['ItemStand'],
  BossStone_Eikthyr: ['ItemStand'],
  BossStone_TheElder: ['ItemStand'],
  BossStone_Yagluth: ['ItemStand'],
  BossStone_TheQueen: ['ItemStand'],
  BossStone_Fader: ['ItemStand'],

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
  VineAsh_sapling: ['Plant'],

  TrophyDraugrFem: ['ItemDrop'],

  Spawner_Blob: ['CreatureSpawner'],
  Spawner_BlobElite: ['CreatureSpawner'],
  Spawner_Boar: ['CreatureSpawner'],
  Spawner_Cultist: ['CreatureSpawner'],
  Spawner_Draugr: ['CreatureSpawner'],
  Spawner_Draugr_Elite: ['CreatureSpawner'],
  Spawner_Draugr_Ranged: ['CreatureSpawner'],
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
  Spawner_Troll: ['CreatureSpawner'],
  Spawner_Wraith: ['CreatureSpawner'],

  GoblinArcher: ['BaseAI', 'Humanoid', 'MonsterAI', 'VisEquipment'],
  Skeleton_NoArcher: ['BaseAI', 'Humanoid', 'MonsterAI', 'VisEquipment'],

};

for (const { ragdollId } of creatures) {
  if (ragdollId) {
    extraData[ragdollId] = ['Ragdoll'];
  }
}
