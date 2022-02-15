import type { DamageModifiers, EntityId, Piece } from '../types';
import { CraftingStation, MaterialType, mods } from '../types';

export const wearStructure = (
  hp: number,
  damageModifiers: DamageModifiers,
  materialType: MaterialType | undefined,
  { noRoof = true, noSupport = true }: { noRoof?: boolean, noSupport?: boolean } = {},
) => ({
  hp,
  damageModifiers,
  noRoof,
  noSupport,
  providesSupport: true,
  materialType,
});

export const woodResist: DamageModifiers = mods([0, 0, 1, 2, 0, 0, 0, 0, 3, 3]);
export const darkwoodResist: DamageModifiers = mods([0, 0, 1, 2, 1, 2, 0, 0, 3, 3]);
export const stoneResist: DamageModifiers = mods([0, 0, 0, 0, 2, 1, 1, 0, 3, 3]);
export const chestResist: DamageModifiers = mods([1, 1, 1, 1, 1, 1, 1, 0, 3, 3]);
export const ironResist: DamageModifiers = mods([0, 0, 1, 0, 1, 1, 1, 3, 3, 3]);
export const craftStationResist: DamageModifiers = mods([1, 1, 1, 1, 0, 3, 3, 0, 3, 3]);
export const damageModifiersCooking: DamageModifiers = mods([0, 0, 1, 0, 0, 1, 0, 0, 3, 3]);

export const woodStructureWear = wearStructure(400, woodResist, MaterialType.Wood);
export const darkwoodStructureWear = wearStructure(400, darkwoodResist, MaterialType.Wood, { noRoof: false });
export const woodRoofStructureWear = { ...woodStructureWear, noRoof: false };
export const stoneStructureWear = wearStructure(1500, stoneResist, MaterialType.Stone, { noRoof: false });
export const ironStructureWear = wearStructure(1000, ironResist, MaterialType.Iron);

export const woodStructureRecipe = (wood: number, type: 'Wood' | 'RoundLog' | 'FineWood' = 'Wood'): Piece['recipe'] =>
  ({ type: 'craft_piece', materials: { [type]: wood }, station: CraftingStation.Workbench, });

export const stoneStructureRecipe = (stone: number): Piece['recipe'] =>
  ({ type: 'craft_piece', materials: { Stone: stone }, station: CraftingStation.StoneCutter, });

export const darkwoodStructureRecipe = (materials: Record<EntityId, number>): Piece['recipe'] =>
  ({ type: 'craft_piece', materials, station: CraftingStation.Workbench });

export const ironStructureRecipe = (iron: number): Piece['recipe'] =>
  ({ type: 'craft_piece', materials: { Iron: iron }, station: CraftingStation.Forge });

export const crystalStructureRecipe = (crystal: number): Piece['recipe'] =>
  ({ type: 'craft_piece', materials: { Crystal: crystal }, station: CraftingStation.Forge });
