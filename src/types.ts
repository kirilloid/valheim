import { SkillType } from "./model/skills";

export type EntityId = string;

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

export type DamageModifiers = Record<Exclude<DamageType, DamageType.Damage>, DamageModifier>
  | [undefined, DamageModifier, DamageModifier, DamageModifier, DamageModifier, DamageModifier,
                DamageModifier, DamageModifier, DamageModifier, DamageModifier, DamageModifier];

export const damageModifiersValues: Record<DamageModifier, number> = {
  [DamageModifier.Normal]: 1,
  [DamageModifier.Resistant]: 0.5,
  [DamageModifier.Weak]: 1.5,
  [DamageModifier.Immune]: 0,
  [DamageModifier.Ignore]: 0,
  [DamageModifier.VeryResistant]: 0.25,
  [DamageModifier.VeryWeak]: 2,
};

export type Effect = {
  id: string;
  special?: 'Tailwind';
  time?: number;
  cooldown?: number;
  healthOverTime?: [change: number, interval: number],
  damageModifiers?: Partial<DamageModifiers>;
  attackModifier?: [skill: SkillType, modifier: number],
  stealth?: number;
  carryWeight?: number;
  runStamina?: number;
  jumpStamina?: number;
  healthRegen?: number;
  staminaRegen?: number;
  xpModifier?: number;
};

export type DamageProfile = Partial<Record<DamageType, number>>;
export type NormalAttackProfile = {
  dmg: DamageProfile;
  name: string;
  // knockback
  force?: number;
}
export type SpawnAttackProfile = {
  spawn: EntityId[];
  number: number;
  max: number;
}
export type AttackProfile = NormalAttackProfile | SpawnAttackProfile;

export interface DropEntry {
  item: EntityId;
  chance: number;
  min: number;
  max: number;
  scale: boolean;
  perPlayer: boolean;
}

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

export interface Creature {
  type: 'creature';
  id: EntityId;
  tier: number;
  emoji: string;
  // maxLvl: number;
  // upgradeDistance: number;
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
  StoneCutter,
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

export enum MaterialType {
  Wood,
  Stone,
  Iron,
  HardWood,
};

export type ComfortGroup = 'fire' | 'bed' | 'banner' | 'sit';

export interface BasePiece {
  id: EntityId;
  wear: {
    hp: number;
    damageModifiers: DamageModifiers;
  };
  recipe: {
    materials: Record<EntityId, number>;
    station: CraftingStation;
  }; 
}

export type Piece = BasePiece & {
  type: 'piece';
  disabled?: boolean;
  tier: number;
  wear: {
    hp: number;
    damageModifiers: DamageModifiers;
    noRoof?: boolean;
    noSupport?: boolean;
    providesSupport?: boolean;
    materialType?: MaterialType;
  };
  piece: {
    target: 'primary' | 'random' | 'none';
    water: boolean | undefined;
    size?: [width: number, depth: number, height: number];
    notOnWood?: boolean;
    onlyOnFlat?: boolean;
    notOnFloor?: boolean;
    groundOnly?: boolean;
    repairable?: boolean;
    nonRemovable?: boolean;
    allowedInDungeons?: boolean;
    requiredSpace?: number;
  };
} & ({
  subtype: 'fireplace';
  fireplace: {
    fuel: EntityId,
    capacity: number;
    burnTime: number;
    minHeightAbove: number;
    smoke: boolean;
    fireworks: boolean;
  };
  comfort?: {
    value: number,
    group: 'fire';
  };
} | {
  subtype: 'craft';
  craft: {
    id: CraftingStation;
    queueSize?: number;
    buildRange?: number;
    requiresRoof?: boolean;
    requiresFire?: boolean;
  };
} | {
  subtype: 'craft_ext'; 
  extends: {
    id: CraftingStation;
    distance: number;
    requiresRoof?: boolean;
    requiresFire?: boolean;
  };
} | {
  subtype: 'misc' | 'structure' | 'door';
} | {
  subtype: 'bed' | 'chair' | 'table' | 'decoration';
  comfort: {
    value: number,
    group?: ComfortGroup;
  };
} | {
  subtype: 'stand';
  supportedTypes: ItemType[];
} | {
  subtype: 'chest';
  space: [width: number, height: number];
});

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
  id: EntityId;
  dlc?: 'beta';
  tier: number;
  weight: number;
  stack?: number;
  floating?: true;
  teleportable?: false;
  recipe?: {
    time: number;
    materials: Record<EntityId, number>;
    materialsPerLevel: Record<EntityId, number>;
    source: { station: CraftingStation, level?: number };
    upgrade: { station: CraftingStation, level?: number };
  } | {
    time: number;
    materials: Record<EntityId, number>;
    source: { station: CraftingStation, level?: number };
    number: number;
  } | {
    value: number;
    number?: number;
  } | {
    biomes: Biome[];
    abundance: number;
    num: Pair<number>;
    group: Pair<number>;
    inForest?: Pair<number>;
    respawn: number;
  };
}

export enum ItemType {
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

export interface Resource extends BaseItem {
  type: 'item';
  emoji?: string;
  summon?: EntityId;
  power?: EntityId;
}

export interface Valuable extends BaseItem {
  type: 'value';
  emoji: string;
  value: number;
}

export interface Food extends BaseItem {
  type: 'food';
  emoji: string;
  health: number;
  stamina: number;
  duration: number;
  regen: number;
  color: string;
}

export interface Potion extends BaseItem {
  type: 'potion';
  emoji?: string;
  health?: [adds: number, time: number];
  stamina?: [adds: number, time: number];
  healthRegen?: number;
  staminaRegen?: number;
  resist?: DamageType[];
  cooldown: number;
}

type Pair<T> = [T, T];

interface BaseAttack {
  animation: string;
  stamina: number;
  mul?: { damage: number, force: number, stagger: number, };
  range: number;
}

interface MeleeAttack extends BaseAttack {
  chain: number;
  chainCombo: number;
}

interface BowAttack extends BaseAttack {
  projVel: Pair<number>;
  projAcc: Pair<number>;
}

export type Attack =
  | MeleeAttack & { type: 'melee' | 'area' }
  | BowAttack & { type: 'proj' }

export interface Arrow extends BaseItem {
  type: 'ammo';
  damage: DamageProfile;
  knockback: number;
}

export interface Tool extends BaseItem {
  type: 'tool';
  special: 'build' | 'garden' | 'ground' | 'fishing';
  maxLvl: number;
  durability: Pair<number>;
}

export interface Weapon extends BaseItem {
  type: 'weap';
  slot: 'primary' | 'both' | 'secondary' | 'bow' | 'either'
    | 'head' | 'shoulders' | 'body' | 'legs'
    | 'none' | 'util';
  skill: SkillType;
  special?: 'harpoon';
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
  durabilityDrainPerSec?: number;
}

export interface Armor extends BaseItem {
  type: 'armor';
  slot: 'head' | 'shoulders' | 'body' | 'legs' | 'util' | 'none';
  special?: 'light' | 'strength' | 'search';
  armor: Pair<number>;
  maxLvl: number;
  durability: Pair<number>;
  moveSpeed: number;
  damageModifiers?: Partial<DamageModifiers>;
}

export type Item = Resource | Valuable | Food | Potion | Weapon | Armor | Arrow | Tool;
export type ItemSpecial = Weapon['special'] | Armor['special'] | Tool['special'];

export enum Skill {
  Clubs,
  Swords
}
