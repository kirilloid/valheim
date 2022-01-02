import React from 'react';

import type { Piece } from '../../../types';
import type { ValueProps } from '../../parts/types';
import type { ZDO } from '../types';

import { stableHashCode as strHash } from '../../../model/utils';

import { objects } from '../../../data/zdo';
import { data } from '../../../data/itemDB';
import { getStructuralIntegrity } from '../../../data/building';

const HEALTH_HASH = strHash('health');
const SUPPORT_HASH = strHash('support');

export function WearNTearComp({ value: zdo, onChange }: ValueProps<ZDO>) {
  const id = objects.get(zdo.prefab);
  const pieceWear = id != null ? (data[id] as Piece | undefined)?.wear : undefined;
  const floats = zdo.floats;
  const material = pieceWear?.materialType;
  const support = material != null ? getStructuralIntegrity(material) : undefined;
  const maxHp = pieceWear?.hp ?? 100;
  return <React.Fragment key="WearNTear">
    <dt>health</dt>
    <dd>
      <input type="number"
        min="0"
        max={maxHp}
        placeholder={String(maxHp)}
        value={floats.get(HEALTH_HASH) ?? ''}
        onChange={e => {
          floats.set(HEALTH_HASH, Number(e.target.value));
          onChange(zdo);
        }} />
    </dd>
    {support != null && <>
      <dt>support</dt>
      <dd>
        <input type="number"
          min={support.minSupport}
          max={support.maxSupport}
          placeholder={String(support.maxSupport)}
          value={floats.get(SUPPORT_HASH) ?? ''}
          onChange={e => {
            floats.set(SUPPORT_HASH, Number(e.target.value));
            onChange(zdo);
          }} />
      </dd>
    </>}
  </React.Fragment>
}