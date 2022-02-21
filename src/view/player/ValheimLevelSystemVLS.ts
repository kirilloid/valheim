import type { PlayerData } from './types';

enum Skill {
  Strength = 0,
  Agility = 1,
  Intelligence = 2,
  Focus = 3,
  Constitution = 4
}

type Skills = Record<typeof Skill[Skill], number>;

export type ExtraSkills = {
  exp: number;
  lvl: number;
  points: number;
  skills: Skills;
}

export function readExtraSkills(playerData: PlayerData): ExtraSkills | undefined {
  const texts = playerData.knownTexts;
  const exp = texts.get('playerExp');
  const lvl = texts.get('playerLevel');
  const pts = texts.get('playerAvailablePoints');
  if (exp == null || lvl == null || pts == null) return undefined;
  const skills: Skills = Object.fromEntries(Object.keys(Skill).map(skill => [skill, 0]));
  for (const [key, val] of texts.entries()) {
    const m = key.match(/^player(\d+)$/);
    if (m != null) {
      const num = +m[1]!;
      const skill = Skill[num];
      if (skill) skills[skill] = +val;
    }
  }
  return {
    exp: +exp|| 0,
    lvl: +lvl || 0,
    points: +pts || 0,
    skills,
  };
}
