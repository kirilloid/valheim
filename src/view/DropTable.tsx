import React from 'react';

import type { GeneralDrop } from '../types';
import { addDist, average, distributeDrop, DropDist, percentile } from '../model/dist';
import { InlineObjectWithIcon, rangeBy } from './helpers';

export function DropTable({ drops }: { drops: GeneralDrop[] }) {
  const items = drops.reduce<DropDist>((a, d) => addDist(a, distributeDrop(d)), {});
  return <ul>
    {Object.entries(items).map(([id, num]) => {
      const avg = average(num);
      const low = percentile(num, 1);
      const high = percentile(num, 99);
      return <li key={id}>
        {`${rangeBy([low, high], String)} (${avg.toFixed(2).replace(/\.0+$/, '')})`}
        {' '}
        <InlineObjectWithIcon id={id} />
      </li>
    })}
  </ul>;
}