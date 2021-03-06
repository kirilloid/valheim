import { Biome, DamageType } from '../types'
import { SkillType } from '../model/skills';

export const damage: Record<DamageType, string> = {
  blunt: '๐งฑ',
  slash: 'โ๏ธ',
  pierce: '๐',
  chop: '๐ช',
  pickaxe: 'โ๏ธ',
  fire: '๐ฅ',
  frost: 'โ๏ธ',
  lightning: 'โก',
  poison: '๐งช',
  spirit: 'โ๏ธ',
};

export const skill: Record<SkillType, string> = {
  [SkillType.Swords]: '๐ก๏ธ',
  [SkillType.Knives]: '๐ช',
  [SkillType.Clubs]: '๐',
  [SkillType.Polearms]: '๐ฑ',
  [SkillType.Spears]: '',
  [SkillType.Blocking]: '๐ก๏ธ',
  [SkillType.Axes]: '๐ช',
  [SkillType.Bows]: '๐น',
  [SkillType.Unarmed]: '๐',
  [SkillType.Pickaxes]: 'โ๏ธ',
  [SkillType.WoodCutting]: '๐ชต',
  [SkillType.Jump]: '๐ฅ',
  [SkillType.Sneak]: '๐',
  [SkillType.Run]: '๐โโ๏ธ',
  [SkillType.Swim]: '๐',
  [SkillType.Ride]: '๐',
};

export const biome: Record<Biome, string> = {
  Meadows: '๐ฟ',
  BlackForest: '๐ณ',
  Swamp: '๐ธ',
  Mountain: '๐๏ธ',
  Plains: '๐บ',
  Ocean: '๐',
  Mistlands: '๐ซ๏ธ',
  DeepNorth: 'โ๏ธ',
  Ashlands: 'โฑ๏ธ',
};


































