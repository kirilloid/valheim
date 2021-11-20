import React, { useContext } from 'react';

import type { Vector3 } from '../../model/utils';
import type { PlayerData } from './types';

import { TranslationContext } from '../../effects';
import { ValueProps } from '../parts/types';

function Color({ value, onChange }: ValueProps<Vector3>) {
  const { x, y, z } = value;
  const color = '#' + [x, y, z].map(
    r => Math.round(r * 255)
      .toString(16)
      .padStart(2, '0')
  ).join('');
  return <input type="color" value={color} onChange={e => {
    const rgb = e.target.value.match(/[a-f0-9]{2}/g);
    if (!rgb) return;
    const [x, y, z] = rgb.map(v => parseInt(v, 16) / 255);
    onChange({ x: x!, y: y!, z: z! });
  }} />;
}

const MODELS = ['MALE', 'FEMALE'];
const beards = ['Beard1', 'Beard2', 'Beard3', 'Beard4', 'Beard5', 'Beard6', 'Beard7', 'Beard8', 'Beard9', 'Beard10', 'BeardNone'];
const hairs = ['Hair1', 'Hair2', 'Hair3', 'Hair4', 'Hair5', 'Hair6', 'Hair7', 'Hair8', 'Hair9', 'Hair10', 'Hair11', 'Hair12', 'Hair13', 'Hair14', 'HairNone'];

export function Appearance({ value, onChange } : ValueProps<PlayerData>) {
  const translate = useContext(TranslationContext);
  return <dl>
    <dt>model</dt>
    <dd>{MODELS[value.modelIndex]}</dd>
    <dt>{translate('char.beard')}</dt>
    <dd>
      <select value={value.beardItem}
        onChange={e => onChange({ ...value, beardItem: e.target.value })}>
        <option value="">—</option>
        {beards.map(id =>
          <option key={id} value={id}> {translate(`char.beard.${id}`)} </option>
        )}
      </select>
    </dd>
    <dt>{translate('char.hair')}</dt>
    <dd>
      <select value={value.hairItem}
        onChange={e => onChange({ ...value, hairItem: e.target.value })}>
        <option value="">—</option>
        {hairs.map(id =>
          <option key={id} value={id}> {translate(`char.hair.${id}`)} </option>
        )}
      </select>
    </dd>
    <dt>{translate('char.skinColor')}</dt>
    <dd><Color value={value.skinColor} onChange={skinColor => onChange({ ...value, skinColor })} /></dd>
    <dt>{translate('char.hairColor')}</dt>
    <dd><Color value={value.hairColor} onChange={hairColor => onChange({ ...value, hairColor })} /></dd>
  </dl>
}
