import React from 'react';

import type { EditorProps } from '../parts/types';
import type { WorldData } from './types';
import { GAME_DAY } from '../../model/game';
import { timeI2S } from '../../model/utils';

import { FileInfo } from '../parts/FileInfo';
import { Tabs } from '../parts/Tabs';

import { RandomEvents } from './RandomEvents';
import { ZoneSystem } from './ZoneSystem';
import { WorldDiscovery } from './WorldDiscovery';
import { CorruptionManager } from './CorruptionManager';
import { ZdoData } from './zdo-data';

function showTime(time: number) {
  const day = Math.floor(time / GAME_DAY);
  const tod = Math.round(time / GAME_DAY % 1 * 24 * 60);
  const timeStr = timeI2S(tod);
  return `Day ${day} @ ${timeStr}`;
}

export function WorldInfo({ value, onChange, file, disabled }: EditorProps<WorldData>) {
  const { netTime, randEvent, zdo, version, zoneSystem } = value;
  const tabs = [{
    title: 'File',
    renderer: () => <FileInfo file={file} version={version} />,
  }, {
    title: 'Progress',
    renderer: () => <div className="WorldEdit">
      <div className="WorldEdit__Time">
        <h2>world time</h2>
        <p>{showTime(netTime)}</p>
      </div>
      {randEvent != null && <RandomEvents value={randEvent} />}
      {zoneSystem != null && <ZoneSystem value={zoneSystem} onChange={zoneSystem => onChange({ ...value, zoneSystem })} />}
      <WorldDiscovery value={value} />
    </div>
  }, {
    title: 'Objects',
    renderer: () => <ZdoData value={zdo} onChange={zdo => onChange({ ...value, zdo })} />
  }, {
    title: 'Recovery',
    renderer: () => <CorruptionManager value={value} onChange={onChange} />
  }];
  return <section className={disabled ? 'FileEditor--disabled' : ''}>
    <h1>{file.name} world</h1>
    <Tabs tabs={tabs} selected={1} />
  </section>
}
