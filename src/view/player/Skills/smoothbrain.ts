import { stableHashCode } from '../../../model/hash';

export const SkillCodeMap = new Map([
  'Blacksmithing',
  'PackHorse',
  'Evasion',
  'Tenacity',
  'Vitality',
  'Lumberjacking',
  'Building',
  'Ranching',
  'Alchemy',
  'Cooking',
  'Mining',
  'Sailing',
  'Farming',
].map(name => [stableHashCode(name), name]));
