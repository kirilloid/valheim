import React from 'react';

import type { ValueProps } from '../../parts/types';
import type { ZDO } from '../types';

import { stableHashCode as strHash } from '../../../model/hash';
import { roomHashes } from '../../../data/roomHashes';
import { PackageReader } from '../../../file/Package';

const ROOM_DATA_HASH = strHash('roomData');

function readFromByteArray(data: Uint8Array) {
  const reader = new PackageReader(data);
  return reader.readArray(function() {
    const hash = this.readInt();
    const pos = this.readVector3();
    const rot = this.readQuaternion();
    const room = roomHashes.get(hash);
    return { room, hash, pos, rot };
  });
}

function readFromProps(zdo: ZDO) {
  const length = zdo.ints.get(strHash('rooms')) ?? 0;
  const rooms = [];
  
  for (let i = 0; i < length; i++) {
    const name = `room${i}`;
    const hash = zdo.ints.get(strHash(name))!;
    const room = roomHashes.get(hash)!;
    const pos = zdo.vec3.get(strHash(`${name}_pos`))!;
    const rot = zdo.quats.get(strHash(`${name}_rot`))!;
    const seed = zdo.ints.get(strHash(`${name}_seed`))!;
    rooms.push({ room, hash, pos, rot, seed });
  }
  return rooms;
}

export function readRooms(zdo: ZDO) {
  const ba = zdo.byteArrays.get(ROOM_DATA_HASH);
  return ba != null
    ? readFromByteArray(ba)
    : readFromProps(zdo);  
}

export function RoomsComp({ value: zdo }: ValueProps<ZDO>) {
  const rooms = readRooms(zdo);

  return <React.Fragment key="rooms">
    <dt>items</dt>
    <dd>{rooms.length} rooms</dd>
  </React.Fragment>;
};