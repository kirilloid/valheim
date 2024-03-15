import { clamp, Vector3 } from '../model/utils';
import { SkillType } from '../model/skills';

import { PackageReader, PackageWriter } from './Package';
import * as Inventory from './Inventory';
import { sha512 } from './sha512';
import * as DATA_VERSION from './versions';
import { data as itemDB } from '../data/itemDB';
import { checkVersion, PLAYER, PLAYER_DATA, SKILLS } from './versions';
import { PlayerStatType } from './PlayerStatType';

type World = {
  spawnPoint?: Vector3;
  logoutPoint?: Vector3;
  deathPoint?: Vector3;
  homePoint: Vector3;
  mapData?: Uint8Array;
};

export type SkillDatum = { level: number, accumulator: number };
export type SkillData = Map<SkillType, SkillDatum>;

type FoodData = {
  id: string;
  time: number;
};

export type PlayerData = {
  version: number;
  health: number;
  maxHealth: number;
  stamina: number;
  maxStamina: number;
  eitr: number;
  maxEitr: number;
  firstSpawn: boolean;
  timeSinceDeath: number;
  guardianPower: string;
  guardianPowerCooldown: number;
  inventory: Inventory.Data;
  knownRecipes: string[];
  knownStations: Map<string, number>;
  knownMaterials: string[];
  shownTutorials: string[];
  uniques: string[];
  trophies: string[];
  knownBiome: number[]
  knownTexts: Map<string, string>;
  
  beardItem: string;
  hairItem: string;
  skinColor: Vector3;
  hairColor: Vector3;
  modelIndex: number;
  foods: FoodData[];
  skillData?: SkillData;
  customData: Map<string, string>;
};

type PlayerStats = number[] ;

export type Player = {
  version: number;
  stats: PlayerStats;
  worlds: Map<bigint, World>;
  playerName: string;
  playerID: bigint;
  startSeed: string;
  usedCheats: boolean;
  dateCreated: Date;
  knownWorlds: Map<string, number>;
  knownWorldKeys: Map<string, number>;
  knownCommands: Map<string, number>;
  playerData?: PlayerData;
};

function readPlayerStats(version: number, reader: PackageReader): PlayerStats {
  if (version >= 38) {
    return reader.readArray(reader.readFloat);
  }
  const result: PlayerStats = [];
  if (version >= 28) {
    result[PlayerStatType.EnemyKills] = reader.readInt();
    result[PlayerStatType.Deaths] = reader.readInt();
    result[PlayerStatType.CraftsOrUpgrades] = reader.readInt();
    result[PlayerStatType.Builds] = reader.readInt();
  }
  return result;
}

function writePlayerStats(version: number, pkg: PackageWriter, stats: PlayerStats): void {
  if (version >= 38) {
    pkg.writeArray(pkg.writeFloat, stats);
  } else if (version >= 28) {
    pkg.writeInt(stats[PlayerStatType.EnemyKills] ?? 0);
    pkg.writeInt(stats[PlayerStatType.Deaths] ?? 0);
    pkg.writeInt(stats[PlayerStatType.CraftsOrUpgrades] ?? 0);
    pkg.writeInt(stats[PlayerStatType.Builds] ?? 0);
  }
}

function readCustomPoint(reader: PackageReader) {
  const haveCustomPoint = reader.readBool();
  const customPoint = reader.readVector3();
  return haveCustomPoint ? customPoint : undefined;
}

function writeCustomPoint(pkg: PackageWriter, point?: Vector3): void {
  pkg.writeBool(point != null);
  pkg.writeVector3(point ?? { x: 0, y: 0, z: 0 });
}

function* readPlayer(bytes: Uint8Array): Generator<number, Player> {
  const reader = new PackageReader(bytes);
  const version = reader.readInt();
  checkVersion('player', version, PLAYER);
  const stats = readPlayerStats(version, reader)
  const worldsNumber = reader.readInt();
  const worlds = new Map<bigint, World>();
  for (let i = 0; i < worldsNumber; i++) {
    const key = reader.readLong();
    const spawnPoint = readCustomPoint(reader);
    const logoutPoint = readCustomPoint(reader);
    const deathPoint = version >= 30 ? readCustomPoint(reader) : undefined;
    const homePoint = reader.readVector3();
    const mapData = version >= 29 ? reader.readIf(reader.readByteArray) : undefined;
    worlds.set(key, {
      spawnPoint,
      logoutPoint,
      deathPoint,
      homePoint,
      mapData,
    });
    yield i / worldsNumber;
  }
  const playerName = reader.readString();
  const playerID = reader.readLong();
  const startSeed = reader.readString();

  if (version >= 38) {
    const usedCheats = reader.readBool();
    const dateCreated = new Date(Number(reader.readLong()) * 1000);

    const knownWorlds = reader.readMap(reader.readString, reader.readFloat);
    const knownWorldKeys = reader.readMap(reader.readString, reader.readFloat);
    const knownCommands = reader.readMap(reader.readString, reader.readFloat);

    const playerData = reader.readIf(reader.readByteArray);

    return {
      version,
      stats,
      worlds,
      playerName,
      playerID,
      startSeed,
      usedCheats,
      dateCreated,
      knownWorlds,
      knownWorldKeys,
      knownCommands,
      playerData: playerData && readPlayerData(playerData),
    };
  } else {
    const playerData = reader.readIf(reader.readByteArray);
    return {
      version,
      stats,
      worlds,
      playerName,
      playerID,
      startSeed,
      usedCheats: false,
      dateCreated: new Date(2021, 1, 2),
      knownWorlds: new Map(),
      knownWorldKeys: new Map(),
      knownCommands: new Map(),
      playerData: playerData && readPlayerData(playerData),
    };
  }
}

function* writePlayer(
  player: Player,
  writer: PackageWriter,
) {
  const total = player.worlds.size + 1;
  let current = 0;
  writer.writeInt(player.version);
  writePlayerStats(player.version, writer, player.stats);
  writer.writeInt(player.worlds.size);
  for (const [key, world] of player.worlds) {
    writer.writeLong(key);
    writeCustomPoint(writer, world.spawnPoint);
    writeCustomPoint(writer, world.logoutPoint);
    if (player.version >= 30) writeCustomPoint(writer, world.deathPoint);
    writer.writeVector3(world.homePoint);
    if (player.version >= 29) writer.writeIf(writer.writeByteArray, world.mapData);
    yield (current++ / total * 0.8);
  }
  writer.writeString(player.playerName);
  writer.writeLong(player.playerID);
  writer.writeString(player.startSeed);
  if (player.version >= 38) {
    writer.writeBool(player.usedCheats);
    writer.writeLong(BigInt(player.dateCreated.getTime()));
    
    writer.writeMap(writer.writeString, writer.writeFloat, player.knownWorlds);
    writer.writeMap(writer.writeString, writer.writeFloat, player.knownWorldKeys);
    writer.writeMap(writer.writeString, writer.writeFloat, player.knownCommands);
  }
  const playerData = player.playerData && writePlayerData(player.playerData);
  writer.writeIf(writer.writeByteArray, playerData);
  yield 0.9;
}

function readSkills(pkg: PackageReader) {
  const version = pkg.readInt();
  checkVersion('skills', version, SKILLS);
  let size = pkg.readInt();
  const map: SkillData = new Map();
  for (let index = 0; index < size; ++index) {
    const skillType = pkg.readInt();
    const level = pkg.readFloat();
    const accumulator = version >= 2 ? pkg.readFloat() : 0;
    // if (skillType in SkillType) {
    map.set(skillType, { level, accumulator });
    // }
  }
  return map;
}

function writeSkills(pkg: PackageWriter, skillData: SkillData) {
  pkg.writeInt(DATA_VERSION.SKILLS);
  pkg.writeInt(skillData.size);
  for (const [key, { level, accumulator }] of skillData) {
    pkg.writeInt(key);
    pkg.writeFloat(level);
    pkg.writeFloat(accumulator);
  }
}

function readFoods(pkg: PackageReader, version: number): FoodData[] {
  const length = pkg.readInt();
  const result: FoodData[] = [];
  for (let index = 0; index < length; ++index) {
    if (version < 14) {
      // some old unsupported format
      pkg.readString();
      pkg.readFloat();
      pkg.readFloat();
      pkg.readFloat();
      pkg.readFloat();
      pkg.readFloat();
      pkg.readFloat();
      if (version === 13) pkg.readFloat();
      continue;
    }
    const id = pkg.readString();
    let time = 0;
    if (version >= 25) {
      time = pkg.readFloat();
    } else {
      pkg.readFloat(); // health
      if (version >= 16) {
        pkg.readFloat(); // stamina
      }
    }
    const obj = itemDB[id];
    if (obj != null && 'Food' in obj) {
      // error, unknown prefab
    } else {
      result.push({ id, time });
    }
  }
  return result;
}

function readPlayerData(data: Uint8Array): PlayerData {
  const pkg = new PackageReader(data);
  const version = pkg.readInt();
  checkVersion('player data', version, PLAYER_DATA);
  const maxHealth = version >= 7 ? pkg.readFloat() : NaN;
  const health = pkg.readFloat();
  const maxStamina = version >= 10 ? pkg.readFloat() : NaN;
  const firstSpawn = version >= 8 ? pkg.readBool() : false;
  const timeSinceDeath = version >= 20 ? pkg.readFloat() : NaN;
  const guardianPower = version >= 23 ? pkg.readString() : '';
  const guardianPowerCooldown = version >= 24 ? pkg.readFloat() : NaN;
  if (version === 2) {
    pkg.readLong();
    pkg.readInt();
  }
  const inventory = Inventory.read(pkg);
  const knownRecipes = pkg.readArray(pkg.readString);
  const knownStations = version >= 15
    ? pkg.readMap(
        pkg.readString,
        pkg.readInt,
      )
    : new Map(pkg.readArray(pkg.readString).map(key => [key, 1]));
  const knownMaterials = pkg.readArray(pkg.readString);
  const shownTutorials = (version < 19 || version >= 21) ? pkg.readArray(pkg.readString) : [];
  const uniques = version >= 6 ? pkg.readArray(pkg.readString) : [];
  const trophies = version >= 9 ? pkg.readArray(pkg.readString) : [];
  const knownBiome = version >= 18 ? pkg.readArray(pkg.readInt) : [];
  const knownTexts = version >= 22 ? pkg.readMap(pkg.readString, pkg.readString) : new Map();

  const [beardItem, hairItem] = version >= 4
    ? [pkg.readString(), pkg.readString()]
    : ['beard0', 'hair0'];
  const [skinColor, hairColor] = version >= 5
    ? [pkg.readVector3(), pkg.readVector3()]
    : [{ x: 1, y: 1, z: 1 }, { x: 1, y: 1, z: 1 }];
  const modelIndex = version >= 11 ? pkg.readInt() : 0;
  const foods = version >= 12 ? readFoods(pkg, version) : [];
  const skillData = version >= 17 ? readSkills(pkg) : new Map();

  const customData = version >= 26 ? pkg.readMap(pkg.readString, pkg.readString) : new Map();
  const stamina = version >= 26 ? clamp(pkg.readFloat(), 0, maxStamina) : 0;
  const maxEitr = version >= 26 ? pkg.readFloat() : 0;
  const eitr = version >= 26 ? clamp(pkg.readFloat(), 0, maxEitr) : 0;

  return {
    version,
    health,
    maxHealth,
    stamina,
    maxStamina,
    eitr,
    maxEitr,
    firstSpawn,
    timeSinceDeath,
    guardianPower,
    guardianPowerCooldown,
    inventory,
    knownRecipes,
    knownStations,
    knownMaterials,
    shownTutorials,
    uniques,
    trophies,
    knownBiome,
    knownTexts,
    foods,
    beardItem,
    hairItem,
    skinColor,
    hairColor,
    modelIndex,
    skillData,
    customData,
  };
}

function writePlayerData(data: PlayerData): Uint8Array {
  const writer = new PackageWriter();
  writer.writeInt(data.version);
  if (data.version >= 7) writer.writeFloat(data.maxHealth);
  writer.writeFloat(data.health);
  if (data.version >= 10) writer.writeFloat(data.maxStamina);
  if (data.version >= 8) writer.writeBool(data.firstSpawn);
  if (data.version >= 20) writer.writeFloat(data.timeSinceDeath);
  if (data.version >= 23) writer.writeString(data.guardianPower);
  if (data.version >= 24) writer.writeFloat(data.guardianPowerCooldown);
  Inventory.write(writer, data.inventory);
  writer.writeArray(writer.writeString, data.knownRecipes);
  if (data.version >= 15) {
    writer.writeMap(writer.writeString, writer.writeInt, data.knownStations);
  } else {
    writer.writeArray(writer.writeString, [...data.knownStations.keys()]);
  }
  writer.writeArray(writer.writeString, data.knownMaterials);
  if (data.version < 19 || data.version >= 21) {
    writer.writeArray(writer.writeString, data.shownTutorials);
  }
  if (data.version >= 6) writer.writeArray(writer.writeString, data.uniques);
  if (data.version >= 9) writer.writeArray(writer.writeString, data.trophies);
  if (data.version >= 18) writer.writeArray(writer.writeInt, data.knownBiome);
  if (data.version >= 22) writer.writeMap(writer.writeString, writer.writeString, data.knownTexts);

  if (data.version >= 4) {
    writer.writeString(data.beardItem);
    writer.writeString(data.hairItem);
  }
  if (data.version >= 5) {
    writer.writeVector3(data.skinColor);
    writer.writeVector3(data.hairColor);
  }
  if (data.version >= 11) writer.writeInt(data.modelIndex);
  if (data.version >= 12) {
    writer.writeInt(data.foods.length);
    for (const food of data.foods) {
      writer.writeString(food.id);
      writer.writeFloat(food.time);
    }
  }
  if (data.version >= 17) writeSkills(writer, data.skillData!);
  if (data.version >= 26) {
    writer.writeMap(writer.writeString, writer.writeString, data.customData);
    writer.writeFloat(data.stamina);
    writer.writeFloat(data.maxEitr);
    writer.writeFloat(data.eitr);
  }
  return writer.flush();
}

export function* read(bytes: Uint8Array): Generator<number, Player> {
  const reader = new PackageReader(bytes);
  const data = reader.readByteArray();
  const hash = reader.readByteArray();
  const computed = new Uint8Array(sha512.arrayBuffer(data));
  if (computed.some((v, i) => v !== hash[i])) {
    throw new RangeError("Incorrect hash");
  }
  return yield* readPlayer(data);
}

export function* write(
  player: Player,
  sizeHint: number = 10e6, // 10 megabytes
): Generator<number, Uint8Array> {
  const writer = new PackageWriter(sizeHint);
  yield* writePlayer(player, writer);
  const data = writer.flush();
  const pkg = new PackageWriter(data.length + 512 / 8);
  pkg.writeByteArray(data);
  const hash = sha512.arrayBuffer(data);
  pkg.writeByteArray(new Uint8Array(hash));
  return pkg.flush();
}
