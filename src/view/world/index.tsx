import React from 'react';

import { read, write } from '../../file/World';

import { FileEditor } from '../parts/FileEditor';
import { WorldInfo } from './Info';

export function WorldEditor() {
  return <FileEditor
    defaultFileName="world.db"
    extension="db"
    reader={read}
    writer={write}
    Child={WorldInfo}
    subpath="worlds"
  />;
}
