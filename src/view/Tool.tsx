import React from 'react';

import { Tool as TTool } from '../types';
import { Icon } from './Icon';
import { RecipeSection } from './Source';
import { durability } from './helpers';
import { useTranslation } from '../translation.effect';

export function Tool(item: TTool, level?: number) {
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
          <dt>{translate('ui.hands')}</dt><dd>{translate('ui.hands.both')}</dd>
          <dt>{translate('ui.maxQuality')}</dt><dd><Icon type="icon" id="craft_icon" size={16} />{' '}{item.maxLvl}</dd>
          <dt title="tools loose 1 durability point per use">durability</dt><dd>{durability(item.durability, level)}</dd>
          <dt>{translate('ui.weight')}</dt><dd><Icon type="icon" id="weight_icon" size={16} />{' '}{item.weight}</dd>
          <dt>{translate('ui.floats')}</dt><dd>{item.floating ? '✔️' : '❌'}</dd>
        </dl>
      </section>
      <section>
        <header>{translate('ui.usedToCraft')}</header>
        ...
      </section>
      {RecipeSection(recipe, translate)}
    </>
  );
}
