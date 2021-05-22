import React, { useContext } from 'react';
import { TranslationContext } from '../translation.effect';

import type { Valuable as TValuable } from '../types';
import { Icon } from './Icon';

export function Valuable({ item }: { item: TValuable }) {
  const translate = useContext(TranslationContext);
  return (
    <>
      <h1>
        <Icon type="resource" id={item.id} />
        {' '}
        {translate(item.id)}
      </h1>
      <section>
        <h2>{translate('ui.itemType.valuable')}</h2>
        <dl>
          <dt>{translate('ui.weight')}</dt><dd><Icon type="icon" id="weight" size={16} />{' '}{item.weight}</dd>
          <dt>{translate('ui.stack')}</dt><dd>{item.stack}</dd>
          <dt>{translate('ui.value')}</dt><dd><Icon type="icon" id="coin_32" size={16} />{' '}{item.value}</dd>
          <dt>{translate('ui.floats')}</dt><dd>{item.floating ? '✔️' : '❌'}</dd>
        </dl>
        Have no other use rather than to be sold to trader
      </section>
    </>
  );
}
