import type { RegisteredLocation } from '../../zone-system';
import type { MessageFromWorker, MessageToWorker } from './types';
import { assertNever } from '../../utils';

export function generateZones(
  seed: number,
  onProgress: (progress: number) => void,
  onComplete: (locations: RegisteredLocation[]) => void,
): () => void {
  const worker = new Worker('./worker.ts', { name: 'locations', type: 'module' });

  function sendMessage(message: MessageToWorker) {
    worker.postMessage(message);
  }
    
  sendMessage({ type: 'generate', seed });
  worker.addEventListener('message', (event: MessageEvent<MessageFromWorker>) => {
    const { data } = event;
    switch (data.type) {
      case 'progress':
        onProgress(data.progress);
        break;
      case 'data':
        onComplete(data.locations);
        break;
      default:
        return assertNever(data);
    }
  });

  return () => worker.terminate();
}
