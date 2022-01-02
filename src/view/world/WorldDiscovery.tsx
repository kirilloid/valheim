import React, { useContext, useEffect, useState } from 'react';

import type { WorldData } from './types';
import { getGeneratedPercent, DiscoveryStats } from '../../model/zdo-selectors';

import { TranslationContext } from '../../effects';
import classNames from 'classnames';

function showPercent(ratio: number, precision: number) {
  const percent = ratio * 100;
  return precision === 1
    ? `${percent.toFixed(1)}%`
    : `≈${Math.round(percent)}%`
}

export function WorldDiscovery({ value }: { value: WorldData }) {
  const translate = useContext(TranslationContext);
  const [stats, setStats] = useState<DiscoveryStats | undefined>(undefined);
  const [precision, setPrecision] = useState(16);

  useEffect(() => {
    setStats(getGeneratedPercent(value, precision));
    if (precision > 1) {
      const timerId = setTimeout(() => {
        setPrecision(precision / 4);
      }, 25);
      return () => clearTimeout(timerId);
    }
  }, [value, precision]);

  if (stats == null) return null;
  
  const total = Object.values(stats).reduce((a, b) => [a[0] + b[0], a[1] + b[1]]);
  return <div className="WorldEdit__Discovery">
    <h2>Biome discovery</h2>
    <dl>
      {Object.entries(stats).map(([biome, [discovered, total]]) => <React.Fragment key={biome}>
        <dt className={classNames(discovered ? '' : 'disabled')}>{translate(`ui.biome.${biome}`)}</dt>
        <dd className={classNames(discovered ? '' : 'disabled')}>{showPercent(discovered / total, precision)}</dd>
      </React.Fragment>)}
      <dt>{translate('ui.total')}</dt>
      <dd>{showPercent(total[0] / total[1], precision)}</dd>
    </dl>
    <p>You can use those numbers to know how much of the world is already generated and won't be updated when new content will be released</p>
  </div>;
}
