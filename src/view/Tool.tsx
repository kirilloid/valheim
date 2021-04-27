import React from 'react';
import { Link } from 'react-router-dom';

import { Tool as TTool } from '../types';
import { Icon } from './Icon';
import { Recipe } from './Recipe';
import { durability } from './helpers';
import { useTranslation } from '../translation.effect';

export function Tool(item: TTool) {
  const translate = useTranslation();
  const { recipe } = item;
  return (
    <>
      <h2>
        <Icon type="crafting" id={item.id} />
        {' '}
        {translate(item.id)}
      </h2>
      <section>
        <header>{translate('ui.itemType.tool')}</header>
        <dl>
          <dt>hands</dt><dd>both</dd>
          <dt>{translate('ui.maxQuality')}</dt><dd><Icon type="icon" id="craft_icon" size={16} />{' '}{item.maxLvl}</dd>
          <dt title="tools loose 1 durability point per use">durability</dt><dd>{durability(item.durability)}</dd>
          <dt>{translate('ui.weight')}</dt><dd><Icon type="icon" id="weight_icon" size={16} />{' '}{item.weight}</dd>
        </dl>
      </section>
      <section>
        <header>crafting</header>
        ...
      </section>
      {recipe ? (<section>
        <header>recipe</header>
        <Recipe {...recipe} />
      </section>) : null}
    </>
  );
}
