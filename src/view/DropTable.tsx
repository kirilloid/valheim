import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { TranslationContext } from '../effects';

import type { GeneralDrop, SimpleDrop } from '../types';
import { addDrop, materializeDrop } from './helpers';
import { ItemIcon } from './Icon';
import { data } from '../model/objects';

export function DropTable({ drops }: { drops: GeneralDrop[] }) {
  const translate = useContext(TranslationContext);
  const items: SimpleDrop = drops.reduce((a, d) => addDrop(a, materializeDrop(d)), {});
  return <ul>
    {Object.entries(items).map(([id, num]) => {
      return <li key={id}>
        {num.toFixed(2)}
        {' '}
        <ItemIcon item={data[id]} />
        {' '}
        <Link to={`/obj/${id}`}>{translate(id)}</Link>
      </li>
    })}
  </ul>;
}