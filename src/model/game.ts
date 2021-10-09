import type { DamageProfile, EntityId, GeneralDrop, LocationItem } from '../types';

export const FRAME = 1 / 50;
export const GAME_DAY = 1800;
export const BASE_HEALTH = 25;
export const BASE_STAMINA = 50;
export const MAX_PLAYERS = 10;

export const singleDrop = (item: EntityId, min: number = 1, max: number = 1): GeneralDrop => ({
  num: [min, max],
  options: [{ item }]
});

export const locItem = (item: EntityId | LocationItem[], chance: number = 1, number: number = 1): LocationItem => {
  return { item, chance, number };
};

export const dmg = (damage: Partial<DamageProfile>): DamageProfile => {
  return {
    blunt: 0,
    slash: 0,
    pierce: 0,
    chop: 0,
    pickaxe: 0,
    fire: 0,
    frost: 0,
    lightning: 0,
    poison: 0,
    spirit: 0,
    ...damage,
  }
};
