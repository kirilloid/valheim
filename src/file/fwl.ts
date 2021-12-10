import { PackageReader, PackageWriter } from './Package';

export type Data = {
  version: number;
  name: string;
  seedName: string;
  seed: number;
  uid: bigint;
  worldGenVersion: number;
};

export function read(data: Uint8Array): Data {
  const zpkg = new PackageReader(data);
  const bytes = zpkg.readByteArray();
  const reader = new PackageReader(bytes);
  const version = reader.readInt();
  const name = reader.readString();
  const seedName = reader.readString();
  const seed = reader.readInt();
  const uid = reader.readLong();
  const worldGenVersion = version >= 26 ? reader.readInt() : 0;
  return {
    version,
    name,
    seedName,
    seed,
    uid,
    worldGenVersion,
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
  const bytes = writer.flush();
  const zpkg = new PackageWriter();
  zpkg.writeByteArray(bytes);
  return zpkg.flush();
}
