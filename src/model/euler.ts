import type { Vector3, Quaternion } from './utils';

// source: https://en.wikipedia.org/wiki/Conversion_between_quaternions_and_Euler_angles

export function fromEulerAngles(v: Vector3): Quaternion {
  const cr = Math.cos(v.x * 0.5);
  const sr = Math.sin(v.x * 0.5);
  const cp = Math.cos(v.y * 0.5);
  const sp = Math.sin(v.y * 0.5);
  const cy = Math.cos(v.z * 0.5);
  const sy = Math.sin(v.z * 0.5);

  const w = cr * cp * cy + sr * sp * sy;
  const x = sr * cp * cy - cr * sp * sy;
  const y = cr * sp * cy + sr * cp * sy;
  const z = cr * cp * sy - sr * sp * cy;

  return { x, y, z, w };
}

export function toEulerAngles(q: Quaternion): Vector3 {
  // roll (x-axis rotation)
  const sinr_cosp = 2 * (q.w * q.x + q.y * q.z);
  const cosr_cosp = 1 - 2 * (q.x * q.x + q.y * q.y);
  const x = Math.atan2(sinr_cosp, cosr_cosp);

  // pitch (y-axis rotation)
  const  sinp = Math.sqrt(1 + 2 * (q.w * q.y - q.x * q.z));
  const  cosp = Math.sqrt(1 - 2 * (q.w * q.y - q.x * q.z));
  const y = 2 * Math.atan2(sinp, cosp) - Math.PI / 2;

  // yaw (z-axis rotation)
  const  siny_cosp = 2 * (q.w * q.z + q.x * q.y);
  const  cosy_cosp = 1 - 2 * (q.y * q.y + q.z * q.z);
  const z = Math.atan2(siny_cosp, cosy_cosp);

  return { x, y, z };
}

