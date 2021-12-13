import type {
  Biome,
  BiomeConfig,
  Creature,
  DungeonGenConfig,
  EntityId,
  GameComponent,
  GameLocationId,
  LocationConfig,
  LocationItem,
  LocationVariation,
} from '../types';

import { locItem } from '../model/game';
import { DungeonRoomsConfig, forestcrypt, sunkencrypt } from '../data/rooms';

import { fullDestructible, objects } from './objects';
import { data } from './itemDB';
import { resources } from './resources';
import { weightedAdd, distributeDrop, Distribution, DropDist, mergeDist, power, powerDist, scaleDist, sum, sumDist, gatherDrop, mul } from '../model/dist';
import { mapValues } from '../model/utils';

export const locationBiomes: Record<GameLocationId, Biome> = {};

export const locationToBiome = (loc: GameLocationId | Biome) => (locationBiomes[loc as GameLocationId] ?? loc) as Biome;

function biome(emoji: string, id: Biome, tier: number, active: boolean) {
  return {
    id,
    active,
    tier,
    emoji,
    destructibles: [],
    creatures: [],
    locations: [],
    resources: [],
  };
}

export const biomes: BiomeConfig[] = [
  biome('⛳', 'Meadows', 1, true),
  biome('🌲', 'BlackForest', 2, true),
  biome('🐸', 'Swamp', 3, true),
  biome('⛰️', 'Mountain', 4, true),
  biome('🍂', 'Plains', 5, true),
  biome('🌊', 'Ocean', 3, true),
  biome('🕷️', 'Mistlands', 6, false),
  biome('✨', 'Ashlands', 7, false),
  biome('🧊', 'DeepNorth', 8, false),
];

const biomeMap = Object.fromEntries(biomes.map(b => [b.id, b])) as Record<Biome, BiomeConfig>;

export const biomeTiers = Object.fromEntries(biomes.map(b => [b.id as Biome, b.tier]));

export function area(id: Biome | GameLocationId): BiomeConfig | LocationConfig | undefined {
  return biomes.find(b => b.id === id)
      ?? locations.find(l => l.id === id)
}

// 1813954435, 1813954436, 1049915951, -516167990

function loc(
  tier: number,
  id: GameLocationId,
  biomes: Biome[],
  {
    type = 'misc',
    components,
    minAlt = 1,
    maxAlt = 1000,
    minApart = 0,
    minDistance = 0,
    maxDistance = 10000,
  }: {
    type?: LocationConfig['type'],
    components?: GameComponent[],
    minAlt?: number,
    maxAlt?: number,
    minApart?: number,
    minDistance?: number,
    maxDistance?: number,
  },
  variations: LocationVariation[],
): LocationConfig {
  if (type === 'runestone') {
    components = ['Runestone'];
  }
  const totalQuantity = variations.reduce((a, v) => a + v.quantity, 0);
  return {
    id,
    components,
    tier,
    biomes,
    quantity: totalQuantity,
    type,
    minApart,
    altitude: [minAlt, maxAlt],
    distance: [minDistance, maxDistance],
    destructibles: {},
    creatures: {},
    resources: {},
    variations,
  };
}

export const locations: LocationConfig[] = [
  // meadows
  loc(1, 'StartTemple', ['Meadows'], {
    minAlt: 3,
  }, [{
    subtype: '',
    quantity: 1,
    items: [
      locItem('Vegvisir'), // Vegvisir_Eikthyr
      locItem('Raspberry', 1, 2),
      locItem('Mushroom', 1, 2),
      locItem('Wood', 1, 2),
      locItem('Wood', 0.75, 2),
      locItem('Stone', 0.75, 2),
      locItem('Stone', 0.125, 2),
      locItem('Stone', 1, 3),
    ],
  }]),
  loc(1, 'StoneCircle', ['Meadows'], { minApart: 200 }, [
    { subtype: '', quantity: 25, items: [] },
  ]),
  loc(1, 'WoodHouse', ['Meadows'], {}, [
    // ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13']
    {
      subtype: '1',
      quantity: 20,
      items: [
        locItem('beehive', 0.25),
        locItem('TreasureChest_meadows', 0.5),
      ],
    },
    {
      subtype: '2',
      quantity: 20,
      items: [
        locItem('beehive', 0.25),
        locItem('TreasureChest_meadows', 0.5),
      ],
    },
    {
      subtype: '3',
      quantity: 20,
      items: [
        locItem('beehive', 0.25),
      ],
    },
    {
      subtype: '4',
      quantity: 20,
      items: [
        locItem('beehive', 0.25),
      ],
    },
    {
      subtype: '5',
      quantity: 20,
      items: [
        locItem('beehive', 0.25),
      ],
    },
    {
      subtype: '6',
      quantity: 20,
      items: [
        locItem('beehive', 0.25),
        locItem('TreasureChest_meadows', 1),
      ],
    },
    {
      subtype: '7',
      quantity: 20,
      items: [
        locItem('beehive', 0.25),
        locItem('TreasureChest_meadows', 0.5),
      ],
    },
    {
      subtype: '8',
      quantity: 20,
      items: [],
    },
    {
      subtype: '9',
      quantity: 20,
      items: [
        locItem('beehive', 0.25),
        locItem('TreasureChest_meadows', 0.5),
      ],
    },
    {
      subtype: '10',
      quantity: 20,
      items: [
        locItem('beehive', 0.25),
        locItem('TreasureChest_meadows', 0.5),
      ],
    },
    {
      subtype: '11',
      quantity: 20,
      items: [
        locItem('beehive', 0.25),
        locItem('TreasureChest_meadows', 0.5),
      ],
    },
    {
      subtype: '12',
      quantity: 20,
      items: [
        locItem('TreasureChest_meadows', 0.5),
      ],
    },
    {
      subtype: '13',
      quantity: 20,
      items: [
        locItem('beehive', 0.25),
        locItem('TreasureChest_meadows', 0.5),
      ],
    },
    {
      subtype: '14',
      quantity: 20,
      items: [
        locItem('beehive', 0.25),
        locItem('TreasureChest_meadows', 0.5),
      ],
    },
    {
      subtype: '15',
      quantity: 20,
      items: [
        locItem('beehive', 0.25),
        locItem('TreasureChest_meadows', 0.5),
      ],
    },
  ]),
  loc(1, 'WoodFarm', ['Meadows'], { minApart: 128, minDistance: 500, maxDistance: 2000 }, [
    {
      subtype: '1',
      quantity: 10,
      items: [],
    }
  ]),
  loc(1, 'WoodVillage', ['Meadows'], { minApart: 256, minDistance: 2000 }, [
    {
      subtype: '1',
      quantity: 15,
      items: [],
    }
  ]),
  loc(1, 'ShipSetting', ['Meadows'], { minApart: 128 }, [{
    subtype: '01',
    quantity: 100,
    items: [
      locItem('BoneFragments', 1, 2),
      locItem('Rock_4', 1, 24),
      locItem('TreasureChest_meadows_buried', 0.8, 1), // beacon: 40
    ],
  }]),
  loc(1, 'Runestone_Meadows', ['Meadows'], { minApart: 128, type: 'runestone' }, [{
    subtype: '',
    quantity: 100,
    items: [],
  }]),
  loc(1, 'Runestone_Boars', ['Meadows'], { type: 'runestone', minApart: 128 }, [{
    subtype: '',
    quantity: 50,
    items: [
      locItem('Boar', 1, 1),
      locItem('Boar', 0.5, 8),
    ],
  }]),
  loc(
    1, 'Eikthyrnir', ['Meadows'],
    { type: 'altar', maxDistance: 1000 },
    [{ subtype: '', quantity: 3, items: [
      locItem('Eikthyr'),
    ], }],
  ),
  // BLACK FOREST
  loc(2, 'Crypt', ['BlackForest'], { type: 'dungeon', components: ['DungeonGenerator'], minApart: 128, }, [
    {
      // 3 types of entrances, everything the same inside
      subtype: '234',
      quantity: 200 * 3,
      items: [
        locItem('Skeleton', 1, 3),
      ],
      dungeon: forestcrypt, 
    }
  ]),
  loc(2, 'Greydwarf_camp', ['BlackForest'], { minApart: 128, }, [
    {
      subtype: '1',
      quantity: 300,
      items: [
        locItem('Greydwarf_Root', 1, 3),        
        locItem('Spawner_GreydwarfNest'),
      ]
    }
  ]),
  loc(2, 'RuinB', ['BlackForest'], {}, [
    {
      subtype: '1',
      quantity: 200,
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
    {
      subtype: '2',
      quantity: 200,
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
  ]),
  loc(2, 'StoneTowerRuinsF', ['BlackForest'], { minAlt: 2, minApart: 200 }, [
    {
      subtype: '03',
      quantity: 80,
      items: [
        locItem([
          locItem('Skeleton', 1, 6),
          locItem('TreasureChest_blackforest'),
        ], 0.33),
        locItem([locItem('Greydwarf', 1, 3)], 0.5),
        locItem('Crow', 1, 2),
        // lvl1
        locItem([
          locItem('beehive', 0.281),
          locItem('TreasureChest_blackforest'),
          locItem('Greydwarf', 0.5),
          locItem('Greydwarf_Elite', 0.5),
          locItem('Vegvisir', 0.3), // Vegvisir_GDKing
        ], 0.818),
      ],
    },
    {
      subtype: '07',
      quantity: 80,
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
    {
      subtype: '08',
      quantity: 80,
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
    {
      subtype: '09',
      quantity: 80,
      items: [
        locItem([
          locItem('TreasureChest_blackforest'),
          locItem('Skeleton', 0.33, 4),
        ], 0.5),
        locItem('Skeleton', 0.33, 3),
        locItem('Crow', 1, 2),
      ],
    },
    {
      subtype: '10',
      quantity: 80,
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
  ]),
  loc(2, 'StoneHouse', ['BlackForest'], {}, [
    {
      subtype: '3',
      quantity: 200,
      items: [
        locItem('Greydwarf'),
        locItem('TreasureChest_blackforest'),
      ],
    },
    {
      subtype: '4',
      quantity: 200,
      items: [
        locItem('Greydwarf', 0.5, 2),
      ],
    },
  ]),
  loc(2, 'Runestone_Greydwarfs', ['BlackForest'],
    { maxDistance: 2000, minApart: 128, type: 'runestone' },
    [{ subtype: '', quantity: 50, items: [locItem('FirTree_oldLog', 1, 4)] }]
  ),
  // loc('Runestone_BlackForest', [], ['BlackForest'], 0, { minApart: 128, type: 'runestone' }),
  loc(2, 'TrollCave', ['BlackForest'], { type: 'dungeon', minAlt: 3, }, [
    {
      subtype:'02',
      quantity: 250,
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
    }
  ]),
  loc(2, 'Vendor_BlackForest', ['BlackForest'], {}, [{ subtype: '', quantity: 10, items: [locItem('Haldor')] }]),
  loc(
    2, 'GDKing', ['BlackForest'],
    { type: 'altar', minDistance: 1000, maxDistance: 7000 },
    [{ subtype: '', quantity: 4, items: [
      locItem('gd_king'),
    ] }],
  ),
  // swamp
  loc(3, 'Grave', ['Swamp'], {}, [{
    subtype: '1',
    quantity: 50,
    items: [
      locItem('TreasureChest_swamp', 0.5),
      locItem('Spawner_DraugrPile', 1, 2),
      locItem('BonePileSpawner', 1, 1),
    ],
  }]),
  loc(3, 'SwampRuin', ['Swamp'], { minApart: 512 }, [
    {
      subtype: '1',
      quantity: 50,
      items: [
        locItem('Vegvisir', 0.3), // Vegvisir_Bonemass
        locItem('TreasureChest_swamp', 0.251),
        locItem('Draugr', 0.5, 2),
        locItem('Draugr_Elite', 0.321),
        locItem('Spawner_DragurPile', 0.321),
        locItem('Crow', 1, 2),
      ],
    },
    {
      subtype: '2',
      quantity: 50,
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
  ]),
  loc(3, 'InfestedTree', ['Swamp'], {}, [{
    subtype: '01',
    quantity: 700,
    items: [
      locItem('GuckSack', 0.66, 6),
      locItem('GuckSack_small', 0.25, 3),
    ],
  }]),
  loc(3, 'SwampHut', ['Swamp'], {}, [{
    subtype: '1', 
    quantity: 50,
    items: [
      locItem([
        locItem('TreasureChest_blackforest'),
        locItem('Wraith'),
      ], 0.1),
    ],
  },
  {
    subtype: '2', 
    quantity: 50,
    items: [
      locItem([
        locItem('TreasureChest_blackforest'),
        locItem('Wraith'),
      ], 0.1),
    ],
  },
  {
    subtype: '3', 
    quantity: 50,
    items: [
      locItem([
        // locItem('TreasureChest_blackforest'),
        locItem('Wraith'),
      ], 0.1),
    ],
  },
  {
    subtype: '4', 
    quantity: 50,
    items: [
      locItem([
        locItem('TreasureChest_blackforest'),
        locItem('Draugr', 1, 2),
        locItem('Draugr_ranged', 0.2),
        locItem('Draugr_ranged', 0.3),
      ], 0.75),
    ],
  },
  {
    subtype: '5', // tower
    quantity: 25,
    items: [
      locItem([
        locItem('TreasureChest_blackforest'),
        locItem('Wraith'),
      ], 0.1),
      locItem('Crow', 1, 2),
    ],
  }]),
  loc(3, 'SwampWell', ['Swamp'], {}, [{
    subtype: '1',
    quantity: 25,
    items: [
      locItem('Draugr_Elite', 0.321, 2),
      locItem('piece_groundtorch_green', 1, 1),
    ],
  }]),
  loc(3, 'FireHole', ['Swamp'], { minAlt: 0.5 }, [
    { subtype: '', quantity: 200, items: [
      locItem('Surtling', 1, 3), // Spawner_imp_respawn: once in 5 minutes
    ], }
  ]),
  loc(3, 'Runestone_Draugr', ['Swamp'], { type: 'runestone', minApart: 128, }, [
    {
      subtype: '',
      quantity: 50,
      items: [
        locItem('Draugr', 1, 3),
        locItem('piece_groundtorch_green', 1, 2),
        // locItem('stone_wall_2x2', 1, 1),
      ]  
    }
  ]),
  loc(3, 'SunkenCrypt', ['Swamp'], { type: 'dungeon', components: ['DungeonGenerator'], minApart: 64, minAlt: 0, maxAlt: 2, }, [{
    subtype: '4',
    quantity: 400,
    // exterior
    items: [
      locItem('Draugr', 0.3, 1),
      locItem('BlobElite', 0.3, 1),
      locItem('piece_groundtorch_green', 1, 2),
    ],
    dungeon: sunkencrypt,
  }]),
  loc(3, 'Runestone_Swamps', ['Swamp'], { type: 'runestone', minApart: 128 },
    [{ subtype: '', quantity: 100, items: [] }]), // 12 random texts
  loc(3, 'Bonemass', ['Swamp'], { minDistance: 2000, minApart: 3000 }, [{
    subtype: '', quantity: 5, items: [
      locItem('Bonemass'),
    ],
  }]),
  // mountain
  loc(4, 'DrakeNest', ['Mountain'], { minApart: 100, minAlt: 100 }, [{
    subtype: '01',
    quantity: 200,
    items: [
      locItem('Hatchling', 0.66, 3),
      locItem('DragonEgg'),
    ],
  }]),
  loc(4, 'Waymarker', ['Mountain'], { minAlt: 100 }, [
    // actually 2 subtypes: 1 & 2, but technically the same
    { subtype: '', quantity: 100, items: [locItem('marker')], },
  ]), // just pile of stones
  loc(4, 'AbandonedLogCabin', ['Mountain'], { minAlt: 100, minApart: 128 }, [
    {
      subtype: '02',
      quantity: 33,
      items: [
        locItem('StoneGolem', 0.5),
        locItem('StoneGolem', 0.1),
        locItem([
          locItem('wood_stack', 1),
          locItem('TreasureChest_mountains', 0.698),
        ], 0.764 * 0.648),
      ],
    },
    {
      subtype: '03',
      quantity: 33,
      items: [
        locItem('TreasureChest_mountains'),
        locItem('wood_stack', 1),
        locItem('wood_stack', 0.2),
        locItem('Skeleton', 0.5, 2),
        locItem('StoneGolem', 0.1, 1),
      ],
    },
    {
      subtype: '04',
      quantity: 50,
      items: [
        locItem('TreasureChest_mountains'),
        locItem('Skeleton', 0.5, 2),
        locItem('StoneGolem', 0.1, 2),
      ],  
    },
  ]),
  loc(4, 'MountainGrave', ['Mountain'], { minAlt: 100, minApart: 128 }, [{
    subtype: '01',
    quantity: 100,
    items: [
      locItem('BoneFragments'),
      locItem('SilverNecklace', 0.506),
      locItem('MountainGraveStone01', 1, 3),
      locItem('MountainGraveStone01', 0.5, 6),
    ],
  }]),
  loc(4, 'DrakeLorestone', ['Mountain'], { minAlt: 100, minApart: 50 }, [{
    subtype: '',
    quantity: 50,
    items: [],
  }]),
  loc(4, 'MountainWell', ['Mountain'], { minAlt: 100, minApart: 256}, [{
    subtype: '1',
    quantity: 25,
    items: [
      locItem('TreasureChest_mountains', 0.75),
    ],
  }]),
  loc(4, 'StoneTowerRuinsM', ['Mountain'], { minAlt: 150 }, [
    {
      subtype: '04',
      quantity: 50,
      items: [
        locItem([
          locItem('TreasureChest_mountains', 0.66),
          locItem('Vegvisir', 0.7), // Vegvisir_DragonQueen
        ], 0.9),
        locItem([locItem('Draugr', 1, 3)], 0.33),
      ],
    },
    {
      subtype: '05',
      quantity: 50,
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
  ]),
  loc(4, 'Runestone_Mountains', ['Mountain'], { minApart: 128, type: 'runestone' }, [
    { subtype: '', quantity: 100, items: [], },
  ]), // 13 random texts
  loc(
    4, 'DragonQueen', ['Mountain'],
    { type: 'altar', minApart: 3000, maxDistance: 8000, minAlt: 150, maxAlt: 500 },
    [{ subtype: '', quantity: 3, items: [
      locItem('Dragon'),
    ], }]
  ),
  // plains
  loc(5, 'GoblinCamp', ['Plains'], { minApart: 250 }, [{
    subtype: '2',
    quantity: 200,
    items: [
      locItem('TreasureChest_heath', 0.5, 3),
      locItem([locItem('Flax', 0.5, 10)], 0.3, 3),
      locItem([locItem('Barley', 0.5, 10)], 0.3, 3),
      locItem('GoblinTotem', 0.6, 3),
      locItem('Goblin', 0.5, 20),
      locItem('GoblinBrute', 0.75, 4),
      locItem('GoblinShaman', 0.75, 4),
    ]
  }]),
  loc(5, 'StoneTower', ['Plains'], { minApart: 512 }, [{
    subtype: '1',
    quantity: 50,
    items: [
      locItem('Goblin', 0.54, 6),
      locItem('GoblinTotem', 1, 1),
      locItem([
        locItem('TreasureChest_heath', 1, 1),
        locItem('Goblin', 0.54, 3),
      ], 0.5, 1),
    ],
  }, {
    subtype: '3',
    quantity: 50,
    items: [
      locItem('Goblin', 0.54, 10),
      locItem([
        locItem('TreasureChest_heath', 1, 1),
        locItem('Goblin', 0.54, 2),
      ], 0.5, 1),
    ],
  }]),
  loc(5, 'RuinP', ['Plains'], { minApart: 512 }, [{
    subtype: '3',
    quantity: 50,
    items: [
      locItem('TreasureChest_heath'),
      locItem('Goblin', 1, 2),
    ],
  }]),
  loc(5, 'StoneHengeL', ['Plains'], { minApart: 1000, minAlt: 5 }, [
    {
      subtype: '1',
      quantity: 5,
      items: [
        locItem([
          locItem('GoblinBrute', 0.5, 2),
          locItem('GoblinBrute', 1, 1),
          locItem('TreasureChest_heath_stone', 1, 1),
          // locItem('Rock_3', 1, 6),
        ], 0.5, 1),
        locItem('Vegvisir', 0.4), // Vegvisir_GoblinKing
        // locItem('Rock_3', 1, 6),
      ],
    },
    {
      subtype: '2',
      quantity: 5,
      items: [
        locItem([
          locItem('GoblinBrute', 0.5, 2),
          locItem('GoblinBrute', 1, 1),
          locItem('TreasureChest_heath_stone', 1, 1),
        ], 0.5, 1),
      ],
    },
    {
      subtype: '3',
      quantity: 5,
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
    {
      subtype: '4',
      quantity: 5,
      items: [
        locItem('GoblinBrute', 0.5, 2),
        locItem('Vegvisir', 0.4), // Vegvisir_GoblinKing
      ],
    },
  ]),
  loc(5, 'StoneHengeS', ['Plains'], { minApart: 500, minAlt: 2, }, [
    {
      subtype: '5',
      quantity: 20,
      items: [
        locItem([locItem('Goblin', 0.54, 3)], 0.75),
        locItem('Vegvisir', 0.4), // Vegvisir_GoblinKing
        // locItem([locItem('Rock_3', 1, 4)], 0.75),
        // locItem('Rock_3', 1, 4),
      ],
    },
    {
      subtype: '6',
      quantity: 20,
      items: [
        locItem([locItem('Rock_3', 1, 3)], 0.5),
        locItem([locItem('Rock_3', 1, 5)], 0.5),
      ],
    },
  ]),
  // 13 random texts
  loc(
    5, 'Runestone_Plains', ['Plains'],
    { type: 'runestone' },
    [{ subtype: '', quantity: 100, items: [] }],
  ),
  // maxTerrainDelta: 1.5
  loc(5, 'TarPit', ['Plains'], { minApart: 128, minAlt: 5, maxAlt: 60 }, [
    {
      subtype: '1',
      quantity: 100,
      items: [
        locItem('BlobTar', 0.5, 7),
        // locItem('Spawner_BlobTar_respawn_30', 1, 2),
        locItem('Pickable_TarBig', 1, 4),
        locItem('Pickable_Tar', 1, 12),
      ],
    },
    {
      subtype: '2',
      quantity: 100,
      items: [
        locItem('BlobTar', 0.5, 7),
        // locItem('Spawner_BlobTar_respawn_30', 1, 2),
        locItem('Pickable_TarBig', 1, 4),
        locItem('Pickable_Tar', 1, 8),
      ],
    },
    {
      subtype: '3',
      quantity: 100,
      items: [
        locItem('BlobTar', 0.5, 7),
        // locItem('Spawner_BlobTar_respawn_30', 1, 2),
        locItem('Pickable_TarBig', 1, 4),
        locItem('Pickable_Tar', 1, 8),
      ],
    },
  ]),
  loc(
    5, 'GoblinKing', ['Plains'],
    { type: 'altar', minApart: 3000 },
    [{ subtype: '', quantity: 4, items: [
      locItem('GoblinKing'),
    ] }],
  ),
  // Ashlands
  loc(7, 'Meteorite', ['Ashlands'], {}, [{
    subtype: '',
    quantity: 300,
    items: [
      locItem('MineRock_Meteorite', 1, 15),
      locItem('Surtling', 1, 4),
    ],
  }]),
  // MIXED
  loc(1, 'Dolmen', ['Meadows', 'BlackForest'], {}, [
    // skeleton_no_archer, N, *, once 50%
    {
      subtype: '01',
      quantity: 100,
      items: [
        locItem('BoneFragments', 0.5, 1),
        locItem('Pickable_DolmenTreasure', 0.1),
        // locItem('Rock_4', 1, 3),
        // locItem('Rock_4', 0.5, 3),
      ],
    },
    {
      subtype: '02',
      quantity: 100,
      items: [
        locItem('BoneFragments', 0.5, 1),
        locItem('Pickable_DolmenTreasure', 0.2),
        // locItem('Rock_4', 1, 4),
        // locItem('Rock_4', 0.5, 1),
      ],
    },
    {
      subtype: '03',
      quantity: 50,
      items: [
        locItem('BoneFragments', 0.5, 1),
        locItem('BoneFragments', 1, 1),
        locItem('Pickable_DolmenTreasure', 0.3),
        // locItem('Rock_4', 1, 5),
        // locItem('Rock_4', 0.5, 3),
      ],
    },
  ]),
  loc(2, 'ShipWreck', ['BlackForest', 'Swamp', 'Plains', 'Ocean'], { minApart: 1024, minAlt: -1, maxAlt: 1 }, [
    {
      subtype: '01',
      quantity: 25,
      items: [
        locItem('shipwreck_karve_chest', 0.749),
      ]
    },
    {
      subtype: '03',
      quantity: 25,
      items: [
        locItem('shipwreck_karve_chest', 0.749),
      ]
    },
    {
      subtype: '03',
      quantity: 25,
      items: [
        locItem('shipwreck_karve_chest', 0.749),
      ]
    },
    {
      subtype: '04',
      quantity: 25,
      items: [
        locItem('shipwreck_karve_chest', 0.749),
      ]
    },
  ]),
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
    requiredRooms: ['forestcrypt_new_BurialChamber0{1,2,3,4,5}'],
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
    id: 'GoblinCamp',
    type: 'CampRadial',
    rooms: [15, 25],
    maxTilt: 25,
    radius: [15, 30],
    perimeterSections: 10,
    perimeterBuffer: 2,
  },
];

for (const loc of locations) {
  for (const lb of loc.biomes) {
    const biome = biomes.find(b => b.id === lb);
    if (!biome) continue;
    biome.locations.push(loc.id);
    locationBiomes[loc.id] = biome.id;
  }
}

function addToBiome(
  biomeId: Biome,
  items: EntityId[],
  creatures: Creature[],
  destructibles: EntityId[],
) {
  const biome = biomes.find(b => b.id === biomeId);
  if (biome != null) {
    biome.resources.push(...items);
    biome.creatures.push(...creatures);
    biome.destructibles.push(...destructibles);
  }
}

for (const obj of objects) {
  for (const loc of (obj.grow ?? []).flatMap(g => g.locations)) {
    addToBiome(loc, [], [], [obj.id]);
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

function addToBiomes<T>(biomes: Biome[], reader: (biome: BiomeConfig) => T[], item: T) {
  for (const b of biomes) {
    reader(biomeMap[b]).push(item);
  }
}

function addToLocation(loc: LocationConfig, drop: DropDist) {
  for (const [item, dist] of Object.entries(drop)) {
    const obj = data[item];
    if (obj == null) {
      console.error(`Prefab '${item}' exists in location '${loc.id}', but wasn't found in objectDB`);
      continue;
    }
    switch (obj.type) {
      case 'object':
      case 'piece':
        addToDist(loc.destructibles, item, dist);
        addToBiomes(loc.biomes, b => b.destructibles, item);
        if (item === 'Vegvisir') {
          (loc.tags ?? (loc.tags = [])).push('vegvisir');
        }
        break;
      case 'creature':
        addToDist(loc.creatures, item, dist);
        addToBiomes(loc.biomes, b => b.creatures, obj);
        break;
      case 'treasure':
        const items = distributeDrop(obj.drop);
        for (const [tItem, tDist] of Object.entries(items)) {
          addToDist(loc.resources, tItem, powerDist(tDist, dist));
          addToBiomes(loc.biomes, b => b.resources, item);
        }
        addToDist(loc.destructibles, item, dist);
        // addToBiomes(loc.biomes, b => b.resources, item);
        break;
      default:
        addToDist(loc.resources, item, dist);
        addToBiomes(loc.biomes, b => b.resources, item);
    }
    if (obj.type === 'object') {
      if (obj.Destructible) {
        const drops = fullDestructible(obj)?.drop ?? [];
        const items = gatherDrop(drops);
        for (const [tItem, tDist] of Object.entries(items)) {
          addToDist(loc.resources, tItem, powerDist(tDist, dist));
          addToBiomes(loc.biomes, b => b.resources, item);
        }
      }
    }
  }
}

function addToMap(id: GameLocationId, item: EntityId): void {
  (objectLocationMap[item] ?? (objectLocationMap[item] = [])).push(id);
}

function addToMapRec(id: GameLocationId, { item }: LocationItem): void {
  if (typeof item === 'string') {
    addToMap(id, item);
  } else {
    item.forEach(child => addToMapRec(id, child));
  }
}

const start = performance.now();

for (const loc of locations) {
  for (const { items, dungeon } of loc.variations) {
    for (const item of items) {
      addToMapRec(loc.id, item);
    }
    if (!dungeon) continue;
    for (const { items } of dungeon.rooms) {
      for (const item of items) {
        addToMapRec(loc.id, item);
      }
    }
  }
}

const dt = performance.now() - start;
console.log(`All locations t = ${Math.round(dt)}ms`);

for (const biome of biomes) {
  biome.resources = [...new Set(biome.resources)]
    // thanks oozers spawning blobs
    .filter(id => data[id]?.type !== 'creature');
  biome.creatures = [...new Set(biome.creatures)].sort((a, b) => a.hp - b.hp);
  biome.locations = [...new Set(biome.locations)];
}

for (const id in objectLocationMap) {
  objectLocationMap[id] = [...new Set(objectLocationMap[id])];
}

const computedLocations = new Set<GameLocationId>();

export function getLocationDetails(id: GameLocationId): LocationConfig | undefined {
  const loc = locations.find(loc => loc.id === id);
  const total: DropDist[] = [];
  if (loc == null) return undefined;
  if (!computedLocations.has(id)) {
    for (const variant of loc.variations) {
      const varDrop = collectItems(variant.items);
      const { dungeon } = variant;
      if (dungeon) {
        mergeDist(varDrop, collectDungeon(dungeon));
      }
      const variantShare = variant.quantity / loc.quantity;
      total.push(scaleDist(varDrop, variantShare));
    }
    addToLocation(loc, sumDist(total));
    computedLocations.add(id);
  }
  return loc;
}
