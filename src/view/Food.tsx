import React, { useContext } from 'react';
import type { Food as TFood } from '../types';
import { timeI2S } from '../model/utils';
import { Icon } from './Icon';
import { RecipeSection } from './Source';
import { TranslationContext } from '../translation.effect';
import { ItemHeader } from './ItemHeader';

export function Food({ item }: { item: TFood }) {
  const translate = useContext(TranslationContext);
  return (<>
    <ItemHeader item={item} />
    <section>
      <h2>{translate('ui.itemType.food')}</h2>
      <dl>
        <dt>{translate('ui.health')}</dt><dd><Icon id="health" size={16} />{' '}{item.health}</dd>
        <dt>{translate('ui.stamina')}</dt><dd><Icon id="walknut_16" size={16} />{' '}{item.stamina}</dd>
        <dt>{translate('ui.time')}</dt><dd>{timeI2S(item.duration)}</dd>
        <dt>{translate('ui.regen')}</dt><dd>{item.regen}</dd>
      </dl>
    </section>
    <section>
      <h2>{translate('ui.itemType.resource')}</h2>
      <dl>
        <dt>{translate('ui.weight')}</dt><dd><Icon id="weight" size={16} />{' '}{item.weight}</dd>
        <dt>{translate('ui.stack')}</dt><dd>{item.stack}</dd>
        <dt>{translate('ui.floats')}</dt><dd>{item.floating ? '✔️' : '❌'}</dd>
      </dl>
    </section>
    <RecipeSection item={item} />
  </>);
}
