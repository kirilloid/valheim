import { Quaternion, stableHashCode, Vector2i, Vector3 } from '../model/utils';
import { PackageReader, PackageWriter } from './Package';
import { events } from '../data/events';

type ZDOID = {
  userId: bigint; // long
  id: number; // uint
}

enum ZDOObjectType {
  Default,
  Prioritized,
  Solid,
  Terrain,
};

export type ZDO = {
  id: ZDOID;
  ownerRevision: number;
  dataRevision: number;
  persistent: boolean;
  owner: bigint;
  // ms timestamp?
  timeCreated: bigint;
  pgwVersion: number;
  type: ZDOObjectType;
  distant: boolean;
  prefab: number;
  sector: Vector2i;
  position: Vector3;
  rotation: Quaternion;
  floats?: Map<number, number>; // int -> float
  vec3?: Map<number, Vector3>; // int -> Vector3
  quats?: Map<number, Quaternion>; // int -> Quaternion
  ints?: Map<number, number>; // int -> int
  longs?: Map<number, bigint>; // int -> long
  strings?: Map<number, string>; // int -> string
  byteArrays?: Map<number, Uint8Array>; // int -> byte[]
}

export type ZDOData = {
  myid: bigint; // long
  nextUid: number; // uint
  zdos: ZDO[];
  deadZdos: Map<ZDOID, bigint>;
};

export type ZoneSystemData = {
  generatedZones: Vector2i[];
  pgwVersion: number;
  globalKeys: string[];
  locationsGenerated: boolean;
  locationVersion: number;
  locationInstances: {
    name: string;
    pos: Vector3;
    generated: boolean;
  }[];
};

export type RandEventData = {
  eventTimer: number;
  name?: string;
  time?: number;
  pos?: Vector3;
};

export type WorldData = {
  version: number;
  // time since t=0 in seconds
  netTime: number;
  zdo: ZDOData;
  zoneSystem?: ZoneSystemData;
  randEvent?: RandEventData;
}

function readZdo(buffer: ArrayBuffer, version: number): Omit<ZDO, 'id'> {
  const pkg = new PackageReader(buffer);
  const ownerRevision = pkg.readUInt();
  const dataRevision = pkg.readUInt();
  const persistent = pkg.readBool();
  const owner = pkg.readLong();
  const timeCreated = pkg.readLong();
  const pgwVersion = pkg.readInt();
  if (version >= 16 && version < 24)
    pkg.readInt();
  const type = version >= 23 ? pkg.readByte() : 0;
  const distant = version >= 22 ? pkg.readBool() : false;
  let prefab = version >= 17 ? pkg.readInt() : 0;
  const sector = pkg.readVector2i();
  const position = pkg.readVector3();
  const rotation = pkg.readQuaternion();

  const floats = pkg.readIfSmallMap(pkg.readInt, pkg.readFloat);
  const vec3 = pkg.readIfSmallMap(pkg.readInt, pkg.readVector3);
  const quats = pkg.readIfSmallMap(pkg.readInt, pkg.readQuaternion);
  const ints = pkg.readIfSmallMap(pkg.readInt, pkg.readInt);
  const longs = pkg.readIfSmallMap(pkg.readInt, pkg.readLong);
  const strings = pkg.readIfSmallMap(pkg.readInt, pkg.readString);
  const byteArrays = version >= 27 ? pkg.readIfSmallMap(pkg.readInt, pkg.readByteArray) : undefined;
  if (version < 17) {
    prefab = ints?.get(stableHashCode('prefab')) ?? 0;
  }
  return {
    ownerRevision,
    dataRevision,
    persistent,
    owner,
    timeCreated,
    pgwVersion,
    type,
    distant,
    prefab,
    sector,
    position,
    rotation,
    floats,
    vec3,
    quats,
    ints,
    longs,
    strings,
    byteArrays,
  };
}

function writeZdo(zdo: ZDO): Uint8Array {
  const pkg = new PackageWriter();
  pkg.writeUInt(zdo.ownerRevision);
  pkg.writeUInt(zdo.dataRevision);
  pkg.writeBool(zdo.persistent);
  pkg.writeLong(zdo.owner);
  pkg.writeLong(zdo.timeCreated);
  pkg.writeInt(zdo.pgwVersion);
  pkg.writeByte(zdo.type);
  pkg.writeBool(zdo.distant);
  pkg.writeInt(zdo.prefab);
  pkg.writeInt(zdo.sector.x);
  pkg.writeInt(zdo.sector.y);
  pkg.writeVector3(zdo.position);
  pkg.writeQuaternion(zdo.rotation);
  pkg.writeIfSmallMap(pkg.writeInt, pkg.writeFloat, zdo.floats);
  pkg.writeIfSmallMap(pkg.writeInt, pkg.writeVector3, zdo.vec3);
  pkg.writeIfSmallMap(pkg.writeInt, pkg.writeQuaternion, zdo.quats);
  pkg.writeIfSmallMap(pkg.writeInt, pkg.writeInt, zdo.ints);
  pkg.writeIfSmallMap(pkg.writeInt, pkg.writeLong, zdo.longs);
  pkg.writeIfSmallMap(pkg.writeInt, pkg.writeString, zdo.strings);
  pkg.writeIfSmallMap(pkg.writeInt, pkg.writeByteArray, zdo.byteArrays);
  return pkg.flush();
}

function readZDOData(reader: PackageReader, version: number): ZDOData {
  const myid = reader.readLong();
  const nextUid = reader.readUInt();
  const zdos: ZDO[] = [];
  const zdoLength = reader.readInt();
  for (let i = 0; i < zdoLength; i++) {
    const id = {
      userId: reader.readLong(),
      id: reader.readUInt(),
    };
    // FIXME do not copy, read into
    const zdo = readZdo(reader.readByteArray().buffer, version);
    zdos.push({ id, ...zdo });
  }
  const deadZdos = reader.readMap(function () {
    const userId = this.readLong();
    const id = this.readUInt();
    return { userId, id };
  }, reader.readLong);
  return {
    myid,
    nextUid,
    zdos,
    deadZdos,
  };
}

function writeZDOData(writer: PackageWriter, zdoData: ZDOData): void {
  writer.writeLong(zdoData.myid);
  writer.writeUInt(zdoData.nextUid);
  writer.writeInt(zdoData.zdos.length);
  for (const zdo of zdoData.zdos) {
    writer.writeLong(zdo.id.userId);
    writer.writeUInt(zdo.id.id);
    writer.writeByteArray(writeZdo(zdo));
  }
  writer.writeMap(function (key: ZDOID) {
    this.writeLong(key.userId);
    this.writeUInt(key.id);
  }, writer.writeLong, zdoData.deadZdos);
}

function readZoneSystem(reader: PackageReader, version: number): ZoneSystemData {
  const result: ZoneSystemData = {
    generatedZones: reader.readArray(reader.readVector2i),
    pgwVersion: 0,
    globalKeys: [],
    locationsGenerated: false,
    locationVersion: 0,
    locationInstances: [],
  };
  if (version < 13) return result;
  result.pgwVersion = reader.readInt();
  if (version >= 21) result.locationVersion = reader.readInt();
  if (version >= 14) result.globalKeys = reader.readArray(reader.readString);
  if (version < 18) return result;
  if (version >= 20) result.locationsGenerated = reader.readBool();
  result.locationInstances = reader.readArray(function () {
    const name = this.readString();
    const pos = this.readVector3();
    const generated = version >= 19 ? reader.readBool() : false;
    return { name, pos, generated };
  });
  return result;
}

function writeZoneSystem(writer: PackageWriter, version: number, zoneSystem: ZoneSystemData): void {
  writer.writeArray(writer.writeVector2i, zoneSystem.generatedZones);
  if (version < 13) return;
  writer.writeInt(zoneSystem.pgwVersion);
  if (version >= 21) writer.writeInt(zoneSystem.locationVersion);
  if (version >= 14) writer.writeArray(writer.writeString, zoneSystem.globalKeys);
  if (version < 18) return;
  if (version >= 20) writer.writeBool(zoneSystem.locationsGenerated);
  writer.writeArray(function (loc) {
    this.writeString(loc.name);
    this.writeVector3(loc.pos);
    this.writeBool(loc.generated);
  }, zoneSystem.locationInstances!);
}

function readRandEvent(reader: PackageReader, version: number): RandEventData {
  const result = {
    eventTimer: reader.readFloat(),
  };
  if (version < 25) return result;
  const name = reader.readString();
  const time = reader.readFloat();
  const pos = reader.readVector3();
  const event = events.find(e => e.id === name);
  // do we need that check?
  if (event == null) return result;
  return {
    ...result,
    name,
    time,
    pos,
  }
}

function writeRandEvent(writer: PackageWriter, version: number, event: RandEventData): void {
  writer.writeFloat(event.eventTimer);
  if (version < 25) return;
  writer.writeString(event.name!);
  writer.writeFloat(event.time!);
  writer.writeVector3(event.pos!);
}

export function read(buffer: ArrayBuffer): WorldData {
  let reader = new PackageReader(buffer);
  const version = reader.readInt();
  const netTime = version >= 4 ? reader.readDouble() : NaN;
  const zdo = readZDOData(reader, version);
  const zoneSystem = version >= 12 ? readZoneSystem(reader, version) : undefined;
  const randEvent = version >= 15 ? readRandEvent(reader, version) : undefined;
  return {
    version,
    netTime,
    zdo,
    zoneSystem,
    randEvent,
  };
}

export function write({
  version,
  netTime,
  zdo,
  zoneSystem,
  randEvent,
}: WorldData): Uint8Array {
  let writer = new PackageWriter();
  writer.writeInt(version);
  if (version >= 4) writer.writeDouble(netTime);
  writeZDOData(writer, zdo);
  if (version >= 12) writeZoneSystem(writer, version, zoneSystem!);
  if (version >= 15) writeRandEvent(writer, version, randEvent!);
  return writer.flush();
}
