import { toPrecision } from './helpers';

test('toPrecision', () => {
  expect(toPrecision(3, 110)).toBe('110');
  expect(toPrecision(3, 5.5)).toBe('5.5');
  expect(toPrecision(3, 10/3)).toBe('3.33');
  expect(toPrecision(3, 10/7)).toBe('1.43');
  expect(toPrecision(3, 1)).toBe('1');
});
