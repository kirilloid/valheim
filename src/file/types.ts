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
  index: number;
};

export interface ZDO {
  // id: ZDOID;
  _bytes: Uint8Array;
  // ownerRevision: number;
  // dataRevision: number;
  persistent: boolean;
  // owner: bigint;
  // timeCreated: bigint;
  // pgwVersion: number;
  type: ZDOObjectType;
  distant: boolean;
  prefab: number;
  sector: Readonly<Vector2i>;
  position: Readonly<Vector3>;
  rotation: Readonly<Vector3>;
  readonly floats: Map<number, number>; // int -> float
  readonly vec3: Map<number, Vector3>; // int -> Vector3
  readonly quats: Map<number, Quaternion>; // int -> Quaternion
  readonly ints: Map<number, number>; // int -> int
  readonly longs: Map<number, bigint>; // int -> long
  readonly strings: Map<number, string>; // int -> string
  readonly byteArrays: Map<number, Uint8Array>; // int -> byte[]
  readonly _offset: number;
  save(writer: PackageWriter): void;
}
