import React, { useMemo, useState } from 'react';

import type { SingleEditorProps } from '../parts/types';
import type { ZDODataLike } from '../../file/types';

import { FileInfo } from '../parts/file';
import { Tabs } from '../parts/Tabs';
import { ZdoData } from './zdo-data';
import { CorruptionManager } from './CorruptionManager';
import { Chunk, ChunkIndex, toChunkIndex } from '../../file/chunks/chunk-save-mapping';

const chunkRegex = /^([\da-f]{2})_([\da-f]{2})__(\d+)_(\d+).chunk$/;

// a hack to derive chunk params from the file name
function parseChunkFilename(name: string): [ChunkIndex, number] {
  const match = name.match(chunkRegex);
  if (!match) {
    throw new Error(`Invalid chunk filename: ${name}`);
  }
  const hi = parseInt(match[1]!, 16);
  const lo = parseInt(match[2]!, 16);
  const size = parseInt(match[3]!, 10);
  const revision = parseInt(match[4]!, 10);
  return [toChunkIndex((hi << 8) | lo, size), revision];
}

export function ChunkInfoView({ value, onChange, file, disabled }: SingleEditorProps<Chunk>) {
  const { name } = file;
  const [chunkIndex, revision] = parseChunkFilename(name);
  const zdoInitial = useMemo((): ZDODataLike => {
    const { zdos, info: { version, numZDOs } } = value;
    const info = { chunkIndex, version, numZDOs };
    const chunk = { zdos, info, name };
    const chunks = new Map([[chunkIndex, chunk]]);
    return {
      revision,
      totalZDOs: numZDOs,
      chunks,
      corruptions: [],
      _checked: false,
    }
  }, [value, name, chunkIndex, revision]);
  const [zdo, setZdo] = useState(zdoInitial);

  const tabs = useMemo(() => [{
    title: 'File',
    renderer: () => <FileInfo file={file} version={zdo.chunks.get(chunkIndex)?.info?.version ?? 0} />,
  }, {
    title: 'Objects',
    renderer: () => <ZdoData value={zdo} onChange={setZdo} time={NaN} />,
  }, {
    title: 'Recovery',
    renderer: () => <CorruptionManager value={zdo} onChange={setZdo} />,
  }], [file, zdo, chunkIndex]);

  return <section className={disabled ? 'FileEditor--disabled' : ''}>
    <h1>{name}</h1>
    <Tabs tabs={tabs} selected={1} />
  </section>;
}
