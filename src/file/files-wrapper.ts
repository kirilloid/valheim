import type { Reader, Writer } from '../view/parts/types';

export function getFirstFile<T>(files: Map<string, T>, matches: (name: string) => boolean): [string, T] {
  for (const [name, file] of files) {
    if (matches(name)) {
      return [name, file];
    }
  }
  throw new Error('Matching file not found');
}

export function readWriteFirstFile<T>(
  read: (bytes: Uint8Array<ArrayBuffer>) => AsyncGenerator<number, T>,
  write: (data: T) => AsyncGenerator<number, Uint8Array<ArrayBuffer>>,
  extensions: string[],
): [Reader<T>, Writer<T>] {
  let fileName = `file.${extensions[0]!}`;
  async function* readWrapped(files: Map<string, File>): AsyncGenerator<number, T> {
    const [name, file] = getFirstFile(files, name => extensions.some(ext => name.endsWith(`.${ext}`)));
    fileName = name;
    const buffer = await file.arrayBuffer();
    return yield* read(new Uint8Array<ArrayBuffer>(buffer));
  }
  async function* writeWrapped(data: T): AsyncGenerator<number, Map<string, Uint8Array<ArrayBuffer>>> {
    const result = yield* write(data);
    return new Map([[fileName, result]]);
  }

  return [readWrapped, writeWrapped];
}
