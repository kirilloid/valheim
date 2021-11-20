import React, { useContext } from 'react';

import type { Valuable as TValuable } from '../../types';

import { resourceCraftMap } from '../../data/resource-usage';
import { TranslationContext } from '../../effects';

import { InlineObjectWithIcon, yesNo } from '../helpers';
import { Icon } from '../parts/Icon';
import { ItemHeader } from '../parts/ItemHeader';
import { Source, SOURCE_DROP, SOURCE_GROW } from '../parts/Source';

export function Valuable({ item }: { item: TValuable }) {
  const translate = useContext(TranslationContext);
  return (
    <>
      <ItemHeader item={item} />
      <section>
        <h2>{translate('ui.itemType.valuable')}</h2>
        <dl>
          <dt>{translate('ui.weight')}</dt><dd><Icon id="weight" alt="" size={16} />{' '}{item.weight}</dd>
          <dt>{translate('ui.stack')}</dt><dd>{item.stack}</dd>
          <dt>{translate('ui.value')}</dt><dd><Icon id="coin" alt="" size={16} />{' '}{item.value}</dd>
          <dt>{translate('ui.floats')}</dt><dd>{yesNo(item.floating)}</dd>
        </dl>
        {item.id === 'Coins'
          ? <section>
              <h2>{translate('ui.crafting')}</h2>
              {translate('ui.usedToCraft')}:
              <ul className="CraftList">
                {resourceCraftMap.Coins?.map(item => <li>
                  <InlineObjectWithIcon id={item.id} />
                </li>)}
              </ul>
            </section>
          : <>Have no other use rather than to be sold to trader</>}
      </section>
      <Source id={item.id} types={SOURCE_DROP | SOURCE_GROW} />
    </>
  );
}
