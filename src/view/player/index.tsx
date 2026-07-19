import React from 'react';

import { read, write } from '../../file/Player';

import { PlayerInfo as SinglePlayerInfo } from './Info';
import { FileEditor } from '../parts/file';
import { readWriteFirstFile } from '../../file/files-wrapper';
import adaptSingleToMulti from '../parts/file/transformer';

const MultPlayerInfo = adaptSingleToMulti(SinglePlayerInfo);

export function PlayerEditor() {
  const [reader, writer] = readWriteFirstFile(read, write, ['fch']);
  return <FileEditor
    defaultFileName="character.fch"
    extension="fch"
    reader={reader}
    writer={writer}
    Child={MultPlayerInfo}
    subpath="characters"
  />
}