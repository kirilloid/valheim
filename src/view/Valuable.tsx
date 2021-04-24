import React from 'react';
import { useTranslation } from '../translation.effect';

import type { Item } from '../types';
import { Icon } from './Icon';

export function Valuable(item: Item & { type: 'value' }) {
  const translate = useTranslation();
  return (
    <>
      <h2>
        <Icon type="resources" id={item.id} />
        {' '}
        {translate(item.id)}
      </h2>
      <section>
        <header>valuable</header>
        <dl>
          <dt>weight</dt><dd>{item.weight}</dd>
          <dt>stack</dt><dd>{item.stack}</dd>
          <dt>value</dt><dd>{item.value}</dd>
        </dl>
        Have no other use rather than to be sold to trader for {item.value} <Icon type="icon" id="coin_32" size={16} />
      </section>
    </>
  );
}