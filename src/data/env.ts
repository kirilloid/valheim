import type { Biome } from "../types";

const COLD_NIGHT = 2;
const COLD = 3;
const FREEZE = 12;
const WET = 16;
const DARK = 32;
const RAIN = WET | DARK;

export const envStates = {
  'Clear': { emoji: '☀️', wind: [0.1, 0.6], light: [1, 1.7], flags: COLD_NIGHT },
  'Twilight_Clear': { emoji: '☀️', wind: [0.2, 0.6], light: [0.3, 0.5], flags: COLD },
  'Misty': { emoji: '🌫️', wind: [0.1, 0.3], light: [1, 1], flags: COLD_NIGHT },
  'Darklands_dark': { emoji: '☁️', wind: [0.1, 0.6], light: [0, 1], flags: COLD | DARK },
  'Heath_clear': { emoji: '☀️', wind: [0.4, 0.8], light: [1, 1.5], flags: COLD_NIGHT },
  'DeepForest_Mist': { emoji: '🌫️', wind: [0.1, 0.6], light: [1.2, 1.5], flags: COLD_NIGHT },
  'GDKing': { emoji: '🟣', wind: [0.1, 0.3], light: [1.4, 1.5], flags: COLD_NIGHT },
  'Rain': { emoji: '🌧️', wind: [0.5, 1], light: [0.5, 0.77], flags: COLD_NIGHT | RAIN },
  'LightRain': { emoji: '🌦️', wind: [0.1, 0.6], light: [0.8, 0.9], flags: COLD_NIGHT | RAIN },
  'ThunderStorm': { emoji: '⛈️', wind: [0.8, 1], light: [0.5, 0.77], flags: COLD_NIGHT | RAIN },
  'Eikthyr': { emoji: '🟣', wind: [0.9, 1], light: [0.5, 0.77], flags: COLD_NIGHT | DARK },
  'GoblinKing': { emoji: '🟣', wind: [0.5, 0.7], light: [0.6, 1], flags: DARK },
  'nofogts': { emoji: '', wind: [1, 1], light: [0.5, 0.77], flags: COLD_NIGHT | RAIN },
  'SwampRain': { emoji: '🌧️', wind: [0.1, 0.3], light: [0.5, 0.6], flags: COLD_NIGHT | WET },
  'Bonemass': { emoji: '🟣', wind: [0.1, 0.3], light: [0.4, 0.6], flags: COLD_NIGHT | WET },
  'Snow': { emoji: '🌨️', wind: [0.1, 0.6], light: [0.4, 1.2], flags: FREEZE },
  'Twilight_Snow': { emoji: '🌨️', wind: [0.3, 0.6], light: [0.5, 0.5], flags: COLD },
  'Twilight_SnowStorm': { emoji: '❄️', wind: [0.7, 1], light: [0.4, 0.4], flags: FREEZE | COLD_NIGHT },
  'SnowStorm': { emoji: '❄️', wind: [0.8, 1], light: [0.2, 0.7], flags: FREEZE | COLD_NIGHT },
  'Moder': { emoji: '🟣', wind: [1, 1], light: [0.5, 0.7], flags: FREEZE | COLD_NIGHT },
  'Ashrain': { emoji: '', wind: [0.1, 0.5], light: [0.8, 1.3], flags: 0 },
  'Crypt': { emoji: '⬛', wind: [0, 0], light: [0, 0], flags: DARK },
  'SunkenCrypt': { emoji: '⬛', wind: [0, 0], light: [0, 0], flags: DARK },
} as const;

export type ES = typeof envStates;
export type EnvId = keyof ES;

export type WeatherBalance = [EnvId, number][];

export const envSetup: Record<Biome, WeatherBalance> = {
  Meadows: [['Clear', 25], ['LightRain', 1], ['Rain', 1], ['Misty', 1], ['ThunderStorm', 1]],
  BlackForest: [['DeepForest_Mist', 20], ['Rain', 1], ['Misty', 1], ['ThunderStorm', 1]],
  Swamp: [['SwampRain', 1]],
  Mountain: [['SnowStorm', 1], ['Snow', 5]],
  DeepNorth: [['Twilight_SnowStorm', 1], ['Twilight_Snow', 2], ['Twilight_Clear', 1]],
  Plains: [['Heath_clear', 5], ['Misty', 1], ['LightRain', 1]],
  Ashlands: [['Ashrain', 1]],
  Mistlands: [['Darklands_dark', 1]],
  Ocean: [['Clear', 10], ['LightRain', 1], ['Rain', 1], ['Misty', 1], ['ThunderStorm', 1]],
};

const avgWind = {
  Meadows: 0.378,
  BlackForest: 0.385,
  Swamp: 0.2,
  Mountain: 0.442,
  DeepNorth: 0.538,
  Plains: 0.507,
  Ashlands: 0.3,
  Mistlands: 0.35,
  Ocean: 0.407,
};
