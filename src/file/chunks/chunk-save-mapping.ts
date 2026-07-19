import { PackageReader, PackageWriter } from "../Package";
import type { ZDO } from "../types";

export type ChunkIndex = number;
export function toChunkIndex(chunk: number, size: number): ChunkIndex {
  return (size << 16) | chunk;
}
export function fromChunkIndex(chunkIndex: ChunkIndex) {
  return { chunk: chunkIndex & 0xFFFF, size: chunkIndex >> 16 };
}

interface ChunkInfo {
  readonly chunkIndex: ChunkIndex;
  version: number; // uint
  numZDOs: number; // int
  // sizeChanged: boolean;
}

export interface Chunk {
  name: string;
  zdos: ZDO[];
  info: ChunkInfo;
}

export type ChunkMapping = Map<ChunkIndex, ChunkInfo>;
export const ChunkZero: ChunkIndex = 0;
export const ChunkPortal: ChunkIndex = 1;

export function getChunkFilename(chunkInfo: ChunkInfo): string {
  const { version, chunkIndex } = chunkInfo;
  const { chunk, size } = fromChunkIndex(chunkIndex);
  const hi = (chunk >> 8).toString(16).padStart(2, '0');
  const lo = (chunk & 255).toString(16).padStart(2, '0');
  return `${hi}_${lo}__${size}_${version}.chunk`;
}

export function read(bytes: Uint8Array): [ChunkMapping, number] {
  const pkg = new PackageReader(bytes);
  pkg.readUShort(); // sub-version?
  const totalZDOs = pkg.readInt();
  const length = pkg.readInt();
  const chunks: ChunkMapping = new Map();
  for (let index = 0; index < length; ++index) {
    const chunk = pkg.readUShort();
    const size = pkg.readByte();
    const version = pkg.readUInt();
    const numZDOs = pkg.readInt();
    const chunkIndex = toChunkIndex(chunk, size);
    chunks.set(chunkIndex, { chunkIndex, version, numZDOs });
  }
  let summedZDOs = 0;
  for (const { numZDOs } of chunks.values()) {
    summedZDOs += numZDOs;
  }
  if (totalZDOs !== summedZDOs) {
    console.error(`ZDO number mismatch. Expected: ${totalZDOs}. Actual: ${summedZDOs}`)
  }
  return [chunks, totalZDOs];
}

export function write(chunks: ChunkMapping): Uint8Array {
  const pkg = new PackageWriter();
  let totalZDOs = 0;
  for (const { numZDOs } of chunks.values()) {
    totalZDOs += numZDOs;
  }
  pkg.writeShort(40);
  pkg.writeInt(totalZDOs);
  pkg.writeInt(chunks.size);
  for (const { chunkIndex, version, numZDOs } of chunks.values()) {
    const { chunk, size } = fromChunkIndex(chunkIndex);
    pkg.writeUInt(chunk);
    pkg.writeByte(size);
    pkg.writeUInt(version);
    pkg.writeInt(numZDOs);
  }
  
  return pkg.flush();
}
