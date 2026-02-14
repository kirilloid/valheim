import { Biome, DamageType } from '../types'
import { SkillType } from '../model/skills';

export const damage: Record<DamageType, string> = {
  blunt: '🧱',
  slash: '✂️',
  pierce: '💉',
  chop: '🪓',
  pickaxe: '⛏️',
  fire: '🔥',
  frost: '❄️',
  lightning: '⚡',
  poison: '🧪',
  spirit: '☄️',
};

export const skill: Record<SkillType, string> = {
  [SkillType.Swords]: '🗡️',
  [SkillType.Knives]: '🔪',
  [SkillType.Clubs]: '🏏',
  [SkillType.Polearms]: '🔱',
  [SkillType.Spears]: '',
  [SkillType.Blocking]: '🛡️',
  [SkillType.Axes]: '🪓',
  [SkillType.Bows]: '🏹',
  [SkillType.ElementalMagic]: '⚡',
  [SkillType.BloodMagic]: '🩸',
  [SkillType.Unarmed]: '👐',
  [SkillType.Pickaxes]: '⛏️',
  [SkillType.WoodCutting]: '🪵',
  [SkillType.Crossbows]: '🏹',
  [SkillType.Jump]: '🔥',
  [SkillType.Sneak]: '👟',
  [SkillType.Run]: '🏃‍♂️',
  [SkillType.Swim]: '🏊',
  [SkillType.Fishing]: '🎣',
  [SkillType.Cooking]: '👨‍🍳',
  [SkillType.Farming]: '👨‍🌾',
  [SkillType.Crafting]: '⚒',
  [SkillType.Ride]: '🏇',
  [SkillType.Dodge]: '🧻',
  [SkillType.All]: '*',
};

export const biome: Record<Biome, string> = {
  Meadows: '⛳',
  BlackForest: '🌳',
  Swamp: '🐸',
  Mountain: '🏔️',
  Plains: '🌺',
  Ocean: '🌊',
  Mistlands: '🌫️',
  DeepNorth: '❄️',
  Ashlands: '🔥',
};


































