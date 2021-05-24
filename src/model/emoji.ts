import { Biome, DamageType } from "../types"
import { SkillType } from "./skills";

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
  [SkillType.Unarmed]: '👐',
  [SkillType.Pickaxes]: '⛏️',
  [SkillType.WoodCutting]: '🪵',
  [SkillType.Jump]: '🔥',
  [SkillType.Sneak]: '👟',
  [SkillType.Run]: '🏃‍♂️',
  [SkillType.Swim]: '🏊',
};

export const biome: Record<Biome, string> = {
  [Biome.Meadows]: '🌿',
  [Biome.BlackForest]: '🌳',
  [Biome.Swamp]: '🐸',
  [Biome.Mountain]: '🏔️',
  [Biome.Plains]: '🌺',
  [Biome.Ocean]: '🌊',
  [Biome.Mistlands]: '🌫️',
  [Biome.DeepNorth]: '❄️',
  [Biome.Ashlands]: '⚱️',
};


































