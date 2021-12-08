import React from 'react';

import type { EditorProps } from '../parts/types';
import type { WorldData } from './types';
import { GAME_DAY } from '../../model/game';
import { timeI2S } from '../../model/utils';

import { FileInfo } from '../parts/FileInfo';
import { Tabs } from '../parts/Tabs';

import { RandomEvents } from './RandomEvents';
import { ZoneSystem } from './ZoneSystem';
import { CorruptionManager } from './CorruptionManager';
import { ZdoData } from './ZdoData';

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
    title: 'Time',
    renderer: () => <dl>
      <dt>world time</dt><dd>{showTime(netTime)}</dd>
      {randEvent != null && <RandomEvents value={randEvent} />}
    </dl>
  }];
  if (zoneSystem != null) {
    tabs.push({
      title: 'Progress',
      renderer: () => <ZoneSystem value={zoneSystem} onChange={zoneSystem => onChange({ ...value, zoneSystem })} />
    });
  }
  tabs.push({
    title: 'Objects',
    renderer: () => <ZdoData value={zdo} onChange={zdo => onChange({ ...value, zdo })} />
  }, {
    title: 'Recovery',
    renderer: () => <CorruptionManager value={value} onChange={onChange} />
  });
  return <section className={disabled ? 'FileEditor--disabled' : ''}>
    <h1>World</h1>
    <Tabs tabs={tabs} selected={1} />
  </section>
}
