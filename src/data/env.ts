import type { Biome } from "../types";

const COLD_DAY = 1;
const COLD_NIGHT = 2;
const COLD = COLD_DAY | COLD_NIGHT;
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
  'DeepForest_Mist': { emoji: '☀️', wind: [0.1, 0.6], light: [1.2, 1.5], flags: COLD_NIGHT },
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
  'Mistlands_clear': { emoji: '☀️', wind: [0.05, 0.2], light: [0.5, 1.2], flags: COLD_NIGHT },
  'Mistlands_rain': { emoji: '🌧️', wind: [0.05, 0.2], light: [0.5, 0.7], flags: WET | COLD_NIGHT | DARK },
  'Mistlands_thunder': { emoji: '⛈️', wind: [0.5, 1], light: [0.5, 0.8], flags: WET | COLD_NIGHT | DARK },
  'Queen': { emoji: '🟣', wind: [1, 1], light: [0.6, 0.6], flags: DARK },
  'Ashlands_ashrain': { emoji: '☔', wind: [0.1, 0.5], light: [0.4, 1.6], flags: 0 },
  'Ashlands_storm': { emoji: '⛈️', wind: [0.8, 1.0], light: [0.4, 0.8], flags: 0 },
  'Ashlands_meteorshower': { emoji: '', wind: [0.1, 0.5], light: [1, 1.2], flags: 0 },
  'Ashlands_misty': { emoji: '🌫️', wind: [0.1, 0.5], light: [0.6, 1.0], flags: 0 },
  'Ashlands_CinderRain': { emoji: '☔', wind: [0.75, 0.7], light: [0.8, 1.3], flags: 0 },
  'Ashlands_SeaStorm': { emoji: '⛈️', wind: [0.8, 1.0], light: [0.5, 0.77], flags: DARK },
  'Crypt': { emoji: '⬛', wind: [0, 0], light: [0, 0], flags: DARK },
  'SunkenCrypt': { emoji: '⬛', wind: [0, 0], light: [0, 0], flags: DARK },
  'Caves': { emoji: '⬛', wind: [0, 0], light: [0.1, 0.1], flags: DARK | FREEZE },
  'InfectedMine': { emoji: '⬛', wind: [0, 0], light: [0.1, 0.1], flags: DARK },
} as const;

export type ES = typeof envStates;
export type EnvId = keyof ES;

export type WeatherBalance = [EnvId, number][];

export const envSetup: Record<Biome, WeatherBalance> = {
  Meadows: [['Clear', 25], ['Rain', 1], ['Misty', 1], ['ThunderStorm', 1], ['LightRain', 1]],
  BlackForest: [['DeepForest_Mist', 20], ['Rain', 1], ['Misty', 1], ['ThunderStorm', 1]],
  Swamp: [['SwampRain', 1]],
  Mountain: [['SnowStorm', 1], ['Snow', 5]],
  DeepNorth: [['Twilight_SnowStorm', 1], ['Twilight_Snow', 2], ['Twilight_Clear', 1]],
  Plains: [['Heath_clear', 5], ['Misty', 1], ['LightRain', 1]],
  Ashlands: [['Ashlands_ashrain', 30], ['Ashlands_misty', 2], ['Ashlands_CinderRain', 4], ['Ashlands_storm', 1]],
  Mistlands: [['Mistlands_clear', 15], ['Mistlands_rain', 1], ['Mistlands_thunder', 1]],
  Ocean: [['Rain', 1], ['LightRain', 1], ['Misty', 1], ['Clear', 10], ['ThunderStorm', 1]],
};
