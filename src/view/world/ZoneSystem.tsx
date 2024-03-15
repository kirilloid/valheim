import React, { useContext } from 'react';

import type { ValueProps } from '../parts/types';
import type { ZoneSystemData } from './types';

import { toggleItem } from '../../model/utils';
import { data } from '../../data/itemDB';

import { TranslationContext } from '../../effects';
import { ItemIcon } from '../parts/Icon';
import { Wiki } from '../parts/Wiki';

const baseKeys = [
  ['defeated_eikthyr', 'Eikthyr'],
  ['KilledTroll', 'Troll'],
  ['BossHildir1', 'Skeleton_Hildir'],
  ['defeated_gdking', 'gd_king'],
  ['killed_surtling', 'Surtling'],
  ['defeated_bonemass', 'Bonemass'],
  ['KilledBat', 'Bat'],
  ['BossHildir2', 'Fenring_Cultist_Hildir'],
  ['defeated_dragon', 'Dragon'],
  ['BossHildir3', 'GoblinBruteBros'],
  ['defeated_goblinking', 'GoblinKing'],
  ['defeated_queen', 'SeekerQueen'],
] as const;

function Keys({ value, onChange }: ValueProps<string[]>) {
  const translate = useContext(TranslationContext);
  // const inputRef = useRef<HTMLInputElement>(null);
  /* function addValue() {
    const input = inputRef.current;
    if (input == null) return;
    const newValue = input.value;
    if (newValue && !value.includes(newValue)) {
      onChange(toggleItem(value, newValue, true));
    }
    input.value = '';
  } */
  return <>
    <ul>
      {baseKeys.map(([key, id]) => <li key={key}>
        <label>
          <input type="checkbox" checked={value.includes(key)} onChange={e => onChange(toggleItem(value, key, e.target.checked))} />
          {' '}
          <ItemIcon item={data[id]} />
          {' '}
          {translate(id)}
        </label>
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
  </>
}

export function ZoneSystem({ value, onChange }: ValueProps<ZoneSystemData>) {
  return <div className="WorldEdit__Keys">
    <h2>Key kills</h2>
    <Keys value={value.globalKeys} onChange={globalKeys => onChange({ ...value, globalKeys })} />
    <p>
      This mean actual kills in this world rather than having a trophy.
      See <Wiki article="Global Keys" /> for more details.
    </p>
  </div>
}
