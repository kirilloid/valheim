import React, { useState, useCallback } from 'react';

import type { Reader } from '../types';
import type { FileEditorState } from './types';

import { getMemUsage, runAsyncGenerator } from '../../../model/utils';

import { Translator } from '../../../effects';

export function useFileProcessors<T>(
  setState: React.Dispatch<React.SetStateAction<FileEditorState<T>>>,
  reader: Reader<T>,
  translate: Translator,
): (files: FileList | null) => Promise<void> {
  return useCallback(async (fileList: FileList | null) => {
    if (fileList == null) {
      return setState({ state: 'empty', message: translate('ui.fileEditor.noFile') });
    }
    const files = new Map([...fileList].map(file => [file.name, file] as const));
    if (files.size === 0) {
      return setState(state => state.state === 'done'
        ? state
        : { state: 'empty', message: translate('ui.fileEditor.noFile') }
      );
    }
    try {
      // sometimes people click on image in content and drag it
      if (fileList[0]?.type.startsWith('image/')) return;
      setState({ state: 'reading', files, progress: 0 });
      const value = await runAsyncGenerator(
        reader(files),
        progress => setState({ state: 'reading', files, progress })
      );
      setState({ state: 'done', files, value, changed: false });
      const mem = getMemUsage();
      const memStr = mem >= 512
        ? (mem / 1024).toPrecision(3) + ' GB'
        : mem.toPrecision(3) + ' MB';
      console.info('Memory used: ' + memStr);
    } catch (e: any) {
      setState({ state: 'empty', message: e?.message });
    }
  }, [reader, setState, translate]);
}

export function useDndCallbacks<E extends HTMLElement>(processFiles: (files: FileList | null) => Promise<void>) {
  const [dragging, setDragging] = useState(false);

  const onDrop = useCallback((event: React.DragEvent<E>) => {
    event.preventDefault();
    setDragging(false);
    processFiles(event.dataTransfer.files);
  }, [processFiles]);

  const onDragOver = useCallback((event: React.DragEvent<E>) => {
    const { items } = event.dataTransfer;
    if (items.length > 0 && items[0]?.kind === 'file') {
      event.preventDefault();
      setDragging(true);
    }
  }, []);

  const onDragLeave = useCallback(() => {
    setDragging(false);
  }, []);

  return { dragging, onDrop, onDragOver, onDragLeave };
}

