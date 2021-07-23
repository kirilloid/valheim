import { SkillType } from "./model/skills";

export type EntityId = string;

export type Biome =
  | 'Meadows'
  | 'BlackForest'
  | 'Swamp'
  | 'Mountain'
  | 'Plains'
  | 'Ocean'
  | 'Mistlands'
  | 'DeepNorth'
  | 'Ashlands';

export type GameLocationId = string;
/*  | 'StoneCircle' | 'StartTemple'
  | 'VikingVillage' | 'DraugrVillage' | 'EikthyrAltar'
  | 'ForestTower' | 'BurialChamber' | 'TrollCave' | 'Trader' | 'ElderAltar'
  | 'SunkenCrypt' | 'FireGeyser' | 'SwampStoneCircle' | 'BonemassAltar'
  | 'MountainTower' | 'MountainCastle' | 'EggNest' | 'ModerAltar'
  | 'GoblinVillage' | 'PlainsTower' | 'PlainsOutpost' | 'StoneHedge' | 'YagluthAltar'
  ;*/

export type Faction =
  | 'Players'
  | 'AnimalsVeg'
  | 'ForestMonsters'
  | 'Undead'
  | 'Demon' // best friends
  | 'MountainMonsters'
  | 'SeaMonsters'
  | 'PlainsMonsters'
  | 'Boss' // aggressive only to players
  ;

export type DamageType = 
  | 'blunt'
  | 'slash'
  | 'pierce'
  | 'chop'
  | 'pickaxe'
  | 'fire'
  | 'frost'
  | 'lightning'
  | 'poison'
  | 'spirit'
  ;

export type DamageModifier =
  | 'normal'
  | 'resistant'
  | 'weak'
  | 'immune'
  | 'ignore'
  | 'veryResistant'
  | 'veryWeak'
  ;

export type DamageModifiers = Record<DamageType, DamageModifier>;

const idxToMod: DamageModifier[] = ['normal', 'resistant', 'weak', 'immune', 'ignore', 'veryResistant', 'veryWeak'];
export function mods(values: [blunt: number, slash: number, pierce: number, chop: number, pickaxe: number, fire: number, frost: number, lightning: number, poison: number, spirit: number]): DamageModifiers {
  const [blunt, slash, pierce, chop, pickaxe, fire, frost, lightning, poison, spirit] = values.map(v => idxToMod[v]!);
  return { blunt, slash, pierce, chop, pickaxe, fire, frost, lightning, poison, spirit } as DamageModifiers;
}

export type BiomeConfig = {
  id: Biome;
  active: boolean;
  tier: number;
  locations: GameLocationId[];
  destructibles: Destructible[];
  creatures: Creature[];
  resources: EntityId[];
}

export type LocationConfig = {
  id: GameLocationId;
  biome: Biome;
  quantity: number;
  type: 'altar' | 'dungeon' | 'runestone' | 'misc';
  canHaveVegvisir: boolean;
  minApart: number;
  altitude: [number, number];
  distance: [number, number];
  chest?: GeneralDrop;
  destructibles: Destructible[];
  creatures: Creature[];
  resources: EntityId[];
}

export const damageModifiersValues: Record<DamageModifier, number> = {
  normal: 1,
  resistant: 0.5,
  weak: 1.5,
  immune: 0,
  ignore: 0,
  veryResistant: 0.25,
  veryWeak: 2,
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
  burst?: number;
  name: string;
  unblockable?: true;
  undodgeable?: true;
  stagger?: number;
  // knockback
  force?: number;
  toolTier?: number;
}
export type SpawnAttackProfile = {
  spawn: EntityId[];
  number: number;
  max: number;
}
export type AttackProfile = NormalAttackProfile | SpawnAttackProfile;
export type AttackVariety = {
  rate: number;
  variety: string;
  attacks: AttackProfile[];
};

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

export interface GeneralDrop {
  chance?: number,
  oneOfEach?: boolean,
  num: Pair<number>,
  options: { item: EntityId, num?: Pair<number>, weight?: number }[];
}

export type SimpleDrop = Record<EntityId, number>;

export interface Creature extends GameObjectBase {
  type: 'creature';
  emoji: string;
  maxLvl: number;
  upgradeDistance?: number;
  nightOnly?: true;
  faction: Faction;
  locations: (Biome | GameLocationId)[];
  hp: number;
  stagger?: {
    factor: number;
    time: number;
  };
  attacks: AttackVariety[];
  damageModifiers: DamageModifiers;
  drop: DropEntry[];
  tame?: { fedTime: number; tameTime: number; commandable: boolean; eats: string[] };
  pregnancy?: { time: number; chance: number };
}

export interface Plant extends GameObjectBase {
  type: 'plant';
  subtype: 'tree' | 'vegetable' | 'crop';
  growTime: Pair<number>;
  growsInto: EntityId;
  cultivatedGround: boolean;
  destroyUnhealthy: boolean;
  freeSpaceRadius: number;
  biomes: Biome[];
};

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
  BeeHive,
}

export enum MaterialType {
  Wood,
  Stone,
  Iron,
  HardWood,
};

export type ComfortGroup = 'fire' | 'bed' | 'banner' | 'sit';

export interface BasePiece extends GameObjectBase {
  wear: {
    hp: number;
    damageModifiers: DamageModifiers;
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
  recipe: {
    type: 'craft_piece',
    materials: Record<EntityId, number>;
    station: CraftingStation;
  }; 
}

export type Piece = BasePiece & {
  type: 'piece';
  wear: {
    hp: number;
    damageModifiers: DamageModifiers;
    noRoof?: boolean;
    noSupport?: boolean;
    providesSupport?: boolean;
    materialType?: MaterialType;
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

export interface Transport extends BasePiece {
  type: 'ship' | 'cart';
  storage: [columns: number, rows: number];
}

export interface Ship extends Transport {
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
  };
  speed: {
    rudder: number;
    half: number[];
    full: number[];
  };
}

export interface Cart extends Transport {
  type: 'cart';
}

export interface Destructible extends GameObjectBase {
  type: 'destructible';
  hp: number;
  locations: (Biome | GameLocationId)[],
  damageModifiers: DamageModifiers;
  minToolTier: number;
  parts: {
    id: EntityId,
    num: number,
  }[],
  drop: GeneralDrop[];
}

interface GameEventSpawn {
  id: EntityId;
  max: number;
  group?: Pair<number>;
  interval: number;
  chance?: number;
}

export interface GameEvent {
  id: EntityId;
  biomes: Biome[];
  killed: EntityId[];
  notKilled: EntityId[];
  duration: number;
  spawns: GameEventSpawn[];
  base: boolean;
}

interface GameObjectBase {
  id: EntityId;
  tags?: string[];
  dlc?: 'beta';
  disabled?: true;
  season?: 'midsummer' | 'christmas' | 'helloween';
  tier: number;
  emoji?: string;
}

export interface RecipeGrow {
  type: 'grow';
  locations: (Biome | GameLocationId)[];
  abundance: number;
  num: Pair<number>;
  group: Pair<number>;
  inForest?: Pair<number>;
  respawn: number;
}

interface BaseItem extends GameObjectBase {
  weight: number;
  stack?: number;
  floating?: true;
  teleportable?: false;
  recipe?: {
    type: 'craft_upg';
    time: number;
    materials: Record<EntityId, number>;
    materialsPerLevel: Record<EntityId, number>;
    source: { station: CraftingStation, level?: number };
    upgrade: { station: CraftingStation, level?: number };
  } | {
    type: 'craft_one';
    time: number;
    materials: Record<EntityId, number>;
    source: { station: CraftingStation, level?: number };
    number: number;
  } | {
    type: 'trader';
    value: number;
    number?: number;
  } | RecipeGrow;
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
  type: 'item' | 'trophy';
  emoji?: string;
  summon?: [EntityId, number];
  power?: EntityId;
}

export interface Valuable extends BaseItem {
  type: 'valuable';
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
  resist?: Partial<DamageModifiers>;
  cooldown: number;
}

export type Pair<T> = [T, T];

export type AttackAnimation =
| 'unarmed_attack'
| 'unarmed_kick'
| 'swing_longsword'
| 'swing_axe'
| 'knife_stab'
| 'knife_secondary'
| 'spear_poke'
| 'spear_throw'
| 'swing_sledge'
| 'bow_fire'
| 'swing_pickaxe'
| 'atgeir_attack'
| 'atgeir_secondary'
| 'mace_secondary'
| 'sword_secondary'
| 'battleaxe_attack'
| 'battleaxe_secondary'
| 'throw_bomb'
;

interface BaseAttack {
  animation: AttackAnimation;
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
  produces: EntityId[];
}

export interface Weapon extends BaseItem {
  type: 'weapon';
  emoji: string;
  slot: 'primary' | 'both' | 'secondary' | 'bow' | 'either'
    | 'head' | 'shoulders' | 'body' | 'legs'
    | 'none' | 'util';
  skill: Exclude<SkillType, SkillType.Blocking> | null;
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
  holdDurationMin?: number;
  holdStaminaDrain?: number;
  durability: Pair<number>;
  durabilityDrainPerSec?: number;
}

export interface Shield extends BaseItem {
  type: 'shield';
  emoji: string,
  damage?: DamageProfile;
  slot: 'secondary';
  skill: SkillType.Blocking;
  block: number | Pair<number>;
  parryForce: number | Pair<number>;
  parryBonus: number;
  maxLvl: number;
  knockback?: number;
  backstab?: number;
  moveSpeed: number;
  durability: Pair<number>;
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

export type Item = Resource | Valuable | Food | Potion | Weapon | Shield | Armor | Arrow | Tool;
export type ItemSpecial = Weapon['special'] | Armor['special'] | Tool['special'];

export type GameObject = Item | Piece | Destructible | Ship | Cart | Creature | Plant;

export enum Skill {
  Clubs,
  Swords
}
