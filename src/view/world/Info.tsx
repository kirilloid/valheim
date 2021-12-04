import React, { useState } from 'react';

import type { ValueProps } from '../parts/types';
import type { WorldData } from './types';
import { GAME_DAY } from '../../model/game';

import { timeI2S } from '../../model/utils';
import { RandomEvents } from './RandomEvents';
import { ZoneSystem } from './ZoneSystem';
import { ZdoData } from './ZdoData';

function showTime(time: number) {
  const day = Math.floor(time / GAME_DAY);
  const tod = Math.round(time / GAME_DAY % 1 * 24 * 60);
  const timeStr = timeI2S(tod);
  return `Day ${day} @ ${timeStr}`;
}

export function WorldInfo({ value, onChange, fileName }: ValueProps<WorldData> & { fileName: string }) {
  const { netTime, randEvent, zdo, version, zoneSystem } = value;
  const [corrupted, setCorrupted] = useState(0);
  if (zdo.corruptions.length !== corrupted) {
    setCorrupted(zdo.corruptions.length);
    onChange(value);
  }
  return <div>
    <h1>World</h1>
    <p>{fileName} (v{version})</p>
    <h2>Time</h2>
    <dl>
      <dt>world time</dt><dd>{showTime(netTime)}</dd>
      {randEvent != null && <RandomEvents value={randEvent} />}
    </dl>
    {zoneSystem != null && <>
      <ZoneSystem value={zoneSystem} onChange={zoneSystem => onChange({ ...value, zoneSystem })} />
    </>}
    <h2>Game objects</h2>
    {corrupted > 0 && <div className="error">Corrupted: {corrupted}</div>}
    <ZdoData value={zdo} />
  </div>
}
