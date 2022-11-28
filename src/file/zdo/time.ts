const SCALE = 1e7; // .net uses 100ns ticks
export const ticksToSeconds = (ticks: BigInt) => Number(ticks) / SCALE;
export const secondsToTicks = (seconds: number) => BigInt(seconds * SCALE);
