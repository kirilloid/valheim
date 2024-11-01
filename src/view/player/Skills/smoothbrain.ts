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
  // 'Cooking',
  'Mining',
  'Sailing',
  // 'Farming',
  'Dual Axes',
  'Dual Clubs',
  'Dual Knives',
  'Dual Swords',
  'Dual Offhand',
].map(name => [stableHashCode(name), name]));
