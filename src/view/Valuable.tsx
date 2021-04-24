import React from 'react';

import type { Item } from '../types';
import { Icon } from './Icon';

export function Valuable(item: Item & { type: 'value' }) {
  return (
    <>
      <h2>
        <Icon type="resources" id={item.id} />
        {' '}
        {item.id}
      </h2>
      <section>
        <header>valuable</header>
        Have no other use rather than to be sold to trader for {item.value} <Icon type="icon" id="coin_32" size={16} />
      </section>
    </>
  );
}