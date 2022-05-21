import React from 'react';

import type { GameComponent } from '../../../types';
import type { ValueProps } from '../../parts/types';
import type { ZDO } from '../types';
import { crc32, stableHashCode } from '../../../model/hash';

import { boolComp } from './bool';
import { colorComp } from './color';
import { DropComp } from './drop';
import { enumComp } from './enum';
import { floatComp } from './float';
import { idComp } from './id';
import { ArmorStandComp } from './armor-stand';
import { ItemsComp, ItemComp } from './items';
import { intComp } from './int';
import { hashedItemComp } from './hashed-item';
import { hashedLocationComp } from './hashed-location';
import { MapTable } from './map-table';
import { PrivateAreaComp } from './private-area';
import { RockHealthComp } from './rock-health';
import { RoomsComp } from './rooms';
import { SmelterQueueComp } from './smelter-queue';
import { stringComp } from './string';
import { TerrainComp } from './terrain';
import { timeComp } from './time';
import { vectorComp } from './vector';
import { WearNTearComp } from './wear-n-tear';
import { ItemPropsComp } from './item-props';
import { LiquidComp } from './liquid';
import { EpicLootComp } from './epic-loot';

const readOnly = true;

export const InterfaceFields: Partial<Record<GameComponent, React.ComponentType<ValueProps<ZDO> & { playersMap?: Map<bigint, string> }>[]>> = {
  ArmorStand: [
    ArmorStandComp,
  ],
  BaseAI: [
    boolComp('huntplayer'),
    vectorComp('spawnpoint'),
    boolComp('patrol'),
    vectorComp('patrolPoint'),
    timeComp('spawntime'),
    timeComp('lastWorldTime'),
    boolComp('haveTarget'),
    boolComp('alert'),
  ],
  Bed: [
    idComp('owner'),
    stringComp('ownerName')
  ],
  Beacon: [],
  Beehive: [
    timeComp('lastTime'),
    intComp('level'),
    floatComp('product'),
  ],
  Character: [
    floatComp('max_health'),
    floatComp('noise'),
    boolComp('tamed'),
    intComp('level'),
    // quaternionComp('tiltrot'),
    vectorComp('BodyVelocity'),
    /* EpicLoot
      string BountyData
      string BountyID
      string MonsterID
      string BountyTarget
      string BountyTargetName
    */
  ],
  Container: [
    boolComp('addedDefaultItems', { readOnly }),
    // boolComp('InUse'),
    ItemsComp,
    /* EpicLoot:
      bool 'TreasureMapChest.HasBeenFound'
      string 'TreasureMapChest.Biome'
      int 'TreasureMapChest.Interval'
    */
  ],
  CookingStation: [
    timeComp('StartTime'),
    floatComp('fuel'),
    ...[0, 1, 2, 3, 4].flatMap(idx => [
      stringComp(`slot${idx}`),
      floatComp(`slot${idx}`),
      enumComp(`slotstatus${idx}`, [[0, 'raw'], [1, 'cooked'], [2, 'burnt']]),
    ]),
  ],
  Corpse: [timeComp('timeOfDeath')],
  CreatureSpawner: [
    timeComp('alive_time'),
    // zdoidProp('spawn_id'),
  ],
  Destructible: [floatComp('health')],
  Door: [enumComp('state', [[1, 'opened'], [0, 'closed'], [-1, 'opened opposite']])],
  DungeonGenerator: [RoomsComp],
  Fermenter: [stringComp('Content'), timeComp('StartTime')],
  Fireplace: [floatComp('fuel'), timeComp('lastTime')],
  Fish: [vectorComp('spawnpoint')],
  FishingFloat: [idComp('RodOwner'), hashedItemComp('CatchID')],
  Humanoid: [boolComp('IsBlocking')],
  ItemDrop: [
    timeComp('SpawnTime'),
    ItemPropsComp,
    idComp('crafterID'),
    stringComp('crafterName'),
    EpicLootComp,
  ],
  ItemStand: [ItemComp],
  Leviathan: [boolComp('submerged', { hashFn: crc32 })],
  LiquidVolume: [LiquidComp],
  LocationProxy: [hashedLocationComp('location'), intComp('seed', { readOnly }), ({ value: zdo }) => <>
    <dt>world seed</dt>
    <dd>{(zdo.ints.get(stableHashCode('seed')) ?? 0) - zdo.sector.x * 4271 - zdo.sector.y * 9187}</dd>
  </>],
  // LootSpawner: [timeComp('spawn_time'),],
  MapTable: [MapTable],
  MineRock: [floatComp('Health'), floatComp('Health0')],
  MineRock5: [RockHealthComp],
  MonsterAI: [
    boolComp('DespawnInDay'),
    boolComp('EventCreature'),
    boolComp('sleeping'),
  ],
  Pickable: [boolComp('picked'), timeComp('picked_time')],
  PickableItem: [
    hashedItemComp('itemPrefab'),
    intComp('itemStack'),
  ],
  Piece: [idComp('creator')],
  Plant: [timeComp('plantTime')],
  Player: [
    // 'emoteID', 'emote', 'emote_oneshot',
    floatComp('Stealth'),
    floatComp('stamina'),
    boolComp('DebugFly'),
    idComp('playerID'),
    stringComp('playerName'),
    boolComp('wakeup'),
    boolComp('dead'),
    boolComp('dodgeinv'),
    intComp('baseValue', { readOnly }),
    boolComp('pvp'),
  ],
  PrivateArea: [PrivateAreaComp],
  Procreation: [intComp('lovePoints', { min: 0, max: 4 }), boolComp('pregnant')],
  Ragdoll: [
    floatComp('Hue'),
    floatComp('Saturation'),
    floatComp('Value'),
    vectorComp('InitVel'),
    DropComp,
  ],
  // RandomAnimation: ['<name>', 'RA_<name>',],
  RandomFlyingBird: [vectorComp('spawnpoint'), boolComp('landed'),],
  Saddle: [idComp('user'), floatComp('stamina', { min: 0, max: 300 }),],
  // SEMan: [maskComp('seAttrib')], // ColdResistance = 1, DoubleImpactDamage = 2, SailingPower = 4,
  Ship: [
    floatComp('rudder'),
    enumComp('forward', [[1, 'Back'], [0, 'Stop'], [2, 'Slow'], [3, 'Half'], [4, 'Full']]),
  ],
  ShipConstructor: [timeComp('spawntime'), boolComp('done'),],
  Sign: [stringComp('text')],
  // SpawnSystem: ['<b_|e_><creature><num>',],
  Smelter: [
    floatComp('fuel'),
    floatComp('accTime'),
    floatComp('bakeTimer'),
    timeComp('StartTime'),
    stringComp('SpawnOre'),
    intComp('SpawnAmount'),
    SmelterQueueComp,
  ],
  Tameable: [
    stringComp('TamedName'),
    floatComp('TameTimeLeft'),
    timeComp('TameLastFeeding'),
    boolComp('HaveSaddle'),
  ],
  // Teleport: [zdoidProp('target')],
  TeleportWorld: [stringComp('tag')],
  TerrainComp: [TerrainComp],
  Tombstone: [
    timeComp('timeOfDeath'),
    vectorComp('SpawnPoint'),
  ],
  TreeBase: [floatComp('health')],
  TreeLog: [floatComp('health')],
  VisEquipment: [
    intComp('ModelIndex', { readOnly }),
    colorComp('SkinColor'),
    colorComp('HairColor'),
    hashedItemComp('RightItem'), // intComp('RightItemVariant'),
    hashedItemComp('RightBackItem'), intComp('RightBackItemVariant'),
    hashedItemComp('LeftItem'), intComp('LeftItemVariant'),
    hashedItemComp('LeftBackItem'), intComp('LeftBackItemVariant'),
    hashedItemComp('ChestItem'),
    hashedItemComp('LegItem'),
    hashedItemComp('HelmetItem'),
    hashedItemComp('ShoulderItem'), intComp('ShoulderItemVariant'),
    stringComp('BeardItem'),
    stringComp('HairItem'),
    hashedItemComp('UtilityItem'),
  ],
  WearNTear: [WearNTearComp],
  ZNetView: [vectorComp('scale')],
  ZSyncTransform: [
    vectorComp('vel'),
    vectorComp('scale'),
    vectorComp('body_vel'),
    vectorComp('body_avel'),
    vectorComp('relPos'),
    stringComp('attachJoint'),
    // zdoidProp('parentID'),
  ],
};

