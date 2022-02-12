import React, { useState, useCallback } from 'react';
import classNames from 'classnames';

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
| { state: 'empty', message?: string }
| { state: 'picking', files: File[] }
| { state: 'reading', file: File, progress: number }
| { state: 'done', file: File, value: T, changed: boolean }
| { state: 'saving', file: File, value: T, progress: number };

export function FileEditor<T>(props: Props<T>) {
  const [state, setState] = useState<FileState<T>>({ state: 'empty' });
  const [dragging, setDragging] = useState(false);
  const ext = props.extension;
  const { reader } = props;

  const processFile = useCallback(async (file: File) => {
    const buffer = await file.arrayBuffer();
    setState({ state: 'reading', file, progress: 0 });
    const value = await runGenerator(
      reader(new Uint8Array(buffer)),
      progress => setState({ state: 'reading', file, progress })
    );
    setState({ state: 'done', file, value, changed: false });
    const mem = getMemUsage();
    const memStr = mem >= 512
      ? (mem / 1024).toPrecision(3) + ' GB'
      : mem.toPrecision(3) + ' MB';
    console.info('Memory used: ' + memStr);
  }, [setState, reader]);

  const processFiles = useCallback(async (files: FileList | null) => {
    if (files == null) {
      return setState({ state: 'empty', message: "No file was selected" });
    }
    const allFiles = [...files];
    const matchingFiles = allFiles.filter(
      file => file.name.endsWith(`.${ext}`)
           || file.name.endsWith(`.${ext}.old`)
    );
    if (matchingFiles.length > 1) return setState({ state: 'picking', files: matchingFiles });
    if (matchingFiles.length === 1) return processFile(matchingFiles[0]!);
    if (allFiles.length === 0) {
      return setState(state => state.state === 'done'
        ? state
        : { state: 'empty', message: "No file was selected" }
      );
    }
    if (!window.confirm("The file(s) you provided, doesn't have proper extension. Reading wrong file might crash this browser tab.\nDo you want to proceed?")) {
      return;
    }
    if (allFiles.length === 1) {
      processFile(allFiles[0]!);
    } else {
      setState({ state: 'picking', files: allFiles });
    }
  }, [ext, processFile]);

  const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    processFiles(event.dataTransfer.files);
  }, [processFiles]);

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    const file = event.dataTransfer.files[0];
    // sometimes people click on image in content and drag it
    if (file && !file.type.startsWith('image/')) {
      event.preventDefault();
      setDragging(true);
    }
  }, []);

  const onDragLeave = useCallback(() => {
    setDragging(false);
  }, []);

  const onChange = useCallback((value: T) => {
    setState(
      state => state.state === 'empty' || state.state === 'picking'
      ? state
      : { state: 'done', file: state.file, value, changed: true }
    )
  }, [setState]);

  return <div className={classNames('drop', { 'drop--over': dragging })}
    onDrop={onDrop} onDragOver={onDragOver} onDragLeave={onDragLeave}>
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
        case 'picking':
          return <>
            <div>Several files cannot be opened at once (in one tab), select one to proceed</div>
            <ul>{state.files.map((f, i) => <li key={i}>
              <button type="button" className="btn btn--secondary" onClick={() => processFile(f)}>{f.name}</button>
            </li>)}</ul>
            <input type="button" className="btn btn--danger" onClick={() => setState({ state: 'empty' })} value="cancel" />
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