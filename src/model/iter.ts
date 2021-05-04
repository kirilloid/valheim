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