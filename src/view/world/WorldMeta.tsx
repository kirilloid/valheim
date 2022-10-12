import React, { useState } from 'react';

import type { EditorProps, ValueProps } from '../parts/types';
import type { WorldMeta } from './types';

import { stableHashCode, solve } from '../../model/hash';

import { FileInfo } from '../parts/FileInfo';
import { Tabs } from '../parts/Tabs';

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