import React, { useContext, useEffect, useState } from 'react';

import type { ValueProps } from '../../parts/types';
import type { ZDO } from '../types';

import { timeI2S } from '../../../model/utils';
import { stableHashCode } from '../../../model/hash';
import { GAME_DAY } from '../../../model/game';

import { TranslationContext } from '../../../effects';

const SCALE = 10_000_000;
const DEFAULT = BigInt(0);

export const timeComp = (key: string) => {
  const hash = stableHashCode(key);
  return ({ value: zdo, onChange }: ValueProps<ZDO>) => {
    const [value, setDayTime] = useState({ day: 0, time: 0 });
    const translate = useContext(TranslationContext);
    useEffect(() => {
      const ticks = zdo.longs.get(hash) ?? DEFAULT;
      const initialValue = Number(ticks) / SCALE;
      const day = Math.floor(initialValue / GAME_DAY);
      const time = initialValue % GAME_DAY;
      setDayTime({ day, time });
    }, [zdo, setDayTime]);
    const update = () => {
      const ticks = (value.day * GAME_DAY + value.time);
      zdo.longs.set(hash, BigInt(ticks * SCALE));
    }
    return <React.Fragment key={key}>
      <dt>{key}</dt>
      <dd>
        <label>
          {translate('ui.day')}
          <input type="number" inputMode="numeric" pattern="[0-9]*"
            value={value.day} min={0}
            style={{ width: '4em' }}
            onChange={e => {
              setDayTime({ day: Number(e.target.value), time: value.time });
              update();
              onChange(zdo);
            }} />
        </label>
        <label>
          {translate('ui.timeOfDay')}
          <input type="range" value={value.time} min={0} max={GAME_DAY}
            style={{ verticalAlign: 'middle' }}
            onChange={e => {
              setDayTime({ day: value.day, time: Number(e.target.value) });
              update();
              onChange(zdo);
            }} />
        </label>
        {timeI2S(Math.round(value.time / GAME_DAY * 24 * 60))}
      </dd>
    </React.Fragment>;
  };
};
