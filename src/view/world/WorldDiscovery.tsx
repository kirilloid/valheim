import React, { useCallback, useContext, useEffect, useState } from 'react';
import classNames from 'classnames';

import type { WorldData } from './types';
import type { Biome } from '../../types';
import type { ValueProps } from '../parts/types';
import { getGeneratedPercent, DiscoveryStats, removeZoneIds } from '../../model/zdo-selectors';

import { TranslationContext } from '../../effects';
import { runGenerator } from '../../model/utils';

function showPercent(ratio: number, precision: number) {
  const percent = ratio * 100;
  return precision === 1
    ? `${percent.toFixed(1)}%`
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

  const resetBiome = useCallback(async (biome: Biome, zoneIds: Set<number>) => {
    if (!stats) return;
    // await confirm("This will erase both naturally spawned and items you might have created. Do you want to proceed?");
    const gen = removeZoneIds(value, zoneIds);
    const result = await runGenerator(gen, progress => setProgressState({ progress, biome }));
    const oldStats = stats[biome];
    overall.discovered -= oldStats.zoneIds.size;
    const total = oldStats.total;
    onChange(result);
    setStats({ ...stats, [biome]: { zoneIds: new Set(), total } })
    setProgressState(undefined);
  }, [stats, setStats, onChange, setProgressState]);

  if (stats == null) return null;
  
  const overall = { discovered: 0, total: 0 };
  for (const pair of Object.values(stats)) {
    overall.discovered += pair.zoneIds.size;
    overall.total += pair.total;
  }

  return <div className="WorldEdit__Discovery">
    <h2>Biomes exploration</h2>
    <table>
      <colgroup>
        <col width="50%" />
        <col width="25%" />
        <col width="25%" />
      </colgroup>
      <thead>
        <tr>
          <th>{translate('ui.biome')}</th>
          <th>discovered</th>
          <th>in world</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(stats).map(([b, { zoneIds, total }]) => {
          const discovered = zoneIds.size;
          const biome = b as Biome;
          const isProgress = progressState != null && progressState.biome === biome;
          return <tr key={biome} className={classNames(discovered ? '' : 'disabled')}>
            <td colSpan={isProgress ? 2 : 1}>
              {translate(`ui.biome.${biome}`)}
              {precision === 1
              && discovered > 0
              && laterReleasedBiome.has(biome)
              && progressState == null
              && <button
                className="btn btn--sm btn--danger"
                style={{ float: 'right' }}
                onClick={() => resetBiome(biome, zoneIds)}>Reset</button>}
              {isProgress && <progress
                style={{ float: 'right' }}
                value={progressState.progress} />}
            </td>
            {!isProgress && <td>{showPercent(discovered / total, precision)}</td>}
            <td>{showPercent(total / overall.total, precision)}</td>
          </tr>;
        })}
      </tbody>
      <tr>
        <td>{translate('ui.total')}</td>
        <td>{showPercent(overall.discovered / overall.total, precision)}</td>
        <td>{showPercent(1, 1)}</td>
      </tr>
    </table>
    <p>You can use those numbers to know how much of the world is already generated and won't be updated when new content will be released</p>
  </div>;
}
