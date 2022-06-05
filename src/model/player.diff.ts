import type { PlayerDataDiff, PlayerDiff, WorldDiff } from '../file/Player.diff';

import { createDiffer, diffArray, diffLast, diffMap, diffPrimitive, diffPrimitiveU, diffVector3, diffVector3U, diffWithUndefined } from '../file/diff';
import { Player, PlayerData, PlayerStats, SkillData, World } from '../file/Player';

const diffSkillData = diffWithUndefined((s1: SkillData, s2: SkillData): SkillData | undefined => {
  if (s1.accumulator === s2.accumulator
  &&  s1.level === s2.level) return undefined;
  return s2;
});

function diffStats(s1: PlayerStats, s2: PlayerStats): PlayerStats | undefined {
  if (s1.builds === s2.builds
  &&  s1.crafts === s2.crafts
  &&  s1.deaths === s2.deaths
  &&  s1.kills === s2.kills) return undefined;
  return s2;
}

const diffMapData = diffWithUndefined((m1: Uint8Array, m2: Uint8Array): Uint8Array | undefined => {
  if (m1.length === m2.length && m2.every((v, i) => v === m1[i])) return undefined;
  
});

function diffWorld(w1: World | undefined, w2: World | undefined): WorldDiff | undefined | null {
  if (w1 === undefined) return w2;
  if (w2 === undefined) return null;
  if (diffVector3U(w1.deathPoint, w2.deathPoint) === undefined
  &&  diffVector3(w1.homePoint, w2.homePoint) === undefined
  &&  diffVector3U(w1.logoutPoint, w2.logoutPoint) === undefined
  &&  diffVector3U(w1.spawnPoint, w2.spawnPoint) === undefined
  && (w1.mapData === undefined && w2.mapData === undefined
  ||  w1.mapData !== undefined && w2.mapData !== undefined && w1.mapData.every((v, i) => v === w2.mapData![i]))
  ) return undefined;
  return {
    deathPoint: diffVector3U(w1.deathPoint, w2.deathPoint),
    homePoint: diffVector3(w1.homePoint, w2.homePoint),
    logoutPoint: diffVector3U(w1.logoutPoint, w2.logoutPoint),
    spawnPoint: diffVector3U(w1.spawnPoint, w2.spawnPoint),
    mapData: diffMapData(w1.mapData, w2.mapData),
  }
}

const diffPlayerData = createDiffer<PlayerDataDiff, PlayerData>({
  version: diffLast,
  maxHealth: diffLast,
  health: diffLast,
  maxStamina: diffLast,
  firstSpawn: diffLast,
  timeSinceDeath: diffPrimitive,
  guardianPower: diffPrimitive,
  guardianPowerCooldown: diffPrimitive,
  inventory: diffLast,
  knownRecipes: diffArray,
  knownStations: diffMap<number>(diffPrimitiveU),
  knownMaterials: diffArray,
  shownTutorials: diffArray,
  uniques: diffArray,
  trophies: diffArray,
  knownBiome: diffArray,
  knownTexts: diffMap<string>(diffPrimitiveU),
  
  beardItem: diffPrimitive,
  hairItem: diffPrimitive,
  skinColor: diffVector3,
  hairColor: diffVector3,
  modelIndex: diffPrimitive,
  foods: diffLast,
  skillData: (a, b) => diffMap(diffSkillData)(a ?? new Map(), b ?? new Map()),
});

export const diff = createDiffer<PlayerDiff, Player>({
  version: diffLast,
  stats: diffStats,
  worlds: diffMap(diffWorld),
  playerName: diffPrimitive,
  playerID: diffPrimitive,
  startSeed: diffPrimitive,
  playerData: diffWithUndefined(diffPlayerData),
});
