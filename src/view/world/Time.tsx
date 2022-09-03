import React, { useCallback, useState } from 'react';

import type { ValueProps } from '../parts/types';
import type { WorldData } from './types';

import { GAME_DAY } from '../../model/game';
import { getMaxTime } from '../../model/zdo-selectors';
import { assertNever, runGenerator, timeI2S } from '../../model/utils';

type ProgressState = {
  type: 'initial';
} | {
  type: 'progress';
  progress: number;
} | {
  type: 'final';
  result: number;
};

function showTime(time: number) {
  if (!isFinite(time)) return `Invalid time`;
  const day = Math.floor(time / GAME_DAY);
  const tod = Math.round(time / GAME_DAY % 1 * 24 * 60);
  const timeStr = timeI2S(tod);
  return `Day ${day} @ ${timeStr}`;
}

export function WorldTime({ value, onChange }: ValueProps<WorldData>) {
  const { netTime } = value;
  const [state, setState] = useState<ProgressState>({ type: 'initial' });
  const timeCompletelyOff = !isFinite(netTime) || netTime < 0 || netTime >= 1e9;
  const startScan = useCallback(() => {
    const gen = getMaxTime(value.zdo.zdos);
    runGenerator(gen, progress => setState({ type: 'progress', progress }))
                  .then(result => setState({ type: 'final', result }));
  }, [value]);

  return <div className="WorldEdit__Time">
    <h2>world time</h2>
    <p>{showTime(netTime)}</p>
    {(() => {
      switch (state.type) {
        case 'initial':
          return timeCompletelyOff
            ? <p>
                The time seems to be completely off.{' '}
                <button className="btn btn--primary" onClick={startScan}>Scan objects</button>{' '}
                to find correct time. 
              </p>
            : <p>
                The time seems to be OK, but you can still{' '}
                <button className="btn btn--primary" onClick={startScan}>check it</button>
              </p>
        case 'progress':
          return <>
            Checking&hellip;
            <progress value={state.progress} max={1} style={{ width: '100%' }} />
          </>
        case 'final': {
          const maxTime = state.result;
          const updateTime = () => onChange({ ...value, netTime: maxTime });
          const timeDiff = Math.abs(netTime - maxTime);
          return (!isFinite(netTime) || timeDiff > 1000)
            ? <p key="fix-time">
              The time is off{' '}
              <button className="btn btn--primary" onClick={updateTime}>Fix it</button>
            </p>
            : timeDiff > 10
            ? <p key="fix-time">
              The time is off by {Math.round(timeDiff)} seconds{' '}
              <button className="btn btn--primary" onClick={updateTime}>Fix it</button>
            </p>
            : <em>Verified</em>
        }
        default:
          return assertNever(state);
      }
    })()}
  </div>
}

