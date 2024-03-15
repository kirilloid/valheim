import { dmg, mods } from '../model/game';
import type { Cart, DamageModifiers, Ship, Siege } from '../types';

const shipDamageModifiers: DamageModifiers = {
  blunt: 'normal',
  slash: 'normal',
  pierce: 'resistant',
  chop: 'immune',
  pickaxe: 'immune',
  fire: 'weak',
  frost: 'resistant',
  lightning: 'normal',
  poison: 'immune',
  spirit: 'immune',
};

export const ships: Ship[] = [
  {
    type: 'ship',
    group: 'ship',
    id: 'Raft',
    components: ['Container', 'Ship', 'Destructible'],
    tier: 1,
    emoji: '',
    wear: {
      hp: 300,
      damageModifiers: shipDamageModifiers,
    },
    piece: {
      target: 'primary',
      water: true,
      size: [4, 6, 4],
    },
    sailWidth: 2.5,
    sail: {
      forceDistance: 2,
      force: 0.5,
      damping: 0.05,
      dampingSideway: 0.1,
      dampingForward: 0.005,
      angularDamping: 0.05,
      sailForceOffset: 0.5,
      sailForceFactor: 0.05,
      rudderForce: 0.5,
      waterLevelOffset: 1.5,
      disableLevel: -0.5,
    },
    speed: {
      rudder: 1.575,
      half: [1.125, 1.139, 1.6, 1.95, 2.1],
      full: [1.59, 1.96, 2.35, 2.7, 2.95],
    },
    storage: [0, 0],
    recipe: {
      type: 'craft_piece',
      materials: { Wood: 20, Resin: 6, LeatherScraps: 6 },
      station: 'piece_workbench',
    },
  },
  {
    type: 'ship',
    group: 'ship',
    id: 'Karve',
    components: ['Container', 'Ship', 'Destructible'],
    tier: 2,
    emoji: '⛵',
    wear: {
      hp: 500,
      damageModifiers: shipDamageModifiers,
    },
    piece: {
      target: 'primary',
      water: true,
      size: [4, 10, 8],
    },
    sailWidth: 8,
    sail: {
      forceDistance: 2,
      force: 1,
      damping: 0.05,
      dampingSideway: 0.15,
      dampingForward: 0.001,
      angularDamping: 0.05,
      sailForceOffset: 1,
      sailForceFactor: 0.03,
      rudderForce: 0.2,
      waterLevelOffset: 1.5,
      disableLevel: -0.5,
    },
    speed: {
      rudder: 3.14,
      half: [2.744, 3.39, 4.05, 4.65, 4.8],
      full: [3.88, 4.78, 5.75, 6.5, 7.0],
    },
    storage: [2, 2],
    recipe: {
      type: 'craft_piece',
      materials: {
        FineWood: 30,
        DeerHide: 10,
        Resin: 20,
        BronzeNails: 80,
      },
      station: 'piece_workbench',
    },
  },
  {
    type: 'ship',
    group: 'ship',
    id: 'VikingShip',
    components: ['Container', 'Ship', 'Destructible'],
    tier: 3,
    emoji: '🚢',
    wear: {
      hp: 1000,
      damageModifiers: shipDamageModifiers,
    },
    piece: {
      target: 'primary',
      water: true,
      size: [6, 22, 12],
    },
    sailWidth: 8,
    sail: {
      forceDistance: 3,
      force: 1,
      damping: 0.05,
      dampingSideway: 0.15,
      dampingForward: 0.001,
      angularDamping: 0.3,
      sailForceOffset: 2,
      sailForceFactor: 0.05,
      rudderForce: 0.2,
      waterLevelOffset: 1.5,
      disableLevel: -0.5,
    },
    speed: {
      rudder: 3.16,
      half: [3.555, 4.42, 5.25, 6.0, 6.7],
      full: [5.03, 6.21, 7.45, 8.5, 9.4],
    },
    storage: [6, 3],
    recipe: {
      type: 'craft_piece',
      materials: {
        IronNails: 100,
        DeerHide: 10,
        FineWood: 40,
        ElderBark: 40,
      },
      station: 'piece_workbench',
    },
  },
  {
    type: 'ship',
    group: 'ship',
    id: 'VikingShip_Ashlands',
    components: ['Container', 'Ship', 'Destructible'],
    tier: 7,
    emoji: '🚢',
    wear: {
      hp: 3000,
      damageModifiers: {
        ...shipDamageModifiers,
        fire: 'resistant',
      },
    },
    piece: {
      target: 'primary',
      water: true,
      size: [12.5, 18, 12.6],
    },
    sailWidth: 15.6,
    sail: {
      forceDistance: 3,
      force: 1,
      damping: 0.05,
      dampingSideway: 0.15,
      dampingForward: 0.002,
      angularDamping: 0.95,
      sailForceOffset: 2,
      sailForceFactor: 0.085,
      rudderForce: 0.5,
      waterLevelOffset: 2.1,
      disableLevel: -0.5,
    },
    speed: {
      rudder: NaN,
      half: [NaN, NaN, NaN, NaN, NaN],
      full: [NaN, NaN, NaN, NaN, NaN],
    },
    storage: [8, 4],
    recipe: {
      type: 'craft_piece',
      materials: {
        IronNails: 100,
        CeramicPlate: 30,
        FineWood: 60,
        YggdrasilWood: 25,
      },
      station: 'piece_workbench',
    },
  },
/*  {
    type: 'ship',
    group: 'ship',
    id: 'TrailerShip',
    components: ['Container'],
    tier: 4,
    wear: {
      hp: 1000,
      damageModifiers: shipDamageModifiers,
    },
    sail: {
      forceDistance: 2,
      force: 0.5,
      damping: 0.1,
      dampingSideway: 0.05,
      dampingForward: 0.005,
      angularDamping: 0.1,
      sailForceOffset: 0,
      sailForceFactor: 0,
      rudderForce: 1.5,
      waterLevelOffset: 1.7,
      disableLevel: -0.5,
    },
    recipe: {
      materials: {
        IronNails: 100,
        DeerHide: 10,
        FineWood: 40,
        ElderBark: 40,
      },
      station: 'piece_workbench',
    },
  },*/
];

const cartDamageModifiers: DamageModifiers = {
  blunt: 'normal',
  slash: 'normal',
  pierce: 'resistant',
  chop: 'ignore',
  pickaxe: 'ignore',
  fire: 'weak',
  frost: 'resistant',
  lightning: 'normal',
  poison: 'immune',
  spirit: 'immune',
}

export const carts: Cart[] = [
  {
    type: 'cart',
    id: 'Cart',
    components: ['Container', 'Vagon', 'Destructible'],
    tier: 1,
    emoji: '🛒',
    // floating: true,
    wear: {
      hp: 500,
      damageModifiers: cartDamageModifiers,
    },
    piece: {
      target: 'primary',
      water: undefined,
      size: [2, 4, 1],
    },
    storage: [6, 4],
    recipe: {
      type: 'craft_piece',
      materials: { Wood: 20, BronzeNails: 10 },
      station: 'piece_workbench',
    },
  },
];

export const siege: Siege[] = [
  {
    type: 'siege',
    id: 'BatteringRam',
    components: ['Container', 'Destructible'],
    tier: 7,
    emoji: '🐏',
    wear: {
      hp: 3000,
      damageModifiers: mods([0, 0, 1, 0, 0, 4, 1, 0, 3, 3]),
    },
    piece: {
      target: 'primary',
      water: undefined,
      size: [4, 3.5, 5.5],
    },
    Siege: {
      fuel: ['Wood', 'FineWood', 'RoundLog'],
      damage: dmg({ pickaxe: 600 }),
      toolTier: 5,
    },
    recipe: {
      type: 'craft_piece',
      materials: { Blackwood: 20, FlametalNew: 10, SurtlingCore: 2 },
      station: 'piece_workbench',
    },
  },
  {
    type: 'siege',
    id: 'Catapult',
    components: ['Container', 'Destructible'],
    tier: 7,
    emoji: '🐱',
    wear: {
      hp: 3000,
      damageModifiers: mods([0, 0, 1, 0, 0, 4, 1, 0, 3, 3]),
    },
    piece: {
      target: 'primary',
      water: undefined,
      size: [3.9, 4, 6.5],
    },
    recipe: {
      type: 'craft_piece',
      materials: { Blackwood: 20, FlametalNew: 10, CharredCogwheel: 1 },
      station: 'piece_workbench',
    },
  },
];
