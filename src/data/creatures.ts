import type {
  AttackCollider,
  AttackProfile,
  AttackVariety,
  Creature,
  DamageModifiers,
  EntityId,
  Fish,
} from '../types';

import { TOLERATE } from '../types';
import { mods, dmg, dropEntry, dropTrophy } from '../model/game';
import { creaturesById } from './spawn-list';

const defaultDmgModifiers: DamageModifiers = {
  blunt: 'normal',
  slash: 'normal',
  pierce: 'normal',
  chop: 'ignore',
  pickaxe: 'ignore',
  fire: 'normal',
  frost: 'normal',
  lightning: 'normal',
  poison: 'normal',
  spirit: 'normal',
};

const animalDmgModifiers: DamageModifiers = {
  ...defaultDmgModifiers,
  spirit: 'immune',
}

const grayModifiers: DamageModifiers = {
  ...animalDmgModifiers,
  fire: 'veryWeak',
  poison: 'resistant',
};

const blobDamageModifiers: DamageModifiers = mods([2, 1, 1, 4, 4, 1, 2, 2, 3, 0]);

const skeletonDamageModifiers: DamageModifiers = {
  ...defaultDmgModifiers,
  blunt: 'weak',
  pierce: 'resistant',
  fire: 'weak',
  frost: 'resistant',
  poison: 'immune',
};

const loxDamageModifiers = mods([1, 1, 0, 4, 4, 2, 1, 0, 0, 3]);

const seekerDamageModifiers: DamageModifiers = {
  blunt: 'resistant',
  slash: 'resistant',
  pierce: 'resistant',
  chop: 'ignore',
  pickaxe: 'ignore',
  fire: 'normal',
  frost: 'normal',
  lightning: 'normal',
  poison: 'normal',
  spirit: 'immune',
};

const charredDmgModifiers = mods([0, 0, 1, 4, 4, 5, 0, 0, 3, 2]);
const charredSummonDmgModifiers = mods([0, 0, 1, 4, 4, 3, 0, 0, 3, 2]);

const unblockable = true;
const undodgeable = true;

const areaCollider = (radius: number): AttackCollider => ({ type: 'area', radius });

const single = (attacks: AttackProfile[]): [AttackVariety] => {
  return [{ rate: 1, variety: '', attacks }]; 
};

export const maxLvl = (creature: Creature | Fish) => {
  return creaturesById[creature.id]
    ?.reduce((l, s) => Math.max(l, (s.levels ?? [1, 3])[1]), creature.maxLvl ?? 1) ?? 1;
};

export const minLvl = (creature: Creature | Fish) => {
  return creaturesById[creature.id]
    ?.reduce((l, s) => Math.min(l, (s.levels ?? [1, 3])[1]), creature.minLvl ?? 1) ?? 1; 
};

function variations(main: Creature, ...others: (Partial<Omit<Creature, 'id'>> & { id: EntityId })[]): Creature[] {
  return [
    main,
    ...others.map(other => ({ ...main, ...other })),
  ];
}

const aggravatable = true;

export const player: Creature = {
  type: 'creature',
  id: 'Player',
  ragdollId: 'Player_ragdoll',
  components: ['Character'],
  tier: 0,
  emoji: '🧑',
  faction: 'Players',
  attacks: [],
  tolerate: TOLERATE.WATER,
  speed: { walk: 1.6, run: 7, swim: 2 },
  turnSpeed: { walk: 300, run: 3000, swim: 100 },
  hp: 100,
  stagger: null,
  damageModifiers: mods([0, 0, 0, 3, 3, 0, 0, 0, 0, 3]),
  drop: [],
}

export const creatures: Creature[] = [
// MEADOWS
  ...variations({
    type: 'creature',
    id: 'Deer',
    ragdollId: 'deer_ragdoll',
    components: ['Character'],
    tags: ['animal'],
    tier: 1,
    emoji: '🦌',
    faction: 'ForestMonsters',
    attacks: [],
    tolerate: TOLERATE.WATER,
    speed: { walk: 1.5, run: 7, swim: 2 },
    turnSpeed: { walk: 80, run: 200, swim: 100 },
    hp: 10,
    stagger: null,
    damageModifiers: animalDmgModifiers,
    drop: [
      dropEntry('DeerMeat', { min: 2, max: 2 }),
      dropEntry('DeerHide', { max: 3 }),
      dropTrophy('TrophyDeer', 0.5),
    ],
  },
  {
    id: 'Deer_White',
    disabled: true,
    speed: { walk: 2, run: 10, swim: 2 },
    turnSpeed: { walk: 80, run: 200, swim: 100 },
    hp: 30,
    drop: [
      dropEntry('DeerMeat', { min: 2, max: 2 }),
      dropTrophy('TrophyDeer', 0.5),
    ],
  }),
  {
    type: 'creature',
    group: 'bird',
    id: 'Seagal',
    ragdollId: null,
    components: ['RandomFlyingBird'],
    tags: ['fly'],
    tier: 1,
    emoji: '🦆',
    faction: 'ForestMonsters',
    attacks: [],
    tolerate: TOLERATE.WATER | TOLERATE.SMOKE,
    speed: { walk: 0, run: 15, swim: 0 },
    turnSpeed: { walk: 0, run: 60, swim: 0 },
    hp: 1,
    stagger: null,
    damageModifiers: animalDmgModifiers,
    drop: [
      dropEntry('Feathers', { min: 3, max: 3 }),
    ],
  },
  {
    type: 'creature',
    id: 'Greyling',
    ragdollId: 'Greyling_ragdoll',
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI'],
    tier: 1,
    emoji: '🐀',
    faction: 'ForestMonsters',
    // ['Meadows'],
    attacks: single([{ dmg: dmg({ slash: 5 }), stagger: 2.16, name: 'bite' }]),
    tolerate: TOLERATE.WATER | TOLERATE.SMOKE,
    speed: { walk: 0, run: 0, swim: 0 },
    turnSpeed: { walk: 0, run: 0, swim: 0 },
    hp: 20,
    stagger: { factor: 0.3, time: 2.06 },
    damageModifiers: grayModifiers,
    drop: [
      dropEntry('Resin'),
    ],
  },
  {
    type: 'creature',
    id: 'Neck',
    ragdollId: 'Neck_Ragdoll',
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI'],
    tags: ['animal'],
    tier: 1,
    upgradeDistance: 800,
    emoji: '🦎',
    faction: 'ForestMonsters',
    attacks: single([{ dmg: dmg({ slash: 6 }), stagger: 1.66, name: 'bite' }]),
    tolerate: TOLERATE.WATER | TOLERATE.SMOKE,
    speed: { walk: 1, run: 5, swim: 2 },
    turnSpeed: { walk: 200, run: 200, swim: 400 },
    hp: 5,
    stagger: { factor: 0.5, time: 1.54 },
    damageModifiers: animalDmgModifiers,
    drop: [
      dropEntry('NeckTail', { chance: 0.75 }),
      dropTrophy('TrophyNeck', 0.05),
    ],
  },
  ...variations({
    type: 'creature',
    id: 'Boar',
    ragdollId: 'boar_ragdoll',
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI', 'Procreation', 'Tameable'],
    tags: ['animal'],
    tier: 1,
    upgradeDistance: 800,
    emoji: '🐗',
    faction: 'ForestMonsters',
    factionGroup: 'boar',
    attacks: single([{ dmg: dmg({ blunt: 10 }), stagger: 1.24, name: 'tusks' }]),
    tolerate: TOLERATE.WATER,
    speed: { walk: 1.5, run: 8, swim: 2 },
    turnSpeed: { walk: 100, run: 200, swim: 100 },
    hp: 10,
    stagger: { factor: 0.5, time: 1.34 },
    damageModifiers: animalDmgModifiers,
    drop: [
      dropEntry('RawMeat'),
      dropEntry('LeatherScraps'),
      dropTrophy('TrophyBoar', 0.15),
    ],
    tame: {
      tameTime: 1800, fedTime: 600, commandable: true,
      eats: ['Raspberry', 'Mushroom', 'Blueberries', 'Carrot', 'Turnip', 'Onion']
      // eatRange:1.0, searchRange:10, heal:5
    },
    pregnancy: { points: 3, time: 60, chance: 0.33, grow: 3000, childId: 'Boar_piggy' },
  }, {
    id: 'Boar_spiritcaller',
    ragdollId: null,
    iconId: 'resource/TrophyBoar',
    tier: 8,
    faction: 'Players',
    attacks: single([
      // spiritboar_base_attack
      { dmg: dmg({ blunt: 100 }), force: 40, name: 'tusks' },
    ]),
    hp: 1000,
    drop: [],
    pregnancy: undefined,
  }),
  {
    type: 'creature',
    id: 'Boar_piggy',
    iconId: 'creature/Boar',
    ragdollId: null,
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI', 'Growup'],
    tags: ['animal'],
    tier: 1,
    emoji: '🐗',
    faction: 'ForestMonsters',
    factionGroup: 'boar',
    attacks: [],
    tolerate: TOLERATE.WATER,
    speed: { walk: 1.5, run: 8, swim: 2 },
    turnSpeed: { walk: 100, run: 200, swim: 100 },
    hp: 10,
    stagger: { factor: 0.5, time: 1 },
    damageModifiers: animalDmgModifiers,
    drop: [],
  },
  {
    type: 'creature',
    id: 'Eikthyr',
    ragdollId: 'eikthyr_ragdoll',
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI'],
    tier: 1,
    emoji: '🦌',
    faction: 'Boss',
    attacks: single([
      { dmg: dmg({ pierce: 20, chop: 1000, pickaxe: 1000 }), name: 'antlers', force: 100, toolTier: 0 },
      { dmg: dmg({ lightning: 15 }), name: 'charge', force: 200 },
      { dmg: dmg({ lightning: 15 }), name: 'stomp', force: 10, collider: areaCollider(10) },
    ]),
    tolerate: TOLERATE.WATER | TOLERATE.SMOKE,
    speed: { walk: 2, run: 8, swim: 4 },
    turnSpeed: { walk: 100, run: 100, swim: 50 },
    hp: 500,
    stagger: null,
    damageModifiers: defaultDmgModifiers,
    drop: [
      dropEntry('HardAntler', { min: 3, max: 3 }),
      dropTrophy('TrophyEikthyr', 1),
    ],
  },
// FOREST
  ...variations({
    type: 'creature',
    group: 'bird',
    id: 'Crow',
    ragdollId: null,
    components: ['RandomFlyingBird'],
    tags: ['fly'],
    tier: 2,
    emoji: '🐦',
    faction: 'ForestMonsters',
    attacks: [],
    tolerate: TOLERATE.WATER | TOLERATE.SMOKE,
    speed: { walk: 0, run: 15, swim: 0 },
    turnSpeed: { walk: 0, run: 60, swim: 0 },
    hp: 1,
    stagger: null,
    damageModifiers: animalDmgModifiers,
    drop: [
      dropEntry('Feathers', { min: 3, max: 3 }),
    ],
  }, {
    id: 'AshCrow',
    tier: 7,
  }),
  ...variations({
    type: 'creature',
    id: 'Skeleton',
    ragdollId: null,
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI', 'VisEquipment'],
    tier: 2,
    emoji: '💀',
    faction: 'Undead',
    attacks: [
      { rate: 4, variety: 'sword', attacks: [{ dmg: dmg({ slash: 25 }), stagger: 2.48, force: 40, name: 'sword' }] },
      { rate: 1, variety: 'bow', attacks: [{ dmg: dmg({ pierce: 20 }), stagger: 2.48, force: 15, name: 'bow' }] },
    ],
    tolerate: TOLERATE.WATER | TOLERATE.SMOKE,
    speed: { walk: 1, run: 4, swim: 0 },
    turnSpeed: { walk: 300, run: 300, swim: 0 },
    hp: 40,
    stagger: { factor: 0.5, time: 2.48 },
    damageModifiers: skeletonDamageModifiers,
    drop: [
      dropEntry('BoneFragments'),
      dropTrophy('TrophySkeleton', 0.1),
    ],
  },
  {
    id: 'Skeleton_Meadows',
    disabled: true,
    tier: 1,
    attacks: [
      { rate: 4, variety: 'sword', attacks: [{ dmg: dmg({ slash: 15 }), stagger: 2.48, force: 30, name: 'sword' }] },
      { rate: 1, variety: 'bow', attacks: [{ dmg: dmg({ pierce: 15 }), stagger: 2.48, force: 15, name: 'bow' }] },
    ],
    hp: 30,
  },
  {
    id: 'Skeleton_Meadows_noarcher',
    iconId: 'resource/TrophySkeleton',
    tier: 1,
    attacks: single([{ dmg: dmg({ slash: 15 }), stagger: 2.48, force: 30, name: 'sword' }]),
    hp: 30,
  },
  {
    id: 'Skeleton_Swamps',
    iconId: 'resource/TrophySkeleton',
    tier: 3,
    emoji: '☠️',
    faction: 'Undead',
    attacks: [
      { rate: 4, variety: 'sword', attacks: [{ dmg: dmg({ slash: 48, chop: 10 }), stagger: 2.48, force: 40, name: 'sword' }] },
      { rate: 1, variety: 'bow', attacks: [{ dmg: dmg({ pierce: 55 }), stagger: 2.48, force: 15, name: 'bow' }] },
    ],
    hp: 60,
  },
  {
    id: 'Skeleton_Mountain',
    iconId: 'resource/TrophySkeleton',
    tier: 4,
    attacks: [
      { rate: 3, variety: 'sword', attacks: [{ dmg: dmg({ slash: 60, chop: 15 }), stagger: 2.48, force: 40, name: 'sword' }] },
      { rate: 2, variety: 'bow', attacks: [{ dmg: dmg({ pierce: 60 }), stagger: 2.48, force: 15, name: 'bow' }] },
    ],
    hp: 75,
  },
  {
    id: 'Skeleton_DeepNorth',
    iconId: 'resource/TrophySkeleton',
    tier: 8,
    attacks: single([
      { dmg: dmg({ /* dmg: 15, */ blunt: 80, frost: 10 }), stagger: 2.48, force: 80, name: 'mace' },
    ]),
    hp: 100,
  },
  {
    type: 'creature',
    id: 'Skeleton_Poison', // Rancid Remains
    ragdollId: null,
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI', 'VisEquipment'],
    tier: 2,
    emoji: '☠️',
    faction: 'Undead',
    attacks: single([{
      dmg: dmg({ blunt: 20, poison: 30 }),
      stagger: 3.96, 
      name: 'mace',
    }]),
    tolerate: TOLERATE.WATER | TOLERATE.SMOKE,
    speed: { walk: 1, run: 4, swim: 1 },
    turnSpeed: { walk: 300, run: 300, swim: 300 },
    hp: 100,
    stagger: { factor: 0.5, time: 3.44 },
    damageModifiers: skeletonDamageModifiers,
    drop: [
      dropEntry('BoneFragments', { min: 3, max: 3 }),
      dropTrophy('TrophySkeletonPoison', 0.1),
    ],
  }),
  ...variations({
    type: 'creature',
    id: 'Skeleton_Hildir',
    iconId: 'resource/TrophySkeletonHildir',
    group: 'semiboss',
    ragdollId: null,
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI', 'VisEquipment'],
    tier: 2,
    emoji: '☠️',
    faction: 'Undead',
    attacks: single([
      { dmg: dmg({ fire: 75 }), name: 'skeleton_hildir_firenova', force: 40, toolTier: 0 }, // AoE
      { dmg: dmg({ slash: 60, fire: 20 }), name: 'skeleton_sword_hildir', force: 40, toolTier: 0 },
    ]),
    tolerate: TOLERATE.WATER | TOLERATE.SMOKE | TOLERATE.FIRE,
    speed: { walk: 1, run: 4, swim: 1 },
    turnSpeed: { walk: 300, run: 300, swim: 100 },
    hp: 1200,
    stagger: { factor: 0.5, time: 2.48 },
    damageModifiers: mods([2, 0, 1, 4, 4, 3, 2, 0, 3, 0 ]),
    drop: [
      dropTrophy('chest_hildir1', 1),
      dropTrophy('TrophySkeletonHildir', 1),
    ],
  },
  {
    id: 'Skeleton_Hildir_nochest',
    tier: 3,
    hp: 600,
    drop: [
      dropTrophy('TrophySkeletonHildir', 1),
    ],
  }),
  {
    type: 'creature',
    id: 'Ghost',
    iconId: 'resource/TrophyGhost',
    ragdollId: null,
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI', 'VisEquipment'],
    tier: 2,
    emoji: '👻',
    faction: 'Undead',
    attacks: single([ { dmg: dmg({ slash: 25 }), stagger: 2.1, name: 'slash' } ]),
    tolerate: TOLERATE.WATER | TOLERATE.SMOKE,
    speed: { walk: 1, run: 4, swim: 1 },
    turnSpeed: { walk: 300, run: 300, swim: 300 },
    hp: 60,
    stagger: { factor: 0.5, time: 1.98 },
    damageModifiers: {
      ...defaultDmgModifiers,
      blunt: 'resistant',
      slash: 'resistant',
      pierce: 'resistant',
      poison: 'immune',
      spirit: 'weak',
    },
    drop: [
      dropEntry('Ectoplasm', { max: 3 }),
      dropTrophy('TrophyGhost', 0.1),
    ],
  },
  ...variations({
    type: 'creature',
    group: 'gray',
    id: 'Greydwarf',
    ragdollId: 'Greydwarf_ragdoll',
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI'],
    tier: 2,
    emoji: '',
    faction: 'ForestMonsters',
    attacks: single([
      { dmg: dmg({ slash: 14 }), stagger: 1.94, name: 'hit' },
      { dmg: dmg({ blunt: 10 }), stagger: 1.94, name: 'stone' },
    ]),
    tolerate: TOLERATE.WATER | TOLERATE.SMOKE,
    speed: { walk: 2, run: 6, swim: 1.5 },
    turnSpeed: { walk: 200, run: 200, swim: 200 },
    hp: 40,
    stagger: { factor: 0.3, time: 1.92 },
    damageModifiers: grayModifiers,
    drop: [
      dropEntry('GreydwarfEye', { chance: 0.5 }),
      dropEntry('Stone'),
      dropEntry('Wood'),
      dropEntry('Resin'),
      dropTrophy('TrophyGreydwarf', 0.05),
    ],
  }, {
    id: 'Greydwarf_Frozen',
    ragdollId: 'Greydwarf_ragdoll_frozen',
    iconId: 'resource/TrophyGreydwarf',
    tier: 8,
    faction: 'DeepNorth',
    attacks: single([
      { dmg: dmg({ blunt: 20, slash: 60, frost: 16 }), stagger: 1.94, force: 30, name: 'hit' },
      { dmg: dmg({ blunt: 60, frost: 20 }), stagger: 1.94, force: 30, name: 'stone' },
    ]),
    hp: 100,
    drop: [
      dropEntry('GreydwarfEye', { chance: 0.5 }),
      dropEntry('Wood'),
      dropEntry('Resin'),
      dropTrophy('TrophyGreydwarf', 0.05),
      dropEntry('Snowball'),
      dropEntry('Ice', { max: 2 }),
    ],
  }),
  ...variations({
    type: 'creature',
    group: 'gray',
    id: 'Greydwarf_Shaman',
    ragdollId: 'Greydwarf_Shaman_ragdoll',
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI'],
    tier: 2,
    emoji: '',
    faction: 'ForestMonsters',
    attacks: single([
      { dmg: dmg({ poison: 30 }), name: 'poison breath' },
      { dmg: dmg({ slash: 14 }), stagger: 1.4, name: 'slash' },
      { cast: 'SE_Greydwarf_shaman_heal' }
    ]),
    tolerate: TOLERATE.WATER | TOLERATE.SMOKE,
    speed: { walk: 2, run: 4, swim: 1.5 },
    turnSpeed: { walk: 200, run: 200, swim: 100 },
    hp: 60,
    stagger: { factor: 0.33, time: 1.24 },
    damageModifiers: grayModifiers,
    drop: [
      dropEntry('GreydwarfEye', { chance: 0.5 }),
      dropEntry('Wood'),
      dropEntry('Resin', { max: 2 }),
      dropTrophy('TrophyGreydwarfShaman', 0.1),
      dropEntry('Pukeberries', { max: 2 }),
    ],
  }, {
    id: 'Greydwarf_Shaman_Frozen',
    ragdollId: 'Greydwarf_Shaman_ragdoll_frozen',
    iconId: 'resource/TrophyGreydwarfShaman',
    tier: 8,
    faction: 'DeepNorth',
    hp: 120,
    drop: [
      dropEntry('GreydwarfEye', { chance: 0.5 }),
      dropEntry('Wood'),
      dropEntry('Resin', { max: 2 }),
      dropTrophy('TrophyGreydwarfShaman', 0.1),
      dropEntry('Pukeberries', { max: 2 }),
      dropEntry('Ice', { max: 2 }),
    ],
  }),
  {
    type: 'creature',
    group: 'gray',
    id: 'Greydwarf_Elite',
    ragdollId: 'Greydwarf_elite_ragdoll',
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI'],
    tier: 2,
    upgradeDistance: 2000,
    emoji: '',
    faction: 'ForestMonsters',
    attacks: single([
      { dmg: dmg({ slash: 30 }), stagger: 2.08, name: 'bite' },
    ]),
    tolerate: TOLERATE.WATER | TOLERATE.SMOKE,
    speed: { walk: 2, run: 5, swim: 1 },
    turnSpeed: { walk: 200, run: 200, swim: 200 },
    hp: 150,
    stagger: { factor: 0.5, time: 1.94 },
    damageModifiers: grayModifiers,
    drop: [
      dropEntry('GreydwarfEye', { chance: 0.5, min: 2, max: 2 }),
      dropEntry('Stone', { min: 2, max: 2 }),
      dropEntry('Wood', { min: 3, max: 5 }),
      dropEntry('Dandelion'),
      dropEntry('AncientSeed', { chance: 0.33 }),
      dropTrophy('TrophyGreydwarfBrute', 0.1),
    ],
  },
  ...variations({
    type: 'creature',
    id: 'Bjorn',
    ragdollId: 'Bjorn_ragdoll',
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI'],
    tags: ['animal'],
    tier: 2,
    upgradeDistance: 2000,
    emoji: '🐻',
    faction: 'ForestMonsters',
    factionGroup: 'bjorn',
    attacks: single([
      { dmg: dmg({ pierce: 55 }), force: 40, name: 'bite' },
      { dmg: dmg({ slash: 50, chop: 40 }), force: 40, name: 'claws' },
      { dmg: dmg({ slash: 25, chop: 40 }), force: 35, name: 'swipe_l' },
      { dmg: dmg({ slash: 25, chop: 40 }), force: 35, name: 'swipe_r' },
      { dmg: dmg({ slash: 25, chop: 40 }), force: 40, name: 'swipe_combo' },
      { dmg: dmg({ blunt: 50, chop: 40, pickaxe: 40 }), force: 100, name: 'slam' },
    ]),
    tolerate: TOLERATE.WATER,
    speed: { walk: 3.33, run: 7, swim: 3 },
    turnSpeed: { walk: 80, run: 100, swim: 50 },
    hp: 500,
    regenAllHPTime: 3000,
    stagger: { factor: 0.3, time: 3 },
    damageModifiers: {
      blunt: 'resistant',
      slash: 'normal',
      pierce: 'resistant',
      chop: 'ignore',
      pickaxe: 'ignore',
      fire: 'weak',
      frost: 'resistant',
      lightning: 'normal',
      poison: 'normal',
      spirit: 'immune',
    },
    drop: [
      dropEntry('BjornPaw'),
      dropEntry('BjornMeat', { min: 2, max: 3 }),
      dropEntry('BjornHide', { min: 4, max: 5 }),
      dropTrophy('TrophyBjorn', 0.1),
    ],
  }, {
    id: 'Bjorn_spiritcaller',
    ragdollId: null,
    iconId: 'resource/TrophyBjorn',
    tier: 8,
    faction: 'Players',
    attacks: single([
      { dmg: dmg({ pierce: 100 }), force: 40, name: 'bite' },
      { dmg: dmg({ slash: 90, chop: 40 }), force: 40, name: 'claws' },
      { dmg: dmg({ slash: 50, chop: 40 }), force: 35, name: 'swipe_l' },
      { dmg: dmg({ slash: 50, chop: 40 }), force: 35, name: 'swipe_r' },
      { dmg: dmg({ slash: 50, chop: 40 }), force: 40, name: 'swipe_combo' },
      { dmg: dmg({ blunt: 100, chop: 40, pickaxe: 40 }), force: 100, name: 'slam' },
    ]),
    hp: 1500,
    drop: [],
  }),
  {
    type: 'creature',
    id: 'Troll',
    ragdollId: 'Troll_ragdoll',
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI', 'VisEquipment'],
    tier: 2,
    upgradeDistance: 2000,
    emoji: '',
    faction: 'ForestMonsters',
    attacks: [
      {
        rate: 2,
        variety: 'unarmed',
        attacks: [
          // troll_punch
          { dmg: dmg({ blunt: 60, chop: 100, pickaxe: 40 }), name: '1-hand hit', stagger: 2.98, force: 100, toolTier: 2 },
          // troll_groundslam
          { dmg: dmg({ blunt: 70, chop: 100, pickaxe: 40 }), name: '2-hand smash', stagger: 2.98, force: 100, toolTier: 2 },
          // troll_throw
          { dmg: dmg({ blunt: 50, chop: 60, pickaxe: 40 }), name: 'throw', stagger: 2.84, toolTier: 0 },
        ],
      }, {
        rate: 1,
        variety: 'log',
        attacks: [
          // troll_log_swing_v
          { dmg: dmg({ blunt: 70, chop: 100, pickaxe: 40 }), name: 'v-swing', stagger: 2.98, force: 80, toolTier: 2 },
          // troll_log_swing_h
          { dmg: dmg({ blunt: 60, chop: 100, pickaxe: 40 }), name: 'h-swing', stagger: 2.98, force: 80, toolTier: 2 },
        ],
      },
    ],
    tolerate: TOLERATE.WATER,
    speed: { walk: 3, run: 6, swim: 1.5 },
    turnSpeed: { walk: 100, run: 250, swim: 100 },
    hp: 600,
    stagger: { factor: 0.3, time: 2.74 },
    damageModifiers: {
      ...animalDmgModifiers,
      blunt: 'resistant',
      pierce: 'weak',
    },
    weakSpots: [
      {
        location: 'head',
        damageModifiers: {
          ...animalDmgModifiers,
          pierce: 'veryWeak',
        }
      }
    ],
    drop: [
      dropEntry('TrollHide', { min: 5, max: 5 }),
      dropEntry('Coins', { min: 20, max: 30 }),
      dropTrophy('TrophyFrostTroll', 0.5),
    ],
  },
  {
    type: 'creature',
    id: 'gd_king', // the elder
    ragdollId: 'gdking_Ragdoll',
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI'],
    tier: 2,
    emoji: '🥦',
    faction: 'Boss',
    attacks: single([
      // SCREAM
      { spawn: ['TentaRoot'], number: [15, 15], max: 30 },
      { dmg: dmg({ pierce: 35, chop: 20, pickaxe: 20 }), name: 'Vine Shoot', burst: 25, toolTier: 0 },
      { dmg: dmg({ blunt: 60, chop: 1000, pickaxe: 1000 }), name: 'Stomp', force: 30, toolTier: 0, collider: areaCollider(5) },
    ]),
    tolerate: TOLERATE.WATER | TOLERATE.SMOKE,
    speed: { walk: 3, run: 6, swim: 1.5 },
    turnSpeed: { walk: 100, run: 200, swim: 100 },
    hp: 2500,
    stagger: null,
    damageModifiers: {
      ...defaultDmgModifiers,
      fire: 'veryWeak',
      poison: 'immune',
      spirit: 'immune',
    },
    drop: [
      dropEntry('CryptKey', { perPlayer: true }),
      dropTrophy('TrophyTheElder', 1),
    ],
  },
  {
    type: 'creature',
    id: 'TentaRoot',
    ragdollId: null,
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI'],
    tier: 2,
    emoji: '🥦',
    faction: 'Boss',
    attacks: single([
      { dmg: dmg({ blunt: 55, chop: 20, pickaxe: 20 }), name: 'poke', force: 40, toolTier: 0 }
    ]),
    tolerate: TOLERATE.WATER | TOLERATE.SMOKE,
    speed: { walk: 0, run: 0, swim: 0 },
    turnSpeed: { walk: 200, run: 200, swim: 200 },
    hp: 20,
    stagger: null,
    damageModifiers: {
      ...defaultDmgModifiers,
      fire: 'weak',
      frost: 'resistant',
      poison: 'immune',
    },
    drop: [],
    timedDestruction: [18, 20],
  },
  // {
  //   id: 'piece_TrainingDummy',
  //   type: 'creature',
  //   tier: 2,
  //   emoji: '🥊',
  //   // piece: { target: 'random', water: false, size: [2, 0.3, 2] },
  //   // recipe: { type: 'craft_piece', materials: { FineWood: 5, BronzeNails: 10, Ectoplasm: 5 }, station: 'piece_workbench' },
  // },
// SWAMP
  {
    type: 'creature',
    group: 'blob',
    id: 'Blob',
    ragdollId: null,
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI'],
    tier: 3,
    emoji: '🦠',
    faction: 'Undead',
    attacks: single([{ dmg: dmg({ poison: 90 }), name: 'poison', unblockable, collider: areaCollider(4) }]),
    tolerate: TOLERATE.WATER | TOLERATE.SMOKE,
    speed: { walk: 1, run: 2, swim: 2 },
    turnSpeed: { walk: 100, run: 100, swim: 100 },
    hp: 50,
    stagger: null,
    damageModifiers: blobDamageModifiers,
    drop: [
      dropEntry('Ooze', { min: 1, max: 2 }),
      dropTrophy('TrophyBlob', 0.1),
    ],
  },
  {
    type: 'creature',
    group: 'blob',
    id: 'BlobElite',
    ragdollId: null,
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI'],
    tier: 3,
    emoji: '🦠',
    faction: 'Undead',
    attacks: single([{ dmg: dmg({ poison: 115 }), name: 'poison', unblockable, collider: areaCollider(8) }]),
    tolerate: TOLERATE.WATER | TOLERATE.SMOKE,
    speed: { walk: 1, run: 2, swim: 2 },
    turnSpeed: { walk: 100, run: 100, swim: 100 },
    hp: 150,
    stagger: null,
    damageModifiers: blobDamageModifiers,
    drop: [
      dropEntry('Ooze', { min: 2, max: 3 }),
      dropEntry('IronScrap', { chance: 0.33 }),
      dropTrophy('TrophyBlob', 0.1),
      dropEntry('Blob', { min: 2, max: 2 }),
    ],
  },
  {
    type: 'creature',
    id: 'Leech',
    ragdollId: '',
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI'],
    tier: 3,
    emoji: '🧛',
    faction: 'Undead',
    attacks: single([{ dmg: dmg({
      pierce: 20,
      poison: 70,
    }), name: 'bite', force: 30 }]),
    tolerate: TOLERATE.WATER | TOLERATE.SMOKE,
    speed: { walk: 2, run: 2, swim: 3 },
    turnSpeed: { walk: 50, run: 50, swim: 150 },
    hp: 60,
    stagger: null,
    damageModifiers: {
      ...animalDmgModifiers,
      fire: 'immune',
      poison: 'resistant',
      spirit: 'immune',
    },
    drop: [
      dropEntry('Bloodbag'),
      dropTrophy('TrophyLeech', 0.1),
    ],
  },
  {
    type: 'creature',
    id: 'Surtling',
    // warmthRadius: 3,
    PointLight: { color: '#FFB174', range: 3, intensity: 3 },
    ragdollId: null,
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI'],
    tier: 3,
    emoji: '🧨',
    faction: 'Demon',
    attacks: single([{
      dmg: dmg({ blunt: 10, fire: 40 }),
      name: 'fireball', stagger: 1.14, force: 30,
    }]),
    tolerate: TOLERATE.FIRE | TOLERATE.SMOKE,
    speed: { walk: 2, run: 6, swim: 2 },
    turnSpeed: { walk: 400, run: 400, swim: 400 },
    hp: 20,
    stagger: { factor: 0.5, time: 1.14 },
    damageModifiers: {
      ...defaultDmgModifiers,
      fire: 'immune',
      frost: 'weak',
      poison: 'immune',
      spirit: 'immune',
    },
    drop: [
      dropEntry('Coal', { min: 4, max: 5 }),
      dropEntry('SurtlingCore', { chance: 0.5 }),
      dropTrophy('TrophySurtling', 0.05),
    ],
  },
  {
    type: 'creature',
    id: 'Wraith',
    ragdollId: null,
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI'],
    tags: ['fly'],
    tier: 3,
    emoji: '👻',
    faction: 'Undead',
    attacks: single([{ dmg: dmg({ slash: 60, }), name: 'slash', stagger: 2.04, force: 60 }]),
    tolerate: TOLERATE.WATER,
    speed: { walk: 2.5, run: 5, swim: 1 },
    turnSpeed: { walk: 200, run: 200, swim: 200 },
    hp: 100,
    stagger: { factor: 0.5, time: 2.04 },
    damageModifiers: {
      blunt: 'resistant',
      slash: 'resistant',
      pierce: 'resistant',
      chop: 'ignore',
      pickaxe: 'ignore',
      fire: 'weak',
      frost: 'immune',
      lightning: 'normal',
      poison: 'immune',
      spirit: 'weak',
    },
    drop: [
      dropEntry('Chain'),
      dropTrophy('TrophyWraith', 0.05),
    ],
  },
  ...variations({
    type: 'creature',
    id: 'Draugr',
    ragdollId: 'Draugr_ragdoll',
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI', 'VisEquipment'],
    tier: 3,
    emoji: '🧟',
    faction: 'Undead',
    attacks: [
      { variety: 'axe',
        rate: 3,
        attacks: [{ dmg: dmg({ slash: 48, chop: 15 }), name: 'axe', force: 60, toolTier: 0 }],
      },
      { variety: 'bow',
        rate: 1,
        attacks: [{ dmg: dmg({ pierce: 48 }), name: 'bow', force: 18 }],
      },
    ],
    tolerate: TOLERATE.WATER | TOLERATE.SMOKE,
    speed: { walk: 1, run: 5, swim: 1 },
    turnSpeed: { walk: 300, run: 300, swim: 300 },
    hp: 100,
    stagger: { factor: 0.5, time: 2.8 },
    damageModifiers: {
      ...defaultDmgModifiers,
      fire: 'resistant',
      poison: 'immune',
    },
    drop: [
      dropEntry('Entrails'),
      dropTrophy('TrophyDraugr', 0.1),
    ],
  }, {
    id: 'Draugr_Ranged',
    iconId: 'creature/Draugr',
    ragdollId: 'Draugr_ranged_ragdoll',
    attacks: single([
      { dmg: dmg({ pierce: 48 }), name: 'bow', stagger: 2.8, force: 18 },
    ]),
  }),
  {
    type: 'creature',
    id: 'Draugr_Elite',
    ragdollId: 'Draugr_elite_ragdoll',
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI', 'VisEquipment'],
    tier: 3,
    emoji: '🧟',
    faction: 'Undead',
    attacks: single([ { dmg: dmg({ slash: 58, }), name: 'sword', stagger: 2.8, force: 60 } ]),
    tolerate: TOLERATE.WATER | TOLERATE.SMOKE,
    speed: { walk: 1, run: 6, swim: 1 },
    turnSpeed: { walk: 300, run: 300, swim: 300 },
    hp: 200,
    stagger: { factor: 0.5, time: 2.8 },
    damageModifiers: {
      ...defaultDmgModifiers,
      fire: 'resistant',
      poison: 'immune',
    },
    drop: [
      dropEntry('Entrails', { min: 2, max: 3 }),
      dropTrophy('TrophyDraugrElite', 0.1),
    ],
  },
  {
    type: 'creature',
    id: 'Abomination',
    ragdollId: 'Abomination_ragdoll',
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI', 'VisEquipment'],
    tier: 3,
    emoji: '🥦',
    faction: 'Undead',
    attacks: single([
      { dmg: dmg({ blunt: 60, chop: 100, pickaxe: 60 }), name: 'swing', stagger: 2, force: 130, toolTier: 2, collider: areaCollider(4.3) },
      { dmg: dmg({ blunt: 80, chop: 100, pickaxe: 60 }), name: 'slam', stagger: 2, force: 130, toolTier: 2, collider: areaCollider(5.4) },
      { dmg: dmg({ blunt: 80, chop: 100, pickaxe: 60 }), name: 'stub', stagger: 2, force: 130, toolTier: 2 },
    ]),
    tolerate: TOLERATE.WATER | TOLERATE.SMOKE,
    speed: { walk: 2, run: 5, swim: 3 },
    turnSpeed: { walk: 20, run: 60, swim: 45 },
    hp: 800,
    stagger: { factor: 0.33, time: 2 },
    damageModifiers: {
      blunt: 'resistant',
      slash: 'normal',
      pierce: 'veryResistant',
      chop: 'ignore',
      pickaxe: 'ignore',
      fire: 'weak',
      frost: 'immune',
      lightning: 'normal',
      poison: 'immune',
      spirit: 'immune',
    },
    drop: [
      dropEntry('Root', { min: 5, max: 5 }),
      dropEntry('Guck', { min: 3, max: 5 }),
      dropTrophy('TrophyAbomination', 0.5),
    ],
  },
  {
    type: 'creature',
    id: 'Writhan',
    iconId: 'resource/TrophyWrithan',
    ragdollId: null,
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI'],
    tier: 3,
    emoji: '🏗',
    faction: 'Undead',
    attacks: single([
      { dmg: dmg({ pierce: 40, poison: 30 }), name: 'bite', force: 40 },
      { dmg: dmg({ blunt: 60, chop: 50, pickaxe: 50, fire: 40 }),
        name: 'explosion', force: 40, toolTier: 4, unblockable: true },
    ]),
    tolerate: TOLERATE.WATER | TOLERATE.SMOKE,
    speed: { walk: 1, run: 2, swim: 0 },
    turnSpeed: { walk: 150, run: 100, swim: 0 },
    hp: 400,
    stagger: { factor: 0.5, time: 2.44 },
    damageModifiers: mods([1, 2, 0, 4, 4, 1, 0, 0, 3, 0]),
    drop: [
      dropTrophy('TrophyWrithan', 0.1),
      dropEntry('WrithanRoots', { max: 2 }),
    ],
  },
  {
    type: 'creature',
    id: 'BogWitchKvastur',
    ragdollId: null,
    components: ['BaseAI', 'Character', 'MonsterAI'],
    tier: 3,
    emoji: '🧹',
    faction: 'Dverger',
    aggravatable,
    attacks: single([
      { dmg: dmg({ blunt: 80 }), name: 'attack', force: 30, toolTier: 0 },
    ]),
    tolerate: TOLERATE.WATER | TOLERATE.SMOKE,
    speed: { walk: 2, run: 6, swim: 1.5 },
    turnSpeed: { walk: 200, run: 200, swim: 100 },
    hp: 700,
    stagger: { factor: 0.3, time: 2 },
    damageModifiers: {
      blunt: 'normal',
      slash: 'normal',
      pierce: 'normal',
      chop: 'weak',
      pickaxe: 'ignore',
      fire: 'veryWeak',
      frost: 'normal',
      lightning: 'normal',
      poison: 'immune',
      spirit: 'immune',
    },
    drop: [
      dropEntry('Wood'),
      dropEntry('Resin'),
      dropTrophy('TrophyKvastur', 1),
    ],
  },
  {
    type: 'creature',
    id: 'Bonemass',
    ragdollId: null,
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI', 'VisEquipment'],
    tier: 3,
    emoji: '🦠',
    faction: 'Boss',
    attacks: single([
      { dmg: dmg({ poison: 130 }), name: 'poison', force: 0, unblockable, undodgeable },
      { dmg: dmg({
        blunt: 80,
        chop: 1000,
        pickaxe: 1000,
        poison: 50,
      }), name: 'punch', force: 100, toolTier: 0 },
      { spawn: ['Skeleton', 'Blob'], number: [4, 4], max: 8, }
    ]),
    tolerate: TOLERATE.WATER | TOLERATE.SMOKE,
    speed: { walk: 2, run: 4, swim: 2 },
    turnSpeed: { walk: 50, run: 100, swim: 50 },
    hp: 5000,
    stagger: null,
    damageModifiers: {
      ...defaultDmgModifiers,
      blunt: 'weak',
      slash: 'resistant',
      pierce: 'veryResistant',
      fire: 'veryResistant',
      frost: 'weak',
      poison: 'immune',
    },
    drop: [
      dropEntry('Wishbone', { perPlayer: true }),
      dropEntry('TrophyBonemass', { scale: false }),
    ],
  },
// MOUNTAINS
  {
    type: 'creature',
    group: 'blob',
    id: 'BlobFrost',
    ragdollId: null,
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI'],
    tier: 4,
    emoji: '🦠',
    faction: 'PlayerSpawned',
    attacks: single([{ dmg: dmg({ frost: 100 }), name: 'nova', unblockable, collider: areaCollider(4) }]),
    tolerate: TOLERATE.WATER | TOLERATE.SMOKE,
    speed: { walk: 1, run: 2, swim: 2 },
    turnSpeed: { walk: 100, run: 100, swim: 100 },
    hp: 50,
    stagger: null,
    damageModifiers: { ...blobDamageModifiers, frost: 'veryResistant' },
    drop: [
      dropEntry('Crystal', { min: 1, max: 2 }),
      dropTrophy('TrophyBlob_Frost', 0.1),
    ],
  },
  {
    type: 'creature',
    id: 'Bat',
    ragdollId: null,
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI'],
    tags: ['animal', 'fly'],
    tier: 4,
    emoji: '',
    faction: 'MountainMonsters',
    attacks: single([
      { dmg: dmg({ slash: 20 }), name: 'bite', stagger: 1.68, force: 30 },
    ]),
    tolerate: TOLERATE.WATER,
    speed: { walk: 5, run: 10, swim: 0 },
    turnSpeed: { walk: 300, run: 300, swim: 200 },
    hp: 10,
    damageModifiers: mods([1, 1, 1, 4, 4, 2, 3, 0, 3, 2]),
    stagger: { factor: 0.5, time: 1.68 },
    drop: [
      dropEntry('LeatherScraps', { chance: 0.5 }),
    ],
  },
  {
    type: 'creature',
    id: 'Ulv',
    ragdollId: 'Ulv_Ragdoll',
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI'],
    tags: ['animal'],
    tier: 4,
    emoji: '🐺',
    faction: 'MountainMonsters',
    attacks: single([
      { dmg: dmg({ slash: 80 }), name: 'bite', stagger: 1.4, force: 30 },
      { dmg: dmg({ slash: 70 }), name: 'slash', stagger: 1.4, force: 130 },
    ]),
    tolerate: TOLERATE.WATER,
    speed: { walk: 2, run: 8, swim: 2 },
    turnSpeed: { walk: 150, run: 200, swim: 100 },
    hp: 50,
    damageModifiers: { ...defaultDmgModifiers, fire: 'veryResistant', poison: 'weak' },
    stagger: { factor: 0.5, time: 1.4 },
    drop: [
      dropEntry('WolfFang', { chance: 0.5, min: 1, max: 2 }),
      dropTrophy('TrophyUlv', 0.1),
    ],
  },
  ...variations({
    type: 'creature',
    id: 'Wolf',
    ragdollId: 'Wolf_Ragdoll',
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI', 'Procreation', 'Tameable'],
    tags: ['animal'],
    tier: 4,
    emoji: '🐺',
    faction: 'MountainMonsters',
    factionGroup: 'wolf',
    attacks: single([
      // 3 different animations, same stats
      { dmg: dmg({ slash: 70 }), name: 'bite', stagger: 1.9, force: 30 },
    ]),
    tolerate: TOLERATE.WATER,
    speed: { walk: 1.5, run: 8, swim: 2 },
    turnSpeed: { walk: 100, run: 200, swim: 100 },
    hp: 80,
    damageModifiers: animalDmgModifiers,
    stagger: { factor: 0.5, time: 1.82 },
    drop: [
      dropEntry('WolfFang', { chance: 0.4 }),
      dropEntry('WolfMeat', { chance: 1 }),
      dropEntry('WolfPelt', { max: 2 }),
      dropTrophy('TrophyWolf', 0.1),
    ],
    tame: { tameTime: 1800, fedTime: 600, commandable: true,
            eats: ['RawMeat', 'DeerMeat', 'NeckTail', 'LoxMeat', 'Sausages', 'FishRaw', 'ChickenMeat'] },
            // eatRange:1.4, searchRange:10, heal:20
    pregnancy: { points: 3, time: 60, chance: 0.33, grow: 3000, childId: 'Wolf_cub' }, // max: 4, range: 3
  }, {
    id: 'Wolf_spiritcaller',
    ragdollId: null,
    iconId: 'resource/TrophyWolf',
    faction: 'Players',
    tier: 8,
    attacks: single([
      // 3 different animations, same stats
      { dmg: dmg({ slash: 140 }), name: 'bite', stagger: 1.9, force: 30 },
    ]),
    hp: 800,
    drop: [],
    pregnancy: undefined,
  }),
  {
    type: 'creature',
    id: 'Wolf_cub',
    iconId: 'creature/Wolf',
    ragdollId: null,
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI', 'Growup'],
    tags: ['animal'],
    tier: 4,
    emoji: '🐺',
    faction: 'MountainMonsters',
    factionGroup: 'wolf',
    attacks: [],
    tolerate: TOLERATE.WATER,
    speed: { walk: 1.5, run: 4, swim: 2 },
    turnSpeed: { walk: 100, run: 200, swim: 100 },
    hp: 10,
    damageModifiers: animalDmgModifiers,
    stagger: { factor: 0.5, time: 0 },
    drop: [],
  },
  {
    type: 'creature',
    id: 'Fenring',
    ragdollId: 'Fenring_ragdoll',
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI'],
    tier: 4,
    emoji: '🐺',
    faction: 'MountainMonsters',
    attacks: single([
      { dmg: dmg({ slash: 85 }), name: 'hit', stagger: 1.12, force: 60 },
      { dmg: dmg({ slash: 95 }), name: 'jump', stagger: 1.32, force: 100 },
    ]),
    tolerate: TOLERATE.WATER,
    speed: { walk: 1.5, run: 7, swim: 2 },
    turnSpeed: { walk: 200, run: 200, swim: 200 },
    hp: 300,
    stagger: { factor: 0.5, time: 1.12 },
    damageModifiers: {
      ...defaultDmgModifiers,
      fire: 'weak',
      poison: 'resistant',
    },
    drop: [
      dropEntry('WolfFang'),
      dropTrophy('TrophyFenring', 0.1),
    ],
  },
  {
    type: 'creature',
    id: 'Fenring_Cultist',
    ragdollId: 'Fenring_cultist_ragdoll',
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI'],
    tier: 4,
    emoji: '🐺',
    faction: 'MountainMonsters',
    attacks: single([
      { dmg: dmg({ slash: 35, fire: 40 }), name: 'claw', stagger: 1.32, force: 60 },
      { dmg: dmg({ slash: 35, fire: 40 }), name: 'claw2', stagger: 1.12, force: 60 },
      // fenring_attack_flames
      { dmg: dmg({ fire: 50 }), name: 'flames', stagger: 1.12, unblockable, force: 0 },
    ]),
    tolerate: TOLERATE.WATER,
    speed: { walk: 5, run: 5, swim: 2 },
    turnSpeed: { walk: 200, run: 200, swim: 200 },
    hp: 200,
    stagger: { factor: 0.5, time: 1.44 },
    damageModifiers: {
      ...defaultDmgModifiers,
      fire: 'immune',
      poison: 'weak',
    },
    drop: [
      dropEntry('JuteRed', { min: 1, max: 3 }),
      dropTrophy('TrophyCultist', 0.1),
    ],
  },
  ...variations({
    type: 'creature',
    id: 'Fenring_Cultist_Hildir',
    iconId: 'resource/TrophyCultist_Hildir',
    group: 'semiboss',
    ragdollId: 'Fenring_cultist_ragdoll_hildir',
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI'],
    tier: 4,
    emoji: '🐺',
    faction: 'MountainMonsters',
    attacks: single([
      // Fenring_attack_iceclaw_double
      { dmg: dmg({ slash: 60, frost: 70 }), name: 'claw', stagger: 1.32, force: 60 },
      // Fenring_attack_iceclaw
      { dmg: dmg({ slash: 40, frost: 70 }), name: 'claw2', stagger: 1.12, force: 60 },
      // Fenring_attack_frost
      { dmg: dmg({ frost: 100 }), name: 'frost', stagger: 1.12, force: 0, unblockable },
      // Fenring_attack_IceNova
      { dmg: dmg({ frost: 90 }), name: 'nova', stagger: 1.12, force: 0, unblockable, undodgeable },
    ]),
    tolerate: TOLERATE.WATER,
    speed: { walk: 1.25, run: 5, swim: 2 },
    turnSpeed: { walk: 200, run: 200, swim: 100 },
    hp: 3700,
    stagger: { factor: 0.5, time: 1.44 },
    damageModifiers: {
      ...defaultDmgModifiers,
      fire: 'weak',
      frost: 'immune',
    },
    drop: [
      dropTrophy('chest_hildir2', 1),
      dropTrophy('TrophyCultist_Hildir', 1),
    ],
  },
  {
    id: 'Fenring_Cultist_Hildir_nochest',
    ragdollId: 'Fenring_cultist_ragdoll_hildir',
    hp: 1850,
    drop: [
      dropTrophy('TrophyCultist_Hildir', 1),
    ],
  }),
  {
    type: 'creature',
    id: 'StoneGolem',
    ragdollId: 'Stonegolem_ragdoll',
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI', 'VisEquipment'],
    tier: 4,
    emoji: '🗿',
    faction: 'ForestMonsters',
    attacks: [
      { rate: 1,
        variety: 'spike',
        attacks: [
          { dmg: dmg({ blunt: 110, chop: 100, pickaxe: 100 }), name: 'spike', stagger: 5.2, force: 130, toolTier: 0 },
          { dmg: dmg({ blunt: 110, chop: 100, pickaxe: 100 }), name: 'spike sweep', stagger: 1.22, force: 130, toolTier: 0 },
          // spikes, no dmg, no animation
        ],
      },
      { rate: 1,
        variety: 'sledge',
        attacks: [
          { dmg: dmg({ blunt: 110, chop: 100, pickaxe: 100 }), name: 'slam', stagger: 5.24, force: 130, toolTier: 0 }, // R8
          { dmg: dmg({ blunt: 110, chop: 100, pickaxe: 100 }), name: 'double smash', stagger: 1.22, force: 120, toolTier: 0 }, // R8.66
        ],
      },
    ], 
    tolerate: TOLERATE.WATER | TOLERATE.FIRE | TOLERATE.SMOKE,
    speed: { walk: 2, run: 4, swim: 1.5 },
    turnSpeed: { walk: 100, run: 150, swim: 100 },
    hp: 800,
    stagger: { factor: 0.33, time: 1.1 },
    damageModifiers: {
      blunt: 'normal',
      slash: 'resistant',
      pierce: 'resistant',
      chop: 'ignore',
      pickaxe: 'veryWeak',
      fire: 'immune',
      frost: 'immune',
      lightning: 'normal',
      poison: 'immune',
      spirit: 'immune',
    },
    drop: [
      dropEntry('Stone', { min: 5, max: 10 }),
      dropEntry('Crystal', { min: 8, max: 12 }),
      dropTrophy('TrophySGolem', 0.05),
    ],
  },
  {
    type: 'creature',
    id: 'Hatchling', // drake
    ragdollId: 'Hatchling_ragdoll',
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI'],
    tags: ['animal', 'fly'],
    tier: 4,
    emoji: '🐉',
    faction: 'MountainMonsters',
    attacks: single([{ dmg: dmg({ frost: 90 }), burst: 3, name: 'ice shards', force: 30, }]), // burst interval: 0.3
    tolerate: TOLERATE.WATER,
    speed: { walk: 4, run: 12, swim: 1 },
    turnSpeed: { walk: 100, run: 100, swim: 100 },
    hp: 100,
    stagger: null,
    damageModifiers: {
      ...animalDmgModifiers,
      fire: 'weak',
      frost: 'immune',
    },
    drop: [
      dropEntry('FreezeGland', { max: 2 }),
      dropTrophy('TrophyHatchling', 0.1),
    ],
  },
  {
    type: 'creature',
    id: 'Dragon',
    ragdollId: '',
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI'],
    tags: ['fly'],
    tier: 4,
    emoji: '🐲',
    faction: 'Boss',
    attacks: single([
      // taunt,
      { dmg: dmg({ pierce: 120, chop: 1000, pickaxe: 1000 }), name: 'bite', force: 120, toolTier: 3 }, // R8
      { dmg: dmg({ slash: 110, chop: 1000, pickaxe: 1000 }), name: 'claw', force: 120, toolTier: 3 }, // R4 two: left & right
      { dmg: dmg({ pierce: 30, chop: 200, pickaxe: 200, frost: 200 }), burst: 16, name: 'ice shards', force: 30, toolTier: 3 }, // velocity=2/25 burstInterval=0.05, spread=20/13
      { dmg: dmg({ chop: 200, pickaxe: 200, frost: 200 }), name: 'breath', force: 40, toolTier: 3 },
    ]),
    tolerate: TOLERATE.WATER,
    speed: { walk: 4, run: 20, swim: 0 },
    turnSpeed: { walk: 80, run: 60, swim: 0 },
    hp: 7500,
    stagger: null,
    damageModifiers: {
      ...animalDmgModifiers,
      fire: 'weak',
      frost: 'immune',
    },
    drop: [
      dropEntry('DragonTear', { min: 10, max: 10, scale: false }),
      dropEntry('TrophyDragonQueen', { scale: false }),
    ],
  },
// PLAINS
  ...variations({
    type: 'creature',
    group: 'goblin',
    id: 'Goblin', // Fulling
    ragdollId: 'Goblin_Dragdoll',
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI', 'VisEquipment'],
    tier: 5,
    emoji: '',
    faction: 'PlainsMonsters',
    // weapon: 2 club, 1 spear, 2 sword, 1 torch
    // shield: 1 wood, 2 <null>
    attacks: [
      { rate: 2, variety: 'club', attacks: [{ dmg: dmg({ blunt: 85 }), name: 'club', stagger: 2.08, force: 50 }] },
      { rate: 1, variety: 'spear', attacks: [{ dmg: dmg({ pierce: 85 }), name: 'spear', stagger: 3.38, force: 20 }] },
      { rate: 2, variety: 'sword', attacks: [{ dmg: dmg({ slash: 85 }), name: 'sword', stagger: 2.08, force: 50 }] },
      { rate: 1, variety: 'torch', attacks: [{ dmg: dmg({ blunt: 45, fire: 45 }), name: 'torch', stagger: 2.08, force: 30 }] },
    ],
    tolerate: TOLERATE.WATER,
    speed: { walk: 2, run: 6, swim: 1.5 },
    turnSpeed: { walk: 200, run: 200, swim: 100 },
    hp: 175,
    stagger: { factor: 0.3, time: 2.08 },
    damageModifiers: animalDmgModifiers,
    drop: [
      dropEntry('Coins', { chance: 0.25, min: 5, max: 10 }),
      dropEntry('BlackMetalScrap', { min: 1, max: 2 }),
      dropTrophy('TrophyGoblin', 0.1),
    ],
    // alertRange: 20,
    // maxChase: 300,
  }, {
    id: 'GoblinDeepNorth',
    ragdollId: 'Goblin_DN_Dragdoll',
    iconId: 'creature/Goblin',
    tier: 8,
    faction: 'PlainsMonsters',
    attacks: [
      { rate: 2, variety: 'club', attacks: [{ dmg: dmg({ blunt: 160 }), name: 'club', stagger: 2.08, force: 50 }] },
      { rate: 1, variety: 'spear', attacks: [{ dmg: dmg({ pierce: 150 }), name: 'spear', stagger: 3.38, force: 20 }] },
      { rate: 2, variety: 'sword', attacks: [{ dmg: dmg({ slash: 160 }), name: 'sword', stagger: 2.08, force: 50 }] },
      { rate: 1, variety: 'torch', attacks: [{ dmg: dmg({ blunt: 85, fire: 85 }), name: 'torch', stagger: 2.08, force: 30 }] },
    ],
    hp: 250,
    drop: [
      dropEntry('Coins', { chance: 0.25, min: 20, max: 40 }),
      dropEntry('AncientCoin', { min: 1, max: 2 }),
      dropEntry('Lingonberry', { chance: 0.2, min: 1, max: 10 }),
    ],
  }),
  {
    type: 'creature',
    group: 'goblin',
    id: 'GoblinShaman',
    ragdollId: 'GoblinShaman_ragdoll',
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI', 'VisEquipment'],
    tier: 5,
    emoji: '',
    faction: 'PlainsMonsters',
    attacks: single([
      { dmg: dmg({ blunt: 100 }), name: 'staff', stagger: 3.2 },
      { dmg: dmg({ blunt: 20, fire: 100 }), name: 'fireball', stagger: 3.2 },
      { cast: 'GoblinShaman_shield' },
    ]),
    tolerate: TOLERATE.WATER,
    speed: { walk: 1, run: 2, swim: 1.5 },
    turnSpeed: { walk: 200, run: 200, swim: 200 },
    hp: 100,
    stagger: { factor: 0.3, time: 3.2 },
    damageModifiers: animalDmgModifiers,
    drop: [
      dropEntry('Coins', { chance: 0.25, min: 20, max: 40 }),
      dropEntry('BlackMetalScrap', { min: 1, max: 2 }),
      dropEntry('Pukeberries', { min: 1, max: 2 }),
      dropTrophy('TrophyGoblinShaman', 0.1),
    ],
  },
  ...variations({
    type: 'creature',
    group: 'semiboss',
    id: 'GoblinShaman_Hildir',
    iconId: 'resource/TrophyGoblinBruteBrosShaman',
    ragdollId: 'GoblinShaman_Hildir_ragdoll',
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI', 'VisEquipment'],
    tier: 5,
    emoji: '',
    faction: 'PlainsMonsters',
    attacks: single([
      { dmg: dmg({ blunt: 100 }), name: 'staff', stagger: 3.2 },
      { dmg: dmg({ blunt: 20, fire: 100 }), name: 'fireball', stagger: 3.2 },
      { cast: 'GoblinShaman_shield' },
    ]),
    tolerate: TOLERATE.WATER,
    speed: { walk: 1, run: 2, swim: 1.5 },
    turnSpeed: { walk: 200, run: 200, swim: 200 },
    hp: 2400,
    stagger: { factor: 0.3, time: 3.2 },
    damageModifiers: animalDmgModifiers,
    drop: [
      dropTrophy('chest_hildir3', 1),
      dropTrophy('TrophyGoblinBruteBrosShaman', 1),
    ],
  },
  {
    group: undefined,
    id: 'GoblinShaman_Hildir_nochest',
    iconId: 'resource/TrophyGoblinBruteBrosShaman',
    tolerate: TOLERATE.WATER,
    hp: 1200,
    drop: [
      dropTrophy('TrophyGoblinBruteBrosShaman', 1),
    ],
  }),
  {
    type: 'creature',
    group: 'goblin',
    id: 'GoblinBrute', // Berserk
    ragdollId: 'GoblinBrute_ragdoll',
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI', 'VisEquipment'],
    tier: 5,
    emoji: '',
    faction: 'PlainsMonsters',
    maxLvl: 3,
    attacks: single([
      { dmg: dmg({
        blunt: 130,
        chop: 100,
        pickaxe: 40,
      }), name: 'attack', stagger: 2.88, force: 50, toolTier: 2 }, // random: 2
      { dmg: dmg({
        blunt: 130,
        chop: 100,
        pickaxe: 40,
      }), name: 'rageattack', stagger: 2.88, force: 70, toolTier: 2 },
      // taunt
    ]),
    tolerate: TOLERATE.WATER,
    speed: { walk: 2, run: 5, swim: 1.5 },
    turnSpeed: { walk: 150, run: 300, swim: 150 },
    hp: 800,
    stagger: { factor: 0.3, time: 2.9 },
    damageModifiers: animalDmgModifiers,
    drop: [
      dropEntry('Coins', { min: 5, max: 20 }),
      dropEntry('BlackMetalScrap', { min: 3, max: 5 }),
      dropTrophy('GoblinTotem', 0.1),
      dropTrophy('TrophyGoblinBrute', 0.05),
    ],
  },
  {
    type: 'creature',
    group: 'semiboss',
    id: 'GoblinBrute_Hildir',
    iconId: 'resource/TrophyGoblinBruteBrosBrute',
    disabled: true,
    ragdollId: 'GoblinBrute_Hildir_ragdoll',
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI', 'VisEquipment'],
    tier: 5,
    emoji: '💪',
    faction: 'PlainsMonsters',
    maxLvl: 1,
    attacks: single([
      { dmg: dmg({
        blunt: 150,
        chop: 100,
        pickaxe: 40,
      }), name: 'attack', stagger: 2.88, force: 100, toolTier: 2 },
      { dmg: dmg({
        blunt: 130,
        chop: 100,
        pickaxe: 40,
      }), name: 'rageattack', stagger: 2.88, force: 100, toolTier: 2 },
      // taunt
      // HipCloth
      // ShoulderGuard
    ]),
    tolerate: TOLERATE.WATER,
    speed: { walk: 2, run: 5, swim: 1.5 },
    turnSpeed: { walk: 150, run: 300, swim: 100 },
    hp: 800,
    stagger: { factor: 0.3, time: 2.9 },
    damageModifiers: animalDmgModifiers,
    drop: [
      dropEntry('chest_hildir3'),
    ],
  },
  ...variations({
    type: 'creature',
    group: 'semiboss',
    id: 'GoblinBruteBros',
    iconId: 'resource/TrophyGoblinBruteBrosBrute',
    ragdollId: 'GoblinBrute_Hildir_ragdoll',
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI', 'VisEquipment'],
    tier: 5,
    emoji: '',
    faction: 'PlainsMonsters',
    maxLvl: 1,
    attacks: single([
      { dmg: dmg({ blunt: 150, chop: 100, pickaxe: 40 }), name: 'attack', stagger: 2.88, force: 100, toolTier: 2 },
      { dmg: dmg({ blunt: 130, chop: 100, pickaxe: 40 }), name: 'rageattack', stagger: 2.88, force: 100, toolTier: 2 },
      // taunt
      // HipCloth
      // ShoulderGuard
      // GoblinShaman_attack_fireball_hildir
      { dmg: dmg({ blunt: 20, fire: 100 }), name: 'fireball', stagger: 2.88, force: 80 },
      // GoblinShaman_attack_protect_hildir
      { cast: 'GoblinShaman_shield' },
    ]),
    tolerate: TOLERATE.WATER,
    speed: { walk: 2, run: 5, swim: 1.5 },
    turnSpeed: { walk: 150, run: 300, swim: 100 },
    hp: 4200,
    stagger: { factor: 0.3, time: 2.88 },
    damageModifiers: animalDmgModifiers,
    drop: [
      dropEntry('GoblinShaman_Hildir'),
      dropTrophy('TrophyGoblinBruteBrosBrute', 1),
    ],
  },
  {
    id: 'GoblinBruteBros_nochest',
    group: undefined,
    hp: 2100,
    drop: [
      dropEntry('GoblinShaman_Hildir_nochest'),
      dropTrophy('TrophyGoblinBruteBrosBrute', 1),
    ],
  }),
  {
    type: 'creature',
    id: 'Deathsquito',
    ragdollId: null,
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI'],
    tags: ['fly'],
    tier: 5,
    emoji: '🦟',
    faction: 'PlainsMonsters',
    attacks: single([{ dmg: dmg({ pierce: 90 }), name: 'bite' }]),
    tolerate: TOLERATE.WATER,
    speed: { walk: 5, run: 12, swim: 1 },
    turnSpeed: { walk: 500, run: 500, swim: 500 },
    hp: 10,
    stagger: null,
    damageModifiers: animalDmgModifiers,
    drop: [
      dropEntry('Needle', { scale: false }),
      dropTrophy('TrophyDeathsquito', 0.05),
    ],
  },
  {
    type: 'creature',
    id: 'Lox',
    ragdollId: 'lox_ragdoll',
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI', 'Procreation', 'Saddle', 'Tameable'],
    tags: ['animal'],
    tier: 5,
    emoji: '🐂',
    faction: 'PlainsMonsters',
    factionGroup: 'lox',
    attacks: single([
      { dmg: dmg({ slash: 130 }), name: 'bite', force: 150 },
      { dmg: dmg({ blunt: 120, chop: 100, pickaxe: 100, }), name: 'stomp', force: 100, toolTier: 0, collider: areaCollider(4.5) },
    ]),
    tolerate: TOLERATE.WATER,
    speed: { walk: 2, run: 6, swim: 3 },
    turnSpeed: { walk: 70, run: 100, swim: 50 },
    hp: 1000,
    stagger: { factor: 0.3, time: 2.82 },
    damageModifiers: loxDamageModifiers,
    drop: [
      dropEntry('LoxMeat', { min: 4, max: 6 }),
      dropEntry('LoxPelt', { min: 2, max: 3 }),
      dropTrophy('TrophyLox', 0.1),
    ],
    tame: { tameTime: 1800, fedTime: 600, commandable: false,
            eats: ['Cloudberry', 'Barley', 'Flax'] },
            // eatRange:4, searchRange:10, heal:10
    pregnancy: { points: 4, time: 120, chance: 0.33, grow: 6000, childId: 'Lox_Calf' },
  },
  {
    type: 'creature',
    id: 'Lox_Calf',
    iconId: 'creature/Lox',
    ragdollId: 'loxcalf_ragdoll',
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI', 'Growup'],
    tags: ['animal'],
    tier: 5,
    emoji: '🐂',
    faction: 'PlainsMonsters',
    factionGroup: 'lox',
    attacks: [],
    tolerate: TOLERATE.WATER,
    speed: { walk: 2, run: 6, swim: 3 },
    turnSpeed: { walk: 120, run: 300, swim: 50 },
    hp: 1000,
    stagger: { factor: 0.3, time: 0 },
    damageModifiers: loxDamageModifiers,
    drop: [dropEntry('LoxMeat', { scale: false })],
  },
  {
    type: 'creature',
    id: 'Unbjorn',
    ragdollId: 'Unbjorn_ragdoll',
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI'],
    tier: 5,
    upgradeDistance: 2000,
    emoji: '🐻',
    faction: 'PlainsMonsters',
    factionGroup: 'bjorn',
    attacks: single([
      { dmg: dmg({ slash: 20, pierce: 130 }), force: 40, name: 'bite' },
      { dmg: dmg({ slash: 130, chop: 40 }), force: 40, name: 'claws' },
      { dmg: dmg({ slash: 60, chop: 40 }), force: 35, name: 'swipe_l' },
      { dmg: dmg({ slash: 60, chop: 40 }), force: 35, name: 'swipe_r' },
      { dmg: dmg({ slash: 60, chop: 40 }), force: 40, name: 'swipe_combo' },
      { dmg: dmg({ blunt: 150, chop: 40, pickaxe: 40 }), force: 100, name: 'slam' },
    ]),
    tolerate: TOLERATE.WATER,
    speed: { walk: 3, run: 6, swim: 1.5 },
    turnSpeed: { walk: 80, run: 100, swim: 50 },
    hp: 1200,
    regenAllHPTime: 3000,
    stagger: { factor: 0.3, time: 2.74 },
    damageModifiers: {
      blunt: 'resistant',
      slash: 'normal',
      pierce: 'resistant',
      chop: 'ignore',
      pickaxe: 'ignore',
      fire: 'weak',
      frost: 'resistant',
      lightning: 'normal',
      poison: 'normal',
      spirit: 'immune',
    },
    drop: [
      dropTrophy('TrophyBjornUndead', 0.1),
      dropEntry('BjornMeat', { min: 2, max: 3 }),
      dropEntry('RottenMeat', { min: 1, max: 2, chance: 0.8 }),
      dropEntry('UndeadBjornRibcage', { min: 1, max: 3 }),
      dropEntry('BjornHide', { min: 1, max: 2 }),
    ],
  },
  {
    type: 'creature',
    group: 'blob',
    id: 'BlobTar',
    ragdollId: null,
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI'],
    tier: 5,
    emoji: '🦠',
    faction: 'Undead',
    attacks: single([
      { dmg: dmg({ blunt: 45, poison: 50, }), name: 'stomp', force: 80, toolTier: 0 },
    ]),
    tolerate: TOLERATE.WATER | TOLERATE.SMOKE | TOLERATE.TAR,
    speed: { walk: 1, run: 3, swim: 4 },
    turnSpeed: { walk: 100, run: 100, swim: 100 },
    hp: 100,
    stagger: null,
    damageModifiers: {
      blunt: 'weak',
      slash: 'resistant',
      pierce: 'resistant',
      chop: 'ignore',
      pickaxe: 'ignore',
      fire: 'weak',
      frost: 'resistant',
      lightning: 'normal',
      poison: 'immune',
      spirit: 'normal',
    },
    drop: [
      dropEntry('Tar'),
      dropTrophy('TrophyGrowth', 0.1),
    ],
  },
  {
    type: 'creature',
    id: 'GoblinKing',
    ragdollId: 'GoblinKing_ragdoll',
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI'],
    tier: 5,
    emoji: '🦴',
    faction: 'Boss',
    attacks: single([
      // 10 meteors
      { dmg: dmg({ blunt: 40, chop: 50, pickaxe: 50, fire: 120 }), burst: 20, name: 'meteors', force: 100, unblockable }, // no toolTier
      { dmg: dmg({ chop: 50, pickaxe: 50, fire: 40, lightning: 20, }), name: 'fire Breath' }, // aka beam burst: 20*0.1 V=30/40 spread=1/1
      { dmg: dmg({ chop: 100, pickaxe: 100, fire: 65, lightning: 65 }), name: 'nova', force: 100, toolTier: 2, unblockable, collider: areaCollider(8) },
      // Taunt
    ]),
    tolerate: TOLERATE.WATER,
    speed: { walk: 2, run: 4, swim: 1.5 },
    turnSpeed: { walk: 50, run: 50, swim: 50 },
    hp: 10000,
    stagger: null,
    damageModifiers: {
      ...defaultDmgModifiers,
      pierce: 'veryResistant',
      fire: 'resistant',
      poison: 'immune',
    },
    drop: [
      dropEntry('YagluthDrop', { min: 3, max: 3, scale: false }),
      dropTrophy('TrophyGoblinKing', 1),
    ],
  },
  {
    type: 'creature',
    id: 'Hen',
    ragdollId: null,
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI', 'Procreation', 'Tameable'],
    tags: ['animal', 'bird'],
    tier: 6,
    emoji: '🐔',
    faction: 'ForestMonsters',
    factionGroup: 'chicken',
    attacks: single([{ dmg: dmg({ blunt: 10 }), name: 'beak' }]),
    tolerate: TOLERATE.WATER,
    speed: { walk: 3, run: 6, swim: 2 },
    turnSpeed: { walk: 100, run: 200, swim: 100 },
    hp: 10,
    damageModifiers: animalDmgModifiers,
    stagger: null,
    drop: [
      dropEntry('ChickenMeat'),
      dropEntry('Feathers', { max: 3 }),
    ],
    tame: { tameTime: 1800, fedTime: 600, commandable: false,
            eats: ['Dandelion', 'Barley', 'BeechSeeds', 'BirchSeeds', 'CarrotSeeds', 'OnionSeeds', 'TurnipSeeds'] },
            // eatRange:1, searchRange:10, heal:20
    pregnancy: { points: 3, time: 60, chance: 0.33, grow: 60, childId: 'ChickenEgg' }, // max: 10, range: 4
  },
  {
    type: 'creature',
    id: 'Chicken',
    iconId: 'creature/Hen',
    ragdollId: null,
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI', 'Growup'],
    tags: ['animal'],
    tier: 6,
    emoji: '🐤',
    faction: 'ForestMonsters',
    factionGroup: 'chicken',
    attacks: [],
    tolerate: TOLERATE.WATER,
    speed: { walk: 4, run: 6, swim: 2 },
    turnSpeed: { walk: 150, run: 150, swim: 100 },
    hp: 10,
    damageModifiers: animalDmgModifiers,
    stagger: null,
    drop: [
      dropEntry('ChickenMeat', { chance: 0.25 }),
      dropEntry('Feathers', { chance: 0.5, max: 2 }),
    ],
  },
  {
    type: 'creature',
    id: 'Hare',
    iconId: 'resource/TrophyHare',
    ragdollId: 'Hare_ragdoll',
    components: ['Character'],
    tags: ['animal'],
    tier: 6,
    emoji: '🐇',
    faction: 'AnimalsVeg',
    attacks: [],

    tolerate: TOLERATE.WATER,
    speed: { walk: 4, run: 8, swim: 2 },
    turnSpeed: { walk: 200, run: 300, swim: 100 },
    hp: 10,
    stagger: null,
    damageModifiers: animalDmgModifiers,
    drop: [
      dropEntry('HareMeat'),
      dropEntry('ScaleHide', { max: 3 }),
      dropTrophy('TrophyHare', 0.05),
    ],
  },
  {
    type: 'creature',
    id: 'Skeleton_Friendly',
    iconId: 'resource/TrophySkeleton',
    ragdollId: null,
    components: ['Character'],
    tags: ['animal'],
    tier: 6,
    emoji: '💀',
    faction: 'PlayerSpawned',
    attacks: [
      {
        variety: 'melee',
        rate: 4,
        // skeleton_sword2
        attacks: [{ dmg: dmg({ slash: 40 }), name: 'sword', force: 40 }],
      },
      {
        variety: 'ranged',
        rate: 1,
        // skeleton_bow2
        attacks: [{ dmg: dmg({ pierce: 40 }), name: 'bow', force: 15 }],
      },
    ],
    tolerate: TOLERATE.WATER | TOLERATE.SMOKE,
    speed: { walk: 1, run: 4, swim: 0 },
    turnSpeed: { walk: 300, run: 300, swim: 0 },
    hp: 400,
    stagger: null,
    damageModifiers: skeletonDamageModifiers,
    drop: [],
  },
  ...variations({
    type: 'creature',
    id: 'Dverger',
    iconId: 'resource/TrophyDvergr',
    ragdollId: 'Dverger_ragdoll',
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI'],
    tier: 6,
    emoji: '🏹',
    faction: 'Dverger',
    aggravatable,
    attacks: single([
      // DvergerArbalest_shoot
      { dmg: dmg({ pierce: 110 }), name: 'arbalest', force: 200, stagger: 1.68 },
      // Dverger_melee
      { dmg: dmg({ blunt: 70 }), name: 'melee', force: 80, stagger: 1.84 },
      // visual: DvergerArbalest
      // visual: DvergerSuitArbalest
    ]),
    tolerate: TOLERATE.WATER,
    speed: { walk: 2, run: 7, swim: 1.5 },
    turnSpeed: { walk: 200, run: 200, swim: 100 },
    hp: 350,
    stagger: { factor: 0.3, time: 1.68 },
    damageModifiers: animalDmgModifiers,
    drop: [
      dropEntry('Softtissue', { chance: 0.25, max: 2, scale: false }),
      dropEntry('BlackMarble', { chance: 0.5, max: 2, scale: false }),
      dropEntry('Coins', { min: 2, max: 15, scale: false }),
      dropTrophy('TrophyDvergr', 0.05),
    ],
  },
  {
    id: 'DvergerMage',
    emoji: '🧙‍♂️',
    // visual: DvergerHairMale
    // visual: DvergerHairFemale
    attacks: [
      {
        rate: 1,
        variety: 'Fire',
        attacks: [
          { dmg: dmg({ blunt: 70 }), name: 'melee', force: 80, stagger: 1.82 },
          { dmg: dmg({ fire: 100 }), name: 'fireball', force: 50, stagger: 1.68 }, // radius=6
          // visual: DvergerStaffFire
          // visual: DvergerSuitFire
          { dmg: dmg({ fire: 100 }), name: 'clusterbomb', force: 50, stagger: 1.68, burst: 3 }, // radius=3
        ],
      },
      {
        rate: 1,
        variety: 'Ice',
        attacks: [
          { dmg: dmg({ blunt: 70 }), name: 'melee', force: 80, stagger: 1.82 },
          { dmg: dmg({ frost: 200 }), name: 'icebolt', force: 50, stagger: 1.68 },
          // visual: DvergerStaffIce
          { dmg: dmg({ frost: 150 }), name: 'nova', force: 0, stagger: 1.68 }, // radius=5
          // visual: DvergerSuitIce
        ],
      },
      {
        rate: 1,
        variety: 'Healer',
        attacks: [
          // stagger: 1.68
          { cast: 'SE_Dvergr_buff' }, // radius=8
          { cast: 'SE_Dvergr_heal' }, // radius=4.28
          // visual: DvergerStaffHeal
          // visual: DvergerSuitSupport
          { spawn: ['Mistile'], name: 'mistile', number: [1, 3], max: 9 },
        ],
      },
    ],
    damageModifiers: { ...animalDmgModifiers, fire: 'resistant', frost: 'resistant' },
  },
  {
    id: 'DvergerAshlands',
    tier: 7,
    attacks: single([
      // visual: DvergerArbalest
      // DvergerArbalest_shootAshlands
      { dmg: dmg({ pierce: 210 }), name: 'arbalest', force: 30, stagger: 1.68 },
      // Dverger_meleeAshlands
      { dmg: dmg({ blunt: 70 }), name: 'melee', force: 80, stagger: 1.84 },
      // visual: DvergerSuitArbalest_Ashlands
    ]),
    hp: 1000,
  }, {
    id: 'DvergerDeepNorth',
    tier: 8,
    attacks: single([
      // visual: DvergerArbalest
      // DvergerArbalest_shootDeepNorth
      { dmg: dmg({ pierce: 250 }), name: 'arbalest', force: 30, stagger: 1.68 },
      // Dverger_meleeDeepNorth
      { dmg: dmg({ blunt: 140 }), name: 'melee', force: 80, stagger: 1.84 },
      // visual: DvergerSuitArbalest_Ashlands
    ]),
    hp: 1500,
    drop: [
      dropEntry('Coins', { min: 10, max: 20 }),
      dropTrophy('TrophyDvergr', 0.05),
      dropEntry('AncientGemstoneBlack', { chance: 0.1 }),
      dropEntry('AncientGemstoneGreen', { chance: 0.1 }),
      dropEntry('AncientGemstoneOrange', { chance: 0.1 }),
      dropEntry('AncientGemstonePurple', { chance: 0.1 }),
    ],
  }),
  {
    type: 'creature',
    id: 'Mistile',
    ragdollId: null,
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI'],
    PointLight: { color: '#EE433E', range: 10, intensity: 1.5 },
    tier: 2,
    emoji: '🔵',
    faction: 'Dverger',
    aggravatable,
    attacks: single([
      { dmg: dmg({ blunt: 150 }), name: 'kamikaze', force: 20, toolTier: 0, collider: areaCollider(1.5) }
    ]),
    tolerate: TOLERATE.WATER | TOLERATE.FIRE | TOLERATE.SMOKE,
    speed: { walk: 5, run: 5, swim: 0 },
    turnSpeed: { walk: 500, run: 500, swim: 0 },
    hp: 1,
    stagger: null,
    damageModifiers: animalDmgModifiers,
    drop: [],
    timedDestruction: [20, 25],
  },
  {
    type: 'creature',
    id: 'Tick',
    iconId: 'resource/TrophyTick',
    ragdollId: null,
    components: ['BaseAI', 'Character', 'MonsterAI'],
    tier: 6,
    emoji: '✔',
    faction: 'MistlandsMonsters',
    attacks: single([
      { dmg: dmg({ pierce: 50 }), name: 'stick', stagger: 1.66 },
    ]),

    tolerate: TOLERATE.WATER,
    speed: { walk: 1, run: 8, swim: 0 },
    turnSpeed: { walk: 300, run: 400, swim: 0 },
    hp: 50,
    stagger: { factor: 0.5, time: 1.54 },
    damageModifiers: {
      ...animalDmgModifiers,
      pierce: 'resistant',
    },
    drop: [
      dropEntry('GiantBloodSack'),
      dropTrophy('TrophyTick', 0.05),
    ],
  },
  {
    type: 'creature',
    id: 'Gjall',
    iconId: 'resource/TrophyGjall',
    ragdollId: null,
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI'],
    PointLight: { color: '#FF4517', range: 8, intensity: 1.5 },
    tier: 6,
    emoji: '🎈',
    faction: 'MistlandsMonsters',
    attacks: single([
      { dmg: dmg({ blunt: 50, fire: 80 }), name: 'spit', force: 30, burst: 2 }, // interval = 0.7
      { spawn: ['Tick'], number: [1, 3], max: 8, name: 'eggs' },
      { dmg: dmg({ blunt: 20 }), name: 'shake', force: 150, unblockable, undodgeable, collider: areaCollider(4.81) },
    ]),

    tolerate: TOLERATE.WATER,
    speed: { walk: 2, run: 6, swim: 4 },
    turnSpeed: { walk: 150, run: 250, swim: 60 },
    hp: 1500,
    stagger: null,
    damageModifiers: {
      blunt: 'normal',
      slash: 'normal',
      pierce: 'normal',
      chop: 'ignore',
      pickaxe: 'ignore',
      fire: 'resistant',
      frost: 'normal',
      lightning: 'normal',
      poison: 'normal',
      spirit: 'immune',
    },
    weakSpots: [{
      location: 'belly',
      damageModifiers: {
        blunt: 'normal',
        slash: 'normal',
        pierce: 'veryWeak',
        chop: 'ignore',
        pickaxe: 'ignore',
        fire: 'normal',
        frost: 'normal',
        lightning: 'normal',
        poison: 'normal',
        spirit: 'immune',
      }
    }],
    drop: [
      dropEntry('Bilebag', { scale: false }),
      dropTrophy('TrophyGjall', 0.3),
    ],
  },
  {
    type: 'creature',
    id: 'SeekerBrood',
    ragdollId: null,
    PointLight: { color: '#FF9547', range: 4, intensity: 1 },
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI'],
    tags: ['insect'],
    tier: 6,
    emoji: '🐜',
    faction: 'MistlandsMonsters',
    attacks: single([
      { dmg: dmg({ pierce: 60 }), name: 'pincers', force: 40, stagger: 1.86 },
    ]),

    tolerate: TOLERATE.WATER,
    speed: { walk: 1, run: 3, swim: 4 },
    turnSpeed: { walk: 150, run: 250, swim: 60 },
    hp: 20,
    stagger: { factor: 0.3, time: 1.86 },
    damageModifiers: seekerDamageModifiers,
    drop: [dropEntry('RoyalJelly', { max: 3 })],
  },
  {
    type: 'creature',
    id: 'Seeker',
    iconId: 'resource/TrophySeeker',
    ragdollId: null,
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI'],
    tags: ['insect'],
    tier: 6,
    emoji: '🐜',
    faction: 'MistlandsMonsters',
    attacks: single([
      { dmg: dmg({ pierce: 90 }), name: 'pincers', force: 40, stagger: 2.96 },
      { dmg: dmg({ pierce: 120 }), name: 'claw', force: 20, stagger: 2.96 },
      { dmg: dmg({ pierce: 120 }), name: 'claw2', force: 20, stagger: 2.96 },
      { dmg: dmg({ blunt: 100 }), name: 'slam', force: 150, stagger: 2.96 }, // + flying
    ]),

    tolerate: TOLERATE.WATER,
    speed: { walk: 2, run: 6, swim: 4 },
    turnSpeed: { walk: 150, run: 250, swim: 60 },
    hp: 200,
    stagger: { factor: 0.3, time: 2.96 },
    damageModifiers: seekerDamageModifiers,
    drop: [
      dropEntry('BugMeat', { max: 2 }),
      dropEntry('Carapace', { max: 2 }),
      dropTrophy('TrophySeeker', 0.1),
    ],
  },
  {
    type: 'creature',
    id: 'SeekerBrute',
    iconId: 'resource/TrophySeekerBrute',
    ragdollId: null,
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI'],
    tags: ['insect'],
    tier: 6,
    emoji: '🐜',
    faction: 'MistlandsMonsters',
    attacks: single([
      { dmg: dmg({ blunt: 100, chop: 100, pickaxe: 100 }), name: 'ram', force: 200, toolTier: 4, stagger: 2.5 },
      { dmg: dmg({ slash: 100 }), name: 'bite', force: 70, stagger: 2.48 },
      { dmg: dmg({ blunt: 120, chop: 100, pickaxe: 100 }), name: 'slam', force: 100, stagger: 2.36, collider: areaCollider(4) },
    ]),
    tolerate: TOLERATE.WATER,
    speed: { walk: 2, run: 6, swim: 4 },
    turnSpeed: { walk: 150, run: 250, swim: 60 },
    hp: 1500,
    stagger: { factor: 0.3, time: 2.36 },
    damageModifiers: seekerDamageModifiers,
    weakSpots: [{
      location: 'ass',
      damageModifiers: {
        blunt: 'weak',
        slash: 'weak',
        pierce: 'weak',
        chop: 'ignore',
        pickaxe: 'ignore',
        fire: 'weak',
        frost: 'weak',
        lightning: 'weak',
        poison: 'normal',
        spirit: 'immune',
      },
    }],
    drop: [
      dropEntry('BugMeat', { max: 2 }),
      dropEntry('Carapace', { min: 2, max: 4 }),
      dropTrophy('TrophySeekerBrute', 0.05),
      dropEntry('Mandible', { min: 1, max: 2, scale: false }),
    ],
  },
  {
    type: 'creature',
    id: 'SeekerQueen',
    iconId: 'resource/TrophySeekerQueen',
    ragdollId: null,
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI'],
    tags: ['insect'],
    tier: 6,
    emoji: '🐜👑',
    faction: 'Boss',
    attacks: single([
      // SeekerQueen_Teleport: aiMaxHp: 0.9
      // SeekerQueen_Rush
      { dmg: dmg({ slash: 100, chop: 300, pickaxe: 300 }), name: 'rush', force: 250, toolTier: 3, aiMaxHp: 0.6 },
      // SeekerQueen_Bite
      { dmg: dmg({ pierce: 140, chop: 300, pickaxe: 300, poison: 100 }), name: 'bite', force: 250, toolTier: 3, aiMaxHp: 0.7 },
      // SeekerQueen_Call
      { spawn: ['Seeker'], number: [1, 3], max: 6, name: 'call', aiMaxHp: 0.99 },
      // SeekerQueen_Spit does a burst of 20x, aiHp: [0, 0.9]
      // SeekerQueen_projectile_spit, each has 30% spawn on hit
      // SeekerQueen_SpitSpawnAbility, which spawn 1 SeekerBrood
      { spawn: ['SeekerBrood'], number: [4, 8], max: 30, name: 'spit' }, // 20 with p=0.3
      { dmg: dmg({ slash: 130, chop: 300, pickaxe: 300 }), name: 'slap', force: 250, toolTier: 3 },
      { dmg: dmg({ pierce: 150, chop: 300, pickaxe: 300 }), name: 'pirce_aoe', force: 250, toolTier: 3, collider: areaCollider(4.5) },
    ]),
    tolerate: TOLERATE.WATER,
    speed: { walk: 4, run: 8, swim: 4 },
    turnSpeed: { walk: 50, run: 120, swim: 60 },
    hp: 12500,
    stagger: null,
    damageModifiers: {
      blunt: 'normal',
      slash: 'normal',
      pierce: 'resistant',
      chop: 'ignore',
      pickaxe: 'ignore',
      fire: 'normal',
      frost: 'normal',
      lightning: 'normal',
      poison: 'normal',
      spirit: 'immune',
    },
    drop: [
      dropTrophy('TrophySeekerQueen', 1),
      dropEntry('QueenDrop', { min: 3, scale: false }),
    ],
  },
// OCEAN
  {
    type: 'creature',
    id: 'Serpent',
    ragdollId: '',
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI'],
    tags: ['animal'],
    tier: 2,
    emoji: '🐍',
    faction: 'SeaMonsters',
    attacks: single([
      { dmg: dmg({ slash: 70, }), name: 'attack', force: 100 },
      // taunt
    ]),
    tolerate: TOLERATE.WATER | TOLERATE.SMOKE,
    speed: { walk: 4, run: 4, swim: 10 },
    turnSpeed: { walk: 20, run: 20, swim: 100 },
    hp: 400,
    stagger: null,
    damageModifiers: {
      ...animalDmgModifiers,
      fire: 'immune',
      frost: 'weak',
      poison: 'resistant',
    },
    drop: [
      dropEntry('SerpentScale', { min: 8, max: 10 }),
      dropEntry('SerpentMeat', { min: 6, max: 8 }),
      dropTrophy('TrophySerpent', 0.33),
    ],
  },
  {
    type: 'creature',
    id: 'BonemawSerpent',
    iconId: 'resource/TrophyBonemawSerpent',
    ragdollId: '',
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI'],
    tags: ['animal'],
    tier: 7,
    emoji: '🐍',
    faction: 'SeaMonsters',
    attacks: single([
      // BonemawSerpent_spit
      { dmg: dmg({ blunt: 40, fire: 20, poison: 20 }), force: 30, name: 'spit' },
      // BonemawSerpent_taunt
      // BonemawSerpent_bite
      { dmg: dmg({ slash: 140 }), force: 100, name: 'bite' },
    ]),
    tolerate: TOLERATE.WATER | TOLERATE.SMOKE,
    speed: { walk: 4, run: 4, swim: 12 },
    turnSpeed: { walk: 20, run: 20, swim: 100 },
    hp: 1100,
    stagger: null,
    damageModifiers: {
      ...animalDmgModifiers,
      fire: 'immune',
      frost: 'weak',
      poison: 'resistant',
    },
    drop: [
      dropTrophy('TrophyBonemawSerpent', 0.33),
      dropEntry('BoneMawSerpentMeat', { min: 6, max: 8 }),
      dropEntry('BonemawSerpentTooth', { min: 8, max: 10 }),
    ],
  },
// ASHLANDS
  {
    type: 'creature',
    id: 'Volture',
    iconId: 'resource/TrophyVolture',
    ragdollId: '',
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI'],
    tags: ['animal'],
    tier: 7,
    emoji: '🦃',
    faction: 'Demon',
    attacks: single([
      // volture_talons
      { dmg: dmg({ slash: 110 }), stagger: 1, force: 5, name: 'talons' },
    ]),
    tolerate: TOLERATE.WATER,
    speed: { walk: 7, run: 13, swim: 0 },
    turnSpeed: { walk: 300, run: 300, swim: 0 },
    hp: 200,
    stagger: { factor: 0.5, time: 1 },
    damageModifiers: {
      ...defaultDmgModifiers,
      frost: 'weak',
      poison: 'immune',
    },
    drop: [
      dropTrophy('TrophyVolture', 0.1),
      dropEntry('VoltureMeat'),
      dropEntry('Feathers', { min: 2, max: 3, chance: 0.5 }),
      dropEntry('VoltureEgg', { min: 1, max: 2, chance: 0.5 }),
    ],
  },
  {
    type: 'creature',
    id: 'Asksvin',
    iconId: 'resource/TrophyAsksvin',
    ragdollId: 'Ragdoll_Asksvin',
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI', 'Procreation', 'Tameable'],
    tags: ['animal'],
    tier: 7,
    emoji: '🐗',
    faction: 'Demon',
    factionGroup: 'asksvin',
    attacks: single([
      // Asksvin_Bite
      { dmg: dmg({ blunt: 75, slash: 75, chop: 50, pickaxe: 50 }), stagger: 2.34, force: 50, name: 'bite' },
      // Asksvin_Headbutt
      { dmg: dmg({ blunt: 120, chop: 100, pickaxe: 100 }), toolTier: 4, stagger: 2.34, force: 200, name: 'ram' },
      // Asksvin_Pounce
      { dmg: dmg({ blunt: 150, chop: 50, pickaxe: 100 }), stagger: 2.34, force: 100, name: 'pounce' },
    ]),
    tolerate: TOLERATE.WATER,
    speed: { walk: 3, run: 7, swim: 3 },
    turnSpeed: { walk: 95, run: 120, swim: 50 },
    hp: 800,
    stagger: { factor: 0.3, time: 2.34 },
    damageModifiers: { ...animalDmgModifiers, fire: 'resistant', poison: 'resistant' },
    drop: [
      dropTrophy('TrophyAsksvin', 0.1),
      dropEntry('AskBladder'),
      dropEntry('AskHide', { min: 2, max: 3 }),
      dropEntry('AsksvinMeat', { min: 2, max: 3 }),
    ],
    tame: { tameTime: 1800, fedTime: 600, commandable: false,
            eats: ['Vineberry', 'Fiddleheadfern', 'MushroomSmokePuff'] },
            // eatRange:1.0, searchRange:10, heal:5
    pregnancy: { points: 3, time: 60, chance: 0.33, grow: 3000, childId: 'AsksvinEgg' },
  },
  {
    type: 'creature',
    id: 'Asksvin_hatchling',
    iconId: 'resource/TrophyAsksvin',
    ragdollId: null,
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI', 'Growup'],
    tags: ['animal'],
    tier: 7,
    emoji: '🐗',
    faction: 'Demon',
    factionGroup: 'asksvin',
    attacks: [],
    tolerate: TOLERATE.WATER,
    speed: { walk: 3, run: 9, swim: 0 },
    turnSpeed: { walk: 95, run: 120, swim: 0 },
    hp: 400,
    stagger: null,
    damageModifiers: { ...animalDmgModifiers, fire: 'resistant', poison: 'resistant' },
    drop: [
      dropEntry('AskBladder', { chance: 0.2 }),
      dropEntry('AskHide', { chance: 0.2 }),
      dropEntry('AsksvinMeat', { chance: 0.2 }),
    ],
  },
  {
    type: 'creature',
    id: 'Troll_Summoned',
    ragdollId: 'Troll_summoned_ragdoll',
    components: ['Character'],
    tags: ['animal'],
    tier: 7,
    emoji: '💀',
    faction: 'PlayerSpawned',
    attacks: [
      {
        rate: 1,
        variety: 'unarmed',
        attacks: [
          // troll_summoned_punch
          { dmg: dmg({ blunt: 60, pickaxe: 40 }), name: '1-hand hit', stagger: 4.4, force: 100, toolTier: 2 },
          // troll_summoned_groundslam
          { dmg: dmg({ blunt: 70, chop: 100, pickaxe: 40 }), name: '2-hand smash', stagger: 1.98, force: 100, toolTier: 2 },
          // troll_summoned_throw
          { dmg: dmg({ blunt: 80, chop: 60, pickaxe: 40, fire: 20 }), name: 'throw', stagger: 2.16, force: 60, toolTier: 0 },
        ],
      }, {
        rate: 1,
        variety: 'log',
        attacks: [
          // troll_summoned_log_swing_v
          { dmg: dmg({ blunt: 70, chop: 100, pickaxe: 40 }), name: 'v-swing', stagger: 2.74, force: 80, toolTier: 2 },
          // troll_summoned_log_swing_h
          { dmg: dmg({ blunt: 60, chop: 100, pickaxe: 40 }), name: 'h-swing', stagger: 2.74, force: 80, toolTier: 2 },
        ],
      },
    ],
    tolerate: TOLERATE.WATER | TOLERATE.SMOKE,
    speed: { walk: 1, run: 4, swim: 0 },
    turnSpeed: { walk: 300, run: 300, swim: 0 },
    hp: 2000,
    stagger: null,
    damageModifiers: mods([1, 0, 0, 4, 4, 3, 2, 0, 0, 3]),
    drop: [],
  },
  ...variations({
    type: 'creature',
    id: 'Charred_Archer',
    iconId: 'resource/TrophyCharredArcher',
    ragdollId: null,
    components: ['Character'],
    tags: ['skeleton'],
    tier: 7,
    emoji: '💀',
    faction: 'Demon',
    attacks: single([
      // charred_bow
      { dmg: dmg({ pierce: 120 }), name: 'bow', force: 15, burst: 10 },
      // charred_bow_volley
      { dmg: dmg({ pierce: 60 }), name: 'volley', force: 15 },
    ]),
    tolerate: TOLERATE.WATER | TOLERATE.FIRE | TOLERATE.SMOKE,
    speed: { walk: 1.5, run: 4, swim: 0 },
    turnSpeed: { walk: 400, run: 300, swim: 0 },
    hp: 400,
    stagger: { factor: 0.5, time: 1.5 },
    damageModifiers: charredDmgModifiers,
    drop: [
      dropEntry('CharredBone', { max: 3 }),
      dropTrophy('TrophyCharredArcher', 0.05),
    ],
  }, {
    id: 'Charred_Archer_Fader',
    damageModifiers: charredSummonDmgModifiers,
    attacks: single([
      // charred_bow_Fader
      { dmg: dmg({ pierce: 60 }), name: 'bow', force: 15 },
      // charred_bow_volley_Fader
      { dmg: dmg({ pierce: 30 }), name: 'volley', force: 15 },
    ]),
    hp: 50,
    drop: [],
  }),
  {
    type: 'creature',
    id: 'Charred_Mage',
    iconId: 'resource/TrophyCharredMage',
    ragdollId: null,
    components: ['Character'],
    tags: ['skeleton'],
    tier: 7,
    emoji: '💀',
    faction: 'Demon',
    attacks: single([
      // Charred_HipCloth
      // charred_magestaff_fire
      // Charred_MageCloths
      // charred_magestaff_summon
      { spawn: ['Charred_Twitcher_Summoned'], number: [1, 3], max: 5 },
    ]),
    tolerate: TOLERATE.WATER | TOLERATE.FIRE | TOLERATE.SMOKE,
    speed: { walk: 1.5, run: 4, swim: 0 },
    turnSpeed: { walk: 400, run: 300, swim: 0 },
    hp: 600,
    stagger: { factor: 0.5, time: 1.5 },
    damageModifiers: charredDmgModifiers,
    drop: [
      dropEntry('CharredBone', { max: 3 }),
      dropTrophy('TrophyCharredMage', 0.05),
    ],
  },
  ...variations({
    type: 'creature',
    id: 'Charred_Melee',
    iconId: 'resource/TrophyCharredMelee',
    ragdollId: 'Charred_Melee_Ragdoll',
    components: ['Character'],
    tags: ['skeleton'],
    tier: 7,
    emoji: '💀',
    faction: 'Demon',
    attacks: single([
      // Charred_HipCloth
      // charred_greatsword_swing
      { dmg: dmg({ slash: 150 }), name: 'swing', force: 40 },
      // charred_greatsword_thrust
      { dmg: dmg({ pierce: 160 }), name: 'thrust', force: 40 },
      // charred_greatsword_feint
      { dmg: dmg({ slash: 130 }), name: 'feint', force: 40 },
      // charred_greatsword_thrustfeint
      { dmg: dmg({ pierce: 160 }), name: 'thrust-feint', force: 40 },
    ]),
    tolerate: TOLERATE.WATER | TOLERATE.FIRE | TOLERATE.SMOKE,
    speed: { walk: 1.5, run: 4, swim: 0 },
    turnSpeed: { walk: 400, run: 300, swim: 0 },
    hp: 600,
    stagger: { factor: 0.5, time: 1.5 },
    damageModifiers: charredDmgModifiers,
    drop: [
      dropEntry('CharredBone', { max: 3 }),
      dropTrophy('TrophyCharredMelee', 0.05),
    ],
  }, {
    id: 'Charred_Melee_Dyrnwyn',
    minLvl: 3,
    maxLvl: 3,
    attacks: single([
      // Charred_HipCloth
      // charred_dyrnwyn_greatsword_swing
      { dmg: dmg({ slash: 240 }), name: 'swing', force: 40 },
      // charred_dyrnwyn_greatsword_thrust
      { dmg: dmg({ pierce: 230 }), name: 'thrust', force: 40 },
      // charred_dyrnwyn_greatsword_feint
      { dmg: dmg({ slash: 250 }), name: 'feint', force: 40 },
      // charred_dyrnwyn_greatsword_thrustfeint
      { dmg: dmg({ pierce: 210 }), name: 'thrust-feint', force: 40 },
      // Charred_Helmet
      // Charred_Breastplate
    ]),
    hp: 2500,
    damageModifiers: mods([0, 0, 1, 4, 4, 1, 1, 0, 3, 2]),
    drop: [
      dropEntry('DyrnwynHiltFragment', { scale: false }),
    ],
  }, {
    id: 'Charred_Melee_Fader',
    attacks: single([
      // Charred_HipCloth
      // charred_fader_greatsword_swing
      { dmg: dmg({ slash: 75 }), name: 'swing', force: 40 },
      // charred_fader_greatsword_thrust
      { dmg: dmg({ pierce: 80 }), name: 'thrust', force: 40 },
      // charred_fader_greatsword_feint
      { dmg: dmg({ slash: 65 }), name: 'feint', force: 40 },
      // charred_fader_greatsword_thrustfeint
      { dmg: dmg({ pierce: 80 }), name: 'thrust-feint', force: 40 },
    ]),
    damageModifiers: charredSummonDmgModifiers,
    hp: 50,
    drop: [],
  }),
  ...variations({
    type: 'creature',
    id: 'Charred_Twitcher',
    iconId: 'resource/TrophyCharredMelee',
    ragdollId: null,
    components: ['Character'],
    tags: ['skeleton'],
    tier: 7,
    emoji: '💀',
    faction: 'Demon',
    attacks: single([
      // charred_twitcher_scratch_l
      { dmg: dmg({ slash: 100 }), force: 40, name: 'scratch' },
      // charred_twitcher_scratch_r
      { dmg: dmg({ slash: 100 }), force: 40, name: 'scratch' },
      // charred_twitcher_throw
      { dmg: dmg({ pierce: 75 }), force: 15, name: 'throw' },
    ]),
    tolerate: TOLERATE.WATER | TOLERATE.FIRE | TOLERATE.SMOKE,
    speed: { walk: 2, run: 6, swim: 0 },
    turnSpeed: { walk: 400, run: 300, swim: 0 },
    hp: 220,
    stagger: { factor: 0.5, time: 1.5 },
    damageModifiers: charredDmgModifiers,
    drop: [
      dropEntry('CharredBone', { max: 2 }),
    ],
  }, {
    id: 'Charred_Twitcher_Summoned',
    hp: 50,
  }),
  {
    type: 'creature',
    id: 'staff_greenroots_tentaroot',
    ragdollId: null,
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI'],
    tier: 7,
    emoji: '🥦',
    faction: 'Players',
    attacks: single([
      // staff_greenroots_tentaroot_attack
      { dmg: dmg({ blunt: 70, chop: 20, pickaxe: 20, poison: 40 }), name: 'poke', force: 40, toolTier: 4 }
      // effect: ImmobilizedAshlands, chance: 0.1
    ]),
    tolerate: TOLERATE.WATER | TOLERATE.SMOKE,
    speed: { walk: 0, run: 0, swim: 0 },
    turnSpeed: { walk: 200, run: 200, swim: 100 },
    hp: 250,
    stagger: null,
    damageModifiers: {
      ...defaultDmgModifiers,
      fire: 'resistant',
      poison: 'immune',
    },
    drop: [],
  },
  {
    type: 'creature',
    id: 'Goblin_Gem',
    disabled: true,
    ragdollId: null,
    components: ['BaseAI', 'Character', 'MonsterAI'],
    tier: 7,
    emoji: '💎',
    faction: 'ForestMonsters',
    attacks: single([]),
    tolerate: TOLERATE.WATER,
    speed: { walk: 1.5, run: 12, swim: 2 },
    turnSpeed: { walk: 80, run: 200, swim: 100 },
    hp: 1000,
    stagger: null,
    damageModifiers: animalDmgModifiers,
    drop: [
      dropEntry('GemstoneBlue', { min: 2, max: 4 }),
      dropEntry('GemstoneGreen', { min: 2, max: 4 }),
      dropEntry('GemstoneRed', { min: 2, max: 4 }),
    ],
    timedDestruction: [23, 25],
  },
  {
    type: 'creature',
    group: 'blob',
    id: 'BlobLava',
    ragdollId: null,
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI'],
    tier: 7,
    emoji: '🦠',
    faction: 'Demon',
    attacks: single([
      // blobLava_attack_aoe
      { dmg: dmg({ blunt: 70, chop: 160, pickaxe: 160, fire: 30 }), name: 'explosion', unblockable, collider: areaCollider(4) },
    ]),
    tolerate: TOLERATE.WATER | TOLERATE.FIRE | TOLERATE.SMOKE,
    speed: { walk: 1, run: 2, swim: 0 },
    turnSpeed: { walk: 100, run: 100, swim: 0 },
    hp: 300,
    stagger: null,
    damageModifiers: mods([2, 0, 1, 4, 4, 3, 2, 2, 1, 0]),
    drop: [
      dropEntry('ProustitePowder', { min: 1, max: 2 }),
      dropEntry('SulfurStone', { min: 1, max: 2 }),
      dropTrophy('TrophyBlob_Lava', 0.1),
    ],
  },
  {
    type: 'creature',
    id: 'Morgen',
    iconId: 'resource/TrophyMorgen',
    ragdollId: null,
    components: ['Character'],
    tier: 7,
    emoji: '🕷',
    faction: 'Demon',
    attacks: single([
      // Morgen_bite
      { dmg: dmg({ pierce: 160, chop: 100, pickaxe: 100 }), name: 'bite', force: 70, toolTier: 3 }, // interval: 4
      // Morgen_roll_right
      { dmg: dmg({ blunt: 40, chop: 100, pickaxe: 100 }), name: 'roll_right', force: 70, toolTier: 3, collider: areaCollider(3) }, // interval: 12
      // Morgen_roll_left
      { dmg: dmg({ blunt: 40, chop: 100, pickaxe: 100 }), name: 'roll_left', force: 70, toolTier: 3, collider: areaCollider(3) }, // interval: 12
      // Morgen_swipe_1
      { dmg: dmg({ pierce: 160, chop: 100, pickaxe: 100 }), name: 'swipe 1', force: 20, toolTier: 3 }, // interval: 5
      // Morgen_swipe_2
      { dmg: dmg({ pierce: 160, chop: 100, pickaxe: 100 }), name: 'swipe 2', force: 20, toolTier: 3 }, // interval: 5
      // Morgen_swipe_3
      { dmg: dmg({ pierce: 160, chop: 100, pickaxe: 100 }), name: 'swipe 3', force: 20, toolTier: 3 }, // interval: 5
      // Morgen_swipe_4
      { dmg: dmg({ pierce: 160, chop: 100, pickaxe: 100 }), name: 'swipe 4', force: 20, toolTier: 3 }, // interval: 5
      // Morgen_bodyslam
      { dmg: dmg({ blunt: 160 }), name: 'bodyslam', force: 70, toolTier: 3 }, // interval: 12
    ]),
    tolerate: TOLERATE.WATER | TOLERATE.FIRE,
    speed: { walk: 3, run: 8.6, swim: 4 },
    turnSpeed: { walk: 80, run: 150, swim: 60 },
    hp: 1600,
    stagger: { factor: 0.3, time: 1.34 },
    damageModifiers: mods([1, 1, 1, 4, 4, 1, 0, 2, 0, 0]),
    drop: [
      dropTrophy('TrophyMorgen', 0.05),
      dropEntry('MorgenSinew', { chance: 0.5, min: 1, max: 2 }),
      dropEntry('MorgenHeart', { chance: 0.5 }),
    ],
  },
  {
    type: 'creature',
    id: 'FallenValkyrie',
    iconId: 'resource/TrophyFallenValkyrie',
    ragdollId: null,
    components: ['Character'],
    tags: ['fly'],
    tier: 7,
    emoji: '🦅',
    faction: 'Demon',
    attacks: single([
      // FallenValkyrie_spit
      // -> fallenvalkyrie_spit_projectile x3
      // -> FallenValkyrie_projectile_explosion
      { dmg: dmg({ fire: 80, poison: 18 }), name: 'spit' }, // interval: 10
      // FallenValkyrie_claws
      { dmg: dmg({ slash: 105, pierce: 55 }), name: 'claws' }, // interval: 3
      // FallenValkyrie_spin
      { dmg: dmg({ blunt: 80, pierce: 100, chop: 100, pickaxe: 100 }), name: 'spin', force: 250, collider: areaCollider(5.67) }, // interval: 10
      // FallenValkyrie_taunt
      { dmg: dmg({ slash: 20, pierce: 20 }), name: 'taunt', force: 280 }, // interval: 30
    ]),
    tolerate: TOLERATE.WATER | TOLERATE.FIRE,
    speed: { walk: 10, run: 15, swim: 0 },
    turnSpeed: { walk: 300, run: 220, swim: 0 },
    hp: 1500,
    stagger: { factor: 0.5, time: 1.34 },
    damageModifiers: mods([0, 0, 0, 4, 4, 1, 0, 0, 3, 2]),
    drop: [
      dropTrophy('TrophyFallenValkyrie', 0.05),
      dropEntry('CelestialFeather', { chance: 0.5, min: 2, max: 4 }),
    ],
  },
  {
    type: 'creature',
    id: 'Fader',
    iconId: 'resource/TrophyFader',
    ragdollId: null,
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI'],
    tags: ['dragon'],
    tier: 7,
    emoji: '🐉',
    faction: 'Boss',
    attacks: single([
      // Fader_Fissure
      { dmg: dmg({ pierce: 120, chop: 1000, pickaxe: 1000 }), name: 'fissure', force: 50, toolTier: 3, aiMinHp: 0.35, aiMaxHp: 0.85 }, // interval: 30, range: [0, 40]
      // Fader_Bite
      { dmg: dmg({ pierce: 210, chop: 300, pickaxe: 300 }), name: 'bite', force: 100, toolTier: 3 }, // interval: 3, range: [0, 9]
      // Fader_Claw_Left
      { dmg: dmg({ pierce: 200, chop: 300, pickaxe: 300 }), name: 'claw-left', force: 100, toolTier: 3 }, // interval: 3, range: [0, 9]
      // Fader_Claw_Right
      { dmg: dmg({ pierce: 200, chop: 300, pickaxe: 300 }), name: 'claw-right', force: 100, toolTier: 3 }, // interval: 3, range: [0, 9]
      // Fader_Spin
      { dmg: dmg({ pierce: 140, chop: 300, pickaxe: 300 }), name: 'spin', force: 130, toolTier: 3, collider: areaCollider(8.5) }, // interval: 20, range: [0, 8]
      // Fader_Flamebreath
      { dmg: dmg({ chop: 40, pickaxe: 40, fire: 60 }), name: 'flamebreath', force: 0, toolTier: 0, aiMinHp: 0.05, aiMaxHp: 0.85 }, // interval: 25, range: [2, 20]
      // Fader_Meteors, dodgeable: false, blockable: false
        // -> spawn_fader_meteors
        // -> projectile_meteor_fader x10
      { dmg: dmg({ blunt: 40, chop: 100, pickaxe: 100, fire: 120 }), name: 'meteors', force: 100, toolTier: 0, aiMinHp: 0.25, aiMaxHp: 1, burst: 10 }, // interval: 25, range: [0, 30]
      // Fader_Roar -> Fader_Roar_Projectile -> Fader_Roar_Spawn
      { spawn: ['Charred_Melee_Fader', 'Charred_Archer_Fader'], name: 'roar', number: [1, 1], max: 7, aiMinHp: 0.35, aiMaxHp: 0.55 }, // interval: 45, range: [0, 100]
      // Fader_WallOfFire
      { dmg: dmg({ pierce: 120, chop: 1000, pickaxe: 1000 }), name: 'wall of fire', force: 50, toolTier: 3, aiMinHp: 0.15, aiMaxHp: 0.9 }, // interval: 60, range: [0, 40]
      // Fader_Meteors_Intense, dodgeable: false, blockable: false
        // -> spawn_fader_meteors
        // -> projectile_meteor_fader x10
      { dmg: dmg({ blunt: 40, chop: 100, pickaxe: 100, fire: 120 }), name: 'meteors', force: 100, toolTier: 0, aiMaxHp: 0.25, burst: 10 }, // interval: 18, range: [0, 30]
      // Fader_Fissure_Intense
        // chop: 30, pickaxe: 30, fire: 80, spirit: 80
        // radius: 4, ttl: 20, hitInterval: 0.5
      { dmg: dmg({ pierce: 120, chop: 1000, pickaxe: 1000 }), name: 'fissure', force: 50, toolTier: 3, aiMaxHp: 0.35 }, // interval: 20, range: [0, 40]
      // Fader_Roar_Intense -> Fader_Roar_Projectile -> Fader_Roar_Spawn
      { spawn: ['Charred_Melee_Fader', 'Charred_Archer_Fader'], name: 'roar', number: [1, 1], max: 7, aiMaxHp: 0.35 }, // interval: 26, range: [0, 100]
    ]),
    tolerate: TOLERATE.WATER | TOLERATE.FIRE,
    speed: { walk: 12, run: 12, swim: 0 },
    turnSpeed: { walk: 120, run: 250, swim: 0 },
    hp: 20000,
    stagger: null,
    damageModifiers: mods([0, 0, 1, 4, 4, 3, 0, 0, 0, 3]),
    drop: [
      dropTrophy('TrophyFader', 1),
      dropEntry('FaderDrop', { min: 3, scale: false }),
    ],
  },
// DEEP NORTH
  {
    type: 'creature',
    id: 'Seal',
    iconId: 'resource/TrophySeal',
    ragdollId: 'seal_ragdoll',
    components: ['Character'],
    tier: 8,
    emoji: '🦠',
    faction: 'DeepNorth',
    attacks: single([]),
    tolerate: TOLERATE.WATER | TOLERATE.SMOKE,
    speed: { walk: 2, run: 3, swim: 2 },
    turnSpeed: { walk: 80, run: 200, swim: 100 },
    hp: 400,
    stagger: null,
    damageModifiers: { ...animalDmgModifiers, fire: 'weak' },
    drop: [
      dropEntry('SealHide', { min: 2, max: 3 }),
      dropTrophy('TrophySeal', 0.1),
      dropEntry('SealBlubber', { min: 2, max: 3 }),
    ],
  },
  {
    type: 'creature',
    id: 'Seal_Pup',
    ragdollId: 'seal_pup_ragdoll',
    iconId: 'resource/TrophySeal',
    components: ['Character'],
    tier: 8,
    emoji: '🦠',
    faction: 'DeepNorth',
    attacks: single([]),
    tolerate: TOLERATE.WATER | TOLERATE.SMOKE,
    speed: { walk: 2, run: 3, swim: 2 },
    turnSpeed: { walk: 80, run: 200, swim: 100 },
    hp: 200,
    stagger: null,
    damageModifiers: animalDmgModifiers,
    drop: [
      dropEntry('SealBlubber', { chance: 0.1 }),
    ],
  },
  // ShadowPerson
  /*
    spawners: [spawner({
      tier: 8,
      biomes: ['DeepNorth'],
      maxSpawned: 5,
      interval: 300,
      chance: 0.1,
      groupSize: [2, 4],
      groupRadius: 6,
      altitude: [10, 1000],
      forest: true,
    })],
  */
  ...variations({
    type: 'creature',
    id: 'Moose',
    iconId: 'resource/TrophyMoose',
    ragdollId: 'Moose_Ragdoll',
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI', 'Procreation', 'Saddle', 'Tameable'],
    tags: ['animal'],
    tier: 8,
    emoji: '🐃',
    faction: 'DeepNorth',
    factionGroup: 'moose',
    attacks: single([
      // spiritmoose_hooves
      { dmg: dmg({ blunt: 150 }), name: 'hooves', force: 30 },
      // spiritmoose_horns
      { dmg: dmg({ slash: 160 }), name: 'horns', force: 150 },
      // spiritmoose_horns_sweep
      { dmg: dmg({ slash: 145 }), name: 'sweep', force: 60 },
    ]),
    tolerate: TOLERATE.WATER,
    speed: { walk: 6, run: 12.6, swim: 3 },
    turnSpeed: { walk: 70, run: 80, swim: 50 },
    hp: 1000,
    stagger: { factor: 0.3, time: 3.16 },
    damageModifiers: loxDamageModifiers,
    drop: [
      dropEntry('MooseMeat', { min: 4, max: 6 }),
      dropTrophy('TrophyMoose', 0.1),
      dropEntry('MooseHide', { min: 2, max: 3 }),
      dropEntry('MooseSinew', { min: 2, max: 3 }),
    ],
    tame: { tameTime: 1800, fedTime: 600, commandable: false,
            eats: ['Lingonberry'] },
            // eatRange:4, searchRange:10, heal:10
    pregnancy: { points: 3, time: 60, chance: 0.33, grow: 6000, childId: 'Moose_calf' },
  }, {
    id: 'Moose_spiritcaller',
    ragdollId: null,
    faction: 'Players',
    hp: 1100,
    drop: [],
    pregnancy: undefined,
  }),
  {
    type: 'creature',
    id: 'Moose_calf',
    iconId: 'resource/TrophyMoose',
    ragdollId: 'Moose_Calf_Ragdoll',
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI', 'Growup'],
    tags: ['animal'],
    tier: 8,
    emoji: '🐃',
    faction: 'DeepNorth',
    factionGroup: 'moose',
    attacks: [],
    tolerate: TOLERATE.WATER,
    speed: { walk: 6, run: 12.6, swim: 3 },
    turnSpeed: { walk: 70, run: 80, swim: 50 },
    hp: 1000,
    stagger: null,
    damageModifiers: loxDamageModifiers,
    drop: [dropEntry('MooseMeat', { scale: false })],
  },
  {
    type: 'creature',
    id: 'Barka',
    iconId: 'resource/TrophyBarka',
    ragdollId: 'Barka_Ragdoll',
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI'],
    tier: 8,
    emoji: '',
    faction: 'DeepNorth',
    attacks: single([
      // Barka_HeavySwing
      { dmg: dmg({ blunt: 160, chop: 60, pickaxe: 30, frost: 100 }), name: 'heavyswing', force: 70, toolTier: 3 },
      // Barka_SlamDrive
      { dmg: dmg({ blunt: 180, chop: 50, pickaxe: 25, frost: 100 }), name: 'slamdrive', force: 140, toolTier: 3 },
      // Barka_WhipFlurry
      { dmg: dmg({ blunt: 100, chop: 25, pickaxe: 10, frost: 100 }), name: 'whipflurry', force: 70, toolTier: 3 },
      // Barka_WhipSlam
      { dmg: dmg({ blunt: 100, pierce: 100, chop: 50, pickaxe: 30, frost: 40 }), name: 'whipslam', force: 70, toolTier: 3 },
      // Barka_Backslam
      { dmg: dmg({ blunt: 190, chop: 40, frost: 80 }), name: 'backslam', force: 70, toolTier: 3 },
    ]),
    tolerate: TOLERATE.WATER | TOLERATE.FIRE,
    speed: { walk: 4, run: 6, swim: 0 },
    turnSpeed: { walk: 80, run: 150, swim: 0 },
    hp: 2200,
    stagger: { factor: 0.3, time: 2.86 },
    damageModifiers: mods([1, 1, 1, 0, 4, 2, 1, 1, 3, 3]),
    drop: [
      dropTrophy('TrophyBarka', 0.1),
      dropEntry('BarkaBranch'),
    ],
  },
  {
    type: 'creature',
    id: 'Elaking',
    iconId: 'resource/TrophyElaking',
    ragdollId: 'Elaking_Ragdoll',
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI'],
    tier: 8,
    emoji: '',
    faction: 'DeepNorth',
    attacks: single([
      // Elaking_AttackClaw
      { dmg: dmg({ blunt: 40, slash: 100 }), name: 'claw', force: 30 },
      // Elaking_AttackJump
      { dmg: dmg({ blunt: 75, slash: 30, chop: 200, pickaxe: 100 }), name: 'jump', force: 40 }, // area
    ]),
    tolerate: TOLERATE.WATER,
    speed: { walk: 1.6, run: 6, swim: 1.5 },
    turnSpeed: { walk: 200, run: 200, swim: 100 },
    hp: 350,
    stagger: { factor: 0.3, time: 2.18 },
    damageModifiers: mods([0, 0, 0, 4, 4, 2, 1, 0, 0, 3]),
    drop: [
      dropEntry('ElakingHairBundle', { max: 2 }),
      dropTrophy('TrophyElaking', 0.1),
      dropEntry('MoldKeys', { chance: 0.2, scale: false }),
    ],
  },
  {
    type: 'creature',
    id: 'ElakingLantern',
    iconId: 'resource/TrophyElaking',
    ragdollId: 'Elaking_Ragdoll',
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI'],
    tier: 8,
    emoji: '',
    faction: 'DeepNorth',
    attacks: single([
      // Elaking_AttackClaw
      { dmg: dmg({ blunt: 40, slash: 100 }), name: 'claw', force: 30 },
      // Elaking_AttackJump
      { dmg: dmg({ blunt: 75, slash: 30, chop: 200, pickaxe: 100 }), name: 'jump', force: 40 }, // area
    ]),
    tolerate: TOLERATE.WATER,
    speed: { walk: 1.6, run: 6, swim: 1.5 },
    turnSpeed: { walk: 200, run: 200, swim: 100 },
    hp: 350,
    stagger: { factor: 0.3, time: 2.18 },
    damageModifiers: mods([0, 0, 0, 4, 4, 2, 1, 0, 0, 3]),
    drop: [
      dropEntry('ElakingHairBundle', { max: 2 }),
      dropTrophy('TrophyElaking', 0.1),
      dropEntry('MoldKeys', { chance: 0.2, scale: false }),
    ],
  },
  {
    type: 'creature',
    id: 'ElakingMole',
    iconId: 'resource/TrophyMole',
    ragdollId: 'ElakingMole_Ragdoll',
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI'],
    tier: 8,
    emoji: '',
    faction: 'DeepNorth',
    attacks: single([
      // ElakingMole_AttackSandcloud
      { dmg: dmg({ blunt: 60, slash: 40 }), name: 'sandcloud', force: 100, burst: 6 },
      // ElakingMole_AttackClaw
      { dmg: dmg({ blunt: 80, slash: 40, poison: 100 }), name: 'claw', force: 30 },
      // ElakingMole_AttackClaw2
      { dmg: dmg({ blunt: 80, slash: 40, poison: 100 }), name: 'claw2', force: 30 },
    ]),
    tolerate: TOLERATE.WATER,
    speed: { walk: 1.5, run: 2, swim: 1.5 },
    turnSpeed: { walk: 200, run: 200, swim: 100 },
    hp: 1400,
    stagger: { factor: 0.3, time: 2.18 },
    damageModifiers: mods([0, 0, 0, 4, 4, 0, 1, 0, 0, 3]),
    drop: [
      dropTrophy('TrophyMole', 0.1),
      dropEntry('MoleClaws', { max: 2 }),
      dropEntry('MoldKeys', { chance: 0.5, scale: false }),
    ],
  },
  {
    type: 'creature',
    id: 'JotunWarrior',
    iconId: 'resource/TrophyJotunWarrior',
    ragdollId: 'JotunWarrior_Ragdoll',
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI'],
    tier: 8,
    emoji: '',
    faction: 'DeepNorth',
    attacks: [
      {
        rate: 1,
        variety: 'Sword',
        attacks: [
          // JotunWarrior2HSword_attack_charge
          { dmg: dmg({ blunt: 160, pickaxe: 80, chop: 80 }), name: 'charge', force: 40 },
          // JotunWarrior2HSword_attack_cleave
          { dmg: dmg({ slash: 170, chop: 40 }), name: 'cleave', force: 40 },
          // JotunWarrior2HSword_attack_dodge
          { dmg: dmg({ slash: 150 }), name: 'dodge', force: 40 },
          // JotunWarrior2HSword_attack_slash
          { dmg: dmg({ slash: 160, chop: 30 }), name: 'slash', force: 40 },
        ],
      },
      {
        rate: 1,
        variety: 'Axe',
        attacks: [
          // JotunWarrior2HAxe_attack_charge
          { dmg: dmg({ blunt: 160, pickaxe: 80, chop: 80 }), name: 'charge', force: 40 },
          // JotunWarrior2HAxe_attack_cleave
          { dmg: dmg({ slash: 170, chop: 90 }), name: 'cleave', force: 40 },
          // JotunWarrior2HAxe_attack_dodge
          { dmg: dmg({ slash: 150, chop: 40 }), name: 'dodge', force: 40 },
          // JotunWarrior2HAxe_attack_slash
          { dmg: dmg({ slash: 160, chop: 80 }), name: 'slash', force: 40 },
        ],
      },
    ],
    tolerate: TOLERATE.WATER | TOLERATE.FIRE | TOLERATE.SMOKE,
    speed: { walk: 2, run: 4, swim: 0 },
    turnSpeed: { walk: 400, run: 300, swim: 0 },
    hp: 1200,
    stagger: { factor: 0.5, time: 3.02 },
    damageModifiers: mods([0, 0, 1, 4, 4, 0, 5, 0, 3, 4]),
    drop: [
      dropEntry('MoldArmormediumChest', { chance: 0.03 }),
      dropEntry('MoldArmorMediumHelmet', { chance: 0.03 }),
      dropEntry('MoldArmorMediumLegs', { chance: 0.03 }),
      dropEntry('MemorialCoal', { chance: 0.2 }),
      dropTrophy('TrophyJotunWarrior', 0.1),
      dropEntry('Leatherstraps', { max: 3 }),
    ],
  },
  {
    type: 'creature',
    id: 'JotunWarriorDualWield',
    iconId: 'resource/TrophyJotunWarrior',
    ragdollId: 'JotunWarrior_Ragdoll',
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI'],
    tier: 8,
    emoji: '',
    faction: 'DeepNorth',
    attacks: single([
      // JotunWarrior2HSword_attack_charge
      { dmg: dmg({ blunt: 160, pickaxe: 80, chop: 80 }), name: 'charge', force: 40 },
      // JotunWarrior2HSword_attack_cleave
      { dmg: dmg({ slash: 170, chop: 40 }), name: 'cleave', force: 40 },
      // JotunWarrior2HSword_attack_dodge
      { dmg: dmg({ slash: 150 }), name: 'dodge', force: 40 },
      // JotunWarrior2HSword_attack_slash
      { dmg: dmg({ slash: 160, chop: 30 }), name: 'slash', force: 40 },
    ]),
    tolerate: TOLERATE.WATER | TOLERATE.FIRE | TOLERATE.SMOKE,
    speed: { walk: 2, run: 4, swim: 0 },
    turnSpeed: { walk: 400, run: 300, swim: 0 },
    hp: 1200,
    stagger: { factor: 0.5, time: 3.02 },
    damageModifiers: mods([0, 0, 1, 4, 4, 0, 5, 0, 3, 4]),
    drop: [
      dropEntry('MoldArmorGoldChest', { chance: 0.03 }),
      dropEntry('MoldArmorGoldHelmet', { chance: 0.03 }),
      dropEntry('MoldArmorGoldLegs', { chance: 0.03 }),
      dropEntry('MemorialCoal', { chance: 0.2 }),
      dropTrophy('TrophyJotunWarrior', 0.1),
      dropEntry('Leatherstraps', { max: 3 }),
    ],
  },
  {
    type: 'creature',
    id: 'JotunWitch',
    iconId: 'resource/TrophyJotunWitch',
    ragdollId: 'JotunWarrior_Ragdoll',
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI'],
    tier: 8,
    emoji: '',
    faction: 'DeepNorth',
    attacks: single([
      // JotunWitch_attack_magicblast
      { dmg: dmg({ blunt: 30, chop: 30, lightning: 120 }), name: 'blast', force: 200 },
      // JotunWitch_attack_lightningbolt
      { dmg: dmg({ chop: 20, lightning: 110, spirit: 15 }), name: 'lightning', force: 80 },
    ]),
    tolerate: TOLERATE.WATER | TOLERATE.FIRE | TOLERATE.SMOKE,
    speed: { walk: 2, run: 4, swim: 0 },
    turnSpeed: { walk: 400, run: 300, swim: 0 },
    hp: 850,
    stagger: { factor: 0.5, time: 3.02 },
    damageModifiers: mods([0, 0, 0, 4, 4, 1, 5, 0, 3, 3]),
    drop: [
      dropEntry('NornThread', { max: 3 }),
      dropTrophy('TrophyJotunWitch', 0.1),
      dropTrophy('BloodGoldKey', 0.1),
      dropTrophy('MoldArmorMageChest', 0.03),
      dropTrophy('MoldArmorMageHelmet', 0.03),
      dropTrophy('MoldArmorMageLegs', 0.03),
    ],
  },
  {
    type: 'creature',
    id: 'TrollFrost',
    ragdollId: null,
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI'],
    tier: 8,
    emoji: '',
    faction: 'DeepNorth',
    attacks: single([
      // trollsnow_punch
      { dmg: dmg({ blunt: 220, chop: 100, pickaxe: 40 }), name: 'punch L', force: 100, toolTier: 6 },
      // trollsnow_groundslam
      { dmg: dmg({ blunt: 200, chop: 100, pickaxe: 40 }), name: 'slam L', force: 100, toolTier: 2 },
      // trollsnow_throw
      { dmg: dmg({ blunt: 150, chop: 100, pickaxe: 80 }), name: 'throw', force: 60, toolTier: 0 },
      // trollsnow_punch_r
      { dmg: dmg({ blunt: 220, chop: 100, pickaxe: 40 }), name: 'punch R', force: 100, toolTier: 6 },
      // trollsnow_groundslam_r
      { dmg: dmg({ blunt: 200, chop: 100, pickaxe: 40 }), name: 'slam R', force: 100, toolTier: 2 },
      // trollsnow_groundslam_aoe
      // { dmg: dmg({ blunt: 220, chop: 100, pickaxe: 100 }), name: 'slam aoe', force: 40, toolTier: 4, radius: 10 },
    ]),
    tolerate: TOLERATE.WATER | TOLERATE.FIRE | TOLERATE.SMOKE,
    speed: { walk: 2, run: 3, swim: 0 },
    turnSpeed: { walk: 30, run: 35, swim: 0 },
    hp: 3000,
    stagger: null,
    damageModifiers: mods([1, 1, 1, 4, 2, 0, 1, 0, 0, 3]),
    drop: [],
    spawnOnDeath: 'TrollFrost_Dead',
  },
  {
    type: 'creature',
    id: 'FallenWarrior',
    ragdollId: 'ElakingMole_Ragdoll',
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI'],
    tier: 8,
    emoji: '',
    faction: 'DeepNorth',
    attacks: [
      {
        rate: 1,
        variety: 'Bronze Armor Warrior',
        attacks: [{ dmg: dmg({ slash: 75, pierce: 45, chop: 40 }), name: 'FW_AxeBronze', force: 50, toolTier: 2 }],
      },
      {
        rate: 1,
        variety: 'Fenring Knifer',
        attacks: [{ dmg: dmg({ slash: 45, pierce: 45 }), name: 'FW_KnifeSkollAndHati' }],
      },
      {
        rate: 1,
        variety: 'Lightning Mage',
        attacks: [{ dmg: dmg({ blunt: 20, lightning: 20 }), name: 'FW_StaffLightning', force: 210 }],
      },
      {
        rate: 1,
        variety: 'Two-Handed Axe',
        attacks: [{ dmg: dmg({ slash: 130, chop: 50, spirit: 30 }), name: 'FW_BattleaxeCrystal', force: 70, toolTier: 3 }],
      },
      {
        rate: 1,
        variety: "Sword 'n Board",
        attacks: [{ dmg: dmg({ slash: 95 }), name: 'FW_SwordBlackmetal', force: 40 }],
      },
      {
        rate: 1,
        variety: 'Archer with Knife',
        attacks: [
          { dmg: dmg({ pierce: 70, poison: 5 }), name: 'FW_BowDraugrFang', force: 20 },
          { dmg: dmg({ slash: 65, pierce: 65 }), name: 'FW_KnifeSilver', force: 10 },
        ],
      },
      {
        rate: 1,
        variety: 'Fire Mage',
        attacks: [
          { dmg: dmg({ blunt: 120, fire: 120 }), name: 'FW_StaffFireball', force: 100 },
          { dmg: dmg({ slash: 65, pierce: 65 }), name: 'FW_KnifeSilver', force: 10 },
        ],
      },
    ],
    tolerate: TOLERATE.WATER,
    speed: { walk: 1, run: 7, swim: 1.5 },
    turnSpeed: { walk: 300, run: 300, swim: 100 },
    hp: 750,
    stagger: { factor: 0.4, time: 1.18 },
    damageModifiers: mods([1, 1, 1, 4, 4, 1, 0, 0, 3, 2]),
    drop: [
      dropEntry('OrbFrostFire', { chance: 0.2, scale: false }),
      dropEntry('OrbThunderBlood', { chance: 0.2, scale: false }),
    ],
  },
  {
    type: 'creature',
    group: 'blob',
    id: 'BlobMork',
    iconId: 'resource/TrophyBlob_Morkhalla',
    ragdollId: null,
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI'],
    tier: 8,
    emoji: '🦠',
    faction: 'DeepNorth',
    attacks: single([{ dmg: dmg({ blunt: 20, poison: 110 }), name: 'poison', unblockable, collider: areaCollider(4) }]),
    tolerate: TOLERATE.WATER | TOLERATE.SMOKE,
    speed: { walk: 1, run: 2, swim: 0 },
    turnSpeed: { walk: 100, run: 100, swim: 0 },
    hp: 150,
    stagger: null,
    damageModifiers: blobDamageModifiers,
    drop: [
      dropTrophy('TrophyBlob_Morkhalla', 0.1),
      dropEntry('BlobMorkMini', { min: 1, max: 2 }),
      dropTrophy('OozeMork', 0.5),
    ],
  },
  {
    type: 'creature',
    group: 'blob',
    id: 'BlobMorkMini',
    iconId: 'resource/TrophyBlob_Morkhalla',
    ragdollId: null,
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI'],
    tier: 8,
    emoji: '🦠',
    faction: 'DeepNorth',
    attacks: single([]),
    tolerate: TOLERATE.WATER | TOLERATE.SMOKE,
    speed: { walk: 1, run: 2, swim: 0 },
    turnSpeed: { walk: 100, run: 100, swim: 0 },
    hp: 50,
    stagger: null,
    damageModifiers: blobDamageModifiers,
    drop: [
      dropEntry('OozeMork', { chance: 0.25 }),
    ],
  },
  {
    type: 'creature',
    id: 'FrozenKing',
    iconId: 'resource/TrophyFrozenKing',
    ragdollId: null,
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI'],
    tier: 8,
    emoji: '🥶🤴',
    faction: 'Boss',
    attacks: single([
      // FrozenKing_ChainFlurry
      { dmg: dmg({ blunt: 250, chop: 200, pickaxe: 200 }), name: 'flurry', force: 100, toolTier: 3, aiMaxHp: 0.5 }, // interval: 3, range: [2, 12]
      // FrozenKing_ChainRush
      { dmg: dmg({ blunt: 125, pierce: 125, chop: 300, pickaxe: 300 }), name: 'rush', force: 100, toolTier: 3 }, // interval: 10, range: [1, 12]
      // FrozenKing_ChainSlam_L
      { dmg: dmg({ blunt: 160, chop: 300, pickaxe: 300 }), name: 'slam L', force: 100, toolTier: 3, aiMinHp: 0.5 }, // interval: 10, range: [0, 12]
      // FrozenKing_ChainSlam_L_double
      { dmg: dmg({ blunt: 160, chop: 300, pickaxe: 300 }), name: 'slam LL', force: 100, toolTier: 3, aiMaxHp: 0.75 }, // interval: 10, range: [1, 12]
      // FrozenKing_ChainSlam_R
      { dmg: dmg({ blunt: 160, chop: 300, pickaxe: 300 }), name: 'slam L', force: 100, toolTier: 3, aiMinHp: 0.5 }, // interval: 3, range: [0, 12]
      // FrozenKing_ChainSlam_R_double
      { dmg: dmg({ blunt: 160, chop: 300, pickaxe: 300 }), name: 'slam RR', force: 100, toolTier: 3, aiMaxHp: 0.5 }, // interval: 3, range: [1, 12]
      // FrozenKing_ChainSweep_L
      { dmg: dmg({ pierce: 180, chop: 300, pickaxe: 300 }), name: 'sweep L', force: 100, toolTier: 3, aiMinHp: 0.5 }, // interval: 8, range: [10, 20]
      // FrozenKing_ChainSweep_R
      { dmg: dmg({ pierce: 180, chop: 300, pickaxe: 300 }), name: 'sweep R', force: 100, toolTier: 3, aiMinHp: 0.5 }, // interval: 7, range: [10, 20]
      // FrozenKing_ChainWhirl
      { dmg: dmg({ blunt: 150, chop: 300, pickaxe: 300, frost: 20 }), name: 'whirl', force: 100, toolTier: 3 }, // interval: 10, range: [0, 8]
      // FrozenKing_DoubleSweep
      { dmg: dmg({ blunt: 160, chop: 300, pickaxe: 300 }), name: 'sweep2', force: 130, toolTier: 3 }, // interval: 3, range: [2, 12]
    ]),
    tolerate: TOLERATE.WATER | TOLERATE.FIRE | TOLERATE.SMOKE | TOLERATE.TAR,
    speed: { walk: 5, run: 8, swim: 0 },
    turnSpeed: { walk: 150, run: 120, swim: 0 },
    hp: 10000,
    stagger: null,
    damageModifiers: mods([0, 0, 1, 4, 4, 1, 1, 1, 0, 3]),
    drop: [
      // FrozenKing_P2_Projectile_Eikthyr ->
      // FrozenKing_P2_Spawn_Eikthyr ->
      // Aspect_Eikthyr
      dropEntry('Aspect_Eikthyr'),
      dropEntry('FrozenKing_p3'),
    ],
  },
  {
    type: 'creature',
    id: 'Aspect_Eikthyr',
    iconId: 'resource/TrophyEikthyr',
    ragdollId: null,
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI'],
    tier: 8,
    emoji: '🦌',
    faction: 'Boss',
    attacks: single([
      // aspect_Eikthyr_antler
      { dmg: dmg({ pierce: 150, chop: 1000, pickaxe: 1000 }), name: 'antlers', force: 100 },
      // aspect_Eikthyr_charge
      { dmg: dmg({ lightning: 150 }), name: 'charge', force: 200 },
      // aspect_Eikthyr_stomp
      { dmg: dmg({ lightning: 150 }), name: 'stomp', force: 100, collider: areaCollider(10) },
    ]),
    tolerate: TOLERATE.WATER | TOLERATE.SMOKE,
    speed: { walk: 2, run: 8, swim: 4 },
    turnSpeed: { walk: 100, run: 100, swim: 50 },
    hp: 1500,
    stagger: null,
    damageModifiers: defaultDmgModifiers,
    drop: [
      dropEntry('Aspect_Elder'),
      dropEntry('Aspect_Bonemass'),
    ],
  },
  {
    type: 'creature',
    id: 'Aspect_Elder',
    iconId: 'resource/TrophyTheElder',
    ragdollId: null,
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI'],
    tier: 8,
    emoji: '🥦',
    faction: 'Boss',
    attacks: single([
      // SCREAM
      { spawn: ['Aspect_TentaRoot'], number: [15, 15], max: 30 },
      { dmg: dmg({ pierce: 80, chop: 20, pickaxe: 20 }), name: 'Vine Shoot', burst: 25, toolTier: 0 },
      { dmg: dmg({ blunt: 150, chop: 1000, pickaxe: 1000 }), name: 'Stomp', force: 30, toolTier: 0, collider: areaCollider(5) },
    ]),
    tolerate: TOLERATE.WATER | TOLERATE.SMOKE,
    speed: { walk: 3, run: 6, swim: 0 },
    turnSpeed: { walk: 100, run: 200, swim: 0 },
    hp: 1600,
    stagger: null,
    damageModifiers: {
      ...defaultDmgModifiers,
      fire: 'veryWeak',
      poison: 'immune',
      spirit: 'immune',
    },
    drop: [
      dropEntry('Aspect_Moder'),
    ],
  },
  {
    type: 'creature',
    id: 'Aspect_TentaRoot',
    iconId: 'creature/TentaRoot',
    ragdollId: null,
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI'],
    tier: 8,
    emoji: '🥦',
    faction: 'Boss',
    attacks: single([
      { dmg: dmg({ blunt: 55, chop: 20, pickaxe: 20 }), name: 'poke', force: 40, toolTier: 0 }
    ]),
    tolerate: TOLERATE.WATER | TOLERATE.SMOKE,
    speed: { walk: 0, run: 0, swim: 0 },
    turnSpeed: { walk: 200, run: 200, swim: 200 },
    hp: 20,
    stagger: null,
    damageModifiers: {
      ...defaultDmgModifiers,
      fire: 'weak',
      frost: 'resistant',
      poison: 'immune',
    },
    drop: [],
    timedDestruction: [18, 20],
  },
  {
    type: 'creature',
    id: 'Aspect_Bonemass',
    iconId: 'resource/TrophyBonemass',
    ragdollId: null,
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI', 'VisEquipment'],
    tier: 8,
    emoji: '🦠',
    faction: 'Boss',
    attacks: single([
      { dmg: dmg({ poison: 200 }), name: 'poison', force: 0, unblockable, undodgeable },
      { dmg: dmg({ blunt: 100, chop: 1000, pickaxe: 1000, poison: 70 }), name: 'punch', force: 100 },
      { spawn: ['Skeleton_aspect', 'BlobAspect'], number: [4, 4], max: 8 }
    ]),
    tolerate: TOLERATE.WATER | TOLERATE.SMOKE,
    speed: { walk: 2, run: 4, swim: 2 },
    turnSpeed: { walk: 50, run: 100, swim: 50 },
    hp: 1600,
    stagger: null,
    damageModifiers: {
      ...defaultDmgModifiers,
      blunt: 'weak',
      slash: 'resistant',
      pierce: 'veryResistant',
      fire: 'veryResistant',
      frost: 'weak',
      poison: 'immune',
    },
    drop: [
      dropEntry('Aspect_Yagluth'),
    ],
  },
  {
    type: 'creature',
    id: 'Aspect_Moder',
    iconId: 'resource/TrophyDragonQueen',
    ragdollId: null,
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI'],
    tags: ['fly'],
    tier: 8,
    emoji: '🐲',
    faction: 'Boss',
    attacks: single([
      // taunt,
      { dmg: dmg({ pierce: 150, chop: 1000, pickaxe: 1000 }), name: 'bite', force: 50, toolTier: 3 }, // R8
      { dmg: dmg({ slash: 160, chop: 1000, pickaxe: 1000 }), name: 'claw', force: 120, toolTier: 3 }, // R4 two: left & right
      { dmg: dmg({ pierce: 30, chop: 200, pickaxe: 200, frost: 200 }), burst: 16, name: 'ice shards', force: 30, toolTier: 3 }, // velocity=2/25 burstInterval=0.05, spread=20/13
      { dmg: dmg({ chop: 200, pickaxe: 200, frost: 180 }), name: 'breath', force: 40, toolTier: 3 },
    ]),
    tolerate: TOLERATE.WATER,
    speed: { walk: 4, run: 20, swim: 0 },
    turnSpeed: { walk: 80, run: 60, swim: 0 },
    hp: 1500,
    stagger: null,
    damageModifiers: {
      ...animalDmgModifiers,
      fire: 'weak',
      frost: 'immune',
    },
    drop: [
      dropEntry('Aspect_SeekerQueen'),
    ],
  },
  {
    type: 'creature',
    id: 'Aspect_Yagluth',
    iconId: 'resource/TrophyGoblinKing',
    ragdollId: null,
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI'],
    tier: 8,
    emoji: '🦴',
    faction: 'Boss',
    attacks: single([
      { dmg: dmg({ chop: 50, pickaxe: 50, fire: 40, lightning: 20, }),
        name: 'fire Breath' }, // aka beam burst: 20*0.1 V=30/40 spread=1/1
      { dmg: dmg({ chop: 100, pickaxe: 100, fire: 75, lightning: 90 }),
        name: 'nova', force: 100, toolTier: 2, collider: areaCollider(8) }, // range: [0, 10], interval: 20
      // Taunt // interval 60
    ]),
    tolerate: TOLERATE.WATER,
    speed: { walk: 2, run: 4, swim: 1.5 },
    turnSpeed: { walk: 50, run: 50, swim: 50 },
    hp: 1700,
    stagger: null,
    damageModifiers: {
      ...defaultDmgModifiers,
      pierce: 'veryResistant',
      fire: 'resistant',
      poison: 'immune',
    },
    drop: [
      dropEntry('Aspect_Fader'),
    ],
  },
  {
    type: 'creature',
    id: 'Aspect_SeekerQueen',
    iconId: 'resource/TrophySeekerQueen',
    ragdollId: null,
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI'],
    tags: ['insect'],
    tier: 8,
    emoji: '🐜👑',
    faction: 'Boss',
    attacks: single([
      // aspect_SeekerQueen_Rush
      { dmg: dmg({ slash: 100, chop: 300, pickaxe: 300 }), name: 'rush', force: 250, toolTier: 3, aiMaxHp: 0.6 },
      // aspect_SeekerQueen_Bite
      { dmg: dmg({ pierce: 100, chop: 300, pickaxe: 300, poison: 100 }), name: 'bite', force: 250, toolTier: 3, aiMaxHp: 0.7 },
      // aspect_SeekerQueen_Spit does a burst of 20x, aiHp: [0, 0.9]
      // aspect_SeekerQueen_projectile_spit, each has 30% spawn on hit
      // aspect_SeekerQueen_SpitSpawnAbility, which spawn 1 SeekerBrood
      { spawn: ['SeekerBrood'], number: [4, 8], max: 30, name: 'spit', aiMaxHp: 0.9 }, // 20 with p=0.3
      { dmg: dmg({ slash: 130, chop: 300, pickaxe: 300 }), name: 'slap', force: 250, toolTier: 3 },
      // aspect_SeekerQueen_PierceAOE
      { dmg: dmg({ pierce: 150, chop: 300, pickaxe: 300 }), name: 'pirce_aoe', force: 250, toolTier: 3, collider: areaCollider(4.5) },
    ]),
    tolerate: TOLERATE.WATER,
    speed: { walk: 4, run: 8, swim: 4 },
    turnSpeed: { walk: 50, run: 120, swim: 60 },
    hp: 1700,
    stagger: null,
    damageModifiers: {
      blunt: 'normal',
      slash: 'normal',
      pierce: 'resistant',
      chop: 'ignore',
      pickaxe: 'ignore',
      fire: 'normal',
      frost: 'normal',
      lightning: 'normal',
      poison: 'normal',
      spirit: 'immune',
    },
    drop: [],
  },
  {
    type: 'creature',
    id: 'Aspect_Fader',
    iconId: 'resource/TrophyFader',
    ragdollId: null,
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI'],
    tags: ['dragon'],
    tier: 8,
    emoji: '🐉',
    faction: 'Boss',
    attacks: single([
      // aspect_Fader_Fissure
      { dmg: dmg({ chop: 40, pickaxe: 40, fire: 80, spirit: 40 }), name: 'fissure', aiMaxHp: 0.85, collider: areaCollider(11) }, // interval: 30, range: [0, 40]
      // aspect_Fader_Bite
      { dmg: dmg({ pierce: 180, chop: 300, pickaxe: 300 }), name: 'bite', force: 100, toolTier: 3 }, // interval: 3, range: [0, 9]
      // aspect_Fader_Claw_Left
      { dmg: dmg({ pierce: 170, chop: 300, pickaxe: 300 }), name: 'claw L', force: 100, toolTier: 3 }, // interval: 3, range: [0, 9]
      // aspect_Fader_Claw_Right
      { dmg: dmg({ pierce: 170, chop: 300, pickaxe: 300 }), name: 'claw R', force: 100, toolTier: 3 }, // interval: 3, range: [0, 9]
      // aspect_Fader_Spin
      { dmg: dmg({ pierce: 140, chop: 300, pickaxe: 300 }), name: 'spin', force: 130, toolTier: 3, collider: areaCollider(8.5) }, // interval: 20, range: [0, 8]
      // aspect_Fader_Flamebreath
      { dmg: dmg({ chop: 40, pickaxe: 40, fire: 60 }), name: 'flamebreath', aiMaxHp: 0.85 }, // interval: 25, range: [2, 20]
      // aspect_Fader_WallOfFire
      { dmg: dmg({ chop: 30, pickaxe: 30, fire: 80, spirit: 80 }), name: 'wall of fire', force: 50, toolTier: 3, aiMaxHp: 0.9 }, // interval: 60, range: [0, 40]
    ]),
    tolerate: TOLERATE.WATER | TOLERATE.FIRE,
    speed: { walk: 12, run: 12, swim: 0 },
    turnSpeed: { walk: 120, run: 250, swim: 0 },
    hp: 1700,
    stagger: null,
    damageModifiers: mods([0, 0, 1, 4, 4, 3, 0, 0, 0, 3]),
    drop: [],
  },
  {
    type: 'creature',
    id: 'FrozenKing_p3',
    iconId: 'resource/TrophyFrozenKing',
    ragdollId: null,
    components: ['BaseAI', 'Character', 'Humanoid', 'MonsterAI'],
    tier: 8,
    emoji: '🥶🤴',
    faction: 'Boss',
    attacks: single([
      // FrozenKing_P3_ChainSlam_R_double
      { dmg: dmg({ blunt: 120, chop: 300, pickaxe: 300, fire: 50, frost: 50 }), name: 'slam RR', force: 100, toolTier: 3 }, // interval: 3, range: [1, 12]
      // FrozenKing_P3_ChainSlam_L_double
      { dmg: dmg({ blunt: 120, chop: 300, pickaxe: 300, fire: 50, frost: 50 }), name: 'slam RR', force: 100, toolTier: 3 }, // interval: 3, range: [1, 12]
      // FrozenKing_Punch_AOE
      { dmg: dmg({ blunt: 150, chop: 300, pickaxe: 300 }), name: 'punch', force: 130, toolTier: 3, aiMinHp: 0.75 }, // interval: 8, range: [0, 8], radius: 8.5
      // FrozenKing_ChainFlurry
      { dmg: dmg({ blunt: 250, chop: 200, pickaxe: 200 }), name: 'flurry', force: 100, toolTier: 3, aiMaxHp: 0.5 }, // interval: 3, range: [2, 12]
      // FrozenKing_DoubleSweep
      { dmg: dmg({ blunt: 160, chop: 300, pickaxe: 300 }), name: 'sweep2', force: 130, toolTier: 3 }, // interval: 3, range: [2, 12]
      // FrozenKing_SpikeRain -> spawn_frozenking_spikerain -> projectile_spikes_frozenking
      { dmg: dmg({ blunt: 100, chop: 100, pickaxe: 100, frost: 100 }), name: 'spike rain', force: 100, toolTier: 3, burst: 22, aiMaxHp: 0.35 }, // interval: 25, range: [0, 20]
      // FrozenKing_tendrilspawn -> spawn_tendril -> Tendril
      { spawn: ['Tendril'], number: [9, 9], max: 30, name: 'tendril' }, // interval: 45, range: [0, 30]
      // FrozenKing_P3_ChainWhirl
      { dmg: dmg({ blunt: 120, chop: 300, pickaxe: 300, fire: 50, frost: 50 }), name: 'whirl', force: 250, toolTier: 3, aiMinHp: 0.75 }, // interval: 20, range: [0, 8]
    ]),
    tolerate: TOLERATE.WATER | TOLERATE.FIRE | TOLERATE.SMOKE | TOLERATE.TAR,
    speed: { walk: 5, run: 8, swim: 0 },
    turnSpeed: { walk: 150, run: 120, swim: 0 },
    hp: 20000,
    stagger: null,
    damageModifiers: mods([0, 0, 1, 4, 4, 1, 1, 1, 0, 3]),
    drop: [
      dropEntry('FrozenKingDrop'),
      dropEntry('CrownJewel'),
    ],
  },
];
