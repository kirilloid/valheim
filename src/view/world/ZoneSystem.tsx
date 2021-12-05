import React, { useContext, useRef } from 'react';

import type { ValueProps } from '../parts/types';
import type { ZoneSystemData } from './types';

import { data } from '../../data/itemDB';

import { TranslationContext } from '../../effects';
import { ItemIcon } from '../parts/Icon';
import { Wiki } from '../parts/Wiki';

const baseKeys = [
  ['defeated_eikthyr', 'Eikthyr'],
  ['KilledTroll', 'Troll'],
  ['defeated_gdking', 'gd_king'],
  ['killed_surtling', 'Surtling'],
  ['defeated_bonemass', 'Bonemass'],
  ['defeated_dragon', 'Dragon'],
  ['defeated_goblinking', 'GoblinKing'],
] as const;

function toggleItem<T>(array: T[], value: T, add: boolean): T[] {
  return add ? array.concat(value) : array.filter(v => v !== value);
}

function Keys({ value, onChange }: ValueProps<string[]>) {
  const translate = useContext(TranslationContext);
  const inputRef = useRef<HTMLInputElement>(null);
  /* function addValue() {
    const input = inputRef.current;
    if (input == null) return;
    const newValue = input.value;
    if (newValue && !value.includes(newValue)) {
      onChange(toggleItem(value, newValue, true));
    }
    input.value = '';
  } */
  return <ul>
    {baseKeys.map(([key, id]) => <li key={key}>
      <input type="checkbox" checked={value.includes(key)} onChange={e => onChange(toggleItem(value, key, e.target.checked))} />
      {translate(id)}
      <ItemIcon item={data[id]} />
    </li>)}
    {/* {value.map(key => baseKeys.find(pair => pair[0] === key)
      ? null
      : <li key={key}>
          <input type="button" value="×" onClick={() => onChange(toggleItem(value, key, false))} />
          {key}
        </li>
    )}
    <input type="text" ref={inputRef} onKeyDown={e => e.key === 'Enter' && addValue()} />
    <input type="button" value="+" onClick={addValue} /> */}
  </ul>
}

export function ZoneSystem({ value, onChange }: ValueProps<ZoneSystemData>) {
  return <>
    <h2>Milestones</h2>
    <Wiki article="Global Keys" />
    <Keys value={value.globalKeys} onChange={globalKeys => onChange({ ...value, globalKeys })} />
  </>
}
