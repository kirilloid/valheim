import React from 'react';
import { useTranslation } from '../translation.effect';

import type { Item } from '../types';
import { Icon } from './Icon';

export function Valuable(item: Item & { type: 'value' }) {
  const translate = useTranslation();
  return (
    <>
      <h2>
        <Icon type="resource" id={item.id} />
        {' '}
        {translate(item.id)}
      </h2>
      <section>
        <header>{translate('ui.itemType.valuable')}</header>
        <dl>
          <dt>{translate('ui.weight')}</dt><dd><Icon type="icon" id="weight_icon" size={16} />{' '}{item.weight}</dd>
          <dt>{translate('ui.stack')}</dt><dd>{item.stack}</dd>
          <dt>{translate('ui.value')}</dt><dd><Icon type="icon" id="coin_32" size={16} />{' '}{item.value}</dd>
          <dt>{translate('ui.floats')}</dt><dd>{item.floating ? '✔️' : '❌'}</dd>
        </dl>
        Have no other use rather than to be sold to trader
      </section>
    </>
  );
}
