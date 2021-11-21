import type { Vector3 } from '../model/utils';
import { SkillType } from '../model/skills';

import { PackageReader, PackageWriter } from './Package';
import * as Inventory from './Inventory';
import { sha512 } from './sha512';
import { data as itemDB } from '../data/itemDB';

type World = {
  spawnPoint?: Vector3;
  logoutPoint?: Vector3;
  deathPoint?: Vector3;
  homePoint: Vector3;
  mapData?: Uint8Array;
};

enum PinType {
  Icon0,
  Icon1,
  Icon2,
  Icon3,
  Death,
  Bed,
  Icon4,
  Shout,
  None,
  Boss,
  Player,
  RandomEvent,
  Ping,
  EventArea,
};

export type SkillData = Map<SkillType, { level: number, accumulator: number }>;

type FoodData = {
  id: string;
  time: number;
};

export type PlayerData = {
  version: number;
  maxHealth: number;
  health: number;
  maxStamina: number;
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
};

type MapPin = {
  name: string;
  pos: Vector3;
  type: PinType;
  crossed: boolean;
  ownerID: bigint;
}

export type MapData = {
  version: number;
  tileSize: number;
  // these are packed boolean arrays
  explored: Uint8Array;
  exploredOthers: Uint8Array;
  pins: MapPin[];
  sharePosition: boolean;
};

export type Player = {
  version: number;
  stats: {
    kills: number;
    deaths: number;
    crafts: number;
    builds: number;
  };
  worlds: Map<bigint, World>;
  playerName: string;
  playerID: bigint;
  startSeed: string;
  playerData?: PlayerData;
};

export function readMapData(buffer: ArrayBuffer): MapData {
  let reader = new PackageReader(buffer);
  const version = reader.readInt();
  if (version >= 7) {
    // unpack gzip
    reader = new PackageReader(reader.readGzipped().buffer);
  }
  const tileSize = reader.readInt();
  const byteSize = tileSize ** 2 / 8;
  const explored = new Uint8Array(byteSize);
  for (let index = 0; index < byteSize; ++index) {
    let byte = 0;
    for (let bit = 0; bit < 8; ++bit) byte |= reader.readByte() << bit;
    explored[index] = byte;
  }
  const exploredOthers = new Uint8Array(byteSize);
  if (version >= 5) {
    for (let index = 0; index < byteSize; ++index) {
      let byte = 0;
      for (let bit = 0; bit < 8; ++bit) byte |= reader.readByte() << bit;
      exploredOthers[index] = byte;
    }
  }
  const pins: MapPin[] = [];
  if (version >= 2) {
    const pinsNumber = reader.readInt();
    for (let index = 0; index < pinsNumber; ++index) {
      const name = reader.readString();
      const pos = reader.readVector3();
      const type = reader.readInt();
      const crossed = version >= 3 && reader.readBool();
      const ownerID = version >= 6 ? reader.readLong() : BigInt(0);
      pins.push({
        name,
        crossed,
        ownerID,
        pos,
        type,
      });
    }
  }
  const sharePosition = version >= 4 && reader.readBool();
  return {
    version,
    tileSize,
    explored,
    exploredOthers,
    pins,
    sharePosition,
  }
}

export function writeMapData({
  version,
  tileSize,
  explored,
  exploredOthers,
  pins,
  sharePosition,
}: MapData): Uint8Array {
  let writer = new PackageWriter();
  writer.writeInt(version);
  writer.writeInt(tileSize);
  const byteSize = tileSize ** 2 / 8;
  for (let index = 0; index < byteSize; ++index) {
    for (let bit = 0; bit < 8; ++bit) {
      writer.writeByte((explored[index]! >> bit) & 1);
    }
  }
  if (version >= 5) {
    for (let index = 0; index < byteSize; ++index) {
      for (let bit = 0; bit < 8; ++bit) {
        writer.writeByte((exploredOthers[index]! >> bit) & 1);
      }
    }
  }
  if (version >= 2) {
    writer.writeInt(pins.length);
    for (const { name, pos, type, crossed, ownerID } of pins) {
      writer.writeString(name);
      writer.writeVector3(pos);
      writer.writeInt(type);
      if (version >= 3) writer.writeBool(crossed);
      if (version >= 6) writer.writeLong(ownerID);
    }
  }
  if (version >= 4) writer.writeBool(sharePosition);
  if (version < 7) {
    return writer.flush();
  }
  const gzipped = new PackageWriter();
  gzipped.writeInt(version);
  gzipped.writeGzipped(writer.flush());
  return gzipped.flush();
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

export function readPlayer(buffer: ArrayBuffer): Player {
  const reader = new PackageReader(buffer);
  const version = reader.readInt();
  const kills = version >= 28 ? reader.readInt() : 0;
  const deaths = version >= 28 ? reader.readInt() : 0;
  const crafts = version >= 28 ? reader.readInt() : 0;
  const builds = version >= 28 ? reader.readInt() : 0;
  const stats = { kills, deaths, crafts, builds };
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
  }
  const playerName = reader.readString();
  const playerID = reader.readLong();
  const startSeed = reader.readString();
  const playerData = reader.readIf(reader.readByteArray);
  return {
    version,
    stats,
    worlds,
    playerName,
    playerID,
    startSeed,
    playerData: playerData && readPlayerData(playerData),
  };
}

function writePlayer(player: Player): Uint8Array {
  const writer = new PackageWriter();
  writer.writeInt(player.version);
  if (player.version >= 28) {
    writer.writeInt(player.stats.kills);
    writer.writeInt(player.stats.deaths);
    writer.writeInt(player.stats.crafts);
    writer.writeInt(player.stats.builds);
  }
  writer.writeInt(player.worlds.size);
  for (const [key, world] of player.worlds) {
    writer.writeLong(key);
    writeCustomPoint(writer, world.spawnPoint);
    writeCustomPoint(writer, world.logoutPoint);
    if (player.version >= 30) writeCustomPoint(writer, world.deathPoint);
    writer.writeVector3(world.homePoint);
    if (player.version >= 29) writer.writeIf(writer.writeByteArray, world.mapData);
  }
  writer.writeString(player.playerName);
  writer.writeLong(player.playerID);
  writer.writeString(player.startSeed);
  const playerData = player.playerData && writePlayerData(player.playerData);
  writer.writeIf(writer.writeByteArray, playerData);
  return writer.flush();
}

function readSkills(pkg: PackageReader) {
  const version = pkg.readInt();
  let size = pkg.readInt();
  const map: SkillData = new Map();
  for (let index = 0; index < size; ++index) {
    const skillType = pkg.readInt();
    const level = pkg.readFloat();
    const accumulator = version >= 2 ? pkg.readFloat() : 0;
    if (skillType in SkillType) {
      map.set(skillType, { level, accumulator });
    }
  }
  return map;
}

function writeSkills(pkg: PackageWriter, skillData: SkillData) {
  pkg.writeInt(2);
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
      const health = pkg.readFloat();
      if (version >= 16) {
        const stamina = pkg.readFloat();
      }
    }
    if (itemDB[id]?.type !== 'food') {
      // error, unknown prefab
    } else {
      result.push({ id, time });
    }
  }
  return result;
}

function readPlayerData(data: Uint8Array): PlayerData {
  const pkg = new PackageReader(data.buffer);
  const version = pkg.readInt();
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
  const knownTexts = pkg.readMap(pkg.readString, pkg.readString);

  const beardItem = version >= 4 ? pkg.readString() : 'beard0';
  const hairItem = version >= 4 ? pkg.readString() : 'hair0';
  const skinColor = version >= 5 ? pkg.readVector3() : { x: 1, y: 1, z: 1 };
  const hairColor = version >= 5 ? pkg.readVector3() : { x: 1, y: 1, z: 1 };
  const modelIndex = version >= 11 ? pkg.readInt() : 0;
  const foods = version >= 12 ? readFoods(pkg, version) : [];
  const skillData = version >= 17 ? readSkills(pkg) : undefined;
  return {
    version,
    maxHealth,
    health,
    maxStamina,
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
  };
}

function writePlayerData(data: PlayerData) {
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
  return writer.flush();
}

export function read(buffer: ArrayBuffer) {
  const reader = new PackageReader(buffer);
  const data = reader.readByteArray();
  const hash = reader.readByteArray();
  const computed = new Uint8Array(sha512.arrayBuffer(data.buffer));
  if (computed.some((v, i) => v !== hash[i])) {
    throw new RangeError("Incorrect hash");
  }
  return readPlayer(data.buffer);
}

export function write(player: Player) {
  const data = writePlayer(player);
  const writer = new PackageWriter();
  writer.writeByteArray(data);
  const hash = sha512.arrayBuffer(data.buffer);
  writer.writeByteArray(new Uint8Array(hash));
  return writer.flush();
}
