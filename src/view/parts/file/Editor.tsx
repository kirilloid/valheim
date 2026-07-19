import React, { useState, useCallback, useContext } from 'react';
import classNames from 'classnames';

import type { MultiEditorProps, Reader, Writer } from '../types';
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
  Child: React.FC<MultiEditorProps<T>>;
  subpath: Subpath;
};

export function FileEditor<T>(props: Props<T>) {
  const translate = useContext(TranslationContext);
  const [state, setState] = useState<FileEditorState<T>>({ state: 'empty' });
  const { reader, writer } = props;

  const processFiles = useFileProcessors<T>(setState, reader, translate);
  const { dragging, ...dndCallbacks } = useDndCallbacks<HTMLDivElement>(processFiles);

  const onChange = useCallback((value: T) => {
    setState(
      state => state.state === 'empty'
      ? state
      : { state: 'done', files: state.files, value, changed: true }
    )
  }, [setState]);

  return <div className={classNames('FileEditor', 'drop', { 'drop--over': dragging })} {...dndCallbacks}>
    {function () {
      switch (state.state) {
        case 'empty':
          return <FileSelector ext={props.extension} subpath={props.subpath} state={state} processFiles={processFiles} />
        case 'reading':
          return <>
            <div>{translate('ui.fileEditor.reading')} &hellip;</div>
            <progress value={state.progress} max="1" style={{ width: '100%' }} />
            <Loader />
          </>
        case 'done':
          return <>
            <FileWriter state={state} setState={setState} writer={writer} />
            <props.Child value={state.value} files={state.files} onChange={onChange} />
          </>;
        case 'saving':
          return <>
            <div>{translate('ui.fileEditor.saving')} &hellip;</div>
            <progress value={state.progress} max="1" style={{ width: '100%' }} />
            <props.Child value={state.value} files={state.files} onChange={onChange} disabled={true} />
          </>;
        default:
          return assertNever(state);
      }
    }()}
  </div>
}
