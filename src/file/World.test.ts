import { promises } from 'fs';
import { read, write } from './World';

async function runGen<T>(gen: AsyncGenerator<unknown, T, unknown>) {
  while (true) {
    const iter = await gen.next();
    if (iter.done) return iter.value;
  }
}

function testReSave(name: string, timeout: number) {
  it(name, async () => {
    const fullName = `${name}.db`;
    const blob = await promises.readFile(`test/data/worlds/${fullName}`);
    const file = new File([blob.buffer], fullName);
    file.arrayBuffer = async function(this: File) {
      return blob.buffer;
    };
    const files = new Map([[fullName, file]]);
    const world = await runGen(read(files));  
    const reSaved = await runGen(write(world));
    const reSavedFile = reSaved.get(fullName);
    
    expect(reSavedFile).toEqual(new Uint8Array(blob.buffer));
  }, timeout);
}

describe('re-saving file', () => {
  testReSave('v28', 10000);
  testReSave('v36', 30000);
});
