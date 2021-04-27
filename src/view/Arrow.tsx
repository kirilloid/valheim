import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../translation.effect';

import type { Arrow as TArrow } from '../types';
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
          <dt>{translate('ui.damage')}</dt><dd>{JSON.stringify(item.damage)}</dd>
        </dl>
      </section>
      {recipe ? (<>
        {translate('ui.recipe')}: <Recipe {...recipe} />
        </>) : null}
    </>
  );
}