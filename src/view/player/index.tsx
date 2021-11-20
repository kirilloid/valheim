import React from 'react';

import { read, write } from '../../file/Player';

import { PlayerInfo } from './Info';
import { FileEditor } from '../parts/FileEditor';

export function PlayerEditor() {
  return <FileEditor
    defaultFileName="character.fch"
    reader={read}
    writer={write}
    Child={PlayerInfo}
  />
}