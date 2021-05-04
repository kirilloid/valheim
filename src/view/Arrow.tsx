import React from 'react';
import { useTranslation } from '../translation.effect';

import type { Arrow as TArrow } from '../types';
import { weaponDamage } from './helpers';
import { Icon } from './Icon';
import { Recipe } from './Recipe';

export function Arrow(item: TArrow) {
  const { recipe } = item; 
  const translate = useTranslation();
  return (
    <>
      <h2>
        <Icon type="arrow" id={item.id} />
        {' '}
        {translate(item.id)}
      </h2>
      <section>
        <header>{translate('ui.itemType.arrow')}</header>
        <dl>
          <dt>{translate('ui.damage')}</dt>
          <dd>{weaponDamage(item.damage)}</dd>
        </dl>
      </section>
      {recipe ? (<>
        {translate('ui.recipe')}: <Recipe {...recipe} />
        </>) : null}
    </>
  );
}