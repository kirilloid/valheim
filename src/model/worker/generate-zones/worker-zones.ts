import type { MessageFromWorker, MessageToWorker } from './types';

import { assertNever, wait } from '../../utils';
import { WorldGenerator } from '../../world-generator';
import { ZoneSystem, RegisteredLocation } from '../../zone-system';

/* eslint-disable no-restricted-globals */
const ctx: Worker = self as any;

function sendMessage(message: MessageFromWorker) {
  ctx.postMessage(message);
}

function setProgress(progress: number) {
  sendMessage({ type: 'progress', progress });
}

let gen: Generator<number, RegisteredLocation[], void>;

async function generateZones(seed: number) {
  const world = new WorldGenerator(seed);
  const zone = new ZoneSystem(world);

  gen = zone.generateLocations(seed);
  let item: IteratorResult<number, RegisteredLocation[]>;

  while (!(item = gen.next()).done) {
    setProgress(item.value);
    await wait(4);
  };
  const leviathans = zone._getLeviathans(seed);
  sendMessage({ type: 'data', locations: item.value, leviathans });
}

ctx.addEventListener('message', async (event: MessageEvent) => {
  const data: MessageToWorker = event.data;
  switch (data.type) {
    case 'generate':
      generateZones(data.seed);
      break;
    default:
      return assertNever(data.type);
  }
});

export {};
