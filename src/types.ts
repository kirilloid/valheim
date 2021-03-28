import { SkillType } from "./model/skills";

const enum Biome {
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

export const enum Faction {
  Players,
  AnimalsVeg,
  ForestMonsters,
  Undead, Demon, // best friends
  MountainMonsters, // everyone
  SeaMonsters, // everyone
  PlainsMonsters, // everyone
  Boss, // aggressive only to players
};

export const enum DamageType {
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

export const enum DamageModifiers {
  Normal,    // 1x
  Resistant, // 0.5x
  Weak,      // 1.5x
  Immune,    // 0x
  Ignore,    // 0x
  VeryResistant, // 0.25x
  VeryWeak,  // 2x
};

type DamageProfile = {
  type: DamageType;
  amount: number;
}[] | Partial<Record<DamageType, number>>;

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
  defeatKey?: string;
  faction: Faction;
  hp: number;
  staggerFactor?: number;
  attacks: DamageProfile[];
  damageModifiers: Record<DamageType, DamageModifiers>;
  drop: DropEntry[];
  tame?: { fedTime: number; tameTime: number; commandable: boolean; eats: string[] };
  pregnancy?: { time: number; chance: number };
}

export enum CraftingStation {
  Inventory,
  Workbench,
  Forge,
  ArtisanTable,
}

interface BaseItem {
  id: string;
  weight: number;
  stack: number;
  teleportable: boolean;
  recipe?: {
    materials: Record<string, number>;
    materialsPerLevel: Record<string, number>;
    source: { station: CraftingStation, level: number };
    upgrade: { station: CraftingStation, level: number };
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
}

interface Food extends BaseItem {
  type: 'food';
  health: number;
  stamina: number;
  duration: number;
  regen: number;
}

type Pair<T> = [T, T];

interface BaseAttack {
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
  | BaseAttack & { type: 'hor' | 'ver' | 'area' }
  | BowAttack & { type: 'proj' }

interface Weapon extends BaseItem {
  type: 'weap';
  hands: 'primary' | 'both' | 'secondary' | 'bow' | 'either'
    | 'head' | 'shoulders' | 'body' | 'legs'
    | 'none';
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
  durability: number | Pair<number>;
  skill: SkillType;
}

export type Item = Resource | Food | Weapon;

export enum Skill {
  Clubs,
  Swords
}

