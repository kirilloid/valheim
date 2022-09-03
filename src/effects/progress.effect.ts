import { useState } from 'react';
import { runGenerator } from '../model/utils';

export type ProgressState<T> = {
  type: 'initial';
} | {
  type: 'progress';
  progress: number;
} | {
  type: 'final';
  result: T;
};

export function useProgressState<T>(): [
  ProgressState<T>,
  (gen: Generator<number, T, void>, onComplete?: (res: T) => void) => void,
] {
  const [state, setState] = useState<ProgressState<T>>({ type: 'initial' });
  return [
    state,
    (gen, onComplete) => runGenerator(gen,
        progress => setState({ type: 'progress', progress }))
    .then(result => {
      setState({ type: 'final', result });
      onComplete?.(result);
    }),
  ];
}
