import React, { useContext } from 'react';

import { Tool as TTool } from '../types';
import { Icon } from './Icon';
import { RecipeSection } from './Source';
import { durability } from './helpers';
import { TranslationContext } from '../translation.effect';

export function Tool({ item, level }: { item: TTool, level?: number }) {
  const translate = useContext(TranslationContext);
  return (
    <>
      <h1>
        <Icon type="crafting" id={item.id} />
        {' '}
        {translate(item.id)}
      </h1>
      <section>
        <h2>{translate('ui.itemType.tool')}</h2>
        <dl>
          <dt>{translate('ui.hands')}</dt><dd>{translate('ui.hands.both')}</dd>
          <dt>{translate('ui.maxQuality')}</dt><dd><Icon type="icon" id="craft_icon" size={16} />{' '}{item.maxLvl}</dd>
          <dt title="tools loose 1 durability point per use">durability</dt><dd>{durability(item.durability, level)}</dd>
          <dt>{translate('ui.weight')}</dt><dd><Icon type="icon" id="weight" size={16} />{' '}{item.weight}</dd>
          <dt>{translate('ui.floats')}</dt><dd>{item.floating ? '✔️' : '❌'}</dd>
        </dl>
      </section>
      <section>
        <h2>{translate('ui.usedToCraft')}</h2>
        ...
      </section>
      <RecipeSection item={item} />
    </>
  );
}
