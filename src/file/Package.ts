import { inflate, deflate } from 'pako';

import type { Vector3 } from '../model/utils';

/*
type ToObject<Format extends PackageEntry[]> = {
  [K in keyof Format]: 
}
*/

export class PackageReader {
  private offset: number = 0;
  private bytes: Uint8Array;
  private view: DataView;
  constructor(buffer: ArrayBuffer) {
    this.bytes = new Uint8Array(buffer);
    this.view = new DataView(buffer);
  }

  private read7BitInt(): number {
    let value = 0;
    let offset = 0;
    while (offset < 35) {
      const byteVal = this.view.getUint8(this.offset++);
      value |= (byteVal & 0x7f) << offset;
      offset += 7;
      if (!(byteVal & 0x80)) return value;
    }
    throw new RangeError("Unterminated 7-bit encoding");
  }

  public readBool(): boolean {
    return !!this.view.getUint8(this.offset++);
  }

  public readByte(): number {
    return this.view.getUint8(this.offset++);
  }

  public readInt(): number {
    const result = this.view.getInt32(this.offset, true);
    this.offset += 4;
    return result;
  }

  public readFloat(): number {
    const result = this.view.getFloat32(this.offset, true);
    this.offset += 4;
    return result;
  }

  public readLong(): bigint {
    const result = this.view.getBigInt64(this.offset, true);
    this.offset += 8;
    return result;
  }

  public readVector3(): Vector3 {
    const x = this.readFloat();
    const y = this.readFloat();
    const z = this.readFloat();
    return { x, y, z };
  }

  public readString(): string {
    const length = this.read7BitInt();
    const start = this.offset;
    const end = this.offset += length;
    const decoder = new TextDecoder();
    return decoder.decode(this.bytes.buffer.slice(start, end));
  }

  public readByteArray(): Uint8Array {
    const length = this.readInt();
    const start = this.offset;
    const end = this.offset += length;
    return this.bytes.slice(start, end);
  }

  public readGzipped(): Uint8Array {
    const gzipped = this.readByteArray();
    return inflate(gzipped);
  }

  public skipBytes(n: number): void {
    this.offset += n;
  }

  public readArray<T>(reader: (this: PackageReader) => T): T[] {
    const length = this.readInt();
    const result = [];
    for (let i = 0; i < length; i++) {
      result.push(reader.call(this));
    }
    return result;
  }

  public readMap<K, V>(
    keyReader: (this: PackageReader) => K,
    valueReader: (this: PackageReader) => V,
  ): Map<K, V> {
    const length = this.readInt();
    const result = new Map<K, V>();
    for (let i = 0; i < length; i++) {
      const key = keyReader.call(this);
      const value = valueReader.call(this);
      result.set(key, value);
    }
    return result;
  }

  public readIf<T>(reader: (this: PackageReader) => T): T | undefined {
    const has = this.readBool();
    if (!has) return undefined;
    return reader.call(this);
  }
}

export class PackageWriter {
  private offset: number = 0;
  private buffer: ArrayBuffer;
  private bytes: Uint8Array;
  private view: DataView;
  constructor() {
    this.buffer = new ArrayBuffer(16);
    this.bytes = new Uint8Array(this.buffer);
    this.view = new DataView(this.buffer);
  }

  private ensureSpace(bytesCapacity: number): void {
    if (this.offset + bytesCapacity < this.buffer.byteLength) return;
    let newSize = this.buffer.byteLength;
    do { newSize *= 2; } while (this.offset + bytesCapacity >= newSize);
    const buffer = new ArrayBuffer(newSize);
    const bytes = new Uint8Array(buffer);
    const view = new DataView(buffer);
    bytes.set(this.bytes);
    this.buffer = buffer;
    this.bytes = bytes;
    this.view = view;
  }

  public writeBool(value: boolean): void {
    this.ensureSpace(1);
    this.view.setUint8(this.offset++, value ? 1 : 0);
  }

  public writeByte(value: number): void {
    this.ensureSpace(1);
    this.view.setUint8(this.offset++, value & 0xFF);
  }

  public writeInt(value: number): void {
    this.ensureSpace(4);
    this.view.setInt32(this.offset, value, true);
    this.offset += 4;
  }

  public writeFloat(value: number): void {
    this.ensureSpace(4);
    this.view.setFloat32(this.offset, value, true);
    this.offset += 4;
  }

  public writeLong(value: bigint): void {
    this.ensureSpace(8);
    this.view.setBigInt64(this.offset, value, true);
    this.offset += 8;
  }

  public writeVector3(value: Vector3): void {
    this.ensureSpace(12);
    this.view.setFloat32(this.offset, value.x, true);
    this.view.setFloat32(this.offset += 4, value.y, true);
    this.view.setFloat32(this.offset += 4, value.z, true);
    this.offset += 4;
  }

  private write7BitInt(value: number): void {
    while (value >= 128) {
      this.writeByte((value & 0x7F) | 0x80);
      value >>= 7;
    }
    this.writeByte(value);
  }

  public writeString(value: string): void {
    this.write7BitInt(value.length);
    const encoder = new TextEncoder();
    this.ensureSpace(value.length * 3);
    const encoded = encoder.encodeInto(value, this.bytes.subarray(this.offset));
    this.offset += encoded.written ?? 0;
  }

  public writeByteArray(value: Uint8Array): void {
    const length = value.byteLength;
    this.writeInt(length);
    this.ensureSpace(length);
    this.bytes.set(value, this.offset);
    this.offset += length;
  }

  public writeGzipped(value: Uint8Array): void {
    const gzipped = deflate(value, { level: 1 });
    this.writeInt(gzipped.length);
    this.writeByteArray(gzipped);
  }

  public writeArray<T>(writer: (this: PackageWriter, value: T) => void, values: T[]): void {
    const length = values.length;
    this.writeInt(length);
    for (const value of values) {
      writer.call(this, value);
    }
  }

  public writeMap<K, V>(
    keyWriter: (this: PackageWriter, value: K) => void,
    valueWriter: (this: PackageWriter, value: V) => void,
    values: Map<K, V>,
  ): void {
    const length = values.size;
    this.writeInt(length);
    for (const [key, value] of values) {
      keyWriter.call(this, key);
      valueWriter.call(this, value);
    }
  }

  public writeIf<T>(writer: (this: PackageWriter, value: T) => void, value: T | undefined): void {
    if (value == null) {
      this.writeBool(false);
    } else {
      this.writeBool(true);
      writer.call(this, value);
    }
  }

  public flush(): Uint8Array {
    return this.bytes.slice(0, this.offset);
  }
}