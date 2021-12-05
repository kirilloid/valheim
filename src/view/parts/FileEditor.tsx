import React, { useState, useCallback } from 'react';

import type { Reader, ValueProps } from './types';

import { assertNever, getMemUsage } from '../../model/utils';
import { downloadFile } from '../helpers';

type Props<T> = {
  defaultFileName: string;
  extension: string;
  reader: Reader<T>;
  writer: (data: T) => Uint8Array;
  Child: React.FC<ValueProps<T> & { fileName: string }>;
};

type FileState<T> =
| { state: 'empty' }
| { state: 'reading', progress: number }
| { state: 'done', value: T, changed: boolean };

export function FileEditor<T>(props: Props<T>) {
  const [state, setState] = useState<FileState<T>>({ state: 'empty' });
  const [fileName, setFileName] = useState(props.defaultFileName);
  const [dragging, setDragging] = useState(false);
  const ext = props.extension;
  const onDrop = useCallback(async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    const files = (event.dataTransfer?.files ?? []);
    for (const file of files) {
      if (!file.name.endsWith(`.${ext}`) && !file.name.endsWith(`.${ext}.old`)) continue;
      const mem1 = getMemUsage();
      const buffer = await file.arrayBuffer();
      setFileName(file.name);
      setState({ state: 'reading', progress: 0 });
      const value = await props.reader(
        new Uint8Array(buffer),
        progress => setState({ state: 'reading', progress }),
      );
      setState({ state: 'done', value, changed: false });
      const mem2 = getMemUsage();
      console.info(`Memory consumed: ${(mem2 - mem1).toPrecision(3)} MB`);
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

  const onChange = useCallback((value: T) => setState({ state: 'done', value, changed: false }), [setState]);

  return <div className={`drop${dragging ? ' drop--over' : ''}`} onDrop={onDrop} onDragOver={onDragOver} onDragLeave={onDragLeave}>
    {function () {
      switch (state.state) {
        case 'empty':
          return <>Drag a *.{ext} file here</>
        case 'reading':
          return <progress value={state.progress} max="1" style={{ width: '100%' }} />
        case 'done':
          return <>
            <button disabled={!state.changed} onClick={() => {
              const array = props.writer(state.value);
              downloadFile(array, fileName);
              onChange(state.value); // reset changed flag
            }}>Save &amp; Download</button>
            <br />
            <props.Child value={state.value} fileName={fileName} onChange={onChange} />
          </>;
        default:
          return assertNever(state);
      }
    }()}
  </div>
}