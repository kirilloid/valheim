import React from 'react';

import type { PhysicalObject } from '../../../types';
import type { ValueProps } from '../../parts/types';
import type { ZDO } from '../types';

import { stableHashCode as hash } from '../../../model/hash';
import { clamp } from '../../../model/utils';
import { ticksToSeconds } from '../../../file/zdo/time';

import { data } from '../../../data/itemDB';
import { showNumber } from '../../helpers';

const LAST_TIME_HASH = hash('lastTime');
const LEVEL_HASH = hash('level');

export function ResourceRootComp({ value: zdo, time }: ValueProps<ZDO> & { time: number }) {
  const obj = data[zdo.prefab];
  const ResourceRoot = (obj as PhysicalObject).ResourceRoot ?? {
    maxLevel: 100,
    highThreshold: 50,
    emptyTreshold: 10,
    regenPerSec: 1,
  }; // values come from default ResourceRoot.cs, but should actually never be used
  const lastTime = zdo.longs.get(LAST_TIME_HASH);
  const dt = lastTime == null ? 0 : (time - ticksToSeconds(lastTime));
  const lastLevel = zdo.floats.get(LEVEL_HASH) ?? ResourceRoot.maxLevel;
  const currentLevel = clamp(lastLevel + ResourceRoot.regenPerSec * dt, 0, ResourceRoot.maxLevel);
  
  return <>
    <dt>level</dt>
    <dd>
      {showNumber(currentLevel)} / {ResourceRoot.maxLevel}
      {/* {currentLevel > ResourceRoot.highThreshold && ' (high)'}
      {currentLevel < ResourceRoot.emptyTreshold && ' (low)'} */}
    </dd>
  </>;
}
