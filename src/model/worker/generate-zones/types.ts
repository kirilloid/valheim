import type { Vector3 } from '../../utils';
import type { RegisteredLocation } from '../../zone-system';

export type MessageFromWorker = {
  type: 'progress';
  progress: number;
} | {
  type: 'data';
  locations: RegisteredLocation[];
  leviathans: Vector3[];
};

export type MessageToWorker = {
  type: 'generate';
  seed: number;
};
