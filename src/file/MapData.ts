import { deflate, inflate } from 'pako';
import type { Vector3 } from '../model/utils';
import { PackageReader, PackageWriter } from './Package';

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

type MapPin = {
  name: string;
  pos: Vector3;
  type: PinType;
  crossed: boolean;
  ownerID: bigint;
};

export type Data = {
  version: number;
  tileSize: number;
  // these are packed boolean arrays
  explored: Uint8Array;
  exploredOthers: Uint8Array;
  pins: MapPin[];
  sharePosition: boolean;
};

export function read(data: Uint8Array): Data {
  let reader = new PackageReader(data);
  const version = reader.readInt();
  if (version >= 7) {
    // unpack gzip
    reader = new PackageReader(inflate(reader.readByteArray()));
  }
  const tileSize = reader.readInt();
  const byteSize = tileSize * tileSize / 8;
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

export function write({
  version,
  tileSize,
  explored,
  exploredOthers,
  pins,
  sharePosition,
}: Data): Uint8Array {
  let writer = new PackageWriter();
  writer.writeInt(version);
  writer.writeInt(tileSize);
  const byteSize = tileSize * tileSize / 8;
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
  const bytes = deflate(writer.flush(), { level: 1 });
  gzipped.writeByteArray(bytes);
  return gzipped.flush();
}
