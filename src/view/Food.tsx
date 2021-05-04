import React from 'react';
import type { Food as TFood } from '../types';
import { timeI2S } from '../model/utils';
import { Icon } from './Icon';
import { Recipe } from './Recipe';
import { useTranslation } from '../translation.effect';

export function Food(item: TFood) {
  const translate = useTranslation();
  const { recipe } = item;
  return (<>
    <h2>
      <Icon type="resources" id={item.id} />
      {' '}
      {translate(item.id)}
    </h2>
    <section>
      <header>{translate('ui.itemType.food')}</header>
      <dl>
      <dt>{translate('ui.health')}</dt><dd>{item.health}</dd>
      <dt>{translate('ui.stamina')}</dt><dd>{item.stamina}</dd>
      <dt>{translate('ui.time')}</dt><dd>{timeI2S(item.duration)}</dd>
      <dt>{translate('ui.regen')}</dt><dd>{item.regen}</dd>
      </dl>
    </section>
    {recipe ? (<>
    {translate('ui.recipe')}: <Recipe {...recipe} />
    </>) : null}
  </>);
}
