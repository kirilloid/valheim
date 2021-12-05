import { GAME_DAY } from './game';

// copied from .net

export const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(value, max));
export const clamp01 = (value: number) => clamp(value, 0, 1);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * clamp01(t);
export const lerpStep = (l: number, h: number, v: number) => clamp01((v - l) / (h - l));
export const smoothStep = (pMin: number, pMax: number, pX: number) => {
  const num = clamp01(((pX - pMin) / (pMax - pMin)));
  return (num * num * (3.0 - 2.0 * num));
};

export function stableHashCode(str: string): number {
  let a = 5381;
  let b = a;
  for (let index = 0; index < str.length; index += 2) {
    a = (a << 5) + a ^ str.charCodeAt(index);
    if (index === str.length - 1) break;
    b = (b << 5) + b ^ str.charCodeAt(index + 1);
  }
  return (a + Math.imul(b, 1566083941)) | 0;
}

const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
  }
  crcTable[n] = c;
}

export function crc32(str: string) {
  let crc = 0 ^ (-1);
  for (var i = 0; i < str.length; i++ ) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ str.charCodeAt(i)) & 0xFF]!;
  }
  return (crc ^ (-1)) | 0;
};

export type Vector3 = { x: number, y: number, z: number };
export const add = (a: Vector3, b: Vector3) => ({ x: a.x + b.x, y: a.y + b.y, z: a.z + b.z });
export const magnitude = (a: Vector3): number => Math.hypot(a.x, a.y, a.z);
export const norm = (a: Vector3, scale = 1) => {
  const size = magnitude(a);
  return size ? mul(a, scale / size) : a;
};
export const mul = (a: Vector3, m: number) => {
  return { x: a.x * m, y: a.y * m, z: a.z * m };
};

export type Vector2i = {
  x: number;
  y: number;
};

export type Quaternion = {
  x: number;
  y: number;
  z: number;
  w: number;
};

export const timeI2S = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  if (hours === 0) {
    return [
      String(minutes % 60).padStart(2, '0'),
      String(seconds % 60).padStart(2, '0'),
    ].join(':');  
  }
  return [
    String(hours),
    String(minutes % 60).padStart(2, '0'),
    String(seconds % 60).padStart(2, '0'),
  ].join(':');
};

export const days = (seconds: number) => seconds / GAME_DAY;

export const assertNever = (x: never): never => {
  console.error('unexpected value: %s', x);
  return undefined as never;
};

export const isNotNull = <T>(arg: T): arg is NonNullable<T> => arg != null;

export const isEmpty = (arg: Record<string, any>) => {
  for (var _ in arg) {
    return false;
  }
  return true;
};

export function filterValues<K extends string, T, RK extends K = K>(obj: Record<K, T>, fn: (arg: T, key: K) => boolean): Record<RK, T> {
  return Object.fromEntries(
    Object.entries(obj)
      .filter(([key, val]) => [key, fn(val as T, key as K)])
  ) as Record<RK, T>;
}

export function mapValues<K extends string, T, R = T>(obj: Record<K, T>, fn: (arg: T, key: K) => R): Record<K, R>;
export function mapValues<K extends string, T, R = T>(obj: Partial<Record<K, T>>, fn: (arg: T, key: K) => R): Partial<Record<K, R>>;
export function mapValues<K extends string, T, R = T>(obj: Partial<Record<K, T>>, fn: (arg: T, key: K) => R): Partial<Record<K, R>> {
  return Object.fromEntries(
    Object.entries(obj)
      .map(([key, val]) => [key, fn(val as T, key as K)])
  ) as Record<K, R>;
}

export function groupBy<T, K extends string = string, R = T>(arr: T[], keyFn: (arg: T) => K, valFn: (arg: T) => R): Record<K, R[]>;
export function groupBy<T, K extends string = string>(arr: T[], keyFn: (arg: T) => K): Record<K, T[]>;
export function groupBy<T, K extends string = string, R = T>(
  arr: T[],
  keyFn: (arg: T) => K,
  valFn?: (arg: T) => R,
): Record<K, R[]> {
  const result = {} as Record<K, R[]>;
  for (const el of arr) {
    const key = keyFn(el);
    (result[key] ?? (result[key] = [])).push((valFn ? valFn(el) : el) as R);
  }
  return result;
}

export class StatCounter {
  _min = 1e9;
  _max = -1e9;
  _total = 0;
  _num = 0;
  add(val: number) {
    this._min = Math.min(this._min, val);
    this._max = Math.max(this._max, val);
    this._total += val;
    this._num++;
  }
  get min() {
    return this._min;
  }
  get max() {
    return this._max;
  }
  get avg() {
    return this._total / this._num;
  }
}

export function addStatCounters(a: StatCounter, b: StatCounter): StatCounter {
  const result = new StatCounter();
  result._min = Math.min(a._min, b._min);
  result._max = Math.max(a._max, b._max);
  result._total = a._total + b._total;
  result._num = a._num + b._num;
  return result;
}

export async function wait(time: number) {
  return new Promise(resolve => setTimeout(resolve, time));
}

export function getMemUsage(): number {
  const mem = (performance as any).memory?.totalJSHeapSize ?? 0;
  return mem / 1024 ** 2;
}
