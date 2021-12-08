export type ValueProps<T> = {
  value: T;
  onChange: (arg: T) => void;
};

export type EditorProps<T> = ValueProps<T> & { file: File; disabled?: boolean };

export type Reader<T> = (bytes: Uint8Array) => Generator<number, T>;
export type Writer<T> = (value: T, sizeHint?: number) => Generator<number, Uint8Array>;
