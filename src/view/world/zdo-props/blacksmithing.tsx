import React, { useContext } from 'react';

import type { ValueProps } from '../../parts/types';
import type { ZDO } from '../types';

import { stableHashCode } from '../../../model/hash';

import { TranslationContext } from '../../../effects';

const DATA_COUNT = stableHashCode('dataCount');

export function BlacksmithingComp({ value: zdo, onChange }: ValueProps<ZDO>) {
  const translate = useContext(TranslationContext);
  const size = zdo.ints.get(DATA_COUNT) ?? 0;
  let value: string | undefined = undefined;
  let index = -1;
  for (let i = 0; i < size; i++) {
    if (zdo.strings.get(stableHashCode(`data_${i}`)) === 'Blacksmithing') {
      value = zdo.strings.get(stableHashCode(`data__${i}`));
      index = i;
      break;
    }
  }
  return value != null ? <>
    <dt>{translate('ui.skillType.Blacksmithing')}</dt>
    <dd><input type="range" min={0} max={100} value={value} onChange={e => {
      zdo.strings.set(stableHashCode(`data__${index}`), e.target.value);
      onChange(zdo);
    }} /> {value}</dd>
  </> : null;
};
