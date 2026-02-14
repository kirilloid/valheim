import type { Attack } from '../types';

export function swing_axe(stamina: number): Attack {
  return {
    type: 'melee',
    animation: 'swing_axe',
    chain: 3,
    chainCombo: 2,
    stamina,
    adrenaline: 1,
    walkSpeed: 0.2,
    rotationSpeed: 0.3,
    startNoise: 10,
    hitNoise: 40,
    range: 2.2,
  }
}

export function axe_secondary(stamina: number): Attack {
  return {
    type: 'melee',
    animation: 'axe_secondary',
    chain: 0,
    chainCombo: 0,
    stamina,
    adrenaline: 1,
    walkSpeed: 0.2,
    rotationSpeed: 0.3,
    startNoise: 10,
    hitNoise: 40,
    range: 2.2,
    mul: { damage: 1.5, force: 1.5, stagger: 1, },
  };
}

export function dualaxes(stamina: number): Attack {
  return {
    type: 'melee',
    animation: 'dualaxes',
    chain: 4,
    chainCombo: 2,
    stamina,
    adrenaline: 1,
    walkSpeed: 0.2,
    rotationSpeed: 0.3,
    startNoise: 10,
    hitNoise: 40,
    range: 2.2,
  }
}

export function dualaxes_secondary(stamina: number): Attack {
  return {
    type: 'melee',
    animation: 'dualaxes_secondary',
    chain: 0,
    chainCombo: 0,
    stamina,
    adrenaline: 1,
    walkSpeed: 0.2,
    rotationSpeed: 0.2,
    startNoise: 10,
    hitNoise: 40,
    range: 2.2,
    mul: { damage: 1.5, force: 1.5, stagger: 1, },
  };
}

export function spear_poke(stamina: number): Attack {
  return {
    type: 'melee',
    animation: 'spear_poke',
    chain: 0,
    chainCombo: 1,
    stamina,
    adrenaline: 1,
    walkSpeed: 0.2,
    rotationSpeed: 0.2,
    startNoise: 10,
    hitNoise: 30,
    range: 1.9,
  };
}

export function spear_throw(stamina: number): Attack {
  return {
    type: 'proj',
    animation: 'spear_throw',
    projVel: [2, 20],
    projAcc: [20, 1],
    stamina,
    adrenaline: 1,
    walkSpeed: 0.3,
    rotationSpeed: 5,
    startNoise: 10,
    hitNoise: 30,
    range: 1,
    mul: { damage: 1.5, force: 1.5, stagger: 1 },
  };
}

export function unarmed_attack(stamina: number): Attack {
  return {
    type: 'melee',
    animation: 'unarmed_attack',
    chain: 2,
    chainCombo: 1,
    stamina,
    adrenaline: 1,
    walkSpeed: 0.1,
    rotationSpeed: 0.5,
    startNoise: 5,
    hitNoise: 20,
    range: 1.5,
  };
}

export function claw_attack(stamina: number): Attack {
  return {
    type: 'melee',
    animation: 'unarmed_attack',
    chain: 2,
    chainCombo: 2,
    stamina,
    adrenaline: 1,
    walkSpeed: 0.3,
    rotationSpeed: 1,
    startNoise: 1,
    hitNoise: 5,
    range: 2,
  }
}

export function kick(stamina: number): Attack {
  return {
    type: 'melee',
    animation: 'unarmed_kick',
    chain: 0,
    chainCombo: 2,
    stamina,
    adrenaline: 1,
    walkSpeed: 0.2,
    rotationSpeed: 0.2,
    startNoise: 10,
    hitNoise: 30,
    range: 2.5,
    mul: { damage: 1, force: 4, stagger: 6 },
  };
}

export function swing_longsword(stamina: number): Attack {
  return {
    type: 'melee',
    animation: 'swing_longsword',
    chain: 3,
    chainCombo: 2,
    stamina,
    adrenaline: 1,
    walkSpeed: 0.3,
    rotationSpeed: 0.3,
    startNoise: 10,
    hitNoise: 40,
    range: 2.4,
  };
}

export function sword_secondary(stamina: number): Attack {
  return {
    type: 'melee',
    animation: 'sword_secondary',
    chain: 0,
    chainCombo: 2,
    stamina,
    adrenaline: 3,
    walkSpeed: 0.2,
    rotationSpeed: 0,
    startNoise: 10,
    hitNoise: 30,
    range: 2.7,
    mul: { damage: 3, force: 1, stagger: 1 },
  };
}

export function mace_secondary(stamina: number): Attack {
  return {
    type: 'melee',
    animation: 'mace_secondary',
    chain: 0,
    chainCombo: 0,
    stamina,
    adrenaline: 3,
    walkSpeed: 0.2,
    rotationSpeed: 0,
    startNoise: 10,
    hitNoise: 30,
    range: 2.5,
    mul: { damage: 2.5, force: 2, stagger: 2 },
  };
}

export function knife_stab(stamina: number): Attack {
  return {
    type: 'melee',
    animation: 'knife_stab',
    chain: 3,
    chainCombo: 2,
    stamina,
    adrenaline: 1,
    walkSpeed: 0.3,
    rotationSpeed: 1,
    startNoise: 1,
    hitNoise: 5,
    range: 1.8,
  };
}

export function knife_secondary(stamina: number): Attack {
  return {
    type: 'melee',
    animation: 'knife_secondary',
    chain: 0,
    chainCombo: 2,
    stamina,
    adrenaline: 2,
    walkSpeed: 0,
    rotationSpeed: 0,
    startNoise: 2,
    hitNoise: 5,
    range: 1.8,
    mul: { damage: 3, force: 4, stagger: 1 },
  };
}

export function swing_pickaxe(stamina: number): Attack {
  return {
    type: 'melee',
    animation: 'swing_pickaxe',
    chain: 0,
    chainCombo: 2,
    stamina,
    adrenaline: 1,
    walkSpeed: 0.1,
    rotationSpeed: 0.3,
    startNoise: 10,
    hitNoise: 40,
    range: 1.8,
  };
}

export function atgeir_attack(stamina: number): Attack {
  return {
    type: 'melee',
    animation: 'atgeir_attack',
    chain: 3,
    chainCombo: 2,
    stamina,
    adrenaline: 2,
    walkSpeed: 0.2,
    rotationSpeed: 0.5,
    startNoise: 20,
    hitNoise: 30,
    range: 3.2,
  };
}

export function atgeir_secondary(stamina: number): Attack {
  return {
    type: 'melee',
    animation: 'atgeir_secondary',
    chain: 0,
    chainCombo: 2,
    stamina,
    adrenaline: 1,
    walkSpeed: 0.2,
    rotationSpeed: 0.2,
    startNoise: 10,
    hitNoise: 30,
    range: 3,
    mul: { damage: 1, force: 5, stagger: 6 },
  };
}

export function battleaxe_attack(stamina: number): Attack {
  return {
    type: 'melee',
    animation: 'battleaxe_attack',
    chain: 3,
    chainCombo: 2,
    stamina,
    adrenaline: 2,
    walkSpeed: 0.1,
    rotationSpeed: 0.3,
    startNoise: 20,
    hitNoise: 30,
    range: 2.5,
    mul: { damage: 1, force: 1, stagger: 1.5 },
  };
}

export function battleaxe_secondary(stamina: number): Attack {
  return{
    type: 'melee',
    animation: 'battleaxe_secondary',
    chain: 0,
    chainCombo: 2,
    stamina,
    adrenaline: 1,
    walkSpeed: 0.1,
    rotationSpeed: 0.1,
    startNoise: 10,
    hitNoise: 30,
    range: 2.5,
    mul: { damage: 0.5, force: 2, stagger: 4 },
  };
}

export function greatsword(stamina: number): Attack {
  return {
    type: 'melee',
    animation: 'greatsword',
    chain: 3,
    chainCombo: 2,
    stamina,
    adrenaline: 2,
    walkSpeed: 0.3,
    rotationSpeed: 0.3,
    startNoise: 10,
    hitNoise: 40,
    range: 2.6,
  };
}

export function greatsword_secondary(stamina: number): Attack {
  return {
    type: 'melee',
    animation: 'greatsword_secondary',
    chain: 0,
    chainCombo: 2,
    stamina,
    adrenaline: 1,
    walkSpeed: 0.2,
    rotationSpeed: 0,
    startNoise: 10,
    hitNoise: 30,
    range: 3,
    mul: { damage: 3, force: 1, stagger: 1 },
  };
}

export function swing_sledge(stamina: number, lowerStagger = false): Attack {
  return {
    type: 'area',
    animation: 'swing_sledge',
    stamina,
    adrenaline: 2,
    walkSpeed: 0.3,
    rotationSpeed: 0.1,
    startNoise: 10,
    hitNoise: 60,
    range: 2,
    mul: { damage: 1, force: 1, stagger: lowerStagger ? 1 : 2 },
    radius: 5,
  };
}