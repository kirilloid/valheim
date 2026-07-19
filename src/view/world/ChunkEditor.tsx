import React from 'react';

import { FileEditor } from '../parts/file';
import type { Chunk } from '../../file/chunks/chunk-save-mapping';
import { readChunkData, writeChunkData } from '../../file/zdo/chunks';
import { readWriteFirstFile } from '../../file/files-wrapper';
import adaptSingleToMulti from '../parts/file/transformer';
import { ChunkInfoView as SingleChunkInfoView } from './ChunkInfo';

async function* genRead(bytes: Uint8Array) {
  return readChunkData(bytes);
}

async function* genWrite(chunk: Chunk) {
  return writeChunkData(chunk);
}

const MultiChunkInfoView = adaptSingleToMulti(SingleChunkInfoView);

export function ChunkEditor() {
  const [reader, writer] = readWriteFirstFile(genRead, genWrite, ['chunk']);
  return <FileEditor
    defaultFileName="chunk.chunk"
    extension="chunk"
    reader={reader}
    writer={writer}
    Child={MultiChunkInfoView}
    subpath="worlds"
  />;
}
