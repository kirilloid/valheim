import { take } from './iter';

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
