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
import { singleDrop, itemGrow, mods } from '../model/game';
import { torchResist, woodResist } from '../model/building';
import { pickables } from './pickable';

const oneOfEach = true;

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
  iconId,
  group,
  tier,
  minToolTier,
  grow,
  hp: [baseHp, logHp, logHalfHp],
  drop: [baseDrop, chunkDrop],
  Plant,
}: {
  id: [EntityId, EntityId, EntityId, EntityId];
  iconId?: EntityId;
  group?: EntityGroup;
  tier: number;
  minToolTier: number;
  grow: ItemGrow[];
  hp: [number, number, number];
  drop: [GeneralDrop, GeneralDrop];
  Plant?: Plantable;
}): PhysicalObject[] {
  return [
    {
      type: 'object',
      subtype: 'tree',
      tags: ['plant'],
      id: baseId,
      iconId,
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
      iconId,
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
    drop: [singleDrop('HildirKey_forestcrypt')],
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
  {
    type: 'object',
    subtype: 'indestructible',
    id: 'MountainKit_int_floor_2x2',
    iconId: 'piece/stone_floor_2x2',
    tier: 4,
  },
  {
    type: 'object',
    subtype: 'indestructible',
    id: 'MountainKit_int_wall_4x2',
    iconId: 'piece/stone_wall_4x2',
    tier: 4,
  },
  {
    type: 'object',
    subtype: 'indestructible',
    id: 'MountainKit_int_wall_2x4',
    iconId: 'piece/stone_wall_4x2',
    tier: 4,
  },
  {
    type: 'object',
    subtype: 'indestructible',
    id: 'MountainKit_int_wall_4x4',
    iconId: 'piece/stone_wall_2x2',
    tier: 4,
  },
  {
    type: 'object',
    subtype: 'indestructible',
    id: 'StonePillarTall_mountain',
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
    type: 'object',
    subtype: 'misc',
    id: 'barrell', // yes, double-l
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
  {
    type: 'object',
    subtype: 'indestructible',
    id: 'SunkenKit_int_floor_4x4',
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
    id: 'hanging_hairstand',
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
    iconId: 'piece/cloth_hanging_door_double',
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
  {
    type: 'object',
    subtype: 'indestructible',
    id: 'RuneStone_CaveMan',
    tier: 4,
    grow: [],
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
    children: NaN,
    hp: NaN,
    drop: singleDrop('Stone', NaN),
  }),
  ...rock({
    id: ['widestone', 'widestone_frac'],
    iconId: 'resource/Stone',
    tier: 4,
    grow: [],
    children: NaN,
    hp: NaN,
    drop: singleDrop('Stone', NaN),
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
    tier: 6,
    grow: [],
  },
  {
    type: 'object',
    subtype: 'indestructible',
    id: 'tunnel_web',
    tier: 6,
    grow: [],
  },
  {
    type: 'object',
    subtype: 'indestructible',
    id: 'Skull1',
    tier: 6,
    grow: [],
  },
  {
    type: 'object',
    subtype: 'indestructible',
    id: 'Skull2',
    tier: 6,
    grow: [],
  },
  {
    type: 'object',
    subtype: 'indestructible',
    id: 'HugeRoot1',
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
    id: `dvergrprops_hooknchain`, // + dvergrtown_wood_crane
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
  {
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
  {
    type: 'object',
    subtype: 'indestructible',
    id: 'Vegvisir',
    components: ['Vegvisir'],
    tier: 0,
  },
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
    components: [],
    tier: 2,
  })),
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
    type: 'object',
    subtype: 'misc',
    tier: 6,
    Destructible: {
      hp: 100,
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
    Destructible: dvergrPropsDestructible(100),
    drop: [singleDrop('JuteBlue', 1, 2)],
  },
  {
    id: 'dvergrprops_banner',
    type: 'object',
    subtype: 'misc',
    tier: 6,
    Destructible: dvergrPropsDestructible(100),
    drop: [singleDrop('JuteBlue', 1, 2)],
  },
  {
    id: 'dverger_demister_large',
    type: 'object',
    subtype: 'misc',
    tier: 6,
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
  },
  {
    id: 'dvergrprops_pickaxe',
    iconId: 'weapons/PickaxeBronze',
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
    id: 'dvergrtown_1x1x1',
    iconId: 'piece/blackmarble_1x1',
    type: 'object',
    subtype: 'indestructible',
    tier: 6,
  },
  {
    id: 'dvergrtown_2x2x1',
    iconId: 'piece/blackmarble_creep_stair',
    type: 'object',
    subtype: 'indestructible',
    tier: 6,
  },
  {
    id: 'dvergrtown_4x2x1',
    iconId: 'piece/blackmarble_tile_wall_2x4',
    type: 'object',
    subtype: 'indestructible',
    tier: 6,
  },
  {
    id: 'dvergrtown_floor_1x1',
    iconId: 'piece/blackmarble_tile_floor_2x2',
    type: 'object',
    subtype: 'indestructible',
    tier: 6,
  },
  {
    id: 'dvergrtown_floor_large',
    iconId: 'piece/stone_floor_4x4',
    type: 'object',
    subtype: 'indestructible',
    tier: 6,
  },
  {
    id: 'dvergrtown_metal_wall_2x2',
    iconId: 'piece/piece_dvergr_metal_wall_2x2',
    type: 'object',
    subtype: 'indestructible',
    tier: 6,
  },
  {
    id: 'dvergrtown_secret_door',
    iconId: 'piece/blackmarble_tile_wall_2x4',
    components: ['Door'],
    type: 'object',
    subtype: 'indestructible',
    tier: 6,
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
    id: 'SeekerEgg',
    type: 'object',
    subtype: 'misc',
    PointLight: { color: '#FF5C14', range: 3, intensity: 1.5 },
    Destructible: {
      hp: 1,
      minToolTier: 0,
      damageModifiers: woodResist,
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
    }
  },
  {
    id: 'goblin_woodwall_1m',
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
    id: 'goblin_woodwall_2m',
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
    id: 'goblin_woodwall_2m_ribs',
    type: 'structure',
    tier: 5,
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
  }
}

/*
# any log2
- dmg: 50 blunt, 30 chop
*/
