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
  const initialOffset = pkg.getOffset();
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

  let mapsRead = false;
  const maps = {} as {
    floats: Map<number, number>,
    vec3: Map<number, Vector3>,
    quats: Map<number, Quaternion>,
    ints: Map<number, number>,
    longs: Map<number, bigint>,
    strings: Map<number, string>,
    byteArrays: Map<number, Uint8Array>,
  };
  function readMaps() {
    if (mapsRead) return maps;
    maps.floats = pkg.readIfSmallMap(pkg.readInt, pkg.readFloat) ?? new Map<number, number>();
    maps.vec3 = pkg.readIfSmallMap(pkg.readInt, pkg.readVector3) ?? new Map<number, Vector3>();
    maps.quats = pkg.readIfSmallMap(pkg.readInt, pkg.readQuaternion) ?? new Map<number, Quaternion>();
    maps.ints = pkg.readIfSmallMap(pkg.readInt, pkg.readInt) ?? new Map<number, number>();
    maps.longs = pkg.readIfSmallMap(pkg.readInt, pkg.readLong) ?? new Map<number, bigint>();
    maps.strings = pkg.readIfSmallMap(pkg.readInt, pkg.readString) ?? new Map<number, string>();
    maps.byteArrays = (version >= 27 && pkg.readIfSmallMap(pkg.readInt, pkg.readByteArray))
                   || new Map<number, Uint8Array>();
    mapsRead = true;
    return maps;
  }
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
    get floats() { return readMaps().floats; },
    get vec3() { return readMaps().vec3; },
    get quats() { return readMaps().quats; },
    get ints() { return readMaps().ints; },
    get longs() { return readMaps().longs; },
    get strings() { return readMaps().strings; },
    get byteArrays() { return readMaps().byteArrays; },
    _offset: offset,
    save(writer: PackageWriter) {
      writer.writeLong(this.id.userId);
      writer.writeUInt(this.id.id);
      const zpkg = new PackageWriter();
      zpkg.writeUInt(this.ownerRevision);
      zpkg.writeUInt(this.dataRevision);
      zpkg.writeBool(this.persistent);
      zpkg.writeLong(this.owner);
      zpkg.writeLong(this.timeCreated);
      zpkg.writeInt(this.pgwVersion);
      zpkg.writeByte(this.type);
      zpkg.writeBool(this.distant);
      zpkg.writeInt(this.prefab);
      zpkg.writeInt(this.sector.x);
      zpkg.writeInt(this.sector.y);
      zpkg.writeVector3(this.position);
      zpkg.writeQuaternion(this.rotation);
      if (mapsRead) {
        zpkg.writeIfSmallMap(zpkg.writeInt, zpkg.writeFloat, maps.floats);
        zpkg.writeIfSmallMap(zpkg.writeInt, zpkg.writeVector3, maps.vec3);
        zpkg.writeIfSmallMap(zpkg.writeInt, zpkg.writeQuaternion, maps.quats);
        zpkg.writeIfSmallMap(zpkg.writeInt, zpkg.writeInt, maps.ints);
        zpkg.writeIfSmallMap(zpkg.writeInt, zpkg.writeLong, maps.longs);
        zpkg.writeIfSmallMap(zpkg.writeInt, zpkg.writeString, maps.strings);
        zpkg.writeIfSmallMap(zpkg.writeInt, zpkg.writeByteArray, maps.byteArrays);  
      } else {
        zpkg.writeBytes(bytes.subarray(pkg.getOffset() - initialOffset));
      }
      writer.writeByteArray(zpkg.flush());
    }
  };
}

export function setVersion(version: number): void {}
