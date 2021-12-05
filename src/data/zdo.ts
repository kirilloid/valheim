import { crc32, stableHashCode } from '../model/utils';
import { prefabNames } from './prefabs';

const buildHashMap = (values: string[]) => new Map(values.map(key => [stableHashCode(key), key]));

export const keys = buildHashMap([
  // BaseAI
  'huntplayer', 'spawnpoint', 'patrolPoint', 'patrol', 'spawntime', 'lastWorldTime', 'haveTarget', 'alert',
  // Bed
  'owner', 'ownerName',
  // Beehive
  'product', 'level',
  // Character
  'max_health', 'noise', 'level', 'tiltrot', 'BodyVelocity',
  // Container
  'addedDefaultItems', 'InUse', 'items',
  // CookingStation
  'StartTime', 'fuel', 'slot0', 'slotstatus0', 'slot1', 'slotstatus1', 'slot2', 'slotstatus2', 'slot3', 'slotstatus3', 'slot4', 'slotstatus4',
  // Corpse
  'timeOfDeath',
  // CreatureSpawner
  'alive_time', 'spawn_id',
  // Door
  'state',
  // DropItem
  'SpawnTime',
  // DungeonGenerator
  'rooms', 'room<num>', 'room<num>_pos', 'room<num>_rot',
  // Fermenter
  'Content', 'StartTime',
  // Fireplace
  'fuel', 'lastTime',
  // Fisth
  'spawnpoint',
  // FishingFloat
  'RodOwner', 'CatchID',
  // Human
  'IsBlocking',
  // ItemDrop
  'durability', 'stack', 'quality', 'variant', 'crafterID', 'crafterName',
  // ItemStand
  'item',
  // Leviathan
  'submerged',
  // LiquidVolumne
  'LiquidData',
  // LocationProxy
  'location', 'seed',
  // LootSpawner
  'spawn_time',
  // MapTable
  'data',
  // MineRock
  'Health<num>',
  // MineRock5
  'health', // base64 float array
  // MonsterAI
  'DespawnInDay', 'EventCreature', 'sleeping',
  // Pickable
  'picked', 'picked_time',
  // PickableItem
  'itemPrefab', 'itemStack',
  // Piece
  'creator',
  // Plant
  'plantTime',
  // Player
  'Stealth', 'stamina', 'emoteID', 'emote', 'emote_oneshot', 'baseValue',
  // PrivateArea
  'permitted', 'pu_id<num>', 'pu_name<num>',
  // Procreation
  'lovePoints', 'pregnant',
  // Ragdoll
  'Hue', 'Saturation', 'Value', 'InitVel', 'drops', 'drop_hash<num>', 'drop_amount<num>',
  // RandomAnimation
  '<name>', 'RA_<name>',
  // RandomFlyingBird
  'spawnpoint', 'landed',
  // Saddle
  'user', 'stamina',
  // SEMan
  'seAttrib',
  // Ship
  'rudder', 'forward',
  // ShipConstructor
  'spawntime', 'done',
  // Sign
  'text',
  // Spawner
  '<b_|e_><creature><num>',
  // Smelter
  'accTime', 'bakeTimer', 'SpawnAmount', 'SpawnOre', 'queued', 'item<num>',
  // Tameable
  'TameTimeLeft', 'HaveSaddle', 'TamedName', 'TameLastFeeding',
  // Teleport
  'target',
  // TerrainCompiler
  'TCData',
  // Tombstone
  'timeOfDeath', 'SpawnPoint',
  // TreeBase
  'health',
  // VisEquipment
  'ModelIndex', 'SkinColor', 'HairColor',
  'RightItem', 'RightItemVariant',
  'RightBackItem', 'RightBackItemVariant',
  'LeftItem', 'LeftItemVariant',
  'LeftBackItem', 'LeftBackItemVariant',
  'ChestItem', 'LegItem', 'HelmetItem',
  'ShoulderItem', 'ShoulderItemVariant',
  'BeardItem', 'HairItem', 'UtilityItem', 
  // WearNTear
  'health', 'support',
  // ZNetView
  'scale',
  // ZSyncTransform
  'vel', 'scale', 'body_vel', 'body_avel', 'relPos', 'attachJoint', 'parentID',
]);

for (const name of ['alert', 'inWater', 'onGround', 'encumbered', 'flying', 'sleeping', 'equipping', 'blocking', 'crouching', 'intro', 'forward_speed', 'sideway_speed', 'turn_speed', 'statei', 'statef', 'flapping', 'crafting']) {
  const hash = (crc32(name) + 438569) & 0xFFFFFFFF;
  keys.set(hash, name);
}

export const objects = buildHashMap(prefabNames);
export const getId = (map: Map<number, string>, hash: number): string => map.get(hash) ?? `!unknown_${(hash >>> 0).toString(16).padStart(8, '0')}`;
