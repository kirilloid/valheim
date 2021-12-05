export type ValueProps<T> = { value: T; onChange: (arg: T) => void };
export type Reader<T> = (bytes: Uint8Array, onProgress?: (progress: number) => void) => Promise<T>;
