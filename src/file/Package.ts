import { decode, encode } from '../model/utf8';
import type { Quaternion, Vector2i, Vector3 } from '../model/utils';

/** HACKY POLYFILL */
if (typeof BigInt === 'undefined') {
  (window as any).BigInt = Number;
}

const two_32 = 0x100000000;

if (typeof DataView.prototype.getBigInt64 === 'undefined') {
  /* eslint-ignore no-extend-native */
  DataView.prototype.getBigInt64 = function (this: DataView, byteOffset: number, littleEndian?: boolean) {
    return littleEndian
      ? this.getInt32(byteOffset, true) + this.getInt32(byteOffset + 4, true) * two_32
      : this.getInt32(byteOffset, false) * two_32 + this.getInt32(byteOffset + 4, false);
  } as any;
}

if (typeof DataView.prototype.setBigInt64 === 'undefined') {
  /* eslint-ignore no-extend-native */
  DataView.prototype.setBigInt64 = function(this: DataView, byteOffset: number, value: number, littleEndian?: boolean) {
    if (littleEndian) {
      this.setInt32(byteOffset, Math.ceil(value / two_32), true);
      this.setInt32(byteOffset + 4, value % two_32, true);
    } else {
      this.setInt32(byteOffset, value % two_32, true);
      this.setInt32(byteOffset + 4, Math.ceil(value / two_32), true);
    }
  } as any;
}

export class PackageReader {
  private offset: number;
  private bytes: Uint8Array;
  private view: DataView;
  constructor(bytes: Uint8Array) {
    this.bytes = bytes;
    this.offset = bytes.byteOffset;
    this.view = new DataView(bytes.buffer);
  }

  public getOffset(): number {
    return this.offset;
  }

  public getProgress(): number {
    const start = this.bytes.byteOffset;
    const end = start + this.bytes.byteLength;
    return (this.offset - start) / (end - start);
  }

  public readBool(): boolean {
    return this.view.getUint8(this.offset++) > 0;
  }

  public readByte(): number {
    return this.view.getUint8(this.offset++);
  }

  public readShort(): number {
    const result = this.view.getInt16(this.offset, true);
    this.offset += 2;
    return result;
  }

  public readInt(): number {
    const result = this.view.getInt32(this.offset, true);
    this.offset += 4;
    return result;
  }

  public readUInt(): number {
    const result = this.view.getUint32(this.offset, true);
    this.offset += 4;
    return result;
  }

  public readLong(): bigint {
    const result = this.view.getBigInt64(this.offset, true);
    this.offset += 8;
    return result;
  }

  public readFloat(): number {
    const result = this.view.getFloat32(this.offset, true);
    this.offset += 4;
    return result;
  }

  public readDouble(): number {
    const result = this.view.getFloat64(this.offset, true);
    this.offset += 8;
    return result;
  }

  public readVector2i(): Vector2i {
    const x = this.readInt();
    const y = this.readInt();
    return { x, y };
  }

  public readVector3(): Vector3 {
    const x = this.readFloat();
    const y = this.readFloat();
    const z = this.readFloat();
    return { x, y, z };
  }

  public readQuaternion(): Quaternion {
    const x = this.readFloat();
    const y = this.readFloat();
    const z = this.readFloat();
    const w = this.readFloat();
    return { x, y, z, w };
  }

  public readChar(): number {
    const offset = this.offset;
    let first = this.readByte();
    // 0xxxxxxx
    if ((first & 0x80) === 0) return first;

    if ((first & 0xE0) === 0xC0) { // 110xxxxx 10xxxxxx
      first &= 0x1F;
      const second = this.readByte() & 0x3F;
      return (first << 6) | second;
    }
    // 1110xxxx 10xxxxxx 10xxxxxx
    if ((first & 0xF0) === 0xE0) {
      first &= 0x0F;
      const second = this.readByte() & 0x3F;
      const third = this.readByte() & 0x3F;
      return (first << 12) | (second << 6) | third;
    }
    // 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
    if ((first & 0xF8) === 0xF0) {
      first &= 0x07;
      const second = this.readByte() & 0x3F;
      const third = this.readByte() & 0x3F;
      const fourth = this.readByte() & 0x3F;
      return (first << 18) | (second << 12) | (third << 6) | fourth;
    }
    throw new RangeError(`Invalid UTF-8 character at offset ${offset}`);
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
    throw new RangeError("Unbounded 7-bit encoding");
  }

  public readString(): string {
    const length = this.read7BitInt();
    const base = this.bytes.byteOffset;
    const start = this.offset;
    const end = this.offset += length;
    return decode(this.bytes.subarray(start - base, end - base));
  }

  public readByteArray(): Uint8Array {
    const length = this.readInt();
    if (length < 0) {
      throw new RangeError(`Negative byte array length at ${this.offset}`);
    }
    const base = this.bytes.byteOffset;
    const start = this.offset;
    const end = this.offset += length;
    return this.bytes.subarray(start - base, end - base);
  }

  public skipBytes(n: number): void {
    this.offset += n;
  }

  public forwardToPattern(callback: (bytes: Uint8Array) => boolean): void {
    while (!callback(this.bytes.subarray(this.offset)) && this.offset < this.bytes.length) {
      this.offset++;
    }
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

  public readIfSmallMap<K, V>(
    keyReader: (this: PackageReader) => K,
    valueReader: (this: PackageReader) => V,
  ): Map<K, V> | undefined {
    const length = this.readChar();
    if (length === 0) return;
    const result = new Map<K, V>();
    for (let i = 0; i < length; i++) {
      const key = keyReader.call(this);
      const value = valueReader.call(this);
      result.set(key, value);
    }
    return result;
  }
}

export class PackageWriter {
  private offset: number = 0;
  private buffer: ArrayBuffer;
  private bytes: Uint8Array;
  private view: DataView;
  constructor(sizeHint: number = 16) {
    this.buffer = new ArrayBuffer(sizeHint);
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

  public writeShort(value: number): void {
    this.ensureSpace(2);
    this.view.setInt16(this.offset, value, true);
    this.offset += 2;
  }

  public writeInt(value: number): void {
    this.ensureSpace(4);
    this.view.setInt32(this.offset, value, true);
    this.offset += 4;
  }

  public writeUInt(value: number): void {
    this.ensureSpace(4);
    this.view.setUint32(this.offset, value, true);
    this.offset += 4;
  }

  public writeLong(value: bigint): void {
    this.ensureSpace(8);
    this.view.setBigInt64(this.offset, value, true);
    this.offset += 8;
  }

  public writeFloat(value: number): void {
    this.ensureSpace(4);
    this.view.setFloat32(this.offset, value, true);
    this.offset += 4;
  }

  public writeDouble(value: number): void {
    this.ensureSpace(8);
    this.view.setFloat64(this.offset, value, true);
    this.offset += 8;
  }

  public writeVector2i(value: Vector2i): void {
    this.ensureSpace(8);
    this.view.setInt32(this.offset, value.x, true);
    this.view.setInt32(this.offset += 4, value.y, true);
    this.offset += 4;
  }

  public writeVector3(value: Vector3): void {
    this.ensureSpace(12);
    this.view.setFloat32(this.offset, value.x, true);
    this.view.setFloat32(this.offset += 4, value.y, true);
    this.view.setFloat32(this.offset += 4, value.z, true);
    this.offset += 4;
  }

  public writeQuaternion(value: Quaternion): void {
    this.ensureSpace(16);
    this.view.setFloat32(this.offset, value.x, true);
    this.view.setFloat32(this.offset += 4, value.y, true);
    this.view.setFloat32(this.offset += 4, value.z, true);
    this.view.setFloat32(this.offset += 4, value.w, true);
    this.offset += 4;
  }

  public writeChar(value: number): void {
    if (value <= 0x7F) { // 7 bits
      this.writeByte(value);
      return;
    }
    if (value <= 0x7FF) { // 11 bits
      this.writeByte((value >> 6) | 0xC0);
      this.writeByte((value & 0x3F) | 0x80);
      return;
    }
    if (value <= 0xFFFF) { // 16 bits
      this.writeByte(((value >> 12) & 0x0F) | 0xE0);
      this.writeByte(((value >> 6) & 0x3F) | 0x80);
      this.writeByte(((value >> 0) & 0x3F) | 0x80);
      return;
    }
    if (value <= 0x1FFFFF) { // 21 bits
      this.writeByte(((value >> 18) & 0x07) | 0xF0);
      this.writeByte(((value >> 12) & 0x3F) | 0x80);
      this.writeByte(((value >> 6) & 0x3F) | 0x80);
      this.writeByte(((value >> 0) & 0x3F) | 0x80);
      return;
    }
    throw new RangeError(`UTF-8 character with code ${value}`);
  }

  private write7BitInt(value: number): void {
    while (value >= 128) {
      this.writeByte((value & 0x7F) | 0x80);
      value >>= 7;
    }
    this.writeByte(value);
  }

  public writeString(value: string): void {
    const encoded = encode(value);
    this.write7BitInt(encoded.byteLength);
    this.writeBytes(encoded);
  }

  public writeBytes(value: Uint8Array): void {
    const length = value.byteLength;
    this.ensureSpace(length);
    this.bytes.set(value, this.offset);
    this.offset += length;
  }

  public writeByteArray(value: Uint8Array): void {
    const length = value.length;
    this.writeInt(length);
    this.writeBytes(value);
  }

  public writeArray<T>(writer: (this: PackageWriter, value: T) => void, values: ArrayLike<T>): void {
    const length = values.length;
    this.writeInt(length);
    for (let i = 0; i < values.length; i++) {
      writer.call(this, values[i]!);
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

  public writeIfSmallMap<K, V>(
    keyWriter: (this: PackageWriter, value: K) => void,
    valueWriter: (this: PackageWriter, value: V) => void,
    values: Map<K, V> | undefined,
  ): void {
    if (values == null) {
      this.writeByte(0);
      return;  
    }
    const length = values.size;
    this.writeChar(length);
    for (const [key, value] of values) {
      keyWriter.call(this, key);
      valueWriter.call(this, value);
    }
  }

  public flush(): Uint8Array {
    return this.bytes.slice(0, this.offset);
  }
}