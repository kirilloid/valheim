import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { TranslationContext } from '../effects';

import type { GeneralDrop } from '../types';
import { addDist, average, distributeDrop, DropDist, percentile } from '../model/dist';
import { ItemIcon } from './Icon';
import { data } from '../model/objects';

export function DropTable({ drops }: { drops: GeneralDrop[] }) {
  const translate = useContext(TranslationContext);
  const items = drops.reduce<DropDist>((a, d) => addDist(a, distributeDrop(d)), {});
  return <ul>
    {Object.entries(items).map(([id, num]) => {
      const avg = average(num);
      const low = percentile(num, 1);
      const high = percentile(num, 99);
      return <li key={id}>
        {`${low}-${high} (${avg.toFixed(2).replace(/\.0+$/, '')})`}
        {' '}
        <ItemIcon item={data[id]} />
        {' '}
        <Link to={`/obj/${id}`}>{translate(id)}</Link>
      </li>
    })}
  </ul>;
}