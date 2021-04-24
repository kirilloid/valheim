import React from 'react';
import type { Item } from '../types';
import { timeI2S } from '../model/utils';
import { Icon } from './Icon';
import { Recipe } from './Recipe';

export function Food(item: Item & { type: 'food' }) {
  const { recipe } = item;
  return (<>
    <h2>
      <Icon type="resources" id={item.id} />
      {' '}
      {item.id}
    </h2>
    <section>
      <header>food</header>
      <dl>
      <dt>health</dt><dd>{item.health}</dd>
      <dt>stamina</dt><dd>{item.stamina}</dd>
      <dt>time</dt><dd>{timeI2S(item.duration)}</dd>
      <dt>regen</dt><dd>{item.regen}</dd>
      </dl>
    </section>
    {recipe ? (<>
    recipe: <Recipe {...recipe} />
    </>) : null}
  </>);
}
