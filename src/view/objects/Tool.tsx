import React, { useContext } from 'react';

import { Tool as TTool } from '../../types';
import { TranslationContext } from '../../effects';

import { durability, InlineObjectWithIcon, yesNo } from '../helpers';
import { Icon } from '../parts/Icon';
import { RecipeSection } from '../parts/Source';
import { ItemHeader } from '../parts/ItemHeader';

export function Tool({ item, level }: { item: TTool, level?: number }) {
  const translate = useContext(TranslationContext);
  return (
    <>
      <ItemHeader item={item} />
      <section>
        <h2>{translate('ui.itemType.tool')}</h2>
        <dl>
          <dt>{translate('ui.hands')}</dt><dd>{translate('ui.slot.both')}</dd>
          <dt>{translate('ui.maxQuality')}</dt><dd><Icon id="star" size={16} alt="" />{' '}{item.maxLvl}</dd>
          <dt title="tools loose 1 durability point per use">durability</dt><dd>{durability(item.durability, level)}</dd>
          <dt>{translate('ui.weight')}</dt><dd><Icon id="weight" size={16} alt="" />{' '}{item.weight}</dd>
          <dt>{translate('ui.floats')}</dt><dd>{yesNo(item.floating)}</dd>
        </dl>
      </section>
      {item.produces.length ? <section>
        <h2>{translate('ui.usedToCraft')}</h2>
        <ul className="CraftList">
          {item.produces.map(id => <li>
            <InlineObjectWithIcon id={id} />
          </li>)}
        </ul>
      </section> : null}
      <RecipeSection item={item} />
    </>
  );
}
