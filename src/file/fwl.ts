import type { GameSettings } from '../types/GameSettings';
import { gameSettings } from '../data/game-settings';

import { PackageReader, PackageWriter } from './Package';
import { checkVersion, WORLD } from './versions';

export type Data = {
  version: number;
  name: string;
  seedName: string;
  seed: number;
  uid: bigint;
  worldGenVersion: number;
  needsDB: boolean;
  keys: Partial<GameSettings>;
};

function readKeys(reader: PackageReader): Partial<GameSettings> {
  const result = {};
  const keys = reader.readArray(reader.readString);
  for (const item of keys) {
    const [key, val] = item.split(' ', 2);
    if (key == null) continue;
    if (key in gameSettings) {
      const defaultValue = Reflect.get(gameSettings, key);
      switch (typeof defaultValue) {
        case 'number':
          const value = Number(val);
          if (Number.isFinite(value) && value >= 0) {
            Reflect.set(result, key, value);
          }
          break;
        case 'boolean':
          Reflect.set(result, key, true);
          break;
        case 'string':
          if (val !== undefined) {
            Reflect.set(result, key, val);
          }
          break;
        default:
          console.warn("Unknown key: ", item);
      }
    }
  }
  return result;
}

function writeKeys(writer: PackageWriter, keys: Partial<GameSettings>) {
  const strKeys = Object
    .entries(keys)
    .map(([k, v]) => v === true ? k : `${k} ${v}`);
  writer.writeArray(writer.writeString, strKeys);
}

export function read(data: Uint8Array): Data {
  const zpkg = new PackageReader(data);
  const bytes = zpkg.readByteArray();
  const reader = new PackageReader(bytes);
  const version = reader.readInt();
  checkVersion('fwl', version, WORLD);
  const name = reader.readString();
  const seedName = reader.readString();
  const seed = reader.readInt();
  const uid = reader.readLong();
  const worldGenVersion = version >= 26 ? reader.readInt() : 0;
  const needsDB = version >= 30 ? reader.readBool() : false;
  const keys = version >= 32 ? readKeys(reader) : {};
  return {
    version,
    name,
    seedName,
    seed,
    uid,
    worldGenVersion,
    needsDB,
    keys,
  };
}

export function write(data: Data): Uint8Array {
  const writer = new PackageWriter();
  writer.writeInt(data.version);
  writer.writeString(data.name);
  writer.writeString(data.seedName);
  writer.writeInt(data.seed);
  writer.writeLong(data.uid);
  if (data.version >= 26) {
    writer.writeInt(data.worldGenVersion);
  }
  if (data.version >= 30) {
    writer.writeBool(data.needsDB);
  }
  if (data.version >= 32) {
    writeKeys(writer, data.keys);
  }
  const bytes = writer.flush();
  const zpkg = new PackageWriter();
  zpkg.writeByteArray(bytes);
  return zpkg.flush();
}
