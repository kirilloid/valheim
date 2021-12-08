import { PackageWriter } from '../Package';
import { IntBinMap } from './BinMap';

function save(map: IntBinMap): Uint8Array {
  const writer = new PackageWriter();
  map.save(writer);
  return writer.flush();
}

function fromPairs(pairs: [number, number][]): Uint8Array {
  const size = pairs.length;
  const bytes = new Uint8Array(size * 8 + 1);
  const view = new DataView(bytes.buffer, 1);
  bytes[0] = size;
  for (let i = 0; i < size; i++) {
    view.setInt32(i * 8, pairs[i]![0], true);
    view.setInt32(i * 8 + 4, pairs[i]![1], true);
  }
  return bytes;
}

describe('basic implementation', () => {
  test('saving the same map', () => {
    const map = new IntBinMap(fromPairs([[1, 1]]));
    const result = save(map);
    expect(result).toEqual(fromPairs([[1, 1]]));
  });

  test('saving updated value', () => {
    const map = new IntBinMap(fromPairs([[1, 1]]));
    map.set(1, 2);
    expect(map.get(1)).toBe(2);
    const result = save(map);
    expect(result).toEqual(fromPairs([[1, 2]]));
  });

  test('saving with new value', () => {
    const map = new IntBinMap(fromPairs([[1, 1]]));
    map.set(2, 2);
    expect(map.get(2)).toBe(2);
    const result = save(map);
    expect(result).toEqual(fromPairs([[1, 1], [2, 2]]));
  });

  test('deleting a key', () => {
    const map = new IntBinMap(fromPairs([[1, 1], [2, 2]]));
    map.delete(2);
    map.set(3, 3);
    const result = save(map);
    expect(result).toEqual(fromPairs([[1, 1], [3, 3]]));
  });
});

describe('iterators', () => {
  test('simpleton', () => {
    const map = new IntBinMap(fromPairs([[1, 1]]));
    expect([...map.keys()]).toEqual([1]);
    expect([...map.values()]).toEqual([1]);
    expect([...map.entries()]).toEqual([[1, 1]]);
  });

  test('mutated value', () => {
    const map = new IntBinMap(fromPairs([[1, 1], [2, 2]]));
    map.delete(2);
    map.set(3, 3);
    expect([...map.keys()]).toEqual([1, 3]);
    expect([...map.values()]).toEqual([1, 3]);
    expect([...map.entries()]).toEqual([[1, 1], [3, 3]]);
  });
});
