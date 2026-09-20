import { promises } from 'fs';
import { read, write } from './Player';

async function runGen<T>(gen: AsyncGenerator<unknown, T, unknown>) {
  while (true) {
    const iter = await gen.next();
    if (iter.done) return iter.value;
  }
}

async function readFile(name: string): Promise<Uint8Array<ArrayBuffer>> {
  const fullName = `test/data/characters/${name}.fch`;
  const blob = await promises.readFile(fullName);
   return new Uint8Array(blob.buffer);
}

function testReSave(name: string, timeout: number) {
  it(name, async () => {
    const binary0 = await readFile(name);
    const data0 = await runGen(read(binary0));
    const binary1 = await runGen(write(data0));
    const data1 = await runGen(read(binary1));

    expect(data1).toEqual(data0);
    expect(binary1).toEqual(binary0);
  }, timeout);
}

describe('re-saving file', () => {
  testReSave('v36', 1000);
  testReSave('v43', 5000);
  testReSave('v45', 1000);
  testReSave('v46', 1000);
});
