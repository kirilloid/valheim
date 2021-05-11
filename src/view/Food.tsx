import React from 'react';
import type { Food as TFood } from '../types';
import { timeI2S } from '../model/utils';
import { Icon } from './Icon';
import { RecipeSection } from './Source';
import { useTranslation } from '../translation.effect';





export function Food(item: TFood) {
  const translate = useTranslation();
  return (<>
    <h2>
      <Icon type="resource" id={item.id} />
      {' '}
      {translate(item.id)}
    </h2>
    <section>
      <header>{translate('ui.itemType.food')}</header>
      <dl>
        <dt>{translate('ui.health')}</dt><dd><Icon type="icon" id="health_icon" size={16} />{' '}{item.health}</dd>
        <dt>{translate('ui.stamina')}</dt><dd><Icon type="icon" id="health_icon_walknut_small" size={16} />{' '}{item.stamina}</dd>
        <dt>{translate('ui.time')}</dt><dd>{timeI2S(item.duration)}</dd>
        <dt>{translate('ui.regen')}</dt><dd>{item.regen}</dd>
      </dl>
    </section>
    <section>
      <header>{translate('ui.itemType.resource')}</header>
      <dl>
        <dt>{translate('ui.weight')}</dt><dd><Icon type="icon" id="weight_icon" size={16} />{' '}{item.weight}</dd>
        <dt>{translate('ui.stack')}</dt><dd>{item.stack}</dd>
        <dt>{translate('ui.floats')}</dt><dd>{item.floating ? '✔️' : '❌'}</dd>
      </dl>
    </section>
    {RecipeSection(translate, item)}
  </>);
}
