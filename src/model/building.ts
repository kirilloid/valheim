import type { DamageModifiers, EntityId, Piece } from '../types';
import { MaterialType } from '../types';
import { mods } from '../model/game';

export const wearStructure = (
  hp: number,
  damageModifiers: DamageModifiers,
  materialType: MaterialType | undefined,
  { noRoof = true,
    noSupport = true,
    ashResist = false,
    ashImmune = false,
    burnable = true,
  }: {
    noRoof?: boolean;
    noSupport?: boolean;
    ashResist?: boolean;
    ashImmune?: boolean;
    burnable?: boolean;
  } = {},
) => ({
  hp,
  damageModifiers,
  noRoof,
  noSupport,
  ashResist,
  ashImmune,
  burnable,
  providesSupport: true,
  materialType,
});

export const woodResist: DamageModifiers = mods([0, 0, 1, 2, 0, 0, 0, 0, 3, 3]);
export const torchResist: DamageModifiers = mods([0, 0, 1, 0, 0, 3, 3, 0, 3, 3]);
export const darkwoodResist: DamageModifiers = mods([0, 0, 1, 2, 1, 2, 0, 0, 3, 3]);
export const ashwoodResist: DamageModifiers = mods([0, 0, 1, 2, 0, 1, 0, 0, 3, 3]);
export const stoneResist: DamageModifiers = mods([0, 0, 0, 0, 2, 1, 1, 0, 3, 3]);
export const marbleResist: DamageModifiers = mods([1, 1, 1, 1, 0, 3, 3, 4, 4, 3]);
export const graustenResist: DamageModifiers = mods([0, 1, 1, 0, 2, 1, 1, 1, 4, 4]);
export const chestResist: DamageModifiers = mods([1, 1, 1, 1, 1, 1, 1, 0, 3, 3]);
export const ironResist: DamageModifiers = mods([0, 0, 1, 0, 1, 1, 1, 3, 3, 3]);
export const craftStationResist: DamageModifiers = mods([1, 1, 1, 1, 0, 3, 3, 0, 3, 3]);
export const cookingResist: DamageModifiers = mods([0, 0, 1, 0, 0, 1, 0, 0, 3, 3]);

export const woodStructureWear = wearStructure(400, woodResist, MaterialType.Wood);
export const darkwoodStructureWear = wearStructure(400, darkwoodResist, MaterialType.Wood, { noRoof: false });
export const woodRoofStructureWear = { ...woodStructureWear, noRoof: false };
export const stoneStructureWear = wearStructure(1500, stoneResist, MaterialType.Stone, { noRoof: false, ashResist: true, burnable: false });
export const ironStructureWear = wearStructure(1000, ironResist, MaterialType.Iron);
export const graustenStructureWear = (hp: number) => wearStructure(hp, graustenResist, MaterialType.Ashstone, { noRoof: false, ashResist: true, burnable: false });

export const woodStructureRecipe = (wood: number, type: 'Wood' | 'RoundLog' | 'FineWood' = 'Wood'): Piece['recipe'] =>
  ({ type: 'craft_piece', materials: { [type]: wood }, station: 'piece_workbench', });

export const stoneStructureRecipe = (Stone: number): Piece['recipe'] =>
  ({ type: 'craft_piece', materials: { Stone }, station: 'piece_stonecutter', });

export const darkwoodStructureRecipe = (materials: Record<EntityId, number>): Piece['recipe'] =>
  ({ type: 'craft_piece', materials, station: 'piece_workbench' });

export const ironStructureRecipe = (Iron: number): Piece['recipe'] =>
  ({ type: 'craft_piece', materials: { Iron }, station: 'forge' });

export const crystalStructureRecipe = (Crystal: number): Piece['recipe'] =>
  ({ type: 'craft_piece', materials: { Crystal }, station: 'forge' });

export const ashwoodStructureRecipe = (Blackwood: number): Piece['recipe'] =>
  ({ type: 'craft_piece', materials: { Blackwood }, station: 'piece_workbench' });

export const graustenStructureRecipe = (Grausten: number): Piece['recipe'] =>
  ({ type: 'craft_piece', materials: { Grausten }, station: 'piece_stonecutter', });

