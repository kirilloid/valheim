import { EntityId, Resource, itemGrow } from '../types';

const HOUR = 3600;

// Meadows = 1
// Swamp = 2
// Mountain = 4
// BlackForest = 8
// Plains = 16
// Ashlands = 32
// DeepNorth = 64
// Ocean = 256
// Mistlands = 512

export const resources: Resource[] = [
// MEADOWS
  { type: 'item', group: 'lumber', id: 'Wood', emoji: '🪵', tier: 0, weight: 2, stack: 50, floating: true,
    grow: itemGrow({ locations: ['Meadows', 'Swamp', 'BlackForest'], altitude: [0, 1000], inForest: [0, 1.1], num: [15, 15] })
  },
  { type: 'item', id: 'Coal', tier: 2, weight: 2, stack: 50 },
  { type: 'item', id: 'Resin', tier: 1, weight: 0.3, stack: 50 },
  { type: 'item', id: 'Feathers', emoji: '🪶', tier: 1, weight: 0.1, stack: 50 },
  { type: 'item', id: 'Stone', emoji: '🪨', tier: 0, weight: 2, stack: 50,
    grow: itemGrow(
      { locations: ['Meadows', 'Swamp'], altitude: [-3, 1000], num: [5, 5], },
      { locations: ['Meadows', 'Swamp', 'BlackForest', 'Plains'], altitude: [0, 1000], num: [30, 30], group: [2, 3], tilt: [22, 90] }
    ),
  },
  { type: 'item', id: 'Flint', tier: 1, weight: 2, stack: 30,
    grow: itemGrow({ locations: ['Meadows'], altitude: [-2, 1], num: [30, 30], respawn: 4 * HOUR }),
  },
  { type: 'item', group: 'hide', id: 'LeatherScraps', tier: 1, weight: 0.5, stack: 50 },
  { type: 'item', group: 'hide', id: 'DeerHide', tier: 1, weight: 1, stack: 50 },
  { type: 'item', id: 'QueenBee', emoji: '🐝', tier: 1, weight: 0.2, stack: 20 },
  { type: 'item', group: 'seedTree', id: 'BeechSeeds', tier: 1, weight: 0.1, stack: 100 },
  { type: 'item', group: 'berry', id: 'Raspberry', emoji: '🍓', tier: 1, weight: 0.1, stack: 50, tags: ['plant'],
    Food: { health: 7, stamina: 20, duration: 600, regen: 1, color: '#ff7a7aff' },
    grow: itemGrow({ locations: ['Meadows'], tilt: [0, 45], num: [1, 2], group: [3, 8], inForest: [1, 1.2], respawn: 5 * HOUR }),
  },
  { type: 'item', id: 'Mushroom', emoji: '🍄🔴', tier: 1, weight: 0.1, stack: 50,
    Food: { health: 15, stamina: 15, duration: 900, regen: 1, color: '#ff7353ff' },
    grow: itemGrow({
      locations: ['Meadows', 'BlackForest', /* 11, also 'Swamp', but minAlt=1 */],
      altitude: [1, 1000], tilt: [0, 25], num: [1, 2], group: [3, 6], inForest: [0, 1], respawn: 4 * HOUR,
    }),
  },
  { type: 'item', id: 'Dandelion', tier: 0, weight: 0.1, stack: 50, tags: ['plant', 'herb'],
    grow: itemGrow({ locations: ['Meadows'], tilt: [0, 15], num: [8, 10], group: [1, 3], respawn: 4 * HOUR }), },
  { type: 'item', id: 'Honey', emoji: '🍯', tier: 1, weight: 0.2, stack: 50,
    Food: { health: 8, stamina: 35, duration: 900, regen: 1, color: '#ffae00ff' },
    // recipe: { type: 'craft_one', time: GAME_DAY, materials: {}, source: { station: 'BeeHive' }, number: 1 },
  },
  { type: 'item', id: 'RawMeat', emoji: '🥩', tier: 0, weight: 1, stack: 20 },
  { type: 'item', id: 'CookedMeat', emoji: '🍗', tier: 1, weight: 1, stack: 20,
    Food: { health: 30, stamina: 10, duration: 1200, regen: 2, color: '#ab7862ff' },
  },
  { type: 'item', id: 'BoarJerky', emoji: '🥓', tier: 1, weight: 0.5, stack: 20,
    Food: { health: 23, stamina: 23, duration: 1800, regen: 2, color: '#9E5E35ff' },
  },
  { type: 'item', id: 'DeerMeat', emoji: '🥩', tier: 1, weight: 1, stack: 20 },
  { type: 'item', id: 'CookedDeerMeat', emoji: '🍗', tier: 1, weight: 1, stack: 20,
    Food: { health: 35, stamina: 12, duration: 1200, regen: 2, color: '#ab7862ff' },
  },
  { type: 'item', id: 'NeckTail', tier: 0, weight: 0.5, stack: 50 },
  { type: 'item', id: 'NeckTailGrilled', emoji: '🥓', tier: 1, weight: 0.5, stack: 20,
    Food: { health: 25, stamina: 8, duration: 1200, regen: 2, color: '#c59645ff' },
  },
  { type: 'item', id: 'FishRaw', emoji: '🐟', tier: 2, weight: 0.5, stack: 20 },
  { type: 'item', id: 'FishCooked', emoji: '🍣', tier: 2, weight: 0.5, stack: 20,
    Food: { health: 45, stamina: 15, duration: 1200, regen: 2, color: '#ce8550ff' },
  },
  { type: 'item', id: 'MeadBaseHealthMinor', iconId: 'resource/MeadBase', tier: 1, weight: 1, stack: 1 },
  { type: 'item', id: 'MeadHealthMinor', emoji: '\u{1F9EA}', tier: 1, weight: 1, stack: 10,
    Potion: { health: [50, 10], cooldown: 120 }, 
  },
  { type: 'item', id: 'MeadBaseStaminaMinor', iconId: 'resource/MeadBase', tier: 1, weight: 1, stack: 1 },
  { type: 'item', id: 'MeadStaminaMinor', emoji: '\u{1F9EA}', tier: 1, weight: 1, stack: 10,
    Potion: { stamina: [80, 2], cooldown: 120 }, 
  },
  { type: 'item', id: 'MeadBaseTasty', iconId: 'resource/MeadBase', tier: 1, weight: 1, stack: 1 },
  { type: 'item', id: 'MeadTasty', emoji: '\u{1F9EA}', tier: 1, weight: 1, stack: 10,
    Potion: { staminaRegen: 4, healthRegen: 0.5, cooldown: 120 }, 
  },
  { type: 'trophy', id: 'TrophyBoar', trophyPos: { x: 0, y: 0 }, emoji: '🐗', tier: 1, weight: 2, stack: 50 },
  { type: 'trophy', id: 'TrophyDeer', trophyPos: { x: 1, y: 0 }, emoji: '🦌', tier: 1, weight: 2, stack: 50, summon: ['Eikthyr', 2] },
  { type: 'trophy', id: 'TrophyNeck', trophyPos: { x: 2, y: 0 }, emoji: '🦎', tier: 1, weight: 0.5, stack: 50 },
  { type: 'trophy', id: 'TrophyEikthyr', trophyPos: { x: 3, y: 0 }, emoji: '🦌', tier: 2, weight: 2, stack: 20, floating: true, power: 'GP_Eikthyr' },
  { type: 'item', id: 'HardAntler', tier: 2, weight: 2, stack: 50, floating: true },
// BLACK FOREST
  { type: 'item', group: 'seedTree', id: 'Acorn', tier: 2, weight: 0.1, stack: 100, floating: true },
  { type: 'item', group: 'seedTree', id: 'BirchSeeds', tier: 2, weight: 0.1, stack: 100, floating: true },
  { type: 'item', group: 'seedTree', id: 'FirCone', tier: 2, weight: 0.1, stack: 100, floating: true },
  { type: 'item', group: 'seedTree', id: 'PineCone', tier: 2, weight: 0.1, stack: 100, floating: true },
  { type: 'item', group: 'lumber', id: 'FineWood', tier: 2, weight: 2, stack: 50, floating: true },
  { type: 'item', id: 'GreydwarfEye', tier: 2, weight: 0.2, stack: 50 },
  { type: 'item', id: 'Pukeberries', tier: 2, weight: 0.1, stack: 50 },
  { type: 'item', id: 'BoneFragments', emoji: '🦴', tier: 2, weight: 0.5, stack: 50 },
  { type: 'item', id: 'SurtlingCore', emoji: '🟥', tier: 2, weight: 5, stack: 10 }, // Pickable
  { type: 'item', id: 'AncientSeed', emoji: '🌰', tier: 2, weight: 1, stack: 50, summon: ['gd_king', 3] },
  { type: 'item', group: 'lumber', id: 'RoundLog', tier: 2, weight: 2, stack: 50 },
  { type: 'item', group: 'hide', id: 'TrollHide', tier: 2, weight: 2, stack: 20 },
  { type: 'item', group: 'ore', id: 'CopperOre', tier: 2, weight: 10, stack: 30, teleportable: false },
  { type: 'item', group: 'metal', id: 'Copper', tier: 2, weight: 10, stack: 30, teleportable: false, tags: ['metal'] },
  { type: 'item', group: 'ore', id: 'TinOre', tier: 2, weight: 8, stack: 30, teleportable: false },
  { type: 'item', group: 'metal', id: 'Tin', tier: 2, weight: 8, stack: 30, teleportable: false, tags: ['metal'] },
  { type: 'item', group: 'metal', id: 'Bronze', tier: 2, weight: 12, stack: 30, teleportable: false, tags: ['metal'] },
  { type: 'item', id: 'BronzeNails', tier: 2, weight: 0.5, stack: 100 },
  { type: 'item', group: 'value', id: 'Coins', emoji: '🪙', tier: 2, weight: 0.1, stack: 999, Value: 1 },
  { type: 'item', group: 'value', id: 'Ruby', emoji: '♦️', tier: 2, weight: 0.1, stack: 20, Value: 20 },
  { type: 'item', group: 'value', id: 'Amber', emoji: '🍕', tier: 2, weight: 0.1, stack: 20, Value: 5 },
  { type: 'item', group: 'value', id: 'AmberPearl', emoji: '🟡', tier: 2, weight: 0.1, stack: 50, Value: 10 },
  { type: 'item', group: 'value', id: 'SilverNecklace', emoji: '💍', tier: 2, weight: 0.1, stack: 50, Value: 30 },
  { type: 'item', id: 'YmirRemains', tier: 2, weight: 0.3, stack: 50 },
  { type: 'item', id: 'FishingBait', tier: 2, weight: 0.1, stack: 100 },
  { type: 'item', id: 'Thunderstone', tier: 2, weight: 10, stack: 20 },
  { type: 'item', group: 'berry', id: 'Blueberries', emoji: '🫐', tier: 2, weight: 0.1, stack: 50, tags: ['plant'],
    Food: { health: 8, stamina: 25, duration: 600, regen: 1, color: '#568cffff' },
    grow: itemGrow({ locations: ['BlackForest'], num: [1, 1], group: [1, 8], respawn: 5 * HOUR }) },
  { type: 'item', id: 'QueensJam', emoji: '🧁', tier: 2, weight: 1, stack: 10,
    Food: { health: 14, stamina: 40, duration: 1200, regen: 2, color: '#ff0084ff' },
  },
  { type: 'item', id: 'MushroomYellow', emoji: '🍄🟡', tier: 2, weight: 0.1, stack: 50,
    Food: { health: 10, stamina: 30, duration: 600, regen: 1, color: '#e7c84bff' },
  },
/*  { type: 'item', id: 'MushroomBlue', emoji: '🍄🔵', tier: 2, weight: 0.1, stack: 50,
    Food: { health: 20, stamina: 20, duration: 600, regen: 1, color: '#4be1e7ff' }
  },*/
  { type: 'item', id: 'MeadBaseHealthMedium', iconId: 'resource/MeadBase', tier: 1, weight: 1, stack: 1 },
  { type: 'item', id: 'MeadHealthMedium', emoji: '\u{1F9EA}', tier: 1, weight: 1, stack: 10,
    Potion: { health: [75, 10], cooldown: 120 },
  },
  { type: 'item', id: 'MeadBasePoisonResist', iconId: 'resource/MeadBase', tier: 1, weight: 1, stack: 1 },
  { type: 'item', id: 'MeadPoisonResist', emoji: '\u{1F9EA}', tier: 1, weight: 1, stack: 10,
    Potion: { damageModifiers: { poison: 'veryResistant' }, cooldown: 600 },
  },
  { type: 'item', id: 'Thistle', emoji: '🌿', tier: 2, weight: 0.1, stack: 50, tags: ['plant', 'herb'],
    grow: itemGrow({ locations: ['BlackForest', 'Swamp'], altitude: [0, 1000], tilt: [0, 20], num: [1, 2], group: [2, 5], respawn: 4 * HOUR }),
  },
  { type: 'item', group: 'seedVeg', id: 'CarrotSeeds', tier: 2, weight: 0.1, stack: 100, tags: ['plant', 'vegetable'],
    grow: itemGrow({ locations: ['BlackForest'], num: [0, 0.5], group: [1, 2], tilt: [0, 25] }),
  },
  { type: 'item', id: 'Carrot', emoji: '🥕', tier: 2, weight: 0.3, stack: 50, tags: ['plant', 'vegetable'],
    Food: { health: 10, stamina: 32, duration: 900, regen: 1, color: '#ff7115ff' },
  },
  { type: 'item', id: 'CarrotSoup', emoji: '🥣', tier: 2, weight: 1, stack: 10,
    Food: { health: 15, stamina: 45, duration: 1500, regen: 2, color: '#f17d3aff' },
  },
  { type: 'item', id: 'DeerStew', emoji: '🍲', tier: 2, weight: 1, stack: 10,
    Food: { health: 45, stamina: 15, duration: 1500, regen: 3, color: '#DD8049ff' },
  },
  { type: 'item', id: 'MinceMeatSauce', emoji: '', tier: 2, weight: 1, stack: 10,
    Food: { health: 40, stamina: 13, duration: 1500, regen: 3, color: '#DD8049ff' },
  },
  { type: 'trophy', id: 'TrophySkeleton', trophyPos: { x: 5, y: 1 }, emoji: '💀', tier: 2, weight: 0.5, stack: 20 },
  { type: 'trophy', id: 'TrophySkeletonPoison', trophyPos: { x: 6, y: 1 }, emoji: '☠️', tier: 2, weight: 0.5, stack: 20 },
  { type: 'trophy', id: 'TrophyGreydwarf', trophyPos: { x: 0, y: 1 }, tier: 2, weight: 1, stack: 20 },
  { type: 'trophy', id: 'TrophyGreydwarfBrute', trophyPos: { x: 1, y: 1 }, tier: 2, weight: 1.5, stack: 20 },
  { type: 'trophy', id: 'TrophyGreydwarfShaman', trophyPos: { x: 2, y: 1 }, tier: 2, weight: 1, stack: 20 },
  { type: 'trophy', id: 'TrophyFrostTroll', trophyPos: { x: 4, y: 1 }, tier: 2, weight: 4, stack: 20 },
  { type: 'trophy', id: 'TrophyTheElder', trophyPos: { x: 3, y: 1 }, tier: 3, weight: 4, stack: 20, floating: true, power: 'GP_TheElder' },
  { type: 'item', id: 'CryptKey', emoji: '🗝️', tier: 3, weight: 0.1, stack: 1, floating: true },
  // SWAMP
  { type: 'item', id: 'Ooze', tier: 3, weight: 0.5, stack: 50 },
  { type: 'item', id: 'Guck', tier: 3, weight: 0.5, stack: 50 },
  { type: 'item', id: 'Root', tier: 3, weight: 0.3, stack: 50 },
  { type: 'item', id: 'Chain', emoji: '⛓️', tier: 3, weight: 2, stack: 50 },
  { type: 'item', id: 'Bloodbag', emoji: '🩸', tier: 3, weight: 0.5, stack: 50 },
  { type: 'item', id: 'Turnip', tier: 3, emoji: '🍆', weight: 0.3, stack: 50, tags: ['plant', 'vegetable'] },
  { type: 'item', group: 'seedVeg', id: 'TurnipSeeds', tier: 3, weight: 0.1, stack: 100, tags: ['plant', 'vegetable'],
    grow: itemGrow({ locations: ['Swamp'], altitude: [0, 1000], num: [0, 0.5], group: [1, 2], tilt: [0, 25] }) },
  { type: 'item', id: 'TurnipStew', emoji: '🍲', tier: 3, weight: 1, stack: 10,
    Food: { health: 18, stamina: 55, duration: 1500, regen: 2, color: '#EEFF8Dff' },
  },
  { type: 'item', id: 'BlackSoup', emoji: '', tier: 3, weight: 1, stack: 10,
    Food: { health: 50, stamina: 17, duration: 1200, regen: 3, color: '#8b0e0eff' },
  },
  { type: 'item', id: 'ShocklateSmoothie', emoji: '', tier: 3, weight: 1, stack: 10,
    Food: { health: 16, stamina: 50, duration: 1200, regen: 1, color: '#8b0e0eff' },
  },
  { type: 'item', id: 'Entrails', tier: 3, weight: 0.3, stack: 50 },
  { type: 'item', id: 'Sausages', emoji: '🌭', tier: 3, weight: 0.5, stack: 20,
    Food: { health: 55, stamina: 18, duration: 1500, regen: 3, color: '#ce703eff' },
  },
  { type: 'item', id: 'MeadBaseFrostResist', iconId: 'resource/MeadBase', tier: 1, weight: 1, stack: 1 },
  { type: 'item', id: 'MeadFrostResist', emoji: '\u{1F9EA}', tier: 1, weight: 1, stack: 10,
    Potion: { damageModifiers: { frost: 'resistant' }, cooldown: 600 },
  },
  { type: 'item', group: 'lumber', id: 'ElderBark', tier: 3, weight: 2, stack: 50, floating: true },
  { type: 'item', group: 'ore', id: 'IronScrap', tier: 3, weight: 10, stack: 30, teleportable: false },
  { type: 'item', group: 'metal', id: 'Iron', tier: 3, weight: 12, stack: 30, teleportable: false, tags: ['metal'] },
  { type: 'item', id: 'IronNails', tier: 3, weight: 0.5, stack: 100 },
  { type: 'item', id: 'SharpeningStone', tier: 3, weight: 6, stack: 20 },
  { type: 'item', id: 'WitheredBone', emoji: '🦴', tier: 3, weight: 1, stack: 30, floating: true, summon: ['Bonemass', 10] },
  { type: 'trophy', id: 'TrophyLeech', trophyPos: { x: 0, y: 2 }, emoji: '🧛', tier: 3, weight: 2, stack: 20 },
  { type: 'trophy', id: 'TrophyBlob', trophyPos: { x: 6, y: 2 }, tier: 3, weight: 2, stack: 20 },
  { type: 'trophy', id: 'TrophySurtling', trophyPos: { x: 0, y: 5 }, tier: 3, weight: 1, stack: 20 /* lightRadius: 2, */ }, 
  { type: 'trophy', id: 'TrophyDraugr', trophyPos: { x: 1, y: 2 }, emoji: '🧟', tier: 3, weight: 2, stack: 20 },
  { type: 'trophy', id: 'TrophyDraugrElite', trophyPos: { x: 2, y: 2 }, emoji: '🧟', tier: 3, weight: 2, stack: 20 },
  { type: 'trophy', id: 'TrophyWraith', trophyPos: { x: 4, y: 2 }, emoji: '👻', tier: 3, weight: 1, stack: 20 },
  { type: 'trophy', id: 'TrophyAbomination', trophyPos: { x: 5, y: 2 }, emoji: '🥦', tier: 3, weight: 4, stack: 20 },
  { type: 'trophy', id: 'TrophyBonemass', trophyPos: { x: 3, y: 2 }, emoji: '🦠', tier: 4, weight: 2, stack: 20, floating: true, power: 'GP_Bonemass' },
// OCEAN
  { type: 'item', id: 'Chitin', tier: 2, weight: 2, stack: 50 },
  { type: 'item', id: 'SerpentScale', tier: 3, weight: 2, stack: 50 },
  { type: 'item', id: 'SerpentMeat', tier: 3, weight: 10, stack: 50, floating: true },
  { type: 'item', id: 'SerpentMeatCooked', emoji: '🍣', tier: 3, weight: 10, stack: 50,
    Food: { health: 70, stamina: 23, duration: 1500, regen: 3, color: '#c27538ff' },
  },
  { type: 'item', id: 'SerpentStew', emoji: '🍜', tier: 3, weight: 1, stack: 10,
    Food: { health: 80, stamina: 26, duration: 1800, regen: 4, color: '#dd8049ff' },
  },
  { type: 'trophy', id: 'TrophySerpent', trophyPos: { x: 1, y: 5 }, tier: 3, weight: 25, stack: 20 },
// MOUNTAIN
  { type: 'item', group: 'hide', id: 'WolfPelt', tier: 4, weight: 1, stack: 50 },
  { type: 'item', id: 'WolfFang', tier: 4, weight: 0.1, stack: 50 },
  { type: 'item', id: 'WolfMeat', tier: 4, weight: 1, stack: 20 },
  { type: 'item', id: 'RottenMeat', tier: 4, weight: 0.5, stack: 20 },
  { type: 'item', id: 'Onion', emoji: '', tier: 4, weight: 0.3, stack: 50,
    Food: { health: 13, stamina: 40, duration: 900, regen: 1, color: '#FF7115FF' },
  },
  { type: 'item', id: 'WolfClaw', emoji: '', tier: 4, weight: 0.5, stack: 20 },
  { type: 'item', id: 'WolfHairBundle', emoji: '', tier: 4, weight: 1, stack: 50 },
  { type: 'item', id: 'JuteRed', emoji: '', tier: 4, weight: 2, stack: 50 },
  { type: 'item', group: 'seedVeg', id: 'OnionSeeds', emoji: '', tier: 4, weight: 0.1, stack: 100 },
  { type: 'item', id: 'FreezeGland', tier: 4, weight: 0.5, stack: 50 },
  { type: 'item', group: 'ore', id: 'SilverOre', tier: 4, weight: 14, stack: 30, teleportable: false },
  { type: 'item', group: 'metal', id: 'Silver', tier: 4, weight: 14, stack: 30, teleportable: false, tags: ['metal'] },
  { type: 'item', id: 'Obsidian', tier: 4, weight: 2, stack: 50 },
  { type: 'item', id: 'Crystal', emoji: '💎', tier: 4, weight: 8, stack: 50 },
  { type: 'item', id: 'DragonEgg', emoji: '🥚', tier: 4, weight: 200, stack: 1,
    floating: true, teleportable: false, summon: ['Dragon', 3], // respawn: 8 * HOUR
  },
  { type: 'trophy', id: 'TrophyWolf', trophyPos: { x: 0, y: 3 }, tier: 4, weight: 1.5, stack: 20 },
  { type: 'trophy', id: 'TrophyFenring', trophyPos: { x: 1, y: 3 }, tier: 4, weight: 2, stack: 20 },
  { type: 'trophy', id: 'TrophyUlv', trophyPos: { x: 5, y: 3 }, tier: 4, weight: 1.5, stack: 20 },
  { type: 'trophy', id: 'TrophyCultist', trophyPos: { x: 6, y: 3 }, tier: 4, weight: 3, stack: 20 },
  { type: 'trophy', id: 'TrophyHatchling', trophyPos: { x: 4, y: 3 }, tier: 4, weight: 2, stack: 20 },
  { type: 'trophy', id: 'TrophySGolem', trophyPos: { x: 2, y: 3 }, tier: 4, weight: 2, stack: 20 },
  { type: 'trophy', id: 'TrophyDragonQueen', trophyPos: { x: 3, y: 3 }, tier: 5, weight: 2, stack: 20, floating: true, power: 'GP_Moder' },
  { type: 'item', id: 'CookedWolfMeat', emoji: '', tier: 4, weight: 1, stack: 20,
    Food: { health: 45, stamina: 15, duration: 1200, regen: 3, color: '#973C3AFF' },
  },
  { type: 'item', id: 'WolfMeatSkewer', emoji: '', tier: 4, weight: 0.5, stack: 20,
    Food: { health: 65, stamina: 21, duration: 1500, regen: 3, color: '#973C3AFF' },
  },
  { type: 'item', id: 'WolfJerky', emoji: '', tier: 4, weight: 0.5, stack: 20,
    Food: { health: 33, stamina: 33, duration: 1800, regen: 3, color: '#5D3D28FF' },
  },
  { type: 'item', id: 'Eyescream', emoji: '🍦', tier: 4, weight: 0.5, stack: 10,
    Food: { health: 21, stamina: 65, duration: 1500, regen: 1, color: '#82FCFFff' },
  },
  { type: 'item', id: 'OnionSoup', emoji: '', tier: 4, weight: 1, stack: 10,
    Food: { health: 20, stamina: 60, duration: 1200, regen: 1, color: '#C56B37ff' },
  },
  { type: 'item', id: 'DragonTear', tier: 5, weight: 1, stack: 50, floating: true },
// PLAINS
  { type: 'item', id: 'Flax', tier: 5, weight: 0.2, stack: 100, tags: ['plant', 'crop'],
/*    recipe: { type: 'craft_one', time: 4500, materials: { Flax: 1 },
              source: { station: CraftingStation.Cultivator }, number: 2 },*/
  },
  { type: 'item', id: 'LinenThread', tier: 5, weight: 2, stack: 50 },
  { type: 'item', id: 'Barley', emoji: '🌾', tier: 5, weight: 0.2, stack: 100, tags: ['plant', 'crop'],
/*    recipe: { type: 'craft_one', time: 4500, materials: { Barley: 1 },
              source: { station: CraftingStation.Cultivator }, number: 2 },*/
  },
  { type: 'item', id: 'BarleyFlour', tier: 5, weight: 0.2, stack: 20 },
  { type: 'item', group: 'berry', id: 'Cloudberry', emoji: '🟠', tier: 5, weight: 0.1, stack: 50, tags: ['plant'],
    Food: { health: 13, stamina: 40, duration: 900, regen: 1, color: '#ffde87ff' },
    grow: itemGrow({ locations: ['Plains'], altitude: [2, 50], tilt: [0, 30], num: [1, 3], group: [15, 20], respawn: 5 * HOUR }),
  },
  { type: 'item', id: 'LoxMeat', tier: 5, weight: 2, stack: 20 },
  { type: 'item', group: 'hide', id: 'LoxPelt', tier: 5, weight: 1, stack: 50 },
  { type: 'item', id: 'CookedLoxMeat', emoji: '🍖', tier: 5, weight: 2, stack: 20,
    Food: { health: 50, stamina: 16, duration: 1200, regen: 4, color: '#d9a169ff' },
  },
  { type: 'item', id: 'BloodPudding', emoji: '🧆', tier: 5, weight: 1, stack: 10,
    Food: { health: 25, stamina: 75, duration: 1800, regen: 2, color: '#8b0e0eff' },
  },
  { type: 'item', id: 'BreadDough', emoji: '', tier: 5, weight: 0.5, stack: 20 },
  { type: 'item', id: 'Bread', emoji: '🍞', tier: 5, weight: 0.5, stack: 20,
    Food: { health: 23, stamina: 70, duration: 1500, regen: 2, color: '#ffca87ff' },
  },
  { type: 'item', id: 'FishWraps', emoji: '🌯', tier: 5, weight: 1, stack: 10,
    Food: { health: 70, stamina: 23, duration: 1500, regen: 4, color: '#ffe2b6ff' },
  },
  { type: 'item', id: 'LoxPieUncooked', emoji: '', tier: 5, weight: 1, stack: 10 },
  { type: 'item', id: 'LoxPie', emoji: '🥧', tier: 5, weight: 1, stack: 10,
    Food: { health: 75, stamina: 24, duration: 1800, regen: 4, color: '#ffcf33ff' },
  },
  { type: 'item', id: 'MeadBaseStaminaMedium', iconId: 'resource/MeadBase', tier: 1, weight: 1, stack: 1 },
  { type: 'item', id: 'MeadStaminaMedium', emoji: '\u{1F9EA}', tier: 1, weight: 1, stack: 10,
    Potion: { stamina: [160, 2], cooldown: 120 },
  },
  { type: 'item', id: 'BarleyWineBase', tier: 5, weight: 1, stack: 1 },
  { type: 'item', id: 'BarleyWine', emoji: '\u{1F9EA}', tier: 5, weight: 1, stack: 10,
    Potion: { damageModifiers: { fire: 'resistant' }, cooldown: 600 },
  },
  { type: 'item', id: 'Tar', emoji: '⚫', tier: 5, weight: 2, stack: 50 }, // Pickable
  { type: 'item', id: 'Needle', emoji: '🪡', tier: 5, weight: 0.5, stack: 50 },
  { type: 'item', group: 'ore', id: 'BlackMetalScrap', tier: 5, weight: 10, stack: 30, teleportable: false },
  { type: 'item', group: 'metal', id: 'BlackMetal', tier: 5, weight: 12, stack: 30, teleportable: false, tags: ['metal'] },
  { type: 'item', id: 'SaddleLox', tier: 5, weight: 10, stack: 1 },
  { type: 'item', id: 'GoblinTotem', tier: 5, weight: 1, stack: 30, summon: ['GoblinKing', 5] },
  { type: 'trophy', id: 'TrophyLox', trophyPos: { x: 4, y: 4 }, tier: 5, weight: 2, stack: 20 },
  { type: 'trophy', id: 'TrophyDeathsquito', trophyPos: { x: 5, y: 4 }, tier: 5, weight: 0.5, stack: 20 },
  { type: 'trophy', id: 'TrophyGrowth', trophyPos: { x: 6, y: 4 }, tier: 5, weight: 1, stack: 20 },
  { type: 'trophy', id: 'TrophyGoblin', trophyPos: { x: 0, y: 4 }, tier: 5, weight: 2, stack: 20 },
  { type: 'trophy', id: 'TrophyGoblinBrute', trophyPos: { x: 1, y: 4 }, tier: 5, weight: 2, stack: 20 },
  { type: 'trophy', id: 'TrophyGoblinShaman', trophyPos: { x: 2, y: 4 }, tier: 5, weight: 0.5, stack: 20 },
  { type: 'trophy', id: 'TrophyGoblinKing', trophyPos: { x: 3, y: 4 }, tier: 5, weight: 1, stack: 20, floating: true, power: 'GP_Yagluth' },
  { type: 'item', id: 'Yagluththing', tier: 5, weight: 0.1, stack: 1, floating: true },
// FLAME
  { type: 'item', group: 'ore', id: 'FlametalOre', tier: 6, weight: 12, stack: 30, teleportable: false },
  { type: 'item', group: 'metal', id: 'Flametal', tier: 6, weight: 12, stack: 30, teleportable: false },
];
for (const item of resources) {
  item.components = ['ItemDrop', 'ZSyncTransform'];
  if ('grow' in item) {
    item.components.push('Pickable');
  }
}

const summonMap: Partial<Record<EntityId, Resource['summon']>> = {};
resources.forEach(r => {
  if (r.type === 'item' && r.summon) {
    const [id, number] = r.summon;
    summonMap[id] = [r.id, number];
  }
});

export const getSummon = (id: EntityId): Resource['summon'] => {
  return summonMap[id];
}

// VegvisirShard_Bonemass
// HealthUpgrade_Bonemass
// HealthUpgrade_GDKing
// StaminaUpgrade_Greydwarf
// StaminaUpgrade_Troll
// StaminaUpgrade_Wraith
