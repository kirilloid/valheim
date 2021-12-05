import { deflate, inflate } from 'pako';
import { PackageReader, PackageWriter } from './Package';

export type Data = {
  version: number;
  depths: Int16Array;
  total: number;
};

export function read(zbytes: Uint8Array): Data {
  const bytes = inflate(zbytes);
  const pkg = new PackageReader(bytes);
  // read
  const version = pkg.readInt();
  const length = pkg.readInt();
  const depths = new Int16Array(length);
  for (let i = 0; i < length; i++) depths[i] = pkg.readShort();
  const total = pkg.readFloat();
  return {
    version,
    depths,
    total,
  };
}

export function write(data: Data): Uint8Array {
  const pkg = new PackageWriter();
  pkg.writeInt(data.version);
  pkg.writeInt(data.depths.length);
  for (const depth of data.depths) {
    pkg.writeShort(depth);
  }
  pkg.writeFloat(data.total);
  return deflate(pkg.flush(), { level: 1 })
}
