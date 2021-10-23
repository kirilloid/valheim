export function take<T>(number: number, items: Iterable<T>): Iterable<T> {
  const iter = items[Symbol.iterator]();
  return {
    [Symbol.iterator]() {
      return {
        next() {
          if (number === 0) return { done: true, value: undefined };
          number--;
          return iter.next();
        }
      } 
    }
  }
}

export function *combineGens<T, S = T>(g1: Generator<T, void, void>, g2: Generator<S, void, void>, comparator: (v1: T, v2: S) => number): Generator<T | S, void, void> {
  let v1 = g1.next();
  let v2 = g2.next();
  while (true) {
    if (!v2.done && !v1.done) {
      if (comparator(v1.value, v2.value) <= 0) {
        yield v1.value;
        v1 = g1.next();
      } else {
        yield v2.value;
        v2 = g2.next();
      }
    } else if (!v2.done) {
      yield v2.value;
      v2 = g2.next();
    } else if (!v1.done) {
      yield v1.value;
      v1 = g1.next();
    } else {
      return;
    }
  }
}
