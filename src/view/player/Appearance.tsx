import React, { useContext } from 'react';

import type { PlayerData } from './types';
import type { ValueProps } from '../parts/types';

import { TranslationContext } from '../../effects';
import { Color } from '../ColorEditor';

const MODELS = ['MALE', 'FEMALE'];
const beards = ['Beard1', 'Beard2', 'Beard3', 'Beard4', 'Beard5', 'Beard6', 'Beard7', 'Beard8', 'Beard9', 'Beard10', 'BeardNone'];
const hairs = ['Hair1', 'Hair2', 'Hair3', 'Hair4', 'Hair5', 'Hair6', 'Hair7', 'Hair8', 'Hair9', 'Hair10', 'Hair11', 'Hair12', 'Hair13', 'Hair14', 'HairNone'];

export function Appearance({ value, onChange } : ValueProps<PlayerData>) {
  const translate = useContext(TranslationContext);
  return <dl>
    <dt>model</dt>
    <dd>
      <select value={value.modelIndex}
        onChange={e => onChange({ ...value, modelIndex: +e.target.value })}>
        {MODELS.map((name, index) =>
          <option key={name} value={index}>{MODELS[index]}</option>
        )}
      </select>
    </dd>
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
