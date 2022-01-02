import React from 'react';

import type * as T from '../../types';

import { ItemHeader } from '../parts/ItemHeader';
import { Destructible } from '../parts/Destructible';

export function Structure({ item }: { item: T.Structure }) {
  return (
    <>
      <ItemHeader item={item} />
      {item.Destructible && <Destructible item={item.Destructible} />}
    </>
  );
}
