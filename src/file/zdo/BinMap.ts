import type { Quaternion, Vector3 } from '../../model/utils';
import { PackageReader, PackageWriter } from '../Package';

abstract class FixedBinMap<V> implements Map<number, V> {
  private indices: Map<number, number> | null = null;
  private newValues: Map<number, V> | null = null;
  protected changedSize: boolean = false;
  protected initialSize: number = 0;
  protected sizeOffset: number;
  protected view: DataView;
  protected abstract readKey(index: number): number;
  protected abstract readValue(index: number): V;
  protected abstract writeValue(index: number, value: V): void;
  protected abstract saveKeyValue(writer: PackageWriter, key: number, value: V): void;
  protected abstract baseByteSize: number;

  constructor(
    bytes: Uint8Array,
    private readSize: (this: PackageReader) => number,
    private writeSize: (this: PackageWriter, value: number) => void,
  ) {
    this.sizeOffset = 0;
    const pkg = new PackageReader(bytes);
    this.initialSize = this.readSize.call(pkg);
    this.sizeOffset = pkg.getOffset() - bytes.byteOffset;
    this.view = new DataView(bytes.buffer, pkg.getOffset());
  }

  protected getIndices(): Map<number, number> {
    if (this.indices != null) return this.indices;
    const indices = new Map();
    for (let i = 0; i < this.initialSize; i++) {
      const key = this.readKey(i);
      indices.set(key, i);
    }
    return this.indices = indices;
  }

  clear(): void {
    this.changedSize = true;
    this.getIndices().clear();
    if (this.newValues !== null) this.newValues.clear();
  }

  delete(key: number): boolean {
    let deleted = false
    if (this.newValues == null) {
      deleted = this.getIndices().delete(key);
    } else {
      deleted = this.getIndices().delete(key) || this.newValues.delete(key);
    }
    if (deleted) this.changedSize = true;
    return deleted;
  }

  forEach(callbackfn: (value: V, key: number, map: Map<number, V>) => void): void {
    if (!this.changedSize) {
      for (let i = 0; i < this.initialSize; i++) {
        const key = this.readKey(i);
        const value = this.readValue(i);
        callbackfn(value, key, this);
      }
    } else {
      for (const [key, value] of this.entries()) {
        callbackfn(value, key, this);
      }
    }
  }

  get(key: number): V | undefined {
    const index = this.getIndices().get(key);
    if (index === undefined) {
      return this.newValues?.get(key);
    }
    return this.readValue(index);
  }

  has(key: number): boolean {
    return this.getIndices().has(key) || (this.newValues?.has(key) ?? false);
  }

  set(key: number, value: V): this {
    const offset = this.getIndices().get(key);
    if (offset !== undefined) {
      this.writeValue(offset, value);
    } else {
      this.changedSize = true;
      if (this.newValues === null) this.newValues = new Map();
      this.newValues.set(key, value); 
    }
    return this;
  }

  get size(): number {
    return (this.indices?.size ?? this.initialSize) + (this.newValues?.size ?? 0);
  };

  get byteSize(): number {
    return this.sizeOffset + this.initialSize * this.baseByteSize;
  }

  entries(): IterableIterator<[number, V]> {
    if (this.indices !== null) {
      return (function*(self): Generator<[number, V], void> {
        for (const [key, index] of self.indices?.entries() ?? []) yield [key, self.readValue(index)];
        for (const pair of self.newValues?.entries() ?? []) yield pair;
      }(this));
    }
    return (function*(self): Generator<[number, V], void> {
      for (let i = 0; i < self.initialSize; i++) yield [self.readKey(i), self.readValue(i)];
    }(this));
  }

  keys(): IterableIterator<number> {
    if (this.indices !== null) {
      return (function*(self) {
        if (self.indices !== null) yield* self.indices.keys();
        if (self.newValues) yield* self.newValues.keys();
      }(this));
    }
    return (function*(self) {
      for (let i = 0; i < self.initialSize; i++) yield self.readKey(i);
    }(this));
  }

  values(): IterableIterator<V> {
    if (this.indices !== null) {
      return (function*(self) {
        for (const index of self.indices?.values() ?? []) yield self.readValue(index);
        yield* (self.newValues ?? []).values();
      }(this));
    }
    return (function*(self) {
      for (let i = 0; i < self.initialSize; i++) yield self.readValue(i);
    }(this));
  }

  save(writer: PackageWriter) {
    if (!this.changedSize) {
      const offset = this.view.byteOffset - this.sizeOffset;
      const bytes = new Uint8Array(this.view.buffer, offset, this.byteSize);
      writer.writeBytes(bytes);
      return;
    }
    this.writeSize.call(writer, this.size);
    for (const [key, value] of this.entries()) {
      this.saveKeyValue(writer, key, value);
    }
  }

  [Symbol.iterator]() {
    return this.entries();
  }

  get [Symbol.toStringTag]() {
    return 'BinMap';
  }
}

export class EmptyBinMap<V> implements Map<number, V> {
  private _map = new Map<number, V>();

  constructor(
    private writeSize: (this: PackageWriter, value: number) => void,
    private writeValue: (this: PackageWriter, value: V) => void,
  ) {}

  clear(): void {
    this._map.clear();
  }

  delete(key: number): boolean {
    return this._map.delete(key);
  }

  forEach(callbackfn: (value: V, key: number, map: Map<number, V>) => void): void {
    this._map.forEach(callbackfn);
  }

  get(key: number): V | undefined {
    return this._map.get(key);
  }

  has(key: number): boolean {
    return this._map.has(key);
  }

  set(key: number, value: V): this {
    this._map.set(key, value);
    return this;
  }

  get size(): number {
    return this._map.size;
  };

  get byteSize(): number {
    return 0;
  }

  entries(): IterableIterator<[number, V]> {
    return this._map.entries();
  }

  keys(): IterableIterator<number> {
    return this._map.keys();
  }

  values(): IterableIterator<V> {
    return this._map.values();
  }

  save(writer: PackageWriter) {
    this.writeSize.call(writer, this._map.size);
    for (const [key, value] of this.entries()) {
      writer.writeInt(key);
      this.writeValue.call(writer, value);
    }
  }

  [Symbol.iterator]() {
    return this.entries();
  }

  get [Symbol.toStringTag]() {
    return 'BinEmptyMap';
  }
}

export class IntBinMap extends FixedBinMap<number> {
  baseByteSize = 8;
  readKey(index: number): number {
    return this.view.getInt32(index * 8, true);
  }
  readValue(index: number): number {
    return this.view.getInt32(index * 8 + 4, true);
  }
  writeValue(index: number, value: number) {
    this.view.setInt32(index * 8 + 4, value, true);
  }
  saveKeyValue(writer: PackageWriter, key: number, value: number) {
    writer.writeInt(key);
    writer.writeInt(value);
  }
  get [Symbol.toStringTag](): string {
    return 'IntBinMap';
  }
}

export class FloatBinMap extends FixedBinMap<number> {
  baseByteSize = 8;
  readKey(index: number): number {
    return this.view.getInt32(index * 8, true);
  }
  readValue(index: number): number {
    return this.view.getFloat32(index * 8 + 4, true);
  }
  writeValue(index: number, value: number) {
    this.view.setFloat32(index * 8 + 4, value, true);
  }
  saveKeyValue(writer: PackageWriter, key: number, value: number) {
    writer.writeInt(key);
    writer.writeFloat(value);
  }
  get [Symbol.toStringTag](): string {
    return 'FloatBinMap';
  }
}

export class LongBinMap extends FixedBinMap<bigint> {
  baseByteSize = 12;
  readKey(index: number): number {
    return this.view.getInt32(index * 12, true);
  }
  readValue(index: number): bigint {
    return this.view.getBigInt64(index * 12 + 4, true);
  }
  writeValue(index: number, value: bigint) {
    this.view.setBigInt64(index * 12 + 4, value, true);
  }
  saveKeyValue(writer: PackageWriter, key: number, value: bigint) {
    writer.writeInt(key);
    writer.writeLong(value);
  }
  get [Symbol.toStringTag](): string {
    return 'LongBinMap';
  }
}

export class Vector3BinMap extends FixedBinMap<Vector3> {
  baseByteSize = 16;
  readKey(index: number): number {
    return this.view.getInt32(index * 16, true);
  }
  readValue(index: number): Vector3 {
    const x = this.view.getFloat32(index * 16 + 4, true);
    const y = this.view.getFloat32(index * 16 + 8, true);
    const z = this.view.getFloat32(index * 16 + 12, true);
    return { x, y, z };
  }
  writeValue(index: number, value: Vector3) {
    this.view.setFloat32(index * 16 + 4, value.x, true);
    this.view.setFloat32(index * 16 + 8, value.y, true);
    this.view.setFloat32(index * 16 + 12, value.z, true);
  }
  saveKeyValue(writer: PackageWriter, key: number, value: Vector3) {
    writer.writeInt(key);
    writer.writeVector3(value);
  }
  get [Symbol.toStringTag](): string {
    return 'Vector3BinMap';
  }
}

export class QuaternionBinMap extends FixedBinMap<Quaternion> {
  baseByteSize = 20;
  readKey(index: number): number {
    return this.view.getInt32(index * 20, true);
  }
  readValue(index: number): Quaternion {
    const x = this.view.getFloat32(index * 20 + 4, true);
    const y = this.view.getFloat32(index * 20 + 8, true);
    const z = this.view.getFloat32(index * 20 + 12, true);
    const w = this.view.getFloat32(index * 20 + 16, true);
    return { x, y, z, w };
  }
  writeValue(index: number, value: Quaternion) {
    this.view.setFloat32(index * 20 + 4, value.x, true);
    this.view.setFloat32(index * 20 + 8, value.y, true);
    this.view.setFloat32(index * 20 + 12, value.z, true);
    this.view.setFloat32(index * 20 + 16, value.w, true);
  }
  saveKeyValue(writer: PackageWriter, key: number, value: Quaternion) {
    writer.writeInt(key);
    writer.writeQuaternion(value);
  }
  get [Symbol.toStringTag](): string {
    return 'QuaternionBinMap';
  }
}

