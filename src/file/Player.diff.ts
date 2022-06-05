import type { Vector3 } from '../model/utils';

import { PackageReader, PackageWriter } from './Package';
import * as Inventory from './Inventory';
import { SkillData, PlayerData, PlayerStats, readStats, ZERO_STATS, writeStats, FoodData, readFoods } from './Player';
import { SkillType } from '../model/skills';

export type WorldDiff = {
  spawnPoint?: Vector3 | null;
  logoutPoint?: Vector3 | null;
  deathPoint?: Vector3 | null;
  homePoint?: Vector3;
  mapData?: Uint8Array | null;
};

export type PlayerDataDiff = {
  version: number;
  maxHealth: number;
  health: number;
  maxStamina: number;
  firstSpawn: boolean;
  timeSinceDeath?: number;
  guardianPower?: string;
  guardianPowerCooldown?: number;
  inventory: Inventory.Data;
  knownRecipes: string[] & { cleared?: boolean };
  knownStations: Map<string, number | null>;
  knownMaterials: string[] & { cleared?: boolean };
  shownTutorials: string[] & { cleared?: boolean };
  uniques: string[] & { cleared?: boolean };
  trophies: string[] & { cleared?: boolean };
  knownBiome: number[] & { cleared?: boolean };
  knownTexts: Map<string, string | null>;
  
  beardItem?: string;
  hairItem?: string;
  skinColor?: Vector3;
  hairColor?: Vector3;
  modelIndex?: number;
  foods: FoodData[];
  skillData: Map<SkillType, SkillData | null>;
};

export type PlayerDiff = {
  version: number;
  stats?: PlayerStats;
  worlds?: Map<bigint, WorldDiff | null>;
  playerName?: string;
  playerID?: bigint;
  startSeed?: string;
  playerData?: PlayerDataDiff | null;
}

function readPlayer(bytes: Uint8Array): PlayerDiff {
  const reader = new PackageReader(bytes);
  const version = reader.readInt();
  const stats = version >= 28
    ? reader.readBool()
      ? readStats(reader)
      : undefined
    : ZERO_STATS;
  const worlds = reader.readMapDiff<bigint, WorldDiff>(reader.readLong, function() {
    const spawnPoint = reader.readIfDiff(reader.readVector3);
    const logoutPoint = reader.readIfDiff(reader.readVector3);
    const deathPoint = version >= 30 ? reader.readIfDiff(reader.readVector3) : undefined;
    const homePoint = reader.readIf(reader.readVector3);
    const mapData = version >= 29 ? reader.readIfDiff(reader.readByteArray) : undefined;
    return {
      spawnPoint,
      logoutPoint,
      deathPoint,
      homePoint,
      mapData,
    };
  });
  const playerName = reader.readIf(reader.readString);
  const playerID = reader.readIf(reader.readLong);
  const startSeed = reader.readIf(reader.readString);
  const playerData = reader.readIfDiff(() => readPlayerData(reader));

  return {
    version,
    stats,
    worlds,
    playerName,
    playerID,
    startSeed,
    playerData,
  };
}

function writePlayer(
  player: PlayerDiff,
  writer: PackageWriter,
) {
  writer.writeInt(player.version);
  if (player.version >= 28) {
    writer.writeIf(stats => writeStats(writer, stats), player.stats);
  }
  writer.writeIf(worlds => writer.writeMapDiff(writer.writeLong, function (world) {
    writer.writeIfDiff(writer.writeVector3, world.spawnPoint);
    writer.writeIfDiff(writer.writeVector3, world.logoutPoint);
    if (player.version >= 30) writer.writeIfDiff(writer.writeVector3, world.deathPoint);
    writer.writeIf(writer.writeVector3, world.homePoint);
    if (player.version >= 29) writer.writeIfDiff(writer.writeByteArray, world.mapData);
  }, worlds), player.worlds);
  writer.writeIf(writer.writeString, player.playerName);
  writer.writeIf(writer.writeLong, player.playerID);
  writer.writeIf(writer.writeString, player.startSeed);
  const playerData = player.playerData && writePlayerData(player.playerData);
  writer.writeIfDiff(writer.writeByteArray, playerData);
}

function readSkills(pkg: PackageReader) {
  const version = pkg.readInt();
  return pkg.readMap(
    pkg.readInt,
    function () {
      const level = pkg.readFloat();
      const accumulator = version >= 2 ? pkg.readFloat() : 0;
      return { level, accumulator };
    }
  );
}

function writeSkills(pkg: PackageWriter, skillData: Map<SkillType, SkillData | null> | null | undefined) {
  pkg.writeIfDiff(function (value) {
    this.writeInt(2);
    this.writeMapDiff(pkg.writeInt, function ({ level, accumulator }) {
      pkg.writeFloat(level);
      pkg.writeFloat(accumulator);  
    }, value);
  }, skillData);
}

const EMPTY_ARRAY_DIFF: any[] & { cleared: boolean } = Object.assign([], { cleared: false });

function readPlayerData(reader: PackageReader): PlayerDataDiff {
  const data = reader.readByteArray();
  const pkg = new PackageReader(data);
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
  const knownRecipes = pkg.readArrayDiff(pkg.readString);
  const knownStations = pkg.readMapDiff(
    pkg.readString,
    pkg.readInt,
  );
  const knownMaterials = pkg.readArrayDiff(pkg.readString);
  const shownTutorials = (version < 19 || version >= 21) ? pkg.readArrayDiff(pkg.readString) : EMPTY_ARRAY_DIFF;
  const uniques = version >= 6 ? pkg.readArrayDiff(pkg.readString) : EMPTY_ARRAY_DIFF;
  const trophies = version >= 9 ? pkg.readArrayDiff(pkg.readString) : EMPTY_ARRAY_DIFF;
  const knownBiome = version >= 18 ? pkg.readArrayDiff(pkg.readInt) : EMPTY_ARRAY_DIFF;
  const knownTexts = pkg.readMap(pkg.readString, pkg.readString);

  const beardItem = version >= 4 ? pkg.readString() : 'beard0';
  const hairItem = version >= 4 ? pkg.readString() : 'hair0';
  const skinColor = version >= 5 ? pkg.readVector3() : { x: 1, y: 1, z: 1 };
  const hairColor = version >= 5 ? pkg.readVector3() : { x: 0, y: 0, z: 0 };
  const modelIndex = version >= 11 ? pkg.readInt() : 0;
  const foods = version >= 12 ? readFoods(pkg, version) : [];
  const skillData = version >= 17 ? readSkills(pkg) : new Map();
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

function writePlayerData(data: PlayerDataDiff): Uint8Array {
  const writer = new PackageWriter();
  writer.writeInt(data.version);
  if (data.version >= 7) writer.writeFloat(data.maxHealth);
  writer.writeFloat(data.health);
  if (data.version >= 10) writer.writeIf(writer.writeFloat, data.maxStamina);
  if (data.version >= 8) writer.writeBool(data.firstSpawn);
  if (data.version >= 20) writer.writeIf(writer.writeFloat, data.timeSinceDeath);
  if (data.version >= 23) writer.writeIf(writer.writeString, data.guardianPower);
  if (data.version >= 24) writer.writeIf(writer.writeFloat, data.guardianPowerCooldown);
  Inventory.write(writer, data.inventory);
  writer.writeArrayDiff(writer.writeString, data.knownRecipes);
  writer.writeMapDiff(writer.writeString, writer.writeInt, data.knownStations);
  writer.writeArrayDiff(writer.writeString, data.knownMaterials);
  if (data.version < 19 || data.version >= 21) {
    writer.writeArrayDiff(writer.writeString, data.shownTutorials);
  }
  if (data.version >= 6) writer.writeArrayDiff(writer.writeString, data.uniques);
  if (data.version >= 9) writer.writeArrayDiff(writer.writeString, data.trophies);
  if (data.version >= 18) writer.writeArrayDiff(writer.writeInt, data.knownBiome);
  if (data.version >= 22) writer.writeMapDiff(writer.writeString, writer.writeString, data.knownTexts);
  if (data.version >= 4) {
    writer.writeIf(writer.writeString, data.beardItem);
    writer.writeIf(writer.writeString, data.hairItem);
  }
  if (data.version >= 5) {
    writer.writeIf(writer.writeVector3, data.skinColor);
    writer.writeIf(writer.writeVector3, data.hairColor);
  }
  if (data.version >= 11) writer.writeIf(writer.writeInt, data.modelIndex);

  if (data.version >= 12) {
    writer.writeInt(data.foods.length);
    for (const food of data.foods) {
      writer.writeString(food.id);
      writer.writeFloat(food.time);
    }
  }
  if (data.version >= 17) writeSkills(writer, data.skillData);
  return writer.flush();
}

export function read(bytes: Uint8Array): PlayerDiff {
  return readPlayer(bytes);
}

export function write(
  player: PlayerDiff,
  sizeHint: number = 1e6,
): Uint8Array {
  const writer = new PackageWriter(sizeHint);
  writePlayer(player, writer);
  return writer.flush();
}
