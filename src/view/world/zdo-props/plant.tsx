import React from 'react';

import type { ValueProps } from '../../parts/types';
import type { ZDO } from '../types';

import { stableHashCode as hash } from '../../../model/hash';
import { random } from '../../../model/random';
import { lerp, lerpStep } from '../../../model/utils';
import { ticksToSeconds } from '../../../file/zdo/time';

import { prefabHashes } from '../../../data/zdo';
import { data } from '../../../data/itemDB';

function getGrowTime(zdo: ZDO) {
  const hash = prefabHashes.get(zdo.prefab);
  const obj = hash != null ? data[hash] : undefined;
  const growTime = (obj != null && 'Plant' in obj && obj.Plant?.growTime) || [3000, 5000];

  const state = random.getState();
  const seed = Number(BigInt(zdo.id.id) + zdo.id.userId) << 0;
  random.init(seed);
  const t = random.random();
  random.setState(state);
  return lerp(growTime[0], growTime[1], t);
}

const PLANT_TIME_HASH = hash('plantTime');

export function PlantComp({ value: zdo, time }: ValueProps<ZDO> & { time: number }) {
  const growTime = getGrowTime(zdo);
  
  const plantTimeTicks = zdo.longs.get(PLANT_TIME_HASH) ?? BigInt(0);
  const plantTime = ticksToSeconds(plantTimeTicks);

  const growPercent = lerpStep(plantTime, plantTime + growTime, time);

  return <>
    <dt>grown</dt>
    <dd>{Math.round(growPercent * 100)}%</dd>
  </>;
}