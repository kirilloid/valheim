import type { ZDO, ZDOID, ZDOCorruption } from './types';
import type { Vector2i, Vector3 } from '../model/utils';
import { PackageReader, PackageWriter } from './Package';
import { readZdo } from './zdo/mmap';
import { setVersion } from './zdo/offset';
import { errorToMistake } from './zdo/check';

export type ZDOData = {
  myid: bigint; // long
  nextUid: number; // uint
  zdos: ZDO[];
  deadZdos: Map<ZDOID, bigint>;
  corruptions: ZDOCorruption[];
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

function readZDOData(reader: PackageReader, version: number): ZDOData {
  const myid = reader.readLong();
  const nextUid = reader.readUInt();
  const zdos: ZDO[] = [];
  const zdoLength = reader.readInt();
  const corruptions = [];
  setVersion(version);
  for (let i = 0; i < zdoLength; i++) {
    const offset = reader.getOffset();
    try {
      const zdo = readZdo(reader, version);
      zdos.push(zdo);
    } catch (e) {
      const mistake = errorToMistake(e);
      
      corruptions.push({ offset, mistake });
    }
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
    corruptions,
  };
}

function writeZDOData(writer: PackageWriter, zdoData: ZDOData): void {
  writer.writeLong(zdoData.myid);
  writer.writeUInt(zdoData.nextUid);
  writer.writeInt(zdoData.zdos.length);
  for (const zdo of zdoData.zdos) {
    zdo.save(writer);
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
    if (version >= 19) this.writeBool(loc.generated);
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

export function read(bytes: Uint8Array): WorldData {
  let reader = new PackageReader(bytes);
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
