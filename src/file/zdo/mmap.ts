import type { ZDO, ZDOID } from '../types';
import { Quaternion, Vector2i, Vector3 } from '../../model/utils';
import { stableHashCode } from '../../model/hash';
import { PackageReader, PackageWriter } from '../Package';
import { FloatBinMap, IntBinMap, LongBinMap, QuaternionBinMap, Vector3BinMap } from './BinMap';
import { offsets } from './offset';

const PREFAB_HASH = stableHashCode('prefab');

class ZdoMmapView implements ZDO {
  public _bytes: Uint8Array;
  private view: DataView;
  private offsetFloats = 0;
  private offsetVec3 = 0;
  private offsetQuats = 0;
  private offsetInts = 0;
  private offsetLongs = 0;
  private offsetStrings = 0;
  _floats: FloatBinMap | null = null;
  _vec3: Vector3BinMap | null = null;
  _quats: QuaternionBinMap | null = null;
  _ints: IntBinMap | null = null;
  _longs: LongBinMap | null = null;
  _strings: Map<number, string> | null = null;
  _byteArrays: Map<number, Uint8Array> | null = null;

  private readSize = PackageReader.prototype.readChar;
  private writeSize = PackageWriter.prototype.writeChar;

  public id: ZDOID;
  public readonly _offset: number;

  constructor(reader: PackageReader, public version: number) {
    this._offset = reader.getOffset();
    this.id = {
      userId: reader.readLong(),
      id: reader.readUInt(),
    };
    this._bytes = reader.readByteArray();
    this.view = new DataView(this._bytes.buffer, this._bytes.byteOffset, this._bytes.byteLength);
  }
  get ownerRevision(): number { return this.view.getUint32(offsets.ownerRevision, true); }
  set ownerRevision(value: number) { this.view.setUint32(offsets.ownerRevision, value, true); }

  get dataRevision(): number { return this.view.getUint32(offsets.dataRevision, true); }
  set dataRevision(value: number) { this.view.setUint32(offsets.dataRevision, value, true); }

  get persistent(): boolean { return this.view.getUint8(offsets.persistent) > 0; }
  set persistent(value: boolean) { this.view.setUint8(offsets.persistent, value ? 1 : 0); }

  get owner(): bigint { return this.view.getBigInt64(offsets.owner, true); }
  set owner(value: bigint) { this.view.setBigInt64(offsets.owner, value, true); }

  get timeCreated(): bigint { return this.view.getBigInt64(offsets.timeCreated, true); }
  set timeCreated(value: bigint) { this.view.setBigInt64(offsets.timeCreated, value, true); }

  get pgwVersion(): number { return this.view.getInt32(offsets.pgwVersion, true); }
  set pgwVersion(value: number) { this.view.setInt32(offsets.pgwVersion, value, true); }

  get type(): number {
    if (this.version >= 23) return this.view.getUint8(offsets.type);
    return 0;
  }
  set type(value: number) {
    if (this.version >= 23) {
      this.view.setUint8(offsets.type, value);
    }
  }

  get distant(): boolean {
    if (this.version >= 22) return this.view.getUint8(offsets.distant) === 1;
    return false;
  }
  set distant(value: boolean) {
    if (this.version >= 22) {
      this.view.setUint8(offsets.distant, value ? 1 : 0);
    }
  }

  get prefab(): number {
    return this.version >= 17
      ? this.view.getInt32(offsets.prefab, true)
      : this.ints.get(PREFAB_HASH) ?? 0;
  }
  set prefab(value: number) {
    if (this.version >= 17) {
      this.view.setInt32(offsets.prefab, value);
    } else {
      this.ints.set(PREFAB_HASH, value);
    }
  }

  get sector(): Readonly<Vector2i> {
    return {
      x: this.view.getInt32(offsets.sector, true),
      y: this.view.getInt32(offsets.sector + 4, true),
    }
  }
  set sector(value: Vector2i) {
    this.view.setInt32(offsets.sector, value.x, true);
    this.view.setInt32(offsets.sector + 4, value.y, true);
  }

  get position(): Readonly<Vector3> {
    return {
      x: this.view.getFloat32(offsets.position, true),
      y: this.view.getFloat32(offsets.position + 4, true),
      z: this.view.getFloat32(offsets.position + 8, true),
    }
  }
  set position(value: Vector3) {
    this.view.setFloat32(offsets.position, value.x, true);
    this.view.setFloat32(offsets.position + 4, value.y, true);
    this.view.setFloat32(offsets.position + 8, value.z, true);
  }

  get rotation(): Readonly<Quaternion> {
    return {
      x: this.view.getFloat32(offsets.rotation, true),
      y: this.view.getFloat32(offsets.rotation + 4, true),
      z: this.view.getFloat32(offsets.rotation + 8, true),
      w: this.view.getFloat32(offsets.rotation + 12, true),
    }
  }
  set rotation(value: Quaternion) {
    this.view.setFloat32(offsets.rotation, value.x, true);
    this.view.setFloat32(offsets.rotation + 4, value.y, true);
    this.view.setFloat32(offsets.rotation + 8, value.z, true);
    this.view.setFloat32(offsets.rotation + 12, value.w, true);
  }
  
  get floats(): FloatBinMap {
    if (this._floats !== null) return this._floats;
    this.offsetFloats = offsets.maps;
    return this._floats = new FloatBinMap(this._bytes.subarray(offsets.maps), this.readSize, this.writeSize);
  }
  get vec3(): Vector3BinMap {
    if (this._vec3 !== null) return this._vec3;
    this.offsetVec3 = this.floats.byteSize + this.offsetFloats;
    return this._vec3 = new Vector3BinMap(this._bytes.subarray(this.offsetVec3), this.readSize, this.writeSize);
  }
  get quats() {
    if (this._quats !== null) return this._quats;
    this.offsetQuats = this.vec3.byteSize + this.offsetVec3;
    return this._quats = new QuaternionBinMap(this._bytes.subarray(this.offsetQuats), this.readSize, this.writeSize);
  }
  get ints() {
    if (this._ints !== null) return this._ints;
    this.offsetInts = this.quats.byteSize + this.offsetQuats;
    return this._ints = new IntBinMap(this._bytes.subarray(this.offsetInts), this.readSize, this.writeSize);
  }
  get longs() {
    if (this._longs !== null) return this._longs;
    this.offsetLongs = this.ints.byteSize + this.offsetInts;
    return this._longs = new LongBinMap(this._bytes.subarray(this.offsetLongs), this.readSize, this.writeSize);
  }
  get strings() {
    if (this._strings === null) {
      this.offsetStrings = this.longs.byteSize + this.offsetLongs;
      const pkg = new PackageReader(this._bytes.subarray(this.offsetStrings));
      this._strings = pkg.readIfSmallMap(pkg.readInt, pkg.readString) ?? new Map<number, string>();
      if (this.version >= 27) {
        this._byteArrays = pkg.readIfSmallMap(pkg.readInt, pkg.readByteArray) ?? new Map<number, Uint8Array>();
      }
    }
    return this._strings;
  }
  get byteArrays() {
    if (this._byteArrays === null) {
      if (this.version < 27) return this._byteArrays = new Map();
      this.offsetStrings = this.longs.byteSize + this.offsetLongs;
      const pkg = new PackageReader(this._bytes.subarray(this.offsetStrings));
      this._strings = pkg.readIfSmallMap(pkg.readInt, pkg.readString) ?? new Map<number, string>();
      this._byteArrays = pkg.readIfSmallMap(pkg.readInt, pkg.readByteArray) ?? new Map<number, Uint8Array>();
    }
    return this._byteArrays;
  }

  private saveAsPackage(): Uint8Array {
    if (this._floats === null) return this._bytes;
    const pkg = new PackageWriter();
    // write first bytes
    pkg.writeBytes(this._bytes.subarray(0, offsets.maps));
    this._floats.save(pkg);
    // vec3
    if (this._vec3 === null) {
      this.offsetVec3 = this.floats.byteSize + this.offsetFloats;
      pkg.writeBytes(this._bytes.subarray(this.offsetVec3));
      return pkg.flush();
    }
    this._vec3.save(pkg);
    // quats
    if (this._quats === null) {
      this.offsetQuats = this.vec3.byteSize + this.offsetVec3;
      pkg.writeBytes(this._bytes.subarray(this.offsetQuats));
      return pkg.flush();
    }
    this._quats.save(pkg);
    // ints
    if (this._ints === null) {
      this.offsetInts = this.quats.byteSize + this.offsetQuats;
      pkg.writeBytes(this._bytes.subarray(this.offsetInts));
      return pkg.flush();
    }
    this._ints.save(pkg);
    // longs
    if (this._longs === null) {
      this.offsetLongs = this.ints.byteSize + this.offsetInts;
      pkg.writeBytes(this._bytes.subarray(this.offsetLongs));
      return pkg.flush();
    }
    this._longs.save(pkg);
    // strings
    if (this._strings === null) {
      this.offsetStrings = this.longs.byteSize + this.offsetLongs;
      pkg.writeBytes(this._bytes.subarray(this.offsetStrings));
      return pkg.flush();
    }
    pkg.writeIfSmallMap(pkg.writeInt, pkg.writeString, this._strings);
    // byte arrays
    if (this.version >= 27) {
      pkg.writeIfSmallMap(pkg.writeInt, pkg.writeByteArray, this.byteArrays);
    }
    return pkg.flush();
  }

  save(writer: PackageWriter) {
    writer.writeLong(this.id.userId);
    writer.writeUInt(this.id.id);
    writer.writeByteArray(this.saveAsPackage());
  }
}

export function readZdo(reader: PackageReader, version: number) {
  return new ZdoMmapView(reader, version);
}
