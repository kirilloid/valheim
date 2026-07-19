import React, { useContext } from 'react';
import { zip } from 'fflate';

import type { Writer } from '../types';
import type { DoneState, FileEditorState } from './types';

import { runAsyncGenerator } from '../../../model/utils';
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
        const { files } = state;
        runAsyncGenerator(
          writer(state.value),
          progress => setState({ state: 'saving', files, value: state.value, progress }),
        ).then(result => {
          switch (result.size) {
            case 0:
              alert(translate('ui.fileEditor.saveFailed', translate('ui.fileEditor.noFile')));
              return;
            case 1:
              const iteration = result.entries().next();
              if (iteration.done) {
                alert(translate('ui.fileEditor.saveFailed', translate('ui.fileEditor.noFile')));
                return;
              }
              const [name, buffer] = iteration.value;
              downloadFile(buffer, name);
              break;
            default:
              const filesRecord = Object.fromEntries([...result.entries()]);
              zip(filesRecord, (err, data) => {
                if (err) {
                  alert(translate('ui.fileEditor.saveFailed', err.message));
                  return;
                }
                downloadFile(data, 'files.zip');
              });
          }
        }).catch(e => {
          alert(translate('ui.fileEditor.saveFailed', e.message));
        }).finally(() => {
          setState({ state: 'done', files, value: state.value, changed: false });
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

