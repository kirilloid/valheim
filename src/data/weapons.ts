import type { AttackAnimation, Shield, Weapon } from '../types';
import { SkillType } from '../model/skills';
import { dmg } from '../model/game';

const CRAFT_TIME = 4;
const disabled = true;

export const animations: Record<AttackAnimation, number[]> = {
  swing_pickaxe: [1.4], // verified
  spear_throw: [1.57],
  spear_poke: [0.68],
  throw_bomb: [0.95],
  knife_stab: [0.6, 0.44, 0.7],
  knife_secondary: [1.52],
  swing_axe: [0.78, 0.7, 1.12], // 0.56, 1.30, 2.00    4.20, 4.93, 5.46, 6.50   1.26, 2.13, 2.83, 4.00
  unarmed_attack: [0.76, 0.76],
  unarmed_kick: [1.51],
  swing_sledge: [2.12], // 2.23
  swing_longsword: [1.14, 0.44, 0.88],
  sword_secondary: [1.84],
  mace_secondary: [1.72],
  battleaxe_attack: [1.58, 0.92, 0.7],
  battleaxe_secondary: [0.84],
  atgeir_attack: [0.84, 0.86, 1.28],
  atgeir_secondary: [1.54],
  bow_fire: [0.83],
};
// bow_aim_recoil: 21


export const items: (Weapon | Shield)[] = [
// PRE-CRAFT AGE
  { type: 'weapon', slot: 'both',
    id: 'PlayerUnarmed',
    emoji: '👊',
    tier: 0,
    stack: 0,
    maxLvl: 1,
    weight: 0,
    moveSpeed: 0,
    block: 2,
    parryForce: 0,
    parryBonus: 1.5,
    skill: SkillType.Unarmed,
    damage: [dmg({ blunt: 5 }), dmg({})],
    knockback: 40,
    backstab: 4,
    attacks: [{
      type: 'melee',
      animation: 'unarmed_attack',
      chain: 2,
      chainCombo: 1,
      stamina: 4,
      range: 1.5,
    }, {
      type: 'melee',
      animation: 'unarmed_kick',
      chain: 0,
      chainCombo: 1,
      stamina: 8,
      range: 1.6,
      mul: { damage: 1, force: 4, stagger: 6 },
    }],
    durability: [100, 50],
  },
  { type: 'weapon', slot: 'primary',
    id: 'Club',
    emoji: '🏏',
    tier: 0,
    floating: true,
    stack: 1,
    maxLvl: 4,
    weight: 2,
    moveSpeed: -0.05,
    block: 3,
    parryForce: [20, 5],
    parryBonus: 2,
    skill: SkillType.Clubs,
    damage: [dmg({ blunt: 12 }), dmg({ blunt: 6 })],
    knockback: 30,
    backstab: 3,
    attacks: [{
      type: 'melee',
      animation: 'swing_longsword',
      chain: 3,
      chainCombo: 2,
      stamina: 6,
      range: 2.4,
    }],
    durability: [100, 50],
  },
  { type: 'weapon', slot: 'primary',
    id: 'AxeStone',
    emoji: '🪓',
    tier: 0,
    stack: 1,
    maxLvl: 4,
    weight: 1.5,
    moveSpeed: -0.05,
    block: 3,
    parryForce: [20, 5],
    parryBonus: 2,
    skill: SkillType.Axes,
    toolTier: 0,
    damage: [
      dmg({ slash: 15, chop: 20 }),
      dmg({ slash: 5, chop: 3 }),
    ],
    knockback: 50,
    backstab: 3,
    attacks: [{
      type: 'melee',
      animation: 'swing_axe',
      chain: 2,
      chainCombo: 2,
      stamina: 6,
      range: 2.2,
    }],
    durability: [100, 30],
  },
  { type: 'weapon', slot: 'either',
    id: 'Torch',
    // lightRadius: 2,
    emoji: '🔥',
    tier: 0,
    tags: ['fire'],
    stack: 1,
    maxLvl: 1,
    weight: 1,
    moveSpeed: -0.05,
    block: 3,
    parryForce: [20, 5],
    parryBonus: 2,
    skill: SkillType.Clubs,
    damage: [dmg({ blunt: 4, fire: 15 }), dmg({})],
    knockback: 30,
    backstab: 3,
    attacks: [{
      type: 'melee',
      animation: 'swing_longsword',
      chain: 3,
      chainCombo: 2,
      stamina: 4,
      range: 2.4,
    }],
    durability: [20, 0],
    durabilityDrainPerSec: 30,
  },
// STONE AGE
  { type: 'weapon', slot: 'primary',
    id: 'AxeFlint',
    emoji: '🪓',
    tier: 1,
    stack: 1,
    maxLvl: 4,
    weight: 1.5,
    moveSpeed: -0.05,
    block: 4,
    parryForce: [20, 5],
    parryBonus: 2,
    skill: SkillType.Axes,
    toolTier: 1,
    damage: [
      dmg({ slash: 20, chop: 30 }),
      dmg({ slash: 5, chop: 3 }),
    ],
    knockback: 50,
    backstab: 3,
    attacks: [{
      type: 'melee',
      animation: 'swing_axe',
      chain: 3,
      chainCombo: 2,
      stamina: 6,
      range: 2.2,
    }],
    durability: [100, 30],
  },
  { type: 'weapon', slot: 'primary',
    id: 'KnifeFlint',
    emoji: '🔪',
    tier: 1,
    stack: 1,
    maxLvl: 4,
    weight: 0.3,
    moveSpeed: 0,
    block: 2,
    parryForce: [10, 5],
    parryBonus: 4,
    skill: SkillType.Knives,
    damage: [
      dmg({ slash: 5, pierce: 5 }),
      dmg({ slash: 1, pierce: 1 }),
    ],
    knockback: 10,
    backstab: 6,
    attacks: [{
      type: 'melee',
      animation: 'knife_stab',
      chain: 3,
      chainCombo: 2,
      stamina: 4,
      range: 1.8,
    }, {
      type: 'melee',
      animation: 'knife_secondary',
      chain: 0,
      chainCombo: 2,
      stamina: 12,
      range: 1.8,
      mul: { damage: 3, force: 4, stagger: 1 },
    }],
    durability: [200, 50],
  },
  { type: 'weapon', slot: 'primary',
    id: 'SpearFlint',
    emoji: '🍢',
    tier: 1,
    floating: true,
    stack: 1,
    maxLvl: 4,
    weight: 1.5,
    moveSpeed: -0.05,
    block: 4,
    parryForce: [20, 5],
    parryBonus: 2,
    skill: SkillType.Spears,
    damage: [dmg({ pierce: 20 }), dmg({ pierce: 6 })],
    knockback: 20,
    backstab: 3,
    attacks: [{
      type: 'melee',
      animation: 'spear_poke',
      chain: 0,
      chainCombo: 1,
      stamina: 6,
      range: 1.9,
    }, {
      type: 'proj',
      animation: 'spear_throw',
      projVel: [2, 20],
      projAcc: [20, 1],
      stamina: 8,
      range: 1,
      mul: { damage: 1.5, force: 1.5, stagger: 1 },
    }],
    durability: [100, 50],
  },
  { type: 'weapon', slot: 'both',
    id: 'SledgeStagbreaker',
    emoji: '🔨',
    tier: 1,
    floating: true,
    stack: 1,
    maxLvl: 4,
    weight: 4,
    moveSpeed: -0.2,
    block: 4,
    parryForce: [50, 10],
    parryBonus: 2,
    skill: SkillType.Clubs,
    damage: [
      dmg({ blunt: 20, pierce: 5 }),
      dmg({ blunt: 6 }),
    ],
    knockback: 150,
    backstab: 2,
    attacks: [{
      type: 'area',
      animation: 'swing_sledge',
      chain: 0,
      chainCombo: 2,
      stamina: 12,
      range: 2.4,
    }],
    durability: [100, 50],
  },
  { type: 'weapon', slot: 'bow',
    id: 'Bow',
    emoji: '🏹',
    tier: 1,
    floating: true,
    stack: 1,
    maxLvl: 4,
    weight: 1.5,
    moveSpeed: -0.05,
    block: 3,
    parryForce: 0,
    parryBonus: 1.5,
    skill: SkillType.Bows,
    damage: [dmg({ pierce: 22 }), dmg({ pierce: 3 })],
    knockback: 0,
    backstab: 3,
    attacks: [{
      type: 'proj',
      animation: 'bow_fire',
      projVel: [2, 35],
      projAcc: [20, 1],
      stamina: 0,
      range: 1,
    }],
    durability: [50, 50],
    holdDurationMin: 2.5,
    holdStaminaDrain: 4,
  },
  { type: 'weapon', slot: 'both',
    id: 'PickaxeStone',
    emoji: '⛏️',
    disabled,
    tier: -1,
    stack: 1,
    maxLvl: 1,
    weight: 2,
    moveSpeed: -0.05,
    block: 2,
    parryForce: 0,
    parryBonus: 2,
    skill: SkillType.Pickaxes,
    toolTier: 0,
    damage: [dmg({ pierce: 15, pickaxe: 15 }), dmg({})],
    knockback: 50,
    backstab: 3,
    attacks: [{
      type: 'melee',
      animation: 'swing_pickaxe',
      chain: 0,
      chainCombo: 2,
      stamina: 4,
      range: 1.8,
    }],
    durability: [100, 50],
  },
  { type: 'weapon', slot: 'both',
    id: 'PickaxeAntler',
    emoji: '⛏️',
    tier: 1,
    stack: 1,
    maxLvl: 1,
    weight: 2,
    moveSpeed: -0.05,
    block: 2,
    parryForce: [20, 5],
    parryBonus: 2,
    skill: SkillType.Pickaxes,
    toolTier: 0,
    damage: [dmg({ pierce: 18, pickaxe: 18 }), dmg({})],
    knockback: 50,
    backstab: 3,
    attacks: [{
      type: 'melee',
      animation: 'swing_pickaxe',
      chain: 0,
      chainCombo: 2,
      stamina: 6,
      range: 1.8,
    }],
    durability: [100, 50],
  },
  { type: 'shield', slot: 'secondary',
    id: 'ShieldWood',
    emoji: '🛡️',
    tier: 1,
    floating: true,
    stack: 1,
    maxLvl: 3,
    variants: 4,
    weight: 4,
    moveSpeed: -0.05,
    block: [6, 6],
    parryForce: [20, 5],
    parryBonus: 1.5,
    skill: SkillType.Blocking,
    durability: [200, 50],
  },
  { type: 'shield', slot: 'secondary',
    id: 'ShieldWoodTower',
    emoji: '🛡️',
    floating: true,
    tier: 1,
    stack: 1,
    maxLvl: 3,
    variants: 7,
    weight: 4,
    moveSpeed: -0.2,
    block: [10, 6],
    parryForce: [100, 5],
    parryBonus: 0,
    skill: SkillType.Blocking,
    durability: [200, 50],
  },
// BRONZE AGE
  { type: 'weapon', slot: 'primary',
    id: 'KnifeCopper',
    emoji: '🔪',
    tier: 2,
    stack: 1,
    maxLvl: 4,
    weight: 0.3,
    moveSpeed: 0,
    block: 2,
    parryForce: [10, 5],
    parryBonus: 4,
    skill: SkillType.Knives,
    damage: [
      dmg({ slash: 12, pierce: 12 }),
      dmg({ slash: 1, pierce: 1 }),
    ],
    knockback: 10,
    backstab: 6,
    attacks: [{
      type: 'melee',
      animation: 'knife_stab',
      chain: 3,
      chainCombo: 2,
      stamina: 6,
      range: 1.8,
    }, {
      type: 'melee',
      animation: 'knife_secondary',
      chain: 0,
      chainCombo: 2,
      stamina: 18,
      range: 1.8,
      mul: { damage: 3, force: 4, stagger: 1 },
    }],
    durability: [200, 50],
  },
  { type: 'weapon', slot: 'primary',
    id: 'AtgeirBronze',
    emoji: '🔱',
    tier: 2,
    stack: 1,
    maxLvl: 4,
    weight: 2.5,
    moveSpeed: -0.05,
    block: 16,
    parryForce: [40, 5],
    parryBonus: 2,
    skill: SkillType.Polearms,
    damage: [dmg({ pierce: 45 }), dmg({ pierce: 6 })],
    knockback: 30,
    backstab: 3,
    attacks: [{
      type: 'melee',
      animation: 'atgeir_attack',
      chain: 3,
      chainCombo: 2,
      stamina: 12,
      range: 3.2,
    }, {
      type: 'melee',
      animation: 'atgeir_secondary',
      chain: 0,
      chainCombo: 2,
      stamina: 24,
      range: 3,
      mul: { damage: 1, force: 10, stagger: 6 },
    }],
    durability: [125, 50],
  },
  { type: 'weapon', slot: 'primary',
    id: 'AxeBronze',
    emoji: '🪓',
    tier: 2,
    stack: 1,
    maxLvl: 4,
    weight: 2,
    moveSpeed: -0.05,
    block: 12,
    parryForce: [20, 5],
    parryBonus: 2,
    skill: SkillType.Axes,
    toolTier: 2,
    damage: [
      dmg({ slash: 40, chop: 40 }),
      dmg({ slash: 5, chop: 3 }),
    ],
    knockback: 50,
    backstab: 3,
    attacks: [{
      type: 'melee',
      animation: 'swing_axe',
      chain: 3,
      chainCombo: 2,
      stamina: 8,
      range: 2.2,
    }],
    durability: [125, 50],
  },
  { type: 'weapon', slot: 'primary',
    id: 'MaceBronze',
    emoji: '🏏',
    tier: 2,
    floating: true,
    stack: 1,
    maxLvl: 4,
    weight: 2,
    moveSpeed: -0.05,
    block: 12,
    parryForce: [30, 5],
    parryBonus: 2,
    skill: SkillType.Clubs,
    damage: [dmg({ blunt: 35 }), dmg({ blunt: 6 })],
    knockback: 80,
    backstab: 3,
    attacks: [{
      type: 'melee',
      animation: 'swing_longsword',
      chain: 3,
      chainCombo: 2,
      stamina: 8,
      range: 2.4,
    }, {
      type: 'melee',
      animation: 'mace_secondary',
      chain: 0,
      chainCombo: 2,
      stamina: 16,
      range: 2.5,
      mul: { damage: 2.5, force: 2, stagger: 2 },
    }],
    durability: [200, 50],
  },
  { type: 'weapon', slot: 'primary',
    id: 'SpearBronze',
    emoji: '🍢',
    tier: 2,
    floating: true,
    stack: 1,
    maxLvl: 4,
    weight: 1.5,
    moveSpeed: -0.05,
    block: 12,
    parryForce: [20, 5],
    parryBonus: 2,
    skill: SkillType.Spears,
    damage: [dmg({ pierce: 35 }), dmg({ pierce: 6 })],
    knockback: 20,
    backstab: 3,
    attacks: [{
      type: 'melee',
      animation: 'spear_poke',
      chain: 0,
      chainCombo: 2,
      stamina: 8,
      range: 1.9,
    }, {
      type: 'proj',
      animation: 'spear_throw',
      projVel: [2, 20],
      projAcc: [20, 1],
      stamina: 10,
      range: 1,
      mul: { damage: 1.5, force: 1.5, stagger: 1 },
    }],
    durability: [100, 50],
  },
  { type: 'weapon', slot: 'primary',
    id: 'SwordBronze',
    emoji: '🗡️',
    tier: 2,
    stack: 1,
    maxLvl: 4,
    weight: 0.8,
    moveSpeed: -0.05,
    block: 12,
    parryForce: [20, 5],
    parryBonus: 2,
    skill: SkillType.Swords,
    damage: [dmg({ slash: 35 }), dmg({ slash: 6 })],
    knockback: 40,
    backstab: 3,
    attacks: [{
      type: 'melee',
      animation: 'swing_longsword',
      chain: 3,
      chainCombo: 2,
      stamina: 8,
      range: 2.4,
    }, {
      type: 'melee',
      animation: 'sword_secondary',
      chain: 0,
      chainCombo: 2,
      stamina: 16,
      range: 2.4,
      mul: { damage: 3, force: 1, stagger: 1 },
    }],
    durability: [200, 50],
  },
  { type: 'weapon', slot: 'both',
    id: 'PickaxeBronze',
    emoji: '⛏️',
    tier: 2,
    stack: 1,
    maxLvl: 4,
    weight: 2,
    moveSpeed: -0.05,
    block: 2,
    parryForce: [20, 5],
    parryBonus: 2,
    skill: SkillType.Pickaxes,
    toolTier: 1,
    damage: [
      dmg({ pierce: 25, pickaxe: 25 }),
      dmg({ pierce: 5, pickaxe: 4 }),
    ],
    knockback: 50,
    backstab: 3,
    attacks: [{
      type: 'melee',
      animation: 'swing_pickaxe',
      chain: 0,
      chainCombo: 2,
      stamina: 8,
      range: 1.8,
    }],
    durability: [120, 50],
  },
  { type: 'weapon', slot: 'bow',
    id: 'BowFineWood',
    emoji: '🏹',
    tier: 2,
    stack: 1,
    maxLvl: 4,
    weight: 1.5,
    moveSpeed: -0.05,
    block: 3,
    parryForce: 0,
    parryBonus: 1.5,
    floating: true,
    skill: SkillType.Bows,
    damage: [dmg({ pierce: 32 }), dmg({ pierce: 3 })],
    knockback: 5,
    backstab: 3,
    attacks: [{
      type: 'proj',
      animation: 'bow_fire',
      projVel: [2, 50],
      projAcc: [20, 1],
      stamina: 0,
      range: 1,
    }],
    durability: [100, 50],
    holdDurationMin: 2.5,
    holdStaminaDrain: 6,
  },
  { type: 'shield', slot: 'secondary',
    id: 'ShieldBronzeBuckler',
    emoji: '🛡️',
    tier: 2,
    stack: 1,
    maxLvl: 3,
    weight: 3,
    moveSpeed: -0.05,
    block: [16, 6],
    parryForce: 30,
    parryBonus: 2.5,
    skill: SkillType.Blocking,
    durability: [200, 50],
  },
  { type: 'shield', slot: 'secondary',
    id: 'ShieldBoneTower',
    emoji: '🛡️',
    floating: true,
    tier: 2,
    stack: 1,
    maxLvl: 3,
    weight: 4,
    moveSpeed: -0.2,
    block: [32, 6],
    parryForce: [100, 5],
    parryBonus: 0,
    skill: SkillType.Blocking,
    durability: [200, 50],
  },
// IRON AGE
  { type: 'weapon', slot: 'primary',
    id: 'BombOoze',
    emoji: '💣',
    tier: 3,
    stack: 50,
    maxLvl: 1,
    weight: 0.3,
    moveSpeed: 0,
    block: 2,
    parryForce: 0,
    parryBonus: 1.5,
    skill: null,
    damage: [dmg({ blunt: 5, poison: 40 }), dmg({})],
    knockback: 40,
    backstab: 4, // from effect
    // radius: 4, ttl: 10, interval: 1
    attacks: [{
      type: 'proj',
      animation: 'throw_bomb',
      projVel: [2, 20],
      projAcc: [20, 5],
      stamina: 8,
      range: 1.5,
    }],
    durability: [Infinity, 0],
  },
  { type: 'weapon', slot: 'both',
    id: 'Battleaxe',
    emoji: '🪓',
    tier: 3,
    stack: 1,
    maxLvl: 4,
    weight: 2.5,
    moveSpeed: -0.2,
    block: 28,
    parryForce: [70, 5],
    parryBonus: 2,
    skill: SkillType.Axes,
    toolTier: 3,
    damage: [
      dmg({ slash: 70, chop: 40 }),
      dmg({ slash: 6, chop: 2.5 }),
    ],
    knockback: 70,
    backstab: 3,
    attacks: [{
      type: 'melee',
      animation: 'battleaxe_attack',
      chain: 3,
      chainCombo: 2,
      stamina: 16,
      range: 2.5,
      mul: { damage: 1, force: 1, stagger: 1.5 },
    }, {
      type: 'melee',
      animation: 'battleaxe_secondary',
      chain: 0,
      chainCombo: 2,
      stamina: 8,
      range: 2.5,
      mul: { damage: 0.5, force: 2, stagger: 4 },
    }],
    durability: [200, 50],
  },
  { type: 'weapon', slot: 'primary',
    id: 'SwordIron',
    // lightRadius: 2,
    emoji: '🗡️',
    tier: 3,
    stack: 1,
    maxLvl: 4,
    weight: 0.8,
    moveSpeed: -0.05,
    block: 21,
    parryForce: [20, 5],
    parryBonus: 2,
    skill: SkillType.Swords,
    toolTier: 0,
    damage: [dmg({ slash: 55 }), dmg({ slash: 6 })],
    knockback: 40,
    backstab: 3,
    attacks: [{
      type: 'melee',
      animation: 'swing_longsword',
      chain: 3,
      chainCombo: 2,
      stamina: 10,
      range: 2.4,
    }, {
      type: 'melee',
      animation: 'sword_secondary',
      chain: 0,
      chainCombo: 2,
      stamina: 20,
      range: 2.4,
      mul: { damage: 3, force: 1, stagger: 1 },
    }],
    durability: [200, 50],
  },
  { type: 'weapon', slot: 'primary',
    id: 'AxeIron',
    emoji: '🪓',
    tier: 3,
    stack: 1,
    maxLvl: 4,
    weight: 2,
    moveSpeed: -0.05,
    block: 21,
    parryForce: [20, 5],
    parryBonus: 2,
    skill: SkillType.Axes,
    toolTier: 3,
    damage: [
      dmg({ slash: 60, chop: 50 }),
      dmg({ slash: 5, chop: 3 }),
    ],
    knockback: 50,
    backstab: 3,
    attacks: [{
      type: 'melee',
      animation: 'swing_axe',
      chain: 3,
      chainCombo: 2,
      stamina: 10,
      range: 2.2,
    }],
    durability: [175, 50],
  },
  { type: 'weapon', slot: 'both',
    id: 'SledgeIron',
    emoji: '🔨',
    tier: 3,
    stack: 1,
    maxLvl: 4,
    weight: 4,
    moveSpeed: -0.2,
    block: 28,
    parryForce: [50, 10],
    parryBonus: 2,
    skill: SkillType.Clubs,
    damage: [dmg({ blunt: 55 }), dmg({ blunt: 6 })],
    knockback: 200,
    backstab: 2,
    attacks: [{
      type: 'area',
      animation: 'swing_sledge',
      chain: 0,
      chainCombo: 2,
      stamina: 20,
      range: 2,
      mul: { damage: 1, force: 1, stagger: 2 },
    }],
    durability: [100, 50],
  },
  { type: 'weapon', slot: 'primary',
    id: 'MaceIron',
    emoji: '🏏',
    tier: 3,
    floating: true,
    stack: 1,
    maxLvl: 4,
    weight: 2,
    moveSpeed: -0.05,
    block: 21,
    parryForce: [30, 5],
    parryBonus: 2,
    skill: SkillType.Clubs,
    damage: [dmg({ blunt: 55 }), dmg({ blunt: 6 })],
    knockback: 90,
    backstab: 3,
    attacks: [{
      type: 'melee',
      animation: 'swing_longsword',
      chain: 3,
      chainCombo: 2,
      stamina: 10,
      range: 2.4,
    }, {
      type: 'melee',
      animation: 'mace_secondary',
      chain: 0,
      chainCombo: 2,
      stamina: 20,
      range: 2.5,
      mul: { damage: 2.5, force: 2, stagger: 2 },
    }],
    durability: [200, 50],
  },
  { type: 'weapon', slot: 'primary',
    id: 'SpearElderbark',
    emoji: '🍢',
    tier: 3,
    floating: true,
    stack: 1,
    maxLvl: 4,
    weight: 1.5,
    moveSpeed: -0.05,
    block: 21,
    parryForce: [20, 5],
    parryBonus: 2,
    skill: SkillType.Spears,
    damage: [dmg({ pierce: 55 }), dmg({ pierce: 6 })],
    knockback: 20,
    backstab: 3,
    attacks: [{
      type: 'melee',
      animation: 'spear_poke',
      chain: 0,
      chainCombo: 2,
      stamina: 10,
      range: 1.9,
    }, {
      type: 'proj',
      animation: 'spear_throw',
      projVel: [2, 20],
      projAcc: [20, 1],
      stamina: 12,
      range: 1,
      mul: { damage: 1.5, force: 1.5, stagger: 1 },
    }],
    durability: [100, 50],
  },
  { type: 'weapon', slot: 'both',
    id: 'PickaxeIron',
    emoji: '⛏️',
    tier: 3,
    stack: 1,
    maxLvl: 4,
    weight: 2,
    moveSpeed: -0.05,
    block: 2,
    parryForce: [20, 5],
    parryBonus: 2,
    skill: SkillType.Pickaxes,
    toolTier: 2,
    damage: [
      dmg({ pierce: 33, pickaxe: 33 }),
      dmg({ pierce: 5, pickaxe: 5 }),
    ],
    knockback: 50,
    backstab: 3,
    attacks: [{
      type: 'melee',
      animation: 'swing_pickaxe',
      chain: 0,
      chainCombo: 2,
      stamina: 10,
      range: 1.8,
    }],
    durability: [150, 50],
  },
  { type: 'weapon', slot: 'both',
    id: 'AtgeirIron',
    emoji: '🔱',
    tier: 3,
    stack: 1,
    maxLvl: 4,
    weight: 2.5,
    moveSpeed: -0.05,
    block: 28,
    parryForce: [40, 5],
    parryBonus: 2,
    skill: SkillType.Polearms,
    damage: [dmg({ pierce: 65 }), dmg({ pierce: 6 })],
    knockback: 30,
    backstab: 3,
    attacks: [{
      type: 'melee',
      animation: 'atgeir_attack',
      chain: 3,
      chainCombo: 2,
      stamina: 14,
      range: 3.2,
    }, {
      type: 'melee',
      animation: 'atgeir_secondary',
      chain: 0,
      chainCombo: 2,
      stamina: 28,
      range: 3,
      mul: { damage: 1, force: 10, stagger: 6 },
    }],
    durability: [175, 50],
  },
  { type: 'weapon', slot: 'bow',
    id: 'BowHuntsman',
    emoji: '🏹',
    tier: 3,
    floating: true,
    stack: 1,
    maxLvl: 4,
    weight: 1.5,
    moveSpeed: -0.05,
    block: 3,
    parryForce: 0,
    parryBonus: 1.5,
    skill: SkillType.Bows,
    damage: [dmg({ pierce: 42 }), dmg({ pierce: 3 })],
    knockback: 10,
    backstab: 3,
    attacks: [{
      type: 'proj',
      animation: 'bow_fire',
      projVel: [2, 50],
      projAcc: [20, 0],
      stamina: 0,
      range: 1,
    }],
    durability: [100, 50],
    holdDurationMin: 2.5,
    holdStaminaDrain: 8,
  },
  { type: 'shield', slot: 'secondary',
    id: 'ShieldBanded',
    emoji: '🛡️',
    tier: 3,
    floating: true,
    stack: 1,
    maxLvl: 3,
    variants: 4,
    weight: 5,
    moveSpeed: -0.05,
    block: [42, 6],
    parryForce: [40, 5],
    parryBonus: 1.5,
    skill: SkillType.Blocking,
    damage: [dmg({ blunt: 10 }), dmg({})],
    knockback: 50,
    backstab: 4,
    durability: [200, 50],
  },
  { type: 'shield', slot: 'secondary',
    id: 'ShieldIronTower',
    emoji: '🛡️',
    floating: true,
    tier: 3,
    stack: 1,
    maxLvl: 3,
    variants: 7,
    weight: 4,
    moveSpeed: -0.2,
    block: [52, 6],
    parryForce: [100, 5],
    parryBonus: 0,
    skill: SkillType.Blocking,
    durability: [200, 50],
    knockback: 40,
    backstab: 4,
  },
  { type: 'shield', slot: 'secondary',
    id: 'ShieldIronBuckler',
    emoji: '🛡️',
    floating: true,
    tier: 3,
    stack: 1,
    maxLvl: 3,
    weight: 4,
    moveSpeed: -0.05,
    block: [28, 6],
    parryForce: 30,
    parryBonus: 2.5,
    skill: SkillType.Blocking,
    durability: [200, 50],
    knockback: 40,
    backstab: 4,
  },
  { type: 'shield', slot: 'secondary',
    id: 'ShieldSerpentscale',
    emoji: '🛡️',
    tier: 3,
    floating: true,
    stack: 1,
    maxLvl: 3,
    weight: 5,
    moveSpeed: -0.15,
    block: [60, 6],
    parryForce: [100, 5],
    parryBonus: 0,
    skill: SkillType.Blocking,
    damage: [dmg({ blunt: 10 }), dmg({})],
    damageModifiers: { pierce: 'resistant' },
    durability: [250, 50],
    knockback: 50,
    backstab: 4,
  },
// SILVER AGE
  { type: 'weapon', slot: 'both',
    id: 'FistFenrirClaw',
    emoji: '🍴',
    tier: 4,
    stack: 1,
    maxLvl: 4,
    weight: 2,
    moveSpeed: 0,
    block: [5, 1],
    parryForce: [10, 5],
    parryBonus: 6,
    skill: SkillType.Unarmed,
    toolTier: 0,
    damage: [
      dmg({ slash: 60 }),
      dmg({ slash: 4 }),
    ],
    knockback: 20,
    backstab: 6,
    attacks: [{
      type: 'melee',
      animation: 'unarmed_attack',
      chain: 2,
      chainCombo: 1,
      stamina: 4,
      range: 2,
    }, {
      type: 'melee',
      animation: 'unarmed_kick',
      chain: 0,
      chainCombo: 2,
      stamina: 9,
      range: 2.5,
      mul: { damage: 1, force: 4, stagger: 6 },
    }],
    durability: [300, 50],
  },
  { type: 'weapon', slot: 'both',
    id: 'BattleaxeCrystal',
    emoji: '🪓',
    tier: 4,
    stack: 1,
    maxLvl: 4,
    weight: 2.5,
    moveSpeed: -0.2,
    block: 40,
    parryForce: [70, 5],
    parryBonus: 2,
    skill: SkillType.Axes,
    toolTier: 3,
    damage: [
      dmg({ slash: 90, chop: 50, spirit: 30 }),
      dmg({ slash: 6, chop: 2.5 }),
    ],
    knockback: 70,
    backstab: 3,
    attacks: [{
      type: 'melee',
      animation: 'battleaxe_attack',
      chain: 3,
      chainCombo: 2,
      stamina: 18,
      range: 2.5,
      mul: { damage: 1, force: 1, stagger: 1.5 },
    }, {
      type: 'melee',
      animation: 'battleaxe_secondary',
      chain: 0,
      chainCombo: 2,
      stamina: 9,
      range: 2.5,
      mul: { damage: 0.5, force: 2, stagger: 4 },
    }],
    durability: [200, 50],
  },
  { type: 'weapon', slot: 'primary',
    id: 'SwordSilver',
    emoji: '🗡️',
    tier: 4,
    stack: 1,
    maxLvl: 4,
    weight: 1,
    moveSpeed: -0.05,
    block: 30,
    parryForce: [20, 5],
    parryBonus: 2,
    skill: SkillType.Swords,
    damage: [
      dmg({ slash: 75, spirit: 30 }),
      dmg({ slash: 6, spirit: 5 }),
    ],
    knockback: 40,
    backstab: 3,
    attacks: [{
      type: 'melee',
      animation: 'swing_longsword',
      chain: 3,
      chainCombo: 2,
      stamina: 12,
      range: 2.4,
    }, {
      type: 'melee',
      animation: 'sword_secondary',
      chain: 0,
      chainCombo: 2,
      stamina: 24,
      range: 2.4,
      mul: { damage: 3, force: 1, stagger: 1 },
    }],
    durability: [200, 50],
  },
  { type: 'weapon', slot: 'primary',
    id: 'SpearWolfFang',
    emoji: '🍢',
    tier: 4,
    floating: true,
    stack: 1,
    maxLvl: 4,
    weight: 1.5,
    moveSpeed: -0.05,
    block: 30,
    parryForce: [20, 5],
    parryBonus: 2,
    skill: SkillType.Spears,
    damage: [dmg({ pierce: 75 }), dmg({ pierce: 6 })],
    knockback: 20,
    backstab: 3,
    attacks: [{
      type: 'melee',
      animation: 'spear_poke',
      chain: 0,
      chainCombo: 2,
      stamina: 12,
      range: 1.9,
    }, {
      type: 'proj',
      animation: 'spear_throw',
      projVel: [2, 20],
      projAcc: [20, 1],
      stamina: 14,
      range: 1,
      mul: { damage: 1.5, force: 1.5, stagger: 1 },
    }],
    durability: [100, 50],
  },
  { type: 'weapon', slot: 'primary',
    id: 'MaceSilver',
    emoji: '🔨',
    tier: 4,
    stack: 1,
    maxLvl: 4,
    weight: 2,
    moveSpeed: -0.05,
    block: 30,
    parryForce: [30, 5],
    parryBonus: 2,
    skill: SkillType.Clubs,
    damage: [
      dmg({ blunt: 35, frost: 40, spirit: 20 }),
      dmg({ frost: 6 }),
    ],
    knockback: 120,
    backstab: 3,
    attacks: [{
      type: 'melee',
      animation: 'swing_longsword',
      chain: 3,
      stamina: 12,
      range: 2.4,
      chainCombo: 2,
    }, {
      type: 'melee',
      animation: 'mace_secondary',
      chain: 0,
      stamina: 24,
      range: 2.5,
      mul: { damage: 2.5, force: 2, stagger: 2, },
      chainCombo: 2,
    }],
    durability: [200, 50],
  },
  { type: 'weapon', slot: 'primary',
    id: 'SpearChitin',
    emoji: '🍢',
    tier: 2,
    floating: true,
    special: 'harpoon',
    stack: 1,
    maxLvl: 1,
    weight: 1.5,
    moveSpeed: -0.05,
    block: 21,
    parryForce: [20, 5],
    parryBonus: 2,
    skill: SkillType.Spears,
    damage: [dmg({ pierce: 10 }), dmg({})],
    knockback: 20,
    backstab: 1,
    attacks: [{
      type: 'proj',
      animation: 'spear_throw',
      projVel: [2, 30],
      projAcc: [20, 0],
      stamina: 15,
      range: 1,
    }],
    durability: [50, 50],
  },
  { type: 'weapon', slot: 'primary',
    id: 'KnifeChitin',
    emoji: '🔪',
    tier: 2,
    floating: true,
    stack: 1,
    maxLvl: 4,
    weight: 0.3,
    moveSpeed: 0,
    block: 2,
    parryForce: [10, 5],
    parryBonus: 4,
    skill: SkillType.Knives,
    damage: [
      dmg({ slash: 20, pierce: 20 }),
      dmg({ slash: 1, pierce: 1 }),
    ],
    knockback: 10,
    backstab: 6,
    attacks: [{
      type: 'melee',
      animation: 'knife_stab',
      chain: 3,
      chainCombo: 2,
      stamina: 8,
      range: 1.8,
    }, {
      type: 'melee',
      animation: 'knife_secondary',
      chain: 0,
      chainCombo: 2,
      stamina: 24,
      range: 1.8,
      mul: { damage: 3, force: 4, stagger: 1 },
    }],
    durability: [200, 50],
  },
  { type: 'weapon', slot: 'primary',
    id: 'KnifeSilver',
    emoji: '🔪',
    tier: 4,
    floating: true,
    stack: 1,
    maxLvl: 4,
    weight: 0.3,
    moveSpeed: 0,
    block: 2,
    parryForce: [10, 5],
    parryBonus: 4,
    skill: SkillType.Knives,
    damage: [
      dmg({ slash: 25, pierce: 25, spirit: 12 }),
      dmg({ slash: 1, pierce: 1 }),
    ],
    knockback: 10,
    backstab: 6,
    attacks: [{
      type: 'melee',
      animation: 'knife_stab',
      chain: 3,
      chainCombo: 2,
      stamina: 10,
      range: 1.8,
    }, {
      type: 'melee',
      animation: 'knife_secondary',
      chain: 0,
      chainCombo: 2,
      stamina: 30,
      range: 1.8,
      mul: { damage: 3, force: 4, stagger: 1 },
    }],
    durability: [200, 50],
  },
  { type: 'weapon', slot: 'bow',
    id: 'BowDraugrFang',
    emoji: '🏹',
    tier: 4,
    floating: true,
    stack: 1,
    maxLvl: 4,
    weight: 1.5,
    moveSpeed: -0.05,
    block: 3,
    parryForce: 0,
    parryBonus: 1.5,
    skill: SkillType.Bows,
    damage: [
      dmg({ pierce: 47, poison: 5 }),
      dmg({ pierce: 3, poison: 5 }),
    ],
    knockback: 20,
    backstab: 3,
    attacks: [{
      type: 'proj',
      animation: 'bow_fire',
      projVel: [2, 60],
      projAcc: [20, 0],
      stamina: 0,
      range: 1,
    }],
    durability: [100, 50],
    holdDurationMin: 2.5,
    holdStaminaDrain: 10,
  },
  { type: 'shield', slot: 'secondary',
    id: 'ShieldSilver',
    emoji: '🛡️',
    tier: 4,
    floating: true,
    stack: 1,
    maxLvl: 3,
    variants: 7,
    weight: 5,
    moveSpeed: -0.05,
    block: [60, 6],
    parryForce: [40, 5],
    parryBonus: 1.5,
    skill: SkillType.Blocking,
    damage: [dmg({ blunt: 10 }), dmg({})],
    knockback: 50,
    backstab: 4,
    durability: [200, 50],
  },
// BLACK AGE
  { type: 'weapon', slot: 'both',
    id: 'AtgeirBlackmetal',
    emoji: '🔱',
    tier: 5,
    stack: 1,
    maxLvl: 4,
    weight: 2.5,
    moveSpeed: -0.05,
    block: 52,
    parryForce: [40, 5],
    parryBonus: 3,
    skill: SkillType.Polearms,
    damage: [dmg({ pierce: 105 }), dmg({ pierce: 6 })],
    knockback: 30,
    backstab: 3,
    attacks: [{
      type: 'melee',
      animation: 'atgeir_attack',
      chain: 3,
      chainCombo: 2,
      stamina: 18,
      range: 3.2,
    }, {
      type: 'melee',
      animation: 'atgeir_secondary',
      chain: 0,
      chainCombo: 2,
      stamina: 36,
      range: 3,
      mul: { damage: 1, force: 10, stagger: 6 },
    }],
    durability: [175, 50],
  },
  { type: 'weapon', slot: 'primary',
    id: 'AxeBlackMetal',
    emoji: '🪓',
    tier: 5,
    stack: 1,
    maxLvl: 4,
    weight: 2,
    moveSpeed: -0.05,
    block: 39,
    parryForce: [20, 5],
    parryBonus: 2,
    skill: SkillType.Axes,
    toolTier: 4,
    damage: [
      dmg({ slash: 100, chop: 60 }),
      dmg({ slash: 5, chop: 3 }),
    ],
    knockback: 60,
    backstab: 3,
    attacks: [{
      type: 'melee',
      animation: 'swing_axe',
      chain: 3,
      chainCombo: 2,
      stamina: 14,
      range: 2.2,
    }],
    durability: [175, 50],
  },
  { type: 'weapon', slot: 'primary',
    id: 'KnifeBlackMetal',
    emoji: '🔪',
    tier: 5,
    stack: 1,
    maxLvl: 4,
    weight: 0.3,
    moveSpeed: 0,
    block: 2,
    parryForce: [10, 5],
    parryBonus: 4,
    skill: SkillType.Knives,
    damage: [
      dmg({ slash: 34, pierce: 34 }),
      dmg({ slash: 1, pierce: 1 }),
    ],
    knockback: 10,
    backstab: 6,
    attacks: [{
      type: 'melee',
      animation: 'knife_stab',
      chain: 3,
      chainCombo: 2,
      stamina: 12,
      range: 1.8,
    }, {
      type: 'melee',
      animation: 'knife_secondary',
      chain: 0,
      chainCombo: 2,
      stamina: 36,
      range: 1.8,
      mul: { damage: 3, force: 4, stagger: 1 },
    }],
    durability: [200, 50],
  },
  { type: 'weapon', slot: 'primary',
    id: 'SwordBlackmetal',
    emoji: '🗡️',
    tier: 5,
    stack: 1,
    maxLvl: 4,
    weight: 0.8,
    moveSpeed: -0.05,
    block: 39,
    parryForce: [20, 5],
    parryBonus: 2,
    skill: SkillType.Swords,
    damage: [dmg({ slash: 95 }), dmg({ slash: 6 })],
    knockback: 40,
    backstab: 3,
    attacks: [{
      type: 'melee',
      animation: 'swing_longsword',
      chain: 3,
      chainCombo: 2,
      stamina: 14,
      range: 2.4,
    }, {
      type: 'melee',
      animation: 'sword_secondary',
      chain: 0,
      chainCombo: 2,
      stamina: 28,
      range: 2.4,
      mul: { damage: 3, force: 1, stagger: 1 },
    }],
    durability: [200, 50],
  },
  { type: 'weapon', slot: 'primary',
    id: 'MaceNeedle',
    emoji: '🏏',
    tier: 5,
    floating: true,
    stack: 1,
    maxLvl: 4,
    weight: 2,
    moveSpeed: -0.05,
    block: 39,
    parryForce: [30, 5],
    parryBonus: 2,
    skill: SkillType.Clubs,
    damage: [
      dmg({ blunt: 50, pierce: 45 }),
      dmg({ pierce: 6 }),
    ],
    knockback: 90,
    backstab: 3,
    attacks: [{
      type: 'melee',
      animation: 'swing_longsword',
      chain: 3,
      chainCombo: 2,
      stamina: 14,
      range: 2.4,
    }, {
      type: 'melee',
      animation: 'mace_secondary',
      chain: 0,
      chainCombo: 2,
      stamina: 28,
      range: 2.5,
      mul: { damage: 2.5, force: 2, stagger: 2 },
    }],
    durability: [150, 50],
  },
  { type: 'shield', slot: 'secondary',
    id: 'ShieldBlackmetal',
    emoji: '🛡️',
    tier: 5,
    floating: true,
    stack: 1,
    maxLvl: 3,
    variants: 7,
    weight: 5,
    moveSpeed: -0.05,
    block: [78, 6],
    parryForce: [50, 5],
    parryBonus: 1.5,
    skill: SkillType.Blocking,
    damage: [dmg({ blunt: 10 }), dmg({})],
    knockback: 50,
    backstab: 4,
    durability: [200, 50],
  },
  { type: 'shield', slot: 'secondary',
    id: 'ShieldBlackmetalTower',
    emoji: '🛡️',
    tier: 5,
    floating: true,
    stack: 1,
    maxLvl: 3,
    variants: 7,
    weight: 5,
    moveSpeed: -0.2,
    block: [104, 6],
    parryForce: [150, 5],
    parryBonus: 0,
    skill: SkillType.Blocking,
    damage: [dmg({ blunt: 10 }), dmg({})],
    knockback: 50,
    backstab: 4,
    durability: [200, 50],
  },
// FLAME AGE
  { type: 'weapon', slot: 'primary',
    id: 'SwordIronFire',
    emoji: '🗡️',
    disabled,
    tier: 6,
    stack: 1,
    maxLvl: 4,
    weight: 1,
    moveSpeed: -0.05,
    block: 21,
    parryForce: [20, 5],
    parryBonus: 2,
    skill: SkillType.Swords,
    toolTier: 0,
    damage: [
      dmg({ slash: 55, fire: 30 }),
      dmg({ slash: 5, fire: 6 }),
    ],
    knockback: 40,
    backstab: 3,
    attacks: [{
      type: 'melee',
      animation: 'swing_longsword',
      chain: 3,
      chainCombo: 2,
      stamina: 14,
      range: 2.4,
    }, {
      type: 'melee',
      animation: 'sword_secondary',
      chain: 0,
      chainCombo: 0,
      stamina: 28,
      range: 2.4,
      mul: { damage: 3, force: 1, stagger: 1 },
    }],
    durability: [200, 50],
  },
  { type: 'shield', slot: 'secondary',
    id: 'ShieldKnight',
    emoji: '🛡️',
    disabled,
    tier: -1,
    floating: true,
    stack: 1,
    maxLvl: 1,
    weight: 4,
    moveSpeed: -0.05,
    block: [120, 6],
    parryForce: [40, 5],
    parryBonus: 1.5,
    skill: SkillType.Blocking,
    knockback: 200,
    backstab: 4,
    durability: [100, 50],
  },
  { type: 'shield', slot: 'secondary',
    id: 'ShieldIronSquare',
    emoji: '🛡️',
    disabled,
    tier: -1,
    floating: true,
    stack: 1,
    maxLvl: 3,
    weight: 4,
    moveSpeed: -0.2,
    block: [35, 6],
    parryForce: 30,
    parryBonus: 0,
    skill: SkillType.Blocking,
    knockback: 40,
    backstab: 4,
    durability: [200, 50],
  },
  { type: 'weapon', slot: 'primary',
    id: 'SwordCheat',
    emoji: '🗡️',
    disabled,
    tier: -1,
    stack: 1,
    maxLvl: 1,
    weight: 2,
    moveSpeed: -0.05,
    block: 10,
    parryForce: 0,
    parryBonus: 2,
    skill: SkillType.Swords,
    toolTier: 10,
    damage: [dmg({
      slash: 10000,
      chop: 10000,
      pickaxe: 10000,
    }), dmg({
    })],
    knockback: 40,
    backstab: 3,
    attacks: [{
      type: 'melee',
      animation: 'swing_longsword',
      chain: 3,
      chainCombo: 2,
      stamina: 10,
      range: 2.4,
    }, {
      type: 'melee',
      animation: 'sword_secondary',
      chain: 0,
      chainCombo: 0,
      stamina: 20,
      range: 2.4,
    }],
    durability: [100, 50], // useDurability: false
  },
  { type: 'weapon', slot: 'both',
    id: 'SledgeCheat',
    emoji: '🔨',
    disabled,
    tier: -1,
    stack: 1,
    maxLvl: 4,
    weight: 4,
    moveSpeed: -0.2,
    block: 15,
    parryForce: [50, 10],
    parryBonus: 2,
    skill: SkillType.Clubs,
    toolTier: 10,
    damage: [dmg({ /*damage: 99999, */ }), dmg({ blunt: 6 })],
    knockback: 40,
    backstab: 3,
    attacks: [{
      type: 'area',
      animation: 'swing_sledge',
      chain: 3,
      chainCombo: 2,
      stamina: 25,
      range: 2,
      mul: { damage: 1, force: 1, stagger: 2 },
    }],
    durability: [100, 50],
  },
];

for (const item of items) {
  if (item.components == null) item.components = [];
  item.components.push('ItemDrop');
}

const enabledWeapons = items.filter(w => !w.disabled && w.type === 'weapon') as Weapon[]; 
export const axes = enabledWeapons.filter(w => w.damage[0].chop);
export const pickaxes = enabledWeapons.filter(w => w.damage[0].pickaxe);
