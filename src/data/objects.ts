import type {
  DamageModifiers,
  Destructible,
  EntityGroup,
  EntityId,
  GeneralDrop,
  ItemGrow,
  PhysicalObject,
  Plantable,
  Structure,
} from '../types';
import { singleDrop, itemGrow, mods, dmg } from '../model/game';
import { torchResist, woodResist } from '../model/building';
import { pickables } from './pickable';

const oneOfEach = true;
const ashResist = true;
const ashImmune = true;

const allNormal: DamageModifiers = {
  blunt: 'normal',
  slash: 'normal',
  pierce: 'normal',
  chop: 'normal',
  pickaxe: 'normal',
  fire: 'normal',
  frost: 'normal',
  lightning: 'normal',
  poison: 'immune',
  spirit: 'immune',
};

const allImmune: DamageModifiers = {
  blunt: 'immune',
  slash: 'immune',
  pierce: 'immune',
  chop: 'immune',
  pickaxe: 'immune',
  fire: 'immune',
  frost: 'immune',
  lightning: 'immune',
  poison: 'immune',
  spirit: 'immune',
};

const greydwarfNestModifiers: DamageModifiers = {
  blunt: 'resistant',
  slash: 'normal',
  pierce: 'resistant',
  chop: 'normal',
  pickaxe: 'ignore',
  fire: 'weak',
  frost: 'immune',
  lightning: 'normal',
  poison: 'immune',
  spirit: 'ignore',
};

const draugrPileModifiers: DamageModifiers = {
  blunt: 'normal',
  slash: 'normal',
  pierce: 'resistant',
  chop: 'normal',
  pickaxe: 'ignore',
  fire: 'resistant',
  frost: 'normal',
  lightning: 'normal',
  poison: 'immune',
  spirit: 'weak',
};

const chopOnly: DamageModifiers = {
  ...allImmune,
  chop: 'normal',
};

export const pickOnly: DamageModifiers = {
  ...allImmune,
  pickaxe: 'normal',
};

const chopPickOnly: DamageModifiers = {
  ...allImmune,
  chop: 'normal',
  pickaxe: 'normal',
};

const emptyDrop: GeneralDrop = {
  num: [1, 4],
  options: [],
};

const dvergrPropsResist: DamageModifiers = { ...woodResist, fire: 'weak' };
const dvergrPropsDestructible = (hp: number): Destructible => ({
  hp,
  damageModifiers: dvergrPropsResist,
  minToolTier: 0,
  parts: [],
});

function tree({
  id: [baseId, stubId, logId, logHalfId],
  group,
  tier,
  minToolTier,
  grow,
  hp: [baseHp, logHp, logHalfHp],
  drop: [baseDrop, chunkDrop],
  stubWood = 'Wood',
  Plant,
}: {
  id: [EntityId, EntityId, EntityId, EntityId];
  group?: EntityGroup;
  tier: number;
  minToolTier: number;
  grow: ItemGrow[];
  hp: [number, number, number];
  drop: [GeneralDrop, GeneralDrop];
  stubWood?: EntityId;
  Plant?: Plantable;
}): PhysicalObject[] {
  return [
    {
      type: 'object',
      subtype: 'tree',
      tags: ['plant'],
      id: baseId,
      components: ['TreeBase'],
      group,
      tier,
      Destructible: {
        hp: baseHp,
        damageModifiers: chopOnly,
        minToolTier,
        parts: [
          { id: stubId, num: 1 },
          { id: logId, num: 1 },
        ],
      },
      drop: [baseDrop],
      grow,
      Plant,
    },
    {
      type: 'object',
      subtype: 'misc',
      id: stubId,
      iconId: 'object/Stub',
      components: ['Destructible'],
      tier,
      Destructible: {
        hp: 80,
        damageModifiers: chopOnly,
        minToolTier,
        parts: [],
      },
      drop: [singleDrop(stubWood, 2)],
      grow: [],
    },
    {
      type: 'object',
      subtype: 'misc',
      id: logId,
      iconId: 'object/Log',
      components: ['TreeLog'],
      tier,
      Destructible: {
        hp: logHp,
        damageModifiers: chopOnly,
        minToolTier,
        parts: [
          { id: logHalfId, num: 2 },
        ],
      },
      drop: [],
      grow: [],
      floating: true,
    },
    {
      type: 'object',
      subtype: 'misc',
      id: logHalfId,
      iconId: 'object/Log',
      components: ['TreeLog'],
      tier,
      Destructible: {
        hp: logHalfHp,
        damageModifiers: chopOnly,
        minToolTier,
        parts: [],
      },
      drop: [chunkDrop],
      grow: [],
      floating: true,
    },
  ];
};

function treeSimpler({
  id: [baseId, stubId, logId],
  iconId,
  tier,
  minToolTier,
  grow,
  hp: [baseHp, logHp],
  drop: [baseDrop, chunkDrop],
}: {
  id: [EntityId, EntityId, EntityId];
  iconId?: EntityId;
  tier: number;
  minToolTier: number;
  grow: ItemGrow[];
  hp: [number, number];
  drop: [GeneralDrop, GeneralDrop];
}): PhysicalObject[] {
  return [
    {
      type: 'object',
      subtype: 'tree',
      tags: ['plant'],
      id: baseId,
      iconId,
      components: ['TreeBase'],
      tier,
      grow,
      Destructible: {
        hp: baseHp,
        damageModifiers: chopOnly,
        minToolTier,
        parts: [
          { id: stubId, num: 1 },
          { id: logId, num: 1 },    
        ],
      },
      drop: [baseDrop],
    },
    {
      type: 'object',
      subtype: 'misc',
      id: stubId,
      iconId: 'object/Stub',
      components: ['Destructible'],
      tier,
      Destructible: {
        hp: 80,
        damageModifiers: chopOnly,
        minToolTier,
        parts: [],
      },
      drop: [singleDrop('Wood', 2)],
      grow: [],
    },
    {
      type: 'object',
      subtype: 'misc',
      id: logId,
      iconId: 'object/Log',
      components: ['TreeLog'],
      tier,
      Destructible: {
        hp: logHp,
        damageModifiers: chopOnly,
        minToolTier,
        parts: [],
      },
      drop: [chunkDrop],
      grow: [],
    },
  ];
};

function rock({
  subtype = 'rock',
  id: [baseId, fracId],
  iconId,
  tier = 1,
  minToolTier = 0,
  grow,
  children,
  hp: fracHp,
  drop: fracDrop,
  Beacon,
}: {
  subtype?: PhysicalObject['subtype'],
  id: [EntityId, EntityId];
  iconId?: string;
  tier?: number;
  minToolTier?: number;
  grow: ItemGrow[];
  children: number;
  hp: number;
  drop: GeneralDrop;
  Beacon?: number;
}): PhysicalObject[] {
  return [
    {
      type: 'object',
      subtype,
      id: baseId,
      iconId,
      tier,
      grow,
      Destructible: {
        hp: 1,
        damageModifiers: pickOnly,
        minToolTier,
        parts: [{ id: fracId, num: children }],
      },
      drop: [],
      Beacon,
    },
    {
      type: 'object',
      subtype: 'rock',
      id: fracId,
      iconId: iconId ?? `object/${baseId}`,
      components: ['MineRock5'],
      tier,
      Destructible: {
        hp: fracHp,
        damageModifiers: pickOnly,
        minToolTier,
        parts: [],
      }, drop: [fracDrop],
    },
  ];
};

function loreTexts(prefix: string, number: number) {
  return Array.from({ length: number }).map((_, i) => `${prefix}${(i + 1).toString().padStart(2, '0')}`);
}

function runeStone({
  id,
  tier,
  texts,
}: {
  id: EntityId;
  tier: number;
  texts: string[];
}): PhysicalObject {
  return {
    type: 'object',
    subtype: 'indestructible',
    group: 'runestone',
    id,
    RuneStone: texts,
    iconId: 'object/Runestone',
    tier,
  };
}

const cacheMap: Map<PhysicalObject, PhysicalObject> = new Map();

export function fullDestructible(obj: PhysicalObject | undefined): PhysicalObject | undefined {
  if (obj == null) return undefined;
  const cached = cacheMap.get(obj);
  if (cached != null) return cached;
  if (!obj.Destructible) return undefined;

  const result: PhysicalObject & {
    Destructible: Destructible;
    drop: GeneralDrop[];
    grow: ItemGrow[];
  } = {
    id: obj.id,
    tier: obj.tier,
    type: 'object',
    subtype: obj.subtype,
    Destructible: {
      hp: obj.Destructible.hp,
      parts: [],
      damageModifiers: obj.Destructible.damageModifiers,
      minToolTier: obj.Destructible.minToolTier,
    },
    drop: obj.drop ?? [],
    grow: obj.grow ?? [],
  };

  for (const { id, num } of obj.Destructible.parts) {
    const child = objects.find(d => d.id === id);
    const destrChild = fullDestructible(child);
    if (destrChild == null) continue;
    const hp = destrChild.Destructible?.hp ?? 0;
    if (isFinite(hp)) {
      result.Destructible.hp += hp * num;
    }
    // TODO: fix multiple childs for case when root chance is != 1
    result.drop.push(...(destrChild.drop ?? []).map(d => ({ ...d, num: [d.num[0] * num, d.num[1] * num] as [number, number] })));
  }
  
  cacheMap.set(obj, result);
  return result;
}

export const traders: PhysicalObject[] = [
  {
    type: 'object',
    subtype: 'trader',
    id: 'Haldor',
    group: 'trader',
    components: ['Trader'],
    trader: 'haldor',
    tier: 2,
  },
  {
    type: 'object',
    subtype: 'trader',
    id: 'Hildir',
    group: 'trader',
    components: ['Trader'],
    trader: 'hildir',
    tier: 2,
  },
  {
    type: 'object',
    subtype: 'trader',
    id: 'BogWitch',
    group: 'trader',
    components: ['Trader'],
    trader: 'bogWitch',
    tier: 3,
  },
];

const treasures: PhysicalObject[] = [
  {
    type: 'object',
    subtype: 'treasure',
    id: 'Pickable_DolmenTreasure',
    iconId: 'resource/Coins',
    components: ['PickableItem'],
    tier: 0,
    drop: [{
      offByOneBug: false,
      num: [1, 1],
      options: [
        { item: 'Coins', num: [2, 15] },
        { item: 'AmberPearl', num: [1, 3] },
        { item: 'Amber', num: [1, 5] },
      ],
    }],
  },
  {
    type: 'object',
    subtype: 'treasure',
    id: 'TreasureChest_meadows',
    iconId: 'piece/piece_chest_wood',
    components: ['Container'],
    tier: 1,
    drop: [{
      offByOneBug: false,
      num: [2, 3],
      options: [
        { item: 'Feathers', num: [1, 3], },
        { item: 'Coins', num: [5, 15], },
        { item: 'Amber', num: [1, 1], },
        { item: 'ArrowFlint', num: [10, 20], },
        { item: 'Torch', num: [1, 1], },
        { item: 'Flint', num: [2, 4], },
      ],
    }],
  },
  {
    type: 'object',
    subtype: 'treasure',
    id: 'TreasureChest_meadows_buried',
    iconId: 'piece/piece_chest_wood',
    components: ['Container', 'Beacon'],
    tier: 4,
    drop: [{
      offByOneBug: false,
      oneOfEach,
      num: [2, 3],
      options: [
        { item: 'ArrowFire', num: [10, 15], },
        { item: 'Coins', num: [20, 50], },
        { item: 'Ruby', num: [1, 3], },
        { item: 'AmberPearl', num: [1, 2], },
        { item: 'SilverNecklace', num: [1, 1], },
      ],
    }],
    Beacon: 40,
  },
  {
    type: 'object',
    subtype: 'treasure',
    id: 'shipwreck_karve_chest',
    iconId: 'piece/piece_chest_wood',
    components: ['Container'],
    tier: 2,
    drop: [{
      offByOneBug: false,
      oneOfEach,
      num: [1, 4],
      options: [
        { item: 'Coins', num: [50, 100], weight: 5 },
        { item: 'AmberPearl', num: [1, 10], weight: 2 },
        { item: 'Ruby', num: [1, 2], },
      ],
    }],  
  },
  {
    type: 'object',
    subtype: 'treasure',
    id: 'TreasureChest_blackforest',
    iconId: 'piece/piece_chest_wood',
    components: ['Container'],
    tier: 2,
    // damageModifiers: mod([1,1,1,1,1,1,1,3,3,3]),
    drop: [{
      offByOneBug: false,
      oneOfEach,
      num: [2, 3],
      options: [
        { item: 'Feathers', num: [2, 4], },
        { item: 'ArrowFlint', num: [5, 10], },
        { item: 'Coins', num: [5, 30], },
        { item: 'Amber', num: [1, 2], },
      ],
    }],
  },
  {
    type: 'object',
    subtype: 'treasure',
    id: 'TreasureChest_forestcrypt',
    iconId: 'piece/piece_chest_wood',
    components: ['Container'],
    tier: 2,
    drop: [{
      offByOneBug: false,
      oneOfEach,
      num: [2, 4],
      options: [
        { item: 'Feathers', num: [1, 10], },
        { item: 'ArrowFlint', num: [5, 10], },
        { item: 'Ruby', num: [1, 2], },
        { item: 'Coins', num: [10, 30], },
        { item: 'Amber', num: [1, 3], },
      ],
    }],
  },
  {
    type: 'object',
    subtype: 'treasure',
    id: 'TreasureChest_forestcrypt_hildir',
    iconId: 'piece/piece_chest_wood',
    components: ['Container'],
    tier: 2,
    disabled: true,
    drop: [singleDrop('HildirKey_forestcrypt')],
  },
  // trader objects
  ...Object.entries({
    'hildir_table': 'piece/piece_table',
    'hildir_table1': 'piece/piece_table_oak',
    'hildir_table2': 'piece/piece_table_round',
    'hildir_chest1': 'resource/chest_hildir1',
    'hildir_chest2': 'resource/chest_hildir2',
    'hildir_chest3': 'resource/chest_hildir3',
    'fire_pit_haldor': 'piece/fire_pit',
    'fire_pit_hildir': 'piece/fire_pit_iron',
    'Halstein': 'creature/Lox',
    'HildirsLox': 'creature/Lox',
  }).map<PhysicalObject>(([id, iconId]) => ({
    type: 'object',
    subtype: 'indestructible',
    id,
    iconId,
    tier: 2,
  })),
  {
    type: 'object',
    subtype: 'misc',
    id: 'dverger_guardstone',
    iconId: 'piece/guard_stone',
    tier: 6,
    Destructible: {
      hp: 2000,
      damageModifiers: mods([0, 0, 1, 4, 4, 0, 1, 0, 3, 3]),
      minToolTier: 0,
      parts: [],
    },
  },
  {
    type: 'object',
    subtype: 'misc',
    id: 'dvergrtown_stair_corner_wood_left',
    iconId: 'piece/piece_dvergr_spiralstair',
    tier: 6,
    Destructible: {
      hp: 800,
      damageModifiers: mods([0, 0, 1, 2, 0, 0, 0, 0, 3, 3]),
      minToolTier: 0,
      parts: [],
    },
  },
  {
    type: 'object',
    subtype: 'misc',
    id: 'dvergrprops_crate',
    tier: 6,
    Destructible: {
      hp: 200,
      damageModifiers: mods([0, 0, 1, 2, 0, 0, 0, 0, 3, 3]),
      minToolTier: 0,
      parts: [],
    },
    drop: [{
      num: [1, 4],
      options: [
        { item: 'FineWood' },
        { item: 'Softtissue', num: [2, 4] },
      ]
    }],
  },
  {
    type: 'object',
    subtype: 'treasure',
    id: 'TreasureChest_trollcave',
    iconId: 'piece/piece_chest_wood',
    components: ['Container'],
    tier: 2,
    drop: [{
      offByOneBug: false,
      oneOfEach,
      num: [3, 5],
      options: [
        { item: 'Wood', num: [10, 30], },
        { item: 'Stone', num: [10, 30], },
        { item: 'Ruby', num: [1, 2], },
        { item: 'Coins', num: [20, 50], },
        { item: 'DeerHide', num: [2, 4], },
        { item: 'BoneFragments', num: [10, 15], },
        { item: 'LeatherScraps', num: [3, 5], },
      ],
    }],
  },
  {
    type: 'object',
    subtype: 'treasure',
    id: 'Pickable_ForestCryptRandom',
    iconId: 'resource/Coins',
    components: ['PickableItem'],
    tier: 2,
    drop: [{
      offByOneBug: false,
      num: [1, 1],
      options: [
        { item: 'Coins', num: [5, 20] },
        { item: 'Ruby', num: [1, 2] },
        { item: 'Amber', num: [1, 5] },
        { item: 'AmberPearl', num: [1, 3] },
      ]
    }],
  },
  {
    type: 'object',
    subtype: 'treasure',
    id: 'TreasureChest_swamp',
    iconId: 'piece/piece_chest_wood',
    components: ['Container'],
    tier: 3,
    drop: [{
      offByOneBug: false,
      oneOfEach,
      num: [2, 3],
      options: [
        { item: 'WitheredBone', num: [1, 1], weight: 0.5, },
        { item: 'ArrowIron', num: [10, 15], },
        { item: 'ArrowPoison', num: [10, 15], },
        { item: 'Coins', num: [20, 60], },
        { item: 'Amber', num: [1, 5], },
        { item: 'AmberPearl', num: [1, 3], },
        { item: 'Ruby', num: [1, 3], },
        { item: 'Chain', num: [1, 1], },
        { item: 'ElderBark', num: [20, 30], },
      ],
    }],
  },
  {
    type: 'object',
    subtype: 'treasure',
    id: 'TreasureChest_sunkencrypt',
    iconId: 'piece/piece_chest_wood',
    components: ['Container'],
    tier: 3,
    drop: [{
      offByOneBug: false,
      oneOfEach,
      num: [2, 3],
      options: [
        { item: 'WitheredBone', num: [1, 1], weight: 0.5, },
        { item: 'ArrowIron', num: [10, 15], },
        { item: 'ArrowPoison', num: [10, 15], },
        { item: 'Coins', num: [20, 60], },
        { item: 'Amber', num: [1, 5], },
        { item: 'AmberPearl', num: [1, 3], },
        { item: 'Ruby', num: [1, 3], },
        { item: 'Chain', num: [1, 3], },
        { item: 'ElderBark', num: [20, 30], },
        { item: 'IronScrap', num: [10, 20], weight: 2 },
      ],
    }],
  },
  {
    type: 'object',
    subtype: 'treasure',
    id: 'Pickable_SunkenCryptRandom',
    iconId: 'resource/Coins',
    components: ['PickableItem'],
    tier: 3,
    drop: [{
      offByOneBug: false,
      num: [1, 1],
      options: [
        { item: 'Coins', num: [5, 30] },
        { item: 'Ruby', num: [1, 2] },
        { item: 'Amber', num: [3, 10] },
        { item: 'AmberPearl', num: [2, 5] },
        { item: 'WitheredBone', num: [1, 1], weight: 2 },
      ]
    }],
  },
  {
    type: 'object',
    subtype: 'treasure',
    id: 'TreasureChest_mountains',
    iconId: 'piece/piece_chest_wood',
    components: ['Container'],
    tier: 4,
    drop: [{
      offByOneBug: false,
      oneOfEach,
      num: [2, 4],
      options: [
        { item: 'OnionSeeds', num: [3, 9], },
        { item: 'Amber', num: [1, 6], },
        { item: 'Coins', num: [30, 55], },
        { item: 'AmberPearl', num: [2, 5], },
        { item: 'Ruby', num: [1, 2], },
        { item: 'Obsidian', num: [5, 10], },
        { item: 'ArrowFrost', num: [5, 10], },
      ],
    }],
  },
  {
    type: 'object',
    subtype: 'treasure',
    id: 'TreasureChest_mountaincave',
    iconId: 'piece/piece_chest_wood',
    components: ['Container'],
    tier: 4,
    drop: [{
      offByOneBug: false,
      oneOfEach,
      num: [2, 5],
      options: [
        { item: 'Obsidian', num: [3, 9], weight: 0.5 },
        { item: 'SilverNecklace', num: [1, 1], weight: 0.1 },
        { item: 'Ruby', num: [1, 2], weight: 0.5 },
        { item: 'Coins', num: [15, 35] },
        { item: 'Coins', num: [15, 35] },
        { item: 'Obsidian', num: [1, 5] },
      ],
    }],
  },
  {
    type: 'object',
    subtype: 'treasure',
    id: 'TreasureChest_mountaincave_hildir',
    iconId: 'piece/piece_chest_wood',
    components: ['Container'],
    tier: 4,
    disabled: true,
    drop: [singleDrop('HildirKey_mountaincave')],
  },
  {
    type: 'object',
    subtype: 'treasure',
    id: 'TreasureChest_heath',
    iconId: 'piece/piece_chest_wood',
    components: ['Container'],
    tier: 5,
    drop: [{
      offByOneBug: false,
      oneOfEach,
      num: [2, 3],
      options: [
        { item: 'Barley', num: [2, 4], weight: 0.5, },
        { item: 'BlackMetalScrap', num: [2, 5], },
        { item: 'Needle', num: [2, 5], },
        { item: 'Coins', num: [10, 40], },
        { item: 'SharpeningStone', weight: 0.1, },
      ],
    }],
  },
  {
    type: 'object',
    subtype: 'treasure',
    tier: 5,
    id: 'TreasureChest_plains_stone',
    iconId: 'piece/piece_chest_wood',
    components: ['Container'],
    drop: [{
      offByOneBug: false,
      oneOfEach,
      num: [2, 4],
      options: [
        { item: 'Feathers', num: [5, 10], },
        { item: 'ArrowObsidian', num: [5, 10], },
        { item: 'SilverNecklace', weight: 0.5 },
        { item: 'Coins', num: [66, 99], },
        { item: 'GoblinTotem', weight: 0.1, },
      ],
    }],
  },
  {
    type: 'object',
    subtype: 'treasure',
    tier: 5,
    id: 'TreasureChest_plainsfortress_hildir',
    iconId: 'piece/piece_chest_wood',
    components: ['Container'],
    disabled: true,
    drop: [singleDrop('HildirKey_plainsfortress')],
  },
  {
    type: 'object',
    subtype: 'treasure',
    id: 'Pickable_MountainRemains01_buried',
    iconId: 'resource/BoneFragments',
    components: ['PickableItem'],
    tier: 4,
    drop: [{
      offByOneBug: false,
      oneOfEach,
      num: [1, 2],
      options: [
        { item: 'SilverNecklace', weight: 0.5 },
        { item: 'BoneFragments', num: [1, 2], weight: 2 },
      ],
    }],
    Beacon: 20,
  },
  {
    type: 'object',
    subtype: 'treasure',
    id: 'Pickable_MountainCaveRandom',
    iconId: 'resource/Coins',
    components: ['PickableItem'],
    tier: 4,
    drop: [{
      offByOneBug: false,
      num: [1, 1],
      options: [
        { item: 'Coins', num: [40, 60] },
        { item: 'WolfHairBundle', num: [1, 1] },
        { item: 'WolfClaw', num: [1, 1] },
        { item: 'SilverNecklace', num: [1, 1] },
      ]
    }],
  },
  {
    type: 'object',
    subtype: 'treasure',
    id: 'Pickable_MeatPile',
    iconId: 'resource/RottenMeat',
    components: ['PickableItem'],
    tier: 4,
    drop: [{
      offByOneBug: false,
      num: [1, 3],
      chance: 0.5,
      options: [
        { item: 'Coins', num: [9, 41], weight: 5 },
        { item: 'BoneFragments', num: [1, 1], weight: 5 },
        { item: 'SilverNecklace', num: [1, 1], weight: 1 },
      ]
    }, singleDrop('Entrails')],
  },
  {
    type: 'object',
    subtype: 'treasure',
    id: 'Pickable_Item',
    iconId: 'resource/Coins',
    components: ['PickableItem'],
    tier: 4,
    drop: [singleDrop('Coins', 3, 10)], // 3-9, but offByOneBug: false
  },
  // those MountainKit are used in ice caves, but are not very important
  {
    type: 'object',
    subtype: 'indestructible',
    id: 'MountainKit_int_floor_2x2',
    disabled: true,
    iconId: 'piece/stone_floor_2x2',
    tier: 4,
  },
  {
    type: 'object',
    subtype: 'indestructible',
    id: 'MountainKit_int_wall_4x2',
    disabled: true,
    iconId: 'piece/stone_wall_4x2',
    tier: 4,
  },
  {
    type: 'object',
    subtype: 'indestructible',
    id: 'MountainKit_int_wall_2x4',
    disabled: true,
    iconId: 'piece/stone_wall_4x2',
    tier: 4,
  },
  {
    type: 'object',
    subtype: 'indestructible',
    id: 'MountainKit_int_wall_4x4',
    disabled: true,
    iconId: 'piece/stone_wall_2x2',
    tier: 4,
  },
  {
    type: 'object',
    subtype: 'indestructible',
    id: 'StonePillarTall_mountain',
    disabled: true,
    iconId: 'piece/stone_wall_4x2',
    tier: 4,
  },
  {
    type: 'object',
    subtype: 'treasure',
    tier: 6,
    id: 'TreasureChest_dvergrtown',
    iconId: 'piece/piece_chest_wood',
    components: ['Container'],
    drop: [{
      offByOneBug: false,
      oneOfEach,
      num: [3, 8],
      options: [
        { item: 'Coins', num: [11, 33], },
        { item: 'Coins', num: [11, 33], },
        { item: 'Coins', num: [11, 33], },
        { item: 'Coins', num: [11, 33], },
        { item: 'Coins', num: [11, 33], },
        { item: 'Coins', num: [11, 33], },
        { item: 'Coins', num: [11, 33], },
        { item: 'Coins', num: [11, 33], },
      ],
    }],
  },
  {
    type: 'object',
    subtype: 'treasure',
    tier: 6,
    id: 'TreasureChest_dvergrtower',
    disabled: true,
    iconId: 'piece/piece_chest_wood',
    components: ['Container'],
    drop: [{
      offByOneBug: false,
      oneOfEach,
      num: [3, 8],
      options: [
        { item: 'Coins', num: [12, 54], },
        { item: 'Softtissue', num: [1, 8], },
        { item: 'DvergrNeedle', num: [1, 3], },
      ],
    }],
  },
  {
    type: 'object',
    subtype: 'treasure',
    tier: 6,
    id: 'TreasureChest_dvergr_loose_stone',
    disabled: true,
    iconId: 'resource/Coins',
    components: ['Container'],
    drop: [{
      offByOneBug: false,
      oneOfEach,
      num: [3, 8],
      options: [
        { item: 'Coins', num: [19, 99], },
        { item: 'BoneFragments', num: [2, 3], weight: 0.5, },
      ],
    }],
    // 10 stone
  },
  {
    type: 'object',
    subtype: 'treasure',
    tier: 7,
    id: 'TreasureChest_ashland_stone',
    iconId: 'object/stone_chest',
    components: ['Container'], // 4x2
    drop: [{
      offByOneBug: false,
      oneOfEach,
      num: [2, 4],
      options: [
        { item: 'MoltenCore', num: [1, 2] },
        { item: 'CharredBone', num: [3, 12] },
        { item: 'ArrowCarapace', num: [3, 12] },
        { item: 'Coins', num: [99, 199] },
        { item: 'Blackwood', num: [1, 2] },
      ],
    }],
  },
  {
    type: 'object',
    subtype: 'treasure',
    tier: 7,
    id: 'TreasureChest_charredfortress',
    iconId: 'resource/Coins',
    components: ['Container'], // 4x2
    drop: [{
      offByOneBug: false,
      num: [4, 6],
      options: [
        { item: 'GemstoneBlue', weight: 0.5 },
        { item: 'GemstoneGreen', weight: 0.5 },
        { item: 'GemstoneRed', weight: 0.5 },
        { item: 'Coins', num: [200, 500] },
        { item: 'CharredBone', num: [5, 10] },
        { item: 'Charredskull', num: [1, 2] },
        { item: 'CelestialFeather', num: [1, 2], weight: 0.1 },
        { item: 'MoltenCore', num: [1, 2], weight: 0.5 },
      ],
    }],
  },
];

export const objects: PhysicalObject[] = [
  ...pickables.map<PhysicalObject>(p => ({
    type: 'object',
    subtype: p.subtype,
    id: p.id,
    iconId: p.iconId,
    components: ['Pickable'],
    tier: p.tier,
    grow: itemGrow(...(p.grow ?? [])),
    drop: [singleDrop(p.item, p.number ?? 1)],
    PointLight: p.PointLight,
  })),
  ...traders,
  ...treasures,
  {
    type: 'object',
    subtype: 'plant',
    id: 'Pickable_Carrot',
    iconId: 'resource/Carrot',
    components: ['Pickable', 'Plant'],
    tier: 2,
    Plant: {
      subtype: 'vegetable',
      plantedWith: 'CarrotSeeds',
      growTime: [4000, 5000],
      cultivatedGround: true,
      destroyUnhealthy: true,
      freeSpaceRadius: 0.5,
      biomes: ['Meadows', 'BlackForest', 'Plains'],
    },
    drop: [singleDrop('Carrot', 3)],
  },
  {
    type: 'object',
    subtype: 'plant',
    id: 'Pickable_SeedCarrot',
    iconId: 'resource/SeedCarrot',
    components: ['Pickable', 'Plant'],
    tier: 2,
    Plant: {
      subtype: 'vegetable',
      plantedWith: 'Carrot',
      growTime: [4000, 5000],
      cultivatedGround: true,
      destroyUnhealthy: true,
      freeSpaceRadius: 0.5,
      biomes: ['Meadows', 'BlackForest', 'Plains'],
    },
    grow: itemGrow({
      num: [0, 0.5],
      scale: [1, 1.5],
      randTilt: 0,
      locations: ['BlackForest'],
      tilt: [0, 25],
      abundance: 1,
      group: [1, 2],
      groupRadius: 5,
    }),
    drop: [singleDrop('CarrotSeeds', 3)],
  },
  {
    type: 'object',
    subtype: 'plant',
    id: 'Pickable_Turnip',
    iconId: 'resource/Turnip',
    components: ['Pickable', 'Plant'],
    tier: 3,
    Plant: {
      subtype: 'vegetable',
      plantedWith: 'TurnipSeeds',
      growTime: [4000, 5000],
      cultivatedGround: true,
      destroyUnhealthy: true,
      freeSpaceRadius: 0.5,
      biomes: ['Meadows', 'BlackForest', 'Swamp', 'Plains'],
    },
    drop: [singleDrop('Turnip', 3)],
  },
  {
    type: 'object',
    subtype: 'plant',
    id: 'Pickable_SeedTurnip',
    iconId: 'resource/SeedTurnip',
    components: ['Pickable', 'Plant'],
    tier: 3,
    Plant: {
      subtype: 'vegetable',
      plantedWith: 'Turnip',
      growTime: [4000, 5000],
      cultivatedGround: true,
      destroyUnhealthy: true,
      freeSpaceRadius: 0.5,
      biomes: ['Meadows', 'BlackForest', 'Swamp', 'Plains'],
    },
    grow: itemGrow({
      num: [0, 0.5],
      scale: [1, 1.5],
      randTilt: 0,
      locations: ['Swamp'],
      tilt: [0, 25],
      abundance: 1,
      group: [1, 2],
      groupRadius: 5,
    }),
    drop: [singleDrop('TurnipSeeds', 3)],
  },
  {
    type: 'object',
    subtype: 'plant',
    id: 'Pickable_Onion',
    iconId: 'resource/Onion',
    components: ['Pickable', 'Plant'],
    tier: 4,
    Plant: {
      subtype: 'vegetable',
      plantedWith: 'OnionSeeds',
      growTime: [4000, 5000],
      cultivatedGround: true,
      destroyUnhealthy: true,
      freeSpaceRadius: 0.5,
      biomes: ['Meadows', 'BlackForest', 'Plains'],
    },
    drop: [singleDrop('Onion', 3)],
  },
  {
    type: 'object',
    subtype: 'plant',
    id: 'Pickable_SeedOnion',
    iconId: 'resource/SeedOnion',
    components: ['Pickable', 'Plant'],
    tier: 4,
    Plant: {
      subtype: 'vegetable',
      plantedWith: 'Onion',
      growTime: [4000, 5000],
      cultivatedGround: true,
      destroyUnhealthy: true,
      freeSpaceRadius: 0.5,
      biomes: ['Meadows', 'BlackForest', 'Plains'],
    },
    drop: [singleDrop('OnionSeeds', 3)],
  },
  {
    type: 'object',
    subtype: 'plant',
    id: 'Pickable_Barley',
    iconId: 'resource/Barley',
    components: ['Pickable', 'Plant'],
    tier: 5,
    Plant: {
      subtype: 'crop',
      plantedWith: 'Barley',
      growTime: [4000, 5000],
      cultivatedGround: true,
      destroyUnhealthy: true,
      freeSpaceRadius: 0.5,
      biomes: ['Plains'],
    },
    drop: [singleDrop('Barley', 2)],
  },
  {
    type: 'object',
    subtype: 'plant',
    id: 'Pickable_Flax',
    iconId: 'resource/Flax',
    components: ['Pickable', 'Plant'],
    tier: 5,
    Plant: {
      subtype: 'crop',
      plantedWith: 'Flax',
      growTime: [4000, 5000],
      cultivatedGround: true,
      destroyUnhealthy: true,
      freeSpaceRadius: 0.5,
      biomes: ['Plains'],
    },
    drop: [singleDrop('Flax', 2)],
  },
  {
    // piece_sapling_jotunpuffs,"Jotun puffs primordia"
    type: 'object',
    subtype: 'plant',
    id: 'Pickable_Mushroom_JotunPuffs',
    components: ['Pickable', 'Plant'],
    tier: 6,
    Plant: {
      subtype: 'shroom',
      plantedWith: 'MushroomJotunPuffs',
      growTime: [4000, 5000],
      cultivatedGround: true,
      destroyUnhealthy: true,
      freeSpaceRadius: 0.8,
      biomes: ['Mistlands'],
    },
    grow: itemGrow({
      num: [1, 2],
      locations: ['Mistlands'],
      randTilt: 0,
      tilt: [0, 60],
      group: [1, 3],
      groupRadius: 5,
    }),
    PointLight: { color: '#FFDE52', range: 1.5, intensity: 1.5 },
    drop: [singleDrop('MushroomJotunPuffs', 3)],
  },
  {
    // piece_sapling_magecap,"Magecap primordia"
    type: 'object',
    subtype: 'plant',
    id: 'Pickable_Mushroom_Magecap',
    components: ['Pickable', 'Plant'],
    tier: 6,
    Plant: {
      subtype: 'shroom',
      plantedWith: 'MushroomMagecap',
      growTime: [4000, 5000],
      cultivatedGround: true,
      destroyUnhealthy: true,
      freeSpaceRadius: 0.8,
      biomes: ['Mistlands'],
    },
    grow: itemGrow({
      num: [2, 2],
      locations: ['Mistlands'],
      randTilt: 0,
      altitude: [1, 2000],
      tilt: [0, 60],
      group: [1, 3],
      groupRadius: 5,
    }),
    PointLight: { color: '#66CDFF', range: 5, intensity: 1.5 },
    drop: [singleDrop('MushroomMagecap', 3)],
  },
  {
    type: 'object',
    subtype: 'indestructible',
    id: 'Stone1_huge',
    tier: 0,
    grow: [],
    // size: [6, 13, 6],
  },
  {
    type: 'object',
    subtype: 'plant',
    id: 'VineGreen',
    components: ['Pickable', 'Plant'],
    tier: 3,
    Plant: {
      subtype: 'crop',
      plantedWith: 'VineGreenSeeds',
      growTime: [4000, 5000],
      cultivatedGround: true,
      destroyUnhealthy: true,
      freeSpaceRadius: 0.8,
      biomes: ['Ashlands'],
    },
    grow: [],
    drop: [
      singleDrop('Vineberry', 3),
      {
        chance: 0.2,
        num: [1, 3],
        options: [{ item: 'VineGreenSeeds', num: [1, 3] }],
      }
    ],
  },
  {
    type: 'object',
    subtype: 'plant',
    id: 'VineAsh',
    components: ['Pickable', 'Plant'],
    tier: 7,
    Plant: {
      subtype: 'crop',
      plantedWith: 'VineberrySeeds',
      growTime: [4000, 5000],
      cultivatedGround: true,
      destroyUnhealthy: true,
      freeSpaceRadius: 0.8,
      biomes: ['Ashlands'],
    },
    grow: [],
    drop: [
      singleDrop('Vineberry', 3),
      {
        chance: 0.2,
        num: [1, 3],
        options: [{ item: 'VineberrySeeds', num: [1, 3] }],
      }
    ],
  },
  {
    type: 'object',
    subtype: 'indestructible',
    id: 'Stone1_huge',
    tier: 0,
    grow: [],
    // size: [6, 13, 6],
  },
  ...rock({
    id: ['rock4_coast', 'rock4_coast_frac'],
    grow: itemGrow({
      num: [3, 3],
      scale: [0.6, 1.2],
      randTilt: 15,
      locations: ['Meadows', 'BlackForest', 'Ashlands', 'DeepNorth', 'Mistlands'],
      altitude: [-0.5, -30],
      abundance: 1,
      group: [3, 3],
      groupRadius: 5,
    }),
    children: 132,
    hp: 50,
    drop: singleDrop('Stone', 4, 8),
  }),
  {
    type: 'object',
    subtype: 'misc',
    id: 'vines',
    components: ['Destructible'],
    tier: 1,
    Destructible: {
      hp: 50,
      damageModifiers: allNormal,
      minToolTier: 0,
      parts: [],
    },
    drop: [singleDrop('Wood')],
  },
  {
    type: 'object',
    subtype: 'misc',
    id: 'Beehive',
    // Aoe: { damage: dmg({ poison: 10 }), self: 10, backstabBonus: 4 },,
    components: ['Destructible'],
    tier: 1,
    Destructible: {
      hp: 50,
      // idle: 4 poison, 3 radius, every second
      // on hit: 10 poison, 4 radius, every second, 5 seconds
      damageModifiers: {
        ...allNormal,
        fire: 'weak',
      },
      minToolTier: 0,
      parts: [],
    },
    drop: [{
      num: [2, 2],
      oneOfEach,
      options: [
        { item: 'QueenBee' },
        { item: 'Honey', num: [1, 3] },
      ]
    }],
  },
  {
    type: 'object',
    subtype: 'tree',
    id: 'Beech_small1',
    group: 'beech',
    tier: 0,
    grow: [
      ...itemGrow({
        locations: ['Meadows'],
        tilt: [0, 30],
        num: [80, 80],
        inForest: [0, 1],
      }),
      ...itemGrow({
        locations: ['Meadows'],
        tilt: [0, 30],
        num: [100, 100],
        inForest: [1.1, 1.15]
      }),
    ],
    Destructible: {
      hp: 20,
      damageModifiers: allNormal, // ???
      minToolTier: 0,
      parts: [],
    },
    drop: [{
      num: [2, 3],
      options: [
        { weight: 5, item: 'Wood' },
        { weight: 1, item: 'Resin', num: [1, 2] },
      ]
    }],
  },
  {
    type: 'object',
    subtype: 'tree',
    id: 'Beech_small2',
    group: 'beech',
    tier: 0,
    grow: [
      ...itemGrow({
        locations: ['Meadows'],
        tilt: [0, 30],
        num: [80, 80],
        inForest: [0, 1],
      }),
      ...itemGrow({
        locations: ['Meadows'],
        tilt: [0, 30],
        num: [100, 100],
        inForest: [1.1, 1.15]
      }),
    ],
    Destructible: {
      hp: 20,
      damageModifiers: allNormal, // ???
      minToolTier: 0,
      parts: [],
    },
    drop: [{
      num: [2, 3],
      options: [
        { weight: 5, item: 'Wood' },
        { weight: 1, item: 'Resin', num: [1, 2] },
      ]
    }],
  },
  ...tree({
    id: ['Beech1', 'Beech_Stub', 'beech_log', 'beech_log_half'],
    group: 'beech',
    tier: 1,
    minToolTier: 0,
    grow: itemGrow({
      locations: ['Meadows'],
      tilt: [0, 30],
      altitude: [0.2, 1000],
      num: [40, 40],
      inForest: [0, 1.15],
    }),
    hp: [80, 60, 60],
    drop: [{
      chance: 0.5,
      num: [2, 2],
      options: [
        { weight: 4, item: 'BeechSeeds', num: [2, 3] },
        { weight: 1, item: 'Feathers', num: [1, 2] },
        { weight: 1, item: 'Resin', num: [1, 2] },
      ]
    }, singleDrop('Wood', 10)],
    Plant: {
      subtype: 'tree',
      plantedWith: 'BeechSeeds',
      growTime: [3000, 5000],
      cultivatedGround: false,
      destroyUnhealthy: true,
      freeSpaceRadius: 2,
      biomes: ['Meadows', 'BlackForest', 'Plains'],
    },
  }),
  {
    type: 'object',
    subtype: 'tree',
    id: 'stubbe',
    tier: 1,
    grow: itemGrow({
      locations: ['BlackForest', 'Mistlands'],
      altitude: [0, 1000],
      tilt: [0, 20],
      num: [15, 15],
    }, {
      locations: ['Swamp'],
      altitude: [0, 1000],
      tilt: [0, 20],
      num: [4, 4],
    }, {
      locations: ['Meadows'],
      altitude: [0, 1000],
      tilt: [0, 20],
      num: [1, 3],
    }),
    Destructible: {
      hp: 40,
      damageModifiers: chopOnly,
      minToolTier: 0,
      parts: [],
    },
    drop: [singleDrop('Wood', 3, 4)],
  },
  {
    type: 'object',
    subtype: 'tree',
    id: 'FirTree_oldLog',
    iconId: 'object/FirTree_oldLog',
    tier: 0,
    grow: itemGrow({
      locations: ['Swamp'],
      altitude: [-1, 1000],
      tilt: [0, 20],
      num: [6, 6],
    }, {
      locations: ['Meadows'],
      altitude: [-1000, 1000],
      tilt: [0, 20],
      num: [1, 4],
    }, {
      locations: ['BlackForest'],
      altitude: [0, 1000],
      tilt: [0, 25],
      num: [6, 6],
    }),
    Destructible: {
      hp: 40,
      damageModifiers: chopOnly,
      minToolTier: 0,
      parts: [],
    },
    drop: [singleDrop('Wood', 5, 7)],
  },
  ...tree({
    id: ['FirTree', 'FirTree_Stub', 'FirTree_log', 'FirTree_log_half'],
    group: 'fir',
    tier: 1,
    minToolTier: 0,
    grow: itemGrow({
      locations: ['Mountain'],
      altitude: [2, 280],
      tilt: [0, 30],
      num: [5, 20],
    }, {
      locations: ['BlackForest'],
      altitude: [0.1, 1000],
      tilt: [0, 30],
      num: [40, 40], // +5 on the edge of biome
    }),
    hp: [80, 60, 40],
    drop: [{
      chance: 0.5,
      num: [1, 2],
      options: [
        { weight: 4, item: 'FirCone' },
        { weight: 1, item: 'Feathers' },
        { weight: 1, item: 'Resin' },
      ]
    }, singleDrop('Wood', 10)],
    Plant: {
      subtype: 'tree',
      plantedWith: 'FirCone',
      growTime: [3000, 5000],
      cultivatedGround: false,
      destroyUnhealthy: true,
      freeSpaceRadius: 2,
      biomes: ['Meadows', 'BlackForest', 'Mountain', 'Plains'],
    },
  }),
  {
    type: 'object',
    subtype: 'tree',
    id: 'FirTree_small',
    group: 'fir',
    tier: 0,
    grow: itemGrow({
      locations: ['BlackForest'],
      altitude: [0.5, 1000],
      tilt: [0, 30],
      num: [90, 90], // two entries: 60+30
    }, {
      locations: ['Mountain'],
      altitude: [0, 280],
      tilt: [0, 30],
      num: [30, 30],
    }),
    Destructible: {
      hp: 40,
      damageModifiers: chopOnly,
      minToolTier: 0,
      parts: [],
    },
    drop: [{
      num: [4, 5],
      options: [
        { weight: 10, item: 'Wood' },
        { weight: 1, item: 'FirCone' },
        { weight: 1, item: 'Resin' },
      ],
    }],
  },
  {
    type: 'object',
    subtype: 'tree',
    id: 'FirTree_small_dead',
    group: 'fir',
    tier: 3,
    grow: itemGrow({
      locations: ['Swamp'],
      altitude: [0.5, 1000],
      tilt: [0, 25],
      num: [60, 60],
    }/*, {
      locations: ['Mistlands'],
      altitude: [0, 1000],
      tilt: [0, 30],
      num: [30, 30],
    }*/),
    Destructible: {
      hp: 40,
      damageModifiers: chopOnly,
      minToolTier: 0,
      parts: [],
    },
    drop: [singleDrop('Wood', 4, 5)],
  },
  ...tree({
    id: ['Pinetree_01', 'Pinetree_01_Stub', 'PineTree_log', 'PineTree_log_half'],
    tier: 2,
    minToolTier: 0,
    grow: itemGrow({
      locations: ['BlackForest'],
      altitude: [0.1, 1000],
      tilt: [0, 30],
      num: [60, 60],
    }, {
      locations: ['Mistlands'],
      altitude: [0.1, 1000],
      tilt: [0, 30],
      num: [5, 5],
    }),
    hp: [120, 60, 40],
    drop: [{
      chance: 0.5,
      num: [1, 2],
      options: [
        { weight: 4, item: 'Resin' },
        { weight: 1, item: 'Feathers' },
        { weight: 4, item: 'PineCone' },
      ],
    }, {
      num: [15, 15],
      options: [
        { item: 'Wood' },
        { item: 'RoundLog' },
      ],
    }],
    Plant: {
      subtype: 'tree',
      plantedWith: 'PineCone',
      growTime: [3000, 5000],
      cultivatedGround: false,
      destroyUnhealthy: true,
      freeSpaceRadius: 2,
      biomes: ['Meadows', 'BlackForest', 'Plains'],
    },
  }),
  ...tree({
    id: ['Birch1', 'BirchStub', 'Birch_log', 'Birch_log_half'],
    group: 'birch',
    tier: 2,
    minToolTier: 2,
    grow: itemGrow(
      { // Birch{1,2}
        locations: ['Meadows'],
        altitude: [0.2, 1000],
        tilt: [0, 30],
        num: [5, 8], // type1: 5-5, type2: 0-3
        inForest: [0, 1.15],
      },
    ),
    hp: [80, 60, 60],
    drop: [{
      chance: 0.5,
      num: [2, 2],
      options: [
        { weight: 1, item: 'Resin', num: [1, 2] },
        { weight: 1, item: 'Feathers', num: [1, 2] },
        { weight: 2, item: 'BirchSeeds', num: [1, 2] },
      ],
    }, {
      num: [10, 10],
      options: [
        { item: 'Wood' },
        { item: 'FineWood' },
      ],
    }],
    Plant: {
      subtype: 'tree',
      plantedWith: 'BirchSeeds',
      growTime: [5000, 7000],
      cultivatedGround: false,
      destroyUnhealthy: true,
      freeSpaceRadius: 2,
      biomes: ['Meadows', 'BlackForest', 'Plains'],
    },
  }),
  {
    // tags: ['plant'],
    type: 'object',
    subtype: 'tree',
    id: 'Birch1_aut',
    tier: 2,
    group: 'birch',
    Destructible: {
      hp: 80,
      damageModifiers: chopOnly,
      minToolTier: 2,
      parts: [
        { id: 'BirchStub', num: 1 },
        { id: 'Birch_log', num: 1 },
      ],
    },
    grow: itemGrow(
      { // Birch{1,2}_aut
        locations: ['Plains'],
        altitude: [0.1, 1000],
        tilt: [0, 30],
        num: [40, 40], // type1: 30, type2: 10
        inForest: [0, 0.8],
      },
    ),
    drop: [{
      chance: 0.5,
      num: [1, 2],
      options: [
        { weight: 1, item: 'Resin', num: [1, 2] },
        { weight: 1, item: 'Feathers', num: [1, 2] },
        { weight: 2, item: 'BirchSeeds', num: [1, 2] },
      ],
    }],
  },
  ...tree({
    id: ['Oak1', 'OakStub', 'Oak_log', 'Oak_log_half'],
    tier: 2,
    minToolTier: 2,
    grow: itemGrow({
      locations: ['Meadows'],
      altitude: [0.5, 1000],
      tilt: [0, 20],
      num: [0, 1],
      inForest: [1, 3],
    }),
    hp: [200, 160, 140],
    drop: [{
      chance: 0.5,
      num: [2, 3],
      options: [
        { item: 'Resin', num: [2, 4] },
        { item: 'Acorn', num: [2, 3] },
        { item: 'Feathers', num: [2, 3], weight: 0.5 },
      ]
    }, {
      num: [25, 25],
      options: [
        { item: 'Wood' },
        { item: 'FineWood' },
      ],
    }],
    Plant: {
      subtype: 'tree',
      plantedWith: 'Acorn',
      growTime: [6000, 8000],
      cultivatedGround: false,
      destroyUnhealthy: true,
      freeSpaceRadius: 3,
      biomes: ['Meadows', 'BlackForest', 'Plains'],
    },
  }),
  ...treeSimpler({
    id: ['SwampTree1', 'SwampTree1_Stub', 'SwampTree1_log'],
    tier: 3,
    minToolTier: 0,
    grow: itemGrow({
      locations: ['Swamp'],
      altitude: [-0.5, 1000],
      tilt: [0, 30],
      num: [40, 40],
    }),
    hp: [80, 60],
    drop: [emptyDrop, {
      num: [10, 10],
      options: [
        { item: 'Wood' },
        { item: 'ElderBark' },
      ],
    }],
  }),
  ...[1, 2, 3, 4].map<PhysicalObject>(subId => ({
    type: 'object',
    subtype: 'indestructible',
    id: `RockDolmen_${subId}`,
    tier: 1,
    grow: [],
  })),
  {
    type: 'object',
    subtype: 'indestructible',
    id: 'SwampTree2',
    tier: 3,
    grow: itemGrow({
      locations: ['Swamp'],
      altitude: [-0.5, 1000],
      tilt: [0, 35],
      num: [10, 20],
    }),
  },
  {
    type: 'object',
    subtype: 'indestructible',
    id: 'SwampTree2_log',
    tier: 3,
    grow: itemGrow({
      locations: ['Swamp'],
      altitude: [-0.5, 1000],
      tilt: [0, 35],
      num: [1, 3],
    }),
  },
  {
    type: 'object',
    subtype: 'tree',
    id: 'shrub_2',
    tier: 2,
    grow: [],
  },
  {
    type: 'object',
    subtype: 'tree',
    id: 'shrub_2_heath',
    tier: 5,
    grow: [],
  },
  {
    type: 'object',
    subtype: 'tree',
    id: 'Bush01',
    tier: 1,
    grow: [],
  },
  {
    type: 'object',
    subtype: 'tree',
    id: 'Bush02_en',
    tier: 1,
    grow: itemGrow({
      locations: ['BlackForest'],
      tilt: [0, 30],
      num: [1, 3],
      group: [3, 8],
    }),
  },
  {
    type: 'object',
    subtype: 'tree',
    id: 'Bush01_heath',
    tier: 5,
    grow: [],
  },
  ...rock({
    id: ['rock4_forest', 'rock4_forest_frac'],
    grow: itemGrow({
      locations: ['BlackForest'],
      altitude: [4, 1000],
      tilt: [5, 45],
      num: [1, 2],
      offset: -2,
    }),
    hp: 50,
    children: 132,
    drop: singleDrop('Stone', 4, 8),
  }),
  ...rock({
    subtype: 'ore',
    id: ['rock4_copper', 'rock4_copper_frac'],
    tier: 2,
    grow: itemGrow({
      locations: ['BlackForest'],
      altitude: [4, 1000],
      tilt: [5, 45],
      num: [0, 1],
      offset: -2,
    }),
    hp: 50,
    children: 130,
    drop: {
      num: [2, 4],
      options: [
        { item: 'Stone', weight: 2 },
        { item: 'CopperOre' },
      ],
    },
  }),
  {
    type: 'object',
    subtype: 'ore',
    id: 'MineRock_Tin',
    tier: 2,
    Destructible: {
      minToolTier: 0,
      hp: 30,
      damageModifiers: pickOnly,
      parts: [],
    },
    grow: itemGrow({
      locations: ['BlackForest'],
      altitude: [-0.6, 1.5],
      num: [20, 20],
      offset: -0.5,
    }),
    drop: [{
      num: [3, 4],
      options: [{ item: 'TinOre' }],
    }],
  },
  {
    type: 'object',
    subtype: 'misc',
    id: 'Greydwarf_Root',
    tier: 2,
    Destructible: {
      minToolTier: 0,
      hp: 100,
      damageModifiers: greydwarfNestModifiers,
      parts: [],
    },
    drop: [{
      num: [2, 4],
      options: [{ item: 'Wood' }, { item: 'Resin' }],
    }],
  },
  {
    type: 'object',
    subtype: 'misc',
    id: 'Spawner_GreydwarfNest',
    components: ['CreatureSpawner'],
    iconId: 'resource/TrophyGreydwarf',
    tier: 2,
    grow: [],
    PointLight: { color: '#940071', range: 4, intensity: 3 },
    Destructible: {
      minToolTier: 0,
      hp: 100,
      damageModifiers: greydwarfNestModifiers,
      parts: [],
    },
    drop: [singleDrop('AncientSeed')],
    SpawnArea: {
      levelUpChance: 0.15,
      maxNear: 3,
      interval: 10,
      prefabs: [
        { prefab: 'Greydwarf', weight: 5, level: [1, 3] },
        { prefab: 'Greydwarf_Elite', weight: 1, level: [1, 3] },
        { prefab: 'Greydwarf_Shaman', weight: 1, level: [1, 3] },
      ],
    },
  },
  {
    type: 'object',
    subtype: 'misc',
    id: 'BonePileSpawner',
    components: ['CreatureSpawner'],
    tier: 2,
    grow: [],
    Destructible: {
      minToolTier: 0,
      hp: 50,
      damageModifiers: {
        blunt: 'weak',
        slash: 'normal',
        pierce: 'normal',
        chop: 'immune',
        pickaxe: 'immune',
        fire: 'normal',
        frost: 'normal',
        lightning: 'normal',
        poison: 'normal',
        spirit: 'normal',
      },
      parts: [],
    },
    SpawnArea: {
      levelUpChance: 0.15,
      maxNear: 2,
      interval: 10,
      prefabs: [
        { prefab: 'Skeleton', weight: 1, level: [1, 3] },
      ],
    },
  },
  {
    id: 'crypt_skeleton_chest',
    iconId: 'object/stone_chest',
    type: 'object',
    subtype: 'misc',
    Destructible: {
      hp: 50,
      minToolTier: 0,
      damageModifiers: mods([0, 0, 0, 0, 0, 0, 0, 1, 4, 4]),
      parts: [],
    },
    drop: [singleDrop('Skeleton')],
    tier: 2,
  },
  {
    type: 'object',
    subtype: 'misc',
    id: 'barrell', // yes, double-l
    iconId: 'object/barrel',
    tier: 2,
    floating: true,
    Destructible: {
      minToolTier: 0,
      hp: 10,
      damageModifiers: mods([0, 0, 1, 2, 0, 0, 0, 0, 3, 3]),
      parts: [],
    },
    drop: [{
      oneOfEach,
      num: [2, 3],
      options: [
        { item: 'Blueberries', num: [2, 4] },
        { item: 'DeerHide', num: [2, 3], },
        { item: 'Flint', num: [2, 3], },
        { item: 'Coal', num: [5, 8], },
        { item: 'GreydwarfEye', num: [2, 4], },
        { item: 'Resin', num: [3, 6], },
        { item: 'LeatherScraps', num: [2, 3], },
        { item: 'TinOre', num: [2, 3], },
      ],
    }]
  },
  {
    type: 'object',
    subtype: 'indestructible',
    id: 'barrell_static',
    iconId: 'object/barrel',
    tier: 4,
  },
  // SWAMP
  {
    type: 'object',
    subtype: 'indestructible',
    id: 'StatueEvil',
    tier: 3,
    grow: itemGrow({
      locations: ['Swamp'],
      num: [2, 2],
      altitude: [0, 1000],
      tilt: [0, 20],
    }),
  },
  // used in lots of sunken crypt rooms
  {
    type: 'object',
    subtype: 'indestructible',
    id: 'SunkenKit_int_floor_4x4',
    disabled: true,
    iconId: 'piece/stone_floor_2x2',
    tier: 3,
  },
  ...rock({
    subtype: 'ore',
    id: ['mudpile2', 'mudpile2_frac'],
    iconId: 'resource/IronScrap',
    tier: 3,
    grow: [],
    hp: 5,
    children: 30,
    drop: {
      chance: 0.2,
      num: [1, 1],
      options: [
        { item: 'IronScrap', weight: 5 },
        { item: 'WitheredBone' },
        { item: 'LeatherScraps' },
      ],
    },
  }),
  ...rock({
    subtype: 'ore',
    id: ['mudpile_beacon', 'mudpile_frac'],
    iconId: 'resource/IronScrap',
    tier: 3,
    grow: itemGrow({
      locations: ['Swamp'],
      altitude: [0.5, 1000],
      num: [0, 5],
      offset: -3,
    }),
    hp: 5,
    children: 20,
    drop: {
      chance: 0.3,
      num: [1, 1],
      options: [
        { item: 'IronScrap', weight: 100 },
        { item: 'WitheredBone' },
      ],
    },
    Beacon: 25,
  }),
  {
    type: 'object',
    subtype: 'misc',
    id: 'GuckSack_small',
    iconId: 'resource/Guck',
    tier: 3,
    grow: [],
    Destructible: {
      hp: 30,
      damageModifiers: chopPickOnly,
      minToolTier: 0,
      parts: [],
    },
    drop: [singleDrop('Guck', 1, 2)],
  },
  {
    type: 'object',
    subtype: 'misc',
    id: 'oozebomb_explosion',
    iconId: 'icon/poison_32',
    tier: 3,
    grow: [],
    Aoe: {
      damage: dmg({ poison: 40 }),
      backstabBonus: 4,
      radius: 4,
      ttl: 10,
    },
    drop: [],
  },
  {
    type: 'object',
    subtype: 'misc',
    id: 'bilebomb_explosion',
    iconId: 'icon/fire_32',
    tier: 6,
    grow: [],
    Aoe: {
      damage: dmg({ poison: 30, fire: 15 }),
      backstabBonus: 4,
      radius: 4,
      ttl: 10,
    },
    drop: [],
  },
  {
    type: 'object',
    subtype: 'misc',
    id: 'siegebomb_explosion',
    iconId: 'weapon/BombSiege',
    tier: 7,
    grow: [],
    Aoe: {
      damage: dmg({ pickaxe: 600 }),
      backstabBonus: 1,
      radius: 3,
      ttl: 0,
    },
    drop: [],
  },
  {
    type: 'object',
    subtype: 'misc',
    id: 'GuckSack',
    iconId: 'resource/Guck',
    tier: 3,
    grow: [],
    Destructible: {
      hp: 30,
      damageModifiers: chopPickOnly,
      minToolTier: 0,
      parts: [],
    },
    drop: [singleDrop('Guck', 4, 7)],
  },
  {
    type: 'object',
    subtype: 'rock',
    id: 'Rock_4_plains',
    tier: 1,
    grow: itemGrow({
      locations: ['Plains'],
      altitude: [-10, 1000],
      num: [5, 30],
    }),
    Destructible: {
      hp: 30,
      damageModifiers: pickOnly,
      minToolTier: 0,
      parts: [],
    },
    drop: [singleDrop('Stone', 3, 6)],
  },
  {
    type: 'object',
    subtype: 'rock',
    id: 'Rock_4',
    tier: 1,
    grow: itemGrow({
      locations: ['BlackForest', 'Mistlands'],
      altitude: [0, 1000], // minAlt = -1000 in BF
      tilt: [0, 45],
      num: [20, 20],
    }, {
      locations: ['Meadows', 'Mountain'],
      altitude: [-10, 1000],
      num: [10, 40],
    }, {
      locations: ['Swamp'],
      altitude: [-1000, 1000],
      num: [0, 20],
    }),
    Destructible: {
      hp: 30,
      damageModifiers: pickOnly,
      minToolTier: 0,
      parts: [],
    },
    drop: [singleDrop('Stone', 3, 6)],
  },
  ...rock({
    id: ['Rock_3', 'Rock_3_frac'],
    tier: 1,
    minToolTier: 0,
    grow: itemGrow({
      locations: ['BlackForest', 'Mistlands'],
      altitude: [0, 1000], // minAlt = -1000 in BF
      tilt: [0, 25],
      num: [5, 15],
    }, {
      locations: ['Meadows', 'Mountain'],
      altitude: [-1000, 1000],
      tilt: [0, 90],
      num: [0, 15],
    }),
    children: 5,
    hp: 15,
    drop: singleDrop('Stone', 3, 6),
  }),
  {
    type: 'object',
    subtype: 'rock',
    id: 'Rock_7',
    iconId: 'resource/Stone',
    tier: 1,
    grow: [],
    Destructible: {
      hp: 30,
      damageModifiers: pickOnly,
      minToolTier: 0,
      parts: [],
    },
    drop: [singleDrop('Stone', 3, 6)],
  },
  {
    type: 'object',
    subtype: 'misc',
    id: 'Spawner_DraugrPile',
    components: ['CreatureSpawner'],
    iconId: 'resource/TrophyDraugr',
    tier: 2,
    grow: [],
    PointLight: { color: '#B5FF62', range: 4, intensity: 1 },
    Destructible: {
      minToolTier: 0,
      hp: 100,
      damageModifiers: draugrPileModifiers,
      parts: [],
    },
    SpawnArea: {
      levelUpChance: 0.15,
      maxNear: 2,
      interval: 5,
      prefabs: [
        { prefab: 'Draugr', weight: 4, level: [1, 3] },
        { prefab: 'Draugr_NoArcher', weight: 1, level: [1, 3] },
        { prefab: 'Draugr_Elite', weight: 2, level: [1, 3] },
      ],
    },
  },

  // MOUNTAIN
  {
    type: 'object',
    id: 'MountainKit_brazier',
    iconId: 'piece/piece_brazierfloor01',
    subtype: 'misc',
    // lightRadius: 0.5,
    // warmRadius: 0.5,
    tier: 4,
    Destructible: {
      minToolTier: 0,
      hp: 50,
      damageModifiers: mods([0, 0, 0, 0, 0, 1, 2, 3, 3, 3]),
      parts: [],
    },
    PointLight: { color: '#FF9E7B', intensity: 2, range: 5 },
    drop: [{
      num: [1, 2],
      options: [
        { item: 'Bronze', num: [1, 1], weight: 0.5 },
        { item: 'FineWood', num: [1, 2] },
        { item: 'FineWood', num: [1, 1] },
      ],
    }],
  },
  {
    type: 'object',
    id: 'MountainKit_brazier_blue',
    iconId: 'piece/piece_brazierfloor01',
    subtype: 'misc',
    // lightRadius: 0.5,
    // warmRadius: 0.5,
    tier: 4,
    Destructible: {
      minToolTier: 0,
      hp: 50,
      damageModifiers: mods([0, 0, 0, 0, 0, 1, 2, 3, 3, 3]),
      parts: [],
    },
    PointLight: { color: '#C0FEFF', intensity: 2, range: 5 },
    drop: [{
      num: [1, 2],
      options: [
        { item: 'Bronze', num: [1, 1], weight: 0.5 },
        { item: 'FineWood', num: [1, 2] },
        { item: 'FineWood', num: [1, 1] },
      ],
    }],
  },
  {
    type: 'object',
    id: 'MountainKit_brazier_purple',
    disabled: true,
    iconId: 'piece/piece_brazierfloor01',
    subtype: 'misc',
    // lightRadius: 0.5,
    // warmRadius: 0.5,
    tier: 7,
    Destructible: {
      minToolTier: 0,
      hp: 50,
      damageModifiers: mods([0, 0, 0, 0, 0, 1, 2, 3, 3, 3]),
      parts: [],
    },
    PointLight: { color: '#C0FEFF', intensity: 2, range: 5 },
    drop: [{
      num: [1, 2],
      options: [
        { item: 'Bronze', num: [1, 1], weight: 0.5 },
        { item: 'FineWood', num: [1, 2] },
        { item: 'FineWood', num: [1, 1] },
      ],
    }],
  },
  {
    type: 'object',
    id: 'mountainkit_chair',
    iconId: 'piece/piece_chair02',
    subtype: 'misc',
    tier: 4,
    Destructible: {
      minToolTier: 0,
      hp: 10,
      damageModifiers: mods([0, 0, 0, 0, 0, 0, 0, 0, 1, 1]),
      parts: [],
    },
    drop: [singleDrop('FineWood')],
  },
  {
    type: 'object',
    id: 'mountainkit_table',
    iconId: 'piece/piece_table_oak',
    subtype: 'misc',
    tier: 4,
    Destructible: {
      minToolTier: 0,
      hp: 10,
      damageModifiers: mods([0, 0, 0, 0, 0, 0, 0, 0, 1, 1]),
      parts: [],
    },
    drop: [singleDrop('FineWood', 1, 3)],
  },
  {
    type: 'object',
    id: 'hanging_hairstrands',
    iconId: 'resource/WolfHairBundle',
    subtype: 'misc',
    tier: 4,
    Destructible: {
      minToolTier: 0,
      hp: 10,
      damageModifiers: mods([0, 0, 0, 0, 0, 1, 1, 3, 3, 3]),
      parts: [],
    },
    drop: [singleDrop('WolfHairBundle', 1, 3)],
  },
  {
    type: 'object',
    id: 'cloth_hanging_door',
    iconId: 'piece/piece_cloth_hanging_door',
    subtype: 'misc',
    tier: 4,
    Destructible: {
      minToolTier: 0,
      hp: 10,
      damageModifiers: mods([1, 0, 0, 0, 0, 2, 1, 3, 3, 3]),
      parts: [],
    },
    drop: [{
      chance: 0.2,
      num: [1, 1],
      options: [{ item: 'JuteRed', num: [1, 2] }]
    }],
  },
  {
    type: 'object',
    id: 'cloth_hanging_door_double',
    // iconId: 'piece/cloth_hanging_door_double',
    subtype: 'misc',
    tier: 4,
    Destructible: {
      minToolTier: 0,
      hp: 10,
      damageModifiers: mods([1, 0, 0, 0, 0, 2, 1, 3, 3, 3]),
      parts: [],
    },
    drop: [{
      chance: 0.2,
      num: [1, 2],
      options: [{ item: 'JuteRed', num: [1, 1] }]
    }],
  },
  runeStone({ id: 'RuneStone_Ashlands', tier: 7, texts: loreTexts('ashlands', 13) }),
  runeStone({ id: 'RuneStone_BlackForest', tier: 2, texts: loreTexts('blackforest', 13) }),
  runeStone({ id: 'RuneStone_Boars', tier: 1, texts: ['meadows_boartaming'] }),
  runeStone({ id: 'RuneStone_Bonemass', tier: 3, texts: ['bonemass'] }),
  runeStone({ id: 'RuneStone_DragonQueen', tier: 4, texts: ['dragonqueen'] }),
  runeStone({ id: 'RuneStone_Drake', tier: 4, texts: ['drake'] }),
  runeStone({ id: 'RuneStone_Draugr', tier: 3, texts: ['draugr'] }),
  runeStone({ id: 'RuneStone_GDKing', tier: 2, texts: ['gdking'] }),
  runeStone({ id: 'RuneStone_Greydwarfs', tier: 2, texts: ['greydwarfs'] }),
  runeStone({ id: 'RuneStone_Meadows', tier: 1, texts: loreTexts('meadows', 11) }),
  runeStone({ id: 'RuneStone_Mistlands_bosshint', tier: 6, texts: ['mistlands_bosshint'] }),
  runeStone({ id: 'RuneStone_Mistlands', tier: 6, texts: loreTexts('mistlands', 7) }),
  runeStone({ id: 'RuneStone_Mountains', tier: 4, texts: loreTexts('mountains', 12).concat('mountains_fenring') }),
  runeStone({ id: 'RuneStone_Plains', tier: 5, texts: loreTexts('plains', 13) }),
  runeStone({ id: 'RuneStone_Swamps', tier: 3, texts: loreTexts('swamp', 12) }),
  {
    type: 'object',
    group: 'runestone',
    subtype: 'indestructible',
    id: 'RuneStone_CaveMan',
    RuneStone: ['caveman01'],
    tier: 4,
  },
  {
    type: 'object',
    id: 'MountainKit_wood_gate',
    iconId: 'piece/wood_gate',
    subtype: 'misc',
    tier: 4,
    Destructible: {
      minToolTier: 0,
      hp: 100,
      damageModifiers: mods([0, 0, 0, 0, 0, 2, 1, 3, 3, 3]),
      parts: [],
    },
    drop: [{
      num: [1, 2],
      options: [
        { item: 'Wood', num: [1, 2] },
        { item: 'Wood', num: [1, 1], weight: 0.5 },
        { item: 'Iron', num: [1, 2], weight: 0.5 },
      ],
    }],
  },
  {
    type: 'object',
    id: 'caverock_ice_pillar',
    disabled: true, // used in lots of cave rooms
    subtype: 'misc',
    tier: 4,
    Destructible: {
      minToolTier: 0,
      hp: 100,
      damageModifiers: mods([2, 2, 2, 2, 2, 2, 1, 2, 3, 3]),
      parts: [],
    },
    drop: [],
  },
  {
    type: 'object',
    id: 'caverock_ice_pillar_wall',
    subtype: 'misc',
    tier: 4,
    Destructible: {
      minToolTier: 0,
      hp: 50,
      damageModifiers: mods([2, 2, 2, 2, 2, 2, 1, 2, 3, 3]),
      parts: [],
    },
    drop: [],
  },
  {
    type: 'object',
    id: 'caverock_ice_stalagtite',
    floating: true, // via caverock_ice_stalagtite_falling
    subtype: 'misc',
    tier: 4,
    Destructible: {
      minToolTier: 0,
      hp: 10,
      damageModifiers: mods([2, 2, 2, 2, 2, 2, 1, 2, 3, 3]),
      parts: [],
    },
    drop: [],
  },
  {
    type: 'object',
    id: 'caverock_ice_stalagmite',
    subtype: 'misc',
    tier: 4,
    Destructible: {
      minToolTier: 0,
      hp: 10,
      damageModifiers: mods([2, 2, 2, 2, 2, 2, 1, 2, 3, 3]),
      parts: [],
    },
    drop: [],
  },
  ...[1, 2].map<PhysicalObject>(subId => ({
    type: 'object',
    subtype: 'rock',
    id: `marker0${subId}`,
    tier: 4,
    grow: [],
    Destructible: {
      hp: 30,
      damageModifiers: { ...pickOnly, lightning: 'normal' },
      minToolTier: 0,
      parts: [],
    },
    drop: [singleDrop('Stone', 3, 6)],
  })),
  ...rock({
    id: ['highstone', 'highstone_frac'],
    iconId: 'resource/Stone',
    tier: 4,
    grow: [],
    children: 17,
    hp: 30,
    drop: singleDrop('Stone', 2, 3),
  }),
  ...rock({
    id: ['widestone', 'widestone_frac'],
    iconId: 'resource/Stone',
    tier: 4,
    grow: [],
    children: 17,
    hp: 30,
    drop: singleDrop('Stone', 2, 3),
  }),
  {
    type: 'object',
    subtype: 'rock',
    id: 'MineRock_Obsidian',
    tier: 4,
    grow: itemGrow({
      locations: ['Mountain'],
      altitude: [100, 1000],
      num: [10, 15],
    }),
    Destructible: {
      hp: 30,
      damageModifiers: pickOnly,
      minToolTier: 2,
      parts: [],
    },
    drop: [singleDrop('Obsidian', 5, 8)],
  },
  ...rock({
    subtype: 'ore',
    id: ['silvervein', 'silvervein_frac'],
    tier: 4,
    minToolTier: 2,
    grow: itemGrow({
      locations: ['Mountain'],
      altitude: [120, 1000],
      tilt: [0, 30],
      num: [1, 1],
      offset: -4,
      // terrain delta: 0-3 over 9
    }),
    hp: 40,
    children: 100,
    drop: {
      num: [2, 3],
      options: [
        { item: 'Stone', weight: 2 },
        { item: 'SilverOre' },
      ],
    },
    Beacon: 50,
  }),
  ...rock({
    id: ['rock1_mountain', 'rock1_mountain_frac'],
    grow: itemGrow({
      locations: ['Mountain'],
      tilt: [30, 80],
      num: [5, 8],
      offset: -6,
    }),
    hp: 50,
    children: 165,
    drop: singleDrop('Stone', 4, 8),
  }),
  ...rock({
    id: ['rock2_mountain', 'rock2_mountain_frac'],
    grow: itemGrow({
      locations: ['Mountain'],
      tilt: [30, 80],
      num: [5, 8],
      offset: -5,
    }),
    hp: 50,
    children: 122,
    drop: singleDrop('Stone', 4, 8),
  }),
  ...rock({
    id: ['rock3_mountain', 'rock3_mountain_frac'],
    grow: itemGrow({
      locations: ['Mountain'],
      tilt: [10, 50],
      num: [0, 2],
      offset: -5,
    }),
    hp: 50,
    children: 122,
    drop: singleDrop('Stone', 4, 8),
  }),
// PLAINS
  ...rock({
    id: ['rock4_heath', 'rock4_heath_frac'],
    grow: itemGrow({
      locations: ['Plains'],
      altitude: [4, 1000],
      tilt: [15, 45],
      num: [4, 10],
    }),
    hp: 50,
    children: 120,
    drop: singleDrop('Stone', 4, 8),
  }),
  ...rock({
    id: ['rock2_heath', 'rock2_heath_frac'],
    grow: itemGrow({
      locations: ['Plains'],
      altitude: [0, 1000],
      tilt: [0, 20],
      num: [0, 1],
    }),
    hp: 50,
    children: 122,
    drop: singleDrop('Stone', 4, 8),
  }),
  ...rock({
    id: ['HeathRockPillar', 'HeathRockPillar_frac'],
    grow: itemGrow({
      locations: ['Plains'],
      altitude: [0, 1000],
      tilt: [0, 30],
      num: [0, 0.1],
      offset: -2,
    }),
    hp: 60,
    children: 194,
    drop: singleDrop('Stone', 1, 3),
  }),
  {
    type: 'object',
    subtype: 'misc',
    id: 'Pickable_TarBig',
    iconId: 'resource/Tar',
    components: ['Pickable'],
    tier: 5,
    grow: [],
    drop: [singleDrop('Tar', 15)],
  },
  {
    type: 'object',
    subtype: 'misc',
    id: 'Pickable_Tar',
    iconId: 'resource/Tar',
    components: ['Pickable'],
    floating: true,
    tier: 5,
    grow: [],
    drop: [singleDrop('Tar', 4)],
  },
  {
    type: 'object',
    subtype: 'misc',
    id: 'Leviathan',
    components: ['Leviathan'],
    tier: 3,
    grow: itemGrow({
      locations: ['Ocean'],
      altitude: [-1000, -30],
      onSurface: true,
      num: [0, 0.01],
    }),
    Destructible: {
      hp: 0,
      minToolTier: 0,
      damageModifiers: pickOnly,
      parts: [{ id: 'Barnacle', num: 21 }],
    },
    Leviathan: { chance: 0.1, delay: 20 },
    drop: [],
  },
  {
    type: 'object',
    subtype: 'misc',
    id: 'Barnacle',
    iconId: 'resource/Chitin',
    components: ['MineRock'],
    tier: 3,
    grow: [],
    Destructible: {
      hp: 40,
      damageModifiers: pickOnly,
      minToolTier: 0,
      parts: [],
    },
    drop: [singleDrop('Chitin', 3, 4)],
  },
  // DEEP NORTH
  {
    type: 'object',
    subtype: 'indestructible',
    id: 'ice1',
    floating: true,
    tier: 6,
    grow: itemGrow({
      locations: ['DeepNorth'],
      altitude: [-1000, -1],
      onSurface: true,
      num: [10, 20],
    }),
  },
  {
    type: 'object',
    subtype: 'indestructible',
    id: 'ice_rock1',
    tier: 6,
    grow: itemGrow({
      locations: ['DeepNorth'],
      altitude: [-1000, -1],
      onSurface: true,
      num: [0, 1],
      offset: -2,
    }),
  },
  {
    type: 'object',
    subtype: 'indestructible',
    id: 'vertical_web',
    disabled: true,
    tier: 6,
    grow: [],
  },
  {
    type: 'object',
    subtype: 'rock',
    id: 'MountainGraveStone01',
    tier: 4,
    grow: [],
    Destructible: {
      hp: 400,
      damageModifiers: pickOnly,
      minToolTier: 0,
      parts: [],
    }
  },
  {
    type: 'object',
    subtype: 'indestructible',
    id: 'GlowingMushroom',
    tier: 2,
    grow: [],
  },
  // old mistlands stuff
  {
    type: 'object',
    subtype: 'indestructible',
    id: 'horizontal_web',
    disabled: true,
    tier: 6,
    grow: [],
  },
  {
    type: 'object',
    subtype: 'indestructible',
    id: 'tunnel_web',
    disabled: true,
    tier: 6,
    grow: [],
  },
  {
    type: 'object',
    disabled: true,
    subtype: 'indestructible',
    id: 'Skull1',
    tier: 6,
    grow: [],
  },
  {
    type: 'object',
    disabled: true,
    subtype: 'indestructible',
    id: 'Skull2',
    tier: 6,
    grow: [],
  },
  {
    type: 'object',
    disabled: true,
    subtype: 'indestructible',
    id: 'HugeRoot1',
    // mentioned in vegetation list, but this entry is disabled
    tier: 6,
  },
  {
    type: 'object',
    disabled: true,
    subtype: 'indestructible',
    id: 'SwampTree2_darkland',
    tier: 6,
  },
  {
    type: 'object',
    subtype: 'indestructible',
    id: 'caverock_curvedwallbig',
    // used in many cave rooms, MorgenHole and also some other locations
    disabled: true,
    tier: 6,
  },
  {
    type: 'object',
    subtype: 'indestructible',
    id: 'caverock_pillar',
    tier: 6,
  },
  {
    type: 'object',
    subtype: 'indestructible',
    id: 'caverock_curvedrock',
    tier: 6,
  },
  {
    type: 'object',
    subtype: 'tree',
    id: 'YggaShoot_small1',
    tier: 6,
    Destructible: {
      hp: 20,
      damageModifiers: mods([0, 0, 0, 0,  0, 0, 0, 0,  3, 3]),
      minToolTier: 4,
      parts: [],
    },
    drop: [{
      num: [2, 3],
      options: [
        { item: 'Wood' },
        { item: 'YggdrasilWood', weight: 0.2 },
      ]
    }],
  },
  ...[1,2,3].map<PhysicalObject>(id => ({
    type: 'object',
    subtype: 'tree',
    id: `YggaShoot${id}`,
    components: ['TreeBase'],
    tier: 6,
    grow: [
      ...itemGrow({
        locations: ['Mistlands'],
        biomeArea: 3,
        tilt: [0, 80],
        num: [2, 2],
        groupRadius: 0,
      }),
    ],
    Destructible: {
      hp: 100,
      damageModifiers: chopOnly,
      minToolTier: 4,
      parts: [{ id: 'yggashoot_log', num: 1 }, { id: 'ShootStump', num: 1 }],
    },
    drop: [{
      num: [2, 2],
      chance: 0.5,
      options: [
        { item: 'Wood', num: [1, 2] },
        { item: 'YggdrasilWood', num: [1, 2] },
      ]
    }],
  })),
  {
    type: 'object',
    subtype: 'misc',
    id: 'yggashoot_log',
    iconId: 'object/Log',
    components: ['TreeLog'],
    tier: 6,
    grow: [],
    Destructible: {
      hp: 100,
      damageModifiers: chopOnly,
      minToolTier: 4,
      parts: [{ id: 'yggashoot_log_half', num: 2 }],
    },
    drop: [],
  },
  {
    type: 'object',
    subtype: 'misc',
    id: 'yggashoot_log_half',
    iconId: 'object/Log',
    components: ['TreeLog'],
    tier: 6,
    grow: [],
    Destructible: {
      hp: 100,
      damageModifiers: chopOnly,
      minToolTier: 4,
      parts: [],
    },
    drop: [{
      num: [10, 10],
      options: [
        { item: 'Wood' },
        { item: 'YggdrasilWood' },
      ],
    }],
  },
  {
    type: 'object',
    subtype: 'tree',
    id: `ShootStump`,
    iconId: 'object/Stump',
    tier: 6,
    grow: [],
    Destructible: {
      hp: 80,
      damageModifiers: chopOnly,
      minToolTier: 0,
      parts: [],
    },
    drop: [singleDrop('Wood', 3)],
  },
  {
    type: 'object',
    subtype: 'indestructible',
    id: 'YggdrasilRoot',
    tier: 6,
    components: ['ResourceRoot'],
    grow: itemGrow({
      locations: ['Mistlands'],
      num: [2, 4],
      scale: [1, 1.5],
      terrainDelta: [0, 6],
      terrainDeltaRadius: 5,
      tilt: [0, 45],
    }),
    ResourceRoot: {
      maxLevel: 50,
      highThreshold: 40,
      emptyTreshold: 10,
      regenPerSec: 0.0025,
    },
  },
  {
    type: 'object',
    subtype: 'misc',
    id: `trader_wagon_destructable`,
    iconId: 'transport/Cart',
    tier: 6,
    grow: [],
    Destructible: {
      hp: 400,
      damageModifiers: mods([0, 0, 1, 0, 1, 2, 1, 1, 3, 3]),
      minToolTier: 0,
      parts: [],
    },
    drop: [singleDrop('FineWood', 3, 5)],
  },
  {
    type: 'object',
    subtype: 'misc',
    id: `dvergrprops_hooknchain`,
    tier: 6,
    grow: [],
    Destructible: {
      hp: 500,
      damageModifiers: mods([1, 1, 1, 1,  1, 1, 1, 1,  3, 3]),
      minToolTier: 0,
      parts: [],
    },
    drop: [{
      num: [1, 2],
      options: [
        { item: 'CopperScrap' },
        { item: 'Chain' },
      ]
    }],
  },
  {
    type: 'object',
    subtype: 'misc',
    id: `dvergrtown_wood_crane`,
    tier: 6,
    grow: [],
    Destructible: {
      hp: 1000,
      damageModifiers: mods([0, 0, 1, 2, 0, 0, 0, 0, 3, 3]),
      minToolTier: 0,
      parts: [],
    },
    drop: [{
      num: [1, 8],
      options: [
        { item: 'Wood' },
        { item: 'CopperScrap' },
        { item: 'Chain' },
      ]
    }],
  },
  ...rock({
    id: ['giant_brain', 'giant_brain_frac'],
    iconId: 'resource/Softtissue',
    tier: 6,
    minToolTier: 3,
    grow: [],
    hp: 5,
    children: 118,
    drop: {
      chance: 0.5,
      num: [1, 1],
      options: [{ item: 'Softtissue' }],
    },
  }),
  ...Object.entries({
    giant_ribs: 132,
    giant_skull: 129,
  }).flatMap(([id, children]) => rock({
    id: [id, `${id}_frac`],
    tier: 6,
    minToolTier: 3,
    grow: [],
    hp: 100,
    children,
    drop: singleDrop('BlackMarble', 2, 4),
  })),
  ...Object.entries({
    giant_sword1: 15,
    giant_sword2: 15,
    giant_helmet1: 33,
    giant_helmet2: 20,
  }).flatMap(([id, children]) => rock({
    id: [id, `${id}_frac`],
    tier: 6,
    minToolTier: 3,
    grow: [],
    hp: 150,
    children,
    drop: {
      num: [1, 1],
      options: [
        { item: 'IronScrap' },
        { item: 'CopperScrap' },
      ],
    },
  })),
  ...rock({
    id: ['cliff_mistlands1', 'cliff_mistlands1_frac'],
    tier: 6,
    grow: [],
    children: 103,
    hp: 70,
    drop: singleDrop('Stone', 4, 8),
  }),
  ...rock({
    id: ['cliff_mistlands2', 'cliff_mistlands2_frac'],
    tier: 6,
    grow: [],
    children: 103,
    hp: 70,
    drop: singleDrop('Stone', 4, 8),
  }),
  // cliff_ashlands1
  ...rock({
    id: ['cliff_ashlands2', 'cliff_ashlands2_frac'],
    tier: 7,
    grow: itemGrow({
      num: [0, 1],
      scale: [0.5, 1.5],
      randTilt: 0,
      locations: ['Ashlands'],
      biomeArea: 3,
      altitude: [1, 15],
      tilt: [0, 99],
      abundance: 1,
      groupRadius: 0,
    }),
    children: 103,
    hp: 70,
    drop: singleDrop('Grausten', 4, 8),
  }),
  ...rock({
    id: ['cliff_ashlands3_Arch_1', 'cliff_ashlands_Arch_frac'],
    tier: 7,
    grow: itemGrow({
      num: [2, 3],
      scale: [1, 2],
      randTilt: 0,
      locations: ['Ashlands'],
      biomeArea: 3,
      altitude: [-20, 40],
      tilt: [10, 40],
      abundance: 1,
      groupRadius: 10,
    }),
    children: 67,
    hp: 70,
    drop: singleDrop('SulfurStone', 4, 8),
  }),
  ...rock({
    id: ['cliff_ashlands4', 'cliff_ashlands4_frac'],
    tier: 7,
    grow: itemGrow({
      num: [1, 2],
      scale: [0.2, 0.7],
      randTilt: 0,
      locations: ['Ashlands'],
      biomeArea: 3,
      altitude: [10, 100],
      tilt: [10, 40],
      abundance: 1,
      groupRadius: 10,
    }),
    children: 196,
    hp: 70,
    drop: singleDrop('Grausten', 4, 8),
  }),
  ...rock({
    id: ['cliff_ashlands5', 'cliff_ashlandsflowrock_frac'],
    tier: 7,
    grow: itemGrow({
      num: [1, 3],
      scale: [0.5, 1.5],
      randTilt: 0,
      locations: ['Ashlands'],
      biomeArea: 3,
      altitude: [1, 40],
      tilt: [0, 60],
      abundance: 1,
      groupRadius: 10,
    }),
    children: 196,
    hp: 70,
    drop: {
      num: [4, 8],
      options: [
        { weight: 1, item: 'Stone' },
        { weight: 5, item: 'Grausten' },
      ],
    }
  }),
  ...rock({
    id: ['cliff_ashlands6', 'cliff_ashlands6_frac'],
    tier: 7,
    grow: itemGrow({
      num: [1, 3],
      scale: [0.5, 0.9],
      randTilt: 0,
      locations: ['Ashlands'],
      biomeArea: 3,
      altitude: [-5, 5],
      tilt: [10, 40],
      abundance: 1,
      groupRadius: 10,
    }),
    children: 2,
    hp: 50,
    drop: {
      num: [2, 4],
      options: [
        { weight: 1, item: 'Stone' },
        { weight: 5, item: 'Grausten' },
      ],
    }
  }),
  // cliff_ashlands7
  ...rock({
    id: ['cliff_ashlands4', 'cliff_ashlands4_frac'],
    tier: 7,
    grow: itemGrow({
      num: [1, 3],
      scale: [0.5, 1.5],
      randTilt: 20,
      locations: ['Ashlands'],
      biomeArea: 3,
      altitude: [-20, 5],
      tilt: [0, 80],
      abundance: 1,
      groupRadius: 10,
    }),
    children: 88,
    hp: 100,
    drop: singleDrop('Grausten', 4, 8),
  }),
  // cliff_ashlands9
  ...tree({
    id: ['AshlandsTree1', 'AshlandsTreeStump1', 'AshlandsTreeLog1', 'AshlandsTreeLogHalf1'],
    group: 'ashtree',
    tier: 7,
    minToolTier: 0,
    grow: itemGrow({
      // tree_ashlands1
      scale: [0.7, 1.4],
      randTilt: 10,
      chanceToUseGroundTilt: 0.5,
      locations: ['Ashlands'],
      tilt: [0, 30],
      altitude: [2, 12],
      num: [6, 10],
      group: [4, 8],
      groupRadius: 40,
    }, {
      // tree_ashlands2
      randTilt: 10,
      chanceToUseGroundTilt: 0.5,
      locations: ['Ashlands'],
      tilt: [0, 30],
      altitude: [1, 12],
      num: [5, 8],
      group: [2, 4],
      groupRadius: 40,
    }),
    hp: [200, 90, 90],
    drop: [{
      chance: 0.5,
      num: [1, 2],
      options: [
        { weight: 2, item: 'Blackwood', num: [1, 2] },
        { weight: 1, item: 'CharcoalResin', num: [1, 1] },
      ]
    }, {
      num: [10, 10],
      options: [
        { weight: 2, item: 'Blackwood' },
        { weight: 1, item: 'Wood' },
      ],
    }],
    stubWood: 'Blackwood',
  }),
  ...tree({
    id: ['AshlandsTree3', 'AshlandsTreeStump2', 'AshlandsTreeLog1', 'AshlandsTreeLogHalf1'],
    group: 'ashtree',
    tier: 7,
    minToolTier: 0,
    grow: itemGrow({
      // tree_ashlands3
      scale: [1, 2],
      randTilt: 10,
      chanceToUseGroundTilt: 0.5,
      locations: ['Ashlands'],
      tilt: [0, 30],
      altitude: [1, 12],
      num: [4, 10],
      group: [3, 5],
      groupRadius: 50,
    }),
    hp: [200, 90, 90],
    drop: [{
      chance: 0.5,
      num: [1, 2],
      options: [
        { weight: 2, item: 'Blackwood', num: [1, 2] },
        { weight: 1, item: 'CharcoalResin', num: [1, 1] },
      ]
    }, {
      num: [10, 10],
      options: [
        { weight: 2, item: 'Blackwood' },
        { weight: 1, item: 'Wood' },
      ],
    }],
    stubWood: 'Blackwood',
  }),
  ...tree({
    id: ['AshlandsTree6', 'AshlandsTreeStump3', 'AshlandsTreeLog2', 'AshlandsTreeLogHalf2'],
    group: 'ashtree',
    tier: 7,
    minToolTier: 0,
    grow: itemGrow({
      // tree_ashlands4
      scale: [1.5, 2.5],
      randTilt: 10,
      chanceToUseGroundTilt: 0.5,
      locations: ['Ashlands'],
      tilt: [0, 30],
      altitude: [1, 12],
      num: [2, 3],
    }),
    hp: [200, 90, 90],
    drop: [{
      chance: 0.5,
      num: [1, 2],
      options: [
        { weight: 2, item: 'Blackwood', num: [1, 2] },
        { weight: 1, item: 'CharcoalResin', num: [1, 1] },
      ]
    }, {
      num: [10, 10],
      options: [
        { weight: 2, item: 'Blackwood' },
        { weight: 1, item: 'Wood' },
      ],
    }],
    stubWood: 'Blackwood',
  }),
  { // rock_ashlands1
    type: 'object',
    subtype: 'rock',
    id: 'Ashlands_rock1',
    tier: 7,
    Destructible: {
      hp: 70,
      damageModifiers: pickOnly,
      minToolTier: 0,
      parts: [{ id: 'Rock_3_frac', num: 1 }],
    },
    grow: itemGrow({
      num: [1, 1],
      scale: [1.5, 2],
      locations: ['Ashlands'],
      biomeArea: 3,
      altitude: [-30, -10],
      tilt: [0, 99],
      abundance: 1,
      group: [1, 2],
      groupRadius: 80,
    }),
  },
  ...rock({ // rock_ashlands2
    id: ['Ashlands_rock2', 'rock4_ashlands_frac'],
    tier: 7,
    grow: itemGrow({
      num: [1, 0.6],
      scale: [0.8, 1],
      locations: ['Ashlands'],
      biomeArea: 3,
      altitude: [4, 1000],
      tilt: [0, 25],
      abundance: 1,
      groupRadius: 0,
    }),
    children: 130,
    hp: 50,
    drop: {
      num: [3, 6],
      options: [
        { item: 'Stone', weight: 1 },
        { item: 'Grausten', weight: 5 },
      ],
    },
  }),
  // rock_ashlands3
  ...rock({
    id: ['cliff_ashlands6', 'cliff_ashlands6_frac'],
    tier: 7,
    grow: itemGrow({
      num: [12, 22],
      scale: [0.2, 0.9],
      randTilt: 99,
      locations: ['Ashlands'],
      biomeArea: 3,
      altitude: [4, 1000],
      tilt: [0, 99],
      abundance: 1,
      group: [6, 16],
      groupRadius: 60,
    }),
    children: 2,
    hp: 50,
    drop: {
      num: [2, 4],
      options: [
        { item: 'Stone', weight: 1 },
        { item: 'Grausten', weight: 5 },
      ],
    },
  }),
  // grave stones
  ...[
    'GraveStone_Broken_CharredTwitcherNest',
    'GraveStone_CharredTwitcherNest',
  ].map<PhysicalObject>(id => ({
    id,
    tier: 7,
    type: 'object',
    subtype: 'misc',
    Destructible: {
      hp: 20,
      damageModifiers: mods([1, 1, 1, 0, 0, 3, 3, 3, 4, 4]),
      minToolTier: 0,
      parts: [],
    },
    drop: [singleDrop('Grausten')],
  })),
  {
    id: 'charred_shieldgenerator',
    tier: 7,
    type: 'object',
    subtype: 'misc',
    Destructible: {
      hp: 1500,
      damageModifiers: mods([1, 1, 1, 1, 0, 3, 3, 0, 3, 3]),
      minToolTier: 0,
      parts: [],
    },
    drop: [
      singleDrop('Stone', 5),
      singleDrop('ShieldCore', 1),
      singleDrop('CeramicPlate', 5),
    ],
  },
  {
    id: 'Spawner_CharredCross',
    tier: 7,
    type: 'object',
    subtype: 'misc',
    Destructible: {
      hp: 500,
      damageModifiers: mods([0, 0, 1, 2, 0, 1, 0, 1, 3, 0]),
      minToolTier: 0,
      parts: [],
    },
    SpawnArea: {
      levelUpChance: 0.05,
      maxNear: 3,
      interval: 25,
      prefabs: [
        { prefab: 'Charred_Melee', weight: 5, level: [1, 3] },
        { prefab: 'Charred_Archer', weight: 5, level: [1, 3] },
        { prefab: 'Charred_Mage', weight: 1, level: [1, 3] },
      ],
    },
  },
  ...['Spawner_CharredStone', 'Spawner_CharredStone_event'].map<PhysicalObject>(id => ({
    id,
    iconId: 'object/Spawner_CharredStone',
    tier: 7,
    type: 'object',
    subtype: 'misc',
    PointLight: {
      color: '#FF0000',
      intensity: 1,
      range: 10,
    },
    Destructible: {
      hp: 400,
      damageModifiers: mods([1, 1, 1, 0, 0, 3, 1, 1, 4, 4]),
      minToolTier: 0,
      parts: [],
    },
    SpawnArea: {
      levelUpChance: 0.05,
      maxNear: 3,
      interval: 10,
      prefabs: [
        { prefab: 'Charred_Twitcher', weight: 5, level: [1, 3] },
        { prefab: 'Charred_Melee', weight: 1, level: [1, 3] },
      ],
    },
    drop: [{
      num: [2, 5],
      options: [
        { item: 'Grausten', weight: 2 },
        { item: 'Charredskull' },
      ],
    }],
  })),
  {
    id: 'Spawner_CharredStone_Elite',
    tier: 7,
    type: 'object',
    subtype: 'misc',
    PointLight: {
      color: '#C600A3',
      intensity: 1,
      range: 10,
    },
    Destructible: {
      hp: 400,
      damageModifiers: mods([1, 1, 1, 0, 0, 3, 3, 3, 4, 4]),
      minToolTier: 0,
      parts: [],
    },
    SpawnArea: {
      levelUpChance: 0.05,
      maxNear: 3,
      interval: 10,
      prefabs: [
        { prefab: 'Charred_Twitcher', weight: 5, level: [2, 3] },
        { prefab: 'Charred_Melee', weight: 4, level: [2, 3] },
        { prefab: 'Charred_Archer', weight: 2, level: [2, 3] },
        { prefab: 'Charred_Mage', weight: 1, level: [2, 3] },
      ],
    },
    drop: [{
      num: [2, 5],
      options: [
        { item: 'Grausten', weight: 2 },
        { item: 'Charredskull' },
      ],
    }],
  },
  ...[
    { id: 'Ashlands_Ruins_Ramp', hp: 1000, drop: [3, 4] },
    { id: 'Ashlands_Ruins_Ramp_Upsidedown', hp: 1000, drop: [3, 4] },
    { id: 'Ashlands_Ruins_TopStone', hp: 300, drop: [1, 2] },
    { id: 'Ashlands_Pillar4', hp: 1000, drop: [2, 3] },
    { id: 'Ashlands_Ruins_Floor_3x3_broken1', hp: 500, drop: [1, 2] },
    { id: 'Ashlands_Ruins_Floor_3x3_broken2', hp: 1000, drop: [1, 2] },
    { id: 'Ashlands_Ruins_Floor_3x3_broken3', hp: 500, drop: [1, 2] },
    { id: 'Ashlands_Ruins_Wall_Window_4x6_broken2', hp: 500 },
    { id: 'Ashlands_Ruins_Wall_Window_4x6_broken3', hp: 500 },
    { id: 'Ashlands_Ruins_Wall_Window_4x6_broken4', hp: 333 },
    { id: 'Ashlands_Ruins_Wall_Window_4x6_broken5', hp: 333 },
    { id: 'Ashlands_Ruins_Wall_Window_4x6_broken6', hp: 333 },
  ].map<PhysicalObject>(({ id, hp, drop }) => ({
    id,
    tier: 7,
    type: 'object',
    subtype: 'misc',
    Destructible: {
      hp,
      damageModifiers: mods([0, 1, 1, 3, 2, 3, 1, 3, 4, 4]),
      minToolTier: 0,
      parts: [],
    },
    drop: drop?.length === 2 ? [singleDrop('Grausten', ...drop)] : [],
  })),
  {
    id: 'piece_Charred_Balista',
    tier: 7,
    type: 'object',
    subtype: 'misc',
    components: ['Turret'],
    // Turret: {
    //   attackCooldown: 2,
    //   allowedAmmo: ['TurretBoltBone'],
    // },
    Destructible: {
      hp: 400,
      damageModifiers: mods([0, 0, 1, 0, 1, 1, 1, 1, 3, 0]),
      minToolTier: 0,
      parts: [],
    },
    drop: [
      singleDrop('BoneFragments', 3),
      singleDrop('CharredCogwheel'),
    ],
  },
  {
    id: 'FernAshlands',
    tier: 7,
    type: 'object',
    subtype: 'misc',
    Destructible: {
      hp: 30,
      damageModifiers: mods([0, 0, 1, 1, 0, 3, 0, 0, 3, 3]),
      minToolTier: 0,
      parts: [],
    },
    drop: [],
  },
  {
    id: 'Charred_altar_bellfragment',
    tier: 7,
    type: 'object',
    subtype: 'misc',
    Destructible: {
      hp: 10,
      damageModifiers: allNormal,
      minToolTier: 0,
      parts: [],
    },
    drop: [singleDrop('BellFragment', 2, 4)],
  },
  {
    id: 'UnstableLavaRock',
    tier: 7,
    type: 'object',
    subtype: 'misc',
    Destructible: {
      hp: 50,
      damageModifiers: mods([1, 1, 1, 1, 2, 3, 2, 1, 1, 1]),
      minToolTier: 0,
      parts: [],
    },
    drop: [singleDrop('ProustitePowder', 4, 7)],
    grow: itemGrow({
      num: [1, 1],
      scale: [0.7, 1.2],
      randTilt: 30,
      locations: ['Ashlands'],
      biomeArea: 3,
      altitude: [1, 2000],
      tilt: [0, 40],
      abundance: 1,
      groupRadius: 10,
    }),
    // dmg: { damage: 75, chop: 500, pickaxe: 600 },
    // radius: 4,
    // toolTier: 4,
  },
  // branch_ashlands1
    // AshlandsBranch1
    // num: [4, 6],
    // scale: [1, 3],
    // randTilt: 5,
    // locations: ['Ashlands'],
    // biomeArea: 3,
    // altitude: [1, 6],
    // tilt: [0, 99],
    // abundance: 1,
    // group: [3, 5],
    // groupRadius: 30,
  // branch_ashlands2
    // AshlandsBranch2
    // num: [2, 3],
    // scale: [0.8, 1],
    // randTilt: 5,
    // locations: ['Ashlands'],
    // biomeArea: 3,
    // altitude: [1, 7],
    // tilt: [0, 99],
    // abundance: 1,
    // groupRadius: 0,
  // branch_ashlands3
    // AshlandsBranch3
    // num: [2, 3],
    // scale: [0.8, 1],
    // randTilt: 5,
    // locations: ['Ashlands'],
    // biomeArea: 3,
    // altitude: [1, 6],
    // tilt: [0, 99],
    // abundance: 1,
    // group: [2, 4],
    // groupRadius: 30,
  // bush_ashlands1: AshlandsBush1
  {
    type: 'object',
    subtype: 'misc',
    id: 'Pickable_Charredskull',
    tier: 7,
    grow: itemGrow({
      num: [20, 40],
      scale: [1.3, 1.4],
      randTilt: 5,
      locations: ['Ashlands'],
      biomeArea: 3,
      altitude: [11, 1000],
      abundance: 1,
      group: [2, 3],
      groupRadius: 2,
    }),
    drop: [singleDrop('Charredskull')],
  },
  // pot_shard
  {
    type: 'object',
    subtype: 'misc',
    id: 'Pickable_Pot_Shard',
    tier: 7,
    grow: itemGrow({
      num: [4, 6],
      locations: ['Ashlands'],
      biomeArea: 2,
      altitude: [11, 1000],
      abundance: 1,
      group: [4, 6],
      groupRadius: 20,
    }),
    drop: [singleDrop('Pot_Shard_Green')],
  },
  {
    type: 'object',
    subtype: 'misc',
    id: 'Pickable_Ash_Stone',
    tier: 7,
    grow: itemGrow({
      num: [7, 15],
      randTilt: 180,
      locations: ['Ashlands'],
      biomeArea: 2,
      altitude: [30, 1000],
      abundance: 1,
      group: [10, 20],
      groupRadius: 40,
    }),
    drop: [singleDrop('Grausten')],
  },
  // pot2_red
  {
    type: 'object',
    subtype: 'misc',
    id: 'ashland_pot2_red',
    // iconId: 'piece/piece_pot2_cracked',
    tier: 7,
    grow: itemGrow({
      num: [1, 2],
      locations: ['Ashlands'],
      randTilt: 45,
      biomeArea: 7,
      altitude: [11, 1000],
      abundance: 1,
      offset: -0.5,
      group: [1, 3],
      groupRadius: 20,
    }),
    Destructible: {
      hp: 40,
      damageModifiers: mods([0, 0, 0, 0, 0, 1, 1, 1, 3, 3]),
      minToolTier: 0,
      ashResist,
      parts: [],
    },
    drop: [{
      num: [1, 2],
      oneOfEach,
      options: [
        { item: 'Pot_Shard_Green' },
        { item: 'Pot_Shard_Green' },
        { item: 'Bronze', weight: 0.1 },
        { item: 'Iron', weight: 0.1 },
        { item: 'Silver', weight: 0.1 },
        { item: 'MeadHealthMinor', weight: 0.1 },
        { item: 'MeadStaminaMinor', weight: 0.1 },
        { item: 'MeadTasty', weight: 0.1 },
      ],
    }],
  },
  // UnstableLavaRock: UnstableLavaRock
  // mushroom_SmokePuff: Pickable_SmokePuff
  {
    type: 'object',
    subtype: 'ore',
    id: 'LeviathanLava',
    iconId: 'resource/FlametalNew',
    components: ['Leviathan'],
    tier: 7,
    grow: [],
    Destructible: {
      hp: 0,
      minToolTier: 0,
      damageModifiers: pickOnly,
      parts: [{ id: 'LeviathanLava_default', num: 27 }],
    },
    Leviathan: { chance: 0.1, delay: 20 },
    drop: [],
  },
  // this is an artificial object, since game uses mesh collider as map/area
  {
    type: 'object',
    id: 'LeviathanLava_default',
    subtype: 'ore',
    iconId: 'resource/FlametalOreNew',
    tier: 7,
    grow: [],
    Destructible: {
      hp: 100,
      minToolTier: 3,
      damageModifiers: pickOnly,
      parts: [],
    },
    drop: [singleDrop('FlametalOreNew', 3, 4)],
  },
  {
    type: 'object',
    subtype: 'misc',
    id: 'asksvin_carrion',
    tier: 7,
    Destructible: {
      hp: 150,
      damageModifiers: mods([0, 0, 1, 2, 0, 1, 0, 1, 4, 4]),
      minToolTier: 0,
      ashImmune,
      parts: [],
    },
    drop: [{
      num: [1, 2],
      options: [
        { item: 'BoneFragments', weight: 50, num: [2, 15] },
        { item: 'AsksvinCarrionSkull' },
        { item: 'AsksvinCarrionRibcage' },
        { item: 'AsksvinCarrionPelvic' },
        { item: 'AsksvinCarrionNeck' },
      ],
    }],
  },
  {
    type: 'object',
    subtype: 'misc',
    id: 'asksvin_carrion2',
    tier: 7,
    Destructible: {
      hp: 150,
      damageModifiers: mods([0, 0, 1, 2, 0, 1, 0, 1, 4, 4]),
      minToolTier: 0,
      ashImmune,
      parts: [],
    },
    drop: [{
      num: [1, 2],
      options: [
        { item: 'BoneFragments', weight: 50, num: [2, 15] },
        { item: 'AsksvinCarrionSkull' },
        { item: 'AsksvinCarrionRibcage' },
        { item: 'AsksvinCarrionPelvic' },
        { item: 'AsksvinCarrionNeck' },
      ],
    }],
  },
  {
    disabled: true,
    type: 'object',
    subtype: 'ore',
    id: 'MineRock_Meteorite',
    iconId: 'resource/FlametalOre',
    components: ['MineRock'],
    tier: 7,
    Destructible: {
      hp: 60,
      damageModifiers: pickOnly,
      minToolTier: 2,
      parts: [],
    },
    grow: [],
    drop: [{
      num: [1, 2],
      options: [
        { item: 'FlametalOre' },
        { item: 'Stone', weight: 2, },
      ],
    }],
  },
  {
    type: 'object',
    subtype: 'misc',
    id: 'shipwreck_karve_bottomboards',
    tier: 1,
    Destructible: {
      hp: 60,
      damageModifiers: chopOnly,
      minToolTier: 1,
      parts: [],
    },
    drop: [singleDrop('FineWood', 3, 5)]
  },
  {
    type: 'object',
    subtype: 'misc',
    id: 'shipwreck_karve_bow',
    tier: 1,
    Destructible: {
      hp: 60,
      damageModifiers: chopOnly,
      minToolTier: 1,
      parts: [],
    },
    drop: [singleDrop('FineWood', 3, 5)]
  },
  {
    type: 'object',
    subtype: 'misc',
    id: 'shipwreck_karve_dragonhead',
    tier: 1,
    Destructible: {
      hp: 60,
      damageModifiers: chopOnly,
      minToolTier: 1,
      parts: [],
    },
    drop: [singleDrop('FineWood', 3, 5)]
  },
  {
    type: 'object',
    subtype: 'misc',
    id: 'shipwreck_karve_stern',
    tier: 1,
    Destructible: {
      hp: 60,
      damageModifiers: chopOnly,
      minToolTier: 1,
      parts: [],
    },
    drop: [singleDrop('FineWood', 3, 5)]
  },
  {
    type: 'object',
    subtype: 'misc',
    id: 'shipwreck_karve_sternpost',
    tier: 1,
    Destructible: {
      hp: 60,
      damageModifiers: chopOnly,
      minToolTier: 1,
      parts: [],
    },
    drop: [singleDrop('FineWood', 3, 5)]
  },
  ...[
    { id: 'Vegvisir_Eikthyr', loc: 'Eikthyrnir', tier: 0 },
    { id: 'Vegvisir_GDKing', loc: 'GDKing', tier: 2 },
    { id: 'Vegvisir_Bonemass', loc: 'Bonemass', tier: 3 },
    { id: 'Vegvisir_DragonQueen', loc: 'Dragonqueen', tier: 5 },
    { id: 'Vegvisir_GoblinKing', loc: 'GoblinKing', tier: 4 },
    { id: 'Vegvisir_SeekerQueen', loc: 'Mistlands_DvergrBossEntrance1', tier: 6 },
    { id: 'Vegvisir_Fader', loc: 'Fader', tier: 7 },
    { id: 'Vegvisir_placeofmystery_1', loc: 'PlaceofMystery1', tier: 7 },
    { id: 'Vegvisir_placeofmystery_2', loc: 'PlaceofMystery2', tier: 7 },
    { id: 'Vegvisir_placeofmystery_3', loc: 'PlaceofMystery3', tier: 7 },
  ].map<PhysicalObject>(({ id, loc, tier }) => ({
    type: 'object',
    subtype: 'indestructible',
    id,
    iconId: 'object/Vegvisir',
    Vegvisir: loc,
    components: ['Vegvisir'],
    tier,
  })),
  {
    type: 'object',
    subtype: 'misc',
    id: 'lox_ribs',
    iconId: 'resource/BoneFragments',
    tier: 5,
  },
  {
    type: 'object',
    subtype: 'indestructible',
    id: 'StatueDeer',
    tier: 1,
  },
  {
    disabled: true,
    type: 'object',
    subtype: 'indestructible',
    id: 'StatueCorgi',
    tier: 1,
  },
  {
    disabled: true,
    type: 'object',
    subtype: 'indestructible',
    id: 'StatueHare',
    tier: 1,
  },
  {
    type: 'object',
    subtype: 'indestructible',
    id: 'StatueSeed',
    tier: 1,
  },
  ...[7,8,10,11,12].map<PhysicalObject>(subId => ({
    type: 'object',
    subtype: 'indestructible',
    id: `root${String(subId).padStart(2, '0')}`,
    disabled: true, // used in 2 types of crypts
    components: [],
    tier: 2,
  })),
  {
    id: 'blackmarble_base_2',
    iconId: 'piece/blackmarble_1x1',
    type: 'object',
    subtype: 'misc',
    tier: 6,
    // size: [2, 2, 2],
    Destructible: {
      hp: 1500,
      damageModifiers: mods([1, 1, 1, 1, 1, 3, 3, 3, 3, 3]),
      minToolTier: 0,
      ashResist,
      parts: [],
    },
    drop: [singleDrop('BlackMarble', 1)],
  },
  {
    id: 'blackmarble_creep_4x1x1',
    iconId: 'piece/blackmarble_1x1',
    disabled: true,
    type: 'object',
    subtype: 'misc',
    tier: 6,
    // size: [4, 1, 1],
    Destructible: {
      hp: 500,
      damageModifiers: mods([1, 1, 1, 1, 1, 3, 3, 3, 3, 3]),
      minToolTier: 0,
      parts: [],
    },
    drop: [singleDrop('BlackMarble', 1)],
  },
  {
    id: 'blackmarble_creep_4x2x1',
    iconId: 'piece/blackmarble_1x1',
    disabled: true,
    type: 'object',
    subtype: 'misc',
    tier: 6,
    // size: [4, 1, 2],
    Destructible: {
      hp: 500,
      damageModifiers: mods([1, 1, 1, 1, 1, 3, 3, 3, 3, 3]),
      minToolTier: 0,
      parts: [],
    },
    drop: [singleDrop('BlackMarble', 1)],
  },
  {
    id: 'blackmarble_creep_slope_inverted_1x1x2',
    iconId: 'piece/blackmarble_out_1',
    disabled: true,
    type: 'object',
    subtype: 'misc',
    tier: 6,
    // size: [1, 1, 2],
    Destructible: {
      hp: 500,
      damageModifiers: mods([1, 1, 1, 1, 1, 3, 3, 3, 3, 3]),
      minToolTier: 0,
      parts: [],
    },
    drop: [singleDrop('BlackMarble', 1)],
  },
  {
    id: 'blackmarble_creep_slope_inverted_2x2x1',
    iconId: 'piece/blackmarble_out_1',
    disabled: true,
    type: 'object',
    subtype: 'misc',
    tier: 6,
    // size: [2, 2, 1],
    Destructible: {
      hp: 500,
      damageModifiers: mods([1, 1, 1, 1, 1, 3, 3, 3, 3, 3]),
      minToolTier: 0,
      parts: [],
    },
    drop: [singleDrop('BlackMarble', 1)],
  },
  {
    id: 'blackmarble_creep_stair',
    disabled: true,
    type: 'object',
    subtype: 'misc',
    // size: [2, 2, 1],
    tier: 6,
    Destructible: {
      hp: 500,
      damageModifiers: mods([1, 1, 1, 1, 1, 3, 3, 3, 3, 3]),
      minToolTier: 0,
      parts: [],
    },
    drop: [singleDrop('BlackMarble', 2)],
  },
  {
    id: 'blackmarble_floor_large',
    iconId: 'piece/stone_floor',
    type: 'object',
    subtype: 'misc',
    tier: 6,
    // size: [4, 4, 1],
    Destructible: {
      hp: 6000,
      damageModifiers: mods([0, 0, 0, 0, 2, 1, 1, 0, 3, 3]),
      minToolTier: 0,
      parts: [],
    },
    drop: [singleDrop('BlackMarble', 8)],
  },
  {
    id: 'blackmarble_head01',
    type: 'object',
    subtype: 'misc',
    // size: [2, 2, 1],
    tier: 6,
    Destructible: {
      hp: 1500,
      damageModifiers: mods([1, 1, 1, 1, 1, 3, 3, 3, 3, 3]),
      minToolTier: 0,
      parts: [],
    },
    drop: [singleDrop('Copper', 10)] 
  },
  {
    id: 'blackmarble_head02',
    type: 'object',
    subtype: 'misc',
    // size: [2, 2, 1],
    tier: 6,
    Destructible: {
      hp: 1500,
      damageModifiers: mods([1, 1, 1, 1, 1, 3, 3, 3, 3, 3]),
      minToolTier: 0,
      parts: [],
    },
    drop: [singleDrop('Copper', 10)] 
  },
  {
    id: 'blackmarble_slope_inverted_1x2',
    iconId: 'piece/blackmarble_1x1',
    type: 'object',
    subtype: 'misc',
    tier: 6,
    // size: [2, 2, 1],
    Destructible: {
      hp: 1500,
      damageModifiers: mods([1, 1, 1, 1, 1, 3, 3, 3, 3, 3]),
      minToolTier: 0,
      parts: [],
    },
    drop: [singleDrop('BlackMarble', 1)],
  },
  {
    id: 'blackmarble_stair_corner_left',
    iconId: 'piece/blackmarble_creep_stair',
    disabled: true,
    type: 'object',
    subtype: 'misc',
    tier: 6,
    // size: [2, 2, 1],
    Destructible: {
      hp: 1500,
      damageModifiers: mods([1, 1, 1, 1, 1, 3, 3, 3, 3, 3]),
      minToolTier: 0,
      parts: [],
    },
    drop: [singleDrop('BlackMarble', 2)],
  },
  {
    id: 'blackmarble_stair_corner',
    iconId: 'piece/blackmarble_creep_stair',
    type: 'object',
    subtype: 'misc',
    tier: 6,
    // size: [2, 2, 1],
    Destructible: {
      hp: 1500,
      damageModifiers: mods([1, 1, 1, 1, 1, 3, 3, 3, 3, 3]),
      minToolTier: 0,
      parts: [],
    },
    drop: [singleDrop('BlackMarble', 2)],
  },
  {
    id: 'blackmarble_tile_floor_1x1',
    disabled: true,
    type: 'object',
    subtype: 'misc',
    // size: [1, 1, 1],
    tier: 6,
    Destructible: {
      hp: 200,
      damageModifiers: mods([1, 1, 1, 1, 1, 3, 3, 3, 3, 3]),
      minToolTier: 0,
      ashResist,
      parts: [],
    },
    drop: [singleDrop('BlackMarble', 2)],
  },
  {
    id: 'blackmarble_tile_floor_2x2',
    disabled: true,
    type: 'object',
    subtype: 'misc',
    // size: [2, 2, 1],
    tier: 6,
    Destructible: {
      hp: 200,
      damageModifiers: mods([1, 1, 1, 1, 1, 3, 3, 3, 3, 3]),
      minToolTier: 0,
      ashResist,
      parts: [],
    },
    drop: [singleDrop('BlackMarble', 2)],
  },
  {
    id: 'blackmarble_tile_wall_1x1',
    disabled: true,
    type: 'object',
    subtype: 'misc',
    // size: [1, 1, 1],
    tier: 6,
    Destructible: {
      hp: 200,
      damageModifiers: mods([1, 1, 1, 1, 1, 3, 3, 3, 3, 3]),
      minToolTier: 0,
      ashResist,
      parts: [],
    },
    drop: [singleDrop('BlackMarble', 2)],
  },
  {
    id: 'blackmarble_tile_wall_2x2',
    disabled: true,
    type: 'object',
    subtype: 'misc',
    // size: [2, 2, 1],
    tier: 6,
    Destructible: {
      hp: 200,
      damageModifiers: mods([1, 1, 1, 1, 1, 3, 3, 3, 3, 3]),
      minToolTier: 0,
      ashResist,
      parts: [],
    },
    drop: [singleDrop('BlackMarble', 2)],
  },
  {
    id: 'blackmarble_tile_wall_2x4',
    disabled: true,
    type: 'object',
    subtype: 'misc',
    // size: [2, 4, 1],
    tier: 6,
    Destructible: {
      hp: 200,
      damageModifiers: mods([1, 1, 1, 1, 1, 3, 3, 3, 3, 3]),
      minToolTier: 0,
      ashResist,
      parts: [],
    },
    drop: [singleDrop('BlackMarble', 2)],
  },
  {
    id: 'blackmarble_out_2',
    iconId: 'piece/blackmarble_1x1',
    disabled: true,
    type: 'object',
    subtype: 'misc',
    tier: 6,
    // size: [2, 2, 1],
    Destructible: {
      hp: 1500,
      damageModifiers: mods([1, 1, 1, 1, 1, 3, 3, 3, 3, 3]),
      minToolTier: 0,
      parts: [],
    },
    drop: [singleDrop('BlackMarble', 1)],
  },
  {
    id: 'blackmarble_2x2_enforced',
    iconId: 'piece/blackmarble_1x1',
    type: 'object',
    subtype: 'misc',
    tier: 6,
    // size: [2, 1, 1]
    Destructible: {
      hp: 1500,
      damageModifiers: mods([1, 1, 1, 1, 1, 3, 3, 3, 3, 3]),
      minToolTier: 0,
      parts: [],
    },
    drop: [
      singleDrop('BlackMarble', 1),
      singleDrop('CopperScrap', 1),
    ],
  },
  {
    id: 'blackmarble_2x2x1',
    iconId: 'piece/blackmarble_1x1',
    type: 'object',
    subtype: 'misc',
    tier: 6,
    // size: [2, 2, 1]
    Destructible: {
      hp: 1500,
      damageModifiers: mods([1, 1, 1, 1, 1, 3, 3, 3, 3, 3]),
      minToolTier: 0,
      parts: [],
    },
    drop: [singleDrop('BlackMarble', 6)],
  },
  {
    id: 'blackmarble_column_3',
    iconId: 'piece/blackmarble_1x1',
    type: 'object',
    subtype: 'misc',
    tier: 6,
    // size: [2, 8, 2]
    Destructible: {
      hp: 4000,
      damageModifiers: mods([1, 1, 1, 1, 1, 3, 3, 3, 3, 3]),
      minToolTier: 0,
      parts: [],
    },
    drop: [singleDrop('BlackMarble', 1)],
  },
  {
    id: 'blackmarble_head_big01',
    iconId: 'piece/blackmarble_1x1',
    type: 'object',
    subtype: 'misc',
    tier: 6,
    // size: [2, 2, 2]
    drop: [singleDrop('BlackMarble', 1)],
    Destructible: {
      hp: 1500,
      damageModifiers: mods([1, 1, 1, 1, 1, 3, 3, 3, 3, 3]),
      minToolTier: 0,
      parts: [],
    },
  },
  {
    id: 'blackmarble_head_big02',
    iconId: 'piece/blackmarble_1x1',
    type: 'object',
    subtype: 'misc',
    tier: 6,
    // size: [2, 2, 2]
    drop: [singleDrop('BlackMarble', 1)],
    Destructible: {
      hp: 1500,
      damageModifiers: mods([1, 1, 1, 1, 1, 3, 3, 3, 3, 3]),
      minToolTier: 0,
      parts: [],
    },
  },
  {
    id: 'blackmarble_post01',
    type: 'object',
    subtype: 'misc',
    tier: 6,
    // size: [2, 6.5, 2],
    drop: [singleDrop('BlackMarble', 3, 4)],
    Destructible: {
      hp: 2000,
      damageModifiers: mods([1, 1, 1, 1, 1, 3, 3, 3, 3, 3]),
      minToolTier: 0,
      parts: [],
    },
  },
  {
    id: 'blackmarble_slope_1x2',
    iconId: 'piece/blackmarble_1x1',
    type: 'object',
    subtype: 'misc',
    tier: 6,
    // size: [1, 2, 1],
    drop: [singleDrop('BlackMarble', 1)],
    Destructible: {
      hp: 1500,
      damageModifiers: mods([1, 1, 1, 1, 0, 3, 3, 3, 3, 3]),
      minToolTier: 0,
      parts: [],
    },
  },
  {
    id: 'dvergrprops_crate_long',
    type: 'object',
    subtype: 'misc',
    tier: 6,
    Destructible: {
      hp: 10,
      damageModifiers: {
        ...allNormal,
        chop: 'weak',
        poison: 'immune',
        spirit: 'immune',
      },
      minToolTier: 0,
      parts: [],
    },
    drop: [singleDrop('DvergrNeedle')],
  },
  {
    id: 'dvergrprops_barrel',
    iconId: 'piece/Fermenter',
    type: 'object',
    subtype: 'misc',
    tier: 6,
    Destructible: {
      hp: 800,
      damageModifiers: woodResist,
      minToolTier: 0,
      parts: [],
    },
    drop: [{
      num: [3, 6],
      options: [
        { item: 'FineWood' },
        { item: 'CopperScrap' },
        { item: 'MeadTasty' },
      ]
    }],
  },
  {
    id: 'dvergrprops_table',
    iconId: 'piece/piece_table_oak',
    type: 'object',
    subtype: 'misc',
    tier: 6,
    Destructible: dvergrPropsDestructible(200),
    drop: [{
      num: [1, 3],
      options: [
        { item: 'FineWood' },
        { item: 'CopperScrap', weight: 0.5 },
      ]
    }],
  },
  {
    id: 'dvergrprops_chair',
    iconId: 'piece/piece_chair03',
    type: 'object',
    subtype: 'misc',
    tier: 6,
    Destructible: dvergrPropsDestructible(100),
    drop: [{
      num: [1, 3],
      options: [
        { item: 'FineWood' },
        { item: 'CopperScrap', weight: 0.5 },
      ]
    }],
  },
  {
    id: 'dvergrprops_stool',
    iconId: 'piece/piece_chair',
    type: 'object',
    subtype: 'misc',
    tier: 6,
    Destructible: dvergrPropsDestructible(50),
    drop: [{
      num: [1, 3],
      options: [
        { item: 'FineWood' },
        { item: 'CopperScrap', weight: 0.5 },
      ]
    }],
  },
  {
    id: 'dvergrprops_bed',
    iconId: 'piece/bed',
    type: 'object',
    subtype: 'misc',
    tier: 6,
    Destructible: dvergrPropsDestructible(400),
    drop: [{
      num: [1, 4],
      options: [
        { item: 'FineWood' },
        { item: 'CopperScrap', weight: 0.5 },
      ]
    }],
  },
  {
    id: 'dvergrprops_wood_beam',
    iconId: 'piece/wood_beam',
    type: 'object',
    subtype: 'misc',
    tier: 6,
    disabled: true, // used in outside Mistlands locations
    Destructible: {
      hp: 500,
      damageModifiers: woodResist,
      minToolTier: 0,
      parts: [],
    },
    drop: [singleDrop('Wood')],
  },
  {
    id: 'dvergrprops_curtain',
    type: 'object',
    subtype: 'misc',
    tier: 6,
    disabled: true, // used in outside Mistlands locations
    Destructible: dvergrPropsDestructible(100),
    drop: [singleDrop('JuteBlue', 1, 2)],
  },
  {
    id: 'dvergrprops_banner',
    type: 'object',
    subtype: 'misc',
    tier: 6,
    disabled: true, // used in outside Mistlands locations
    Destructible: dvergrPropsDestructible(100),
    drop: [singleDrop('JuteBlue', 1, 2)],
  },
  {
    id: 'dverger_demister_large',
    type: 'object',
    subtype: 'misc',
    tier: 6,
    disabled: true, // used in outside Mistlands locations
    Destructible: {
      hp: 200,
      damageModifiers: torchResist,
      minToolTier: 0,
      parts: [],
    },
    drop: [singleDrop('JuteBlue', 1, 2)],
  },
  {
    id: 'dvergrprops_wood_pole',
    iconId: 'piece/wood_pole2',
    type: 'object',
    subtype: 'misc',
    tier: 6,
    disabled: true, // used in outside Mistlands locations
    Destructible: {
      hp: 500,
      damageModifiers: {
        ...allNormal,
        pierce: 'resistant',
        chop: 'weak',
        poison: 'immune',
        spirit: 'immune',
      },
      minToolTier: 0,
      parts: [],
    },
    drop: [{
      offByOneBug: false,
      num: [1, 1],
      options: [
        { item: 'Wood' },
        { item: 'CopperScrap', weight: 0.5 },
      ],
    }],
  },
  {
    id: 'dvergrtown_head02',
    iconId: 'piece/blackmarble_head02',
    type: 'object',
    subtype: 'indestructible',
    tier: 6,
    disabled: true, // used in some dvergrtown rooms
  },
  {
    id: 'dvergrprops_wood_stakewall',
    iconId: 'piece/piece_dvergr_sharpstakes',
    type: 'object',
    subtype: 'misc',
    tier: 6,
    disabled: true, // used in some dvergrtown rooms
    Destructible: {
      hp: 500,
      damageModifiers: mods([0, 0, 1, 2, 0, 0, 1, 1, 3, 3]),
      minToolTier: 0,
      parts: [],
    },
    drop: [singleDrop('Wood', 1, 5)],
  },
  {
    id: 'dvergrprops_pickaxe',
    iconId: 'weapon/PickaxeBronze',
    type: 'object',
    subtype: 'misc',
    tier: 6,
    Destructible: {
      hp: 1, damageModifiers: allNormal, minToolTier: 0, parts: [],
    },
    drop: [{
      num: [1, 1],
      chance: 0.5,
      options: [{ item: 'IronScrap' }],
    }],
  },
  {
    id: 'dvergrprops_lantern_standing',
    iconId: 'weapon/Lantern',
    type: 'object',
    subtype: 'misc',
    tier: 7,
    Destructible: {
      hp: 10, damageModifiers: mods([2, 2, 0, 2, 2, 0, 0, 0, 3, 3]), minToolTier: 0, parts: [],
    },
    drop: [{
      num: [1, 2],
      options: [
        { item: 'CopperScrap' },
        { item: 'SurtlingCore' },
      ],
    }],
  },
  {
    id: 'dvergrprops_crate_ashlands',
    iconId: 'objects/crate',
    type: 'object',
    subtype: 'misc',
    tier: 7,
    Destructible: {
      hp: 200, damageModifiers: mods([0, 0, 1, 2, 0, 0, 0, 0, 3, 3]), minToolTier: 0, parts: [],
    },
    drop: [{
      num: [1, 4],
      options: [
        { item: 'Blackwood' },
        { item: 'FlametalOreNew' },
      ],
    }],
  },
  {
    id: 'dvergrtown_1x1x1',
    iconId: 'piece/blackmarble_1x1',
    type: 'object',
    subtype: 'indestructible',
    tier: 6,
    disabled: true, // used in some dvergrtown rooms
  },
  {
    id: 'dvergrtown_2x2x1',
    iconId: 'piece/blackmarble_creep_stair',
    type: 'object',
    subtype: 'indestructible',
    tier: 6,
    disabled: true, // used in some dvergrtown rooms
  },
  {
    id: 'dvergrtown_4x2x1',
    iconId: 'piece/blackmarble_tile_wall_2x4',
    type: 'object',
    subtype: 'indestructible',
    tier: 6,
    disabled: true, // used in some dvergrtown rooms
  },
  {
    id: 'dvergrtown_floor_1x1',
    iconId: 'piece/blackmarble_tile_floor_2x2',
    type: 'object',
    subtype: 'indestructible',
    tier: 6,
    disabled: true, // used in some dvergrtown rooms
  },
  {
    id: 'dvergrtown_floor_large',
    iconId: 'piece/stone_floor_4x4',
    type: 'object',
    subtype: 'indestructible',
    tier: 6,
    disabled: true, // used in some dvergrtown rooms
  },
  {
    id: 'dvergrtown_metal_wall_2x2',
    iconId: 'piece/piece_dvergr_metal_wall_2x2',
    type: 'object',
    subtype: 'indestructible',
    tier: 6,
    disabled: true, // used in some dvergrtown rooms
  },
  {
    id: 'dvergrtown_secret_door',
    iconId: 'piece/blackmarble_tile_wall_2x4',
    components: ['Door'],
    type: 'object',
    subtype: 'indestructible',
    tier: 6,
    disabled: true, // used in some dvergrtown rooms
  },
  {
    id: 'dvergrtown_wood_support',
    iconId: 'piece/darkwood_arch',
    type: 'object',
    subtype: 'misc',
    Destructible: {
      hp: 500,
      minToolTier: 0,
      damageModifiers: woodResist,
      parts: [],
    },
    drop: [singleDrop('Wood', 1, 2)],
    tier: 6,
  },
  {
    id: 'dvergrtown_wood_pole',
    iconId: 'piece/piece_dvergr_pole',
    type: 'object',
    subtype: 'misc',
    Destructible: {
      hp: 800,
      minToolTier: 0,
      damageModifiers: { ...woodResist, lightning: 'immune' },
      parts: [],
    },
    drop: [{
      num: [1, 2],
      options: [
        { item: 'YggdrasilWood' },
        { item: 'CopperScrap', weight: 0.5 },
      ],
    }],
    tier: 6,
  },
  {
    id: 'dvergrprops_lantern',
    iconId: 'weapon/Lantern',
    type: 'object',
    subtype: 'misc',
    Destructible: {
      hp: 100,
      minToolTier: 0,
      damageModifiers: mods([2, 0, 1, 2, 0, 1, 1, 1, 3, 3]),
      parts: [],
    },
    drop: [{
      num: [1, 2],
      options: [
        { item: 'CopperScrap' },
        { item: 'SurtlingCore' },
      ],
    }],
    tier: 6,
  },
  {
    id: 'SeekerEgg',
    type: 'object',
    subtype: 'misc',
    PointLight: { color: '#FF5C14', range: 3, intensity: 1.5 },
    Destructible: {
      hp: 1,
      minToolTier: 0,
      damageModifiers: allNormal,
      parts: [],
    },
    drop: [singleDrop('SeekerBrood')], // + hatchEffect
    tier: 6,
  },
  {
    id: 'CreepProp_egg_hanging01',
    iconId: 'object/SeekerEgg',
    type: 'object',
    subtype: 'misc',
    PointLight: { color: '#FF5C14', range: 3, intensity: 1.5 },
    Destructible: {
      hp: 1,
      minToolTier: 0,
      damageModifiers: { ...allNormal, spirit: 'ignore' },
      parts: [],
    },
    drop: [singleDrop('SeekerBrood')],
    tier: 6,
  },
  {
    id: 'blackmarble_altar_crystal',
    iconId: 'resource/DvergrKeyFragment',
    type: 'object',
    subtype: 'misc',
    Destructible: {
      hp: 10,
      minToolTier: 0,
      damageModifiers: allNormal,
      parts: [],
    },
    drop: [singleDrop('DvergrKeyFragment')],
    tier: 6,
  },
  {
    id: 'Pickable_DvergrMineTreasure',
    iconId: 'piece/gold_pile',
    type: 'object',
    subtype: 'treasure',
    components: ['Pickable'],
    tier: 6,
    drop: [{
      offByOneBug: false,
      num: [1, 4],
      options: [
        { item: 'Coins', num: [11, 33] },
      ],
    }],
  },
  {
    id: 'Pickable_RoyalJelly',
    iconId: 'resource/RoyalJelly',
    type: 'object',
    subtype: 'misc',
    components: ['Pickable'], // drop exactly 5 on pick
    tier: 6,
    drop: [singleDrop('RoyalJelly', 4, 7)],
    Destructible: { hp: 1, damageModifiers: allNormal, minToolTier: 0, parts: [], },
  },
  // highstone, widestone
  {
    id: 'Player_tombstone',
    type: 'object',
    subtype: 'misc',
    tier: 0,
    components: ['TombStone', 'Container'],
    floating: true,
  },
  {
    id: 'CargoCrate',
    type: 'object',
    subtype: 'misc',
    tier: 2,
    components: ['Container'],
    floating: true,
  },
];

export const structures: Structure[] = [
  {
    id: 'sign_notext',
    iconId: 'piece/sign',
    type: 'structure',
    tier: 1,
    Destructible: {
      hp: 50,
      damageModifiers: allNormal,
      minToolTier: 0,
      parts: [],
    }
  },
  {
    id: 'goblin_banner',
    type: 'structure',
    tier: 5,
    disabled: true, // used in some goblin locations
    Destructible: {
      hp: 200,
      damageModifiers: allNormal,
      minToolTier: 0,
      parts: [],
    }
  },
  {
    id: 'goblin_bed',
    iconId: 'piece/bed',
    type: 'structure',
    tier: 5,
    Destructible: {
      hp: 200,
      damageModifiers: allNormal,
      minToolTier: 0,
      parts: [],
    }
  },
  {
    id: 'goblin_fence',
    type: 'structure',
    tier: 5,
    disabled: true, // used in some goblin locations
    Destructible: {
      hp: 200,
      damageModifiers: allNormal,
      minToolTier: 0,
      parts: [],
    }
  },
  {
    id: 'goblin_pole',
    type: 'structure',
    tier: 5,
    disabled: true, // used in some goblin locations
    Destructible: {
      hp: 200,
      damageModifiers: allNormal,
      minToolTier: 0,
      parts: [],
    }
  },
  {
    id: 'goblin_pole_small',
    type: 'structure',
    tier: 5,
    disabled: true, // used in some goblin locations
    Destructible: {
      hp: 200,
      damageModifiers: allNormal,
      minToolTier: 0,
      parts: [],
    }
  },
  {
    id: 'goblin_roof_45d',
    type: 'structure',
    tier: 5,
    disabled: true, // used in some goblin locations
    Destructible: {
      hp: 200,
      damageModifiers: allNormal,
      minToolTier: 0,
      parts: [],
    }
  },
  {
    id: 'goblin_roof_45d_corner',
    type: 'structure',
    tier: 5,
    disabled: true, // used in some goblin locations
    Destructible: {
      hp: 200,
      damageModifiers: allNormal,
      minToolTier: 0,
      parts: [],
    }
  },
  {
    id: 'goblin_roof_cap',
    type: 'structure',
    tier: 5,
    disabled: true, // used in some goblin locations
    Destructible: {
      hp: 200,
      damageModifiers: allNormal,
      minToolTier: 0,
      parts: [],
    }
  },
  {
    id: 'goblin_stairs',
    type: 'structure',
    tier: 5,
    disabled: true, // used in some goblin locations
    Destructible: {
      hp: 200,
      damageModifiers: allNormal,
      minToolTier: 0,
      parts: [],
    }
  },
  {
    id: 'goblin_stepladder',
    type: 'structure',
    tier: 5,
    disabled: true, // used in some goblin locations
    Destructible: {
      hp: 200,
      damageModifiers: allNormal,
      minToolTier: 0,
      parts: [],
    }
  },
  {
    id: 'goblin_totempole',
    type: 'structure',
    tier: 5,
    Destructible: {
      hp: 200,
      damageModifiers: allNormal,
      minToolTier: 0,
      parts: [],
    },
  },
  {
    id: 'goblin_woodwall_1m',
    type: 'structure',
    tier: 5,
    disabled: true, // used in some goblin locations
    Destructible: {
      hp: 200,
      damageModifiers: allNormal,
      minToolTier: 0,
      parts: [],
    }
  },
  {
    id: 'goblin_woodwall_2m',
    type: 'structure',
    tier: 5,
    disabled: true, // used in some goblin locations
    Destructible: {
      hp: 200,
      damageModifiers: allNormal,
      minToolTier: 0,
      parts: [],
    }
  },
  {
    id: 'goblin_woodwall_2m_ribs',
    type: 'structure',
    tier: 5,
    disabled: true, // used in some goblin locations
    Destructible: {
      hp: 200,
      damageModifiers: allNormal,
      minToolTier: 0,
      parts: [],
    }
  },
];

for (const obj of objects) {
  if (obj.subtype !== 'indestructible') {
    if (!obj.components) obj.components = [];
    if ('Destructible' in obj) {
      obj.components.push('Destructible');
    }
  }
}

/*
# any log2
- dmg: 50 blunt, 30 chop
*/
