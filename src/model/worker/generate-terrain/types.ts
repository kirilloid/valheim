export type MessageFromWorker = {
  progress: number;
  x: number;
  y: number;
  width: number;
  height: number;
  buffer: ArrayBuffer;
};

export type MessageToWorker = {
  seed: number;
  side: number;
  iterations: number;
};
