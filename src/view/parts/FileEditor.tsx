import React, { useState, useCallback } from 'react';
import { downloadFile } from '../helpers';

import { ValueProps } from './types';

type Props<T> = {
  defaultFileName: string;
  extension: string;
  reader: (bytes: Uint8Array) => T;
  writer: (data: T) => Uint8Array;
  Child: React.FC<ValueProps<T> & { fileName: string }>;
};

export function FileEditor<T>(props: Props<T>) {
  const [state, setState] = useState<T | null>(null);
  const [fileName, setFileName] = useState(props.defaultFileName);
  const [changed, setChanged] = useState(false);
  const [dragging, setDragging] = useState(false);
  const ext = props.extension;
  const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    const files = (event.dataTransfer?.files ?? []);
    for (const file of files) {
      if (!file.name.endsWith(`.${ext}`) && !file.name.endsWith(`.${ext}.old`)) continue;
      file.arrayBuffer().then(buffer => {
        setFileName(file.name);
        setState(props.reader(new Uint8Array(buffer)));
        setChanged(false);
      });
      return;
    }
  }, [setState, ext]);

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(true);
  }, []);

  const onDragLeave = useCallback(() => {
    setDragging(false);
  }, []);

  return <div className={`drop${dragging ? ' drop--over' : ''}`} onDrop={onDrop} onDragOver={onDragOver} onDragLeave={onDragLeave}>
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
            fileName={fileName}
            onChange={v => {
              setState(v);
              setChanged(true);
            }} />
        </>}
  </div>
}