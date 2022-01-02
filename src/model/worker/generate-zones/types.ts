import type { RegisteredLocation } from '../../zone-system';

export type MessageFromWorker = {
  type: 'progress';
  progress: number;
} | {
  type: 'data';
  locations: RegisteredLocation[];
};

export type MessageToWorker = {
  type: 'generate';
  seed: number;
};
