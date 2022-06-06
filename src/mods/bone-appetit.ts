import { cookingResist } from '../model/building';
import { genericRecipe } from '../model/recipe';
import { Armor, GameObject, ItemRecipe, MaterialType, Piece, Resource } from '../types';

const items: Resource[] = [
  {
    id: 'rk_pork', // Boar
    tier: 1, type: 'item', stack: 10, weight: 1,
  },
  {
    id: 'rk_egg', // Seagal
    tier: 1, type: 'item', stack: 20, weight: 1,
  },
  {
    id: 'rk_dragonegg', // Hatchling
    tier: 4, type: 'item', stack: 10, weight: 1,
  },
  { id: 'rk_butter', tier: 2, type: 'item', stack: 30, weight: 0.5,
    Food: { health: 10, stamina: 10, duration: 900, regen: 4, color: '#fff' }
  },
  { id: 'rk_nut_ella', tier: 2, type: 'item', stack: 20, weight: 1,
    Food: { health: 10, stamina: 10, duration: 900, regen: 4, color: '#fff' }
  },
  { id: 'rk_icecream', tier: 4, type: 'item', stack: 20, weight: 1,
    Food: { health: 60, stamina: 70, duration: 1600, regen: 4, color: '#fff' },
    Potion: { damageModifiers: { fire: 'veryResistant' }, cooldown: 300 },
  },
  { id: 'rk_porkrind', tier: 1, type: 'item', stack: 20, weight: 1,
    Food: { health: 35, stamina: 35, duration: 1200, regen: 2, color: '#fff' }
  },
  { id: 'rk_kabob', tier: 4, type: 'item', stack: 10, weight: 2,
    Food: { health: 50, stamina: 55, duration: 1600, regen: 3, color: '#fff' }
  },
  { id: 'rk_friedloxmeat', tier: 5, type: 'item', stack: 10, weight: 1,
    Food: { health: 80, stamina: 80, duration: 2400, regen: 4, color: '#fff' }
  },
  { id: 'rk_carrotsticks', tier: 2, type: 'item', stack: 20, weight: 0.5,
    Food: { health: 40, stamina: 40, duration: 1600, regen: 3, color: '#fff' }
  },
  { id: 'rk_bacon', tier: 1, type: 'item', stack: 20, weight: 0.4,
    Food: { health: 40, stamina: 30, duration: 1200, regen: 3, color: '#fff' }
  },
  { id: 'rk_smokedfish', tier: 2, type: 'item', stack: 10, weight: 1,
    Food: { health: 50, stamina: 50, duration: 1600, regen: 3, color: '#fff' }
  },
  { id: 'rk_pancake', tier: 5, type: 'item', stack: 20, weight: 0.5,
    Food: { health: 80, stamina: 80, duration: 2400, regen: 4, color: '#fff' }
  },
  { id: 'rk_pizza', tier: 5, type: 'item', stack: 10, weight: 0.5,
    Food: { health: 100, stamina: 50, duration: 2400, regen: 3, color: '#fff' }
  },
  { id: 'rk_coffee', tier: 2, type: 'item', stack: 10, weight: 0.5,
    Food: { health: 25, stamina: 60, duration: 900, regen: 5, color: '#fff' }
  },
  { id: 'rk_latte', tier: 4, type: 'item', stack: 10, weight: 1,
    Food: { health: 50, stamina: 100, duration: 1200, regen: 6, color: '#fff' }
  },
  { id: 'rk_firecream', tier: 4, type: 'item', stack: 20, weight: 1,
    Food: { health: 60, stamina: 70, duration: 900, regen: 4, color: '#fff' },
    Potion: { damageModifiers: { frost: 'veryResistant' }, cooldown: 300 },
  },
  { id: 'rk_electriccream', tier: 5, type: 'item', stack: 10, weight: 1,
    Food: { health: 60, stamina: 70, duration: 900, regen: 4, color: '#fff' },
    Potion: { damageModifiers: { poison: 'veryResistant' }, cooldown: 300 },
  },
  { id: 'rk_acidcream', tier: 4, type: 'item', stack: 20, weight: 1,
    Food: { health: 60, stamina: 70, duration: 900, regen: 4, color: '#fff' },
    Potion: { damageModifiers: { lightning: 'veryResistant' }, cooldown: 300 },
  },
  { id: 'rk_porridge', tier: 5, type: 'item', stack: 10, weight: 0.5,
    Food: { health: 80, stamina: 80, duration: 2400, regen: 3, color: '#fff' }
  },
  { id: 'rk_pbj', tier: 5, type: 'item', stack: 20, weight: 2,
    Food: { health: 80, stamina: 80, duration: 2400, regen: 4, color: '#fff' }
  },
  { id: 'rk_birthday', tier: 5, type: 'item', stack: 10, weight: 1,
    Food: { health: 80, stamina: 50, duration: 2400, regen: 4, color: '#fff' }
  },
  { id: 'rk_haggis', tier: 3, type: 'item', stack: 10, weight: 0.5,
    Food: { health: 55, stamina: 50, duration: 1600, regen: 3, color: '#fff' }
  },
  { id: 'rk_candiedturnip', tier: 3, type: 'item', stack: 10, weight: 1,
    Food: { health: 40, stamina: 60, duration: 1600, regen: 4, color: '#fff' }
  },
  { id: 'rk_moochi', tier: 4, type: 'item', stack: 10, weight: 0.5,
    Food: { health: 70, stamina: 60, duration: 1800, regen: 3, color: '#fff' }
  },
  { id: 'rk_broth', tier: 2, type: 'item', stack: 10, weight: 1,
    Food: { health: 10, stamina: 10, duration: 900, regen: 4, color: '#fff' }
  },
  { id: 'rk_fishstew', tier: 3, type: 'item', stack: 20, weight: 0.5,
    Food: { health: 50, stamina: 50, duration: 1600, regen: 4, color: '#fff' }
  },
  { id: 'rk_bloodsausage', tier: 3, type: 'item', stack: 20, weight: 1,
    Food: { health: 50, stamina: 50, duration: 1600, regen: 4, color: '#fff' }
  },
  { id: 'rk_burger', tier: 5, type: 'item', stack: 10, weight: 2,
    Food: { health: 80, stamina: 80, duration: 2400, regen: 4, color: '#fff' }
  },
  { id: 'rk_omlette', tier: 2, type: 'item', stack: 20, weight: 0.5,
    Food: { health: 50, stamina: 50, duration: 2000, regen: 4, color: '#fff' }
  },
  { id: 'rk_boiledegg', tier: 2, type: 'item', stack: 20, weight: 0.5,
    Food: { health: 40, stamina: 50, duration: 900, regen: 4, color: '#fff' }
  },
  { id: 'rk_glazedcarrots', tier: 2, type: 'item', stack: 10, weight: 1,
    Food: { health: 40, stamina: 40, duration: 1600, regen: 3, color: '#fff' }
  },
  { id: 'rk_mead', tier: 1, type: 'item', stack: 20, weight: 1,
    Food: { health: 50, stamina: 50, duration: 1600, regen: 8, color: '#fff' }
  },
];

const armors: Armor[] = [
  { id: 'rk_chef',
    tier: 1,
    type: 'armor', slot: 'head',
    armor: [1, 0],
    weight: 1,
    maxLvl: 1,
    durability: [Infinity, 0],
    moveSpeed: 0,
  },
]

const requiresFire = true;

const buildings: Piece[] = [
  {
    id: 'rk_grill',
    base: false,
    type: 'piece',
    components: ['CookingStation'],
    subtype: 'craft',
    group: 'cook',
    tier: 3,
    craft: {
      requiresFire,
    },
    wear: {
      hp: 20,
      damageModifiers: cookingResist,
      noRoof: false,
      noSupport: true,
      materialType: MaterialType.Stone,
    },
    recipe: { type: 'craft_piece', materials: { Stone: 10, Iron: 2 }, station: 'forge', }
  },
  {
    id: 'rk_griddle',
    base: false,
    type: 'piece',
    components: ['CookingStation'],
    subtype: 'craft',
    group: 'cook',
    tier: 1,
    craft: {
      requiresFire,
    },
    wear: {
      hp: 20,
      damageModifiers: cookingResist,
      noRoof: false,
      noSupport: true,
      materialType: MaterialType.Stone,
    },
    recipe: { type: 'craft_piece', materials: { Stone: 10 }, station: null, }
  },
  {
    id: 'rk_oven',
    base: false,
    type: 'piece',
    subtype: 'craft_ext',
    group: 'cook',
    extends: {
      id: 'rk_grill',
      distance: 3,
      requiresFire,
    },
    tier: 3,
    wear: {
      hp: 20,
      damageModifiers: cookingResist,
      noRoof: false,
      noSupport: true,
      materialType: MaterialType.Stone,
    },
    recipe: { type: 'craft_piece', materials: { SurtlingCore: 2, TrophySurtling: 1, Stone: 10 }, station: null, }
  },
  {
    id: 'rk_oven',
    base: false,
    type: 'piece',
    subtype: 'craft',
    group: 'cook',
    craft: {
      requiresFire,
    },
    tier: 3,
    wear: {
      hp: 20,
      damageModifiers: cookingResist,
      noRoof: false,
      noSupport: true,
      materialType: MaterialType.Stone,
    },
    recipe: { type: 'craft_piece', materials: { Wood: 4, Tin: 5, Stone: 3 }, station: 'forge', }
  },
  // rk_campfire, rk_hearth, rk_brazier
];

export const data: GameObject[] = [
  ...items,
  ...buildings,
  ...armors,
].map(item => ({ ...item, mod: 'BoneAppetit' }))

export const recipes: ItemRecipe[] = [
  genericRecipe('rk_prep', 1, 4, { FreezeGland: 4, Blueberries: 8, Honey: 2, rk_dragonegg: 1 }, {}, 'rk_icecream', 2),
  genericRecipe('rk_prep', 1, 4, { BeechSeeds: 6, rk_butter: 1 }, {}, 'rk_nut_ella'),
  genericRecipe('rk_prep', 1, 4, { Carrot: 2, rk_nut_ella: 1 }, {}, 'rk_carrotsticks'),
  genericRecipe('rk_prep', 1, 4, { rk_egg: 2 }, {}, 'rk_boiledegg'),
  genericRecipe('rk_prep', 1, 4, { CarrotSeeds: 8 }, {}, 'rk_butter', 2),
  genericRecipe('rk_prep', 1, 4, { BoneFragments: 2, rk_butter: 1 }, {}, 'rk_broth'),
  genericRecipe('rk_prep', 1, 4, { rk_broth: 2, FishRaw: 2, Thistle: 2, rk_egg: 2 }, {}, 'rk_fishstew'),
  genericRecipe('rk_grill', 1, 4, { RawMeat: 2, LoxMeat: 2, Turnip: 2, Bread: 1 }, {}, 'rk_burger'),
  genericRecipe('rk_grill', 1, 4, { Entrails: 2, Bloodbag: 2, Thistle: 1, rk_pork: 2 }, {}, 'rk_bloodsausage', 2),
  genericRecipe('rk_griddle', 1, 4, { rk_egg: 2, Thistle: 2, rk_pork: 1, rk_butter: 2 }, {}, 'rk_omlette'),
  genericRecipe('rk_griddle', 1, 4, { LeatherScraps: 1, rk_pork: 1 }, {}, 'rk_porkrind'),
  genericRecipe('rk_prep', 1, 4, { RawMeat: 1, Carrot: 2, Entrails: 2, Turnip: 2 }, {}, 'rk_haggis'),
  genericRecipe('rk_grill', 1, 4, { Thistle: 1, Honey: 2, Turnip: 2 }, {}, 'rk_candiedturnip'),
  genericRecipe('rk_prep', 1, 4, { rk_dragonegg: 1, Honey: 2, FreezeGland: 1, Blueberries: 4 }, {}, 'rk_moochi'),
  genericRecipe('rk_grill', 1, 4, { Turnip: 1, Carrot: 2, RawMeat: 1, BoneFragments: 2 }, {}, 'rk_kabob'),
  genericRecipe('rk_prep', 1, 4, { LoxMeat: 2, BarleyFlour: 2, rk_egg: 1, rk_butter: 2 }, {}, 'rk_friedloxmeat'),
  genericRecipe('rk_griddle', 1, 4, { Carrot: 3, Honey: 2, Dandelion: 2 }, {}, 'rk_glazedcarrots'),
  genericRecipe('rk_griddle', 1, 4, { rk_pork: 2 }, {}, 'rk_bacon', 2),
  genericRecipe('rk_griddle', 1, 4, { FishRaw: 1 }, {}, 'rk_smokedfish'),
  genericRecipe('rk_grill', 2, 4, { Honey: 2, BarleyFlour: 3, rk_butter: 5, rk_egg: 2 }, {}, 'rk_pancake'),
  genericRecipe('rk_grill', 2, 4, { Mushroom: 2, BarleyFlour: 3, rk_egg: 2, RawMeat: 2 }, {}, 'rk_pizza'),
  genericRecipe('rk_prep', 1, 4, { AncientSeed: 2 }, {}, 'rk_coffee'),
  genericRecipe('rk_prep', 2, 4, { Crystal: 2, Barley: 2, Honey: 10 }, {}, 'rk_latte', 2),
  genericRecipe('rk_prep', 2, 4, { SurtlingCore: 4, Raspberry: 8, Honey: 2, rk_dragonegg: 2 }, {}, 'rk_firecream', 2),
  genericRecipe('rk_prep', 2, 4, { Crystal: 4, Cloudberry: 8, Honey: 2, rk_dragonegg: 2 }, {}, 'rk_electriccream', 2),
  genericRecipe('rk_prep', 2, 4, { Guck: 4, MushroomYellow: 8, Honey: 2, rk_dragonegg: 2 }, {}, 'rk_acidcream', 2),
  genericRecipe('rk_grill', 2, 4, { Barley: 2, Cloudberry: 4, Honey: 2, rk_butter: 1 }, {}, 'rk_porridge'),
  genericRecipe('rk_grill', 1, 4, { Bread: 1, QueensJam: 1, rk_nut_ella: 4 }, {}, 'rk_pbj', 4),
  genericRecipe('rk_grill', 2, 4, { BarleyFlour: 2, Honey: 4, Cloudberry: 4, rk_egg: 2 }, {}, 'rk_birthday'),
  genericRecipe('', 0, 4, { Dandelion: 5 }, {}, 'rk_chef'),
  genericRecipe('rk_prep', 1, 4, { Barley: 3, Honey: 4 }, {}, 'rk_mead'),
];
