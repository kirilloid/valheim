import React, { useCallback, useState } from 'react';

import type { Player } from './types';
import { read, write } from '../../file/Player';

import { downloadFile } from '../helpers';
import { PlayerInfo } from './Info';

export function PlayerEditor() {
  const [state, setState] = useState<Player | null>(null);
  const [fileName, setFileName] = useState('character.fch');
  const [changed, setChanged] = useState(false);
  const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    // Prevent default behavior (Prevent file from being opened)
    event.preventDefault();
    // Use DataTransfer interface to access the file(s)
    for (const file of event.dataTransfer?.files ?? []) {
      file.arrayBuffer().then(buffer => {
        setFileName(file.name);
        setState(read(buffer));
        setChanged(false);
      });
      break;
    }
  }, [setState]);

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  return <div style={{ flex: '1 0 auto' }} onDrop={onDrop} onDragOver={onDragOver}>
    {state == null
      ? "Drag a file here"
      : <>
          <button disabled={!changed} onClick={() => {
            const array = write(state);
            downloadFile(array.buffer, fileName);
            setChanged(false);
          }}>Save &amp; Download</button>
          <br />
          <PlayerInfo value={state}
            onChange={v => {
              setState(v);
              setChanged(true);
            }} />
        </>}
  </div>
}