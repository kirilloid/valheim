import React, { useState, useCallback } from 'react';

import type { Reader, Writer, EditorProps } from './types';

import { assertNever, getMemUsage, runGenerator } from '../../model/utils';
import { downloadFile } from '../helpers';

type Props<T> = {
  defaultFileName: string;
  extension: string;
  reader: Reader<T>;
  writer: Writer<T>;
  Child: React.FC<EditorProps<T>>;
};

type FileState<T> =
| { state: 'empty' }
| { state: 'reading', file: File, progress: number }
| { state: 'done', file: File, value: T, changed: boolean }
| { state: 'saving', file: File, value: T, progress: number };

export function FileEditor<T>(props: Props<T>) {
  const [state, setState] = useState<FileState<T>>({ state: 'empty' });
  const [dragging, setDragging] = useState(false);
  const ext = props.extension;

  const processFiles = useCallback(async (files: FileList | null) => {
    if (files == null) return;
    for (const file of files) {
      if (!file.name.endsWith(`.${ext}`) && !file.name.endsWith(`.${ext}.old`)) continue;
      const mem1 = getMemUsage();
      const buffer = await file.arrayBuffer();
      setState({ state: 'reading', file, progress: 0 });
      const value = await runGenerator(
        props.reader(new Uint8Array(buffer)),
        progress => setState({ state: 'reading', file, progress })
      );
      setState({ state: 'done', file, value, changed: false });
      const mem2 = getMemUsage();
      console.info(`Memory consumed: ${(mem2 - mem1).toPrecision(3)} MB`);
      return;
    }
  }, []);

  const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    processFiles(event.dataTransfer.files);
  }, [setState, ext]);

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(true);
  }, []);

  const onDragLeave = useCallback(() => {
    setDragging(false);
  }, []);

  const onChange = useCallback((value: T) => {
    setState(
      state => state.state === 'empty'
      ? state
      : { state: 'done', file: state.file, value, changed: true }
    )
  }, [setState]);

  return <div className={`drop${dragging ? ' drop--over' : ''}`} onDrop={onDrop} onDragOver={onDragOver} onDragLeave={onDragLeave}>
    {function () {
      switch (state.state) {
        case 'empty':
          return <>
            <p>Drag a *.{ext} file here or open via dialog</p>
            <p><input type="file"
              accept={`.${ext},.${ext}.old`}
              onChange={e => processFiles(e.target.files)} /></p>
            <p>Your files are stored in <code>C:\Users\%username%\AppData\LocalLow\IronGate\Valheim\</code></p>
          </>
        case 'reading':
          return <>
            <div>Reading file &hellip;</div>
            <progress value={state.progress} max="1" style={{ width: '100%' }} />
          </>
        case 'done':
          return <>
            <div className="FileEditor__controls">
              <button className="btn btn--primary" disabled={!state.changed}
                onClick={() => {
                  const sizeHint = Math.round(state.file.size * 1.1);
                  const { file } = state;
                  runGenerator(
                    props.writer(state.value, sizeHint),
                    progress => setState({ state: 'saving', file, value: state.value, progress }),
                  ).then(result => {
                    downloadFile(result, file.name);
                    setState({ state: 'done', file, value: state.value, changed: false });
                  });
                }}>
                Save &amp; Download
              </button>
              <button className="btn btn--danger"
                onClick={() => setState({ state: 'empty' })}>
                Close
              </button>
            </div>
            <props.Child value={state.value} file={state.file} onChange={onChange} />
          </>;
        case 'saving':
          return <>
            <div>Saving file...</div>
            <progress value={state.progress} max="1" style={{ width: '100%' }} />
            <props.Child value={state.value} file={state.file} onChange={onChange} disabled={true} />
          </>;
        default:
          return assertNever(state);
      }
    }()}
  </div>
}