import React from 'react';

import type * as T from '../../types';

import { Food } from '../parts/Food';
import { ItemHeader } from '../parts/ItemHeader';
import { RecipeSection } from '../parts/Source';

export function Feast({ item }: { item: T.Feast }) {
  return (<>
    <ItemHeader item={item} />
    <Food {...item.Food} />
    <RecipeSection item={item} />
  </>);
}
