export type ValueProps<T> = {
  value: T;
  onChange: (arg: T) => void;
};

export type SingleEditorProps<T> = ValueProps<T> & { file: File; disabled?: boolean };
export type MultiEditorProps<T> = ValueProps<T> & { files: Map<string, File>; disabled?: boolean };

export type Reader<T> = (files: Map<string, File>) => AsyncGenerator<number, T>;
export type Writer<T> = (value: T) => AsyncGenerator<number, Map<string, Uint8Array>>;
