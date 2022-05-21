import type { ZDO, ZDOCorruption, ZDOData, ZDOID } from './types';

import type { Vector2i, Vector3 } from '../model/utils';
import { PackageReader, PackageWriter } from './Package';
import { readZdoMmap as readZdo, setVersion, errorToMistake } from './zdo';

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

function* readZDOData(reader: PackageReader, version: number): Generator<number, ZDOData> {
  const myid = reader.readLong();
  const nextUid = reader.readUInt();
  const zdos: ZDO[] = [];
  const zdoLength = reader.readInt();
  const corruptions: ZDOCorruption[] = [];
  setVersion(version);
  let totalCorruptedBytes = 0;
  const removedPrefabs = new Map<number, number>();
  for (let i = 0; i < zdoLength; i++) {
    const offset = reader.getOffset();
    if (reader.getProgress() === 1) break;
    if ((i & 0x7FFF) === 0) {
      yield reader.getProgress();
    }
    try {
      const zdo = readZdo(reader, version);
      // if (zdo._bytes.length > 10000) debugger;
      if (zdos.length > 1) {
        const last = zdos.slice(-1)[0]!;
        if (
          last.id.userId === zdo.id.userId &&
          last._bytes.length === zdo._bytes.length &&
          last._bytes.every((v, i) => v === zdo._bytes[i])
        ) {
          const { prefab } = zdos.pop()!;
          removedPrefabs.set(prefab, (removedPrefabs.get(prefab) ?? 0) + 1);
        }
      }
      zdos.push(zdo);
    } catch (e) {
      const mistake = errorToMistake(e);
      corruptions.push({ mistake, offset, index: i });
      reader.forwardToPattern(bytes => bytes.subarray(16, 32).every((v, i) => {
        switch (i) {
          case 0: return v !== 0; 
          case 4: return v !== 0;
          case 8: return v === 1;
          default: return v === 0;
        }
      }));
      totalCorruptedBytes += reader.getOffset() - offset;
    }
  }
  if (removedPrefabs.size > 0) {
    console.warn('Removed duplicated objects: ', removedPrefabs);
  }
  const deadZdos = reader.readMap(function () {
    const userId = this.readLong();
    const id = this.readUInt();
    return { userId, id };
  }, reader.readLong);

  if (totalCorruptedBytes > 0) {
    console.error(`Total corrupted bytes = ${totalCorruptedBytes}`);
  }

  return {
    myid,
    nextUid,
    zdos,
    deadZdos,
    corruptions,
    _checked: false,
  };
}

function* writeZDOData(writer: PackageWriter, zdoData: ZDOData): Generator<number, void> {
  writer.writeLong(zdoData.myid);
  writer.writeUInt(zdoData.nextUid);
  writer.writeInt(zdoData.zdos.length);
  for (const [i, zdo] of zdoData.zdos.entries()) {
    if ((i & 0x7FFF) === 0) yield i / zdoData.zdos.length;
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

export function* read(bytes: Uint8Array): Generator<number, WorldData> {
  let reader = new PackageReader(bytes);
  const version = reader.readInt();
  const netTime = version >= 4 ? reader.readDouble() : NaN;
  const zdo = yield* readZDOData(reader, version);
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

export function* write({
  version,
  netTime,
  zdo,
  zoneSystem,
  randEvent,
}: WorldData): Generator<number, Uint8Array> {
  let writer = new PackageWriter();
  writer.writeInt(version);
  if (version >= 4) writer.writeDouble(netTime);
  yield* writeZDOData(writer, zdo);
  if (version >= 12) writeZoneSystem(writer, version, zoneSystem!);
  if (version >= 15) writeRandEvent(writer, version, randEvent!);
  return writer.flush();
}
