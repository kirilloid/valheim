import type { EntityId, ItemRecipe } from '../types';

const CAULDRON_TIME = 3;
const SMELTER_TIME = 30;
const FERMENT_TIME = 3600;

export const genericRecipe = (
  station: EntityId,
  level: number,
  time: number,
  materials: Record<EntityId, number>,
  materialsPerLevel: Record<EntityId, number>,
  item: EntityId,
  number = 1,
  onlyOneIngredient = false,
): ItemRecipe => ({
  type: 'craft',
  time,
  onlyOneIngredient: onlyOneIngredient,
  materials,
  materialsPerLevel,
  source: { station, level },
  item,
  number,
});

export const inventoryRecipe = (
  materials: Record<EntityId, number>,
  item: EntityId,
  number = 1
) => genericRecipe('', 0, 3, materials, {}, item, number);

export const cauldronRecipe = (
  level: number,
  materials: Record<EntityId, number>,
  item: EntityId,
  number = 1,
  onlyOneIngredient = false,
) => genericRecipe('piece_cauldron', level, CAULDRON_TIME, materials, {}, item, number, onlyOneIngredient);

export const prepTableRecipe = (
  level: number,
  materials: Record<EntityId, number>,
  item: EntityId,
  number = 1,
  onlyOneIngredient = false,
) => genericRecipe('piece_preptable', level, CAULDRON_TIME, materials, {}, item, number, onlyOneIngredient);

export const potionRecipe = (
  cauldronLevel: number,
  materials: Record<EntityId, number>,
  meadBase: EntityId,
  mead: EntityId,
) => [
  genericRecipe('piece_MeadCauldron', cauldronLevel, CAULDRON_TIME, materials, {}, meadBase, 1),
  genericRecipe('fermenter', 1, FERMENT_TIME, { [meadBase]: 1 }, {}, mead, 6),
];

export const workbenchRecipe = (
  level: number,
  materials: Record<EntityId, number>,
  materialsPerLevel: Record<EntityId, number>,
  item: EntityId,
  number = 1,
) => genericRecipe('piece_workbench', level, 3, materials, materialsPerLevel, item, number);

export const forgeRecipe = (
  level: number,
  materials: Record<EntityId, number>,
  materialsPerLevel: Record<EntityId, number>,
  item: EntityId,
  number = 1
) => genericRecipe('forge', level, 3, materials, materialsPerLevel, item, number);

export const blackForgeRecipe = (
  level: number,
  materials: Record<EntityId, number>,
  materialsPerLevel: Record<EntityId, number>,
  item: EntityId,
  number = 1
) => genericRecipe('blackforge', level, 3, materials, materialsPerLevel, item, number);

export const mageTableRecipe = (
  level: number,
  materials: Record<EntityId, number>,
  materialsPerLevel: Record<EntityId, number>,
  item: EntityId,
  number = 1
) => genericRecipe('piece_magetable', level, 3, materials, materialsPerLevel, item, number);

export const smelterRecipe = (
  smelter: 'smelter' | 'blastfurnace',
  ore: EntityId,
  metal: EntityId,
) => genericRecipe(smelter, 1, SMELTER_TIME, { [ore]: 1, Coal: 2 }, {}, metal, 1);

const traderRecipe = (
  type: 'haldor' | 'hildir' | 'bogWitch',
) => (
  value: number,
  item: EntityId,
  { number = 1, killed }: { number?: number; killed?: EntityId } = {},
): ItemRecipe => ({
  type,
  value,
  item,
  number,
  killed,
});

export const haldorRecipe = traderRecipe('haldor');
export const hildirRecipe = traderRecipe('hildir');
export const bogWitchRecipe = traderRecipe('bogWitch');

