import { gzip, decompress, inflate } from '../model/fflate';
import type { Vector3 } from '../model/utils';
import { PackageReader, PackageWriter } from './Package';
import { checkVersion, MAP, SHARED_MAP } from './versions';

export const TILE_SIZE = 2048;

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
  Hildir1,
  Hildir2,
  Hildir3,
};

type MapPin = {
  name: string;
  pos: Vector3;
  type: PinType;
  crossed: boolean;
  ownerID: bigint;
  author: string;
};

export type Data = {
  version: number;
  tileSize: number;
  // these are packed boolean arrays
  explored: Uint8Array<ArrayBuffer>;
  exploredOthers: Uint8Array<ArrayBuffer>;
  pins: MapPin[];
  sharePosition: boolean;
};

export type SharedData = {
  version: number;
  explored: Uint8Array<ArrayBuffer>;
  pins: MapPin[];
};

function readExplored(reader: PackageReader, tileSize: number): Uint8Array<ArrayBuffer> {
  const byteSize = tileSize * tileSize / 8;
  const explored = new Uint8Array(byteSize);
  for (let index = 0; index < byteSize; ++index) {
    let byte = 0;
    for (let bit = 0; bit < 8; ++bit) byte |= reader.readByte() << bit;
    explored[index] = byte;
  }
  return explored;
}

function writeExplored(writer: PackageWriter, tileSize: number, explored: Uint8Array<ArrayBuffer>): void {
  const byteSize = tileSize * tileSize / 8;
  for (let index = 0; index < byteSize; ++index) {
    for (let bit = 0; bit < 8; ++bit) {
      writer.writeByte((explored[index]! >> bit) & 1);
    }
  }
}

export async function readShared(data: Uint8Array): Promise<SharedData> {
  const compressedReader = new PackageReader(data);
  const reader = new PackageReader(await inflate(compressedReader.readByteArray()));
  const version = reader.readInt();
  checkVersion('shared map data', version, SHARED_MAP);
  const explored = readExplored(reader, TILE_SIZE);
  const pins: MapPin[] = [];
  const pinsNumber = reader.readInt();
  for (let index = 0; index < pinsNumber; ++index) {
    const ownerID = reader.readLong();
    const name = reader.readString();
    const pos = reader.readVector3();
    const type: PinType = reader.readInt();
    const crossed = reader.readBool();
    const author = version >= 3 ? reader.readString() : "";
    pins.push({ name, pos, type, crossed, ownerID, author });
  }
  return { version, explored, pins };
}

export async function read(data: Uint8Array<ArrayBuffer>): Promise<Data> {
  let reader = new PackageReader(data);
  const version = reader.readInt();
  checkVersion('map data', version, MAP);
  if (version >= 7) {
    // unpack gzip
    const unpacked = await decompress(reader.readByteArray());
    reader = new PackageReader(unpacked);
  }
  const tileSize = reader.readInt();
  const explored = readExplored(reader, tileSize);
  const exploredOthers = version >= 5
    ? readExplored(reader, tileSize)
    : new Uint8Array(tileSize * tileSize / 8);
  const pins: MapPin[] = [];
  if (version >= 2) {
    const pinsNumber = reader.readInt();
    for (let index = 0; index < pinsNumber; ++index) {
      const name = reader.readString();
      const pos = reader.readVector3();
      const type: PinType = reader.readInt();
      const crossed = version >= 3 && reader.readBool();
      const ownerID = version >= 6 ? reader.readLong() : BigInt(0);
      const author = version >= 8 ? reader.readString() : "";
      pins.push({ name, crossed, ownerID, pos, type, author });
    }
  }
  const sharePosition = version >= 4 && reader.readBool();
  return { version, tileSize, explored, exploredOthers, pins, sharePosition };
}

export async function write({
  version,
  tileSize,
  explored,
  exploredOthers,
  pins,
  sharePosition,
}: Data): Promise<Uint8Array<ArrayBuffer>> {
  let writer = new PackageWriter();
  writer.writeInt(version);
  writer.writeInt(tileSize);
  writeExplored(writer, tileSize, explored);
  if (version >= 5) {
    writeExplored(writer, tileSize, exploredOthers);
  }
  if (version >= 2) {
    writer.writeInt(pins.length);
    for (const { name, pos, type, crossed, ownerID, author } of pins) {
      writer.writeString(name);
      writer.writeVector3(pos);
      writer.writeInt(type);
      if (version >= 3) writer.writeBool(crossed);
      if (version >= 6) writer.writeLong(ownerID);
      if (version >= 8) writer.writeString(author);
    }
  }
  if (version >= 4) writer.writeBool(sharePosition);
  if (version < 7) {
    return writer.flush();
  }
  const gzipped = new PackageWriter();
  gzipped.writeInt(version);
  const bytes = await gzip(writer.flush(), { level: 1 });
  gzipped.writeByteArray(bytes);
  return gzipped.flush();
}
