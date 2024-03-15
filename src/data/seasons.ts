import type { Season, Pair } from "../types";

export type PeriodDate = { date: number; month: number };

export const seasonRange: Record<Season, Pair<PeriodDate>> = {
  helloween: [{ date: 1, month: 10 }, { date: 6, month: 11 }],
  midsummer: [{ date: 1, month: 6 }, { date: 6, month: 7 }],
  christmas: [{ date: 1, month: 12 }, { date: 6, month: 1 }],
};
