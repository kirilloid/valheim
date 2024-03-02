import type { DamageModifiers, DamageProfile } from "./damage";
import type { EntityId, Pair } from "./base";

export interface Deadspeak {
  interval: number;
  chance: number;
  triggerDistance: number;
  ttl: number;
  texts: string[];
}

export interface SapCollector {
  from: EntityId;
  secPerUnit: number;
  maxLevel: number;
  item: EntityId;
}

// type HexDigit =
//   | '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7'
//   | '8' | '9' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F'

export interface PointLight {
  range: number;
  intensity: number;
  color: string; //`#${HexDigit}${HexDigit}${HexDigit}${HexDigit}${HexDigit}${HexDigit}`;
}

export interface Turret {
  attackCooldown: number;
  allowedAmmo: EntityId[];
}

export interface Radiation {
  rate: Pair<number>;
  velocity: number;
  damage: DamageProfile;
}

export interface Food {
  health: number;
  stamina: number;
  eitr?: number;
  duration: number;
  regen: number;
}

export interface EggGrow {
  growTime: number;
  grownId: EntityId;
  requiresNearbyFire: boolean;
  requiresUnderRoof: boolean;
}

export interface Potion {
  health?: [adds: number, time: number];
  stamina?: [adds: number, time: number];
  eitr?: [adds: number, time: number];
  healthRegen?: number;
  staminaRegen?: number;
  eitrRegen?: number;
  damageModifiers?: Partial<DamageModifiers>;
  cooldown: number;
}
  
  