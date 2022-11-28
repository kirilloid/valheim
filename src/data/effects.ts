import type { Effect } from '../types';
import { SkillType } from '../model/skills';

export const effects: Effect[] = [
  {
    type: 'effect',
    id: 'BeltStrength',
    iconId: 'armor/BeltStrength',
    tier: 2,
    carryWeight: 150,
  },
  // Burning
  // Campfire
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
    id: 'Demister',
    iconId: 'armor/BeltStrength',
    tier: 6,
    special: 'Demister',
  },
  // Encumbered
  {
    type: 'effect',
    id: 'Freezing',
    tier: 4,
    healthOverTime: [-1, 1],
    healthRegen: 0,
    staminaRegen: 0.4,
    damageModifiers: { fire: 'resistant' }
  },
  // GoblinShaman_shield
  {
    type: 'effect',
    id: 'GP_Eikthyr',
    iconId: 'resource/TrophyEikhtyr',
    tier: 2,
    time: 300,
    cooldown: 1200,
    runStamina: -0.6,
    jumpStamina: -0.6,
  },
  {
    type: 'effect',
    id: 'GP_TheElder',
    iconId: 'resource/TrophyTheElder',
    tier: 3,
    time: 300,
    cooldown: 1200,
    attackModifier: [SkillType.WoodCutting, 1.6],
  },
  {
    type: 'effect',
    id: 'GP_Bonemass',
    iconId: 'resource/TrophyBonemass',
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
    iconId: 'resource/TrophyModer',
    tier: 5,
    time: 300,
    cooldown: 1200,
    special: 'Tailwind',
  },
  {
    type: 'effect',
    id: 'GP_Yagluth',
    iconId: 'resource/TrophyYagluth',
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
    id: 'GP_Queen',
    iconId: 'resource/TrophySeekerQueen',
    tier: 6,
    time: 300,
    cooldown: 1200,
    attackModifier: [SkillType.Pickaxes, 1.6],
    eitrRegen: 2, 
  },
  // Harpooned,
  {
    type: 'effect',
    id: 'Immobilized',
    iconId: 'piece/piece_trap_troll',
    tier: 6,
    time: 5,
    moveSpeed: -100,
  },
  // ImmobilizedLong,
  // Lightning,
  // Poison,
  // Potion_...
  {
    type: 'effect',
    id: 'Puke',
    iconId: 'resource/Pukeberries',
    tier: 2,
    time: 2,
    healthRegen: -1,
    staminaRegen: -1,
    moveSpeed: -0.5,
  },
  {
    type: 'effect',
    id: 'Rested',
    tier: 1,
    time: 480, // +60 per comfort
    healthRegen: 1.5,
    staminaRegen: 2,
    eitrRegen: 2,
    xpModifier: 1.5,
  },
  {
    type: 'effect',
    id: 'Resting',
    tier: 1,
    healthRegen: 3,
    staminaRegen: 4,
    eitrRegen: 4,
  },
  {
    type: 'effect',
    id: 'SE_Dvergr_Buff',
    tier: 6,
    attackModifier: [SkillType.All, 1.2],
  },
  {
    type: 'effect',
    id: 'SE_Dvergr_heal',
    tier: 6,
    healthOverTime: [400, 0.5],
  },
  // SE_Greydwarf_shaman_heal: same, but 20
  {
    type: 'effect',
    id: 'SetEffect_FenringArmor',
    tier: 4,
    damageModifiers: { fire: 'resistant' },
    skillModifier: [SkillType.Unarmed, 15],
  },
  {
    type: 'effect',
    id: 'SetEffect_MageArmor',
    iconId: 'armor/HelmetMage',
    tier: 6,
    skillModifier: [SkillType.ElementalMagic, 15],
    eitrRegen: 1.5,
  },
  {
    type: 'effect',
    id: 'SetEffect_RootArmor',
    iconId: 'armor/HelmetRoot',
    tier: 3,
    skillModifier: [SkillType.Bows, 15],
  },
  {
    type: 'effect',
    id: 'SetEffect_TrollArmor',
    iconId: 'armor/HelmetTrollLeather',
    tier: 2,
    skillModifier: [SkillType.Sneak, 15],
  },
  {
    type: 'effect',
    id: 'Shelter',
    tier: 1,
    comfort: { value: 2 }
  },
  {
    type: 'effect',
    id: 'Slimed',
    tier: 6,
    time: 1,
    damageModifiers: { fire: 'veryWeak' },
    moveSpeed: -0.5,
  },
  {
    type: 'effect',
    id: 'SlowFall',
    tier: 6,
    fallDamage: 0,
  },
  {
    type: 'effect',
    id: 'Smoked',
    tier: 1,
    healthOverTime: [-2, 1],
  },
  {
    type: 'effect',
    id: 'Staff_shield',
    tier: 6,
    time: 120,
    absorbDamage: [200, 5],
  },

  // Spirit: ttl=3, interval=0.5
  {
    type: 'effect',
    id: 'Tared',
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
    eitrRegen: 2,
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
