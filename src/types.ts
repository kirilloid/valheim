import type { EnvId } from './data/env';
import { DungeonRoomsConfig } from './data/rooms';
import { DropDist } from './model/dist';
import { SkillType } from './model/skills';
import { Vector2i } from './model/utils';

export type EntityId = string;

export type GameComponent = 
| 'ArmorStand'
| 'BaseAI' | 'Beacon' | 'Bed' | 'Beehive'
| 'Chair' | 'Character' | 'Container' | 'CookingStation' | 'Corpse' | 'CraftingStation' | 'CraftingStationExtension' | 'CreatureSpawner'
| 'Destructible' | 'Door' | 'DungeonGenerator'
| 'Fermenter' | 'Fireplace' | 'Fish' | 'FishingFloat'
| 'Growup'
| 'Humanoid'
| 'ItemDrop' | 'ItemStand' // also boss stones & parts of some altars
| 'Leviathan' | 'LiquidVolume' /* TarLiquid */ | 'LocationProxy' /* ~ */ // | 'LootSpawner' // lootspawner_pineforest
| 'MapTable' | 'MineRock' | 'MineRock5' | 'MonsterAI'
| 'Pickable' | 'PickableItem' | 'Piece' | 'Plant' | 'Player' | 'PrivateArea' | 'Procreation'
| 'Ragdoll' | 'RandomAnimation' | 'RandomFlyingBird' | 'ResourceRoot' | 'Runestone' /* boss stones */
| 'Saddle' | 'SapCollector' | 'SEMan' | 'Ship' | 'ShipConstructor' | 'Sign' | 'Smelter'
| 'Tameable' | 'TeleportWorld' | 'TerrainComp' | 'TombStone' | 'TreeBase' | 'TreeLog' | 'Turret'
| 'Vagon' | 'Vegvisir' | 'VisEquipment'
| 'WearNTear' | 'Windmill' | 'WispSpawner'
| 'ZNetView' | 'ZSyncTransform'

export type EntityGroup =
  | 'banner' | 'bed' | 'beech' | 'berry' | 'birch' | 'bird' | 'blob'
  | 'chair' | 'chest' | 'cook'
  | 'demist'
  | 'fir' | 'fire'
  | 'goblin' | 'gray'
  | 'hide'
  | 'lumber'
  | 'metal'
  | 'ore'
  | 'rug'
  | 'seedTree' | 'seedVeg' | 'seeker' | 'ship' | 'smelt' | 'stack' | 'stand'
  | 'torch'
  | 'value'

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
  | 'Players' // 0
  | 'AnimalsVeg' // 1
  | 'ForestMonsters' // 2
  | 'Undead' // 3
  | 'Demon' // 4 best friends
  | 'MountainMonsters' // 5
  | 'SeaMonsters' // 6
  | 'PlainsMonsters' // 7
  | 'Boss' // 8 aggressive only to players
  | 'MistlandsMonsters' // 9
  | 'Dverger' // 10
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

export type BiomeConfig = {
  id: Biome;
  active: boolean;
  tier: number;
  emoji: string;
  locations: GameLocationId[];
  destructibles: Set<EntityId>;
  creatures: Set<Creature | Fish>;
  resources: Set<EntityId>;
};

export type LocationItem = { item: EntityId | LocationItem[], chance: number, number: number };

export type LocationConfig = {
  id: GameLocationId;
  typeId: GameLocationId;
  components?: GameComponent[];
  type: 'altar' | 'dungeon' | 'runestone' | 'misc';
  tier: number;
  tags?: string[];

  quantity: number,
  biomes: Biome[];
  biomeArea: number;
  prioritized: boolean;
  centerFirst: boolean;
  unique: boolean;
  group: string;
  minApart: number;
  iconAlways: boolean;
  iconPlaced: boolean;
  randomRotation: boolean;
  slopeRotation: boolean;
  terrainDelta: Pair<number>;
  inForest: Pair<number> | null;
  distance: Pair<number>;
  altitude: Pair<number>;
  // interior / exterior
  radius: Pair<number>;

  destructibles: DropDist;
  creatures: DropDist;
  resources: DropDist;
  customMusic?: string;
  items: LocationItem[],
  needsKey?: EntityId;
  dungeon?: DungeonRoomsConfig,
};

export type DungeonGenConfig = {
  id: string;
} & ({
  type: 'Dungeon';
  rooms: Pair<number>;
  minRequiredRooms: number;
  requiredRooms: string[];
  doorTypes: EntityId[];
  doorChance: number;
} /*| {
  type: 'CampGrid';
  rooms: Pair<number>;
  maxTilt: number;
  tileWidth: number;
  gridSize: number;
  spawnChance: number;
}*/ | {
  type: 'CampRadial';
  rooms: Pair<number>;
  maxTilt: number;
  radius: Pair<number>;
  perimeterSections: number;
  perimeterBuffer: number;
});

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
  type: 'effect';
  id: EntityId;
  disabled?: boolean;
  iconId?: string;
  tier: number;
  special?: 'Tailwind' | 'Demister';
  time?: number;
  comfort?: { value: number; };
  cooldown?: number;
  absorbDamage?: Pair<number>;
  healthOverTime?: [change: number, interval: number];
  damageModifiers?: Partial<DamageModifiers>;
  attackModifier?: [skill: SkillType, modifier: number];
  skillModifier?: [skill: SkillType, modifier: number];
  fallDamage?: number;
  carryWeight?: number;
  runStamina?: number;
  jumpStamina?: number;
  healthRegen?: number;
  staminaRegen?: number;
  eitrRegen?: number;
  xpModifier?: number;
  moveSpeed?: number;
};

export type DamageProfile = Record<DamageType, number>;
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
  number: Pair<number>;
  max: number;
}
export type CastAttackProfile = {
  cast: EntityId;
}
export type AttackProfile = NormalAttackProfile | SpawnAttackProfile | CastAttackProfile;
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

export interface GeneralDrop {
  offByOneBug?: boolean;
  chance?: number;
  oneOfEach?: boolean;
  num: Pair<number>;
  options: { item: EntityId, num?: Pair<number>, weight?: number }[];
}

export type SimpleDrop = Record<EntityId, number>;

export const TOLERATE = {
  WATER: 1,
  FIRE: 2,
  SMOKE: 4,
  TAR: 8,
};

export interface Spawner extends GameObjectBase {
  type: 'spawner';
  spawn: EntityId;
  levels: Pair<number>;
  levelUpChance: number;
}

export interface SpawnerConfig {
  tier: number;
  biomes: Biome[];
  biomeAreas: number;
  // counts number of spawned in loaded zones (5x5)
  maxSpawned: number;
  // passed time is divided by interval and rounded down
  interval: number;
  // checked on every attempt
  chance: number;
  // radius to check for closest
  distance: number;
  radius: Pair<number>;
  killed: EntityId | undefined;
  envs: EnvId[];
  groupSize: Pair<number>;
  groupRadius: number;
  night: boolean | undefined;
  altitude: Pair<number>;
  tilt: Pair<number>;
  forest: boolean | undefined;
  offset: number;
  levels: Pair<number>;
  minDistance: number;
}

export interface Creature extends GameObjectBase {
  ragdollId: EntityId | null;
  type: 'creature';
  PointLight?: PointLight;
  components: GameComponent[];
  emoji: string;
  upgradeDistance?: number;
  faction: Faction;
  maxLvl?: number;
  spawners: SpawnerConfig[];
  tolerate: number;
  speed: {
    // m_speed || m_flySlowSpeed
    walk: number;
    // m_runSpeed || m_flyFastSpeed
    run: number;
    // m_swimSpeed
    swim: number;
  };
  turnSpeed: {
    // m_turnSpeed || m_flyTurnSpeed
    walk: number;
    // m_runTurnSpeed || m_flyTurnSpeed
    run: number;
    // m_swimTurnSpeed
    swim: number;
  };
  hp: number;
  stagger: {
    factor: number;
    time: number;
  } | null;
  attacks: AttackVariety[];
  damageModifiers: DamageModifiers;
  weakSpots?: { location: string; damageModifiers: DamageModifiers }[];
  // Gjall, SeekerBrute, TheHive, SeekerQueen 
  drop: DropEntry[];
  tame?: { fedTime: number; tameTime: number; commandable: boolean; eats: EntityId[] };
  pregnancy?: { points: number; time: number; chance: number; grow: number; childId: EntityId };
}

export interface Fish extends GameObjectBase {
  type: 'fish';
  components: GameComponent[];
  emoji: string;
  stack: number;
  weight: Pair<number>;
  spawners: SpawnerConfig[];
  speed: number;
  turnSpeed: number;
  baits: Record<EntityId, number>;
  staminaUse: number;
  Deadspeak?: Deadspeak;
}

/**
 *           hp drop place plant
 * object  |   |    |  v  |     
 * tree    | v | v  |  v  |  v  
 * rock    | v | v  |  v  |     
 * carrot  |   | v  |     |  v  
 * seeds   |   | v  |  v  |  v  
 */
export interface Destructible {
  hp: number;
  damageModifiers: DamageModifiers;
  minToolTier: number;
  parts: {
    id: EntityId,
    num: number,
  }[],
}

export interface ResourceRoot {
  maxLevel: number;
  highThreshold: number;
  emptyTreshold: number;
  regenPerSec: number;
}

export interface Plantable {
  subtype: 'tree' | 'vegetable' | 'crop' | 'shroom',
  plantedWith: EntityId;
  growTime: Pair<number>;
  cultivatedGround: boolean;
  destroyUnhealthy: boolean;
  freeSpaceRadius: number;
  biomes: Biome[];
};

export interface SpawnArea {
  levelUpChance: number;
  maxNear: number;
  interval: number;
  prefabs: { prefab: EntityId, weight: number, level: Pair<number> }[],
};

export type PhysicalObject = GameObjectBase & {
  type: 'object';
  subtype: 'tree' | 'plant' | 'rock' | 'ore' | 'indestructible' | 'misc' | 'treasure';
  PointLight?: PointLight;
  Destructible?: Destructible;
  ResourceRoot?: ResourceRoot;
  drop?: GeneralDrop[];
  grow?: ItemGrow[];
  Plant?: Plantable;
  Beacon?: number;
  SpawnArea?: SpawnArea;
  floating?: true;
};

export enum MaterialType {
  Wood,
  Stone,
  Iron,
  HardWood,
  Marble,
};

export type ComfortGroup = 'fire' | 'bed' | 'banner' | 'chair' | 'table' | 'carpet';

export interface BasePiece extends GameObjectBase {
  wear: {
    hp: number;
    damageModifiers: DamageModifiers;
  };
  piece?: {
    target: 'primary' | 'random' | 'none';
    water: boolean | undefined;
    size: [width: number, height: number, depth: number];
    notOnWood?: boolean;
    onlyOnFlat?: boolean;
    notOnFloor?: boolean;
    onlyCeiling?: boolean;
    groundOnly?: boolean;
    repairable?: boolean;
    nonRemovable?: boolean;
    allowedInDungeons?: boolean;
    requiredSpace?: number;
  };
  recipe?: {
    type: 'craft_piece',
    materials: Record<EntityId, number>;
    station: EntityId | null;
  }; 
}

type Wear = {
  hp: number;
  damageModifiers: DamageModifiers;
  noRoof?: boolean;
  noSupport?: boolean;
  providesSupport?: boolean;
  materialType?: MaterialType;
};

export type Piece = BasePiece & {
  type: 'piece';
  base: boolean;
  demister?: number;
  wear: Wear;
  blockingPieces?: { pieces: EntityId[]; radius: number };
  SapCollector?: SapCollector;
  PointLight?: PointLight;
  Aoe?: {
    damage: DamageProfile;
    self: number;
    backstabBonus?: number;
  };
  Turret?: Turret;
} & ({
  subtype: 'fireplace';
  fireplace: {
    fuel: EntityId,
    capacity: number;
    burnTime: number;
    minHeightAbove: number;
    warmRadius: number;
    lightRadius: number;
    smoke: boolean;
    fireworks: boolean;
  };
  comfort?: {
    value: number,
    group?: 'fire';
  };
} | {
  subtype: 'craft';
  craft: {
    queueSize?: number;
    batchSize?: number;
    buildRange?: number;
    requiresRoof?: boolean;
    requiresFire?: boolean;
  };
} | {
  subtype: 'craft_ext'; 
  extends: {
    id: EntityId;
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
} | {
  subtype: 'external';
});

export interface Structure extends GameObjectBase {
  type: 'structure';
  Destructible?: Destructible;
}

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

interface GameEventSpawn {
  id: EntityId;
  max: number;
  group?: Pair<number>;
  interval: number;
  chance?: number;
}

export interface GameEvent {
  id: EntityId;
  tier: number;
  icon: EntityId;
  biomes: Biome[];
  killed: EntityId[];
  notKilled: EntityId[];
  duration: number;
  spawns: GameEventSpawn[];
  base: boolean;
}

interface GameObjectBase {
  id: EntityId;
  iconId?: string;
  group?: EntityGroup;
  components?: GameComponent[];
  tags?: string[];
  dlc?: 'beta';
  mod?: string;
  disabled?: true;
  season?: 'midsummer' | 'christmas' | 'helloween';
  tier: number;
  emoji?: string;
}

export interface ItemGrowConfig {
  num: Pair<number>;
  forcePlacement?: boolean;
  scale?: Pair<number>;
  randTilt?: number;
  chanceToUseGroundTilt?: number;
  locations: Biome[];
  biomeArea?: number;
  blockCheck?: boolean;
  altitude?: Pair<number>;
  oceanDepth?: Pair<number>;
  tilt?: Pair<number>;
  terrainDelta?: Pair<number>;
  terrainDeltaRadius?: number;
  offset?: number;
  group?: Pair<number>;
  groupRadius?: number;
  onSurface?: boolean;
  inForest?: Pair<number> | null;
  respawn?: number;
  abundance?: number;
}

export type ItemGrow = Required<ItemGrowConfig>;

export type ItemRecipe = {
  type: 'craft';
  time: number;
  onlyOneIngredient: boolean;
  materials: Record<EntityId, number>;
  materialsPerLevel: Record<EntityId, number>;
  source: { station: EntityId | null; level?: number };
  item: EntityId;
  number: number;
} | {
  type: 'trader';
  value: number;
  item: EntityId;
  number: number;
  killed?: EntityId;
};

export interface BaseItem extends GameObjectBase {
  stack?: number;
  maxLvl?: number;
  variants?: number;
  trophyPos?: Vector2i;
  weight: number;
  floating?: true;
  teleportable?: false;
  demister?: number;
  grow?: ItemGrow[];
  PointLight?: PointLight;
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
  Fish = 21,
  TwoHandedWeaponLeft = 22,
}

export interface Resource extends BaseItem {
  type: 'item' | 'trophy';
  emoji?: string;
  summon?: [EntityId, number];
  power?: EntityId;
  Deadspeak?: Deadspeak;
  Radiation?: Radiation;
  Food?: Food;
  EggGrow?: EggGrow;
  Potion?: Potion;
  Value?: number;
}

export interface Deadspeak {
  interval: number;
  chance: number;
  triggerDistance: number;
  ttl: number;
  texts: string[];
}

export interface SapCollector {
  from: EntityId;
  secPerUnit: number;
  maxLevel: number;
  item: EntityId;
}

type HexDigit =
  | '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7'
  | '8' | '9' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F'

export interface PointLight {
  range: number;
  intensity: number;
  color: string; //`#${HexDigit}${HexDigit}${HexDigit}${HexDigit}${HexDigit}${HexDigit}`;
}

export interface Turret {
  attackCooldown: number;
  allowedAmmo: EntityId[];
}

export interface Radiation {
  rate: Pair<number>;
  velocity: number;
  damage: DamageProfile;
}

export interface Food {
  health: number;
  stamina: number;
  eitr?: number;
  duration: number;
  regen: number;
}

export interface EggGrow {
  growTime: number;
  grownId: EntityId;
  requiresNearbyFire: boolean;
  requiresUnderRoof: boolean;
}

export interface Potion {
  health?: [adds: number, time: number];
  stamina?: [adds: number, time: number];
  eitr?: [adds: number, time: number];
  healthRegen?: number;
  staminaRegen?: number;
  eitrRegen?: number;
  damageModifiers?: Partial<DamageModifiers>;
  cooldown: number;
}

export type Pair<T> = [T, T];

export type AttackAnimation =
| 'unarmed_attack'
| 'unarmed_kick'
| 'swing_longsword'
| 'swing_axe'
| 'greatsword'
| 'greatsword_secondary'
| 'axe_secondary'
| 'knife_stab'
| 'knife_secondary'
| 'dual_knives'
| 'dual_knives_secondary'
| 'spear_poke'
| 'spear_throw'
| 'swing_sledge'
| 'bow_fire'
| 'crossbow_fire'
| 'swing_pickaxe'
| 'atgeir_attack'
| 'atgeir_secondary'
| 'mace_secondary'
| 'sword_secondary'
| 'battleaxe_attack'
| 'battleaxe_secondary'
| 'staff_rapidfire'
| 'staff_fireball'
| 'staff_summon'
| 'throw_bomb'
;

interface BaseAttack {
  animation: AttackAnimation;
  stamina: number;
  eitr?: number;
  healthPercent?: number;
  walkSpeed: number;
  rotationSpeed: number;
  startNoise: number;
  hitNoise: number;
  mul?: { damage: number, force: number, stagger: number, };
  range: number;
}

interface MeleeAttack extends BaseAttack {
  chain: number;
  chainCombo: number;
}

interface AreaAttack extends BaseAttack {
  radius: number;
}

interface BowAttack extends BaseAttack {
  projVel: Pair<number>;
  projAcc: Pair<number>;
  raiseSkillAmount?: number;
}

interface SummonAttack extends BaseAttack {
  summons: EntityId;
  skillFactor: number;
}

interface EffectAttack extends BaseAttack {
  id: EntityId;
}

export type Attack =
  | MeleeAttack & { type: 'melee' }
  | AreaAttack & { type: 'area' }
  | BowAttack & { type: 'proj' }
  | SummonAttack & { type: 'summon' }
  | EffectAttack & { type: 'cast' }

export interface Arrow extends BaseItem {
  type: 'arrow' | 'bolt' | 'missile';
  damage: DamageProfile;
  knockback: number;
}

export interface Tool extends BaseItem {
  type: 'tool';
  special: 'build' | 'garden' | 'ground' | 'fishing' | 'butcher' | 'demister';
  maxLvl: number;
  durability: Pair<number>;
  produces: EntityId[];
}

export interface Weapon extends BaseItem {
  type: 'weapon';
  emoji: string;
  slot: 'primary' | 'both' | 'secondary' | 'bow' | 'either'
    | 'head' | 'shoulders' | 'body' | 'legs'
    | 'none';
  special?: 'harpoon';
  maxLvl: number;
  moveSpeed: number;
  block: number | Pair<number>;
  // knockback when blocking
  parryForce: number | Pair<number>;
  // perfect block multiplier
  parryBonus: number;
  skill: Exclude<SkillType, SkillType.Blocking> | null;
  toolTier?: number;
  damage: Pair<DamageProfile>;
  knockback: number;
  backstab: number;
  attacks: Attack[];
  durability: Pair<number>;
  durabilityDrainPerSec?: number;
  set?: ItemSet;
  holdDurationMin?: number;
  holdStaminaDrain?: number;
}
export interface Shield extends BaseItem {
  type: 'shield';
  emoji: string,
  slot: 'secondary';
  maxLvl: number;
  moveSpeed: number;
  damageModifiers?: Partial<DamageModifiers>;
  block: number | Pair<number>;
  parryForce: number | Pair<number>;
  parryBonus: number;
  skill: SkillType.Blocking;
  damage?: Pair<DamageProfile>;
  knockback?: number;
  backstab?: number;
  durability: Pair<number>;
  set?: ItemSet;
}

export interface Armor extends BaseItem {
  type: 'armor';
  slot: 'head' | 'shoulders' | 'body' | 'legs'  | 'util' | 'none';
  special?: 'light' | 'strength' | 'search' | 'demister';
  hideHair?: boolean;
  hideBeard?: boolean;
  maxLvl: number;
  moveSpeed: number;
  armor: Pair<number>;
  damageModifiers?: Partial<DamageModifiers>;
  durability: Pair<number>;
  eitrRegen?: number;
  set?: ItemSet;
  effect?: Effect;
}

export type Item = Resource | Weapon | Shield | Armor | Arrow | Tool;
export type ItemSet = { name: string; items: EntityId[]; bonus: (Effect | undefined)[]; };
export type ItemSpecial = Weapon['special'] | Armor['special'] | Tool['special'];

export type GameObject = Item | Piece | Structure | PhysicalObject | Spawner | Ship | Cart | Creature | Fish;
