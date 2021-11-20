import React, { useState, useCallback } from 'react';
import { downloadFile } from '../helpers';

import { ValueProps } from './types';

type Props<T> = {
  defaultFileName: string;
  reader: (buffer: ArrayBuffer) => T;
  writer: (data: T) => Uint8Array;
  Child: React.FC<ValueProps<T>>;
};

export function FileEditor<T>(props: Props<T>) {
  const [state, setState] = useState<T | null>(null);
  const [fileName, setFileName] = useState(props.defaultFileName);
  const [changed, setChanged] = useState(false);
  const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    // Prevent default behavior (Prevent file from being opened)
    event.preventDefault();
    // Use DataTransfer interface to access the file(s)
    for (const file of event.dataTransfer?.files ?? []) {
      file.arrayBuffer().then(buffer => {
        setFileName(file.name);
        setState(props.reader(buffer));
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
            const array = props.writer(state);
            downloadFile(array.buffer, fileName);
            setChanged(false);
          }}>Save &amp; Download</button>
          <br />
          <props.Child value={state}
            onChange={v => {
              setState(v);
              setChanged(true);
            }} />
        </>}
  </div>
}