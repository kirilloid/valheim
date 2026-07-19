import type { Quaternion, Vector3 } from '../model/utils';
import type { WorldMeta } from '../view/world/types';
import type { Chunk, ChunkIndex } from './chunks/chunk-save-mapping';
import type { PackageWriter } from './Package';

export type ZDOID = {
  userId: bigint; // long
  id: number; // uint
};

export type ZDODataLike = {
  revision: number;
  totalZDOs: number;
  chunks: Map<ChunkIndex, { zdos: ZDO[]; info?: { chunkIndex: ChunkIndex; version: number; numZDOs: number } }>;
  corruptions?: ZDOCorruption[];
  _checked?: boolean;
};

export type ZDOData = {
  myid: bigint; // long
  nextUid: number; // uint
  revision: number;
  totalZDOs: number;
  meta?: WorldMeta;
  chunks: Map<ChunkIndex, Chunk>;
  deadZdos: Map<ZDOID, bigint>;
  corruptions: ZDOCorruption[];
  _checked: boolean;
};

export enum ZDOObjectType {
  Default,
  Prioritized,
  Solid,
  Terrain,
};

export enum Mistake {
  None,
  CoordinatesInconsistent,
  CoordinatesTooFar,
  TimeInFuture,
  DropExplosion,
  ContainerStuck,
  UnreadData,
  UTFException,
  RangeException,
  GenericException,
  ImpossibleError,
}

export enum MistakeLevel {
  OK = 0,
  NOTICE = 1,
  WARNING = 2,
  ERROR = 3,
}

export type ZDOCorruption = {
  mistake: Mistake;
  offset: number;
  chunkId: number;
  index: number;
};

export interface ZDOValues {
  // id: ZDOID;
  version: number;
  // ownerRevision: number;
  // dataRevision: number;
  persistent: boolean;
  // owner: bigint;
  // timeCreated: bigint;
  // pgwVersion: number;
  type: ZDOObjectType;
  distant: boolean;
  prefab: number;
  readonly connectionData?: { type: number; hash: number };
  readonly sector: number;
  position: Readonly<Vector3>;
  rotation: Readonly<Vector3>;
  readonly floats: Map<number, number>; // int -> float
  readonly vec3: Map<number, Vector3>; // int -> Vector3
  readonly quats: Map<number, Quaternion>; // int -> Quaternion
  readonly ints: Map<number, number>; // int -> int
  readonly longs: Map<number, bigint>; // int -> long
  readonly strings: Map<number, string>; // int -> string
  readonly byteArrays: Map<number, Uint8Array>; // int -> byte[]
}

export interface ZDO extends ZDOValues {
  readonly _bytes: Readonly<Uint8Array>;
  readonly _offset: number;
  save(writer: PackageWriter): void;
}

// Helpers for working with chunked ZDO storage
export function* iterateZdos(zdoData: ZDODataLike): Generator<ZDO, void, unknown> {
  for (const { zdos } of zdoData.chunks.values()) {
    for (const zdo of zdos) yield zdo;
  }
}

export function zdosCount(zdoData: ZDODataLike): number {
  let c = 0;
  for (const { zdos } of zdoData.chunks.values()) c += zdos.length;
  return c;
}

type ZDOAddress = { chunkId: number, index: number }

export function getZdoInChunk(zdoData: ZDODataLike, { chunkId, index }: ZDOAddress): ZDO | undefined {
  return zdoData.chunks.get(chunkId)?.zdos[index];
}

export function removeZdoAtChunkIndex<T extends ZDODataLike>(zdoData: T, { chunkId, index }: ZDOAddress): T {
  const chunk = zdoData.chunks.get(chunkId);
  if (chunk == null) return zdoData;
  if (index < 0 || index >= chunk.zdos.length) return zdoData;

  const chunks = new Map(zdoData.chunks);
  const zdos = chunk.zdos.filter((_, i) => i === index);
  const nextChunk = { ...chunk, zdos };
  chunks.set(chunkId, nextChunk);

  return {
    ...zdoData,
    totalZDOs: zdoData.totalZDOs - 1,
    chunks,
  } as T;
}

export function removeZdosAtChunkIndices<T extends ZDODataLike>(zdoData: T, deletions: { chunkId: number; indexInChunk: number }[]): T {
  if (deletions.length === 0) return zdoData;
  // group deletions by chunk
  const byChunk = new Map<number, Set<number>>();
  for (const { chunkId, indexInChunk } of deletions) {
    let s = byChunk.get(chunkId);
    if (s == null) {
      s = new Set();
      byChunk.set(chunkId, s);
    }
    s.add(indexInChunk);
  }

  const chunks = new Map(zdoData.chunks);
  let totalRemoved = 0;
  for (const [chunkId, indicesSet] of byChunk.entries()) {
    const chunk = zdoData.chunks.get(chunkId);
    if (chunk == null) continue;
    const newZdos = chunk.zdos.filter((_, i) => !indicesSet.has(i));
    const removed = chunk.zdos.length - newZdos.length;
    if (removed === 0) continue;
    totalRemoved += removed;
    const nextInfo = chunk.info ?? { chunkIndex: chunkId, version: 0, numZDOs: newZdos.length };
    chunks.set(chunkId, { ...chunk, zdos: newZdos, info: { ...nextInfo, numZDOs: nextInfo.numZDOs - removed } });
  }
  return {
    ...zdoData,
    totalZDOs: zdoData.totalZDOs - totalRemoved,
    chunks,
  } as T;
}

// Ensure named exports are visible to TypeScript resolution
// (named exports are provided by the function declarations above)
