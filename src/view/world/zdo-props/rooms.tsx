import React, { useLayoutEffect, useRef } from 'react';

import type { ValueProps } from '../../parts/types';
import type { ZDO } from '../types';

import { stableHashCode as strHash } from '../../../model/utils';
import { roomHashes } from '../../../data/roomHashes';

export function RoomsComp({ value: zdo }: ValueProps<ZDO>) {
  const length = zdo.ints.get(strHash('rooms')) ?? 0;
  const rooms = [];
  for (let i = 0; i < length; i++) {
    const room = roomHashes.get(zdo.ints.get(strHash(`room${i}`))!)!;
    const pos = zdo.vec3.get(strHash(`room${i}_pos`))!;
    const rot = zdo.quats.get(strHash(`room${i}_rot`))!;
    rooms.push({ room, pos, rot });
  }
  return <React.Fragment key="rooms">
    <dt>items</dt>
    <dd>{rooms.length} rooms</dd>
  </React.Fragment>;
};