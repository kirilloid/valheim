import React, { useCallback, useState } from 'react';
import { defaultMemoize } from 'reselect';

import type { EditorProps, ValueProps } from '../parts/types';
import type { WorldData, WorldMeta } from './types';
import { GAME_DAY } from '../../model/game';
import { timeI2S } from '../../model/utils';
import { stableHashCode, solve } from '../../model/hash';
import { getMaxTime } from '../../model/zdo-selectors';

import { FileInfo } from '../parts/FileInfo';
import { Tabs } from '../parts/Tabs';

import { RandomEvents } from './RandomEvents';
import { ZoneSystem } from './ZoneSystem';
import { WorldDiscovery } from './WorldDiscovery';
import { CorruptionManager } from './CorruptionManager';
import { ZdoData } from './zdo-data';

function showTime(time: number) {
  if (!isFinite(time)) return `Invalid time`;
  const day = Math.floor(time / GAME_DAY);
  const tod = Math.round(time / GAME_DAY % 1 * 24 * 60);
  const timeStr = timeI2S(tod);
  return `Day ${day} @ ${timeStr}`;
}

const getMaxTimeCached = defaultMemoize(getMaxTime);

function WorldMetaDetails({ value, onChange }: ValueProps<WorldMeta>) {
  const [idChanged, setIdChanged] = useState(false);
  const [seedChanged, setSeedChanged] = useState(false);
  return <dl>
    <dt>version</dt>
    <dd>{value.version}</dd>
    <dt>generator version</dt>
    <dd>{value.worldGenVersion}</dd>
    <dt>name</dt>
    <dd><input type="text" value={value.name}
      onChange={e => onChange({ ...value, name: e.target.value })} /></dd>
    <dt>seed</dt>
    <dd>
      <input type="text"
        value={value.seedName}
        onChange={e => {
          const seedName = e.target.value;
          setSeedChanged(true);
          onChange({
            ...value,
            seedName,
            seed: stableHashCode(seedName),
          });
        }} />
      {' / '}
      <input type="number" inputMode="numeric" pattern="-?[0-9]*"
        value={value.seed}
        onChange={e => {
          const seed = Number(e.target.value);
          setSeedChanged(true);
          onChange({
            ...value,
            seedName: solve(seed),
            seed,
          });
        }} />
      {seedChanged && <>
        <br />
        <p className="warning">Changing seed will change the terrain and could make the world unplayable.</p>
      </>}
    </dd>
    <dt>world id</dt>
    <dd>
      <input type="text" value={String(value.uid)}
        onChange={e => {
          setIdChanged(true);
          onChange({
            ...value,
            uid: BigInt(e.target.value),
          });
        }} />
      {idChanged && <>
        <br />
        <p className="warning">Changing world id could reset map exploration, markers and spawn point.</p>
      </>}
    </dd>
  </dl>
}

export function WorldMetaInfo({ value, onChange, file }: EditorProps<WorldMeta>) {
  const tabs = [{
    title: 'File',
    renderer: () => <FileInfo file={file} version={value.version} />,
  }, {
    title: 'Info',
    renderer: () => <WorldMetaDetails value={value} onChange={onChange} />,
  }];
  return <section>
    <h1>{file.name} world</h1>
    <Tabs tabs={tabs} selected={1} />
  </section>
}

export function WorldInfo({ value, onChange, file, disabled }: EditorProps<WorldData>) {
  const { netTime, randEvent, zdo, version, zoneSystem } = value;
  const onZdoChange = useCallback(zdo => onChange({ ...value, zdo }), [value, onChange]);
  const onZoneSystemChange = useCallback(zoneSystem => onChange({ ...value, zoneSystem }), [value, onChange]);
  const tabs = [{
    title: 'File',
    renderer: useCallback(() => <FileInfo file={file} version={version} />, [file, version]),
  }, {
    title: 'Progress',
    renderer: function Progress() {
      const maxTime = getMaxTimeCached(value.zdo.zdos);
      const onTimeChange = useCallback(() => onChange({ ...value, netTime: maxTime }), [maxTime]);
      return <div className="WorldEdit">
        <div className="WorldEdit__Time">
          <h2>world time</h2>
          <p>{showTime(netTime)}</p>
          {!isFinite(netTime) || Math.abs(netTime - maxTime) > 100 && <p key="fix-time">
            The time seems to be off{' '}
            <button className="btn btn--primary" onClick={onTimeChange}>Fix it</button>
          </p>}          
        </div>
        {randEvent != null && <RandomEvents value={randEvent} />}
        {zoneSystem != null && <ZoneSystem value={zoneSystem} onChange={onZoneSystemChange} />}
        <WorldDiscovery value={value} />
      </div>
    },
  }, {
    title: 'Objects',
    renderer: useCallback(() => <ZdoData value={zdo} onChange={onZdoChange} />, [zdo, onZdoChange]),
  }, {
    title: 'Recovery',
    renderer: useCallback(() => <CorruptionManager value={value} onChange={onChange} />, [value, onChange]),
  }];
  return <section className={disabled ? 'FileEditor--disabled' : ''}>
    <h1>{file.name} world</h1>
    <Tabs tabs={tabs} selected={1} />
  </section>
}
