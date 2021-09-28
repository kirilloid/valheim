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
    expect(addDist({}, drop2)).toEqual(drop2);
    expect(addDist(drop1, drop2)).toEqual({
      foo: [1, 2],
      bar: [0, 1, 2],
      baz: [0, 1],
    });
  });

  describe('distributeDrop', () => {
    test('simple', () => {
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

    /*
    1     2+
    1/2 | 1
    1/2 | 1
    */
    test('one of each: simple', () => {
      const drop: GeneralDrop = {
        num: [1, 2],
        oneOfEach: true,
        options: [
          { item: 'foo' },
          { item: 'bar' },
        ]
      };
      expect(distributeDrop(drop)).toEqual({
        foo: [0.25, 0.75],
        bar: [0.25, 0.75],
      });
    });

    /*
    1     2                                   3+
    5/8 | 5/8 + 2/8*5/6 + 1/8*5/7 = 155/168 | 1
    2/8 | 2/8 + 5/8*2/3 + 1/8*2/7 = 118/168 | 1
    1/8 | 1/8 + 5/8*1/3 + 2/8*1/6 =  63/168 | 1
    */
    test('one of each: weights 1-1', () => {
      const drop: GeneralDrop = {
        num: [1, 1],
        oneOfEach: true,
        options: [
          { item: 'foo', weight: 5 },
          { item: 'bar', weight: 2 },
          { item: 'baz' },
        ]
      };
      expect(distributeDrop(drop)).toEqual({
        foo: [3/8, 5/8],
        bar: [6/8, 2/8],
        baz: [7/8, 1/8],
      });
    });
    test('one of each: weights 1-2', () => {
      const drop: GeneralDrop = {
        num: [1, 2],
        oneOfEach: true,
        options: [
          { item: 'bar', weight: 5 },
          { item: 'baz', weight: 2 },
          { item: 'foo' },
        ]
      };
      const dist = distributeDrop(drop);
      expect(Math.abs(dist['bar']![1]! - 130/168)).toBeLessThan(1e-10);
      expect(Math.abs(dist['baz']![1]! -  80/168)).toBeLessThan(1e-10);
      expect(Math.abs(dist['foo']![1]! -  42/168)).toBeLessThan(1e-10);
    });
    test('one of each: weights 1-3', () => {
      const drop: GeneralDrop = {
        num: [1, 3],
        oneOfEach: true,
        options: [
          { item: 'bar', weight: 5 },
          { item: 'baz', weight: 2 },
          { item: 'foo' },
        ]
      };
      const dist = distributeDrop(drop);
      expect(Math.abs(dist['bar']![1]! - 428/504)).toBeLessThan(1e-10);
      expect(Math.abs(dist['baz']![1]! - 328/504)).toBeLessThan(1e-10);
      expect(Math.abs(dist['foo']![1]! - 252/504)).toBeLessThan(1e-10);
    });
    test('one of each: weights 1-4', () => {
      const drop: GeneralDrop = {
        num: [1, 4],
        oneOfEach: true,
        options: [
          { item: 'bar', weight: 5 },
          { item: 'baz', weight: 2 },
          { item: 'foo' },
        ]
      };
      const dist = distributeDrop(drop);
      expect(Math.abs(dist['bar']![1]! - 149/168)).toBeLessThan(1e-10);
      expect(Math.abs(dist['baz']![1]! - 124/168)).toBeLessThan(1e-10);
      expect(Math.abs(dist['foo']![1]! - 105/168)).toBeLessThan(1e-10);
    });
    test('one of each: weights 1-2 same items', () => {
      const drop: GeneralDrop = {
        num: [1, 2],
        oneOfEach: true,
        options: [
          { item: 'bar', weight: 5 },
          { item: 'foo', weight: 2 },
          { item: 'foo' },
        ]
      };
      const dist = distributeDrop(drop);
      expect(Math.abs(dist['bar']![1]! - 130/168)).toBeLessThan(1e-10);
      expect(Math.abs(dist['foo']![1]! -  82/168)).toBeLessThan(1e-10);
      expect(Math.abs(dist['foo']![2]! -  20/168)).toBeLessThan(1e-10);
    });
  });
});
