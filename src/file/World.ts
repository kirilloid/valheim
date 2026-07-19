import { gunzipSync, gzipSync } from 'fflate';

import type { ZDO, ZDOCorruption, ZDOData, ZDOID } from './types';
import type { Vector2i, Vector3 } from '../model/utils';

import { hashPrefab } from '../model/utils';
import { locationHashes } from '../data/location-hashes';
import { PackageReader, PackageWriter } from './Package';
import {
  readZdoMmapOld as readZdoOld,
  readZdoMmap as readZdoNew,
  setVersion,
  errorToMistake,
} from './zdo';
import { read as readZDOChunks, write as writeZDOChunks } from './zdo/chunks';
import { checkVersion, WORLD } from './versions';
import { getFirstFile } from './files-wrapper';

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
  _name: string;
  version: number;
  // time since t=0 in seconds
  netTime: number;
  zdo: ZDOData;
  zoneSystem?: ZoneSystemData;
  randEvent?: RandEventData;
}

function* readZDOData(reader: PackageReader, version: number, options: { removeDuplicates?: boolean } = {}): Generator<number, ZDOData> {
  const myid = reader.readLong();
  const nextUid = reader.readUInt();
  const zdos: ZDO[] = [];
  const zdoLength = reader.readInt();
  const corruptions: ZDOCorruption[] = [];
  setVersion(version);
  let totalCorruptedBytes = 0;
  const removedPrefabs = new Map<number, number>();
  const readZdo: (reader: PackageReader, version: number) => ZDO = version >= 30 ? readZdoNew : readZdoOld;
  for (let i = 0; i < zdoLength; i++) {
    const offset = reader.getOffset();
    if (reader.getProgress() === 1) break;
    if ((i & 0x7FFF) === 0) {
      yield reader.getProgress();
    }
    try {
      const zdo = readZdo(reader, version);
      if (options.removeDuplicates && zdos.length > 1 && zdo._bytes.length !== 0) {
        const last = zdos.at(-1)!;
        if (
          // last.id.userId === zdo.id.userId &&
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
      corruptions.push({ mistake, offset, index: i, chunkId: 0 });
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
  const deadZdos = version <= 30
    ? reader.readMap(function () {
        const userId = this.readLong();
        const id = this.readUInt();
        return { userId, id };
      }, reader.readLong)
    : new Map<ZDOID, bigint>();

  if (totalCorruptedBytes > 0) {
    console.error(`Total corrupted bytes = ${totalCorruptedBytes}`);
  }

  const chunkIndex = -1;
  const info = { chunkIndex, version, numZDOs: zdos.length };
  const chunks = new Map([[chunkIndex, { zdos, name: '', info }]]);

  return {
    myid,
    nextUid,
    revision: 0,
    chunks,
    totalZDOs: zdos.length,
    deadZdos,
    corruptions,
    _checked: false,
  };
}

function* writeZDOData(writer: PackageWriter, version: number, zdoData: ZDOData): Generator<number, void> {
  writer.writeLong(zdoData.myid);
  writer.writeUInt(zdoData.nextUid);
  writer.writeInt(zdoData.totalZDOs);
  let i = 0;
  for (const chunk of zdoData.chunks.values()) {
    for (const zdo of chunk.zdos) {
      if ((i & 0x7FFF) === 0) yield i / zdoData.totalZDOs;
      zdo.save(writer);
      i++;
    }
  }
  if (version <= 30) {
    writer.writeMap(function (key: ZDOID) {
      this.writeLong(key.userId);
      this.writeUInt(key.id);
    }, writer.writeLong, zdoData.deadZdos);
  }
}

function readZoneSystem(reader: PackageReader, version: number): ZoneSystemData {
  if (version >= 40) {
    reader = new PackageReader(gunzipSync(reader.readByteArray()));
  }
  const result: ZoneSystemData = {
    generatedZones: reader.readArray(version >= 40 ? reader.readVector2s : reader.readVector2i),
    pgwVersion: 0,
    globalKeys: [],
    locationsGenerated: false,
    locationVersion: 0,
    locationInstances: [],
  };
  if (version < 13) return result;
  if (version < 40) result.pgwVersion = reader.readInt();
  if (version >= 21) result.locationVersion = reader.readInt();
  if (version >= 14) result.globalKeys = reader.readArray(reader.readString);
  if (version < 18) return result;
  if (version >= 20) result.locationsGenerated = reader.readBool();
  result.locationInstances = reader.readArray(function () {
    let name = '';
    if (version >= 40) {
      const hash = this.readInt();
      const _name = locationHashes.get(hash);
      if (_name) {
        name = _name;
      } else {
        name = `${hash}_unknown_`;
        console.warn("Failed to identify location", hash);
      }
    } else {
      name = this.readString();
    }
    const pos = this.readVector3();
    const generated = version >= 19 ? reader.readBool() : false;
    return { name, pos, generated };
  });
  return result;
}

function writeZoneSystem(writer: PackageWriter, version: number, zoneSystem: ZoneSystemData): void {
  if (version >= 40) {
    const zpkg = new PackageWriter();
    writeZoneSystemInternal(zpkg, version, zoneSystem);
    const bytes = zpkg.flush();
    const compressed = gzipSync(bytes);
    writer.writeByteArray(compressed);
  } else {
    writeZoneSystemInternal(writer, version, zoneSystem);
  }
}

function writeZoneSystemInternal(writer: PackageWriter, version: number, zoneSystem: ZoneSystemData): void {
  writer.writeArray(version >= 40 ? writer.writeVector2s : writer.writeVector2i, zoneSystem.generatedZones);
  if (version < 13) return;
  if (version < 40) writer.writeInt(zoneSystem.pgwVersion);
  if (version >= 21) writer.writeInt(zoneSystem.locationVersion);
  if (version >= 14) writer.writeArray(writer.writeString, zoneSystem.globalKeys);
  if (version < 18) return;
  if (version >= 20) writer.writeBool(zoneSystem.locationsGenerated);
  writer.writeArray(function (loc) {
    if (version >= 40) {
      this.writeInt(hashPrefab(loc.name));
    } else {
      this.writeString(loc.name);
    }
    this.writeVector3(loc.pos);
    if (version >= 19) this.writeBool(loc.generated);
  }, zoneSystem.locationInstances);
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

export async function* read(files: Map<string, File>): AsyncGenerator<number, WorldData> {
  const [_name, file] = getFirstFile(files, name => name.endsWith('.db') || name.endsWith('.db2'));
  const bytes = new Uint8Array(await file.arrayBuffer());
  let reader = new PackageReader(bytes);
  const version = reader.readInt();
  checkVersion('world', version, WORLD);
  const netTime = version >= 4 ? reader.readDouble() : NaN;
  const zdo = version >= 40
    ? await readZDOChunks(files, version)
    : yield* readZDOData(reader, version);
  const zoneSystem = version >= 12 ? readZoneSystem(reader, version) : undefined;
  const randEvent = version >= 15 ? readRandEvent(reader, version) : undefined;
  return {
    _name,
    version,
    netTime,
    zdo,
    zoneSystem,
    randEvent,
  };
}

export async function* write({
  _name,
  version,
  netTime,
  zdo,
  zoneSystem,
  randEvent,
}: WorldData): AsyncGenerator<number, Map<string, Uint8Array>> {
  const writer = new PackageWriter();
  writer.writeInt(version);
  const files = new Map<string, Uint8Array>();
  if (version >= 4) writer.writeDouble(netTime);
  if (version >= 40) {
    writeZDOChunks(files, version, zdo);
  } else {
    yield* writeZDOData(writer, version, zdo);
  }
  if (version >= 12) writeZoneSystem(writer, version, zoneSystem!);
  if (version >= 15) writeRandEvent(writer, version, randEvent!);
  files.set(_name, writer.flush());
  return files;
}
