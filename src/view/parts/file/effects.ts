import React, { useState, useCallback } from 'react';

import type { Reader } from '../types';
import type { FileEditorState } from './types';

import { getMemUsage, runGenerator } from '../../../model/utils';

import { Translator } from '../../../effects';

export function useFileProcessors<T>(
  setState: React.Dispatch<React.SetStateAction<FileEditorState<T>>>,
  reader: Reader<T>,
  ext: string,
  translate: Translator,
): [
  (file: File) => Promise<void>,
  (files: FileList | null) => Promise<void>,
] {
  const processFile = useCallback(async (file: File) => {
    try {
      // sometimes people click on image in content and drag it
      if (file.type.startsWith('image/')) return;

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
    } catch (e: any) {
      setState({ state: 'empty', message: e?.message });
    }
  }, [setState, reader]);

  const processFiles = useCallback(async (files: FileList | null) => {
    if (files == null) {
      return setState({ state: 'empty', message: translate('ui.fileEditor.noFile') });
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
        : { state: 'empty', message: translate('ui.fileEditor.noFile') }
      );
    }
    if (!window.confirm(translate('ui.fileEditor.wrongExtensionWarning'))) {
      return;
    }
    if (allFiles.length === 1) {
      processFile(allFiles[0]!);
    } else {
      setState({ state: 'picking', files: allFiles });
    }
  }, [ext, setState, processFile, translate]);

  return [processFile, processFiles];
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

