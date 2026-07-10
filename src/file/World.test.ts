import { readFileSync } from 'fs';
import { read, write } from './World';

function runGen<T>(gen: Generator<unknown, T, unknown>) {
  while (true) {
    const iter = gen.next();
    if (iter.done) return iter.value;
  }
}

function testReSave(name: string) {
  it(name, () => {
    const blob = readFileSync(`test/data/worlds/${name}.db`);
    const array = new Uint8Array(blob);
    const world = runGen(read(array));  
    const reSaved = runGen(write(world));
    
    expect(reSaved).toEqual(array);
  });
}

describe('re-saving file', () => {
  testReSave('v28');
  testReSave('v36');
});
