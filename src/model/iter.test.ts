import { combineGens, take } from './iter';

describe('take', () => {
  const data = [1, 2];
  test('less than', () => {
    expect([...take(1, data)]).toEqual([1]);
  });
  test('same amount', () => {
    expect([...take(2, data)]).toEqual(data);
  });
  test('more than', () => {
    expect([...take(3, data)]).toEqual(data);
  });
});

describe('take-generators', () => {
  function* gen() {
    let n = 0;
    while (true) {
      yield ++n;
    }
  }
  test('zero items', () => {
    expect([...take(0, gen())]).toEqual([]);
  });
  test('one item', () => {
    expect([...take(1, gen())]).toEqual([1]);
  });
  test('two items', () => {
    expect([...take(2, gen())]).toEqual([1, 2]);
  });
});

describe('combineGens', () => {
  const numCompare = (a: number, b: number) => a - b;
  function* evens() {
    let n = 2;
    while (true) {
      yield n;
      n += 2;
    }
  }
  function* odds() {
    let n = 1;
    while (true) {
      yield n;
      n += 2;
    }
  }
  test('evens + odds', () => {
    const gen = combineGens(evens(), odds(), numCompare);
    expect([...take(5, gen)]).toEqual([1, 2, 3, 4, 5]);
  });

  function* squares() {
    let n = 1;
    while (true) {
      yield n * n;
      n++;
    }
  }
  function* primes() {
    yield* [2, 3, 5, 7, 11, 13, 17];
  }
  test('squares + primes', () => {
    const gen = combineGens(squares(), primes(), numCompare);
    expect([...take(10, gen)]).toEqual([
      1, 2, 3, 4, 5,
      7, 9, 11, 13, 16,
    ]);
  });

  function *empty() {}
  function *one() { yield 1; }

  test('empty + empty', () => {
    const gen = combineGens(empty(), empty(), numCompare);
    expect([...gen]).toEqual([]);
  });

  test('empty + one', () => {
    const gen = combineGens(empty(), one(), numCompare);
    expect([...gen]).toEqual([1]);
  });

  test('one + one', () => {
    const gen = combineGens(one(), one(), numCompare);
    expect([...gen]).toEqual([1, 1]);
  });
});
