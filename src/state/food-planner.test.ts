import { defaultState, parseState, serializeState, State } from './food-planner';

function testState(description: string, state: Partial<State>) {
  test(description, () => {
    const str = serializeState({ ...defaultState, ...state });
    const state2 = parseState(str);
    expect(state2).toEqual(state);
  });

}

describe('state', () => {
  test('parse empty', () => {
    expect(parseState('')).toEqual({});
  });
  test('parse foo', () => {
    expect(parseState('foo,,')).toEqual({ foods: ['foo', '', ''] });
  });
});

describe('serialize-parse', () => {
  testState('base case', { foods: ['foo', 'bar', ''] });
  testState('holes in food', { foods: ['foo', '', 'bar'] });
  testState('all fielst', { foods: ['foo', 'bar', 'baz'], days: 2, nightEat: true, players: 3, repeat: 0.75 });
});
