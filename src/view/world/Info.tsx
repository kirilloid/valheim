import React, { useCallback, useEffect, useState } from 'react';

import type { MultiEditorProps } from '../parts/types';
import type { WorldData } from './types';

import { getStatsForDungeons } from '../../model/zdo-selectors';
import { iterateZdos } from '../../file/types';
import { read as readMeta } from '../../file/fwl';
import { getFirstFile } from '../../file/files-wrapper';

import { FilesInfo } from '../parts/file';
import { Tabs } from '../parts/Tabs';

import { RandomEvents } from './RandomEvents';
import { ZoneSystem } from './ZoneSystem';
import { WorldDiscovery } from './WorldDiscovery';
import { LocationDiscovery } from './LocationDiscovery';
import { CorruptionManager } from './CorruptionManager';
import { ZdoData } from './zdo-data';
import { WorldTime } from './Time';

async function getName(files: Map<string, File>): Promise<string> {
  try {
    const [,file] = getFirstFile(files, name => name.endsWith('.fwl2'));
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    const meta = readMeta(bytes);
    return meta.name;
  } catch {
    const [name] = getFirstFile(files, () => true);
    return name;
  }
}

export function WorldInfo({ value, onChange, files, disabled }: MultiEditorProps<WorldData>) {
  const { version, netTime, randEvent, zdo, zoneSystem } = value;
  const onZdoChange = useCallback(zdo => onChange({ ...value, zdo }), [value, onChange]);
  const onZoneSystemChange = useCallback(zoneSystem => onChange({ ...value, zoneSystem }), [value, onChange]);
  const [name, setName] = useState('');

  useEffect(() => { getName(files).then(setName); }, [files]);

  useEffect(() => {
    const stats = getStatsForDungeons(iterateZdos(value.zdo));
    console.log(stats);
  }, [value]);

  const tabs = [{
    title: 'Files',
    renderer: useCallback(() => <FilesInfo files={[...files.values()]} version={version} />, [files, version]),
  }, {
    title: 'Progress',
    renderer: function Progress() {
      return <div className="WorldEdit">
        <WorldTime value={value} onChange={onChange} />
        {randEvent != null && <RandomEvents value={randEvent} />}
        {zoneSystem != null && <ZoneSystem value={zoneSystem} onChange={onZoneSystemChange} />}
        <WorldDiscovery value={value} onChange={onChange} />
      </div>
    },
  }, {
    title: 'Locations',
    renderer: function Locations() {
      return <LocationDiscovery value={value} />
    },
  }, {
    title: 'Objects',
    renderer: useCallback(() => <ZdoData value={zdo} onChange={onZdoChange} time={netTime} allowDelete />, [netTime, zdo, onZdoChange]),
  }, {
    title: 'Recovery',
    renderer: useCallback(() => <CorruptionManager value={zdo} onChange={zdo => onChange({ ...value, zdo } as any)} />, [value, zdo, onChange]),
  }];

  return <section className={disabled ? 'FileEditor--disabled' : ''}>
    <h1>{name} world</h1>
    <Tabs tabs={tabs} selected={1} />
  </section>
}
