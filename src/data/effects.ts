import type { Effect } from '../types';
import { SkillType } from '../model/skills';

export const effects: Effect[] = [
  {
    id: 'BeltStrength',
    carryWeight: 150,
  },
  {
    id: 'Cold',
    healthRegen: 0.5,
    staminaRegen: 0.75,
  },
  {
    id: 'CorpseRun',
    runStamina: -0.75,
    jumpStamina: -0.75,
  },
  {
    id: 'Freezing',
    healthOverTime: [-1, 1],
    healthRegen: 0,
    staminaRegen: 0.4,
    damageModifiers: { fire: 'resistant' }
  },
  {
    id: 'GP_Eikthyr',
    time: 300,
    cooldown: 1200,
    runStamina: -0.6,
    jumpStamina: -0.6,
  },
  {
    id: 'GP_TheElder',
    time: 300,
    cooldown: 1200,
    attackModifier: [SkillType.WoodCutting, 1.6],
  },
  {
    id: 'GP_Bonemass',
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
    time: 300,
    cooldown: 1200,
    special: 'Tailwind',
  },
  {
    id: 'GP_Yagluth',
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
    time: 480, // +60 per comfort
    healthRegen: 1.5,
    staminaRegen: 2,
    xpModifier: 1.5,
  },
  {
    id: 'Resting',
    healthRegen: 3,
    staminaRegen: 4,
  },
  {
    id: 'SetEffect_TrollArmor',
    stealth: -0.25,
  },
  {
    id: 'Smoked',
    healthOverTime: [-2, 1],
  },
  {
    id: 'SoftDeath',
  },
  {
    id: 'Warm',
    staminaRegen: 2,
  },
  {
    id: 'Wet',
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
