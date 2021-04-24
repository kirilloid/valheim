import { SkillType } from "./model/skills";

export enum Biome {
  Meadows,
  BlackForest,
  Swamp,
  Mountain,
  Plains,
  Ocean,
  Mistlands,
  DeepNorth,
  Ashlands,
}

export enum Faction {
  Players,
  AnimalsVeg,
  ForestMonsters,
  Undead, Demon, // best friends
  MountainMonsters,
  SeaMonsters,
  PlainsMonsters,
  Boss, // aggressive only to players
};

export enum DamageType {
  Damage,
  Blunt,
  Slash,
  Pierce,
  Chop,
  Pickaxe,
  Fire,
  Frost,
  Lightning,
  Poison,
  Spirit,
};

export enum DamageModifier {
  Normal,    // 1x
  Resistant, // 0.5x
  Weak,      // 1.5x
  Immune,    // 0x
  Ignore,    // 0x
  VeryResistant, // 0.25x
  VeryWeak,  // 2x
};

export type DamageModifiers = Record<Exclude<DamageType, DamageType.Damage>, DamageModifier>;

export const damageModifiersValues: Record<DamageModifier, number> = {
  [DamageModifier.Normal]: 1,
  [DamageModifier.Resistant]: 0.5,
  [DamageModifier.Weak]: 1.5,
  [DamageModifier.Immune]: 0,
  [DamageModifier.Ignore]: 0,
  [DamageModifier.VeryResistant]: 0.25,
  [DamageModifier.VeryWeak]: 2,
};

export type DamageProfile = Partial<Record<DamageType, number>>;
export type AttackProfile = {
  dmg: DamageProfile;
  name: string;
  // knockback
  force?: number;
} | {
  spawn: string[];
  number: number;
  max: number;
};

export interface DropEntry {
  item: string;
  chance: number;
  min: number;
  max: number;
  scale: boolean;
  perPlayer: boolean;
}

export const dropEntry = (item: string, options: Partial<Omit<DropEntry, 'item'>> = {}): DropEntry => {
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

export const dropTrophy = (item: string, chance: number) => {
  return dropEntry(item, { chance, scale: false });
};

export interface Creature {
  id: string;
  tier: number;
  emoji: string;
  defeatKey?: string;
  faction: Faction;
  hp: number;
  staggerFactor: number;
  staggerBlocked: boolean;
  attacks: AttackProfile[];
  damageModifiers: DamageModifiers;
  drop: DropEntry[];
  tame?: { fedTime: number; tameTime: number; commandable: boolean; eats: string[] };
  pregnancy?: { time: number; chance: number };
}

export enum CraftingStation {
  Inventory,
  Workbench,
  Forge,
  ArtisanTable,
  CookingStation, // overcooked: 75431; 75432 -> 75418: 25, 75538 -> 75420: 20, 75533 -> 75504: 60, 75448 -> 75554: 60, 75489 -> 75559: 25 
  Cauldron,
  Fermenter,
  Smelter, // fuel: 75431; 75512 -> 75520, 75531 -> 75553, 75399 -> 75553, 75463 -> 75434, 75419 -> 75404
  BlastFurnace,
  CharcoalKiln,
  Windmill,
  SpinningWheel,
  Cultivator,
}

interface BasePiece {
  id: string;
  hp: number;
  damageModifiers: DamageModifiers;
  recipe: {
    materials: Record<string, number>;
    station: CraftingStation | null;
  }; 
}

export interface Ship extends BasePiece {
  type: 'ship';
  sail: {
    forceDistance: number;
    force: number;
    damping: number;
    dampingSideway: number;
    dampingForward: number;
    angularDamping: number;
    sailForceOffset: number;
    sailForceFactor: number;
    rudderForce: number;
    waterLevelOffset: number;
    disableLevel: number;
  }
}

interface BaseItem {
  id: string;
  dlc?: 'beta';
  tier: number;
  weight: number;
  stack?: number;
  teleportable?: false;
  recipe?: {
    time: number;
    materials: Record<string, number>;
    materialsPerLevel: Record<string, number>;
    source: { station: CraftingStation, level?: number };
    upgrade: { station: CraftingStation, level?: number };
  } | {
    time: number;
    materials: Record<string, number>;
    source: { station: CraftingStation, level?: number };
    number: number;
  } | {
    value: number;
  };
}

enum ItemType {
  None = 0,
  Material = 1,
  Consumable = 2,
  OneHandedWeapon = 3,
  Bow = 4,
  Shield = 5,
  Helmet = 6,
  Chest = 7,
  Ammo = 9,
  Customization = 10,
  Legs = 11,
  Hands = 12,
  Trophie = 13,
  TwoHandedWeapon = 14,
  Torch = 15,
  Misc = 16,
  Shoulder = 17,
  Utility = 18,
  Tool = 19,
  Attach_Atgeir = 20,
}

interface Resource extends BaseItem {
  type: 'item';
  emoji?: string;
}

interface Valuable extends BaseItem {
  type: 'value';
  emoji: string;
  value: number;
}

interface Food extends BaseItem {
  type: 'food';
  emoji: string;
  health: number;
  stamina: number;
  duration: number;
  regen: number;
  color: string;
}

type Pair<T> = [T, T];

export interface BaseAttack {
  chain: number;
  chainCombo: number;
  stamina: number;
  mul?: { damage: number, force: number, stagger: number, };
  range: number;
}

interface BowAttack extends BaseAttack {
  projVel: Pair<number>;
  projAcc: Pair<number>;
}

type Attack =
  | BaseAttack & { type: 'melee' | 'area' }
  | BowAttack & { type: 'proj' }

export interface Arrow extends BaseItem {
  type: 'ammo';
  damage: DamageProfile;
  knockback: number;
}

export interface Weapon extends BaseItem {
  type: 'weap';
  slot: 'primary' | 'both' | 'secondary' | 'bow' | 'either'
    | 'head' | 'shoulders' | 'body' | 'legs'
    | 'none' | 'util';
  skill: SkillType;
  toolTier?: number;
  damage: Pair<DamageProfile>;
  attacks: Attack[];
  block: number | Pair<number>;
  parryForce: number | Pair<number>;
  parryBonus: number;
  maxLvl: number;
  knockback: number;
  backstab: number;
  moveSpeed: number;
  durability: Pair<number>;
}

interface Armor extends BaseItem {
  type: 'armor';
  slot: 'head' | 'shoulders' | 'body' | 'legs' | 'none';
  armor: Pair<number>;
  maxLvl: number;
  durability: Pair<number>;
  moveSpeed: number;
  damageModifiers?: Partial<DamageModifiers>;
}

export type Item = Resource | Valuable | Food | Weapon | Armor | Arrow;

export enum Skill {
  Clubs,
  Swords
}
