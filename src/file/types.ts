import type { Quaternion, Vector2i, Vector3 } from '../model/utils';
import type { PackageWriter } from './Package';

export type ZDOID = {
  userId: bigint; // long
  id: number; // uint
};

export type ZDOData = {
  myid: bigint; // long
  nextUid: number; // uint
  zdos: ZDO[];
  deadZdos: Map<ZDOID, bigint>;
  corruptions: ZDOCorruption[];
};

enum ZDOObjectType {
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
}

export interface ZDO {
  id: ZDOID;
  ownerRevision: number;
  dataRevision: number;
  persistent: boolean;
  owner: bigint;
  // ms timestamp?
  timeCreated: bigint;
  pgwVersion: number;
  type: ZDOObjectType;
  distant: boolean;
  prefab: number;
  sector: Vector2i;
  position: Vector3;
  rotation: Quaternion;
  readonly floats: Map<number, number>; // int -> float
  readonly vec3: Map<number, Vector3>; // int -> Vector3
  readonly quats: Map<number, Quaternion>; // int -> Quaternion
  readonly ints: Map<number, number>; // int -> int
  readonly longs: Map<number, bigint>; // int -> long
  readonly strings: Map<number, string>; // int -> string
  readonly byteArrays: Map<number, Uint8Array>; // int -> byte[]
  readonly offset: number;
  save(writer: PackageWriter): void;
}
