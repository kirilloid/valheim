import type { EntityId, Pair } from "./base";

export type AttackAnimation =
| 'unarmed_attack'
| 'unarmed_kick'
| 'swing_longsword'
| 'swing_axe'
| 'greatsword'
| 'greatsword_secondary'
| 'axe_secondary'
| 'knife_stab'
| 'knife_secondary'
| 'dual_knives'
| 'dual_knives_secondary'
| 'spear_poke'
| 'spear_throw'
| 'swing_sledge'
| 'bow_aim'
| 'bow_fire'
| 'reload_crossbow'
| 'crossbow_fire'
| 'swing_pickaxe'
| 'atgeir_attack'
| 'atgeir_secondary'
| 'mace_secondary'
| 'sword_secondary'
| 'battleaxe_attack'
| 'battleaxe_secondary'
| 'staff_rapidfire'
| 'staff_fireball'
| 'staff_summon'
| 'throw_bomb'
| 'dualaxes'
| 'dualaxes_secondary'
| 'staff_lightningshot'
| 'recharge_lightningstaff'
;

interface BaseAttack {
  animation: AttackAnimation;
  stamina: number;
  adrenaline: number;
  eitr?: number;
  healthPercent?: number;
  damageMultiplierPerMissingHP?: number;
  walkSpeed: number;
  rotationSpeed: number;
  startNoise: number;
  hitNoise: number;
  mul?: { damage: number; force: number; stagger: number };
  cantUseInDungeon?: boolean;
  range: number;
  reload?: { animation: AttackAnimation; time: number; stamina?: number; eitr?: number };
  draw?: { animation: AttackAnimation; duration: number; stamina: number };
}

interface MeleeAttack extends BaseAttack {
  chain: number;
  chainCombo: number;
}

interface AreaAttack extends BaseAttack {
  radius: number;
}

interface BowAttack extends BaseAttack {
  projVel: Pair<number>;
  projAcc: Pair<number>;
  number?: number;
  raiseSkillAmount?: number;
}

interface SummonAttack extends BaseAttack {
  summons: EntityId;
  skillFactor: number;
}

interface EffectAttack extends BaseAttack {
  id: EntityId;
}

export type Attack =
  | MeleeAttack & { type: 'melee' }
  | AreaAttack & { type: 'area' }
  | BowAttack & { type: 'proj' }
  | SummonAttack & { type: 'summon' }
  | EffectAttack & { type: 'cast' }

export interface Motion {
  speed: number;
  exit: number;
  duration: number;
  events: MotionEvent[];
}

export type MotionEvent = {
  type: 'speed',
  time: number;
  value: number;
} | {
  type: 'hit',
  time: number;
} | {
  type: 'chain',
  time: number;
} | {
  type: 'trailOn',
  time: number;
} | {
  type: 'trailOff',
  time: number;
}
