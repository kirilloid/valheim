import React, { useState, useCallback, useContext } from 'react';
import classNames from 'classnames';

import type { EditorProps, Reader, Writer } from '../types';
import type { FileEditorState, Subpath } from './types';

import { assertNever } from '../../../model/utils';
import { Loader } from '../Loader';
import { FileSelector } from './Selector';

import { TranslationContext } from '../../../effects';
import { useDndCallbacks, useFileProcessors } from './effects';
import { FileWriter } from './Writer';

type Props<T> = {
  defaultFileName: string;
  extension: string;
  reader: Reader<T>;
  writer: Writer<T>;
  Child: React.FC<EditorProps<T>>;
  subpath: Subpath;
};

export function FileEditor<T>(props: Props<T>) {
  const translate = useContext(TranslationContext);
  const [state, setState] = useState<FileEditorState<T>>({ state: 'empty' });
  const { reader, writer } = props;

  const [processFile, processFiles] = useFileProcessors<T>(setState, reader, props.extension, translate);
  const { dragging, ...dndCallbacks } = useDndCallbacks<HTMLDivElement>(processFiles);

  const onChange = useCallback((value: T) => {
    setState(
      state => state.state === 'empty' || state.state === 'picking'
      ? state
      : { state: 'done', file: state.file, value, changed: true }
    )
  }, [setState]);

  return <div className={classNames('FileEditor', 'drop', { 'drop--over': dragging })} {...dndCallbacks}>
    {function () {
      switch (state.state) {
        case 'empty':
          return <FileSelector ext={props.extension} subpath={props.subpath} state={state} processFiles={processFiles} />
        case 'picking':
          return <>
            <div>{translate('ui.fileEditor.multiFiles')}</div>
            {state.files.map((f, i) => <p key={f.name}>
              <button type="button" className="btn btn--secondary" onClick={() => processFile(f)}>{f.name}</button>
            </p>)}
            <input type="button" className="btn btn--danger" onClick={() => setState({ state: 'empty' })} value="cancel" />
          </>
        case 'reading':
          return <>
            <div>{translate('ui.fileEditor.reading')} &hellip;</div>
            <progress value={state.progress} max="1" style={{ width: '100%' }} />
            <Loader />
          </>
        case 'done':
          return <>
            <FileWriter state={state} setState={setState} writer={writer} />
            <props.Child value={state.value} file={state.file} onChange={onChange} />
          </>;
        case 'saving':
          return <>
            <div>{translate('ui.fileEditor.saving')} &hellip;</div>
            <progress value={state.progress} max="1" style={{ width: '100%' }} />
            <props.Child value={state.value} file={state.file} onChange={onChange} disabled={true} />
          </>;
        default:
          return assertNever(state);
      }
    }()}
  </div>
}
