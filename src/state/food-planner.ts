import { parseNumber } from "./utils";

export type State = {
  foods: [string, string, string];
  nightEat: boolean;
  players: number;
  days: number;
  repeat: number;
};

export const defaultState: State = {
  foods: ['CookedMeat', 'Raspberry', ''],
  nightEat: false,
  players: 1,
  days: 1,
  repeat: 1,
};

function parseBoolean(arg: string | undefined): boolean | undefined {
  return arg == null ? arg : !!arg;
}

export const pageName = 'food-planner';

export function parseState(string: string | undefined): Partial<State> {
  const match = string?.match(/(\w*,\w*,\w*)(-night-eat)?(?:-players-(\d+))?(?:-days-(\d+))?(?:-repeat-(\d+(?:\.\d+)?))?/);
  if (match == null) return {};
  const [f1 = '', f2 = '', f3 = ''] = match[1]?.split(',') ?? [];
  return {
    foods: [f1, f2, f3],
    nightEat: parseBoolean(match[2]),
    players: parseNumber(match[3]),
    days: parseNumber(match[4]),
    repeat: parseNumber(match[5]),
  }
}

export function serializeState(state: State): string {
  return [
    state.foods.join(','),
    state.nightEat ? '-night-eat' : '',
    state.players === 1 ? '' : '-players-' + state.players,
    state.days === 1 ? '' : '-days-' + state.days,
    state.repeat === 1 ? '' : '-repeat-' + state.repeat,
  ].join('');
}

