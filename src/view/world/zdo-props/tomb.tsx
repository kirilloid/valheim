import React, { useContext } from 'react';

import type { ValueProps } from '../../parts/types';
import type { ZDO } from '../types';
import type { PlayersData } from '../../../model/zdo-selectors';

import { stableHashCode } from '../../../model/hash';

import { TranslationContext } from '../../../effects';

const SPAWN_POINT_HASH = stableHashCode('SpawnPoint');
const OWNER_NAME_HASH = stableHashCode('ownerName');

export function TombComp({ value: zdo, playersData, onChange }: ValueProps<ZDO> & { playersData: PlayersData }) {
  const translate = useContext(TranslationContext);
  const name = zdo.strings.get(OWNER_NAME_HASH);

  const startPos = playersData.startLocation;
  const distance2 = (startPos.x - zdo.position.x) ** 2 + (startPos.z - zdo.position.z) ** 2;
  return <React.Fragment key="tomb">
    <dt>{translate('Player_tombstone')}</dt>
    <dd>{name} {distance2 > 100 && <button className="btn btn--sm" onClick={() => {
      const angle = Math.random() * Math.PI * 2;
      const returnPos = {
        x: startPos.x + 5 * Math.cos(angle),
        y: startPos.y,
        z: startPos.z + 5 * Math.sin(angle),
      }
      zdo.vec3.set(SPAWN_POINT_HASH, returnPos);
      zdo.position = returnPos;
      onChange(zdo);
    }}>Teleport to start location</button>}</dd>
  </React.Fragment>;
};