import type { Effect } from '../types';
import { SkillType } from '../model/skills';

export const effects: Effect[] = [
  {
    type: 'effect',
    id: 'BeltStrength',
    tier: 2,
    carryWeight: 150,
  },
  {
    type: 'effect',
    id: 'Cold',
    tier: 0,
    healthRegen: 0.5,
    staminaRegen: 0.75,
  },
  {
    type: 'effect',
    id: 'CorpseRun',
    tier: 0,
    time: 50,
    runStamina: -0.75,
    jumpStamina: -0.75,
    damageModifiers: {
      blunt: 'veryResistant',
      pierce: 'veryResistant',
      slash: 'veryResistant',
    },
  },
  {
    type: 'effect',
    id: 'Freezing',
    tier: 4,
    healthOverTime: [-1, 1],
    healthRegen: 0,
    staminaRegen: 0.4,
    damageModifiers: { fire: 'resistant' }
  },
  {
    type: 'effect',
    id: 'GP_Eikthyr',
    tier: 2,
    time: 300,
    cooldown: 1200,
    runStamina: -0.6,
    jumpStamina: -0.6,
  },
  {
    type: 'effect',
    id: 'GP_TheElder',
    tier: 3,
    time: 300,
    cooldown: 1200,
    attackModifier: [SkillType.WoodCutting, 1.6],
  },
  {
    type: 'effect',
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
    type: 'effect',
    id: 'GP_Moder',
    tier: 5,
    time: 300,
    cooldown: 1200,
    special: 'Tailwind',
  },
  {
    type: 'effect',
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
    type: 'effect',
    id: 'Puke',
    tier: 2,
    time: 15,
    moveSpeed: -0.5,
  },
  {
    type: 'effect',
    id: 'Rested',
    tier: 1,
    time: 480, // +60 per comfort
    healthRegen: 1.5,
    staminaRegen: 2,
    xpModifier: 1.5,
  },
  {
    type: 'effect',
    id: 'Resting',
    tier: 1,
    healthRegen: 3,
    staminaRegen: 4,
  },
  {
    type: 'effect',
    id: 'SetEffect_TrollArmor',
    tier: 2,
    stealth: -0.25,
  },
  {
    type: 'effect',
    id: 'Shelter',
    tier: 1,
    comfort: { value: 2 }
  },
  {
    type: 'effect',
    id: 'Smoked',
    tier: 1,
    healthOverTime: [-2, 1],
  },
  {
    type: 'effect',
    id: 'Tarred',
    tier: 5,
    time: 10,
    damageModifiers: {
      fire: 'veryWeak',
    },
    moveSpeed: -0.5,
  },  {
    type: 'effect',
    id: 'SoftDeath',
    tier: 0,
    time: 600,
  },
  {
    type: 'effect',
    id: 'Warm',
    tier: 0,
    staminaRegen: 2,
  },
  {
    type: 'effect',
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
