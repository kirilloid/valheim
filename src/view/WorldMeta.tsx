import React from 'react';
import { readWriteFirstFile } from '../file/files-wrapper';

import { read, write, Data } from '../file/fwl';

import { FileEditor } from './parts/file';
import adaptSingleToMulti from './parts/file/transformer';
import { WorldMetaInfo as SingleWorldMetaInfo } from './world/WorldMeta';

/* eslint-disable-next-line require-yield */
async function* genRead(data: Uint8Array) {
  return read(data);
}

/* eslint-disable-next-line require-yield */
async function* genWrite(data: Data) {
  return write(data);
}

const MultiWorldMetaInfo = adaptSingleToMulti(SingleWorldMetaInfo);

export function WorldMeta() {
  const [reader, writer] = readWriteFirstFile(genRead, genWrite, ['fwl', 'fwl2']);
  return <FileEditor
    defaultFileName="world.fwl"
    extension="fwl,fwl2"
    reader={reader}
    writer={writer}
    Child={MultiWorldMetaInfo}
    subpath="worlds"
  />;
}
