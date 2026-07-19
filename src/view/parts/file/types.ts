export type Subpath = 'worlds' | 'characters';

export type EmptyState = { state: 'empty', message?: string };
type ReadingState = { state: 'reading', files: Map<string, File>, progress: number };
export type DoneState<T> = { state: 'done', files: Map<string, File>, value: T, changed: boolean };
type SavingState<T> = { state: 'saving', files: Map<string, File>, value: T, progress: number };

export type FileEditorState<T> =
| EmptyState
| ReadingState
| DoneState<T>
| SavingState<T>;

export type FilePeekerState =
| EmptyState
| ReadingState;

export type PathsProps = { subpath: string };