import { forgeRecipe, traderRecipe, inventoryRecipe, genericRecipe } from '../model/recipe';
import type { DamageProfile, GameObject, Item, Piece, Resource, ItemRecipe, EntityId } from '../types';
import { mods } from '../types';

const augmenterRecipe = (materials: Record<EntityId, number>, item: EntityId, number = 1) =>
  genericRecipe('piece_augmenter', 1, 3, materials, {}, item, number);

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

const rarityArr = ['Magic', 'Rare', 'Epic', 'Legendary'];
const magicIngridients = ['Dust', 'Essence', 'Reagent', 'Shard', 'Runestone'];

const resources: Resource[] = [
  ...rarityArr.flatMap<Resource>((rarity, i) => magicIngridients.map(
    ingridient => ({
      id: `${ingridient}${rarity}`,
      tier: i + 2,
      type: 'item',
      stack: 100,
      weight: 0.1,
    })
  )),
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
  },
  {
    id: 'SilverRing',
    tier: 4,
    type: 'armor', slot: 'util',
    maxLvl: 1,
    armor: [0, 0],
    weight: 1,
    durability: [Infinity, 0],
    moveSpeed: 0,
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
      id: 'forge',
      distance: 5,
    },
    wear: {
      hp: 100,
      damageModifiers: mods([0, 0, 1, 2, 0, 0, 0, 0, 3, 3]),
      noRoof: false,
      noSupport: true,
    },
    recipe: { type: 'craft_piece', materials: { Wood: 10, }, station: null, }    
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
      id: 'forge',
      distance: 5,
    },
    wear: {
      hp: 100,
      damageModifiers: mods([0, 0, 1, 2, 0, 0, 0, 0, 3, 3]),
      noRoof: false,
      noSupport: true,
    },
    recipe: { type: 'craft_piece', materials: { Wood: 10, }, station: null, }    
  },
];

export const data: GameObject[] = [
  ...resources,
  ...items,
  ...buildings,
].map(item => ({ ...item, mod: 'EpicLoot' }) as GameObject)

export const recipes: ItemRecipe[] = [
  forgeRecipe(1, { LeatherScraps: 5, Bronze: 1 }, {}, 'LeatherBelt'),
  forgeRecipe(1, { Coins: 200, Ruby: 1 }, {}, 'GoldRubyRing'),
  forgeRecipe(1, { Silver: 1 }, {}, 'SilverRing'),
  traderRecipe(2000, 'Advaranaut'),

  // upgrade
  inventoryRecipe({ ShardMagic: 5 }, 'ShardRare'),
  inventoryRecipe({ ShardRare: 5, Coins: 5 }, 'ShardEpic'),
  inventoryRecipe({ ShardEpic: 5, Coins: 10 }, 'ShardLegendary'),
  inventoryRecipe({ DustMagic: 5 }, 'DustRare'),
  inventoryRecipe({ DustRare: 5, Coins: 5 }, 'DustEpic'),
  inventoryRecipe({ DustEpic: 5, Coins: 10 }, 'DustLegendary'),
  inventoryRecipe({ ReagentMagic: 5 }, 'ReagentRare'),
  inventoryRecipe({ ReagentRare: 5, Coins: 5 }, 'ReagentEpic'),
  inventoryRecipe({ ReagentEpic: 5, Coins: 10 }, 'ReagentLegendary'),
  inventoryRecipe({ EssenceMagic: 5 }, 'EssenceRare'),
  inventoryRecipe({ EssenceRare: 5, Coins: 5 }, 'EssenceEpic'),
  inventoryRecipe({ EssenceEpic: 5, Coins: 10 }, 'EssenceLegendary'),
  inventoryRecipe({ RunestoneMagic: 5 }, 'RunestoneRare'),
  inventoryRecipe({ RunestoneRare: 5, Coins: 5 }, 'RunestoneEpic'),
  inventoryRecipe({ RunestoneEpic: 5, Coins: 10 }, 'RunestoneLegendary'),
  // convert
  inventoryRecipe({ ShardMagic: 2 }, 'DustMagic'),
  inventoryRecipe({ ShardMagic: 2 }, 'EssenceMagic'),
  inventoryRecipe({ ShardMagic: 2 }, 'ReagentMagic'),
  inventoryRecipe({ ShardRare: 2, Coins: 2 }, 'DustRare'),
  inventoryRecipe({ ShardRare: 2, Coins: 2 }, 'EssenceRare'),
  inventoryRecipe({ ShardRare: 2, Coins: 2 }, 'ReagentRare'),
  inventoryRecipe({ ShardEpic: 2, Coins: 3 }, 'DustEpic'),
  inventoryRecipe({ ShardEpic: 2, Coins: 3 }, 'EssenceEpic'),
  inventoryRecipe({ ShardEpic: 2, Coins: 3 }, 'ReagentEpic'),
  inventoryRecipe({ ShardLegendary: 2, Coins: 4 }, 'DustLegendary'),
  inventoryRecipe({ ShardLegendary: 2, Coins: 4 }, 'EssenceLegendary'),
  inventoryRecipe({ ShardLegendary: 2, Coins: 4 }, 'ReagentLegendary'),
  // "junk"
  augmenterRecipe({ BoneFragments: 10 }, 'TrophySkeleton'),
  augmenterRecipe({ GreydwarfEye: 10 }, 'TrophyGreydwarf'),
  augmenterRecipe({ HardAntler: 5 }, 'TrophyDeer'),
  augmenterRecipe({ TrollHide: 10 }, 'TrophyFrostTroll'),
  augmenterRecipe({ SurtlingCore: 2 }, 'TrophySurtling'),
  augmenterRecipe({ FreezeGland: 3 }, 'TrophyHatchling'),
  augmenterRecipe({ DragonTear: 3 }, 'RunestoneLegendary'),
  augmenterRecipe({ YagluthDrop: 1 }, 'RunestoneLegendary'),
  // trophies
  augmenterRecipe({ TrophyBoar: 1 }, 'ShardMagic'),
  augmenterRecipe({ TrophyNeck: 1 }, 'ShardMagic'),
  augmenterRecipe({ TrophyDeer: 1 }, 'ShardMagic'),
  augmenterRecipe({ TrophyEikthyr: 1 }, 'RunestoneMagic'),

  // TrophySkeletonPoison
  augmenterRecipe({ TrophyGreydwarf: 1 }, 'ShardRare'),
  augmenterRecipe({ TrophyGreydwarfBrute: 1 }, 'ShardRare'),
  augmenterRecipe({ TrophyGreydwarfShaman: 1 }, 'ShardRare'),
  augmenterRecipe({ TrophyFrostTroll: 1 }, 'ShardEpic'),
  augmenterRecipe({ TrophyTheElder: 1 }, 'RunestoneRare'),
  // TrophyLeech
  // TrophyBlob
  // TrophyDraugr
  // TrophyDraugrElite
  // TrophyWraith
  // TrophyAbomination
  augmenterRecipe({ TrophyBonemass: 1 }, 'RunestoneEpic'),
  // TrophySerpent
  // TrophyWolf
  // TrophyFenring
  // TrophySGolem
  augmenterRecipe({ TrophyDragon: 1 }, 'RunestoneLegendary'),
  // TrophyLox
  // TrophyDeathsquito
  // TrophyGrowth
  // TrophyGoblin
  // TrophyGoblinBrute
  // TrophyGoblinShaman
  augmenterRecipe({ TrophyGoblinKing: 3 }, 'RunestoneLegendary'),
];