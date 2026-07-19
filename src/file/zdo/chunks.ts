import { PackageReader, PackageWriter } from '../Package';
import type { Chunk } from '../chunks/chunk-save-mapping';
import {
  ChunkZero,
  fromChunkIndex,
  getChunkFilename,
  read as readChunkMapping,
  write as writeChunkMapping,
} from '../chunks/chunk-save-mapping';
import type { ZDO, ZDOData, ZDOID } from '../types';
import { read as readMeta, write as writeMeta } from '../fwl';
import { readZdo } from './mmap30';
import { getFirstFile } from '../files-wrapper';

export function readChunkData(bytes: Uint8Array, name = '', chunkIndex = ChunkZero): Chunk {
  const pkg = new PackageReader(bytes);
  const version = pkg.readShort();
  const num = pkg.readInt();
  const zdos: ZDO[] = [];
  for (let index = 0; index < num; ++index) {
    zdos.push(readZdo(pkg, version));
  }
  const info = { chunkIndex, version, numZDOs: zdos.length };
  return { zdos, name, info };
}

export function writeChunkData(chunk: Chunk): Uint8Array {
  const pkg = new PackageWriter();
  pkg.writeShort(chunk.info.version);
  pkg.writeInt(chunk.zdos.length);
  for (const zdo of chunk.zdos) zdo.save(pkg);
  return pkg.flush();
}

function writeOkFile(version: number): Uint8Array {
  const pkg = new PackageWriter();
  pkg.writeInt(version);
  return pkg.flush();
}

export async function read(source: Map<string, File>, version: number): Promise<ZDOData> {
  const [okFileName] = getFirstFile(source, name => name.endsWith('.ok'));
  const match = okFileName.match(/_main\.(\d+)\.ok/);
  if (!match) throw new Error('.ok file has wrong name');
  const revision = +match[1]!;
  const myid = BigInt(0);
  const nextUid = 1;
  const deadZdos = new Map<ZDOID, bigint>();

  const chunks = new Map<number, Chunk>();
  const file = source.get(`_main.${revision}.chunks`);
  if (!file) throw new Error('Error: LoadChunks failed to load index file');
  const buffer = await file.arrayBuffer();
  const metaFile = source.get(`_main.${revision}.fwl2`);
  const [mapping, totalZDOs] = readChunkMapping(new Uint8Array(buffer));
  for (const [chunkIndex, info] of mapping) {
    const name = getChunkFilename(info);
    if (!name) {
      const { chunk, size } = fromChunkIndex(chunkIndex);
      console.error(`Error: LoadChunks failed to load chunk: ${chunk}, size: ${size}, version: ${info.version}`);
    } else {
      const file = source.get(name);
      if (!file) throw new Error(`Error: LoadChunks failed to load chunk file: ${name}`);
      const buffer = await file.arrayBuffer();
      const chunk = readChunkData(new Uint8Array(buffer), name, chunkIndex);
      chunks.set(chunkIndex, chunk);
    }
  }
  return {
    myid,
    nextUid,
    revision,
    meta: metaFile && readMeta(new Uint8Array(await metaFile.arrayBuffer())),
    deadZdos,
    corruptions: [],
    totalZDOs,
    chunks,
    _checked: false,
  };
}

// chunks: ChunkMapping,
// objectsByChunk: Map<ChunkIndex, ZDO[]>,
export function write(
  files: Map<string, Uint8Array>,
  version: number,
  { chunks, revision, meta }: ZDOData,
) {
  for (const chunk of chunks.values()) {
    files.set(chunk.name, writeChunkData(chunk));
  }
  const mapping = new Map([...chunks.entries()].map(([index, { info }]) => [index, info]))
  files.set(`_main.${revision}.chunks`, writeChunkMapping(mapping));
  files.set(`_main.${revision}.ok`, writeOkFile(version));
  if (meta) {
    files.set(`_main.${revision}.fwl2`, writeMeta(meta));
  }
}