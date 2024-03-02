import type { ZDO } from '../types';
import { Quaternion, Vector2i, Vector3 } from '../../model/utils';
import { PackageReader, PackageWriter } from '../Package';
import { EmptyBinMap, FloatBinMap, IntBinMap, LongBinMap, QuaternionBinMap, Vector3BinMap } from './BinMap';

const TYPE_OFFSET = 10;

const DEFAULT_ROTATION: Vector3 = { x: 0, y: 0, z: 0 };

type MappedMap<T> = Map<number, T> & { byteSize: number; }

class ZdoMmapView implements ZDO {
  public _bytes: Uint8Array;
  private view: DataView;
  private _flag: number;
  private offsetFloats = 0;
  private offsetVec3 = 0;
  private offsetQuats = 0;
  private offsetInts = 0;
  private offsetLongs = 0;
  private offsetStrings = 0;
  _rotation: Vector3 | null = null;
  _znetThing: boolean = false;
  _floats: MappedMap<number> | null = null;
  _vec3: MappedMap<Vector3> | null = null;
  _quats: MappedMap<Quaternion> | null = null;
  _ints: MappedMap<number> | null = null;
  _longs: MappedMap<bigint> | null = null;
  _strings: Map<number, string> | null = null;
  _byteArrays: Map<number, Uint8Array> | null = null;

  private readSize = PackageReader.prototype.readChar;
  private writeSize = PackageWriter.prototype.writeChar;

  // public id: ZDOID;
  public readonly _offset: number;

  constructor(reader: PackageReader, public version: number) {
    this._offset = reader.getOffset();
    this._bytes = reader.readByteArray();
    this.view = new DataView(this._bytes.buffer, this._bytes.byteOffset, this._bytes.byteLength);
    this._flag = this.view.getInt16(0, true);
    this.offsetFloats = 22
      // rotation
      + ((this._flag >> 12) & 1) * 6
      // SetConnectionData byte + int
      + (this._flag & 1) * 5;
  }

  get persistent(): boolean { return (this._flag & 256) > 0; }
  set persistent(value: boolean) {
    this._flag &= ~256;
    this._flag |= (value ? 1 : 0) << 8;
  }

  get distant(): boolean { return (this._flag & 512) > 0; }
  set distant(value: boolean) {
    this._flag &= ~512;
    this._flag |= (value ? 1 : 0) << 9;
  }

  get type(): number {
    return (this._flag >> TYPE_OFFSET) & 3;
  }
  set type(value: number) {
    this._flag &= ~(3 << TYPE_OFFSET);
    this._flag |= (value << TYPE_OFFSET);
  }

  get sector(): Readonly<Vector2i> {
    return {
      x: this.view.getInt16(2, true),
      y: this.view.getInt16(4, true),
    }
  }
  set sector(value: Vector2i) {
    this.view.setInt16(2, value.x, true);
    this.view.setInt16(4, value.y, true);
  }

  get position(): Readonly<Vector3> {
    return {
      x: this.view.getFloat32(6, true),
      y: this.view.getFloat32(10, true),
      z: this.view.getFloat32(14, true),
    }
  }
  set position(value: Vector3) {
    this.view.setFloat32(6, value.x, true);
    this.view.setFloat32(10, value.y, true);
    this.view.setFloat32(14, value.z, true);
  }

  get prefab(): number {
    return this.view.getInt32(18, true);
  }
  set prefab(value: number) {
    this.view.setInt32(18, value, true);
  }

  get rotation(): Readonly<Vector3> {
    if (this._rotation !== null) return this._rotation;
    if ((this._flag >> 12) & 1) {
      this._rotation = {
        x: this.view.getFloat32(22, true),
        y: this.view.getFloat32(26, true),
        z: this.view.getFloat32(30, true),
      }
    } else {
      this._rotation = DEFAULT_ROTATION;
    }
    return this._rotation;
  }
  set rotation(value: Vector3) {
    this._rotation = value;
  }
  
  get floats() {
    if (this._floats !== null) return this._floats;
    if ((this._flag & 2) === 0) {
      return this._floats = new EmptyBinMap(this.writeSize, PackageWriter.prototype.writeFloat);
    }
    return this._floats = new FloatBinMap(
      this._bytes.subarray(this.offsetFloats),
      this.readSize,
      this.writeSize,
    );
  }

  get vec3() {
    if (this._vec3 !== null) return this._vec3;
    this.offsetVec3 = this.offsetFloats + this.floats.byteSize;
    if ((this._flag & 4) === 0) {
      return this._vec3 = new EmptyBinMap(this.writeSize, PackageWriter.prototype.writeVector3);
    }
    return this._vec3 = new Vector3BinMap(
      this._bytes.subarray(this.offsetVec3),
      this.readSize,
      this.writeSize,
    );
  }

  get quats() {
    if (this._quats !== null) return this._quats;
    this.offsetQuats = this.vec3.byteSize + this.offsetVec3;
    if ((this._flag & 8) === 0) {
      return this._quats = new EmptyBinMap(this.writeSize, PackageWriter.prototype.writeQuaternion);
    }
    return this._quats = new QuaternionBinMap(
      this._bytes.subarray(this.offsetQuats),
      this.readSize,
      this.writeSize,
    );
  }

  get ints() {
    if (this._ints !== null) return this._ints;
    this.offsetInts = this.quats.byteSize + this.offsetQuats;
    if ((this._flag & 16) === 0) {
      return this._ints = new EmptyBinMap(this.writeSize, PackageWriter.prototype.writeInt);
    }
    return this._ints = new IntBinMap(
      this._bytes.subarray(this.offsetInts),
      this.readSize,
      this.writeSize,
    );
  }

  get longs() {
    if (this._longs !== null) return this._longs;
    this.offsetLongs = this.ints.byteSize + this.offsetInts;
    if ((this._flag & 32) === 0) {
      return this._longs = new EmptyBinMap(this.writeSize, PackageWriter.prototype.writeLong);
    }
    return this._longs = new LongBinMap(
      this._bytes.subarray(this.offsetLongs),
      this.readSize,
      this.writeSize,
    );
  }

  private readStringsAndByteArrays() {
    const pkg = new PackageReader(this._bytes.subarray(this.offsetStrings));
    this._strings = this._flag & 64
      ? pkg.readShortMap(pkg.readInt, pkg.readString)
      : new Map();
    this._byteArrays = this._flag & 128
      ? pkg.readShortMap(pkg.readInt, pkg.readByteArray)
      : new Map();
  }

  get strings() {
    if (this._strings === null) {
      this.offsetStrings = this.longs.byteSize + this.offsetLongs;
      this.readStringsAndByteArrays();
    }
    return this._strings!;
  }

  get byteArrays() {
    if (this._byteArrays === null) {
      this.offsetStrings = this.longs.byteSize + this.offsetLongs;
      this.readStringsAndByteArrays();
    }
    return this._byteArrays!;
  }

  private saveAsPackage(): Uint8Array {
    if (this._rotation !== DEFAULT_ROTATION) this._flag |= 4096; else this._flag &= ~4096;
    if (this._floats?.size) this._flag |= 2; else this._flag &= ~2;
    if (this._vec3?.size) this._flag |= 4; else this._flag &= ~4;
    if (this._quats?.size) this._flag |= 8; else this._flag &= ~8;
    if (this._ints?.size) this._flag |= 16; else this._flag &= ~16;
    if (this._longs?.size) this._flag |= 32; else this._flag &= ~32;
    if (this._strings?.size) this._flag |= 64; else this._flag &= ~64;
    if (this._byteArrays?.size) this._flag |= 128; else this._flag &= ~128;
      
    const pkg = new PackageWriter();
    pkg.writeShort(this._flag);
    pkg.writeVector2s(this.sector);
    pkg.writeInt(this.prefab);
    if (this._rotation !== null && this._rotation !== DEFAULT_ROTATION) {
      pkg.writeVector3(this._rotation);
    }

    const offset = 22 + ((this._flag >> 12) & 1) * 6
    // copy SetConnectionData byte + int
    if (this._flag & 1) {
      pkg.writeBytes(this._bytes.subarray(offset, offset + 5))
    }
    
    if (this._floats !== null) {
      pkg.writeShortMap(pkg.writeInt, pkg.writeFloat, this._floats);
    }
    if (this._vec3 !== null) {
      pkg.writeShortMap(pkg.writeInt, pkg.writeVector3, this._vec3);
    }
    if (this._quats !== null) {
      pkg.writeShortMap(pkg.writeInt, pkg.writeQuaternion, this._quats);
    }
    if (this._ints !== null) {
      pkg.writeShortMap(pkg.writeInt, pkg.writeInt, this._ints);
    }
    if (this._longs !== null) {
      pkg.writeShortMap(pkg.writeInt, pkg.writeLong, this._longs);
    }
    if (this._strings !== null) {
      pkg.writeShortMap(pkg.writeInt, pkg.writeString, this._strings);
    }
    if (this._byteArrays !== null) {
      pkg.writeShortMap(pkg.writeInt, pkg.writeByteArray, this._byteArrays);
    }
    return pkg.flush();
  }

  save(writer: PackageWriter) {
    // writer.writeLong(this.id.userId);
    // writer.writeUInt(this.id.id);
    writer.writeByteArray(this.saveAsPackage());
  }
}

export function readZdo(reader: PackageReader, version: number) {
  return new ZdoMmapView(reader, version);
}
