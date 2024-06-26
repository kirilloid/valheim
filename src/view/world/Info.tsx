import React, { useCallback, useEffect } from 'react';

import type { EditorProps } from '../parts/types';
import type { WorldData } from './types';

import { getStatsForDungeons } from '../../model/zdo-selectors';

import { FileInfo } from '../parts/file';
import { Tabs } from '../parts/Tabs';

import { RandomEvents } from './RandomEvents';
import { ZoneSystem } from './ZoneSystem';
import { WorldDiscovery } from './WorldDiscovery';
import { LocationDiscovery } from './LocationDiscovery';
import { CorruptionManager } from './CorruptionManager';
import { ZdoData } from './zdo-data';
import { WorldTime } from './Time';

export function WorldInfo({ value, onChange, file, disabled }: EditorProps<WorldData>) {
  const { version, netTime, randEvent, zdo, zoneSystem } = value;
  const onZdoChange = useCallback(zdo => onChange({ ...value, zdo }), [value, onChange]);
  const onZoneSystemChange = useCallback(zoneSystem => onChange({ ...value, zoneSystem }), [value, onChange]);
  useEffect(() => {
    const stats = getStatsForDungeons(value.zdo.zdos);
    console.log(stats);
  }, [value]);
  const tabs = [{
    title: 'File',
    renderer: useCallback(() => <FileInfo file={file} version={version} />, [file, version]),
  }, {
    title: 'Progress',
    renderer: function Progress() {
      return <div className="WorldEdit">
        <WorldTime value={value} onChange={onChange} />
        {randEvent != null && <RandomEvents value={randEvent} />}
        {zoneSystem != null && <ZoneSystem value={zoneSystem} onChange={onZoneSystemChange} />}
        <WorldDiscovery value={value} onChange={onChange} />
        <LocationDiscovery value={value} />
      </div>
    },
  }, {
    title: 'Objects',
    renderer: useCallback(() => <ZdoData value={zdo} onChange={onZdoChange} time={netTime} />, [netTime, zdo, onZdoChange]),
  }, {
    title: 'Recovery',
    renderer: useCallback(() => <CorruptionManager value={value} onChange={onChange} />, [value, onChange]),
  }];
  return <section className={disabled ? 'FileEditor--disabled' : ''}>
    <h1>{file.name} world</h1>
    <Tabs tabs={tabs} selected={1} />
  </section>
}
