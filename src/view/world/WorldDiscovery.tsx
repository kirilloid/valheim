import React, { useContext, useEffect, useState } from 'react';
import classNames from 'classnames';

import type { WorldData } from './types';
import type { Biome } from '../../types';
import type { ValueProps } from '../parts/types';
import { getGeneratedPercent, DiscoveryStats, removeZoneIds } from '../../model/zdo-selectors';

import { TranslationContext } from '../../effects';
import { FIGURE_SPACE, runGenerator } from '../../model/utils';

function showPercent(ratio: number, precision: number) {
  const percent = ratio * 100;
  return precision === 1
    ? `${percent.toFixed(1).padStart(5, FIGURE_SPACE)}%`
    : `≈${Math.round(percent)}%`
}

const laterReleasedBiome = new Set<Biome>(['Mistlands'/*, 'Ashlands', 'DeepNorth'*/]);

type ProgressState = {
  progress: number;
  biome: Biome;
};

export function WorldDiscovery({ value, onChange }: ValueProps<WorldData>) {
  const translate = useContext(TranslationContext);
  const [stats, setStats] = useState<DiscoveryStats | undefined>(undefined);
  const [precision, setPrecision] = useState(16);
  const [progressState, setProgressState] = useState<ProgressState>();

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
  
  const overall = { discovered: 0, total: 0 };
  for (const pair of Object.values(stats)) {
    overall.discovered += pair.zoneIds.size;
    overall.total += pair.total;
  }
  return <div className="WorldEdit__Discovery">
    <h2>Biomes exploration</h2>
    <dl>
      {Object.entries(stats).map(([b, { zoneIds, total }]) => {
        const discovered = zoneIds.size;
        const biome = b as Biome;
        return <React.Fragment key={biome}>
          <dt className={classNames(discovered ? '' : 'disabled')}>{translate(`ui.biome.${biome}`)}</dt>
          <dd className={classNames(discovered ? '' : 'disabled')}>
            {showPercent(discovered / total, precision)}
            {' '}
            {stats != null
            && precision === 1
            && discovered > 0
            && laterReleasedBiome.has(biome)
            && progressState == null
            && <button className="btn btn--sm btn--danger" onClick={async () => {
              // await confirm("This will erase both naturally spawned and items you might have created. Do you want to proceed?");
              const gen = removeZoneIds(value, zoneIds);
              const result = await runGenerator(gen, progress => setProgressState({ progress, biome }));
              const oldStats = stats[biome];
              overall.discovered -= oldStats.zoneIds.size;
              const total = oldStats.total;
              onChange(result);
              setStats({ ...stats, [biome]: { zoneIds: new Set(), total } })
              setProgressState(undefined);
            }}>Reset</button>}
            {progressState != null
            && progressState.biome === biome
            && <progress value={progressState.progress} />}
          </dd>
        </React.Fragment>;
      })}
      <dt>{translate('ui.total')}</dt>
      <dd>{showPercent(overall.discovered / overall.total, precision)}</dd>
    </dl>
    <p>You can use those numbers to know how much of the world is already generated and won't be updated when new content will be released</p>
  </div>;
}
