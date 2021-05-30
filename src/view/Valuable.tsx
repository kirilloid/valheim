import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { resourceCraftMap } from '../model/resource-usage';
import { TranslationContext } from '../translation.effect';

import type { Valuable as TValuable } from '../types';
import { Icon, ItemIcon } from './Icon';
import { ItemHeader } from './ItemHeader';

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
          <dt>{translate('ui.floats')}</dt><dd>{item.floating ? '✔️' : '❌'}</dd>
        </dl>
        {item.id === 'Coins'
          ? <section>
              <h2>crafting</h2>
              {translate('ui.usedToCraft')}:
              <ul className="CraftList">
                {resourceCraftMap.Coins?.map(item => <li>
                  <ItemIcon item={item} />
                  {' '}
                  <Link to={`/obj/${item.id}`}>{translate(item.id)}</Link>
                </li>)}
              </ul>
            </section>
          : <>Have no other use rather than to be sold to trader</>}
      </section>
    </>
  );
}
