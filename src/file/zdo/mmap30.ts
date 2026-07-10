import type { ZDO } from '../types';
import { Quaternion, Vector2i, Vector3 } from '../../model/utils';
import { PackageReader, PackageWriter } from '../Package';
import { EmptyBinMap, FloatBinMap, IntBinMap, LongBinMap, QuaternionBinMap, Vector3BinMap } from './BinMap';

const TYPE_OFFSET = 10;

const DEFAULT_ROTATION: Vector3 = { x: 0, y: 0, z: 0 };

type MappedMap<T> = Map<number, T> & { byteSize: number; save(pkg: PackageWriter): void }

export class ZdoMmapView implements ZDO {
  public _bytes: Uint8Array;
  private view: DataView;
  private _flag: number;
  private offset01Sector = 0;
  private offset02Position = 0;
  private offset03Prefab = 0;
  private offset04Rotation = 0;
  private offset05Connection = 0;
  private offset06Floats = 0;
  private offset07Vec3 = 0;
  private offset08Quats = 0;
  private offset09Ints = 0;
  private offset10Longs = 0;
  private offset11Strings = 0;
  private offset12ByteArrays = 0;
  _rotation: Vector3 | null = null;
  _znetThing: boolean = false;
  _floats: MappedMap<number> | null = null;
  _vec3: MappedMap<Vector3> | null = null;
  _quats: MappedMap<Quaternion> | null = null;
  _ints: MappedMap<number> | null = null;
  _longs: MappedMap<bigint> | null = null;
  _strings: Map<number, string> | null = null;
  _byteArrays: Map<number, Uint8Array> | null = null;

  public readSize: (this: PackageReader) => number;
  public writeSize: (this: PackageWriter, value: number) => void;

  // public id: ZDOID;
  public readonly _offset: number;

  private skipMap(reader: PackageReader, method: (this: PackageReader) => void) {
    const size = this.readSize.call(reader);
    for (let index = 0; index < size; ++index) {
      reader.skipInt();
      method.call(reader);
    }
  }

  constructor(reader: PackageReader, public version: number) {
    this.readSize = version < 33
      ? PackageReader.prototype.readByte
      : PackageReader.prototype.readNumItems;
    this.writeSize = version < 33
      ? PackageWriter.prototype.writeByte
      : PackageWriter.prototype.writeNumItems;

    const _startOffset = this._offset = reader.getOffset();
    this._bytes = reader.subarray(this._offset);
    this.view = new DataView(this._bytes.buffer, this._bytes.byteOffset, this._bytes.byteLength);
    this._flag = this.view.getUint16(0, true);
    this.offset01Sector = 2;
    this.offset02Position = this.offset01Sector + 4;
    this.offset03Prefab = this.offset02Position + 12;
    this.offset04Rotation = this.offset03Prefab + 4;
    this.offset05Connection = this.offset04Rotation + (this._flag & 4096 ? 12 : 0);
    this.offset06Floats = this.offset05Connection + (this._flag & 1 ? 5 : 0);
    reader.skipBytes(this.offset06Floats);
    if (this._flag & 2) this.skipMap(reader, reader.skipFloat);
    this.offset07Vec3 = reader.getOffset() - _startOffset;
    if (this._flag & 4) this.skipMap(reader, reader.skipVector3);
    this.offset08Quats = reader.getOffset() - _startOffset;
    if (this._flag & 8) this.skipMap(reader, reader.skipQuaternion);
    this.offset09Ints = reader.getOffset() - _startOffset;
    if (this._flag & 16) this.skipMap(reader, reader.skipInt);
    this.offset10Longs = reader.getOffset() - _startOffset;
    if (this._flag & 32) this.skipMap(reader, reader.skipLong);
    this.offset11Strings = reader.getOffset() - _startOffset;
    if (this._flag & 64) this.skipMap(reader, reader.skipString);
    this.offset12ByteArrays = reader.getOffset() - _startOffset;
    if (this._flag & 128) this.skipMap(reader, reader.skipByteArray);
    const _endOffset = reader.getOffset();
    this._bytes = reader.subarray(_startOffset, _endOffset);
    this.view = new DataView(this._bytes.buffer, this._bytes.byteOffset, this._bytes.byteLength);
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
      x: this.view.getInt16(this.offset01Sector, true),
      y: this.view.getInt16(this.offset01Sector + 2, true),
    }
  }
  set sector(value: Vector2i) {
    this.view.setInt16(this.offset01Sector, value.x, true);
    this.view.setInt16(this.offset01Sector + 4, value.y, true);
  }

  get position(): Readonly<Vector3> {
    return {
      x: this.view.getFloat32(this.offset02Position, true),
      y: this.view.getFloat32(this.offset02Position + 4, true),
      z: this.view.getFloat32(this.offset02Position + 8, true),
    }
  }
  set position(value: Vector3) {
    this.view.setFloat32(this.offset02Position, value.x, true);
    this.view.setFloat32(this.offset02Position + 4, value.y, true);
    this.view.setFloat32(this.offset02Position + 8, value.z, true);
  }

  get prefab(): number {
    return this.view.getInt32(this.offset03Prefab, true);
  }
  set prefab(value: number) {
    this.view.setInt32(this.offset03Prefab, value, true);
  }

  get rotation(): Readonly<Vector3> {
    if (this._rotation !== null) return this._rotation;
    if ((this._flag >> 12) & 1) {
      this._rotation = {
        x: this.view.getFloat32(this.offset04Rotation, true),
        y: this.view.getFloat32(this.offset04Rotation + 4, true),
        z: this.view.getFloat32(this.offset04Rotation + 8, true),
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
      this._bytes.subarray(this.offset06Floats),
      this.readSize,
      this.writeSize,
    );
  }

  get vec3() {
    if (this._vec3 !== null) return this._vec3;
    if ((this._flag & 4) === 0) {
      return this._vec3 = new EmptyBinMap(this.writeSize, PackageWriter.prototype.writeVector3);
    }
    return this._vec3 = new Vector3BinMap(
      this._bytes.subarray(this.offset07Vec3),
      this.readSize,
      this.writeSize,
    );
  }

  get quats() {
    if (this._quats !== null) return this._quats;
    if ((this._flag & 8) === 0) {
      return this._quats = new EmptyBinMap(this.writeSize, PackageWriter.prototype.writeQuaternion);
    }
    return this._quats = new QuaternionBinMap(
      this._bytes.subarray(this.offset08Quats),
      this.readSize,
      this.writeSize,
    );
  }

  get ints() {
    if (this._ints !== null) return this._ints;
    if ((this._flag & 16) === 0) {
      return this._ints = new EmptyBinMap(this.writeSize, PackageWriter.prototype.writeInt);
    }
    return this._ints = new IntBinMap(
      this._bytes.subarray(this.offset09Ints),
      this.readSize,
      this.writeSize,
    );
  }

  get longs() {
    if (this._longs !== null) return this._longs;
    if ((this._flag & 32) === 0) {
      return this._longs = new EmptyBinMap(this.writeSize, PackageWriter.prototype.writeLong);
    }
    return this._longs = new LongBinMap(
      this._bytes.subarray(this.offset10Longs),
      this.readSize,
      this.writeSize,
    );
  }

  get strings() {
    if (this._strings !== null) return this._strings;
    if (this._flag & 64) {
      const pkg = new PackageReader(this._bytes.subarray(this.offset11Strings, this.offset12ByteArrays));
      return this._strings = pkg.readShortMap(this.readSize, pkg.readInt, pkg.readString);
    } else {
      return this._strings = new Map();
    }
  }

  get byteArrays() {
    if (this._byteArrays !== null) return this._byteArrays;
    if (this._flag & 128) {
      const pkg = new PackageReader(this._bytes.subarray(this.offset12ByteArrays, this._bytes.length));
      return this._byteArrays = pkg.readShortMap(this.readSize, pkg.readInt, pkg.readByteArray);
    } else {
      return this._byteArrays = new Map();
    }
  }

  save(pkg: PackageWriter): void {
    // if property was materialized, update flag
    if (this._rotation) {
      if (this._rotation !== DEFAULT_ROTATION || this._rotation.x !== 0 || this._rotation.y !== 0 || this._rotation.z !== 0) {
        this._flag |= 4096;
      } else {
        this._flag &= ~4096;
      }
    }
    if (this._floats) if (this._floats.size) this._flag |= 2; else this._flag &= ~2;
    if (this._vec3) if (this._vec3.size) this._flag |= 4; else this._flag &= ~4;
    if (this._quats) if (this._quats.size) this._flag |= 8; else this._flag &= ~8;
    if (this._ints) if (this._ints.size) this._flag |= 16; else this._flag &= ~16;
    if (this._longs) if (this._longs.size) this._flag |= 32; else this._flag &= ~32;
    if (this._strings) if (this._strings.size) this._flag |= 64; else this._flag &= ~64;
    if (this._byteArrays) if (this._byteArrays.size) this._flag |= 128; else this._flag &= ~128;
      
    pkg.writeUShort(this._flag);
    pkg.writeVector2s(this.sector);
    pkg.writeVector3(this.position);
    pkg.writeInt(this.prefab);
    if (this._flag & 4096) if (this._rotation) pkg.writeVector3(this._rotation); else pkg.writeBytes(this._bytes.subarray(this.offset04Rotation, this.offset05Connection))

    // copy SetConnectionData byte + int
    if (this._flag & 1) {
      pkg.writeBytes(this._bytes.subarray(this.offset05Connection, this.offset05Connection + 5));
    }
    
    // if map was materialized, it might have been updated, save it; otherwise just copy bytes
    if (this._flag & 2) if (this._floats) this._floats.save(pkg); else pkg.writeBytes(this._bytes.subarray(this.offset06Floats, this.offset07Vec3));
    if (this._flag & 4) if (this._vec3) this._vec3.save(pkg); else pkg.writeBytes(this._bytes.subarray(this.offset07Vec3, this.offset08Quats));
    if (this._flag & 8) if (this._quats) this._quats.save(pkg); else pkg.writeBytes(this._bytes.subarray(this.offset08Quats, this.offset09Ints));
    if (this._flag & 16) if (this._ints) this._ints.save(pkg); else pkg.writeBytes(this._bytes.subarray(this.offset09Ints, this.offset10Longs));
    if (this._flag & 32) if (this._longs) this._longs.save(pkg); else pkg.writeBytes(this._bytes.subarray(this.offset10Longs, this.offset11Strings));
    if (this._flag & 64) if (this._strings) {
      pkg.writeShortMap(this.writeSize, pkg.writeInt, pkg.writeString, this._strings);
    } else {
      pkg.writeBytes(this._bytes.subarray(this.offset11Strings, this.offset12ByteArrays));
    }
    if (this._flag & 128) if (this._byteArrays) {
      pkg.writeShortMap(this.writeSize, pkg.writeInt, pkg.writeByteArray, this.byteArrays);
    } else {
      pkg.writeBytes(this._bytes.subarray(this.offset12ByteArrays));
    }
  }
}

export function readZdo(reader: PackageReader, version: number) {
  return new ZdoMmapView(reader, version);
}
