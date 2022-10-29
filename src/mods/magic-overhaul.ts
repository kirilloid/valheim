import type { DamageProfile, DamageType, GameObject, Item, ItemRecipe, Pair, Piece } from '../types';

import { dmg } from '../model/game';
import { forgeRecipe } from '../model/recipe';
import { SkillType } from '../model/skills';
import { stoneStructureRecipe, stoneStructureWear } from '../model/building';
import { multiplyDamage } from '../model/combat';

const WEAPON_DAMAGE = 100;

const HELMET_ARMOR = 300;
// manacost -25%
// cooldown -20%

export enum Class {
  NONE,
  Ninja,
  Mage,
  Archer,
  Berserker,
  Rogue,
  Warlock,
  Monk,
  Paladin,
  Druid,
  Shaman,
  Deathknight,
  Engineer,
  Spartan,
  Priest,
};

const helmetIds = [
  'NinjaHelmet',
  'MageHelmet',
  'ArcherHelmet',
  'BerserkerHelmet',
  'RogueHelmet', 
  'WarlockHelmet',
  'MonkHelmet',
  'PaladinHelmet',
  'DruidHelmet',
  'ShamanHelmet', 
  'DKHelmet',
  'EngineerHelmet',
  'SpartanHelmet',
  'PriestHelmet',
];

type WDT = [DamageType] | [DamageType, DamageType];

const weapons: {
  id: string;
  emoji: string;
  skill: Exclude<SkillType, SkillType.Blocking>;
  damageTypes: WDT;
}[] = [
  {
    id: 'NinjaWeapon',
    emoji: '⚔️',
    skill: SkillType.Swords,
    damageTypes: ['slash', 'lightning'],
  },
  {
    id: 'MageWeapon',
    emoji: '⚚',
    skill: SkillType.Clubs,
    damageTypes: ['blunt', 'frost'],
  },
  {
    id: 'ArcherWeapon',
    emoji: '🏹',
    skill: SkillType.Bows,
    damageTypes: ['pierce'],
  },
  {
    id: 'BerserkerWeapon',
    emoji: '🗡️',
    skill: SkillType.Swords,
    damageTypes: ['slash'],
  },
  {
    id: 'RogueWeapon',
    emoji: '🗡️',
    skill: SkillType.Knives,
    damageTypes: ['pierce'],
  },
  {
    id: 'WarlockWeapon',
    emoji: '⚚',
    skill: SkillType.Polearms,
    damageTypes: ['slash', 'spirit'],
  },
  {
    id: 'MonkWeapon',
    emoji: '👊',
    skill: SkillType.Unarmed,
    damageTypes: ['blunt'],
  },
  {
    id: 'PaladinWeapon',
    emoji: '🛡️',
    skill: SkillType.Clubs,
    damageTypes: ['blunt'],
  },
  {
    id: 'DruidWeapon',
    emoji: '⚚',
    skill: SkillType.Clubs,
    damageTypes: ['blunt', 'poison'],
  },
  {
    id: 'ShamanWeapon',
    emoji: '⚚',
    skill: SkillType.Clubs,
    damageTypes: ['blunt', 'lightning'],
  },
  {
    id: 'DKWeapon',
    emoji: '⚔️',
    skill: SkillType.Swords,
    damageTypes: ['slash', 'spirit'],
  },
  {
    id: 'EngineerWeapon',
    emoji: '🔧',
    skill: SkillType.Clubs,
    damageTypes: ['blunt', 'fire'],
  },  
  {
    id: 'SpartanWeapon',
    emoji: '🍢',
    skill: SkillType.Spears,
    damageTypes: ['pierce', 'fire'],
  },
  {
    id: 'PriestWeapon',
    emoji: '⚚',
    skill: SkillType.Clubs,
    damageTypes: ['blunt', 'pierce'],
  },
];

const generateDamage = (types: WDT): DamageProfile => {
  switch (types.length) {
    case 1: {
      const [main] = types;
      return dmg({ [main]: WEAPON_DAMAGE });
    }
    case 2: {
      const [primary, secondary] = types;
      return dmg({
        [primary]: WEAPON_DAMAGE * 0.8,
        [secondary]: WEAPON_DAMAGE * 0.2,
      });
    }
  }
};

const generateDamagePair = (types: WDT): Pair<DamageProfile> => {
  const perLevelRate = 0.2;
  const baseDmg = generateDamage(types);
  return [
    baseDmg,
    multiplyDamage(baseDmg, perLevelRate),
  ];
};

const items: Item[] = [
  // runes
  ...[
    { id: 'MORuneElder', tier: 2 },
    { id: 'MORuneBonemass', tier: 3 },
    { id: 'MORuneModer', tier: 4 },
    { id: 'MORuneYagluth', tier: 5 },
  ].map<Item>(({ id, tier }) => ({
    id,
    tier,
    type: 'item',
    components: ['ItemDrop'],
    weight: 1,
  })),
  // ride runes
  ...[
    { id: 'MODragonRideEikthyr', tier: 2 },
    { id: 'MODragonRideLox', tier: 5 },
    { id: 'MODragonRideModer', tier: 4 },
    { id: 'MODragonRideValkyrie', tier: 1 },
    { id: 'MODragonRideYagluth', tier: 5 },
  ].map<Item>(({ id, tier }) => ({
    id,
    tier,
    type: 'item',
    components: ['ItemDrop'],
    weight: 1,
  })),
  // helmets
  ...helmetIds.map<Item>(id => ({
    id,
    tier: 5,
    type: 'armor', slot: 'head',
    components: ['ItemDrop'],
    maxLvl: 8,
    armor: [HELMET_ARMOR, HELMET_ARMOR * 0.2],
    weight: 2,
    durability: [300, 150],
    moveSpeed: 0.05,
  })),
  // weapons
  ...weapons.map<Item>(({ id, skill, emoji, damageTypes }) => ({
    id,
    emoji,
    tier: 5,
    type: 'weapon', slot: 'both',
    components: ['ItemDrop'],
    weight: 1,
    maxLvl: 8,
    moveSpeed: 0.05,
    block: [20, 3],
    parryForce: 0,
    parryBonus: 1,
    skill,
    toolTier: 0,
    damage: generateDamagePair(damageTypes),
    knockback: 0,
    backstab: 1,
    attacks: [],
    durability: [300, 150],
  })),
];

const buildings: Piece[] = [
  {
    id: 'AltarPrefab',
    base: false,
    type: 'piece',
    subtype: 'structure',
    tier: 1,
    piece: { target: 'random', water: undefined, size: [6, 6, 2] },
    wear: stoneStructureWear,
    recipe: stoneStructureRecipe(10),
  },
];

export const data: GameObject[] = [
  ...items,
  ...buildings,
].map(item => ({ ...item, mod: 'MagicOverhaul' }))

export const recipes: ItemRecipe[] = [
  ...helmetIds.map(id => forgeRecipe(1, {
    MORuneElder: 1, 
    MORuneBonemass: 1, 
    MORuneModer: 1, 
    MORuneYagluth: 1,
  }, {
    Copper: 10,
    Iron: 10,
    Silver: 10,
    BlackMetal: 10,
  }, id)),
  ...weapons.map(({ id }) => forgeRecipe(1, {
    MORuneElder: 1, 
    MORuneBonemass: 1, 
    MORuneModer: 1, 
    MORuneYagluth: 1,
  }, {
    Wood: 30,
    FineWood: 30,
    Copper: 30,
    IronNails: 30,
  }, id)),
];
