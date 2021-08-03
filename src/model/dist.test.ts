import { GeneralDrop } from '../types';
import { add, mul, power, average, percentile, distributeDrop, DropDist, addDist } from './dist';

describe('add', () => {
  test('add <', () => {
    expect(add([], [1])).toEqual([0.5]);
  });
  test('add >', () => {
    expect(add([1], [])).toEqual([0.5]);
  });
  test('add =', () => {
    expect(add([1], [1])).toEqual([1]);
  });
});

describe('mul', () => {
  test('mul 1 x 1', () => {
    expect(mul([1], [1])).toEqual([1]);
  });
  test('mul 1-0 x 1-0', () => {
    expect(mul([0, 1], [0, 1])).toEqual([0, 0, 1]);
  });
  test('mul 1-1 x 1-1', () => {
    expect(mul([1, 1], [1, 1])).toEqual([1, 2, 1]);
  });
});

describe('pow', () => {
  test('1^10', () => {
    expect(power([1], 10)).toEqual([1]);
  });
  test('1-1 ^0', () => {
    expect(power([1, 1], 0)).toEqual([1]);
  });
  test('1-1 ^1', () => {
    expect(power([1, 1], 1)).toEqual([1, 1]);
  });
  test('1-1 ^2', () => {
    expect(power([1, 1], 2)).toEqual([1, 2, 1]);
  });
});

describe('avg', () => {
  test('1', () => {
    expect(average([1])).toEqual(0);
  });
  test('1-0', () => {
    expect(average([0, 1])).toEqual(1);
  });
  test('1-1 ^2', () => {
    expect(average([1, 2, 1])).toEqual(4);
  });
});

describe('percent', () => {
  test('1', () => {
    expect(percentile([1], 0)).toEqual(0);
    expect(percentile([1], 100)).toEqual(0);
  });
  test('1-0', () => {
    const data = [0.25, 0.25, 0.25, 0.25];
    expect(percentile(data, 10)).toEqual(0);
    expect(percentile(data, 50)).toEqual(1);
    expect(percentile(data, 90)).toEqual(3);
  });
});

describe('drop', () => {
  test('addDist', () => {
    const drop1: DropDist = {
      foo: [1, 2],
      bar: [0, 1],
    };
    const drop2: DropDist = {
      bar: [1, 2],
      baz: [0, 1],
    };

    expect(addDist(drop1, {})).toEqual(drop1);
    expect(addDist({}, drop1)).toEqual(drop1);
    expect(addDist(drop1, drop2)).toEqual({
      foo: [1, 2],
      bar: [1, 3],
      baz: [0, 1],
    });
  });

  test('distributeDrop', () => {
    const drop: GeneralDrop = {
      num: [1, 2],
      options: [
        { item: 'foo' },
        { item: 'bar' },
      ]
    };

    expect(distributeDrop(drop)).toEqual({
      foo: [3/8, 1/2, 1/8],
      bar: [3/8, 1/2, 1/8],
    });
  });
});
