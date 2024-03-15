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
| 'bow_fire'
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
| 'recharge_lightningstaff'
;

interface BaseAttack {
  animation: AttackAnimation;
  stamina: number;
  eitr?: number;
  healthPercent?: number;
  damageMultiplierPerMissingHP?: number;
  walkSpeed: number;
  rotationSpeed: number;
  startNoise: number;
  hitNoise: number;
  mul?: { damage: number, force: number, stagger: number, };
  range: number;
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
