import React, { useContext } from 'react';

import type { Writer } from '../types';
import type { DoneState, FileEditorState } from './types';

import { runGenerator } from '../../../model/utils';
import { downloadFile } from '../../helpers';

import { TranslationContext } from '../../../effects';

export function FileWriter<T>({ state, setState, writer }: {
  state: DoneState<T>;
  setState: (v: FileEditorState<T>) => void;
  writer: Writer<T>;
}) {
  const translate = useContext(TranslationContext);

  return <div className="FileEditor__controls">
    <button className="btn btn--primary" disabled={!state.changed && !!writer}
      onClick={() => {
        const sizeHint = Math.round(state.file.size * 1.1);
        const { file } = state;
        runGenerator(
          writer(state.value, sizeHint),
          progress => setState({ state: 'saving', file, value: state.value, progress }),
        ).then(result => {
          downloadFile(result, file.name);
        }).catch(e => {
          alert("There was a problem with saving: " + e.message);
        }).finally(() => {
          setState({ state: 'done', file, value: state.value, changed: false });
        });
      }}>
      {translate('ui.fileEditor.save')}
    </button>
    <button className="btn btn--danger"
      onClick={() => setState({ state: 'empty' })}>
      {translate('ui.fileEditor.close')}
    </button>
  </div>
}

