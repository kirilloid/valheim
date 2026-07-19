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
  const { reader, extension } = props;

  const processFiles = useFileProcessors<T>((dispatcher) => {
    const newState = typeof dispatcher === 'function' ? dispatcher(state) : dispatcher;
    switch (newState.state) {
      case 'empty':
      case 'reading':
        setState(newState);
        break;
      case 'done':
        props.onLoad(newState.value, 'result.zip');
        break;
      case 'saving':
        break;
      default:
        assertNever(newState);
    }
  }, reader, translate);
  const { dragging, ...dndCallbacks } = useDndCallbacks<HTMLDivElement>(processFiles);

  return <div className={classNames('drop', { 'drop--over': dragging })} {...dndCallbacks}>
    {function () {
      switch (state.state) {
        case 'empty':
          return <FileSelector ext={extension} subpath={props.subpath} state={state} processFiles={processFiles} />
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