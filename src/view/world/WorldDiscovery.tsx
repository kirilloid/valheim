import React, { useContext, useEffect, useState } from 'react';

import type { WorldData } from './types';
import type { Pair } from '../../types';
import { getGeneratedPercent, DiscoveryStats } from '../../model/zdo-selectors';

import { TranslationContext } from '../../effects';
import classNames from 'classnames';
import { runGenerator } from '../../model/utils';

function showPercent(ratio: number, precision: number) {
  const percent = ratio * 100;
  return precision === 1
    ? `${percent.toFixed(1).padStart(5, ' ')}%`
    : `≈${Math.round(percent)}%`
}

export function WorldDiscovery({ value }: { value: WorldData }) {
  const translate = useContext(TranslationContext);
  const [stats, setStats] = useState<DiscoveryStats | undefined>(undefined);
  const [precision, setPrecision] = useState(16);

  useEffect(() => {
    runGenerator(
      getGeneratedPercent(value, precision),
      () => {}
    ).then(res => {
      setStats(res);
      if (precision > 1) setPrecision(precision / 2);
    });
  }, [value, precision]);

  if (stats == null) return null;
  
  const total: Pair<number> = [0, 0];
  for (const pair of Object.values(stats)) {
    total[0] += pair[0];
    total[1] += pair[1];
  }
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
