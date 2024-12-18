import type { DamageModifier, DamageModifiers, DamageProfile, DropEntry, EntityId, GeneralDrop, ItemGrow, ItemGrowConfig, LocationItem, Pair } from '../types';
import type { EnvId } from '../data/env';

// TIME
export const FRAME = 1 / 50;
export const GAME_DAY = 1800;
export const EVENT_PERIOD = 46 * 60;
export const REAL_HOUR = 3600;

// WEATHER
export const INTRO_DURATION = 2040;
export const INTRO_WEATHER: EnvId = 'ThunderStorm';
export const WIND_PERIOD = 125;
export const WEATHER_PERIOD = 666;

// SIZE
export const WORLD_RADIUS = 10500;
export const WORLD_SIZE = WORLD_RADIUS * 2;
export const ZONE_SIZE = 64;
export const ZONE_MAX_CC = Math.round(WORLD_RADIUS / ZONE_SIZE);
export const WATER_LEVEL = 30;

// PLAYER
export const BASE_HEALTH = 25;
export const BASE_STAMINA = 50;
export const BASE_EITR = 0;
export const MAX_PLAYERS = 10;
export const DODGE_STAMINA = 15;
export const DEFAULT_MIN_DATE = new Date(2021, 1, 2);

// INVENTORY
export const INVENTORY_WIDTH = 8;
export const INVENTORY_HEIGHT = 4;
export const INVENTORY_SIZE = INVENTORY_WIDTH * INVENTORY_HEIGHT;

export const WORLD_CONFIG = {
  difficultyScaleMaxPlayers: 5,
  damageScalePerPlayer: 0.04,
  healthScalePerPlayer: 0.3,
  nonScaledDropTypes: 0xd000000,
  worldLevelEnemyBaseAC: 60,
  worldLevelEnemyHPMultiplier: 2.5,
  worldLevelEnemyBaseDamage: 35,
  worldLevelGearBaseAC: 38,
  worldLevelGearBaseDamage: 120,
  worldLevelEnemyLevelUpExponent: 1.15,
  worldLevelEnemyMoveSpeedMultiplier: 0.3,
  worldLevelPieceBaseDamage: 100,
  worldLevelPieceHPMultiplier: 1,
  worldLevelMineHPMultiplier: 4,
};

export const singleDrop = (item: EntityId, min: number = 1, max: number = min): GeneralDrop => ({
  num: [min, max],
  options: [{ item }]
});

export const dropEntry = (item: EntityId, options: Partial<Omit<DropEntry, 'item'>> = {}): DropEntry => {
  return {
    item,
    chance: 1,
    min: 1,
    max: 1,
    scale: true,
    perPlayer: false,
    ...options,
  }
};

export const dropTrophy = (item: EntityId, chance: number) => {
  return dropEntry(item, { chance, scale: false });
};

export const locItem = (item: EntityId | LocationItem[], chance: number = 1, number: number = 1): LocationItem => {
  return { item, chance, number };
};

export const dmg = (damage: Partial<DamageProfile>): DamageProfile => {
  return {
    blunt: 0,
    slash: 0,
    pierce: 0,
    chop: 0,
    pickaxe: 0,
    fire: 0,
    frost: 0,
    lightning: 0,
    poison: 0,
    spirit: 0,
    ...damage,
  }
};

const idxToMod: DamageModifier[] = ['normal', 'resistant', 'weak', 'immune', 'ignore', 'veryResistant', 'veryWeak'];
export function mods(values: [blunt: number, slash: number, pierce: number, chop: number, pickaxe: number, fire: number, frost: number, lightning: number, poison: number, spirit: number]): DamageModifiers {
  const [blunt, slash, pierce, chop, pickaxe, fire, frost, lightning, poison, spirit] = values.map(v => idxToMod[v]!);
  return { blunt, slash, pierce, chop, pickaxe, fire, frost, lightning, poison, spirit } as DamageModifiers;
}

export function itemGrow(...grows: ItemGrowConfig[]): ItemGrow[] {
  return grows.map(grow => ({
    forcePlacement: false,
    scale: [1, 1],
    randTilt: 15,
    chanceToUseGroundTilt: 0,
    biomeArea: 7,
    blockCheck: true,
    abundance: 1,
    altitude: [1, 1000],
    oceanDepth: [0, 0],
    tilt: [0, 90],
    terrainDelta: [0, 2],
    terrainDeltaRadius: 0,
    offset: 0,
    group: [1, 1],
    groupRadius: 20,
    onSurface: false,
    inForest: null,
    respawn: 0,
    ...grow,
  }));
};

export const xp = (lvl: number) => lvl ** 1.5 / 2 + 0.5;

export const nonPlayerBuildDrop = (value: number) => Math.max(1, Math.floor(value / 3));

export function spawnChance(levels: Pair<number>, levelUpChance: number, level: number): number {
  if (level < levels[0]) return 0;
  if (level > levels[1]) return 0;
  if (level === levels[1]) return levelUpChance ** (levels[1] - levels[0]);
  return (1 - levelUpChance) * levelUpChance ** (level - levels[0]);
}
