import { singleDrop } from '../model/game';
import {
  DamageModifiers,
  Destructible,
  EntityGroup,
  EntityId,
  GeneralDrop,
  itemGrow,
  ItemGrow,
} from '../types';

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

const chopOnly: DamageModifiers = {
  ...allImmune,
  chop: 'normal',
};

const pickOnly: DamageModifiers = {
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

const emptyGrow: ItemGrow[] = [];

function tree({
  id: [baseId, stubId, logId, logHalfId],
  group,
  tier,
  minToolTier,
  grow,
  hp: [baseHp, logHp, logHalfHp],
  drop: [baseDrop, chunkDrop],
}: {
  id: [EntityId, EntityId, EntityId, EntityId];
  group?: EntityGroup;
  tier: number;
  minToolTier: number;
  grow: ItemGrow[];
  hp: [number, number, number];
  drop: [GeneralDrop, GeneralDrop];
}): Destructible[] {
  return [
    {
      type: 'destructible',
      subtype: 'tree',
      tags: ['plant', 'tree'],
      id: baseId,
      group,
      tier,
      grow,
      hp: baseHp,
      damageModifiers: chopOnly,
      minToolTier,
      parts: [
        { id: stubId, num: 1 },
        { id: logId, num: 1 },
      ],
      drop: [baseDrop],
    },
    {
      type: 'destructible',
      subtype: 'tree',
      id: stubId,
      tier,
      grow: emptyGrow,
      hp: 80,
      damageModifiers: chopOnly,
      minToolTier,
      parts: [],
      drop: [singleDrop('Wood', 2, 2)],
    },
    {
      type: 'destructible',
      subtype: 'tree',
      id: logId,
      tier,
      grow: emptyGrow,
      hp: logHp,
      damageModifiers: chopOnly,
      minToolTier,
      parts: [
        { id: logHalfId, num: 2 },
      ],
      drop: [],
    },
    {
      type: 'destructible',
      subtype: 'tree',
      id: logHalfId,
      tier,
      grow: emptyGrow,
      hp: logHalfHp,
      damageModifiers: chopOnly,
      minToolTier,
      parts: [],
      drop: [chunkDrop],
    },
  ];
};

function treeSimpler({
  id: [baseId, stubId, logId],
  tier,
  minToolTier,
  grow,
  hp: [baseHp, logHp],
  drop: [baseDrop, chunkDrop],
}: {
  id: [EntityId, EntityId, EntityId];
  tier: number,
  minToolTier: number,
  grow: ItemGrow[];
  hp: [number, number];
  drop: [GeneralDrop, GeneralDrop];
}): Destructible[] {
  return [
    {
      type: 'destructible',
      subtype: 'tree',
      tags: ['plant', 'tree'],
      id: baseId,
      tier,
      grow,
      hp: baseHp,
      damageModifiers: chopOnly,
      minToolTier,
      parts: [
        { id: stubId, num: 1 },
        { id: logId, num: 1 },    
      ],
      drop: [baseDrop],
    },
    {
      type: 'destructible',
      subtype: 'tree',
      id: stubId,
      tier,
      grow: emptyGrow,
      hp: 80,
      damageModifiers: chopOnly,
      minToolTier,
      parts: [],
      drop: [singleDrop('Wood', 2, 2)],
    },
    {
      type: 'destructible',
      subtype: 'tree',
      id: logId,
      tier,
      grow: emptyGrow,
      hp: logHp,
      damageModifiers: chopOnly,
      minToolTier,
      parts: [],
      drop: [chunkDrop],
    },
  ];
};

function rock({
  subtype,
  id: [baseId, fracId],
  tier = 1,
  minToolTier = 0,
  grow,
  children,
  hp: fracHp,
  drop: fracDrop,
}: {
  subtype: Destructible['subtype'],
  id: [EntityId, EntityId];
  tier?: number;
  minToolTier?: number;
  grow: ItemGrow[];
  children: number;
  hp: number;
  drop: GeneralDrop;
}): Destructible[] {
  return [
    {
      type: 'destructible',
      subtype,
      id: baseId,
      tier,
      grow,
      hp: 1,
      damageModifiers: pickOnly,
      minToolTier,
      parts: [{ id: fracId, num: children }],
      drop: [],
    },
    {
      type: 'destructible',
      subtype,
      id: fracId,
      tier,
      grow: emptyGrow,
      hp: fracHp,
      damageModifiers: pickOnly,
      minToolTier,
      parts: [],
      drop: [fracDrop],
    },
  ];
};

const cacheMap: Map<Destructible, Destructible> = new Map();

export function fullDestructible(obj: Destructible): Destructible {
  const cached = cacheMap.get(obj);
  if (cached != null) return cached;

  const { parts, ...rest } = obj;

  for (const { id, num } of parts) {
    const child = destructibles.find(d => d.id === id);
    if (child == null) continue;
    const { hp, drop } = fullDestructible(child);
    rest.hp += hp * num;
    rest.drop = [...rest.drop, ...drop.map(d => ({ ...d, num: [d.num[0] * num, d.num[1] * num] as [number, number] }))];
  }
  
  const result = { ...rest, parts: [] };
  cacheMap.set(obj, result);
  return result;
} 

export const destructibles: Destructible[] = [
  ...rock({
    subtype: 'rock',
    id: ['rock4_coast', 'rock4_coast_frac'],
    grow: itemGrow({
      locations: ['Meadows', 'BlackForest', 'Ashlands', 'DeepNorth', 'Mistlands'],
      altitude: [-0.5, -30],
      abundance: 1,
      num: [3, 3],
      group: [3, 3],
    }),
    children: 132,
    hp: 50,
    drop: singleDrop('Stone', 4, 8),
  }),
  {
    type: 'destructible',
    subtype: 'misc',
    id: 'beehive',
    tier: 1,
    grow: itemGrow({
      locations: ['WoodHouse'],
      num: [0, 0.1],
    }),
    hp: 50,
    // idle: 4 poison, 3 radius, every second
    // on hit: 10 poison, 4 radius, every second, 5 seconds
    damageModifiers: {
      ...allNormal,
      fire: 'weak',
    },
    minToolTier: 0,
    parts: [],
    drop: [{
      num: [2, 2],
      oneOfEach: true,
      options: [
        { weight: 1, item: 'QueenBee' },
        { weight: 1, item: 'Honey', num: [1, 3] },
      ]
    }],
  },
  {
    type: 'destructible',
    subtype: 'tree',
    id: 'beech_small',
    group: 'beech',
    tier: 0,
    grow: itemGrow({
      locations: ['Meadows'],
      tilt: [0, 30],
      num: [160, 200],
      // double of 2 variations: Beech_small1, Beech_small2
      // num: 80, inForest: [0, 1]
      // num: 100, inForest: [1.1, 1.15]
      inForest: [0, 1.15],
    }),
    hp: 20,
    damageModifiers: allNormal, // ???
    minToolTier: 0,
    parts: [],
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
    }, singleDrop('Wood', 10, 10)],
  }),
  {
    type: 'destructible',
    subtype: 'tree',
    id: 'FirTree_oldLog',
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
    hp: 40,
    damageModifiers: chopOnly,
    minToolTier: 0,
    parts: [],
    drop: [singleDrop('Wood', 5, 7)],
  },
  {
    type: 'destructible',
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
    hp: 40,
    damageModifiers: chopOnly,
    minToolTier: 0,
    parts: [],
    drop: [{
      num: [4, 5],
      options: [
        { weight: 10, item: 'Wood' },
        { weight: 1, item: 'FirCone' },
        { weight: 1, item: 'Resin' },
      ],
    }],
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
    }, singleDrop('Wood', 10, 10)],
  }),
  ...tree({
    id: ['Birch1', 'BirchStub', 'Birch_log', 'Birch_log_half'],
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
      { // Birch{1,2}_aut
        locations: ['Plains'],
        altitude: [0.1, 1000],
        tilt: [0, 30],
        num: [40, 40], // type1: 30, type2: 10
        inForest: [0, 0.8],
      },
    ),
    hp: [80, 60, 60],
    drop: [{
      chance: 0.3,
      num: [1, 1],
      options: [{ weight: 1, item: 'Resin' }],
    }, {
      num: [10, 10],
      options: [
        { item: 'Wood' },
        { item: 'FineWood' },
      ],
    }],
  }),
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
    drop: [emptyDrop, {
      num: [25, 25],
      options: [
        { item: 'Wood' },
        { item: 'FineWood' },
      ],
    }],
  }),
  ...tree({
    id: ['Pinetree_01', 'Pinetree_01_Stub', 'Pinetree_log', 'PineTree_log_half'],
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
  }),
  ...treeSimpler({
    id: ['SwampTree1', 'SwampTree1_Stub', 'SwampTree_log'],
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
  {
    id: 'SwampTree2',
    subtype: 'tree',
    type: 'destructible',
    tier: 3,
    minToolTier: 0,
    grow: itemGrow({
      locations: ['Swamp'],
      altitude: [-0.5, 1000],
      tilt: [0, 35],
      num: [10, 20],
    }),
    hp: Infinity,
    damageModifiers: allImmune,
    parts: [],
    drop: [],
  },
  ...rock({
    subtype: 'rock',
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
    subtype: 'misc',
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
    children: 132,
    drop: {
      num: [2, 4],
      options: [
        { item: 'Stone', weight: 2 },
        { item: 'CopperOre' },
      ],
    },
  }),
  {
    id: 'MineRock_Tin',
    subtype: 'misc',
    type: 'destructible',
    tier: 2,
    minToolTier: 0,
    grow: itemGrow({
      locations: ['BlackForest'],
      altitude: [-0.6, 1.5],
      num: [20, 20],
      offset: -0.5,
    }),
    hp: 30,
    damageModifiers: pickOnly,
    parts: [],
    drop: [{
      num: [3, 4],
      options: [{ item: 'TinOre' }],
    }],
  },
  // SWAMP
  {
    id: 'StatueEvil',
    subtype: 'misc',
    type: 'destructible',
    tier: 3,
    grow: itemGrow({
      locations: ['Swamp'],
      num: [2, 2],
      altitude: [0, 1000],
      tilt: [0, 20],
    }),
    hp: Infinity,
    damageModifiers: allImmune,
    minToolTier: 0,
    parts: [],
    drop: [],
  },
  ...rock({
    subtype: 'misc',
    id: ['mudpile2', 'mudpile2_frac'],
    tier: 3,
    grow: itemGrow({
      locations: ['SunkenCrypt'],
      num: [1, 3],
    }),
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
  ...rock({ // beacon: 25
    subtype: 'misc',
    id: ['mudpile_beacon', 'mudpile_frac'],
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
  }),
  {
    id: 'GuckSack_small',
    subtype: 'misc',
    type: 'destructible',
    tier: 3,
    grow: itemGrow({
      locations: ['InfestedTree'],
      num: [0, 6], // 6 with 2/3 prob
    }),
    hp: 30,
    damageModifiers: chopPickOnly,
    minToolTier: 0,
    parts: [],
    drop: [singleDrop('Guck', 1, 2)],
  },
  {
    id: 'GuckSack',
    subtype: 'misc',
    type: 'destructible',
    tier: 3,
    grow: itemGrow({
      locations: ['InfestedTree'],
      num: [0, 2], // 2 with 1/4 prob
    }),
    hp: 30,
    damageModifiers: chopPickOnly,
    minToolTier: 0,
    parts: [],
    drop: [singleDrop('Guck', 4, 7)],
  },
  {
    id: 'Rock_4_plains',
    type: 'destructible',
    subtype: 'rock',
    tier: 1,
    grow: itemGrow({
      locations: ['Plains'],
      altitude: [-10, 1000],
      num: [5, 30],
    }),
    hp: 30,
    damageModifiers: pickOnly,
    minToolTier: 0,
    parts: [],
    drop: [singleDrop('Stone', 3, 6)],
  },
  {
    id: 'Rock_4',
    type: 'destructible',
    subtype: 'rock',
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
    hp: 30,
    damageModifiers: pickOnly,
    minToolTier: 0,
    parts: [],
    drop: [singleDrop('Stone', 3, 6)],
  },
  ...rock({
    subtype: 'rock',
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
  // MOUNTAIN
  {
    id: 'MineRock_Obsidian',
    subtype: 'misc',
    type: 'destructible',
    tier: 4,
    grow: itemGrow({
      locations: ['Mountain'],
      altitude: [100, 1000],
      num: [10, 15],
    }),
    hp: 30,
    damageModifiers: pickOnly,
    minToolTier: 2,
    parts: [],
    drop: [singleDrop('Obsidian', 5, 8)],
  },
  ...rock({
    subtype: 'misc',
    // beacon: 50
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
  }),
  ...rock({
    subtype: 'rock',
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
    subtype: 'rock',
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
    subtype: 'rock',
    id: ['rock3_mountain', 'rock3_mountain_frac'],
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
    subtype: 'rock',
    id: ['rock4_heath', 'rock4_heath_frac'],
    grow: itemGrow({
      locations: ['Plains'],
      altitude: [4, 1000],
      tilt: [15, 45],
      num: [4, 10],
    }),
    hp: 50,
    children: 122,
    drop: singleDrop('Stone', 4, 8),
  }),
  ...rock({
    subtype: 'rock',
    id: ['rock2_heath', 'rock2_heath_frac'],
    grow: itemGrow({
      locations: ['Plains'],
      altitude: [0, 1000],
      num: [0, 1],
    }),
    hp: 50,
    children: 122,
    drop: singleDrop('Stone', 4, 8),
  }),
  ...rock({
    subtype: 'rock',
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
    id: 'stubbe',
    type: 'destructible',
    subtype: 'tree',
    tier: 1,
    minToolTier: 0,
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
    hp: 40,
    damageModifiers: chopOnly,
    parts: [],
    drop: [singleDrop('Wood', 3, 4)],
  },
  {
    id: 'Leviathan',
    type: 'destructible',
    subtype: 'misc',
    tier: 3,
    grow: itemGrow({
      locations: ['Ocean'],
      altitude: [-1000, -30],
      onSurface: true,
      num: [0, 0.01],
    }),
    hp: Infinity,
    damageModifiers: pickOnly,
    minToolTier: 0,
    parts: [{ id: 'Barnacle', num: 21 }],
    drop: [],
  },
  {
    id: 'Barnacle',
    type: 'destructible',
    subtype: 'misc',
    tier: 3,
    grow: itemGrow({
      locations: ['Leviathan'],
      abundance: 1,
      num: [21, 21],
    }),
    hp: 40,
    damageModifiers: pickOnly,
    minToolTier: 0,
    parts: [],
    drop: [singleDrop('Chitin', 3, 4)],
  },
  // DEEP NORTHH
  {
    id: 'ice1',
    type: 'destructible',
    subtype: 'misc',
    tier: 6,
    grow: itemGrow({
      locations: ['DeepNorth'],
      altitude: [-1000, -1],
      onSurface: true,
      num: [10, 20],
    }),
    hp: Infinity,
    damageModifiers: pickOnly,
    minToolTier: 0,
    parts: [],
    drop: [],
  },
  {
    id: 'ice_rock1',
    type: 'destructible',
    subtype: 'rock',
    tier: 6,
    grow: itemGrow({
      locations: ['DeepNorth'],
      altitude: [-1000, -1],
      onSurface: true,
      num: [0, 1],
      offset: -2,
    }),
    hp: Infinity,
    damageModifiers: pickOnly,
    minToolTier: 0,
    parts: [],
    drop: [],
  },
  // MISTLANDS
  {
    type: 'destructible',
    subtype: 'misc',
    id: 'FirTree_small_dead',
    group: 'fir',
    tier: 0,
    grow: itemGrow({
      locations: ['Swamp'],
      altitude: [0.5, 1000],
      tilt: [0, 25],
      num: [60, 60],
    }, {
      locations: ['Mistlands'],
      altitude: [0, 1000],
      tilt: [0, 30],
      num: [30, 30],
    }),
    hp: 40,
    damageModifiers: chopOnly,
    minToolTier: 0,
    parts: [],
    drop: [singleDrop('Wood', 4, 5)],
  },
  {
    id: 'vertical_web',
    type: 'destructible',
    subtype: 'misc',
    tier: 6,
    grow: itemGrow({
      locations: ['Mistlands'],
      num: [10, 10],
      tilt: [0, 30],
    }),
    hp: Infinity,
    damageModifiers: allImmune,
    minToolTier: 0,
    parts: [],
    drop: [],
  },
  {
    id: 'horizontal_web',
    type: 'destructible',
    subtype: 'misc',
    tier: 6,
    grow: itemGrow({
      locations: ['Mistlands'],
      num: [10, 10],
      tilt: [0, 30],
    }),
    hp: Infinity,
    damageModifiers: allImmune,
    minToolTier: 0,
    parts: [],
    drop: [],
  },
  {
    id: 'tunnel_web',
    type: 'destructible',
    subtype: 'misc',
    tier: 6,
    grow: itemGrow({
      locations: ['Mistlands'],
      num: [5, 5],
      tilt: [0, 30],
    }),
    hp: Infinity,
    damageModifiers: allImmune,
    minToolTier: 0,
    parts: [],
    drop: [],
  },
  {
    id: 'Skull1',
    type: 'destructible',
    subtype: 'misc',
    tier: 6,
    grow: itemGrow({
      locations: ['Mistlands'],
      num: [20, 20],
      tilt: [0, 45],
    }),
    hp: Infinity,
    damageModifiers: allImmune,
    minToolTier: 0,
    parts: [],
    drop: [],
  },
  {
    id: 'Skull2',
    type: 'destructible',
    subtype: 'misc',
    tier: 6,
    grow: itemGrow({
      locations: ['Mistlands'],
      num: [0, 3],
      tilt: [0, 45],
    }),
    hp: Infinity,
    damageModifiers: allImmune,
    minToolTier: 0,
    parts: [],
    drop: [],
  },
];
// SwampTree2_Darkland, HugeRoot1

/*
# any log2
- dmg: 50 blunt, 30 chop
*/
