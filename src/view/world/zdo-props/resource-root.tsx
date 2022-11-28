import React from 'react';

import type { ValueProps } from '../../parts/types';
import type { ZDO } from '../types';

import { stableHashCode as hash } from '../../../model/hash';
import { clamp } from '../../../model/utils';
import { ticksToSeconds } from '../../../file/zdo/time';
import { showNumber } from '../../helpers';

const CONFIG = {
  maxLevel: 50,
  highThreshold: 40,
  emptyTreshold: 5,
  regenPerSec: 0.0025,
  fullColor: [255, 255, 255],
  emptyColor: [36, 36, 36],
};

const LAST_TIME_HASH = hash('lastTime');
const LEVEL_HASH = hash('level');

export function ResourceRootComp({ value: zdo, time }: ValueProps<ZDO> & { time: number }) {
  const lastTime = zdo.longs.get(LAST_TIME_HASH);
  const dt = lastTime == null ? 0 : (time - ticksToSeconds(lastTime));
  const lastLevel = zdo.floats.get(LEVEL_HASH) ?? CONFIG.maxLevel;
  const currentLevel = clamp(lastLevel + CONFIG.regenPerSec * dt, 0, CONFIG.maxLevel);
  
  return <>
    <dt>level</dt>
    <dd>
      {showNumber(currentLevel)} / {CONFIG.maxLevel}
      {/* {currentLevel > CONFIG.highThreshold && ' (high)'}
      {currentLevel < CONFIG.emptyTreshold && ' (low)'} */}
    </dd>
  </>;
}
