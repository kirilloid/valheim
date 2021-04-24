export const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(value, max));
export const clamp01 = (value: number) => clamp(value, 0, 1);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * clamp01(t);
export const lerpStep = (l: number, h: number, v: number) => clamp01((v - l) / (h - l));

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

export const timeI2S = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  return [
    String(hours),
    String(minutes % 60).padStart(2, '0'),
    String(seconds % 60).padStart(2, '0'),
  ].join(':');
};

export const assertNever = (x: never): never => {
  console.error('unexpected value: %s', x);
  return undefined as never;
}
