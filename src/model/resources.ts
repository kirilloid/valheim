import { Item, CraftingStation, Biome, DamageType, EntityId, Resource } from "../types";

const CAULDRON_TIME = 3;
const FORGE_TIME = 2;
const STONECUTTER_TIME = 2;
// artisan table = 1
// workbench = 1
const KILN_TIME = 15;
const SMELTER_TIME = 30;
const FURNACE_TIME = 30;
const SPIN_WHEEL_TIME = 30;
const FERMENT_TIME = 2400;
const HOUR = 3600;

export const resources: Item[] = [
// MEADOWS
  { type: 'item', id: 'Wood', emoji: '🪵', tier: 0, weight: 2, stack: 50, floating: true },
  { type: 'item', id: 'Coal', tier: 2, weight: 2, stack: 50,
    recipe: { time: KILN_TIME, materials: { wood: 1 },
              source: { station: CraftingStation.CharcoalKiln }, number: 1 } },
  { type: 'item', id: 'Resin', tier: 1, weight: 0.3, stack: 50 },
  { type: 'item', id: 'Feathers', emoji: '🪶', tier: 1, weight: 0.1, stack: 50 },
  { type: 'item', id: 'Stone', emoji: '🪨', tier: 0, weight: 2, stack: 50 },
  { type: 'item', id: 'Flint', tier: 1, weight: 2, stack: 30,
    recipe: { biomes: [Biome.Meadows, Biome.BlackForest], abundance: 1, num: [30, 30], group: [1, 1], respawn: 4 * HOUR } },
  { type: 'item', id: 'LeatherScraps', tier: 1, weight: 0.5, stack: 50 },
  { type: 'item', id: 'DeerHide', tier: 1, weight: 1, stack: 50 },
  { type: 'item', id: 'QueenBee', emoji: '🐝', tier: 1, weight: 0.2, stack: 20 },
  { type: 'item', id: 'BeechSeeds', tier: 1, weight: 0.1, stack: 100 },
  { type: 'food', id: 'Raspberry', emoji: '🍓', tier: 1, weight: 0.1, stack: 50,
    health: 10, stamina: 20, duration: 600, regen: 1, color: '#ff7a7aff',
    recipe: { biomes: [Biome.Meadows], abundance: 1, num: [1, 1], group: [3, 8], inForest: [1, 1.2], respawn: 5 * HOUR } },
  { type: 'food', id: 'Mushroom', emoji: '🍄🔴', tier: 1, weight: 0.1, stack: 50,
    health: 15, stamina: 20, duration: 600, regen: 1, color: '#ff7353ff',
    recipe: { biomes: [Biome.Meadows, Biome.BlackForest, /* Biome.Swamp, yes but minAlt=1 */], abundance: 1, num: [1, 2], group: [3, 6], inForest: [0, 1], respawn: 4 * HOUR } },
  { type: 'item', id: 'Dandelion', tier: 0, weight: 0.1, stack: 50,
    recipe: { biomes: [Biome.Meadows], abundance: 1, num: [8, 10], group: [1, 3], respawn: 4 * HOUR } },
  { type: 'food', id: 'Honey', emoji: '🍯', tier: 1, weight: 0.2, stack: 50,
    health: 20, stamina: 20, duration: 300, regen: 5, color: '#ffae00ff' },
  { type: 'item', id: 'RawMeat', emoji: '🥩', tier: 0, weight: 1, stack: 20 },
  { type: 'food', id: 'CookedMeat', emoji: '🍗', tier: 1, weight: 1, stack: 20,
    health: 40, stamina: 30, duration: 1200, regen: 2, color: '#ab7862ff',
    recipe: { time: 25, materials: { RawMeat: 1 },
              source: { station: CraftingStation.CookingStation }, number: 1 } },
  { type: 'item', id: 'NeckTail', tier: 0, weight: 0.5, stack: 50 },
  { type: 'food', id: 'NeckTailGrilled', emoji: '🥓', tier: 1, weight: 0.5, stack: 50,
    health: 35, stamina: 20, duration: 1000, regen: 2, color: '#c59645ff',
    recipe: { time: 20, materials: { NeckTail: 1 },
              source: { station: CraftingStation.CookingStation }, number: 1 } },
  { type: 'item', id: 'FishRaw', emoji: '🐟', tier: 0, weight: 1, stack: 20 },
  { type: 'food', id: 'FishCooked', emoji: '🍣', tier: 1, weight: 1, stack: 20,
    health: 45, stamina: 25, duration: 1200, regen: 2, color: '#ce8550ff',
    recipe: { time: 25, materials: { FishRaw: 1 },
              source: { station: CraftingStation.CookingStation }, number: 1 } },
  { type: 'potion', id: 'MeadHealthMinor', emoji: '\u{1F9EA}', tier: 1, weight: 1, stack: 10,
    health: [50, 10], cooldown: 120, 
    recipe: { time: FERMENT_TIME, materials: { Honey: 10, Blueberries: 5, Raspberry: 10, Dandelion: 1 },
              source: { station: CraftingStation.Fermenter }, number: 6 } },
  { type: 'potion', id: 'MeadStaminaMinor', emoji: '\u{1F9EA}', tier: 1, weight: 1, stack: 10,
    stamina: [80, 2], cooldown: 120, 
    recipe: { time: FERMENT_TIME, materials: { Honey: 10, Raspberry: 10, MushroomYellow: 10 },
              source: { station: CraftingStation.Fermenter }, number: 6 } },
  { type: 'potion', id: 'MeadTasty', emoji: '\u{1F9EA}', tier: 1, weight: 1, stack: 10,
    staminaRegen: 4, healthRegen: 0.5, cooldown: 120, 
    recipe: { time: FERMENT_TIME, materials: { Honey: 10, Blueberries: 5, Raspberry: 10 },
              source: { station: CraftingStation.Fermenter }, number: 6 } },
  { type: 'item', id: 'TrophyBoar', emoji: '🐗', tier: 1, weight: 2, stack: 50 },
  { type: 'item', id: 'TrophyDeer', emoji: '🦌', tier: 1, weight: 2, stack: 50, summon: ['Eikthyr', 2] },
  { type: 'item', id: 'TrophyNeck', emoji: '🦎', tier: 1, weight: 0.5, stack: 50 },
  { type: 'item', id: 'TrophyEikthyr', emoji: '🦌', tier: 2, weight: 2, stack: 20, floating: true, power: 'Eikthyr' },
  { type: 'item', id: 'HardAntler', tier: 2, weight: 2, stack: 50, floating: true },
// BLACK FOREST
  { type: 'item', id: 'FirCone', tier: 2, weight: 0.1, stack: 100, floating: true },
  { type: 'item', id: 'PineCone', tier: 2, weight: 0.1, stack: 100, floating: true },
  { type: 'item', id: 'FineWood', tier: 2, weight: 2, stack: 50, floating: true },
  { type: 'item', id: 'GreydwarfEye', tier: 2, weight: 0.2, stack: 50 },
  { type: 'item', id: 'BoneFragments', emoji: '🦴', tier: 2, weight: 0.5, stack: 50 },
  { type: 'item', id: 'SurtlingCore', emoji: '🟥', tier: 2, weight: 5, stack: 10 },
  { type: 'item', id: 'AncientSeed', emoji: '🌰', tier: 2, weight: 1, stack: 50, summon: ['gd_king', 3] },
  { type: 'item', id: 'RoundLog', tier: 2, weight: 2, stack: 50 },
  { type: 'item', id: 'TrollHide', tier: 2, weight: 2, stack: 20 },
  { type: 'item', id: 'CopperOre', tier: 2, weight: 10, stack: 30, teleportable: false },
  { type: 'item', id: 'Copper', tier: 2, weight: 10, stack: 30, teleportable: false,
    recipe: { time: SMELTER_TIME, materials: { CopperOre: 1, Coal: 2 },
              source: { station: CraftingStation.Smelter }, number: 1 } },
  { type: 'item', id: 'TinOre', tier: 2, weight: 8, stack: 30, teleportable: false },
  { type: 'item', id: 'Tin', tier: 2, weight: 8, stack: 30, teleportable: false,
    recipe: { time: SMELTER_TIME, materials: { TinOre: 1, Coal: 2 },
              source: { station: CraftingStation.Smelter }, number: 1 } },
  { type: 'item', id: 'Bronze', tier: 2, weight: 12, stack: 30, teleportable: false,
    recipe: { time: FORGE_TIME, materials: { Copper: 2, Tin: 1 },
              source: { station: CraftingStation.Smelter }, number: 1 } },
  { type: 'item', id: 'BronzeNails', tier: 2, weight: 0.5, stack: 100, teleportable: false,
    recipe: { time: FORGE_TIME, materials: { Bronze: 1 },
              source: { station: CraftingStation.Forge }, number: 20 } },
  { type: 'value', id: 'Coins', emoji: '🪙', tier: 2, weight: 0.1, stack: 999, value: 1 },
  { type: 'value', id: 'Ruby', emoji: '♦️', tier: 2, weight: 0.1, stack: 20, value: 20 },
  { type: 'value', id: 'Amber', emoji: '🍕', tier: 2, weight: 0.1, stack: 20, value: 5 },
  { type: 'value', id: 'AmberPearl', emoji: '🟡', tier: 2, weight: 0.1, stack: 50, value: 10 },
  { type: 'value', id: 'SilverNecklace', emoji: '💍', tier: 2, weight: 0.1, stack: 50, value: 30 },
  { type: 'item', id: 'YmirRemains', tier: 2, weight: 0.3, stack: 50, recipe: { value: 120 } },
  { type: 'item', id: 'FishingBait', tier: 2, weight: 0.1, stack: 100, recipe: { value: 10, number: 50 } },
  { type: 'food', id: 'Blueberries', emoji: '🫐', tier: 2, weight: 0.1, stack: 50,
    health: 15, stamina: 20, duration: 600, regen: 1, color: '#568cffff',
    recipe: { biomes: [Biome.BlackForest], abundance: 1, num: [1, 2], group: [2, 3], respawn: 5 * HOUR } },
  { type: 'food', id: 'QueensJam', emoji: '🧁', tier: 2, weight: 0.1, stack: 50,
    health: 30, stamina: 40, duration: 1200, regen: 2, color: '#ff0084ff',
    recipe: { time: CAULDRON_TIME, materials: { Raspberry: 8, Blueberries: 8 },
              source: { station: CraftingStation.Cauldron }, number: 4 } },
  { type: 'food', id: 'MushroomYellow', emoji: '🍄🟡', tier: 2, weight: 0.1, stack: 50,
    health: 20, stamina: 20, duration: 600, regen: 1, color: '#e7c84bff',
    recipe: { biomes: [Biome.BlackForest, Biome.Swamp], abundance: 1,
      // TODO check the numbers
      num: [1, 2], group: [2, 3],
      respawn: 4 * HOUR } },
  { type: 'food', id: 'MushroomBlue', emoji: '🍄🔵', tier: 2, weight: 0.1, stack: 50,
    health: 20, stamina: 20, duration: 600, regen: 1, color: '#4be1e7ff' },
  { type: 'potion', id: 'MeadHealthMedium', emoji: '\u{1F9EA}', tier: 1, weight: 1, stack: 10,
    health: [75, 10], cooldown: 120,
    recipe: { time: FERMENT_TIME, materials: { Honey: 10, Bloodbag: 4, Raspberry: 10, Dandelion: 1 },
              source: { station: CraftingStation.Fermenter }, number: 6 } },
  { type: 'potion', id: 'MeadPoisonResist', emoji: '\u{1F9EA}', tier: 1, weight: 1, stack: 10,
    resist: [DamageType.Poison], cooldown: 600,
    recipe: { time: FERMENT_TIME, materials: { Honey: 10, Thistle: 5, Coal: 10, NeckTail: 1 },
              source: { station: CraftingStation.Fermenter }, number: 6 } },
  { type: 'item', id: 'Thistle', emoji: '🌿', tier: 2, weight: 0.1, stack: 50,
    recipe: { biomes: [Biome.BlackForest, Biome.Swamp], abundance: 1, num: [1, 2], group: [2, 5], respawn: 4 * HOUR } },
  { type: 'item', id: 'CarrotSeeds', tier: 2, weight: 0.1, stack: 100,
    recipe: { biomes: [Biome.BlackForest], abundance: 1, num: [0, 0.5], group: [1, 2], respawn: 0 } },
  { type: 'food', id: 'Carrot', emoji: '🥕', tier: 2, weight: 0.3, stack: 50,
    health: 15, stamina: 15, duration: 600, regen: 1, color: '#ff7115ff' },
  { type: 'food', id: 'CarrotSoup', emoji: '🥣', tier: 2, weight: 1, stack: 10,
    health: 20, stamina: 60, duration: 1500, regen: 2, color: '#f17d3aff',
    recipe: { time: CAULDRON_TIME, materials: { Mushroom: 1, Carrot: 3 },
              source: { station: CraftingStation.Cauldron }, number: 1 } },
  { type: 'item', id: 'TrophySkeleton', emoji: '💀', tier: 2, weight: 0.5, stack: 20 },
  { type: 'item', id: 'TrophySkeletonPoison', emoji: '☠️', tier: 2, weight: 0.5, stack: 20 },
  { type: 'item', id: 'TrophyGreydwarf', tier: 2, weight: 1, stack: 20 },
  { type: 'item', id: 'TrophyGreydwarfBrute', tier: 2, weight: 1.5, stack: 20 },
  { type: 'item', id: 'TrophyGreydwarfShaman', tier: 2, weight: 1, stack: 20 },
  { type: 'item', id: 'TrophyFrostTroll', tier: 2, weight: 4, stack: 20 },
  { type: 'item', id: 'TrophyTheElder', tier: 3, weight: 4, stack: 20, floating: true, power: 'gd_king' },
  { type: 'item', id: 'CryptKey', emoji: '🗝️', tier: 3, weight: 0.1, stack: 1, floating: true },
  // SWAMP
  { type: 'item', id: 'Ooze', tier: 3, weight: 0.5, stack: 50 },
  { type: 'item', id: 'Guck', tier: 3, weight: 0.5, stack: 50 },
  { type: 'item', id: 'Chain', emoji: '⛓️', tier: 3, weight: 2, stack: 50 },
  { type: 'item', id: 'Bloodbag', emoji: '🩸', tier: 3, weight: 0.5, stack: 50 },
  { type: 'item', id: 'Turnip', tier: 3, emoji: '🍆', weight: 0.3, stack: 50 },
  { type: 'item', id: 'TurnipSeeds', tier: 3, weight: 0.1, stack: 100,
    recipe: { biomes: [Biome.Swamp], abundance: 1, num: [0, 0.5], group: [1, 2], respawn: 0 } },
  { type: 'food', id: 'TurnipStew', emoji: '🍲', tier: 3, weight: 1, stack: 10,
    health: 50, stamina: 50, duration: 1600, regen: 2, color: '#eeff8dff',
    recipe: { time: CAULDRON_TIME, materials: { RawMeat: 1, Turnip: 3 },
              source: { station: CraftingStation.Cauldron }, number: 1 } },
  { type: 'item', id: 'Entrails', tier: 3, weight: 0.3, stack: 50 },
  { type: 'food', id: 'Sausages', emoji: '🌭', tier: 3, weight: 0.5, stack: 20,
    health: 60, stamina: 40, duration: 1600, regen: 3, color: '#ce703eff',
    recipe: { time: CAULDRON_TIME, materials: { Entrails: 2, RawMeat: 1, Thistle: 4 },
              source: { station: CraftingStation.Cauldron }, number: 4 } },
  { type: 'potion', id: 'MeadFrostResist', emoji: '\u{1F9EA}', tier: 1, weight: 1, stack: 10,
    resist: [DamageType.Frost], cooldown: 600,
    recipe: { time: FERMENT_TIME, materials: { Honey: 10, Thistle: 5, Coal: 10, NeckTail: 1 },
              source: { station: CraftingStation.Fermenter }, number: 6 } },
  { type: 'item', id: 'ElderBark', tier: 3, weight: 2, stack: 50, floating: true },
  { type: 'item', id: 'IronScrap', tier: 3, weight: 10, stack: 30, teleportable: false },
  { type: 'item', id: 'Iron', tier: 3, weight: 12, stack: 30, teleportable: false,
    recipe: { time: SMELTER_TIME, materials: { IronScrap: 1, Coal: 2 },
              source: { station: CraftingStation.Smelter }, number: 1 } },
  { type: 'item', id: 'IronNails', tier: 3, weight: 0.5, stack: 100, teleportable: false,
    recipe: { time: FORGE_TIME, materials: { Iron: 1 },
              source: { station: CraftingStation.Forge }, number: 10 } },
  { type: 'item', id: 'SharpeningStone', tier: 3, weight: 6, stack: 20,
    recipe: { time: STONECUTTER_TIME, materials: { Stone: 5 },
              source: { station: CraftingStation.StoneCutter }, number: 1 } },
  { type: 'item', id: 'WitheredBone', emoji: '🦴', tier: 3, weight: 1, stack: 30, floating: true, summon: ['Bonemass', 10] },
  { type: 'item', id: 'TrophyLeech', emoji: '🧛', tier: 3, weight: 2, stack: 20 },
  { type: 'item', id: 'TrophyBlob', tier: 3, weight: 2, stack: 20 },
  { type: 'item', id: 'TrophySurtling', tier: 3, weight: 1, stack: 20 },
  { type: 'item', id: 'TrophyDraugr', emoji: '🧟', tier: 3, weight: 2, stack: 20 },
  { type: 'item', id: 'TrophyDraugrElite', emoji: '🧟', tier: 3, weight: 2, stack: 20 },
  { type: 'item', id: 'TrophyBonemass', emoji: '🦠', tier: 4, weight: 2, stack: 20, floating: true, power: 'Bonemass' },
// OCEAN
  { type: 'item', id: 'Chitin', tier: 4, weight: 2, stack: 50 },
  { type: 'item', id: 'SerpentScale', tier: 4, weight: 2, stack: 50 },
  { type: 'item', id: 'SerpentMeat', tier: 4, weight: 10, stack: 50, floating: true },
  { type: 'food', id: 'SerpentMeatCooked', emoji: '🍣', tier: 4, weight: 1, stack: 10,
    health: 70, stamina: 40, duration: 2000, regen: 3, color: '#c27538ff',
    recipe: { time: 60, materials: { SerpentMeat: 1 },
              source: { station: CraftingStation.CookingStation }, number: 1 } },
  { type: 'food', id: 'SerpentStew', emoji: '🍜', tier: 4, weight: 1, stack: 10,
    health: 80, stamina: 80, duration: 2400, regen: 4, color: '#dd8049ff',
    recipe: { time: CAULDRON_TIME, materials: { Mushroom: 1, SerpentMeatCooked: 1, Honey: 2 },
              source: { station: CraftingStation.Cauldron }, number: 1 } },
  { type: 'item', id: 'TrophySerpent', tier: 4, weight: 25, stack: 20 },
// MOUNTAIN
  { type: 'item', id: 'WolfPelt', tier: 4, weight: 1, stack: 50 },
  { type: 'item', id: 'WolfFang', tier: 4, weight: 0.1, stack: 50 },
  { type: 'item', id: 'FreezeGland', tier: 4, weight: 0.5, stack: 50 },
  { type: 'item', id: 'SilverOre', tier: 4, weight: 14, stack: 30, teleportable: false },
  { type: 'item', id: 'Silver', tier: 4, weight: 14, stack: 30, teleportable: false,
    recipe: { time: SMELTER_TIME, materials: { SilverOre: 1, Coal: 2 },
              source: { station: CraftingStation.Smelter }, number: 1 } },
  { type: 'item', id: 'Obsidian', tier: 4, weight: 2, stack: 50 },
  { type: 'item', id: 'Crystal', emoji: '💎', tier: 4, weight: 8, stack: 50 },
  { type: 'item', id: 'DragonEgg', emoji: '🥚', tier: 4, weight: 200, stack: 1,
    floating: true, teleportable: false, summon: ['Dragon', 3],
    recipe: { biomes: [Biome.Mountain], abundance: 1, num: [1, 1], group: [1, 1], respawn: 6 * HOUR } },
  { type: 'item', id: 'TrophyWolf', tier: 4, weight: 1.5, stack: 20 },
  { type: 'item', id: 'TrophyFenring', tier: 4, weight: 2, stack: 20 },
  { type: 'item', id: 'TrophyHatchling', tier: 4, weight: 2, stack: 20 },
  { type: 'item', id: 'TrophySGolem', tier: 4, weight: 2, stack: 20 },
  { type: 'item', id: 'TrophyDragonQueen', tier: 5, weight: 2, stack: 20, floating: true, power: 'Dragon' },
  { type: 'item', id: 'DragonTear', tier: 5, weight: 1, stack: 50, floating: true },
// PLAINS
  { type: 'item', id: 'Flax', tier: 5, weight: 0.2, stack: 100,
    recipe: { time: 4500, materials: { Flax: 1 },
              source: { station: CraftingStation.Cultivator }, number: 2 } },
  { type: 'item', id: 'LinenThread', tier: 5, weight: 2, stack: 50,
    recipe: { time: SPIN_WHEEL_TIME, materials: { Flax: 1 },
              source: { station: CraftingStation.SpinningWheel }, number: 1 } },
  { type: 'item', id: 'Barley', emoji: '🌾', tier: 5, weight: 0.2, stack: 100,
    recipe: { time: 4500, materials: { Barley: 1 },
              source: { station: CraftingStation.Cultivator }, number: 2 } },
  { type: 'item', id: 'BarleyFlour', tier: 5, weight: 0.2, stack: 20,
    recipe: { time: -1, materials: { Barley: 1 },
              source: { station: CraftingStation.Windmill }, number: 1 } },
  { type: 'food', id: 'Cloudberry', emoji: '🟠', tier: 5, weight: 0.1, stack: 50,
    health: 15, stamina: 25, duration: 800, regen: 1, color: '#ffde87ff',
    recipe: { biomes: [Biome.Plains], abundance: 1, num: [1, 3], group: [15, 20], respawn: 5 * HOUR } },
  { type: 'item', id: 'LoxMeat', tier: 5, weight: 1, stack: 20 },
  { type: 'item', id: 'LoxPelt', tier: 5, weight: 1, stack: 50 },
  { type: 'food', id: 'CookedLoxMeat', emoji: '🍖', tier: 5, weight: 1, stack: 20,
    health: 70, stamina: 40, duration: 2000, regen: 3, color: '#d9a169ff',
    recipe: { time: 60, materials: { LoxMeat: 1 },
              source: { station: CraftingStation.CookingStation }, number: 1 } },
  { type: 'food', id: 'BloodPudding', emoji: '🧆', tier: 5, weight: 1, stack: 10,
    health: 90, stamina: 50, duration: 2400, regen: 4, color: '#8b0e0eff',
    recipe: { time: CAULDRON_TIME, materials: { Bloodbag: 2, BarleyFlour: 4, Thistle: 2 },
              source: { station: CraftingStation.Cauldron }, number: 1 } },
  { type: 'food', id: 'Bread', emoji: '🍞', tier: 5, weight: 1, stack: 10,
    health: 40, stamina: 70, duration: 1800, regen: 2, color: '#ffca87ff',
    recipe: { time: CAULDRON_TIME, materials: { BarleyFlour: 10 },
              source: { station: CraftingStation.Cauldron }, number: 1 } },
  { type: 'food', id: 'FishWraps', emoji: '🌯', tier: 5, weight: 1, stack: 10,
    health: 60, stamina: 90, duration: 2400, regen: 4, color: '#ffe2b6ff',
    recipe: { time: CAULDRON_TIME, materials: { FishCooked: 2, BarleyFlour: 4 },
              source: { station: CraftingStation.Cauldron }, number: 1 } },
  { type: 'food', id: 'LoxPie', emoji: '🥧', tier: 5, weight: 1, stack: 10,
    health: 80, stamina: 80, duration: 2400, regen: 4, color: '#ffcf33ff',
    recipe: { time: CAULDRON_TIME, materials: { BarleyFlour: 4, Cloudberry: 2, CookedLoxMeat: 2 },
              source: { station: CraftingStation.Cauldron }, number: 1 } },
  { type: 'potion', id: 'MeadStaminaMedium', emoji: '\u{1F9EA}', tier: 1, weight: 1, stack: 10,
    stamina: [160, 2], cooldown: 120,
    recipe: { time: FERMENT_TIME, materials: { Honey: 10, Cloudberries: 10, MushroomYellow: 10 },
              source: { station: CraftingStation.Fermenter }, number: 6 } },
  { type: 'potion', id: 'BarleyWine', emoji: '\u{1F9EA}', tier: 5, weight: 1, stack: 10,
    resist: [DamageType.Fire], cooldown: 600,
    recipe: { time: FERMENT_TIME, materials: { Barley: 10, Cloudberries: 10 },
              source: { station: CraftingStation.Fermenter }, number: 6 } },
  { type: 'item', id: 'Needle', emoji: '🪡', tier: 5, weight: 0.5, stack: 50 },
  { type: 'item', id: 'BlackMetalScrap', tier: 5, weight: 10, stack: 30, teleportable: false },
  { type: 'item', id: 'BlackMetal', tier: 5, weight: 12, stack: 30, teleportable: false,
    recipe: { time: FURNACE_TIME, materials: { BlackMetalScrap: 1, Coal: 2 },
              source: { station: CraftingStation.BlastFurnace }, number: 1 } },
  { type: 'item', id: 'GoblinTotem', tier: 5, weight: 1, stack: 30, summon: ['GoblinKing', 5] },
  { type: 'item', id: 'TrophyLox', tier: 5, weight: 2, stack: 20 },
  { type: 'item', id: 'TrophyDeathsquito', tier: 5, weight: 0.5, stack: 20 },
  { type: 'item', id: 'TrophyGoblin', tier: 5, weight: 2, stack: 20 },
  { type: 'item', id: 'TrophyGoblinBrute', tier: 5, weight: 2, stack: 20 },
  { type: 'item', id: 'TrophyGoblinShaman', tier: 5, weight: 0.5, stack: 20 },
  { type: 'item', id: 'TrophyGoblinKing', tier: 5, weight: 1, stack: 20, floating: true, power: 'GoblinKing' },
  { type: 'item', id: 'Yagluththing', tier: 5, weight: 0.1, stack: 1, floating: true },
// FLAME
  { type: 'item', id: 'FlametalOre', tier: 6, weight: 12, stack: 30, teleportable: false },
  { type: 'item', id: 'Flametal', tier: 6, weight: 12, stack: 30, teleportable: false,
    recipe: { time: FURNACE_TIME, materials: { FlametalOre: 1, Coal: 2 },
              source: { station: CraftingStation.BlastFurnace }, number: 1 } },
];

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

// Tankard, Tankard_Odin

// VegvisirShard_Bonemass
// HealthUpgrade_Bonemass
// HealthUpgrade_GDKing
// StaminaUpgrade_Greydwarf
// StaminaUpgrade_Troll
// StaminaUpgrade_Wraith
