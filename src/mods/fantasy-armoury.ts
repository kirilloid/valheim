import type { GameObject, Shield, Weapon } from '../types';
import { SkillType } from '../model/skills';

const CRAFT_TIME = 3;

const shields: Shield[] = [
  {
    type: 'shield', slot: 'secondary',
    id: 'Shield_09_FA',
    emoji: '🛡️',
    tier: 3,
    stack: 1,
    maxLvl: 3,
    weight: NaN,
    moveSpeed: -0.05,
    block: [NaN, NaN],
    parryForce: NaN,
    parryBonus: NaN,
    skill: SkillType.Blocking,
    durability: [NaN, NaN],
    recipe: {
      type: 'craft_upg',
      time: CRAFT_TIME,
      materials: { Bronze: 10, Wood: 2 },
      materialsPerLevel: { Bronze: 3, Wood: 1, Iron: 3, DeerHide: 3 },
      source: { station: 'forge', level: 1 },
    }
  },
  {
    type: 'shield', slot: 'secondary',
    id: 'Shield_08_FA',
    emoji: '🛡️',
    tier: 3,
    stack: 1,
    maxLvl: 3,
    weight: NaN,
    moveSpeed: -0.05,
    block: [NaN, NaN],
    parryForce: NaN,
    parryBonus: NaN,
    skill: SkillType.Blocking,
    durability: [NaN, NaN],
    recipe: {
      type: 'craft_upg',
      time: CRAFT_TIME,
      materials: { Bronze: 10, Wood: 2 },
      materialsPerLevel: { Bronze: 3, Wood: 1, Iron: 3, DeerHide: 3 },
      source: { station: 'forge', level: 1 },
    }
  },
  {
    type: 'shield', slot: 'secondary',
    id: 'Shield_07_FA',
    emoji: '🛡️',
    tier: 3,
    stack: 1,
    maxLvl: 3,
    weight: NaN,
    moveSpeed: -0.05,
    block: [NaN, NaN],
    parryForce: NaN,
    parryBonus: NaN,
    skill: SkillType.Blocking,
    durability: [NaN, NaN],
    recipe: {
      type: 'craft_upg',
      time: CRAFT_TIME,
      materials: { Bronze: 10, Wood: 2 },
      materialsPerLevel: { Bronze: 3, Wood: 1, Iron: 3, DeerHide: 3 },
      source: { station: 'forge', level: 1 },
    }
  },
  {
    type: 'shield', slot: 'secondary',
    id: 'Shield_06_FA',
    emoji: '🛡️',
    tier: 3,
    stack: 1,
    maxLvl: 3,
    weight: NaN,
    moveSpeed: -0.05,
    block: [NaN, NaN],
    parryForce: NaN,
    parryBonus: NaN,
    skill: SkillType.Blocking,
    durability: [NaN, NaN],
    recipe: {
      type: 'craft_upg',
      time: CRAFT_TIME,
      materials: { Bronze: 10, Wood: 2 },
      materialsPerLevel: { Bronze: 3, Wood: 1, Iron: 3, DeerHide: 3 },
      source: { station: 'forge', level: 1 },
    }
  },
  {
    type: 'shield', slot: 'secondary',
    id: 'Shield_05_FA',
    emoji: '🛡️',
    tier: 3,
    stack: 1,
    maxLvl: 3,
    weight: NaN,
    moveSpeed: -0.05,
    block: [NaN, NaN],
    parryForce: NaN,
    parryBonus: NaN,
    skill: SkillType.Blocking,
    durability: [NaN, NaN],
    recipe: {
      type: 'craft_upg',
      time: CRAFT_TIME,
      materials: { Bronze: 10, Wood: 2 },
      materialsPerLevel: { Bronze: 3, Wood: 1, Iron: 3, DeerHide: 3 },
      source: { station: 'forge', level: 1 },
    }
  },
  {
    type: 'shield', slot: 'secondary',
    id: 'Shield_04_FA',
    emoji: '🛡️',
    tier: 3,
    stack: 1,
    maxLvl: 3,
    weight: NaN,
    moveSpeed: -0.05,
    block: [NaN, NaN],
    parryForce: NaN,
    parryBonus: NaN,
    skill: SkillType.Blocking,
    durability: [NaN, NaN],
    recipe: {
      type: 'craft_upg',
      time: CRAFT_TIME,
      materials: { Bronze: 10, Wood: 2 },
      materialsPerLevel: { Bronze: 3, Wood: 1, Iron: 3, DeerHide: 3 },
      source: { station: 'forge', level: 1 },
    }
  },
  {
    type: 'shield', slot: 'secondary',
    id: 'Shield_03_FA',
    emoji: '🛡️',
    tier: 3,
    stack: 1,
    maxLvl: 3,
    weight: NaN,
    moveSpeed: -0.05,
    block: [NaN, NaN],
    parryForce: NaN,
    parryBonus: NaN,
    skill: SkillType.Blocking,
    durability: [NaN, NaN],
    recipe: {
      type: 'craft_upg',
      time: CRAFT_TIME,
      materials: { Bronze: 10, Wood: 2 },
      materialsPerLevel: { Bronze: 3, Wood: 1, Iron: 3, DeerHide: 3 },
      source: { station: 'forge', level: 1 },
    }
  },
  {
    type: 'shield', slot: 'secondary',
    id: 'Shield_02_FA',
    emoji: '🛡️',
    tier: 3,
    stack: 1,
    maxLvl: 3,
    weight: NaN,
    moveSpeed: -0.05,
    block: [NaN, NaN],
    parryForce: NaN,
    parryBonus: NaN,
    skill: SkillType.Blocking,
    durability: [NaN, NaN],
    recipe: {
      type: 'craft_upg',
      time: CRAFT_TIME,
      materials: { Bronze: 10, Wood: 2 },
      materialsPerLevel: { Bronze: 3, Wood: 1, Iron: 3, DeerHide: 3 },
      source: { station: 'forge', level: 1 },
    }
  },
  {
    type: 'shield', slot: 'secondary',
    id: 'Shield_01_FA',
    emoji: '🛡️',
    tier: 3,
    stack: 1,
    maxLvl: 3,
    weight: NaN,
    moveSpeed: -0.05,
    block: [NaN, NaN],
    parryForce: NaN,
    parryBonus: NaN,
    skill: SkillType.Blocking,
    durability: [NaN, NaN],
    recipe: {
      type: 'craft_upg',
      time: CRAFT_TIME,
      materials: { Bronze: 10, Wood: 2 },
      materialsPerLevel: { Bronze: 3, Wood: 1, Iron: 3, DeerHide: 3 },
      source: { station: 'forge', level: 1 },
    }
  },
];

const weapons: Weapon[] = [

];

export const data: GameObject[] = [
  ...shields,
  ...weapons,
].map(item => ({ ...item, mod: 'FantasyArmoury' }) as GameObject)
