type Rarity = 'Generic' | 'Magic' | 'Rare' | 'Epic' | 'Legendary';
type EffectType =
| `Modify${'' | 'Physical' | 'Elemental'}Damage`
| 'ModifyDurability'
| 'ReduceWeight'
| 'RemoveSpeedPenalty'
| 'ModifyBlockPower'
| 'ModifyParry'
| 'ModifyArmor'
| 'ModifyBackstab'
| `Increase${'Health' | 'Stamina'}`
| 'ModifyHealthRegen'
| 'AddHealthRegen'
| 'ModifyStaminaRegen'
| `Add${'Blunt' | 'Slashing' | 'Piercing' | 'Fire' | 'Frost' | 'Lightning' | 'Poison' | 'Spirit'}Damage`
| `Add${'Fire' | 'Forst' | 'Lighting' | 'Poison' | 'Spirit'}Resistance`
| `Add${'Fire' | 'Frost' | 'Lightning' | 'Poison' | 'Spirit' | 'Elemental' | 'Blunt' | 'Slashing' | 'Piercing' | 'Chopping' | 'Physical'}ResistancePercentage`
| 'ModifyMovementSpeed'
| `Modify${'Sprint' | 'Jump' | 'Attack' | 'Block'}StaminaUse`
| 'Indestructible'
| 'Weightless'
| 'AddCarryWeight'
| 'LifeSteal'
| 'ModifyAttackSpeed'
| 'Throwable'
| 'Waterproof'
| 'Paralyze'
| 'DoubleJump'
| 'WaterWalking'
| 'ExplosiveArrows'
| 'QuickDraw'
| `Add${'Swords' | 'Knives' | 'Clubs' | 'Polearms' | 'Spears' | 'Blocking' | 'Axes' | 'Bows' | 'Unarmed' | 'Pickaxes' | 'Movement'}Skill`
| 'ModifyStaggerDuration'
| 'QuickLearner'
| 'FreeBuild'
| 'RecallWeapon'
| 'ReflectDamage'
| 'AvoidDamageTaken'
| 'StaggerOnDamageTaken'
| 'FeatherFall'
| 'ModifyDiscoveryRadius'
| 'Comfortable'
| `Modify${'MovememntSpeed' | 'HealthRegen' | 'StaminaRegen' | 'Armor' | 'Damage' | 'BlockPower' | 'Parry' | 'AttackSpeed'}LowHealth`
| `${'AvoidDamageTaken' | 'LifeSteal'}LowHealth`
| 'Glowing'
| 'Executioner'
| 'Riches'
| 'Opportunist'
| 'Duelist'
| 'Immovable'
| 'ModifyStaggerDamage'
| 'Luck'
| 'ModifyParryWindow'
| 'Slow'
| 'Bulwark'
| 'Undying'
| 'FrostDamageAOE'
| 'Berserker'

type EpicLootData = {
  rarity: Rarity;
  effects: Partial<Record<EffectType, number>>;
}

const defaultItem: EpicLootData = {
  rarity: 'Generic',
  effects: {},
}

export function extractExtraData({ crafterName }: { crafterName: string }): EpicLootData | undefined {
  if (!crafterName.startsWith('<|c|>')) return undefined;
  if (!crafterName.includes('<|u|>')) return defaultItem;
  const m = crafterName.match(/<\|rkel\|>(.*?)(<\||$)/);
  if (m == null) return defaultItem;
  try {
    const obj = JSON.parse(m[1] ?? 'null');
    const rarity = obj.Rarity;
    const effects: EpicLootData['effects'] = {};
    for (const { EffectType, EffectValue } of obj.Effects) {
      effects[EffectType as EffectType] = EffectValue;
    }
    return { rarity, effects };
  } catch (e) {
    return defaultItem;
  }
}
