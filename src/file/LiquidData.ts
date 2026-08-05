import { deflate, inflate } from '../model/fflate';
import { PackageReader, PackageWriter } from './Package';
import { checkVersion, LIQUID } from './versions';

export type Data = {
  version: number;
  depths: Int16Array;
  total: number;
};

export async function read(zbytes: Uint8Array<ArrayBuffer>): Promise<Data> {
  const bytes = await inflate(zbytes);
  const pkg = new PackageReader(bytes);
  // read
  const version = pkg.readInt();
  checkVersion('liquid', version, LIQUID);
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

export async function write(data: Data): Promise<Uint8Array<ArrayBuffer>> {
  const pkg = new PackageWriter();
  pkg.writeInt(data.version);
  pkg.writeInt(data.depths.length);
  for (const depth of data.depths) {
    pkg.writeShort(depth);
  }
  pkg.writeFloat(data.total);
  return await deflate(pkg.flush(), { level: 1 });
}
