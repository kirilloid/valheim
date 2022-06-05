import type { Vector3 } from '../model/utils';

export function diffLast<T>(_: T, v2: T): T {
  return v2;
}

export function diffPrimitive<T extends string | number | bigint>(v1: T, v2: T): T | undefined {
  return v1 === v2 ? undefined : v2;
}

export function diffWithUndefined<D, T extends D>(diffValue: (v1: T, v2: T) => D | undefined) {
  return function(v1: T | undefined, v2: T | undefined): D | undefined | null {
    if (v1 === undefined) return v2;
    if (v2 === undefined) return null;
    return diffValue(v1, v2);
  }
}

export const diffPrimitiveU = diffWithUndefined(diffPrimitive);

export function diffVector3(v1: Vector3, v2: Vector3): Vector3 | undefined {
  return (v1.x === v2.x && v1.y === v2.y && v1.z === v2.z) ? undefined : v2;
}

export const diffVector3U = diffWithUndefined(diffVector3);

export function diffArray<T extends string | number | bigint>(v1: T[], v2: T[]): T[] & { cleared?: boolean } {
  if (v2.length >= v1.length && v1.every((v, i) => v === v2[i])) {
    return v2.slice(v1.length);
  }
  return Object.assign(v2, { cleared: true });
}

export function diffMap<V, D = V>(
  diffValue: (v1: V | undefined, v2: V | undefined) => D | null | undefined
) {
  return function<K>(m1: Map<K, V>, m2: Map<K, V>): Map<K, D | null> {
    const result = new Map<K, D | null>();
    const keys = new Set([...m1.keys(), ...m2.keys()]);
    for (const key of keys) {
      const d = diffValue(m1.get(key), m2.get(key));
      if (d !== undefined) result.set(key, d);
    }
    return result;
  }
}

export function createDiffer<D extends Object, V extends D>(mapping: {
 [K in keyof D]: (v1: V[K], v2: V[K]) => D[K] 
}) {
  return function(v1: V, v2: V): D {
    const result = {} as D;
    for (const [key, value] of Object.entries(v2)) {
      (result as any)[key] = (mapping as any)[key]((v1 as any)[key], value);
    }
    return result;
  }
}