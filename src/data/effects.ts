import type { Effect } from '../types';
import { SkillType } from '../model/skills';

export const effects: Effect[] = [
  {
    id: 'BeltStrength',
    tier: 2,
    carryWeight: 150,
  },
  {
    id: 'Cold',
    tier: 0,
    healthRegen: 0.5,
    staminaRegen: 0.75,
  },
  {
    id: 'CorpseRun',
    tier: 0,
    runStamina: -0.75,
    jumpStamina: -0.75,
  },
  {
    id: 'Freezing',
    tier: 4,
    healthOverTime: [-1, 1],
    healthRegen: 0,
    staminaRegen: 0.4,
    damageModifiers: { fire: 'resistant' }
  },
  {
    id: 'GP_Eikthyr',
    tier: 2,
    time: 300,
    cooldown: 1200,
    runStamina: -0.6,
    jumpStamina: -0.6,
  },
  {
    id: 'GP_TheElder',
    tier: 3,
    time: 300,
    cooldown: 1200,
    attackModifier: [SkillType.WoodCutting, 1.6],
  },
  {
    id: 'GP_Bonemass',
    tier: 4,
    time: 300,
    cooldown: 1200,
    damageModifiers: {
      blunt: 'resistant',
      pierce: 'resistant',
      slash: 'resistant',
    }
  },
  {
    id: 'GP_Moder',
    tier: 5,
    time: 300,
    cooldown: 1200,
    special: 'Tailwind',
  },
  {
    id: 'GP_Yagluth',
    tier: 5,
    time: 300,
    cooldown: 1200,
    damageModifiers: {
      fire: 'resistant',
      frost: 'resistant',
      lightning: 'resistant',
    }
  },
  {
    id: 'Rested',
    tier: 1,
    time: 480, // +60 per comfort
    healthRegen: 1.5,
    staminaRegen: 2,
    xpModifier: 1.5,
  },
  {
    id: 'Resting',
    tier: 1,
    healthRegen: 3,
    staminaRegen: 4,
  },
  {
    id: 'SetEffect_TrollArmor',
    tier: 2,
    stealth: -0.25,
  },
  {
    id: 'Shelter',
    tier: 1,
    comfort: { value: 2 }
  },
  {
    id: 'Smoked',
    tier: 1,
    healthOverTime: [-2, 1],
  },
  {
    id: 'Tarred',
    tier: 5,
    // speed -50% ?
  },  {
    id: 'SoftDeath',
    tier: 0,
  },
  {
    id: 'Warm',
    tier: 0,
    staminaRegen: 2,
  },
  {
    id: 'Wet',
    tier: 0,
    time: 120,
    healthRegen: 0.75,
    staminaRegen: 0.85,
    damageModifiers: {
      fire: 'resistant',
      frost: 'weak',
      lightning: 'weak',
    }
  },
];
