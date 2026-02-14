import type { Motion } from '../types';

export const swing_pickaxe: Motion = {
  speed: 1.1,
  exit: 1.2,
  duration: 1.25,
  events: [
    { type: 'speed', time: 0.8252547, value: 1.8 },
    { type: 'hit', time: 1.0187981 },
    { type: 'speed', time: 1.0548525, value: 1.1 },
  ],
};

export const spear_poke: Motion = {
  speed: 1,
  exit: 1,
  duration: 0.73333335,
  events: [
    { type: 'hit', time: 0.6094951 },
    { type: 'speed', time: 0.6295849, value: 0.2 },
  ],
};

export const knife_stab: [Motion, Motion, Motion] = [{
  speed: 1.2,
  exit: 1,
  duration: 0.4666667,
  events: [
    { type: 'speed', time: 0.15739386, value: 1.5 },
    { type: 'hit', time: 0.2556193 },
    { type: 'speed', time: 0.33959615, value: 0.5 },
    { type: 'chain', time: 0.36458337 },
  ],
}, {
  speed: 1.2,
  exit: 1,
  duration: 0.6,
  events: [
    { type: 'speed', time: 0.15294123, value: 2 },
    { type: 'hit', time: 0.2157327 },
    { type: 'speed', time: 0.40470588, value: 1 },
    { type: 'chain', time: 0.4846071 },
  ],
}, {
  speed: 1.2,
  exit: 1,
  duration: 0.86666673,
  events: [
    { type: 'speed', time: 0.20823471, value: 2.5 },
    { type: 'hit', time: 0.51597583 },
    { type: 'speed', time: 0.5675817, value: 1 },
  ],
}];

export const knife_secondary: Motion = {
  speed: 1,
  exit: 1,
  duration: 1.1,
  events: [
    { type: 'speed', time: 0, value: 0.5 },
    { type: 'speed', time: 0.20421943, value: 1.2 },
    { type: 'speed', time: 0.6934218, value: 1.5 },
    { type: 'hit', time: 0.80205363 },
    { type: 'speed', time: 0.86935484, value: 0.5 },
  ],
};

export const dual_knives: [Motion, Motion, Motion] = [{
  speed: 1.1,
  exit: 1,
  duration: 0.4,
  events: [
    { type: 'hit', time: 0.18205547 },
    { type: 'chain', time: 0.36411095 },
  ],
}, {
  speed: 1.1,
  exit: 1,
  duration: 0.4,
  events: [
    { type: 'hit', time: 0.17683524 },
    { type: 'chain', time: 0.3699837 },
  ],
}, {
  speed: 1.1,
  exit: 1,
  duration: 0.5,
  events: [
    { type: 'hit', time: 0.17569481 },
    { type: 'speed', time: 0.19178672, value: 0.5 },
    { type: 'speed', time: 0.30719864, value: 1 },
  ],
}];

export const dual_knives_secondary: Motion = {
  speed: 1,
  exit: 1,
  duration: 1.5,
  events: [
    { type: 'hit', time: 0.8393148 },
  ],
}

export const swing_axe: [Motion, Motion, Motion] = [{
  speed: 1,
  exit: 1,
  duration: 1.1333334,
  events: [
    { type: 'speed', time: 0.45600194, value: 1.5 },
    { type: 'hit', time: 0.61044395 },
    { type: 'speed', time: 0.75166094, value: 0.8 },
    { type: 'chain', time: 0.86975366 },
  ],
}, {
  speed: 1.4,
  exit: 0.99,
  duration: 0.9,
  events: [
    { type: 'speed', time: 0.48521894, value: 1.7 },
    { type: 'hit', time: 0.7261944 },
    { type: 'speed', time: 0.8236557, value: 0.8 },
    { type: 'chain', time: 0.9 },
  ],
}, {
  speed: 1.2,
  exit: 1,
  duration: 0.96666694,
  events: [
    { type: 'speed', time: 0.5935055, value: 2 },
    { type: 'hit', time: 0.7960749 },
    { type: 'speed', time: 0.84001136, value: 0.4 },
  ],
}];

export const axe_secondary: Motion = {
  speed: 1,
  exit: 1,
  duration: 1.8333334,
  events: [
    { type: 'hit', time: 1.122059 },
  ],
};

export const unarmed_attack: [Motion, Motion] = [{
  speed: 1,
  exit: 0.9,
  duration: 1.166667,
  events: [
    { type: 'speed', time: 0, value: 2 },
    { type: 'speed', time: 0.6974806, value: 2 },
    { type: 'hit', time: 0.8402074 },
    { type: 'speed', time: 0.9159709, value: 1 },
    { type: 'chain', time: 1.1666666 },
  ],
}, {
  speed: 1,
  exit: 0.9,
  duration: 1.2,
  events: [
    { type: 'speed', time: 0, value: 2 },
    { type: 'speed', time: 0.6732648, value: 2 },
    { type: 'hit', time: 0.90332276 },
    // { type: 'chain', time: 0.99255246 },
  ],
}];

export const unarmed_kick: Motion = {
  speed: 1.2,
  exit: 0.9,
  duration: 1.833334,
  events: [
    { type: 'speed', time: 0.45937228, value: 2 },
    { type: 'speed', time: 0.58093244, value: 1 },
    { type: 'hit', time: 0.5931865 },
  ],
};

export const swing_longsword: [Motion, Motion, Motion] = [{
  speed: 1,
  exit: 0.9,
  duration: 1.1333334,
  events: [
    { type: 'speed', time: 0.37238097, value: 1.2 },
    { type: 'hit', time: 0.4718539 },
    { type: 'speed', time: 0.6010714, value: 1 },
    { type: 'chain', time: 0.7300025 },
  ],
}, {
  speed: 1,
  exit: 0.8,
  duration: 0.8333335,
  events: [
    { type: 'speed', time: 0.21428575, value: 1.1 },
    { type: 'hit', time: 0.2585182 },
    { type: 'speed', time: 0.44237018, value: 1 },
    { type: 'chain', time: 0.5566318 },
  ],
}, {
  speed: 1,
  exit: 0.9208792,
  duration: 0.8333335,
  events: [
    { type: 'speed', time: 0.023809671, value: 0.5 },
    { type: 'speed', time: 0.13970067, value: 1.5 },
    { type: 'hit', time: 0.2775261 },
    { type: 'speed', time: 0.54852074, value: 1 },
  ],
}];

export const sword_secondary: Motion = {
  speed: 1,
  exit: 1,
  duration: 0.40000004,
  events: [
    { type: 'speed', time: 0, value: 0.2 },
    { type: 'speed', time: 0.184375, value: 0.6 },
    { type: 'hit', time: 0.24395679 },
    { type: 'speed', time: 0.2536932, value: 0.2 },
  ],
};

export const greatsword: [Motion, Motion, Motion] = [{
  speed: 1,
  exit: 1,
  duration: 1.1666667,
  events: [
    { type: 'hit', time: 0.6043783 },
    { type: 'chain', time: 0.7830746 },
  ],
}, {
  speed: 1,
  exit: 1,
  duration: 1,
  events: [
    { type: 'hit', time: 0.49232265 },
    { type: 'chain', time: 0.6414653 },
  ],
}, {
  speed: 1,
  exit: 1,
  duration: 1.5,
  events: [
    { type: 'hit', time: 0.6385788 },
    // { type: 'chain', time: 0.7830746 },
  ],
}];

export const greatsword_secondary: Motion = {
  speed: 1,
  exit: 1,
  duration: 2,
  events: [
    { type: 'hit', time: 0.95921695 },
  ],
};

export const mace_secondary: Motion = {
  speed: 1,
  exit: 0.8,
  duration: 2.1333334,
  events: [
    { type: 'speed', time: 0.9759488, value: 1.5 },
    { type: 'hit', time: 1.2228695 },
    { type: 'speed', time: 1.4356008, value: 1 },
  ],
};

export const battleaxe_attack: [Motion, Motion, Motion] = [{
  speed: 1,
  exit: 0.9,
  duration: 2.1333334,
  events: [
    { type: 'speed', time: 0.078587286, value: 1.3 },
    { type: 'speed', time: 1.1176888, value: 2 },
    { type: 'hit', time: 1.3926183 },
    { type: 'speed', time: 1.6324664, value: 1 },
  ],
}, {
  speed: 1,
  exit: 0.8,
  duration: 1.2666669,
  events: [
    { type: 'speed', time: 0.21238957, value: 1.5 },
    { type: 'hit', time: 0.3639629 },
  ],
}, {
  speed: 1,
  exit: 1,
  duration: 0.8000001,
  events: [
    { type: 'speed', time: 0.15450647, value: 0.5 },
    { type: 'speed', time: 0.21287556, value: 2 },
    { type: 'hit', time: 0.5290988 },
    { type: 'speed', time: 0.5339057, value: 0.4 },
  ],
}];

export const battleaxe_secondary: Motion = {
  speed: 1,
  exit: 0.9,
  duration: 0.8566667,
  events: [
    { type: 'speed', time: 0.21647023, value: 1.5 },
    { type: 'hit', time: 0.4643808 },
    { type: 'speed', time: 0.5257521, value: 1 },
  ],
};

export const atgeir_attack: [Motion, Motion, Motion] = [{
  speed: 1,
  exit: 1,
  duration: 0.6666667,
  events: [
    { type: 'hit', time: 0.46971092 },
  ],
}, {
  speed: 1,
  exit: 1,
  duration: 0.70000005,
  events: [
    { type: 'hit', time: 0.5542466 },
  ],
}, {
  speed: 1,
  exit: 1,
  duration: 0.73333335,
  events: [
    { type: 'hit', time: 0.6094951 },
    { type: 'speed', time: 0.6295849, value: 0.2 },
  ],
}];

export const atgeir_secondary: Motion = {
  speed: 1,
  exit: 1,
  duration: 2.2,
  events: [
    { type: 'speed', time: 0, value: 2 },
    { type: 'speed', time: 0.8753472, value: 2 },
    { type: 'hit', time: 1.1244563 },
    { type: 'speed', time: 1.5808647, value: 1 },
  ],
};

export const dualaxes: [Motion, Motion, Motion, Motion] = [{
  speed: 1,
  exit: 0.75,
  duration: 1.2666668,
  events: [
    { type: 'hit', time: 0.2113211 },
    { type: 'chain', time: 0.25730532 },
  ],
}, {
  speed: 1,
  exit: 0.8,
  duration: 1.4333334,
  events: [
    { type: 'hit', time: 0.37244093 },
    { type: 'chain', time: 0.53272223 },
  ],
}, {
  speed: 1,
  exit: 0.75,
  duration: 1.5000001,
  events: [
    { type: 'hit', time: 0.3348819 },
    { type: 'hit', time: 0.5527362 },
    { type: 'chain', time: 0.70559055 },
  ],
}, {
  speed: 1,
  exit: 0.75,
  duration: 1.5000001,
  events: [
    { type: 'hit', time: 0.36732283 },
    { type: 'hit', time: 0.5397638 },
  ],
}];

export const dualaxes_secondary: Motion = {
  speed: 1,
  exit: 0.92,
  duration: 1.9000001,
  events: [
    { type: 'hit', time: 0.91479266 },
  ],
};

export const swing_sledge: Motion = {
  speed: 1,
  exit: 1.1,
  duration: 1.6666667,
  events: [
    { type: 'speed', time: 0.8440723, value: 1.5 },
    { type: 'speed', time: 1.2650342, value: 1 },
    { type: 'hit', time: 1.2955083 },
  ],
};

export const spear_throw: Motion = {
  speed: 1,
  exit: 1,
  duration: 1.1333334,
  events: [
    { type: 'speed', time: 0, value: 1 },
    { type: 'speed', time: 0.49859652, value: 1.5 },
    { type: 'trailOn', time: 0.5094801 },
    { type: 'hit', time: 0.73876804 },
    { type: 'speed', time: 0.7974269, value: 1 },
  ],
};

// bow_aim: 3.766667
export const bow_fire: Motion = {
  speed: 1,
  exit: 0.8,
  duration: 0.70000005,
  events: [
    { type: 'hit', time: 0.16677116 },
  ],
};

export const crossbow_fire: Motion = {
  speed: 1,
  exit: 1,
  duration: 0.5,
  events: [
    { type: 'hit', time: 0.006198347 },
  ],
};

export const crossbow_reload: Motion = {
  speed: 1.4,
  exit: 0.9444444,
  duration: 3.6000001,
  events: [],
};

export const lightning_staff_recharge: Motion = {
  speed: 0.8,
  exit: 0.9305556,
  duration: 1.5333334,
  events: [],
};

export const recharge_done: Motion = {
  speed: 1,
  exit: 1,
  duration: 0.33333337,
  events: [],
};

export const lightning_staff_fire: Motion = {
  speed: 1,
  exit: 0.8333334,
  duration: 1,
  events: [{ type: 'hit', time: 0.52047247 }],
};

export const staff_fireball: [Motion, Motion] = [{
  speed: 1,
  exit: 1,
  duration: 0.8333334,
  events: [{ type: 'hit', time: 0.50706905 }],
}, {
  speed: 1,
  exit: 0.75,
  duration: 1,
  events: [{ type: 'hit', time: 0.4991844 }],
}];

export const staff_rapidfire: Motion = {
  speed: 1,
  exit: 0.8557693,
  duration: 0.4666667,
  events: [{ type: 'hit', time: 0.35231787 }],
};

export const staff_rapidfire_loop: Motion = {
  speed: 1,
  exit: 0.6875,
  duration: 0.8000001,
  events: [],
};

export const throw_bomb: Motion = {
  speed: 1.5,
  exit: 1,
  duration: 1.1666667,
  events: [
    { type: 'trailOn', time: 0.5071111 },
    { type: 'speed', time: 0.5132611, value: 1.5 },
    { type: 'hit', time: 0.7604965 },
  ],
};

export const staff_summon: Motion = {
  speed: 1,
  exit: 0.9,
  duration: 1.1666667,
  events: [
    { type: 'trailOn', time: 0.5071111 },
    { type: 'speed', time: 0.5132611, value: 1.5 },
    { type: 'hit', time: 0.7604965 },
  ],
};
