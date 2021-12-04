import type { ZDO } from '../types';
import { PackageReader, PackageWriter } from '../Package';
import { Quaternion, stableHashCode, Vector3 } from '../../model/utils';

const PREFAB_HASH = stableHashCode('prefab');

export function readZdo(reader: PackageReader, version: number): ZDO {
  const offset = reader.getOffset();
  const id = {
    userId: reader.readLong(),
    id: reader.readUInt(),
  };
  const bytes = reader.readByteArray();
  const pkg = new PackageReader(bytes);
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

  const floats = pkg.readIfSmallMap(pkg.readInt, pkg.readFloat) ?? new Map<number, number>();
  const vec3 = pkg.readIfSmallMap(pkg.readInt, pkg.readVector3) ?? new Map<number, Vector3>();
  const quats = pkg.readIfSmallMap(pkg.readInt, pkg.readQuaternion) ?? new Map<number, Quaternion>();
  const ints = pkg.readIfSmallMap(pkg.readInt, pkg.readInt) ?? new Map<number, number>();
  const longs = pkg.readIfSmallMap(pkg.readInt, pkg.readLong) ?? new Map<number, bigint>();
  const strings = pkg.readIfSmallMap(pkg.readInt, pkg.readString) ?? new Map<number, string>();
  const byteArrays = version >= 27 && pkg.readIfSmallMap(pkg.readInt, pkg.readByteArray) || new Map<number, Uint8Array>();

  const bytesRemaining = bytes.byteOffset + bytes.byteLength - pkg.getOffset();

  return {
    id,
    ownerRevision,
    dataRevision,
    persistent,
    owner,
    timeCreated,
    pgwVersion,
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
    offset,
    save(writer: PackageWriter) {
      writer.writeLong(this.id.userId);
      writer.writeUInt(this.id.id);
      const pkg = new PackageWriter();
      pkg.writeUInt(this.ownerRevision);
      pkg.writeUInt(this.dataRevision);
      pkg.writeBool(this.persistent);
      pkg.writeLong(this.owner);
      pkg.writeLong(this.timeCreated);
      pkg.writeInt(this.pgwVersion);
      pkg.writeByte(this.type);
      pkg.writeBool(this.distant);
      pkg.writeInt(this.prefab);
      pkg.writeInt(this.sector.x);
      pkg.writeInt(this.sector.y);
      pkg.writeVector3(this.position);
      pkg.writeQuaternion(this.rotation);
      pkg.writeIfSmallMap(pkg.writeInt, pkg.writeFloat, this.floats);
      pkg.writeIfSmallMap(pkg.writeInt, pkg.writeVector3, this.vec3);
      pkg.writeIfSmallMap(pkg.writeInt, pkg.writeQuaternion, this.quats);
      pkg.writeIfSmallMap(pkg.writeInt, pkg.writeInt, this.ints);
      pkg.writeIfSmallMap(pkg.writeInt, pkg.writeLong, this.longs);
      pkg.writeIfSmallMap(pkg.writeInt, pkg.writeString, this.strings);
      pkg.writeIfSmallMap(pkg.writeInt, pkg.writeByteArray, this.byteArrays);
      writer.writeByteArray(pkg.flush());
    }
  };
}

export function setVersion(version: number): void {}
