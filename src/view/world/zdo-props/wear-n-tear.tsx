import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import type { Piece } from '../../../types';
import type { ValueProps } from '../../parts/types';
import type { ZDO } from '../types';

import { stableHashCode as strHash } from '../../../model/hash';
import { getSupportColor } from '../../../model/color';

import { prefabHashes } from '../../../data/zdo';
import { data } from '../../../data/itemDB';
import { getStructuralIntegrity } from '../../../data/building';

import { TranslationContext } from '../../../effects';

const HEALTH_HASH = strHash('health');
const SUPPORT_HASH = strHash('support');

const BUILDING_SKILL_LEVEL_HASH = strHash('BuildingSkill Level');

function Support({ min, max, current }: { min: number; max: number; current?: number }) {
  const translate = useContext(TranslationContext);
  const value = current ?? max;
  const color = getSupportColor(min, max, current);
  const { x, y, z } = color;
  const colorStr = `rgb(${[x, y, z].map(c => Math.round(c * 255)).join(', ')})`;
  return <>
    <dt>{translate('ui.support')}</dt>
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
  const translate = useContext(TranslationContext);
  const id = prefabHashes.get(zdo.prefab);
  const pieceWear = id != null ? (data[id] as Piece | undefined)?.wear : undefined;
  const floats = zdo.floats;
  const material = pieceWear?.materialType;
  const support = material != null ? getStructuralIntegrity(material) : undefined;
  const maxHp = pieceWear?.hp ?? 200;
  const health = floats.get(HEALTH_HASH) ?? maxHp;
  const buildingSkill = floats.get(BUILDING_SKILL_LEVEL_HASH);

  return <React.Fragment key="WearNTear">
    <dt>{translate('ui.durability')}</dt>
    <dd>
      <input type="range"
        className="range"
        min={0}
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
    {buildingSkill != null && <>
      <dt><Link to="/skills/Building">{translate('ui.skillType.Building')}</Link></dt>
      <dd>{buildingSkill}</dd>
    </>}
  </React.Fragment>
}