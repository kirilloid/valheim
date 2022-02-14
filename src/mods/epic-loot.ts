import type { DamageProfile, GameObject, Item, Piece, Resource } from '../types';
import { CraftingStation, mods } from '../types';

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

export type EpicLootData = {
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

export function modifyDamage(damage: DamageProfile, effects: EpicLootData['effects'] | undefined): DamageProfile {
  if (effects == null) return damage;
  let { blunt, slash, pierce, chop, pickaxe, fire, frost, lightning, poison, spirit } = damage;
  if (effects.ModifyPhysicalDamage != null) {
    const m = (1 + effects.ModifyPhysicalDamage / 100);
    blunt *= m;
    slash *= m;
    pierce *= m;
  }
  if (effects.ModifyElementalDamage != null) {
    const m = (1 + effects.ModifyElementalDamage / 100);
    fire *= m;
    frost *= m;
    lightning *= m;
  }
  
  if (effects.AddBluntDamage != null) blunt += effects.AddBluntDamage;
  if (effects.AddSlashingDamage != null) slash += effects.AddSlashingDamage;
  if (effects.AddPiercingDamage != null) pierce += effects.AddPiercingDamage;
  if (effects.AddFireDamage != null) fire += effects.AddFireDamage;
  if (effects.AddFrostDamage != null) frost += effects.AddFrostDamage;
  if (effects.AddLightningDamage != null) lightning += effects.AddLightningDamage;
  if (effects.AddPoisonDamage != null) poison += effects.AddPoisonDamage;
  if (effects.AddSpiritDamage != null) spirit += effects.AddSpiritDamage;
  return { blunt, slash, pierce, chop, pickaxe, fire, frost, lightning, poison, spirit };
}

const resources: Resource[] = [
  ...Object.entries({
    Magic: 2,
    Rare: 3,
    Epic: 4,
    Legendary: 5,
  }).flatMap<Resource>(([rarity, tier]) => [
    {
      id: `Dust${rarity}`,
      tier,
      type: 'item',
      stack: 100,
      weight: 0.1,
    },
    {
      id: `Essence${rarity}`,
      tier,
      type: 'item',
      stack: 100,
      weight: 0.1,
    },
    {
      id: `Shard${rarity}`,
      tier,
      type: 'item',
      stack: 100,
      weight: 0.1,
    },
    {
      id: `Reagent${rarity}`,
      tier,
      type: 'item',
      stack: 100,
      weight: 0.1,
    },
    {
      id: `Runestone${rarity}`,
      tier,
      type: 'item',
      stack: 100,
      weight: 0.1,
    },
  ]),
];

const items: Item[] = [
  {
    id: 'LeatherBelt',
    tier: 2,
    type: 'armor', slot: 'util',
    maxLvl: 1,
    armor: [0, 0],
    weight: 2,
    durability: [Infinity, 0],
    moveSpeed: 0,
    recipe: {
      type: 'craft_upg',
      time: 3,
      materials: { LeatherScraps: 5, Bronze: 1 },
      materialsPerLevel: {},
      source: { station: CraftingStation.Forge, level: 0 },
    },
  },
  {
    id: 'GoldRubyRing',
    tier: 2,
    type: 'armor', slot: 'util',
    maxLvl: 1,
    armor: [0, 0],
    weight: 1,
    durability: [Infinity, 0],
    moveSpeed: 0,
    recipe: {
      type: 'craft_upg',
      time: 3,
      materials: { Coins: 200, Ruby: 1 },
      materialsPerLevel: {},
      source: { station: CraftingStation.Forge, level: 0 },
    }
  },
  {
    id: 'Advaranaut',
    tier: 2,
    type: 'armor', slot: 'util',
    maxLvl: 1,
    armor: [0, 0],
    weight: 1,
    durability: [Infinity, 0],
    moveSpeed: 0,
    recipe: {
      type: 'trader',
      value: 2000,
    }
  },
  {
    id: 'TreasureMap',
    tier: 2,
    type: 'item',
    maxLvl: 1,
    weight: 1,
  },
];

const buildings: Piece[] = [
  {
    id: 'piece_enchanter',
    base: false,
    type: 'piece',
    components: ['CraftingStation'],
    subtype: 'craft_ext',
    tier: 2,
    piece: {
      target: 'primary',
      water: false,
    },
    extends: {
      id: CraftingStation.Forge,
      distance: 5,
    },
    wear: {
      hp: 100,
      damageModifiers: mods([0, 0, 1, 2, 0, 0, 0, 0, 3, 3]),
      noRoof: false,
      noSupport: true,
    },
    recipe: { type: 'craft_piece', materials: { Wood: 10, }, station: CraftingStation.Inventory, }    
  },
  {
    id: 'piece_augmenter',
    base: false,
    type: 'piece',
    components: ['CraftingStation'],
    subtype: 'craft_ext',
    tier: 3,
    piece: {
      target: 'primary',
      water: false,
    },
    extends: {
      id: CraftingStation.Inventory,
      distance: 5,
    },
    wear: {
      hp: 100,
      damageModifiers: mods([0, 0, 1, 2, 0, 0, 0, 0, 3, 3]),
      noRoof: false,
      noSupport: true,
    },
    recipe: { type: 'craft_piece', materials: { Wood: 10, }, station: CraftingStation.Inventory, }    
  },
];

export const data: GameObject[] = [
  ...resources,
  ...items,
  ...buildings,
].map(item => ({ ...item, mod: 'EpicLoot' }) as GameObject)
