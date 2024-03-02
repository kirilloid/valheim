import type { ZDO } from '../types';
import { PackageReader, PackageWriter } from '../Package';
import { stableHashCode } from '../../model/hash';
import { Quaternion, Vector3 } from '../../model/utils';
import { fromEulerAngles } from '../../model/euler';

const PREFAB_HASH = stableHashCode('prefab');

export function readZdo(reader: PackageReader, version: number): ZDO {
  if (version >= 30) {
    return readZdo_post30(reader, version);
  } else {
    return readZdo_pre30(reader, version);
  }
}

let loadId = 0;

function readPropMap<T>(
  reader: PackageReader,
  method: (this: PackageReader) => T,
  version: number,
): Map<number, T> {
  const size = version < 33 ? reader.readByte() : reader.readNumItems();
  const map = new Map<number, T>();
  for (let index = 0; index < size; ++index) {
    const key = reader.readInt();
    const data = method.call(reader);
    map.set(key, data);
  }
  return map;
}

function writePropMap<T>(
  writer: PackageWriter,
  method: (this: PackageWriter, value: T) => void,
  map: Map<number, T>,
  version: number,
): Map<number, T> {
  if (version < 33) {
    writer.writeByte(map.size);
  } else {
    writer.writeNumItems(map.size);
  }
  for (const [key, value] of map.entries()) {
    writer.writeInt(key);
    method.call(writer, value);
  }
  return map;
}

function writeZdo_post30(this: ZDO, writer: PackageWriter) {
  let _flags = 0;
  const isIdentityRotation =
        this.rotation.x === 0
    &&  this.rotation.y === 0
    &&  this.rotation.z === 0;
  if (!isIdentityRotation) _flags |= 4096;
  if (this.floats.size) _flags |= 2;
  if (this.vec3.size) _flags |= 4;
  if (this.quats.size) _flags |= 8;
  if (this.ints.size) _flags |= 16;
  if (this.longs.size) _flags |= 32;
  if (this.strings.size) _flags |= 64;
  if (this.byteArrays.size) _flags |= 128;
  _flags |= (this.type << 10);
  if (this.persistent) _flags |= 256;
  if (this.distant) _flags |= 512;
  writer.writeShort(_flags);
  writer.writeVector2s(this.sector);
  writer.writeVector3(this.position);
  writer.writeInt(this.prefab);
  if (!isIdentityRotation) writer.writeVector3(this.rotation);
  if (this.floats.size) writePropMap(writer, writer.writeFloat, this.floats, this.version);
  if (this.vec3.size) writePropMap(writer, writer.writeVector3, this.vec3, this.version);
  if (this.quats.size) writePropMap(writer, writer.writeQuaternion, this.quats, this.version);
  if (this.ints.size) writePropMap(writer, writer.writeInt, this.ints, this.version);
  if (this.longs.size) writePropMap(writer, writer.writeLong, this.longs, this.version);
  if (this.strings.size) writePropMap(writer, writer.writeString, this.strings, this.version);
  if (this.byteArrays.size) writePropMap(writer, writer.writeByteArray, this.byteArrays, this.version);
}

const ZERO_VECTOR: Vector3 = { x: 0, y: 0, z: 0 };

export function readZdo_post30(reader: PackageReader, version: number): ZDO {
  const _offset = reader.getOffset();
  const id = {
    userId: BigInt(0),
    id: loadId++,
  };
  const _flags = reader.readShort();
  const persistent = (_flags & 256) !== 0;
  const distant = (_flags & 512) !== 0;
  const type = (_flags >> 10) & 3;
  const sector = reader.readVector2s();
  const position = reader.readVector3();
  const prefab = reader.readInt();
  const rotation = (_flags & 4096) ? reader.readVector3() : ZERO_VECTOR;
  const connectionData = (_flags & 1) ? {
    type: reader.readByte(),
    hash: reader.readInt(),
  } : undefined;
  const floats = (_flags & 2)
    ? readPropMap(reader, reader.readFloat, version)
    : new Map<number, number>();
  const vec3 = (_flags & 4)
    ? readPropMap(reader, reader.readVector3, version)
    : new Map<number, Vector3>();
  const quats = (_flags & 8)
    ? readPropMap(reader, reader.readQuaternion, version)
    : new Map<number, Quaternion>();
  const ints = (_flags & 16)
    ? readPropMap(reader, reader.readInt, version)
    : new Map<number, number>();
  const longs = (_flags & 32)
    ? readPropMap(reader, reader.readLong, version)
    : new Map<number, bigint>();
  const strings = (_flags & 64)
    ? readPropMap(reader, reader.readString, version)
    : new Map<number, string>();
  const byteArrays = (_flags & 128)
    ? readPropMap(reader, reader.readByteArray, version)
    : new Map<number, Uint8Array>();
  
  const result: ZDO = {
    // id,
    version,
    persistent,
    type,
    distant,
    prefab,
    connectionData,
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
    _offset,
    _bytes: new Uint8Array(),
    save: writeZdo_post30,
  }
  // if (num1 === 0) {
    return result;
  // }
}

function writeZdo_pre30(this: ZDO, writer: PackageWriter) {
  writer.writeLong((this as any).id.userId);
  writer.writeUInt((this as any).id.id);
  const pkg = new PackageWriter();
  pkg.writeUInt(0);
  pkg.writeUInt(0);
  pkg.writeBool(this.persistent);
  pkg.writeLong(BigInt(0));
  pkg.writeLong(BigInt(0));
  pkg.writeInt(0);
  pkg.writeByte(this.type);
  pkg.writeBool(this.distant);
  pkg.writeInt(this.prefab);
  pkg.writeInt(this.sector.x);
  pkg.writeInt(this.sector.y);
  pkg.writeVector3(this.position);
  pkg.writeQuaternion(fromEulerAngles(this.rotation));
  pkg.writeIfSmallMap(pkg.writeInt, pkg.writeFloat, this.floats);
  pkg.writeIfSmallMap(pkg.writeInt, pkg.writeVector3, this.vec3);
  pkg.writeIfSmallMap(pkg.writeInt, pkg.writeQuaternion, this.quats);
  pkg.writeIfSmallMap(pkg.writeInt, pkg.writeInt, this.ints);
  pkg.writeIfSmallMap(pkg.writeInt, pkg.writeLong, this.longs);
  pkg.writeIfSmallMap(pkg.writeInt, pkg.writeString, this.strings);
  pkg.writeIfSmallMap(pkg.writeInt, pkg.writeByteArray, this.byteArrays);
  writer.writeByteArray(pkg.flush());
}

function readZdo_pre30(reader: PackageReader, version: number): ZDO {
  const offset = reader.getOffset();
  const id = {
    userId: reader.readLong(),
    id: reader.readUInt(),
  };
  const _bytes = reader.readByteArray();
  const pkg = new PackageReader(_bytes);
  pkg.readUInt(); // ownerRevision
  pkg.readUInt(); // dataRevision
  const persistent = pkg.readBool();
  pkg.readLong(); // owner
  pkg.readLong(); // timeCreated
  pkg.readInt(); // pgwVersion
  if (version >= 16 && version < 24)
    pkg.readInt();
  const type = version >= 23 ? pkg.readByte() : 0;
  const distant = version >= 22 ? pkg.readBool() : false;
  let prefab = version >= 17 ? pkg.readInt() : 0;
  const sector = pkg.readVector2i();
  const position = pkg.readVector3();
  const rotation = pkg.readQuaternion();

  const floats = pkg.readIfSmallMap(pkg.readInt, pkg.readFloat) ?? new Map<number, number>();
  const vec3 = pkg.readIfSmallMap(pkg.readInt, pkg.readVector3) ?? new Map<number, Vector3>();
  const quats = pkg.readIfSmallMap(pkg.readInt, pkg.readQuaternion) ?? new Map<number, Quaternion>();
  const ints = pkg.readIfSmallMap(pkg.readInt, pkg.readInt) ?? new Map<number, number>();
  const longs = pkg.readIfSmallMap(pkg.readInt, pkg.readLong) ?? new Map<number, bigint>();
  const strings = pkg.readIfSmallMap(pkg.readInt, pkg.readString) ?? new Map<number, string>();
  const byteArrays = (version >= 27 && pkg.readIfSmallMap(pkg.readInt, pkg.readByteArray)) || new Map<number, Uint8Array>();

  return {
    // id,
    version,
    _bytes,
    persistent,
    type,
    distant,
    get prefab() {
      return version < 17
        ? this.ints.get(PREFAB_HASH) ?? 0
        : prefab;
    },
    set prefab(value: number) {
      if (version < 17) {
        this.ints.set(PREFAB_HASH, value);
      } else {
        prefab = value;
      }
    },
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
    _offset: offset,
    save: writeZdo_pre30,
  };
}

export function setVersion(version: number): void {}
