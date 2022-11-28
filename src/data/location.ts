import type {
  Biome,
  BiomeConfig,
  Creature,
  DungeonGenConfig,
  EntityId,
  Fish,
  GameComponent,
  GameLocationId,
  LocationConfig,
  LocationItem,
  Pair,
} from '../types';

import { locItem } from '../model/game';
import { DungeonRoomsConfig, forestcrypt, frostCaves, sunkencrypt } from '../data/rooms';

import { fullDestructible, objects } from './objects';
import { data } from './itemDB';
import { resources } from './resources';
import {
  Distribution, DropDist,
  mergeDist, power, powerDist, scaleDist,
  sum, sumDist, gatherDrop, mul, weightedAdd
} from '../model/dist';
import { mapValues } from '../model/utils';
import { creatures } from './creatures';
import { fishes } from './fish';

export const locationBiomes: Record<GameLocationId, Biome> = {};

export const locationToBiome = (loc: GameLocationId | Biome) => (locationBiomes[loc as GameLocationId] ?? loc) as Biome;

function biome(emoji: string, id: Biome, tier: number, active: boolean): BiomeConfig {
  return {
    id,
    active,
    tier,
    emoji,
    destructibles: new Set(),
    creatures: new Set(),
    locations: [],
    resources: new Set(),
  };
}

export const biomes: BiomeConfig[] = [
  biome('⛳', 'Meadows', 1, true),
  biome('🌲', 'BlackForest', 2, true),
  biome('🐸', 'Swamp', 3, true),
  biome('⛰️', 'Mountain', 4, true),
  biome('🍂', 'Plains', 5, true),
  biome('🌊', 'Ocean', 3, true),
  biome('🌫', 'Mistlands', 6, true),
  biome('✨', 'Ashlands', 7, false),
  biome('🧊', 'DeepNorth', 8, false),
];

const biomeMap = Object.fromEntries(biomes.map(b => [b.id, b])) as Record<Biome, BiomeConfig>;

export const biomeTiers = Object.fromEntries(biomes.map(b => [b.id as Biome, b.tier]));

export function area(id: Biome | GameLocationId): BiomeConfig | LocationConfig | undefined {
  return biomes.find(b => b.id === id)
      ?? locationsTypeIdMap.get(id)
}

function loc(
  tier: number,
  id: GameLocationId,
  biomes: Biome[],
  {
    type = 'misc',
    components,
    quantity,
    biomeArea = 7,
    prioritized = false,
    centerFirst = false,
    unique = false,
    group = '',
    minApart = 0,
    iconAlways = false,
    iconPlaced = false,
    randomRotation = true,
    slopeRotation = false,
    terrainDelta = [0, 3],
    inForest = null,
    minDistance = 0,
    maxDistance = 10000,
    minAlt = 1,
    maxAlt = 1000,
    radius,
    items,
    needsKey,
    dungeon,
    customMusic,
  }: {
    type?: LocationConfig['type'],
    components?: GameComponent[],
    quantity: number,
    biomeArea?: number,
    prioritized?: boolean,
    centerFirst?: boolean,
    unique?: boolean,
    group?: string,
    minApart?: number,
    iconAlways?: boolean,
    iconPlaced?: boolean,
    randomRotation?: boolean,
    slopeRotation?: boolean,
    terrainDelta?: Pair<number>,
    inForest?: Pair<number> | null,
    minDistance?: number,
    maxDistance?: number,
    minAlt?: number,
    maxAlt?: number,
    radius: Pair<number>,
    customMusic?: string,
    items: LocationItem[],
    needsKey?: EntityId,
    dungeon?: DungeonRoomsConfig,
  },
  typeId = id,
): LocationConfig {
  if (type === 'runestone') {
    components = ['Runestone'];
  }
  return {
    id: id,
    typeId: typeId,
    components,
    tier,
    quantity,
    biomes,
    biomeArea,
    prioritized,
    centerFirst,
    unique,
    group,
    type,
    minApart,
    iconAlways,
    iconPlaced,
    randomRotation,
    slopeRotation,
    terrainDelta,
    inForest,
    distance: [minDistance, maxDistance],
    altitude: [minAlt, maxAlt],
    radius,

    destructibles: {},
    creatures: {},
    resources: {},
    customMusic,
    items,
    needsKey,
    dungeon,
  };
}

const prioritized = true;
const centerFirst = true;
const unique = true;
const iconAlways = true;
const iconPlaced = true;
const slopeRotation = true;
const randomRotation = true;

export const locations: LocationConfig[] = [
  loc(
    1, 'StoneCircle', ['Meadows'],
    { quantity: 25, minApart: 200, radius: [20, 16], items: [] },
  ),
  // meadows
  loc(
    1, 'StartTemple', ['Meadows'],
    { biomeArea: 2, quantity: 1, prioritized, centerFirst, iconAlways, inForest: [1, 5], minAlt: 3, radius: [20, 25],
      items: [
        locItem('BossStone_Bonemass'),
        locItem('BossStone_DragonQueen'),
        locItem('BossStone_Eikthyr'),
        locItem('BossStone_TheElder'),
        locItem('BossStone_Yagluth'),
        locItem('Vegvisir'), // Vegvisir_Eikthyr
        locItem('Raspberry', 1, 2),
        locItem('Mushroom', 1, 2),
        locItem('Wood', 1, 2),
        locItem('Wood', 0.75, 2),
        locItem('Stone', 0.75, 2),
        locItem('Stone', 0.125, 2),
        locItem('Stone', 1, 3),
      ],
    },
  ),
  loc(
    1, 'Eikthyrnir', ['Meadows'],
    { type: 'altar',
      biomeArea: 2, quantity: 3, prioritized, maxDistance: 1000, radius: [20, 10],
      items: [
        locItem('StatueDeer'),
        locItem('Eikthyr'),
      ],
    },
  ),
  loc(
    5, 'GoblinKing', ['Plains'],
    { type: 'altar',
      biomeArea: 2, quantity: 4, prioritized, minApart: 3000, terrainDelta: [0, 4], radius: [20, 32],
      items: [locItem('GoblinKing')]
    },
  ),
  loc(
    2, 'Greydwarf_camp1', ['BlackForest'],
    { biomeArea: 2, quantity: 300, minApart: 128, radius: [20, 10],
      customMusic: 'Music_GreydwarfCamp',
      items: [
        locItem('Greydwarf_Root', 1, 3),        
        locItem('Spawner_GreydwarfNest'),
      ]
    },
    'Greydwarf_camp',
  ),
  // Greydwarf_camp2: disabled
  // Greydwarf_camp3: disabled
  loc(
    2, 'Runestone_Greydwarfs', ['BlackForest'],
    { type: 'runestone',
      quantity: 50, group: 'Runestones', minApart: 128, maxDistance: 2000, radius: [20, 8],
      customMusic: 'Music_GreydwarfCamp',
      items: [locItem('FirTree_oldLog', 1, 4)] }
  ),
  loc(
    3, 'Grave1', ['Swamp'],
    { biomeArea: 6, quantity: 200, minAlt: 0.5, radius: [20, 12.04],
      items: [
        locItem('TreasureChest_swamp', 0.5),
        locItem('Spawner_DraugrPile', 1, 2),
        locItem('BonePileSpawner', 1, 1),
      ],
    },
    'Grave',
  ),
  loc(
    3, 'SwampRuin1', ['Swamp'],
    { biomeArea: 6, quantity: 50, minApart: 512, radius: [20, 12], minAlt: 0,
      items: [
        locItem('Vegvisir', 0.3), // Vegvisir_Bonemass
        locItem('TreasureChest_swamp', 0.251),
        locItem('Draugr', 0.5, 2),
        locItem('Draugr_Elite', 0.321),
        locItem('Spawner_DragurPile', 0.321),
        locItem('Crow', 1, 2),
      ],
    },
    'SwampRuin',
  ),
  loc(
    3, 'SwampRuin2', ['Swamp'],
    { biomeArea: 6, quantity: 50, minApart: 512, radius: [20, 10], minAlt: 0,
      items: [
        locItem('Vegvisir', 0.3), // Vegvisir_Bonemass
        locItem('TreasureChest_swamp', 0.251),
        locItem('Draugr', 0.5, 2),
        locItem('Draugr_Elite', 0.321),
        locItem('Spawner_DragurPile', 0.321),
        locItem('piece_groundtorch_green'),
        locItem('Crow', 1, 2),
      ],
    },
    'SwampRuin',
  ),
  loc(
    3, 'FireHole', ['Swamp'],
    { biomeArea: 6, quantity: 200, minAlt: 0.5, radius: [20, 5],
      items: [
        locItem('Surtling', 1, 3), // Spawner_imp_respawn: once in 5 minutes
      ],
    }
  ),
  loc(
    3, 'Runestone_Draugr', ['Swamp'],
    { type: 'runestone',
      quantity: 50, group: 'Runestones', minApart: 128, minAlt: 0.5, radius: [20, 8],
      items: [
        locItem('Draugr', 1, 3),
        locItem('piece_groundtorch_green', 1, 2),
        // locItem('stone_wall_2x2', 1, 1),
      ]  
    }
  ),
  // Castle: disabled
  // Fort1: disabled
  // xmastree: disabled
  loc(
    2, 'GDKing', ['BlackForest'],
    { type: 'altar',
      biomeArea: 6, quantity: 4, prioritized, minApart: 3000, terrainDelta: [0, 5],
      minDistance: 1000, maxDistance: 7000, radius: [20, 25],
      items: [
        locItem('StatueSeed'),
        locItem('gd_king'),
      ],
    }
  ),
  loc(
    3, 'Bonemass', ['Swamp'],
    { type: 'altar',
      biomeArea: 6, quantity: 5, prioritized, minApart: 3000, terrainDelta: [0, 4],
      minDistance: 2000, minAlt: 0, maxAlt: 2, radius: [20, 19.79],
      items: [locItem('Bonemass')],
    }
  ),
  loc(
    7, 'Meteorite', ['Ashlands'],
    { quantity: 500, terrainDelta: [0, 4], radius: [20, 5.2],
      items: [
        locItem('MineRock_Meteorite', 1, 15),
        locItem('Surtling', 1, 4),
      ],
    }
  ),
  loc(
    2, 'Crypt2', ['BlackForest'],
    { type: 'dungeon', components: ['DungeonGenerator'],
      quantity: 200, minApart: 128, terrainDelta: [0, 2], radius: [21, 12],
      items: [locItem('Skeleton', 1, 3)],
      dungeon: forestcrypt, 
    },
    'Crypt',
  ),
  loc(
    2, 'Ruin1', ['BlackForest'],
    { quantity: 200, radius: [20, 10.7],
      customMusic: 'BlackForestLocationMusic',
      items: [
        locItem('Greydwarf', 1, 5),
        locItem('Greydwarf_Shaman', 1, 1),
        locItem('Crow', 1, 2),
        /*
        locItem('stone_wall_2x1', 1, 16),
        locItem([locItem('stone_wall_2x1', 1, 6)], 0.25),
        */
      ],
    },
    'RuinB',
  ),
  loc(
    2, 'Ruin2', ['BlackForest'],
    { quantity: 200, radius: [20, 9.89],
      customMusic: 'BlackForestLocationMusic',
      items: [
        locItem('Greydwarf_Elite', 0.2, 1),
        locItem('Greydwarf', 1, 5),
        locItem('Greydwarf', 0.2, 1),
        locItem('TreasureChest_blackforest', 0.3),
        locItem('barrel', 0.3),
        locItem('Vegvisir', 0.3), // Vegvisir_GDKing
        locItem('Crow', 1, 2),
        /*
        locItem('stone_wall', 1, 63),
        locItem('stone_arch', 1),
        locItem('wood_door', 1),
        locItem('piece_chair', 1),
        */
      ],
    },
    'RuinB',
  ),
  // Pillar 1: disabled
  // Pillar 2: disabled
  // StoneHouse1: disabled
  // StoneHouse1_heath: [quantity=0]
  // StoneHouse2_heath: [quantity=0]
  // StoneHouse5_heath: [quantity=0]
  // StoneHouse2: disabled
  loc(
    2, 'StoneHouse3', ['BlackForest'],
    { quantity: 200, radius: [20, 6],
      items: [
        locItem('Greydwarf'),
        locItem('TreasureChest_blackforest'),
      ],
    },
    'StoneHouse',
  ),
  loc(
    2, 'StoneHouse4', ['BlackForest'],
    { quantity: 200, radius: [20, 7],
      items: [
        locItem('Greydwarf', 0.5, 2),
      ],
    },
    'StoneHouse',
  ),
  // StoneHouse5: disabled
  loc(
    5, 'Ruin3', ['Plains'],
    { quantity: 50, group: 'Goblintower', minApart: 512, radius: [20, 10],
      items: [
        locItem('TreasureChest_heath'),
        locItem('Goblin', 1, 2),
      ],
    },
    'RuinP',
  ),
  // GoblinCamp1: disabled
  loc(
    5, 'GoblinCamp2', ['Plains'],
    { quantity: 200, minApart: 250, randomRotation: false, minAlt: 2, radius: [20, 30],
      customMusic: 'Music_FulingCamp',
      items: [
        locItem('TreasureChest_heath', 0.5, 3),
        locItem([locItem('Flax', 0.5, 10)], 0.3, 3),
        locItem([locItem('Barley', 0.5, 10)], 0.3, 3),
        locItem('GoblinTotem', 0.6, 3),
        locItem('Goblin', 0.5, 20),
        locItem('GoblinBrute', 0.75, 4),
        locItem('GoblinShaman', 0.75, 4),
      ]
    },
    'GoblinCamp',
  ),
  loc(
    5, 'StoneTower1', ['Plains'],
    { quantity: 50, group: 'Goblintower', minApart: 512, radius: [20, 14],
      customMusic: 'Music_FulingCamp',
      items: [
        locItem('Goblin', 0.54, 6),
        locItem('GoblinTotem', 1, 1),
        locItem([
          locItem('TreasureChest_heath', 1, 1),
          locItem('Goblin', 0.54, 3),
        ], 0.5, 1),
      ],
    },
    'StoneTower',
  ),
  // StoneTower2: disabled
  loc(
    5, 'StoneTower3', ['Plains'],
    { quantity: 50, group: 'Goblintower', minApart: 512, radius: [20, 14],
      customMusic: 'Music_FulingCamp',
      items: [
        locItem('Goblin', 0.54, 10),
        locItem([
          locItem('TreasureChest_heath', 1, 1),
          locItem('Goblin', 0.54, 2),
        ], 0.5, 1),
      ],
    },
    'StoneTower',
  ),
  // StoneTower4: disabled
  loc(
    5, 'StoneHenge1', ['Plains'],
    { quantity: 5, group: 'Stonehenge', minApart: 1000, minAlt: 5, radius: [20, 30],
      customMusic: 'Music_StoneHenge',
      items: [
        locItem([
          locItem('GoblinBrute', 0.5, 2),
          locItem('GoblinBrute', 1, 1),
          locItem('TreasureChest_heath_stone', 1, 1),
          // locItem('Rock_3', 1, 6),
        ], 0.5, 1),
        locItem('Vegvisir', 0.4), // Vegvisir_GoblinKing
        // locItem('Rock_3', 1, 6),
      ]
    },
    'StoneHengeL',
  ),
  loc(
    5, 'StoneHenge2', ['Plains'],
    { quantity: 5, group: 'Stonehenge', minApart: 1000, minAlt: 5, radius: [20, 30],
      customMusic: 'Music_StoneHenge',
      items: [
        locItem([
          locItem('GoblinBrute', 0.5, 2),
          locItem('GoblinBrute', 1, 1),
          locItem('TreasureChest_heath_stone', 1, 1),
        ], 0.5, 1),
      ],
    },
    'StoneHengeL',
  ),
  loc(
    5, 'StoneHenge3', ['Plains'],
    { quantity: 5, group: 'Stonehenge', minApart: 1000, minAlt: 5, radius: [20, 30],
      customMusic: 'Music_StoneHenge',
      items: [
        locItem([
          locItem('GoblinBrute', 0.5, 2),
          locItem('GoblinBrute', 1, 1),
          locItem('TreasureChest_heath_stone', 1, 1),
        ], 0.5, 1),
        locItem('Vegvisir', 0.4), // Vegvisir_GoblinKing
        // locItem([locItem('Rock_3', 1, 3)], 0.5),
        // locItem([locItem('Rock_3', 1, 5)], 0.5),
      ],
    },
    'StoneHengeL',
  ),
  loc(
    5, 'StoneHenge4', ['Plains'],
    { quantity: 5, group: 'Stonehenge', minApart: 1000, minAlt: 5, radius: [20, 30],
      customMusic: 'Music_StoneHenge',
      items: [
        locItem('GoblinBrute', 0.5, 2),
        locItem('Vegvisir', 0.4), // Vegvisir_GoblinKing
      ],
    },
    'StoneHengeL',
  ),
  loc(
    5, 'StoneHenge5', ['Plains'],
    { quantity: 20, group: 'Stonehenge', minApart: 500, minAlt: 2, radius: [20, 16],
      customMusic: 'Music_StoneHenge',
      items: [
        locItem([locItem('Goblin', 0.54, 3)], 0.75),
        locItem('Vegvisir', 0.4), // Vegvisir_GoblinKing
        // locItem([locItem('Rock_3', 1, 4)], 0.75),
        // locItem('Rock_3', 1, 4),
      ],
    },
    'StoneHengeS',
  ),
  loc(
    5, 'StoneHenge6', ['Plains'],
    { quantity: 20, group: 'Stonehenge', minApart: 500, minAlt: 2, radius: [20, 16],
      customMusic: 'Music_StoneHenge',
      items: [
        locItem([locItem('Rock_3', 1, 3)], 0.5),
        locItem([locItem('Rock_3', 1, 5)], 0.5),
      ],
    },
    'StoneHengeS',
  ),

  loc(
    1, 'WoodHouse1', ['Meadows'],
    { quantity: 20, terrainDelta: [0, 4], radius: [20, 8],
      customMusic: 'Music_MeadowsVillageFarm',
      items: [
        locItem('Beehive', 0.25),
        locItem('TreasureChest_meadows', 0.5),
      ],
    },
    'WoodHouse',
  ),
  loc(
    1, 'WoodHouse2', ['Meadows'],
    { quantity: 20, terrainDelta: [0, 4], radius: [20, 8],
      customMusic: 'Music_MeadowsVillageFarm',
      items: [
        locItem('Beehive', 0.25),
        locItem('TreasureChest_meadows', 0.5),
      ],
    },
    'WoodHouse',
  ),
  loc(
    1, 'WoodHouse3', ['Meadows'],
    { quantity: 20, terrainDelta: [0, 4], radius: [20, 10],
      customMusic: 'Music_MeadowsVillageFarm',
      items: [
        locItem('Beehive', 0.25),
      ],
    },
    'WoodHouse',
  ),
  loc(
    1, 'WoodHouse4', ['Meadows'],
    { quantity: 20, terrainDelta: [0, 4], radius: [20, 8],
      customMusic: 'Music_MeadowsVillageFarm',
      items: [
        locItem('Beehive', 0.25),
      ],
    },
    'WoodHouse',
  ),
  loc(
    1, 'WoodHouse5', ['Meadows'],
    { quantity: 20, terrainDelta: [0, 4], radius: [20, 8],
      customMusic: 'Music_MeadowsVillageFarm',
      items: [
        locItem('Beehive', 0.25),
      ],
    },
    'WoodHouse',
  ),
  loc(
    1, 'WoodHouse6', ['Meadows'],
    { quantity: 20, terrainDelta: [0, 4], radius: [20, 8],
      customMusic: 'Music_MeadowsVillageFarm',
      items: [
        locItem('Beehive', 0.25),
        locItem('TreasureChest_meadows', 1),
      ],
    },
    'WoodHouse',
  ),
  loc(
    1, 'WoodHouse7', ['Meadows'],
    { quantity: 20, terrainDelta: [0, 4], radius: [20, 8],
      customMusic: 'Music_MeadowsVillageFarm',
      items: [
        locItem('Beehive', 0.25),
        locItem('TreasureChest_meadows', 0.5),
      ],
    },
    'WoodHouse',
  ),
  loc(
    1, 'WoodHouse8', ['Meadows'],
    { quantity: 20, terrainDelta: [0, 4], radius: [20, 10],
      customMusic: 'Music_MeadowsVillageFarm',
      items: [],
    },
    'WoodHouse',
  ),
  loc(
    1, 'WoodHouse9', ['Meadows'],
    { quantity: 20, terrainDelta: [0, 4], radius: [20, 8],
      customMusic: 'Music_MeadowsVillageFarm',
      items: [
        locItem('Beehive', 0.25),
        locItem('TreasureChest_meadows', 0.5),
      ],
    },
    'WoodHouse',
  ),
  loc(
    1, 'WoodHouse10', ['Meadows'],
    { quantity: 20, terrainDelta: [0, 4], radius: [20, 8],
      customMusic: 'Music_MeadowsVillageFarm',
      items: [
        locItem('Beehive', 0.25),
        locItem('TreasureChest_meadows', 0.5),
      ],
    },
    'WoodHouse',
  ),
  loc(
    1, 'WoodHouse11', ['Meadows'],
    { quantity: 20, terrainDelta: [0, 4], radius: [20, 8],
      customMusic: 'Music_MeadowsVillageFarm',
      items: [
        locItem('Beehive', 0.25),
        locItem('TreasureChest_meadows', 0.5),
      ],
    },
    'WoodHouse',
  ),
  loc(
    1, 'WoodHouse12', ['Meadows'],
    { quantity: 20, terrainDelta: [0, 4], radius: [20, 6],
      customMusic: 'Music_MeadowsVillageFarm',
      items: [
        locItem('TreasureChest_meadows', 0.5),
      ],
    },
    'WoodHouse',
  ),
  loc(
    1, 'WoodHouse13', ['Meadows'],
    { quantity: 20, terrainDelta: [0, 4], radius: [20, 9],
      customMusic: 'Music_MeadowsVillageFarm',
      items: [
        locItem('Beehive', 0.25),
        locItem('TreasureChest_meadows', 0.5),
      ],
    },
    'WoodHouse',
  ),
  // WoodHouse 14 & 15 exists in locations scenes, but not in config, even as disabled
  loc(
    1, 'WoodFarm1', ['Meadows'],
    { components: ['DungeonGenerator'],
      customMusic: 'Music_MeadowsVillageFarm',
      quantity: 10, group: 'woodvillage', minApart: 128, terrainDelta: [0, 4], minDistance: 500, maxDistance: 2000, radius: [20, 32],
      items: [],
    },
    'WoodFarm',
  ),
  loc( // draugr village
    1, 'WoodVillage1', ['Meadows'],
    { quantity: 15, group: 'woodvillage', minApart: 256, terrainDelta: [0, 4], minDistance: 2000, radius: [20, 32],
      customMusic: 'Music_MeadowsVillageFarm',
      items: [],
    },
    'WoodVillage',
  ),
  // TrollCave: disabled
  loc(
    2, 'TrollCave02', ['BlackForest'],
    { type: 'dungeon',
      biomeArea: 2, quantity: 250, minApart: 256,
      randomRotation: false, slopeRotation,
      terrainDelta: [5, 10], minAlt: 3, radius: [24, 12],
      customMusic: 'BlackForestLocationMusic',
      items: [
        // entrance
        locItem('BoneFragments', 0.66, 3),
        locItem('Troll', 0.33, 1),
        // growing
        locItem('MushroomYellow', 0.5, 12),
        locItem([
          locItem('TreasureChest_trollcave', 0.75, 2),
          locItem('Troll', 1, 1),
        ], 0.75),
        // pickups
        locItem('Pickable_ForestCryptRandom', 0.5, 9),
      ],
    },
    'TrollCave',
  ),
  // SunkenCrypt1: disabled
  // SunkenCrypt2: disabled
  // SunkenCrypt3: disabled
  loc(
    3, 'SunkenCrypt4', ['Swamp'], // 1,2,3 disabled
    { type: 'dungeon', components: ['DungeonGenerator'],
      biomeArea: 2, quantity: 400, prioritized, minApart: 64, terrainDelta: [0, 4], minAlt: 0, maxAlt: 2, radius: [14, 12],
      // exterior
      items: [
        locItem('Draugr', 0.3, 1),
        locItem('BlobElite', 0.3, 1),
        locItem('piece_groundtorch_green', 1, 2),
      ],
      needsKey: 'CryptKey',
      dungeon: sunkencrypt,
    },
    'SunkenCrypt',
  ),
  loc(
    1, 'Dolmen01', ['Meadows', 'BlackForest'],
    // skeleton_no_archer, N, *, once 50%
    { quantity: 100, terrainDelta: [0, 2], radius: [20, 8],
      customMusic: 'BlackForestLocationMusic',
      items: [
        locItem('BoneFragments', 0.5, 1),
        locItem('Pickable_DolmenTreasure', 0.1),
        // locItem('Rock_4', 1, 3),
        // locItem('Rock_4', 0.5, 3),
      ],
    },
    'Dolmen',
  ),
  loc(
    1, 'Dolmen02', ['Meadows', 'BlackForest'],
    { quantity: 100, terrainDelta: [0, 2], radius: [20, 8],
      customMusic: 'BlackForestLocationMusic',
      items: [
        locItem('BoneFragments', 0.5, 1),
        locItem('Pickable_DolmenTreasure', 0.2),
        // locItem('Rock_4', 1, 4),
        // locItem('Rock_4', 0.5, 1),
      ],
    },
    'Dolmen',
  ),
  loc(
    1, 'Dolmen03', ['Meadows', 'BlackForest'],
    { quantity: 50, terrainDelta: [0, 2], radius: [20, 10],
      customMusic: 'BlackForestLocationMusic',
      items: [
        locItem('BoneFragments', 0.5, 1),
        locItem('BoneFragments', 1, 1),
        locItem('Pickable_DolmenTreasure', 0.3),
        // locItem('Rock_4', 1, 5),
        // locItem('Rock_4', 0.5, 3),
      ],
    },
    'Dolmen',
  ),
/*  loc(
    2, 'Crypt2', ['BlackForest'],
    { type: 'dungeon', components: ['DungeonGenerator'],
      quantity: 200, minApart: 128, terrainDelta: [0, 2], minAlt: 3, radius: [21, 12],
      items: [locItem('Skeleton', 1, 3)],
      dungeon: forestcrypt,
    },
    'Crypt',
  ), */
  loc(
    2, 'Crypt3', ['BlackForest'],
    { type: 'dungeon', components: ['DungeonGenerator'],
      quantity: 200, minApart: 128, terrainDelta: [0, 2], minAlt: 3, radius: [21, 11],
      items: [locItem('Skeleton', 1, 3)],
      dungeon: forestcrypt,
    },
    'Crypt',
  ),
  loc(
    2, 'Crypt4', ['BlackForest'],
    { type: 'dungeon', components: ['DungeonGenerator'],
      quantity: 200, minApart: 128, terrainDelta: [0, 2], radius: [21, 18],
      items: [locItem('Skeleton', 1, 3)],
      dungeon: forestcrypt, 
    },
    'Crypt',
  ),
  loc(
    3, 'InfestedTree01', ['Swamp'],
    { quantity: 700, minAlt: -1, radius: [20, 5],
      items: [
        locItem('GuckSack', 0.66, 6),
        locItem('GuckSack_small', 0.25, 3),
      ],
    },
    'InfestedTree',
  ),
  loc(
    3, 'SwampHut1', ['Swamp'],
    { quantity: 50, group: 'Swamphut', minApart: 128, minAlt: -2, radius: [20, 8],
      items: [
        locItem([
          locItem('TreasureChest_blackforest'),
          locItem('Wraith'),
        ], 0.1),
      ],
    },
    'SwampHut',
  ),
  loc(
    3, 'SwampHut2', ['Swamp'],
    { quantity: 50, group: 'Swamphut', minApart: 128, minAlt: 2, radius: [20, 8],
      items: [
        locItem([
          locItem('TreasureChest_blackforest'),
          locItem('Wraith'),
        ], 0.1),
      ],
    },
    'SwampHut',
  ),
  loc(
    3, 'SwampHut3', ['Swamp'],
    { quantity: 50, group: 'Swamphut', minApart: 128, minAlt: 2, radius: [20, 8],
      items: [
        locItem([
          // locItem('TreasureChest_blackforest'),
          locItem('Wraith'),
        ], 0.1),
      ],
    },
    'SwampHut',
  ),
  loc(
    3, 'SwampHut4', ['Swamp'],
    { quantity: 50, group: 'Swamphut', minApart: 128, minAlt: -1, radius: [20, 8],
      items: [
        locItem([
          locItem('TreasureChest_blackforest'),
          locItem('Draugr', 1, 2),
          locItem('Draugr_ranged', 0.2),
          locItem('Draugr_ranged', 0.3),
        ], 0.75),
      ],
    },
    'SwampHut',
  ),
  loc(
    3, 'SwampHut5', ['Swamp'], // tower
    { quantity: 25, group: 'Swamphut', minApart: 128, minAlt: -1, radius: [20, 10],
      items: [
        locItem([
          locItem('TreasureChest_blackforest'),
          locItem('Wraith'),
        ], 0.1),
        locItem('Crow', 1, 2),
      ],
    },
    'SwampHut',
  ),
  loc(
    3, 'SwampWell1', ['Swamp'],
    {
      quantity: 25, minApart: 1024, minAlt: -1, radius: [20, 10],
      items: [
        locItem('Draugr_Elite', 0.321, 2),
        locItem('piece_groundtorch_green', 1, 1),
      ],
    },
    'SwampWell',
  ),
  loc(
    4, 'StoneTowerRuins04', ['Mountain'],
    { quantity: 50, group: 'Mountainruin', minApart: 128, slopeRotation, terrainDelta: [6, 40], minAlt: 150, radius: [20, 12.28],
      customMusic: 'Music_MountainCottage',
      items: [
        locItem([
          locItem('TreasureChest_mountains', 0.66),
          locItem('Vegvisir', 0.7), // Vegvisir_DragonQueen
        ], 0.9),
        locItem([locItem('Draugr', 1, 3)], 0.33),
      ],
    },
    'StoneTowerRuinsM',
  ),
  loc(
    4, 'StoneTowerRuins05', ['Mountain'],
    { quantity: 50, group: 'Mountainruin', minApart: 128, slopeRotation, terrainDelta: [6, 40], minAlt: 150, radius: [20, 22],
      customMusic: 'Music_MountainCottage',
      items: [
        // corner towers
        locItem([locItem('Skeleton', 0.33, 3)], 0.33, 4),
        // central towers
        locItem([
          locItem('Skeleton', 0.33, 3),
          locItem('TreasureChest_mountains'),
        ], 0.5),
        // spawn
        locItem('Skeleton', 0.33, 4),
        locItem('BonePileSpawner', 0.5),
      ],
    },
    'StoneTowerRuinsM',
  ),
  loc(
    2, 'StoneTowerRuins03', ['BlackForest'],
    { quantity: 80, group: 'Stonetowerruins', minApart: 200, terrainDelta: [0, 2], minAlt: 2, radius: [20, 9],
      customMusic: 'BlackForestLocationMusic',
      items: [
        locItem([
          locItem('Skeleton', 1, 6),
          locItem('TreasureChest_blackforest'),
        ], 0.33),
        locItem([locItem('Greydwarf', 1, 3)], 0.5),
        locItem('Crow', 1, 2),
        // lvl1
        locItem([
          locItem('Beehive', 0.281),
          locItem('TreasureChest_blackforest'),
          locItem('Greydwarf', 0.5),
          locItem('Greydwarf_Elite', 0.5),
          locItem('Vegvisir', 0.3), // Vegvisir_GDKing
        ], 0.818),
      ],
    },
    'StoneTowerRuinsF',
  ),
  loc(
    2, 'StoneTowerRuins07', ['BlackForest'],
    { quantity: 80, group: 'Stonetowerruins', minApart: 200, terrainDelta: [0, 2], minAlt: 2, radius: [20, 9],
      customMusic: 'BlackForestLocationMusic',
      items: [
        locItem([
          locItem('TreasureChest_blackforest'),
          locItem('Skeleton', 1),
          locItem('Skeleton', 0.5),
        ], 0.25),
        locItem([locItem('Skeleton')], 0.25, 2),
        locItem('Skeleton', 1, 2),
        locItem('Crow', 1, 2),
      ],
    },
    'StoneTowerRuinsF',
  ),
  loc(
    2, 'StoneTowerRuins08', ['BlackForest'],
    { quantity: 80, group: 'Stonetowerruins', minApart: 200, terrainDelta: [0, 2], minAlt: 2, radius: [20, 9],
      customMusic: 'BlackForestLocationMusic',
      items: [
        locItem('TreasureChest_blackforest'),
        locItem('Skeleton', 1, 3),
        locItem([locItem('Skeleton', 0.5, 2)], 0.25),
        locItem([
          locItem('TreasureChest_blackforest'),
          locItem('Skeleton', 0.5),
        ], 0.25),
        locItem('Crow', 1, 2),
      ],
    },
    'StoneTowerRuinsF',
  ),
  loc(
    2, 'StoneTowerRuins09', ['BlackForest'],
    { quantity: 80, group: 'Stonetowerruins', minApart: 200, terrainDelta: [0, 2], minAlt: 2, radius: [20, 7],
      customMusic: 'BlackForestLocationMusic',
      items: [
        locItem([
          locItem('TreasureChest_blackforest'),
          locItem('Skeleton', 0.33, 4),
        ], 0.5),
        locItem('Skeleton', 0.33, 3),
        locItem('Crow', 1, 2),
      ],
    },
    'StoneTowerRuinsF',
  ),
  loc(
    2, 'StoneTowerRuins10', ['BlackForest'],
    { quantity: 80, group: 'Stonetowerruins', minApart: 200, terrainDelta: [0, 2], minAlt: 2, radius: [20, 7],
      customMusic: 'BlackForestLocationMusic',
      items: [
        locItem([locItem('Skeleton', 0.5, 2)], 0.25),
        locItem([
          locItem('TreasureChest_blackforest'),
          locItem('Skeleton', 0.5, 2),
        ], 0.5),
        locItem('Skeleton', 0.5, 3),
        locItem('Crow', 1, 2),
      ],
    },
    'StoneTowerRuinsF',
  ),
  loc(
    2, 'Vendor_BlackForest', ['BlackForest'],
    { biomeArea: 2, quantity: 10, prioritized, unique, minApart: 512, iconPlaced, terrainDelta: [0, 2], minDistance: 1500, radius: [20, 12],
      customMusic: 'Music_Haldor2',
      items: [locItem('Haldor')]
    },
  ),
  loc(
    1, 'ShipSetting01', ['Meadows'],
    { quantity: 100, minApart: 128, radius: [20, 24],
      items: [
        locItem('BoneFragments', 1, 2),
        locItem('Rock_4', 1, 24),
        locItem('TreasureChest_meadows_buried', 0.8, 1),
      ],
    },
    'ShipSetting',
  ),
  loc(
    4, 'Dragonqueen', ['Mountain'],
    { type: 'altar',
      biomeArea: 2, quantity: 3, prioritized,
      minApart: 3000, terrainDelta: [0, 4], maxDistance: 8000, minAlt: 150, maxAlt: 500, radius: [12, 20],
      items: [locItem('Dragon')],
    },
  ),
  loc(
    4, 'DrakeNest01', ['Mountain'],
    { quantity: 200, minApart: 10000, radius: [20, 5],
      // maxAlt: 2000,
      items: [
        locItem('Hatchling', 0.66, 3),
        locItem('DragonEgg'),
      ],
    },
    'DrakeNest',
  ),
  // just pile of stones
  loc(
    4, 'Waymarker01', ['Mountain'],
    { quantity: 50, terrainDelta: [0, 2], minAlt: 100, radius: [3, 20],
      items: [locItem('marker')],
    },
    'Waymarker',
  ),
  loc(
    4, 'Waymarker02', ['Mountain'],
    { quantity: 50, terrainDelta: [0, 2], minAlt: 100, radius: [20, 3],
      items: [locItem('marker')],
    },
    'Waymarker',
  ),
  loc(
    4, 'AbandonedLogCabin02', ['Mountain'],
    { quantity: 33, group: 'Abandonedcabin', minApart: 12800, radius: [20, 10.51],
      customMusic: 'Music_MountainCottage',
      items: [
        locItem('StoneGolem', 0.5),
        locItem('StoneGolem', 0.1),
        locItem([
          locItem('wood_stack', 1),
          locItem('TreasureChest_mountains', 0.698),
        ], 0.764 * 0.648),
      ],
    },
    'AbandonedLogCabin',
  ),
  loc(
    4, 'AbandonedLogCabin03', ['Mountain'],
    { quantity: 33, group: 'Abandonedcabin', minApart: 12800, radius: [20, 10],
      customMusic: 'Music_MountainCottage',
      items: [
        locItem('TreasureChest_mountains'),
        locItem('wood_stack', 1),
        locItem('wood_stack', 0.2),
        locItem('Skeleton', 0.5, 2),
        locItem('StoneGolem', 0.1, 1),
      ],
    },
    'AbandonedLogCabin',
  ),
  loc(
    4, 'AbandonedLogCabin04', ['Mountain'],
    { quantity: 50, group: 'Abandonedcabin', minApart: 12800, radius: [20, 10],
      customMusic: 'Music_MountainCottage',
      items: [
        locItem('TreasureChest_mountains'),
        locItem('Skeleton', 0.5, 2),
        locItem('StoneGolem', 0.1, 2),
      ],  
    },
    'AbandonedLogCabin',
  ),
  loc(
    4, 'MountainGrave01', ['Mountain'],
    {
      quantity: 100, minApart: 50, terrainDelta: [0, 2], minAlt: 100, radius: [20, 3.93],
      items: [
        locItem('BoneFragments'),
        locItem('SilverNecklace', 0.506),
        locItem('MountainGraveStone01', 1, 3),
        locItem('MountainGraveStone01', 0.5, 6),
      ],
    },
    'MountainGrave',
  ),
  loc(
    4, 'DrakeLorestone', ['Mountain'],
    { quantity: 50, group: 'Runestones', minApart: 12800, radius: [20, 4],
      items: [],
    }
  ),
  loc(
    4, 'MountainWell1', ['Mountain'],
    {
      quantity: 25, minApart: 25600, radius: [20, 14],
      items: [
        locItem('TreasureChest_mountains', 0.75),
      ],
    },
    'MountainWell',
  ),
  // loc( // disabled
  //   2, 'MountainCave01', ['Mountain'],
  //   { quantity: 500, terrainDelta: [0, 20], minAlt: 100, radius: [32, 10],
  //     items: [],
  //   },
  // ),
  loc(
    2, 'ShipWreck01', ['BlackForest', 'Swamp', 'Plains', 'Ocean'],
    { quantity: 25, group: 'Shipwreck', minApart: 1024, terrainDelta: [0, 10], minAlt: -1, maxAlt: 1, radius: [20, 10],
      items: [
        locItem('shipwreck_karve_chest', 0.749),
      ]
    },
    'ShipWreck',
  ),
  loc(
    2, 'ShipWreck02', ['BlackForest', 'Swamp', 'Plains', 'Ocean'],
    { quantity: 25, group: 'Shipwreck', minApart: 1024, terrainDelta: [0, 10], minAlt: -1, maxAlt: 1, radius: [20, 10],
      items: [
        locItem('shipwreck_karve_chest', 0.749),
      ]
    },
    'ShipWreck',
  ),
  loc(
    2, 'ShipWreck03', ['BlackForest', 'Swamp', 'Plains', 'Ocean'],
    { quantity: 25, group: 'Shipwreck', minApart: 1024, terrainDelta: [0, 10], minAlt: -1, maxAlt: 1, radius: [20, 10],
      items: [
        locItem('shipwreck_karve_chest', 0.749),
      ]
    },
    'ShipWreck',
  ),
  loc(
    2, 'ShipWreck04', ['BlackForest', 'Swamp', 'Plains', 'Ocean'],
    { quantity: 25, group: 'Shipwreck', minApart: 1024, terrainDelta: [0, 10], minAlt: -1, maxAlt: 1, radius: [20, 14],
      items: [
        locItem('shipwreck_karve_chest', 0.749),
      ]
    },
    'ShipWreck',
  ),
  // Hugintest: disabled
  loc(
    1, 'Runestone_Meadows', ['Meadows'],
    { type: 'runestone', quantity: 100, group: 'Runestones', minApart: 128, radius: [20, 8],
      items: [],
    }
  ),
  loc(
    1, 'Runestone_Boars', ['Meadows'],
    { type: 'runestone', quantity: 50, group: 'Runestones', minApart: 128, radius: [8, 20],
      items: [
        locItem('Boar', 1, 1),
        locItem('Boar', 0.5, 8),
      ],
    }
  ),
  loc(
    3, 'Runestone_Swamps', ['Swamp'],
    { type: 'runestone', quantity: 100, group: 'Runestones', minApart: 128, minAlt: 0, radius: [20, 8], items: [] }
  ), // 12 random texts
  loc(
    4, 'Runestone_Mountains', ['Mountain'],
    { type: 'runestone', quantity: 100, group: 'Runestones', minApart: 12800, radius: [20, 8], items: [] }
  ), // 13 random texts
  loc(
    2, 'Runestone_BlackForest', ['BlackForest'],
    { type: 'runestone', quantity: 50, group: 'Runestones', minApart: 128, radius: [20, 8], items: [] }
  ), // 13 random texts
  loc(
    5, 'Runestone_Plains', ['Plains'],
    { type: 'runestone', quantity: 100, group: 'Runestones', minApart: 128, radius: [20, 8], items: [] }
  ),
  // DevHouse1: disabled
  loc(
    5, 'TarPit1', ['Plains'],
    { quantity: 100, biomeArea: 2, group: 'Tarpit', minApart: 128, terrainDelta: [0, 1.5], minAlt: 5, maxAlt: 60, radius: [20, 20],
      items: [
        locItem('BlobTar', 0.5, 7),
        // locItem('Spawner_BlobTar_respawn_30', 1, 2),
        locItem('Pickable_TarBig', 1, 4),
        locItem('Pickable_Tar', 1, 12),
      ],
    },
    'TarPit',
  ),
  loc(
    5, 'TarPit2', ['Plains'],
    { quantity: 100, biomeArea: 2, group: 'Tarpit', minApart: 128, terrainDelta: [0, 1.5], minAlt: 5, maxAlt: 60, radius: [20, 25],
      items: [
        locItem('BlobTar', 0.5, 7),
        // locItem('Spawner_BlobTar_respawn_30', 1, 2),
        locItem('Pickable_TarBig', 1, 4),
        locItem('Pickable_Tar', 1, 8),
      ],
    },
    'TarPit',
  ),
  loc(
    5, 'TarPit3', ['Plains'],
    { quantity: 100, biomeArea: 2, group: 'Tarpit', minApart: 128, terrainDelta: [0, 1.5], minAlt: 5, maxAlt: 60, radius: [20, 14],
      items: [
        locItem('BlobTar', 0.5, 7),
        // locItem('Spawner_BlobTar_respawn_30', 1, 2),
        locItem('Pickable_TarBig', 1, 4),
        locItem('Pickable_Tar', 1, 8),
      ],
    },
    'TarPit',
  ),
  loc(
    5, 'MountainCave02', ['Mountain'],
    { type: 'dungeon', components: ['DungeonGenerator'],
      quantity: 160, biomeArea: 2, group: 'mountaincaves', minApart: 200, terrainDelta: [0, 40], minAlt: 100, radius: [32, 15],
      items: [
        locItem('Bat', 0.5, 12),
        locItem('Ulv', 0.3, 8),
        locItem('Fenring_Cultist', 0.2, 10),
        locItem('Pickable_Fishingrod', 0.1, 2),
        locItem('Pickable_Hairstrands01', 0.4, 6),
        locItem('Pickable_Hairstrands02', 0.4, 6),
        locItem('Pickable_MountainCaveCrystal', 0.4, 8),
        locItem('Pickable_MountainCaveObsidian', 0.4, 12),
        locItem('Pickable_MeatPile', 0.3, 3),
        locItem('Pickable_MountainCaveRandom', 0.4, 10),
      ],
      dungeon: frostCaves,
    },
    'MountainCave',
  ),
  loc(
    6, 'Mistlands_GuardTower1_new', ['Mistlands'],
    { type: 'misc',
      quantity: 75, biomeArea: 2, group: 'Dvergr', minApart: 128, slopeRotation, terrainDelta: [0, 10], minAlt: 2, radius: [20, 24],
      customMusic: 'Music_DvergrTower2',
      items: [
        // fort
        locItem([
          // floor
          locItem([
            locItem('dvergrprops_chair', 0.75, 4),
            locItem('dverger_guardstone'),
            locItem('Pickable_DvergrLantern', 0.5),
            locItem('dvergrprops_table', 1, 2),
          ]),
          // floor1/random
          locItem([
            locItem('dvergrprops_stool', 0.75),
            locItem('dvergrprops_stool', 0.5),
            locItem('dvergrprops_chair', 0.75, 2),
            locItem('dvergrprops_table'),
            locItem('Pickable_DvergrStein', 0.2),
          ], 0.5),
          // room/random
          locItem([
            locItem('Pickable_DvergrLantern', 0.75),
            locItem('dvergrprops_table'),
            locItem('dvergrprops_stool', 0.75, 2),
            locItem('dvergrprops_chair', 0.75, 2),
          ], 0.75),
          // stair
          locItem('dvergrtown_stair_corner_wood_left', 1, 14),
          locItem('dvergrprops_wood_pole', 1, 5),
        ]),
        // ..
        locItem([
          locItem('dvergrprops_crate', 1, 3),
          locItem('dvergrprops_crate', 0.5, 2),
        ], 1, 2),
        locItem('SpawnerDverger_Arbalest', 1, 3),
        locItem('SpawnerDverger_Arbalest', 0.5),
        locItem('SpawnerDverger_Mage', 1, 2),
        locItem('SpawnerDverger_Mage', 0.5, 2),
        locItem('dvergrprops_wood_stakewall', 0.66, 6),
        locItem('Pickable_DvergrLantern', 0.75, 2),
        locItem('dvergrprops_bed', 0.5, 4),
        locItem('dvergrprops_crate_long'),
      ],
    },
    'Mistlands_GuardTower',
  ),
  loc(
    6, 'Mistlands_GuardTower1_ruined_new', ['Mistlands'],
    { type: 'misc',
      quantity: 80, biomeArea: 2, group: 'Dvergr', minApart: 128, slopeRotation, terrainDelta: [0, 10], minAlt: 2, radius: [20, 20],
      customMusic: 'Music_DvergrTower2',
      items: [
        // floor1
        locItem([
          locItem('Spawner_Seeker'),
          locItem('Spawner_Seeker', 0.5),
        ], 0.75),
        // roof
        locItem([
          locItem('Spawner_Seeker'),
          locItem('Spawner_Seeker', 0.5),
        ], 0.5),
        locItem('Spawner_Seeker', 0.5, 3),
      ],
    },
    'Mistlands_GuardTower',
  ),
  loc(
    6, 'Mistlands_GuardTower1_ruined_new2', ['Mistlands'],
    { type: 'misc',
      quantity: 20, biomeArea: 2, group: 'Dvergr', minApart: 128, slopeRotation, terrainDelta: [0, 10], minAlt: 2, radius: [20, 20],
      customMusic: 'Music_DvergrTower2',
      items: [
        locItem('Spawner_Seeker', 0.5, 3),        
        locItem('YggaShoot3'),        
      ],
    },
    'Mistlands_GuardTower',
  ),
  loc(
    6, 'Mistlands_GuardTower2_new', ['Mistlands'],
    { type: 'misc',
      quantity: 75, biomeArea: 2, group: 'Dvergr', minApart: 128, slopeRotation, terrainDelta: [0, 10], minAlt: 4, radius: [20, 24],
      customMusic: 'Music_DvergrTower2',
      items: [
        locItem([
          locItem('dvergrprops_crate', 1, 3),
          locItem('dvergrprops_crate', 0.5, 2),
        ], 1, 2),
        locItem('SpawnerDverger_Arbalest', 1, 3),
        locItem('SpawnerDverger_Arbalest', 0.5),
        locItem('SpawnerDverger_Mage', 1, 2),
        locItem('SpawnerDverger_Mage', 0.5, 2),
        locItem('dvergrprops_wood_stakewall', 0.66, 6),
        locItem('Pickable_DvergrLantern', 0.75, 2),
        locItem('dvergrprops_bed', 0.5, 3),
        locItem('dvergrprops_crate_long'),
      ],
    },
    'Mistlands_GuardTower',
  ),
  loc(
    6, 'Mistlands_GuardTower3_new', ['Mistlands'],
    { type: 'misc',
      quantity: 50, biomeArea: 2, group: 'Dvergr', minApart: 128, slopeRotation, terrainDelta: [0, 10], minAlt: 12, radius: [20, 24],
      customMusic: 'Music_DvergrTower2',
      items: [
        locItem([
          locItem('dvergrprops_crate', 1, 3),
          locItem('dvergrprops_crate', 0.5, 1),
        ], 1, 2),
        locItem('SpawnerDverger_Arbalest', 1, 3),
        locItem('SpawnerDverger_Arbalest', 0.5),
        locItem('SpawnerDverger_Mage', 1, 2),
        locItem('SpawnerDverger_Mage', 0.5, 2),
        locItem('dvergrprops_wood_stakewall', 0.66, 6),
        locItem('Pickable_DvergrLantern', 0.75, 2),
        locItem('dvergrprops_bed', 0.5, 3),
        locItem('dvergrprops_crate_long'),
      ],
    },
    'Mistlands_GuardTower',
  ),
  loc(
    6, 'Mistlands_GuardTower3_ruined_new', ['Mistlands'],
    { type: 'misc',
      quantity: 50, biomeArea: 2, group: 'Dvergr', minApart: 128, slopeRotation, terrainDelta: [0, 10], minAlt: 11, radius: [20, 20],
      customMusic: 'Music_DvergrTower2',
      items: [
        locItem('YggaShoot_small1', 0.5, 5),
        locItem('Spawner_Seeker', 0.5, 4),        
      ],
    },
    'Mistlands_GuardTower',
  ),
  loc(
    6, 'Mistlands_Lighthouse1_new', ['Mistlands'],
    { type: 'misc',
      quantity: 100, biomeArea: 2, group: 'Dvergr', minApart: 128, slopeRotation, terrainDelta: [0, 10], minAlt: 11, radius: [20, 20],
      customMusic: 'Music_DvergrTower2',
      items: [
        locItem([
          locItem('Pickable_DvergrLantern', 0.75, 3),
          locItem('dvergrprops_table'),
          locItem('Pickable_DvergrStein', 0.2),
          locItem('dvergrprops_stool', 0.75, 3),
          locItem('dvergrprops_chair', 0.75, 2),
        ], 0.75),
        locItem([
          locItem('dvergrprops_table'),
          locItem('Pickable_DvergrStein', 0.2, 2),
          locItem('dvergrprops_stool', 0.75, 2),
          locItem('dvergrprops_chair', 0.75, 1),
        ], 0.75),
        locItem('SpawnerDverger_Arbalest', 1, 2),
        locItem('SpawnerDverger_Arbalest', 0.5),
        locItem('SpawnerDverger_Mage', 1, 3),
        locItem('dvergrprops_bed', 0.5, 3),
        locItem('dvergrprops_guardstone'),
        locItem('dvergrprops_crate_long'),
      ],
    },
    'Mistlands_Lighthouse',
  ),
  loc(
    6, 'Mistlands_Excavation1', ['Mistlands'],
    { type: 'dungeon',
      quantity: 40, biomeArea: 2, group: 'Excavation', minApart: 128, slopeRotation, terrainDelta: [0, 4], minAlt: 4, maxAlt: 100, radius: [20, 20],
      customMusic: 'Music_DvergrExcavationSite2',
      items: [
        // excavation
        locItem('dvergrtown_wood_crane'),
        locItem('giant_ribs'),
        locItem('dverger_guardstone'),
        locItem('trader_wagon_destructable'),
        // crates
        locItem([
          locItem('dvergrprops_crate', 1, 3),
          locItem('dvergrprops_crate', 0.5, 2),
        ], 1, 2),
        // lanterns
        locItem('Pickable_DvergrLantern', 0.5, 6),
        // ..
        locItem('SpawnerDverger_Mage', 0.5, 4),
        locItem('SpawnerDverger_Arbalest', 0.33, 6),
        locItem('SpawnerDverger_Arbalest', 0.66, 2),
        locItem('dvergrprops_crate_long'),
      ],
    },
    'Mistlands_Excavation',
  ),
  loc(
    6, 'Mistlands_Excavation2', ['Mistlands'],
    { type: 'dungeon',
      quantity: 40, biomeArea: 2, group: 'Excavation', minApart: 128, slopeRotation, terrainDelta: [0, 4], minAlt: 4, maxAlt: 100, radius: [20, 20],
      customMusic: 'Music_DvergrExcavationSite2',
      items: [
        // excavation
        locItem('trader_wagon_destructable'),
        locItem('giant_skull'),
        locItem('giant_brain'),
        locItem('dverger_guardstone'),
        // lanterns
        locItem('Pickable_DvergrLantern', 0.5, 6),
        // ..
        locItem('SpawnerDverger_Mage', 0.5, 4),
        locItem('SpawnerDverger_Arbalest', 0.5),
        locItem('SpawnerDverger_Arbalest', 0.33, 5),
        locItem('SpawnerDverger_Arbalest', 0.66, 2),
        locItem('dvergrprops_crate_long'),
      ],
    },
    'Mistlands_Excavation',
  ),
  loc(
    6, 'Mistlands_Excavation3', ['Mistlands'],
    { type: 'misc',
      quantity: 40, biomeArea: 2, group: 'Excavation', minApart: 96, slopeRotation, terrainDelta: [0, 5], minAlt: 4, maxAlt: 100, radius: [20, 17],
      customMusic: 'Music_DvergrExcavationSite2',
      items: [
        // fort/excavation
        locItem('dvergrtown_wood_crane'),
        locItem('dvergrprops_crate', 1, 6),
        // ..
        locItem('Spawner_Seeker', 1, 2),
        locItem('Spawner_Seeker', 0.5, 4),
      ],
    },
    'Mistlands_Excavation',
  ),
  loc(
    6, 'Mistlands_Harbour1', ['Mistlands'],
    { type: 'misc',
      quantity: 100, biomeArea: 1, group: 'Harbour', minApart: 64, slopeRotation, terrainDelta: [2, 20], minAlt: -1, maxAlt: -0.25, radius: [20, 20],
      items: [
        // pier/crates(3)/
        locItem('dvergrprops_crate', 0.5, 3),
        // random/
        // random(1)
        locItem([
          locItem('Spawner_DvergerArbalest', 0.5),
        ], 0.5),
        // crates(2)
        locItem([
          locItem('dvergrprops_crate', 1, 2),
          // random
          locItem([
            locItem('dvergrprops_crate'),
            locItem('dvergrprops_crate', 0.5, 2),
          ], 0.5),
          locItem('Spawner_DvergerMage'),
        ], 0.25),
        // excavation
        locItem('dvergrtown_wood_crane'),
        locItem('dverger_guardstone'),
        locItem([
          locItem('Spawner_DvergerMage'),
          locItem('dvergrprops_crate_long'),
        ], 0.66),
        // ..
        locItem('Spawner_DvergerArbalest', 0.75),
      ],
    },
    'Mistlands_Harbour',
  ),
  loc(
    6, 'Mistlands_Viaduct1', ['Mistlands'],
    { type: 'misc',
      quantity: 100, biomeArea: 2, group: 'Harbour', minApart: 128, slopeRotation, terrainDelta: [2, 40], minAlt: -1, maxAlt: 15, radius: [20, 24],
      items: [
        // MIST AREA R=30 chance=0.25
      ],
    },
    'Mistlands_Harbour',
  ),
  loc(
    6, 'Mistlands_Viaduct2', ['Mistlands'],
    { type: 'misc',
      quantity: 150, biomeArea: 2, group: 'Harbour', minApart: 64, terrainDelta: [4, 40], minAlt: -1, maxAlt: 25, radius: [20, 8],
      items: [
        // MIST AREA R=20 chance=0.25
      ],
    },
    'Mistlands_Harbour',
  ),
  loc(
    6, 'Mistlands_RockSpire1', ['Mistlands'],
    { type: 'misc',
      quantity: 200, biomeArea: 2, minApart: 60, terrainDelta: [2, 99], minAlt: -10, radius: [20, 4],
      items: [
        locItem('cliff_mistlands2', 1, 9),
      ],
    },
    'Mistlands_RockSpire',
  ),
  loc(
    6, 'Mistlands_Giant1', ['Mistlands'],
    { type: 'misc',
      quantity: 350, prioritized, biomeArea: 2, group: 'Giant', minApart: 256, terrainDelta: [0, 3], minAlt: -1, radius: [20, 10],
      items: [
        locItem('giant_sword1', 0.25),
        locItem('giant_ribs'),
        locItem('giant_skull'),
        locItem('giant_brain'),
        locItem('Spawner_Tick', 0.5, 5),
        // MIST AREA R=30
      ],
    },
    'Mistlands_Giant',
  ),
  loc(
    6, 'Mistlands_Giant2', ['Mistlands'],
    { type: 'misc',
      quantity: 100, prioritized, biomeArea: 2, group: 'Giant', minApart: 256, terrainDelta: [0, 4], minAlt: -1, radius: [20, 10],
      items: [
        locItem('giant_ribs'),
        // MIST AREA R=30
      ],
    },
    'Mistlands_Giant',
  ),
  loc(
    6, 'Mistlands_DvergrTownEntrance1', ['Mistlands'],
    { type: 'dungeon', components: ['DungeonGenerator'],
      quantity: 120, prioritized, biomeArea: 2, group: 'DvergrDungeon', minApart: 256, slopeRotation, terrainDelta: [5, 40], minAlt: 12, radius: [32, 20],
      items: [
        locItem('Spawner_Seeker', 1, 5),
      ],
    },
    'Mistlands_DvergrTown',
  ),
  loc(
    6, 'Mistlands_DvergrTownEntrance2', ['Mistlands'],
    { type: 'dungeon', components: ['DungeonGenerator'],
      quantity: 120, prioritized, biomeArea: 2, group: 'DvergrDungeon', minApart: 256, terrainDelta: [0, 40], maxAlt: 20, radius: [32, 32],
      items: [
        locItem('cliff_mistlands2', 1, 5),
        // randomcliff
        locItem('cliff_mistlands2', 0.5, 3),
        locItem('cliff_mistlands1', 0.8, 5),
        locItem('Spawner_Seeker', 1, 2),
        locItem('Spawner_Seeker', 0.5, 2),
      ],
    },
    'Mistlands_DvergrTown',
  ),
  loc(
    6, 'Mistlands_DvergrBossEntrance1', ['Mistlands'],
    { type: 'dungeon',
      quantity: 5, prioritized, biomeArea: 2, group: 'DvergrBoss', minApart: 2048, slopeRotation, terrainDelta: [0, 40], maxAlt: 20, radius: [32, 32],
      items: [
        locItem('Spawner_Seeker', 1, 4),
      ],
      needsKey: 'DvergrKey',
    },
    'Mistlands_Boss',
  ),
  loc(
    6, 'Mistlands_RoadPost1', ['Mistlands'],
    { type: 'misc',
      quantity: 500, biomeArea: 3, minApart: 2048, terrainDelta: [0, 10], radius: [20, 16],
      items: [
        locItem('Spawner_DvergerMage', 0.5),
        locItem('Spawner_DvergerArbalest', 0.5),
      ],
    },
    'Mistlands_RoadPost',
  ),
  loc(
    6, 'Mistlands_StatueGroup1', ['Mistlands'],
    { type: 'misc',
      quantity: 200, biomeArea: 3, minApart: 32, slopeRotation, terrainDelta: [0, 10], minAlt: 2, radius: [20, 16],
      items: [
        locItem('blackmarble_column_3', 1, 5),
      ],
    },
    'Mistlands_Statue',
  ),
  loc(
    6, 'Mistlands_Statue1', ['Mistlands'],
    { type: 'misc',
      quantity: 200, biomeArea: 3, minApart: 0, slopeRotation, terrainDelta: [0, 10], minAlt: 2, radius: [20, 6],
      items: [
        locItem('blackmarble_head_big01'),
      ],
    },
    'Mistlands_Statue',
  ),
  loc(
    6, 'Mistlands_Statue2', ['Mistlands'],
    { type: 'misc',
      quantity: 200, biomeArea: 3, minApart: 0, slopeRotation, terrainDelta: [0, 10], minAlt: 2, radius: [20, 6],
      items: [
        locItem('blackmarble_head_big02'),
      ],
    },
    'Mistlands_Statue',
  ),
  loc(
    6, 'Mistlands_Swords1', ['Mistlands'],
    { type: 'misc',
      quantity: 33, biomeArea: 3, group: 'GiantArmor', minApart: 256, randomRotation, terrainDelta: [0, 10], minAlt: -1, radius: [20, 12],
      items: [
        // MIST AREA R=20 chance=0.5
        locItem('giant_sword1', 0.66),
        locItem('giant_sword2', 0.5),
        // laying sword
        locItem([
          locItem('giant_sword1', 0.5),
          locItem('giant_sword2'),
        ], 0.75),
        locItem('giant_helmet2'),
      ],
    },
    'Mistlands_GiantArmor',
  ),
  loc(
    6, 'Mistlands_Swords2', ['Mistlands'],
    { type: 'misc',
      quantity: 33, biomeArea: 3, group: 'GiantArmor', minApart: 256, randomRotation, terrainDelta: [0, 10], minAlt: -1, radius: [20, 12],
      items: [
        // MIST AREA R=20 chance=0.5
        // laying sword
        locItem([
          locItem('giant_sword1'),
        ], 0.66),
        locItem('giant_helmet1'),
        locItem('giant_sword2', 0.5),
      ],
    },
    'Mistlands_GiantArmor',
  ),
  loc(
    6, 'Mistlands_Swords3', ['Mistlands'],
    { type: 'misc',
      quantity: 33, biomeArea: 3, group: 'GiantArmor', minApart: 256, randomRotation, terrainDelta: [0, 10], minAlt: -1, radius: [20, 8],
      items: [
        // MIST AREA R=20 chance=0.5
        locItem('cliff_mistlands2'),
        // random
        locItem([
          locItem('giant_sword1'),
        ], 0.66),
        // random (1)
        locItem([
          locItem('giant_sword2', 0.75, 2),
          locItem('giant_sword1', 0.75),
        ], 0.66),
      ],
    },
    'Mistlands_GiantArmor',
  ),
  loc(
    6, 'Runestone_Mistlands', ['Mistlands'],
    { type: 'runestone',
      quantity: 50, biomeArea: 3, group: 'Runestones', minApart: 128, randomRotation, slopeRotation, terrainDelta: [0, 10], minAlt: -1, radius: [20, 12],
      items: [],
    },
    'Runestone_Mistlands',
  ),
];

export const dungeons: DungeonGenConfig[] = [
  {
    id: 'MeadowsFarm',
    type: 'CampRadial',
    rooms: [20, 30],
    maxTilt: 25,
    radius: [18, 32],
    perimeterSections: 10,
    perimeterBuffer: 0,
  },
  {
    id: 'MeadowsVillage',
    type: 'CampRadial',
    rooms: [20, 30],
    maxTilt: 25,
    radius: [28, 32],
    perimeterSections: 10,
    perimeterBuffer: 0,
  },
  {
    id: 'ForestCrypt',
    type: 'Dungeon',
    rooms: [20, 40],
    minRequiredRooms: 2,
    requiredRooms: [1,2,3,4,5].map(id => `forestcrypt_new_BurialChamber0${id}`),
    doorTypes: ['dungeon_forestcrypt_door'],
    doorChance: 0.5,
  },
  {
    id: 'SunkenCrypt',
    type: 'Dungeon',
    rooms: [20, 30],
    minRequiredRooms: 0,
    requiredRooms: [],
    doorTypes: ['dungeon_sunkencrypt_irongate'],
    doorChance: 0.3,
  },
  {
    id: 'MountainCave',
    type: 'Dungeon',
    rooms: [3, 64],
    minRequiredRooms: 3,
    requiredRooms: [1,2,3].map(id => `cave_shrine_shrine0${id}`),
    doorTypes: [
      'cloth_hanging_door_double',
      'caverock_ice_pillar_wall',
    ],
    doorChance: 0.2,
  },
  {
    id: 'GoblinCamp',
    type: 'CampRadial',
    rooms: [15, 25],
    maxTilt: 25,
    radius: [15, 30],
    perimeterSections: 10,
    perimeterBuffer: 2,
  },
  {
    id: 'Mistlands_DvergrTown',
    type: 'Dungeon',
    rooms: [16, 96],
    minRequiredRooms: 1,
    requiredRooms: [
      'dvergr_room_TREASURE',
      'dvergr_room_TREASURE2'
    ],
    doorTypes: [
      'dvergrtown_creep_door', // stone
      'dvergrtown_creep_door', // dvergr
      'dvergrtown_slidingdoor', // dvergr
      'dvergrtown_wood_wall02', // dvergr
    ],
    doorChance: 0.9,
  },
  {
    id: 'Mistlands_DvergrBoss',
    type: 'Dungeon',
    rooms: [512, 512],
    minRequiredRooms: 1,
    requiredRooms: [
      'dvergr_bossroom_COMPLETESTAIR04',
    ],
    doorTypes: [],
    doorChance: 0,
  },
];

export const locationsIdMap = new Map(locations.map(l => [l.id, l]));
export const locationsTypeIdMap = new Map(locations.map(l => [l.typeId, l]));

for (const loc of locations) {
  for (const lb of loc.biomes) {
    const biome = biomes.find(b => b.id === lb);
    if (!biome) continue;
    biome.locations.push(loc.typeId);
    locationBiomes[loc.typeId] = biome.id;
  }
}

function addToBiome(
  biomeId: Biome,
  items: EntityId[],
  creatures: (Creature | Fish)[],
  destructibles: EntityId[],
) {
  const biome = biomes.find(b => b.id === biomeId);
  if (biome != null) {
    for (const i of items) biome.resources.add(i);
    for (const c of creatures) biome.creatures.add(c);
    for (const d of destructibles) biome.destructibles.add(d);
  }
}

for (const obj of objects) {
  for (const loc of (obj.grow ?? []).flatMap(g => g.locations)) {
    addToBiome(loc, [], [], [obj.id]);
  }
}

for (const creature of creatures) {
  for (const biome of creature.spawners.flatMap(g => g.biomes)) {
    addToBiome(biome, [], [creature], []);
  }
}

for (const fish of fishes) {
  for (const biome of fish.spawners.flatMap(g => g.biomes)) {
    addToBiome(biome, [], [fish], []);
  }
}

for (const { id, grow } of resources) {
  if (!grow) continue;
  for (const loc of grow.flatMap(g => g.locations)) {
    addToBiome(loc, [id], [], []);
  }
}

export const objectLocationMap: Record<EntityId, GameLocationId[]> = {};

function collectItems(items: LocationItem[]): DropDist {
  const result: DropDist = {};
  for (const { item, number, chance } of items) {
    const baseDist = typeof item !== 'string'
      ? collectItems(item)
      : { [item]: [0, 1] } ;
    const dist = mapValues(baseDist, v => power(weightedAdd(v, [1], chance), number));
    mergeDist(result, dist);
  }
  return result;
}

function collectDungeon(config: DungeonRoomsConfig): DropDist {
  const result: DropDist = {};
  for (const room of config.rooms) {
    const base = collectItems(room.items);
    for (const [item, dist] of Object.entries(base)) {
      const total = powerDist(dist, room.dist);
      result[item] = mul(result[item] ?? [1], total);
    }
  }
  return result;
}

function addToDist(drop: DropDist, item: EntityId, dist: Distribution): void {
  drop[item] = sum([drop[item] ?? [], dist]);
}

function addToBiomes<T>(biomes: Biome[], reader: (biome: BiomeConfig) => Set<T>, item: T) {
  for (const b of biomes) {
    reader(biomeMap[b]).add(item);
  }
}

function addDistToLocation(loc: LocationConfig, drop: DropDist) {
  for (const [item, dist] of Object.entries(drop)) {
    const obj = data[item];
    if (obj == null) {
      console.error(`Prefab '${item}' exists in location '${loc.id}', but wasn't found in objectDB`);
      continue;
    }
    switch (obj.type) {
      case 'piece':
        addToDist(loc.destructibles, item, dist);
        break;
      case 'object':
        addToDist(loc.destructibles, item, dist);
        const items = gatherDrop(obj.drop ?? []);
        for (const [tItem, tDist] of Object.entries(items)) {
          addToDist(loc.resources, tItem, powerDist(tDist, dist));
        }
        if (item === 'Vegvisir') {
          (loc.tags ?? (loc.tags = [])).push('vegvisir');
        }
        break;
      case 'creature':
        addToDist(loc.creatures, item, dist);
        break;
      default:
        addToDist(loc.resources, item, dist);
    }
    if (obj.type === 'object') {
      if (obj.Destructible) {
        const drops = fullDestructible(obj)?.drop ?? [];
        const items = gatherDrop(drops);
        for (const [tItem, tDist] of Object.entries(items)) {
          addToDist(loc.resources, tItem, powerDist(tDist, dist));
        }
      }
    }
  }
}

function addToMap(id: GameLocationId, item: EntityId): void {
  const obj = data[item];
  (objectLocationMap[item] ?? (objectLocationMap[item] = [])).push(id);
  if (obj == null) return;
  const loc = locationsIdMap.get(id);
  if (!loc) return;
  for (const biomeId of loc.biomes) {
    const biome = biomes.find(b => b.id === biomeId);
    if (biome == null) continue;
    switch (obj.type) {
      case 'piece':
        addToBiomes(loc.biomes, b => b.destructibles, item);
        break;
      case 'object':
        addToBiomes(loc.biomes, b => b.destructibles, item);
        for (const drop of obj.drop ?? []) {
          for (const option of drop.options) {
            addToMap(id, option.item);
          }
        }
        if (item === 'Vegvisir') {
          (loc.tags ?? (loc.tags = [])).push('vegvisir');
        }
        break;
      case 'creature':
        addToBiomes(loc.biomes, b => b.creatures, obj);
        break;
      default:
        addToBiomes(loc.biomes, b => b.resources, item);
    }
  }
}

function addToMapRec(id: GameLocationId, { item }: LocationItem): void {
  if (typeof item === 'string') {
    addToMap(id, item);
  } else {
    item.forEach(child => addToMapRec(id, child));
  }
}

export const musicToLocation: Record<string, GameLocationId[]> = {};

for (const loc of locations) {
  const { items, dungeon, customMusic } = loc;
  if (customMusic) {
    (musicToLocation[customMusic] ?? (musicToLocation[customMusic] = [])).push(loc.id)
  }
  for (const item of items) {
    addToMapRec(loc.typeId, item);
  }
  if (!dungeon) continue;
  for (const { items } of dungeon.rooms) {
    for (const item of items) {
      addToMapRec(loc.typeId, item);
    }
  }
}

for (const biome of biomes) {
  // biome.resources = [...new Set(biome.resources)]
    // thanks oozers spawning blobs
    // .filter(id => data[id]?.type !== 'creature');
  // biome.creatures = [...new Set(biome.creatures)].sort((a, b) => a.hp - b.hp);
  biome.locations = [...new Set(biome.locations)];
}

for (const id in objectLocationMap) {
  objectLocationMap[id] = [...new Set(objectLocationMap[id])];
}

const computedLocations = new Map<GameLocationId, LocationConfig>();

export function getLocationDetails(typeId: GameLocationId): LocationConfig | undefined {
  if (computedLocations.has(typeId)) {
    return computedLocations.get(typeId)!;
  }
  const locs = locations.filter(loc => loc.typeId === typeId);
  const total: DropDist[] = [];
  if (!locs.length) return undefined;
  const biomes = new Set<Biome>();
  const quantity = locs.reduce((total, loc) => total + loc.quantity, 0);
  let biomeArea = 0;
  const distance: Pair<number> = [10000, 0];
  const altitude: Pair<number> = [1000, -1000];
  const terrainDelta: Pair<number> = [10, 0];
  for (const loc of locs) {
    if (!computedLocations.has(loc.id)) {
      const varDrop = collectItems(loc.items);
      const { dungeon } = loc;
      if (dungeon) mergeDist(varDrop, collectDungeon(dungeon));
      const variantShare = loc.quantity / quantity;
      total.push(scaleDist(varDrop, variantShare));
      addDistToLocation(loc, varDrop);
      computedLocations.set(loc.id, loc);
    }
    loc.biomes.forEach(b => biomes.add(b));
    biomeArea |= loc.biomeArea;
    distance[0] = Math.min(distance[0], loc.distance[0]);
    distance[1] = Math.max(distance[1], loc.distance[1]);
    altitude[0] = Math.min(altitude[0], loc.altitude[0]);
    altitude[1] = Math.max(altitude[1], loc.altitude[1]);
    terrainDelta[0] = Math.min(terrainDelta[0], loc.terrainDelta[0]);
    terrainDelta[1] = Math.max(terrainDelta[1], loc.terrainDelta[1]);
  }
  const result: LocationConfig = {
    typeId: typeId,
    id: typeId,
    type: locs[0]!.type,
    tier: Math.min(...locs.map(l => l.tier)),
    quantity,
    biomes: [...biomes],
    biomeArea,
    prioritized: locs.some(loc => loc.prioritized),
    centerFirst: locs.some(loc => loc.centerFirst),
    unique: locs.every(loc => loc.unique),
    group: locs.reduce((total, loc) => total || loc.group, ''),
    minApart: Math.min(...locs.map(loc => loc.minApart)),
    iconAlways: locs.every(loc => loc.iconAlways),
    iconPlaced: locs.every(loc => loc.iconPlaced),
    randomRotation: locs.some(loc => loc.randomRotation),
    slopeRotation: locs.every(loc => loc.slopeRotation),
    terrainDelta,
    inForest: null,
    distance,
    altitude,
    radius: [0, 0],
    destructibles: {},
    creatures: {},
    resources: {},
    customMusic: locs.reduce<string | undefined>((a, b) => a ?? b.customMusic, undefined),
    items: [],
  };
  addDistToLocation(result, sumDist(total));
  computedLocations.set(typeId, result);
  return result;
}

export const locationsSorted: LocationConfig[] = [
  ...locations.filter(l => l.prioritized),
  ...locations.filter(l => !l.prioritized),
];
