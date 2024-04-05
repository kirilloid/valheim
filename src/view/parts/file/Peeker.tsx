import React, { useState, useContext } from 'react';
import classNames from 'classnames';

import type { Reader } from '../types';
import type { FilePeekerState, Subpath } from './types';

import { assertNever } from '../../../model/utils';
import { Loader } from '../Loader';
import { FileSelector } from './Selector';

import { TranslationContext } from '../../../effects';
import { useDndCallbacks, useFileProcessors } from './effects';

type Props<T> = {
  defaultFileName: string;
  extension: string;
  reader: Reader<T>;
  onLoad: (value: T, fileName: string) => void;
  subpath: Subpath;
};

export function FilePeeker<T>(props: Props<T>) {
  const translate = useContext(TranslationContext);
  const [state, setState] = useState<FilePeekerState>({ state: 'empty' });
  const { reader } = props;

  const [processFile, processFiles] = useFileProcessors<T>((dispatcher) => {
    const newState = typeof dispatcher === 'function' ? dispatcher(state) : dispatcher;
    switch (newState.state) {
      case 'empty':
      case 'picking':
      case 'reading':
        setState(newState);
        break;
      case 'done':
        props.onLoad(newState.value, newState.file.name);
        break;
      case 'saving':
        break;
      default:
        assertNever(newState);
    }
  }, reader, props.extension, translate);
  const { dragging, ...dndCallbacks } = useDndCallbacks<HTMLDivElement>(processFiles);

  return <div className={classNames('drop', { 'drop--over': dragging })} {...dndCallbacks}>
    {function () {
      switch (state.state) {
        case 'empty':
          return <FileSelector ext={props.extension} subpath={props.subpath} state={state} processFiles={processFiles} />
        case 'picking':
          return <>
            <div>{translate('ui.fileEditor.multiFiles')}</div>
            {state.files.map(f => <p key={f.name}>
              <button type="button" className="btn btn--secondary" onClick={() => processFile(f)}>{f.name}</button>
            </p>)}
            <button type="button" className="btn btn--danger" onClick={() => setState({ state: 'empty' })}>Cancel</button>
          </>
        case 'reading':
          return <>
            <div>{translate('ui.fileEditor.reading')} &hellip;</div>
            <progress value={state.progress} max="1" style={{ width: '100%' }} />
            <Loader />
          </>
        default:
          return assertNever(state);
      }
    }()}
  </div>
}