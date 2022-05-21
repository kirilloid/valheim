import React from 'react';

import type { Piece } from '../../../types';
import type { ValueProps } from '../../parts/types';
import type { ZDO } from '../types';

import { stableHashCode as strHash } from '../../../model/hash';

import { prefabHashes } from '../../../data/zdo';
import { data } from '../../../data/itemDB';
import { getStructuralIntegrity } from '../../../data/building';
import { getSupportColor } from '../../../model/color';

const HEALTH_HASH = strHash('health');
const SUPPORT_HASH = strHash('support');

function Support({ min, max, current }: { min: number; max: number; current?: number }) {
  const value = current ?? max;
  const color = getSupportColor(min, max, current);
  const colorStr = `rgb(${Math.round(color.x * 255)}, ${Math.round(color.y * 255)}, ${Math.round(color.z * 255)})`;
  return <>
    <dt>support</dt>
    <dd><div style={{
      display: 'inline-block',
      verticalAlign: 'top',
      width: '1.5em',
      height: '1.5em',
      backgroundColor: colorStr,
    }} /> {Math.round(value)}</dd>
  </>
}

export function WearNTearComp({ value: zdo, onChange }: ValueProps<ZDO>) {
  const id = prefabHashes.get(zdo.prefab);
  const pieceWear = id != null ? (data[id] as Piece | undefined)?.wear : undefined;
  const floats = zdo.floats;
  const material = pieceWear?.materialType;
  const support = material != null ? getStructuralIntegrity(material) : undefined;
  const maxHp = pieceWear?.hp ?? 200;
  const health = floats.get(HEALTH_HASH) ?? maxHp;
  return <React.Fragment key="WearNTear">
    <dt>health</dt>
    <dd>
      <input type="range"
        min="0"
        max={maxHp}
        value={health}
        onChange={e => {
          floats.set(HEALTH_HASH, Number(e.target.value));
          onChange(zdo);
        }} />
        {' '}
        <span style={{ verticalAlign: 'top' }}>{Math.round(health)}</span>
    </dd>
    {support && <Support min={support.minSupport} max={support.maxSupport} current={floats.get(SUPPORT_HASH)} />}
  </React.Fragment>
}