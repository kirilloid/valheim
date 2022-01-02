import type { MessageFromWorker, MessageToWorker } from './types';

export function generateTerrain(
  seed: number,
  side: number,
  iterations: number,
  onProgress: (data: MessageFromWorker) => void,
): () => void {
  const worker = new Worker('./worker.ts', { name: 'terrain', type: 'module' });

  function sendMessage(message: MessageToWorker) {
    worker.postMessage(message);
  }
    
  sendMessage({ seed, side, iterations });
  worker.addEventListener('message', (event: MessageEvent<MessageFromWorker>) => {
    const { data } = event;
    onProgress(data);
  });

  return () => worker.terminate();
}
