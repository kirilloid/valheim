import React, { useContext } from 'react';
import type { Food as TFood } from '../types';
import { timeI2S } from '../model/utils';
import { Icon } from './Icon';
import { Source } from './Source';
import { TranslationContext } from '../effects';
import { ItemHeader } from './ItemHeader';
import { yesNo } from './helpers';

export function Food({ item }: { item: TFood }) {
  const translate = useContext(TranslationContext);
  return (<>
    <ItemHeader item={item} />
    <section>
      <h2>{translate('ui.itemType.food')}</h2>
      <dl>
        <dt>{translate('ui.health')}</dt><dd><Icon id="health" alt="" size={16} />{' '}{item.health}</dd>
        <dt>{translate('ui.stamina')}</dt><dd><Icon id="walknut" alt="" size={16} />{' '}{item.stamina}</dd>
        <dt>{translate('ui.duration')}</dt><dd>{timeI2S(item.duration)}</dd>
        <dt>{translate('ui.regen')}</dt><dd>{item.regen}</dd>
      </dl>
    </section>
    <section>
      <h2>{translate('ui.itemType.resource')}</h2>
      <dl>
        <dt>{translate('ui.weight')}</dt><dd><Icon id="weight" alt="" size={16} />{' '}{item.weight}</dd>
        <dt>{translate('ui.stack')}</dt><dd>{item.stack}</dd>
        <dt>{translate('ui.floats')}</dt><dd>{yesNo(item.floating)}</dd>
      </dl>
    </section>
    <Source id={item.id} />
  </>);
}
