import { singleDrop } from '../model/game';
import {
  DamageModifiers,
  Destructible,
  EntityGroup,
  EntityId,
  GeneralDrop,
  itemGrow,
  ItemGrow,
  mods,
  PhysicalObject,
  Plantable,
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
  group,
  tier,
  minToolTier,
  grow,
  hp: [baseHp, logHp, logHalfHp],
  drop: [baseDrop, chunkDrop],
  plant,
}: {
  id: [EntityId, EntityId, EntityId, EntityId];
  group?: EntityGroup;
  tier: number;
  minToolTier: number;
  grow: ItemGrow[];
  hp: [number, number, number];
  drop: [GeneralDrop, GeneralDrop];
  plant?: Plantable;
}): PhysicalObject[] {
  return [
    {
      type: 'object',
      subtype: 'tree',
      tags: ['plant', 'tree'],
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
      plant,
    },
    {
      type: 'object',
      subtype: 'tree',
      id: stubId,
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
      subtype: 'tree',
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
    },
    {
      type: 'object',
      subtype: 'tree',
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
}): PhysicalObject[] {
  return [
    {
      type: 'object',
      subtype: 'tree',
      tags: ['plant', 'tree'],
      id: baseId,
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
      subtype: 'tree',
      id: stubId,
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
      subtype: 'tree',
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
  tier = 1,
  minToolTier = 0,
  grow,
  children,
  hp: fracHp,
  drop: fracDrop,
}: {
  subtype?: PhysicalObject['subtype'],
  id: [EntityId, EntityId];
  tier?: number;
  minToolTier?: number;
  grow: ItemGrow[];
  children: number;
  hp: number;
  drop: GeneralDrop;
}): PhysicalObject[] {
  return [
    {
      type: 'object',
      subtype,
      id: baseId,
      tier,
      grow,
      Destructible: {
        hp: 1,
        damageModifiers: pickOnly,
        minToolTier,
        parts: [{ id: fracId, num: children }],
      },
      drop: [],
    },
    {
      type: 'object',
      subtype: 'rock',
      id: fracId,
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
    result.drop.push(...(destrChild.drop ?? []).map(d => ({ ...d, num: [d.num[0] * num, d.num[1] * num] as [number, number] })));
  }
  
  cacheMap.set(obj, result);
  return result;
} 

export const objects: PhysicalObject[] = [
  {
    type: 'object',
    subtype: 'plant',
    id: 'sapling_carrot',
    components: ['Pickable', 'Plant'],
    tier: 2,
    plant: {
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
    id: 'SeedCarrot',
    components: ['Pickable', 'Plant'],
    tier: 2,
    plant: {
      subtype: 'vegetable',
      plantedWith: 'Carrot',
      growTime: [4000, 5000],
      cultivatedGround: true,
      destroyUnhealthy: true,
      freeSpaceRadius: 0.5,
      biomes: ['Meadows', 'BlackForest', 'Plains'],
    },
    drop: [singleDrop('CarrotSeeds', 3)],
  },
  {
    type: 'object',
    subtype: 'plant',
    id: 'sapling_turnip',
    components: ['Pickable', 'Plant'],
    tier: 3,
    plant: {
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
    id: 'SeedTurnip',
    components: ['Pickable', 'Plant'],
    tier: 3,
    plant: {
      subtype: 'vegetable',
      plantedWith: 'Turnip',
      growTime: [4000, 5000],
      cultivatedGround: true,
      destroyUnhealthy: true,
      freeSpaceRadius: 0.5,
      biomes: ['Meadows', 'BlackForest', 'Swamp', 'Plains'],
    },
    drop: [singleDrop('TurnipSeeds', 3)],
  },
  {
    type: 'object',
    subtype: 'plant',
    id: 'sapling_onion',
    components: ['Pickable', 'Plant'],
    tier: 4,
    plant: {
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
    id: 'SeedOnion',
    components: ['Pickable', 'Plant'],
    tier: 4,
    plant: {
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
    id: 'sapling_barley',
    components: ['Pickable', 'Plant'],
    tier: 5,
    plant: {
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
    id: 'sapling_flax',
    components: ['Pickable', 'Plant'],
    tier: 5,
    plant: {
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
  ...rock({
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
    type: 'object',
    subtype: 'misc',
    id: 'beehive',
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
      oneOfEach: true,
      options: [
        { item: 'QueenBee' },
        { item: 'Honey', num: [1, 3] },
      ]
    }],
  },
  {
    type: 'object',
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
    plant: {
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
    plant: {
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
    }, {
      locations: ['Mistlands'],
      altitude: [0, 1000],
      tilt: [0, 30],
      num: [30, 30],
    }),
    Destructible: {
      hp: 40,
      damageModifiers: chopOnly,
      minToolTier: 0,
      parts: [],
    },
    drop: [singleDrop('Wood', 4, 5)],
  },
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
    plant: {
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
    plant: {
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
    // tags: ['plant', 'tree'],
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
    plant: {
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
    tier: 2,
    grow: [],
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
    drop: [singleDrop('AncientSeed')],
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
    id: 'barrel',
    tier: 2,
    Destructible: {
      minToolTier: 0,
      hp: 10,
      damageModifiers: mods([0, 0, 1, 2, 0, 0, 0, 0, 3, 3]),
      parts: [],
    },
    drop: [{
      oneOfEach: true,
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
  ...rock({
    subtype: 'ore',
    id: ['mudpile2', 'mudpile2_frac'],
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
  ...rock({ // beacon: 25
    subtype: 'ore',
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
    type: 'object',
    subtype: 'misc',
    id: 'GuckSack_small',
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
    subtype: 'misc',
    id: 'Spawner_DraugrPile',
    tier: 2,
    grow: [],
    Destructible: {
      minToolTier: 0,
      hp: 100,
      damageModifiers: draugrPileModifiers,
      parts: [],
    },
    drop: [singleDrop('AncientSeed')],
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
    subtype: 'rock',
    id: 'marker',
    tier: 4,
    grow: [],
    Destructible: {
      hp: 30,
      damageModifiers: { ...pickOnly, lightning: 'normal' },
      minToolTier: 0,
      parts: [],
    },
    drop: [singleDrop('Stone', 3, 6)],
  },
  {
    type: 'object',
    subtype: 'misc',
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
    // beacon: 50
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
    components: ['Pickable'],
    tier: 5,
    grow: [],
    drop: [singleDrop('Tar', 15)],
  },
  {
    type: 'object',
    subtype: 'misc',
    id: 'Pickable_Tar',
    components: ['Pickable'],
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
  // DEEP NORTHH
  {
    type: 'object',
    subtype: 'indestructible',
    id: 'ice1',
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
  // MISTLANDS
  {
    type: 'object',
    subtype: 'indestructible',
    id: 'vertical_web',
    tier: 6,
    grow: itemGrow({
      locations: ['Mistlands'],
      num: [10, 10],
      tilt: [0, 30],
    }),
  },
  {
    type: 'object',
    subtype: 'indestructible',
    id: 'horizontal_web',
    tier: 6,
    grow: itemGrow({
      locations: ['Mistlands'],
      num: [10, 10],
      tilt: [0, 30],
    }),
  },
  {
    type: 'object',
    subtype: 'indestructible',
    id: 'tunnel_web',
    tier: 6,
    grow: itemGrow({
      locations: ['Mistlands'],
      num: [5, 5],
      tilt: [0, 30],
    }),
  },
  {
    type: 'object',
    subtype: 'indestructible',
    id: 'Skull1',
    tier: 6,
    grow: itemGrow({
      locations: ['Mistlands'],
      num: [20, 20],
      tilt: [0, 45],
    }),
  },
  {
    type: 'object',
    subtype: 'indestructible',
    id: 'Skull2',
    tier: 6,
    grow: itemGrow({
      locations: ['Mistlands'],
      num: [0, 3],
      tilt: [0, 45],
    }),
  },
  {
    type: 'object',
    subtype: 'ore',
    id: 'MineRock_Meteorite',
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
    subtype: 'indestructible',
    id: 'Vegvisir',
    components: ['Vegvisir'],
    tier: 0,
  },
];

for (const obj of objects) {
  if (obj.subtype !== 'indestructible') {
    if (!obj.components) obj.components = [];
  }
}

// SwampTree2_Darkland, HugeRoot1

/*
# any log2
- dmg: 50 blunt, 30 chop
*/
