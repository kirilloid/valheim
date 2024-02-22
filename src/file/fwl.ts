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
  startingGlobalKeys: string[];
};

export function read(data: Uint8Array): Data {
  const zpkg = new PackageReader(data);
  const bytes = zpkg.readByteArray();
  const reader = new PackageReader(bytes);
  const version = reader.readInt();
  checkVersion(version, WORLD);
  const name = reader.readString();
  const seedName = reader.readString();
  const seed = reader.readInt();
  const uid = reader.readLong();
  const worldGenVersion = version >= 26 ? reader.readInt() : 0;
  const needsDB = version >= 30 ? reader.readBool() : false;
  const startingGlobalKeys = version >= 32 ? reader.readArray(reader.readString) : [];
  return {
    version,
    name,
    seedName,
    seed,
    uid,
    worldGenVersion,
    needsDB,
    startingGlobalKeys,
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
    writer.writeArray(writer.writeString, data.startingGlobalKeys);
  }
  const bytes = writer.flush();
  const zpkg = new PackageWriter();
  zpkg.writeByteArray(bytes);
  return zpkg.flush();
}
