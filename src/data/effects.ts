import type { Effect } from '../types';
import { SkillType } from '../model/skills';
import { dmg } from '../model/game';

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
    id: 'ChainLightning',
    iconId: 'icon/lightning_32',
    tier: 7,
    Aoe: {
      damage: dmg({ lightning: 75 }),
      backstabBonus: 1,
      radius: 8,
      ttl: 3,
      chainTargets: [2, 4],
    }
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
  // Frost
  {
    type: 'effect',
    id: 'GoblinShaman_shield',
    iconId: 'creature/GoblinShaman',
    tier: 5,
    time: 40,
    absorbDamage: [100, 100],
  },
  {
    type: 'effect',
    id: 'GP_Eikthyr',
    iconId: 'resource/TrophyEikthyr',
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
    iconId: 'resource/TrophyDragonQueen',
    tier: 5,
    time: 300,
    cooldown: 1200,
    special: 'Tailwind',
  },
  {
    type: 'effect',
    id: 'GP_Yagluth',
    iconId: 'resource/TrophyGoblinKing',
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
  {
    type: 'effect',
    id: 'GP_Fader',
    iconId: 'resource/TrophyFader',
    tier: 7,
    time: 300,
    cooldown: 1200,
    carryWeight: 300,
    moveSpeed: 0.1,
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
  {
    type: 'effect',
    id: 'ImmobilizedAshlands',
    iconId: 'piece/piece_trap_troll',
    tier: 7,
    time: 10,
    moveSpeed: -100,
  },
  {
    type: 'effect',
    id: 'ImmobilizedLong',
    disabled: true,
    iconId: 'piece/piece_trap_troll',
    tier: 7,
    time: 60,
    moveSpeed: -100,
  },
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
    id: 'Potion_BugRepellent',
    iconId: 'resource/MeadBugRepellent',
    tier: 3,
    time: 600,
    pheromones: {
      target: 'Deathsquito',
      flee: true,
    },
  },
  {
    type: 'effect',
    id: 'Potion_Bzerker',
    iconId: 'resource/MeadBzerker',
    tier: 3,
    time: 20,
    attackStamina: -0.8,
    blockStamina: -0.8,
    dodgeStamina: -0.8,
  },
  {
    type: 'effect',
    id: 'Potion_hasty',
    iconId: 'resource/MeadHasty',
    tier: 3,
    time: 600,
    moveSpeed: 0.15,
    skillModifiers: {
      [SkillType.Run]: 10,
    },
  },
  {
    type: 'effect',
    id: 'Potion_LightFoot',
    iconId: 'resource/MeadLightfoot',
    tier: 3,
    time: 600,
    jumpStamina: -0.3,
    jumpModifier: 0.2,
  },
  {
    type: 'effect',
    id: 'Potion_strength',
    iconId: 'resource/MeadStrength',
    tier: 3,
    time: 300,
    carryWeight: 250,
    cooldown: 120,
  },
  {
    type: 'effect',
    id: 'Potion_swimmer',
    iconId: 'resource/MeadSwimmer',
    tier: 3,
    time: 300,
    swimStamina: -0.5,
  },
  {
    type: 'effect',
    id: 'Potion_tamer',
    iconId: 'resource/MeadTamer',
    tier: 3,
    time: 600,
    special: 'TameBoost',
  },
  {
    type: 'effect',
    id: 'Potion_TrollPheromones',
    iconId: 'resource/MeadTrollPheromones',
    tier: 3,
    time: 300,
    pheromones: {
      target: 'Troll',
      spawnChanceOverride: 0.25,
      spawnMinLevel: 2,
      levelUpMultiplier: 1.25,
      maxInstanceOverride: 2,
    },
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
    id: 'SE_Dvergr_buff',
    iconId: 'effect/Rested',
    tier: 6,
    time: 20,
    attackModifier: [SkillType.All, 1.2],
  },
  {
    type: 'effect',
    id: 'SE_Dvergr_heal',
    iconId: 'effect/heal',
    disabled: true,
    tier: 6,
    time: 4,
    healthOverTime: [400, 0.5],
  },
  {
    // radius = 4.32
    type: 'effect',
    id: 'SE_Greydwarf_shaman_heal',
    iconId: 'effect/heal',
    disabled: true,
    tier: 6,
    healthOverTime: [20, 0.5],
    time: 4,
  },
  {
    type: 'effect',
    id: 'SetEffect_FenringArmor',
    iconId: 'armor/HelmetFenring',
    tier: 4,
    damageModifiers: { fire: 'resistant' },
    skillModifiers: { [SkillType.Unarmed]: 15 },
  },
  {
    type: 'effect',
    id: 'SetEffect_AshlandsMediumArmor',
    iconId: 'armor/HelmetAshlandsMediumHood',
    tier: 4,
    runStamina: -0.1,
    jumpStamina: -0.1,
    attackStamina: -0.2,
    damageValueModifier: ['pierce', 0.1],
  },
  {
    type: 'effect',
    id: 'SetEffect_FishingHat',
    iconId: 'armor/HelmetFishingHat',
    tier: 6,
    skillModifiers: { [SkillType.Fishing]: 20, [SkillType.Swim]: 20 },
  },
  {
    type: 'effect',
    id: 'SetEffect_MageArmor',
    iconId: 'armor/HelmetMage',
    disabled: true,
    tier: 6,
    skillModifiers: { [SkillType.ElementalMagic]: 15 },
    eitrRegen: 1.5,
  },
  {
    type: 'effect',
    id: 'SetEffect_RootArmor',
    iconId: 'armor/HelmetRoot',
    tier: 3,
    skillModifiers: { [SkillType.Bows]: 15 },
  },
  {
    type: 'effect',
    id: 'SetEffect_TrollArmor',
    iconId: 'armor/HelmetTrollLeather',
    tier: 2,
    skillModifiers: { [SkillType.Sneak]: 15 },
  },
  {
    type: 'effect',
    id: 'SetEffect_HarvesterArmor',
    iconId: 'armor/HelmetStrawHat',
    tier: 2,
    skillModifiers: { [SkillType.Farming]: 25 },
  },
  // SetEffect_WolfArmor: frost resistance
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
  },
  {
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
  {
    type: 'effect',
    id: 'WindRun',
    iconId: 'armor/CapeAsksvin',
    tier: 7,
    time: 0,
    windMovementModifier: 5,
  },
  {
    type: 'effect',
    id: 'Wishbone',
    iconId: 'weapon/Wishbone',
    tier: 2,
    special: 'Wishbone',
    time: 0,
  },
];
