import { Creature, EntityId, GameComponent, GameObject, Item, ItemRecipe, MaterialType, Piece } from '../types';
import type { InvItem } from '../view/player/Inventory/types';
import { genericRecipe, smelterRecipe } from '../model/recipe';
import { assertNever, groupBy, isNotNull } from '../model/utils';
import { data as itemDB } from '../data/itemDB';

import { SkillType } from '../model/skills';
import { itemGrow, singleDrop } from '../model/game';
import { pickOnly } from '../data/objects';
import { creatures } from '../data/creatures';
import { craftStationResist } from '../model/building';

const TRANSUMTING_TIME = 3;
const COLORS = ['Black', 'Blue', 'Red', 'Green', 'Yellow', 'Purple', 'Cyan'] as const;
type Color = typeof COLORS[number];

export enum GemEffect {
  Sprinter,
  Defender,
  Firestarter,
  Pyromaniac,
  Iceheart,
  Snakebite,
  Vitality,
  Regeneration,
  Shadowhit,
  Powerrecovery,
  Endlessarrows,
  Explorer,
  Student,
  Glider,
  Unfazed,
  Necromancer,
  Parrymaster,
  Comfortable,
  Avoidance,
  Magnetic,
  Hercules,
  Vampire,
  Bloodthirsty,
  Masterarcher,
  Tank,
  Paintolerance,
  Berserk,
  Ninja,
  Inconspicuous,
  Nimble,
  Mirror,
  Echo,
  Resonatingechoes,
  Resilience,
  Gourmet,
  Leadingwolf,
  Sharedhealing,
  Safehaven,
  Fleetinglife,
  Cowardice,
  Archerymentor,
  Dedicatedtank,
  Stealtharcher,
  Mercifuldeath,
  Opportunity,
  Turtleshell,
  Turtleembrace,
  Marathon,
  Unbreakable,
  Energetic,
  Mountaingoat,
  Glowingspirit,
  Lightningspeed,
  Rootedrevenge,
  Poisonousdrain,
  Icyprotection,
  Fierydoom,
  Togetherforever,
  Neveralone,
  Equilibrium,
  Eternalstudent,
  Timewarp,
  Carefulcutting,
}

type Slot = 'weapon' | 'spear' | 'axe' | 'chest' | 'legs' | 'utility' | 'head' | 'bow' | 'cloak' | 'shield' | 'tool' | 'all';
type Gem = { color: Color; tier: number; /* 1 | 2 | 3 */ };
type SimpleEffectConfig = { effect: GemEffect, slot: Slot; color: Color; power: [number, number, number]; };

export type GemEffects = Map<GemEffect, number>;

const GemTiers = ['Simple', 'Advanced', 'Perfet'];
const gemIdRegex = new RegExp(`(${GemTiers.join('|')})_(${COLORS.join('|')})_Socket`);
function gemFromString(str: string): Gem | undefined {
  const match = str.match(gemIdRegex);
  if (match == null) return undefined;
  return {
    color: match[2]! as Color,
    tier: GemTiers.indexOf(match[1]!) + 1,
  };
}

function getGems({ crafterName }: { crafterName: string }): Gem[] {
  const data = crafterName.match(/<\|sbjc\|>(.*?)(<\||$)/)?.[1];
  if (data == null) return [];
  const parts = data.split(',');
  return parts.flatMap(part => part.split('|').map(gemFromString)).filter(isNotNull);
}

function itemMatches(item: Item, { slot }: SimpleEffectConfig) {
  if (slot === 'all') return true;
  switch (item.type) {
    case 'armor':
      switch (slot) {
        case 'chest':
        case 'legs':
        case 'head':
        case 'cloak':
          return true;
        default:
          return false;
      }
    case 'weapon':
      switch (slot) {
        case 'weapon': return true;
        case 'spear': return item.skill === SkillType.Spears;
        case 'axe': return item.skill === SkillType.Axes;
        case 'bow': return item.skill === SkillType.Bows;
        default: return false;
      }
    case 'tool':
      return slot === 'tool';
    case 'shield':
      return slot === 'shield';
    case 'trophy':
    case 'arrow':
    case 'bolt':
    case 'missile':
    case 'item':
      return false;
    default:
      return assertNever(item);
  }
}

function addPower(powers: GemEffects, config: SimpleEffectConfig, gem: Gem): void {
  const power = config.power[gem.tier - 1];
  if (power == null) return;
  const { effect } = config;
  powers.set(effect, (powers.get(effect) ?? 0) + power);
}

export function getItemGemEffects(invItem: InvItem): GemEffects | undefined {
  const result = new Map<GemEffect, number>();
  const gems = getGems(invItem);
  const item = itemDB[invItem.id];
  if (item == null || !('weight' in item)) return undefined;
  for (const gem of gems) {
    for (const config of effectsPossible[gem.color] ?? []) {
      if (itemMatches(item, config)) {
        addPower(result, config, gem);
      }
    }
  }
/* TODO add slots to descripion 
  if (gems.length === 0) {
    const gem = gemFromString(item.id);
    if (gem == null) return result;
    for (const config of effectsPossible[gem.color] ?? []) {
      addPower(result, config, gem);
    }
  }*/
  return result;
}

const effectsPossible = groupBy<SimpleEffectConfig, Color>([
  { effect: GemEffect.Firestarter, slot: 'weapon', color: 'Red', power: [5, 10, 15], },
  { effect: GemEffect.Iceheart, slot: 'weapon', color: 'Blue', power: [5, 10, 15], },
  { effect: GemEffect.Snakebite, slot: 'weapon', color: 'Green', power: [5, 10, 15], },
  { effect: GemEffect.Shadowhit, slot: 'weapon', color: 'Black', power: [2, 3, 4], },
  { effect: GemEffect.Vampire, slot: 'weapon', color: 'Yellow', power: [6, 8, 10], },
  { effect: GemEffect.Berserk, slot: 'weapon', color: 'Purple', power: [1, 2, 3], },

  { effect: GemEffect.Magnetic, slot: 'spear', color: 'Black', power: [20, 30, 40], },
  { effect: GemEffect.Opportunity, slot: 'axe', color: 'Red', power: [5, 7, 9], },

  { effect: GemEffect.Defender, slot: 'chest', color: 'Red', power: [1, 2, 3], },
  { effect: GemEffect.Regeneration, slot: 'chest', color: 'Blue', power: [3, 5, 7], },
  { effect: GemEffect.Vitality, slot: 'chest', color: 'Green', power: [1, 2, 3], },
  { effect: GemEffect.Mirror, slot: 'chest', color: 'Black', power: [2, 4, 6], },

  { effect: GemEffect.Sprinter, slot: 'legs', color: 'Red', power: [3, 5, 7], },
  { effect: GemEffect.Ninja, slot: 'legs', color: 'Black', power: [12, 14, 16], },
  { effect: GemEffect.Nimble, slot: 'legs', color: 'Blue', power: [7, 9, 11], },
  { effect: GemEffect.Marathon, slot: 'legs', color: 'Yellow', power: [7, 9, 11], },
  { effect: GemEffect.Mountaingoat, slot: 'legs', color: 'Purple', power: [10, 15, 20], },

  { effect: GemEffect.Powerrecovery, slot: 'utility', color: 'Green', power: [10, 12, 15], },
  { effect: GemEffect.Comfortable, slot: 'utility', color: 'Yellow', power: [3, 5, 7], },
  { effect: GemEffect.Hercules, slot: 'utility', color: 'Purple', power: [10, 15, 20], },
  { effect: GemEffect.Glowingspirit, slot: 'utility', color: 'Blue', power: [4, 6, 8], },

  { effect: GemEffect.Explorer, slot: 'head', color: 'Green', power: [10, 15, 20], },
  { effect: GemEffect.Student, slot: 'head', color: 'Red', power: [2, 3, 5], },
  { effect: GemEffect.Resilience, slot: 'head', color: 'Yellow', power: [5, 7, 9], },
  { effect: GemEffect.Gourmet, slot: 'head', color: 'Purple', power: [10, 13, 16], },
  { effect: GemEffect.Mercifuldeath, slot: 'head', color: 'Blue', power: [10, 15, 20], },

  { effect: GemEffect.Endlessarrows, slot: 'bow', color: 'Red', power: [4, 6, 8], },
  { effect: GemEffect.Necromancer, slot: 'bow', color: 'Green', power: [3, 5, 7], },
  { effect: GemEffect.Masterarcher, slot: 'bow', color: 'Purple', power: [4, 6, 8], },
  { effect: GemEffect.Stealtharcher, slot: 'bow', color: 'Black', power: [20, 35, 50], },
  { effect: GemEffect.Echo, slot: 'bow', color: 'Yellow', power: [2, 3, 4], },

  { effect: GemEffect.Glider, slot: 'cloak', color: 'Green', power: [3, 5, 7], },
  { effect: GemEffect.Inconspicuous, slot: 'cloak', color: 'Black', power: [10, 15, 20], },
  { effect: GemEffect.Turtleshell, slot: 'cloak', color: 'Yellow', power: [8, 10, 12], },

  { effect: GemEffect.Unfazed, slot: 'shield', color: 'Blue', power: [10, 15, 20], },
  { effect: GemEffect.Parrymaster, slot: 'shield', color: 'Purple', power: [50, 80, 100], },
  { effect: GemEffect.Avoidance, slot: 'shield', color: 'Yellow', power: [1, 2, 3], },
  { effect: GemEffect.Tank, slot: 'shield', color: 'Black', power: [4, 6, 8], },
  { effect: GemEffect.Paintolerance, slot: 'shield', color: 'Red', power: [1, 2, 3], },

  { effect: GemEffect.Unbreakable, slot: 'tool', color: 'Purple', power: [40, 50, 60], },
  { effect: GemEffect.Energetic, slot: 'tool', color: 'Yellow', power: [15, 25, 30], },

  { effect: GemEffect.Leadingwolf, slot: 'cloak', color: 'Cyan', power: [8, 10, 12], },
  { effect: GemEffect.Sharedhealing, slot: 'head', color: 'Cyan', power: [10, 20, 30], },
  { effect: GemEffect.Fleetinglife, slot: 'weapon', color: 'Cyan', power: [6, 8, 10], },
  { effect: GemEffect.Safehaven, slot: 'chest', color: 'Cyan', power: [1, 2, 3], },
  { effect: GemEffect.Cowardice, slot: 'legs', color: 'Cyan', power: [3, 4, 5], },
  { effect: GemEffect.Archerymentor, slot: 'bow', color: 'Cyan', power: [20, 30, 40], },
  { effect: GemEffect.Dedicatedtank, slot: 'shield', color: 'Cyan', power: [50, 60, 70], },
], e => e.color);

//   [GemEffect.Lightningspeed]: {},
//   [GemEffect.Rootedrevenge]: {},
//   [GemEffect.Poisonousdrain]: {},
//   [GemEffect.Icyprotection]: {},
//   [GemEffect.Fierydoom]: {},

//   [GemEffect.Togetherforever]: {}, // group?

//   [GemEffect.Pyromaniac]: {},
//   [GemEffect.Bloodthirsty]: {},
//   [GemEffect.Resonatingechoes]: {},
//   [GemEffect.Turtleembrace]: {},
//   [GemEffect.Neveralone]: {},
//   [GemEffect.Equilibrium]: {},
//   [GemEffect.Eternalstudent]: {},
//   [GemEffect.Timewarp]: {},
//   [GemEffect.Carefulcutting]: {},
// ];

const transmuteRecipe = (
  level: number,
  materials: Record<EntityId, number>,
  materialsPerLevel: Record<EntityId, number>,
  item: EntityId,
  number = 1,
) => genericRecipe(
  'op_transmution_table',
  level,
  TRANSUMTING_TIME,
  materials,
  materialsPerLevel,
  item, number,
);

const bossToGem: Record<EntityId, [EntityId, number]> = {
  Eikthyr: ['Boss_Crystal_7', 1],
  gd_king: ['Boss_Crystal_1', 2],
  Bonemass: ['Boss_Crystal_2', 3],
  Dragon: ['Boss_Crystal_4', 4],
  GoblinKing: ['Boss_Crystal_5', 5],
};

// Friendship_Group_Gem, Special_Group_Gem

const items: Item[] = [
  ...[
    'JC_Gem_Bag',
    'JC_Necklace_Red',
    'JC_Necklace_Green',
    'JC_Necklace_Blue',
    'JC_Ring_Purple',
    'JC_Ring_Green',
    'JC_Ring_Red',
    'JC_Ring_Blue',
  ].map(id => ({
    id,
    tier: 1,
    type: 'item' as const,
    components: ['ItemDrop'] as GameComponent[],
    maxLvl: 1,
    weight: 1,
  })),
  ...[
    'JC_Common_Gembox',
    'JC_Epic_Gembox',
    'JC_Legendary_Gembox',
  ].map(id => ({
    id,
    tier: 1,
    type: 'item' as const,
    components: ['ItemDrop'] as GameComponent[],
    maxLvl: 1,
    weight: 1,
  })),
  ...COLORS.flatMap(color => [
    {
      id: `Shattered_${color}_Crystal`,
      tier: 0,
      type: 'item' as const,
      components: ['ItemDrop'] as GameComponent[],
      maxLvl: 1,
      weight: 1,
    },
    {
      id: `Uncut_${color}_Stone`,
      tier: 0,
      type: 'item' as const,
      components: ['ItemDrop'] as GameComponent[],
      maxLvl: 1,
      weight: 0.4,
      stack: 20,
    },
    {
      id: `Simple_${color}_Socket`,
      tier: 1,
      type: 'item' as const,
      components: ['ItemDrop'] as GameComponent[],
      maxLvl: 1,
      weight: 0.1,
      stack: 20,
    },
    {
      id: `Advanced_${color}_Socket`,
      tier: 2,
      type: 'item' as const,
      components: ['ItemDrop'] as GameComponent[],
      maxLvl: 1,
      weight: 0.1,
      stack: 20,
    },
    {
      id: `Perfect_${color}_Socket`,
      tier: 3,
      type: 'item' as const,
      components: ['ItemDrop'] as GameComponent[],
      maxLvl: 1,
      weight: 0.1,
      stack: 20,
    },
  ]),
  ...Object.values(bossToGem).map(([gemId, tier]) => ({
    id: gemId,
    tier,
    type: 'item' as const,
    components: ['ItemDrop'] as GameComponent[],
    maxLvl: 1,
    weight: 1,
  }))
];

const buildings: Piece[] = [
  {
    id: 'Odins_Stone_Transmuter',
    base: true,
    type: 'piece',
    components: [],
    subtype: 'craft',
    tier: 1,
    emoji: '',
    piece: {
      target: 'primary',
      water: false,
      onlyOnFlat: true,
    },
    craft: {},
    wear: {
      hp: 1500,
      damageModifiers: craftStationResist,
      noRoof: false,
      noSupport: true,
      materialType: MaterialType.Stone,
    },
    recipe: {
      type: 'craft_piece',
      materials: {
        Uncut_Green_Stone: 10,
        Uncut_Black_Stone: 10,
        Uncut_Purple_Stone: 10,
        Uncut_Blue_Stone: 10,
      },
      station: null,
    },
  },
  {
    id: 'op_transmution_table',
    base: true,
    type: 'piece',
    components: [],
    subtype: 'craft',
    tier: 0,
    emoji: '',
    piece: {
      target: 'primary',
      water: false,
      onlyOnFlat: true,
    },
    craft: {},
    wear: {
      hp: 1500,
      damageModifiers: craftStationResist,
      noRoof: false,
      noSupport: true,
      materialType: MaterialType.Stone,
    },
    recipe: { type: 'craft_piece', materials: { Wood: 10, Flint: 10, }, station: null, }
  },
  {
    id: 'Odins_Jewelry_Box',
    base: true,
    type: 'piece',
    components: [],
    subtype: 'craft_ext',
    extends: {
      id: 'op_transmution_table',
      distance: 5,
    },
    tier: 4,
    emoji: '',
    piece: {
      target: 'primary',
      water: false,
      onlyOnFlat: true,
    },
    wear: {
      hp: 1500,
      damageModifiers: craftStationResist,
      noRoof: false,
      noSupport: true,
      materialType: MaterialType.Stone,
    },
    recipe: { type: 'craft_piece', materials: { FineWood: 30, IronNails: 15, Obsidian: 4 }, station: null, }
  },
  {
    id: 'JC_Gemstone_Furnace',
    base: true,
    type: 'piece',
    components: [],
    subtype: 'craft',
    tier: 2,
    emoji: '',
    piece: {
      target: 'primary',
      water: false,
      onlyOnFlat: true,
    },
    craft: {},
    wear: {
      hp: 1500,
      damageModifiers: craftStationResist,
      noRoof: false,
      noSupport: true,
      materialType: MaterialType.Stone,
    },
    recipe: { type: 'craft_piece', materials: { Thunderstone: 1, SurtlingCore: 5, Bronze: 10 }, station: null, }
  },
];

const objects: GameObject[] = [
  ...COLORS.filter(c => c !== 'Cyan').map<GameObject>(color => ({
    type: 'object',
    subtype: 'ore',
    id: `${color}_Stone_Formation`,
    iconId: `Shattered_${color}_Crystal`,
    tier: 1,
    grow: [
      ...itemGrow({
        locations: ['Meadows', 'BlackForest', 'Swamp', 'Mountain', 'Plains'],
        num: [2, 5],
      }),
    ],
    Destructible: {
      hp: 25,
      damageModifiers: pickOnly,
      minToolTier: 1,
      parts: [],
    },
    drop: [singleDrop(`Uncut_${color}_Stone`, 1)],
  })),
];

const skeleton = creatures.find(c => c.id === 'Skeleton')!;
const firendlySkeleton: Creature = {
  ...skeleton,
  id: 'JC_Skeleton',
  iconId: 'resource/TrophySkeleton',
  spawners: [],
  faction: 'Players',
};

export const data: GameObject[] = [
  ...items,
  ...objects,
  ...buildings,
  firendlySkeleton,
].map(item => ({ ...item, mod: 'JewelCrafting' }));

export const recipes: ItemRecipe[] = [
  transmuteRecipe(3, { DeerHide: 8, LeatherScraps: 10, Resin: 5, GreydwarfEye: 1 }, {}, 'JC_Gem_Bag'),
  ...COLORS.flatMap(color => {
    const shard = `Shattered_${color}_Crystal`;
    const ore = `Uncut_${color}_Stone`;
    const basic = `Simple_${color}_Socket`;
    const advanced = `Advanced_${color}_Socket`;
    const perfect = `Perfect_${color}_Socket`;
    return [
      smelterRecipe('JC_Gemstone_Furnace' as any, shard, ore),
      transmuteRecipe(1, { [ore]: 1, [shard]: 12 }, {}, basic),
      transmuteRecipe(1, { [basic]: 1, [shard]: 35 }, {}, advanced),
      transmuteRecipe(1, { [advanced]: 1 }, {}, perfect),
    ]
  }),
  transmuteRecipe(2, { Perfect_Red_Socket: 1, Chain: 1 }, { Coins: 500 }, 'JC_Necklace_Red'),
  transmuteRecipe(2, { Perfect_Green_Socket: 1, Chain: 1 }, { Coins: 500 }, 'JC_Necklace_Green'),
  transmuteRecipe(2, { Perfect_Blue_Socket: 1, Chain: 1 }, { Coins: 500 }, 'JC_Necklace_Blue'),
  transmuteRecipe(2, { Perfect_Purple_Socket: 1, Chain: 1 }, { Coins: 500 }, 'JC_Ring_Purple'),
  transmuteRecipe(2, { Perfect_Green_Socket: 1, Chain: 1 }, { Coins: 500 }, 'JC_Ring_Green'),
  transmuteRecipe(2, { Perfect_Red_Socket: 1, Chain: 1 }, { Coins: 500 }, 'JC_Ring_Red'),
  transmuteRecipe(2, { Perfect_Blue_Socket: 1, Chain: 1 }, { Coins: 500 }, 'JC_Ring_Blue'),
];
