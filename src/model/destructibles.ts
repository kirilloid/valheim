import type {
  Biome,
  DamageModifiers,
  Destructible,
  EntityId,
  GameLocationId,
  GeneralDrop,
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
  poison: 'normal',
  spirit: 'normal',
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

function tree({
  id: [baseId, stubId, logId, logHalfId],
  tiers: [tier, minToolTier],
  locations,
  hp: [baseHp, logHp, logHalfHp],
  drop: [baseDrop, chunkDrop],
}: {
  id: [string, string, string, string];
  tiers: [number, number];
  locations: (Biome | GameLocationId)[];
  hp: [number, number, number];
  drop: [GeneralDrop, GeneralDrop];
}): Destructible[] {
  return [
    {
      type: 'destructible',
      tags: ['plant', 'tree'],
      id: baseId,
      tier,
      locations,
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
      id: stubId,
      tier,
      locations: [],
      hp: 80,
      damageModifiers: chopOnly,
      minToolTier,
      parts: [],
      drop: [{
        num: [2, 2],
        options: [{ weight: 1, item: 'Wood' }],
      }],
    },
    {
      type: 'destructible',
      id: logId,
      tier,
      locations: [],
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
      id: logHalfId,
      tier,
      locations: [],
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
  tiers: [tier, minToolTier],
  locations,
  hp: [baseHp, logHp],
  drop: [baseDrop, chunkDrop],
}: {
  id: [string, string, string];
  tiers: [number, number];
  locations: (Biome | GameLocationId)[];
  hp: [number, number];
  drop: [GeneralDrop, GeneralDrop];
}): Destructible[] {
  return [
    {
      type: 'destructible',
      tags: ['plant', 'tree'],
      id: baseId,
      tier,
      locations,
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
      id: stubId,
      tier,
      locations: [],
      hp: 80,
      damageModifiers: chopOnly,
      minToolTier,
      parts: [],
      drop: [{
        num: [2, 2],
        options: [{ weight: 1, item: 'Wood' }],
      }],
    },
    {
      type: 'destructible',
      id: logId,
      tier,
      locations: [],
      hp: logHp,
      damageModifiers: chopOnly,
      minToolTier,
      parts: [],
      drop: [chunkDrop],
    },
  ];
};

function rock({
  id: [baseId, fracId],
  tiers: [tier, minToolTier],
  locations,
  children,
  hp: fracHp,
  drop: fracDrop,
}: {
  id: [string, string];
  tiers: [number, number];
  locations: (Biome | GameLocationId)[];
  children: number;
  hp: number;
  drop: GeneralDrop;
}): Destructible[] {
  return [
    {
      type: 'destructible',
      id: baseId,
      tier,
      locations,
      hp: 1,
      damageModifiers: pickOnly,
      minToolTier,
      parts: [{ id: fracId, num: children }],
      drop: [],
    },
    {
      type: 'destructible',
      id: fracId,
      tier,
      locations: [],
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
  {
    type: 'destructible',
    id: 'beehive',
    tier: 1,
    locations: ['WoodHouse'],
    hp: 50,
    // idle: 4 poison, 3 radius, every second
    // on hit: 10 poison, 4 radius, every second, 5 seconds
    damageModifiers: {
      ...allNormal,
      fire: 'weak',
      spirit: 'immune',
      poison: 'immune',    
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
    id: 'beech_small',
    tier: 0,
    locations: ['Meadows'],
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
    tiers: [1, 0],
    locations: ['Meadows'],
    hp: [80, 60, 60],
    drop: [{
      chance: 0.5,
      num: [2, 2],
      options: [
        { weight: 4, item: 'BeechSeeds', num: [2, 3] },
        { weight: 1, item: 'Feathers', num: [1, 2] },
        { weight: 1, item: 'Resin', num: [1, 2] },
      ]
    }, {
      num: [10, 10],
      options: [{ item: 'Wood' }],
    }],
  }),
  {
    type: 'destructible',
    id: 'FirTree_small',
    tier: 0,
    locations: ['BlackForest', 'Swamp', 'Mountain', 'Mistlands'],
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
    tiers: [1, 0],
    locations: ['BlackForest', 'Swamp', 'Mountain', 'Mistlands'],
    hp: [80, 60, 40],
    drop: [{
      chance: 0.5,
      num: [1, 2],
      options: [
        { weight: 4, item: 'FirCone' },
        { weight: 1, item: 'Feathers' },
        { weight: 1, item: 'Resin' },
      ]
    }, {
      num: [10, 10],
      options: [{ item: 'Wood' }],
    }],
  }),
  ...tree({
    id: ['Birch1', 'BirchStub', 'Birch_log', 'Birch_log_half'],
    tiers: [2, 2],
    locations: ['Meadows', 'Plains'],
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
    tiers: [2, 2],
    locations: ['Meadows'],
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
    tiers: [2, 0],
    locations: ['BlackForest'],
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
    tiers: [3, 0],
    locations: ['Swamp'],
    hp: [80, 60],
    drop: [emptyDrop, {
      num: [10, 10],
      options: [
        { item: 'Wood' },
        { item: 'ElderBark' },
      ],
    }],
  }),
  ...rock({
    id: ['rock4_copper', 'rock4_copper_frac'],
    tiers: [2, 0],
    locations: ['BlackForest'],
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
    type: 'destructible',
    tier: 2,
    locations: ['BlackForest'],
    hp: 30,
    damageModifiers: pickOnly,
    minToolTier: 0,
    parts: [],
    drop: [{
      num: [3, 4],
      options: [{ item: 'TinOre' }],
    }],
  },
  ...rock({
    id: ['mudpile2', 'mudpile2_frac'],
    tiers: [2, 0],
    locations: ['Swamp'],
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
  {
    id: 'Barnacle',
    type: 'destructible',
    tier: 3,
    locations: ['Leviathan'],
    hp: 40,
    damageModifiers: pickOnly,
    minToolTier: 0,
    parts: [],
    drop: [{
      num: [3, 4],
      options: [{ item: 'Chitin' }],
    }],
  },
  {
    id: 'GuckSack_small',
    type: 'destructible',
    tier: 3,
    locations: ['InfestedTree'],
    hp: 30,
    damageModifiers: chopPickOnly,
    minToolTier: 0,
    parts: [],
    drop: [{
      num: [1, 2],
      options: [{ item: 'Guck' }],
    }],
  },
  {
    id: 'GuckSack',
    type: 'destructible',
    tier: 3,
    locations: ['InfestedTree'],
    hp: 30,
    damageModifiers: chopPickOnly,
    minToolTier: 0,
    parts: [],
    drop: [{
      num: [4, 7],
      options: [{ item: 'Guck' }],
    }],
  },
  ...rock({
    id: ['silvervein', 'silvervein_frac'],
    tiers: [4, 2],
    locations: ['Mountain'],
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
    id: ['rock2_mountain', 'rock2_mountain_frac'],
    tiers: [0, 0],
    locations: ['Mountain'],
    hp: 50,
    children: 122,
    drop: {
      num: [4, 8],
      options: [
        { item: 'Stone' },
      ]
    },
  }),
  ...rock({
    id: ['rock2_heath', 'rock2_heath_frac'],
    tiers: [0, 0],
    locations: ['Plains'],
    hp: 50,
    children: 122,
    drop: {
      num: [4, 8],
      options: [
        { item: 'Stone' },
      ]
    },
  }),
];

/*
# any log2
- dmg: 50 blunt, 30 chop
*/
