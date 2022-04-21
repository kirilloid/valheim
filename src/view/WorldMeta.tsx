import React from 'react';

import { read, write, Data } from '../file/fwl';

import { FileEditor } from './parts/FileEditor';
import { WorldMetaInfo } from './world/Info';

/* eslint-disable-next-line require-yield */
function* genRead(data: Uint8Array) {
  return read(data);
}

/* eslint-disable-next-line require-yield */
function* genWrite(data: Data) {
  return write(data);
}

export function WorldMeta() {
  return <FileEditor
    defaultFileName="world.fwl"
    extension="fwl"
    reader={genRead}
    writer={genWrite}
    Child={WorldMetaInfo}
  />;
}
