import React from 'react';

import { read, write } from '../../file/World';

import { FileEditor } from '../parts/file';
import { WorldInfo as WorldInfoMulti } from './Info';

export function WorldEditor() {
  return <FileEditor
    defaultFileName="world.db"
    extension="db"
    reader={read}
    writer={write}
    Child={WorldInfoMulti}
    subpath="worlds"
  />;
}
