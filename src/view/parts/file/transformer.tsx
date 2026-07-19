import React from 'react';
import type { SingleEditorProps, MultiEditorProps } from '../types';

/**
 * Adapt a single-file editor component to a multi-file editor interface.
 * It picks the first file from the provided `files` map and forwards it
 * to the wrapped `Single` component. If no files are present it renders
 * `null`.
 */
export function adaptSingleToMulti<T>(Single: React.FC<SingleEditorProps<T>>): React.FC<MultiEditorProps<T>> {
  const Multi: React.FC<MultiEditorProps<T>> = ({ value, onChange, files, disabled }) => {
    const firstFile = files && files.size > 0 ? Array.from(files.values())[0] : undefined;
    if (!firstFile) return null;

    return <Single value={value} onChange={onChange} file={firstFile} disabled={disabled} />;
  };

  Multi.displayName = `Multi(${Single.displayName || Single.name || 'Anonymous'})`;
  return Multi;
}

export default adaptSingleToMulti;
