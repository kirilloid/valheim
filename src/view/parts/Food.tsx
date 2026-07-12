import React, { useContext } from 'react';

import type * as T from '../../types';

import { timeI2S } from '../../model/utils';

import { TranslationContext } from '../../effects';
import { Icon } from '../parts/Icon';

export function Food({ health, stamina, eitr, duration, regen }: T.Food) {
  const translate = useContext(TranslationContext);
  return <section>
    <h2>{translate('ui.itemType.food')}</h2>
    <dl>
      <dt>{translate('ui.health')}</dt><dd><Icon id="health" alt="" size={16} />{' '}{health}</dd>
      <dt>{translate('ui.stamina')}</dt><dd><Icon id="walknut" alt="" size={16} />{' '}{stamina}</dd>
      {eitr != null && <>
        <dt>{translate('ui.eitr')}</dt><dd><Icon id="eitr" alt="" size={16} />{' '}{eitr}</dd>
      </>}
      <dt>{translate('ui.duration')}</dt><dd>{timeI2S(duration)}</dd>
      <dt>{translate('ui.regen')}</dt><dd>{regen}</dd>
    </dl>
  </section>
}
