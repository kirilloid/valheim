import React from 'react';

import type { ValueProps } from '../../parts/types';
import type { ZDO } from '../types';

import { readRooms } from '../../../file/zdo/rooms';

export function RoomsComp({ value: zdo }: ValueProps<ZDO>) {
  const rooms = readRooms(zdo);

  return <React.Fragment key="rooms">
    <dt>items</dt>
    <dd>{rooms.length} rooms</dd>
  </React.Fragment>;
};