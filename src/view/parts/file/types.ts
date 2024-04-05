import type { Reader, Writer, EditorProps } from '../types';

export type Subpath = 'worlds' | 'characters';

export type EmptyState = { state: 'empty', message?: string };
type PickingState = { state: 'picking', files: File[] };
type ReadingState = { state: 'reading', file: File, progress: number };
export type DoneState<T> = { state: 'done', file: File, value: T, changed: boolean };
type SavingState<T> = { state: 'saving', file: File, value: T, progress: number };

export type FileEditorState<T> =
| EmptyState
| PickingState
| ReadingState
| DoneState<T>
| SavingState<T>;

export type FilePeekerState =
| EmptyState
| PickingState
| ReadingState;

export type PathsProps = { subpath: string };