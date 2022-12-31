import { workbenchRecipe } from '../model/recipe';
import { Armor, GameObject, ItemRecipe } from '../types';

const mod = 'CustomDverger';

const circlets: Armor[] = [
  { id: '$customdvergeryellowearly', color: 'yellow', tier: 1, PointLight: { color: '#ffffc2', range: 20, intensity: 2 } },
  { id: '$customdvergerblackearly', color: 'black', tier: 1, PointLight: { color: '#cfcfcf', range: 20, intensity: 2 } },
  { id: '$customdvergerblack', color: 'black', tier: 4, PointLight: { color: '#cfcfcf', range: 30, intensity: 2 } },
  { id: '$customdvergerdarkblue', color: 'blue', tier: 4, PointLight: { color: '#b1b3ff', range: 30, intensity: 2 } },
  { id: '$customdvergergreen', color: 'green', tier: 4, PointLight: { color: '#c0ffc4', range: 30, intensity: 2 } },
  { id: '$customdvergerorange', color: 'orange', tier: 4, PointLight: { color: '#ffc6e9', range: 30, intensity: 2 } },
  { id: '$customdvergerpurple', color: 'purple', tier: 4, PointLight: { color: '#f5aaff', range: 30, intensity: 2 } },
  { id: '$customdvergerred', color: 'red', tier: 4, PointLight: { color: '#ffaaaa', range: 30, intensity: 2 } },
  { id: '$customdvergerwhite', color: 'white', tier: 4, PointLight: { color: '#ffffff', range: 30, intensity: 2 } },
  { id: '$customdvergeryellow', color: 'yellow', tier: 4, PointLight: { color: '#ffffc2', range: 30, intensity: 2 } },
].map<Armor>(({ id, color, tier, PointLight }) => (
  {
    id,
    iconId: `${mod}/${color}`,
    tier,
    type: 'armor', slot: 'head',
    special: 'light',
    armor: [0, 0],
    weight: 1,
    maxLvl: 1,
    durability: [Infinity, 0],
    moveSpeed: 0,
    PointLight,
  }
));

export const data: GameObject[] = [
  ...circlets,
].map(item => ({ ...item, mod }))

export const recipes: ItemRecipe[] = [
  workbenchRecipe(1, { Flint: 3, Resin: 3 }, { Flint: 1, Resin: 1 }, '$customdvergeryellowearly'),
  workbenchRecipe(1, { Flint: 3, Coal: 3 }, { Flint: 1, Coal: 1 }, '$customdvergerblackearly'),
  workbenchRecipe(2, { Silver: 3, SurtlingCore: 3, Crystal: 3, Coal: 3 }, { Silver: 1, SurtlingCore: 1, Crystal: 1 }, '$customdvergerblack'),
  workbenchRecipe(2, { Silver: 3, SurtlingCore: 3, Crystal: 3, Blueberries: 3 }, { Silver: 1, SurtlingCore: 1, Crystal: 1 }, '$customdvergerdarkblue'),
  workbenchRecipe(2, { Silver: 3, SurtlingCore: 3, Crystal: 3, Guck: 3 }, { Silver: 1, SurtlingCore: 1, Crystal: 1 }, '$customdvergergreen'),
  workbenchRecipe(2, { Silver: 3, SurtlingCore: 3, Crystal: 3, Carrot: 3 }, { Silver: 1, SurtlingCore: 1, Crystal: 1 }, '$customdvergerorange'),
  workbenchRecipe(2, { Silver: 3, SurtlingCore: 3, Crystal: 3, Turnip: 3 }, { Silver: 1, SurtlingCore: 1, Crystal: 1 }, '$customdvergerpurple'),
  workbenchRecipe(2, { Silver: 3, SurtlingCore: 3, Crystal: 3, Bloodbag: 3 }, { Silver: 1, SurtlingCore: 1, Crystal: 1 }, '$customdvergerred'),
  workbenchRecipe(2, { Silver: 3, SurtlingCore: 3, Crystal: 3, BoneFragments: 3 }, { Silver: 1, SurtlingCore: 1, Crystal: 1 }, '$customdvergerwhite'),
  workbenchRecipe(2, { Silver: 3, SurtlingCore: 3, Crystal: 3, MushroomYellow: 3 }, { Silver: 1, SurtlingCore: 1, Crystal: 1 }, '$customdvergeryellow'),
];
