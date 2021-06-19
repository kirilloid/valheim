import { AttackProfile, AttackVariety, Creature, DamageModifiers, dropEntry, dropTrophy, Faction } from "../types";

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

const blobDamageModifiers: DamageModifiers = {
  ...defaultDmgModifiers,
  blunt: 'weak',
  slash: 'resistant',
  pierce: 'resistant',
  fire: 'resistant',
  frost: 'weak',
  lightning: 'weak',
  poison: 'immune',
};

const skeletonDamageModifiers: DamageModifiers = {
  ...defaultDmgModifiers,
  blunt: 'weak',
  pierce: 'resistant',
  fire: 'weak',
  frost: 'resistant',
  poison: 'immune',
};

const nightOnly = true;
const unblockable = true;
const undodgeable = true;

const single = (attacks: AttackProfile[]): [AttackVariety] => {
  return [{ variety: '', attacks }]; 
};

export const creatures: Creature[] = [
// MEADOWS
  {
    type: 'creature',
    id: 'Deer',
    tier: 1,
    maxLvl: 3,
    emoji: '🦌',
    faction: 'ForestMonsters',
    locations: ['Meadows', 'BlackForest'],
    attacks: [],
    hp: 10,
    staggerFactor: 0,
    staggerBlocked: false,
    damageModifiers: animalDmgModifiers,
    drop: [
      dropEntry('RawMeat', { min: 2, max: 2 }),
      dropEntry('DeerHide',	{ max: 3 }),
      dropTrophy('TrophyDeer', 0.5),
    ],
  },
  {
    type: 'creature',
    id: 'Seagal',
    tier: 1,
    maxLvl: 1,
    emoji: '🦆',
    faction: 'ForestMonsters',
    locations: ['Meadows', 'BlackForest', 'Plains', 'Ocean'],
    attacks: [],
    hp: 1,
    staggerFactor: 0,
    staggerBlocked: false,
    damageModifiers: animalDmgModifiers,
    drop: [
      dropEntry('Feathers', { min: 3, max: 3 }),
    ],
  },
  {
    type: 'creature',
    id: 'Greyling',
    tier: 1,
    maxLvl: 1,
    emoji: '🐀',
    faction: 'ForestMonsters',
    locations: ['Meadows'],
    attacks: single([{ dmg: { slash: 5 }, name: 'bite' }]),
    hp: 20,
    staggerFactor: 0.3,
    staggerBlocked: true,
    damageModifiers: grayModifiers,
    drop: [
      dropEntry('Resin'),
    ],
  },
  {
    type: 'creature',
    id: 'Neck',
    tier: 1,
    maxLvl: 3,
    upgradeDistance: 800,
    emoji: '🦎',
    faction: 'ForestMonsters',
    locations: ['Meadows'],
    attacks: single([{ dmg: { slash: 6 }, name: 'bite' }]),
    hp: 5,
    staggerFactor: 0.5,
    staggerBlocked: true,
    damageModifiers: animalDmgModifiers,
    drop: [
      dropEntry('NeckTail', { chance: 0.75 }),
      dropTrophy('TrophyNeck', 0.05),
    ],
  },
  {
    type: 'creature',
    id: 'Fish',
    tier: 1,
    maxLvl: 1,
    emoji: '🐟',
    faction: 'ForestMonsters',
    locations: ['Meadows', 'BlackForest', 'Plains', 'Ocean'],
    attacks: [],
    hp: 1,
    staggerFactor: 0,
    staggerBlocked: true,
    damageModifiers: animalDmgModifiers,
    drop: [dropEntry('FishRaw')],
  },
  {
    type: 'creature',
    id: 'Boar',
    tier: 1,
    maxLvl: 3,
    upgradeDistance: 800,
    emoji: '🐗',
    faction: 'ForestMonsters',
    locations: ['Meadows'],
    attacks: single([{ dmg: { blunt: 10 }, name: 'tusks' }]),
    hp: 10,
    staggerFactor: 0.5,
    staggerBlocked: true,
    damageModifiers: animalDmgModifiers,
    drop: [
      dropEntry('RawMeat', { chance: 0.5 }),
      dropEntry('LeatherScraps'),
      dropTrophy('TrophyBoar', 0.15),
    ],
    tame: { tameTime: 1800, fedTime: 600, commandable: true,
            eats: ['Carrot', 'Turnip', 'Blueberries', 'Mushroom', 'Raspberry'] },
            // eatRange:1.0, searchRange:10, heal:5
    pregnancy: { time: 60, chance: 0.33 },
  },
  {
    type: 'creature',
    id: 'Eikthyr',
    tier: 1,
    maxLvl: 1,
    emoji: '🦌',
    faction: 'Boss',
    locations: ['Eikthyrnir'],
    staggerFactor: 0,
    staggerBlocked: true,
    attacks: single([
      { dmg: { pierce: 20, chop: 1000, pickaxe: 1000 }, name: 'antlers', force: 100 },
      { dmg: { lightning: 15 }, name: 'pew-pew', force: 200 },
      { dmg: { lightning: 20 }, name: 'stomp', force: 100 },
    ]),
    hp: 500,
    damageModifiers: animalDmgModifiers,
    drop: [
      dropEntry('HardAntler', { min: 3, max: 3 }),
      dropTrophy('TrophyEikthyr', 1),
    ],
  },
// FOREST
  {
    type: 'creature',
    id: 'Crow',
    tier: 2,
    maxLvl: 1,
    emoji: '🐦',
    faction: 'ForestMonsters',
    locations: ['BlackForest'],
    attacks: [],
    hp: 1,
    staggerFactor: 0,
    staggerBlocked: false,
    damageModifiers: animalDmgModifiers,
    drop: [
      dropEntry('Feathers', { min: 3, max: 3 }),
    ],
  },
  {
    type: 'creature',
    id: 'Skeleton',
    tier: 2,
    maxLvl: 3,
    emoji: '💀',
    faction: 'Undead',
    locations: ['Crypt', 'StoneTowerRuinsBF', 'StoneTowerRuinsM', 'Swamp'],
    attacks: [
      { variety: 'sword', attacks: [{ dmg: { slash: 25 }, name: 'sword' }] },
      { variety: 'mace', attacks: [{ dmg: { blunt: 25 }, name: 'mace' }] },
      { variety: 'bow', attacks: [{ dmg: { pierce: 20 }, name: 'bow' }] },
    ],
    hp: 40,
    staggerFactor: 0.5,
    staggerBlocked: true,
    damageModifiers: skeletonDamageModifiers,
    drop: [
      dropEntry('BoneFragments'),
      dropTrophy('TrophySkeleton', 0.1),
    ],
  },
  {
    type: 'creature',
    id: 'Skeleton_Poison', // Rancid Remains
    tier: 2,
    maxLvl: 3,
    emoji: '☠️',
    faction: 'Undead',
    locations: ['Crypt'],
    attacks: single([{
      dmg: { blunt: 20,
             poison: 20 },
      name: 'mace',
    }]),
    hp: 100,
    staggerFactor: 0.5,
    staggerBlocked: true,
    damageModifiers: skeletonDamageModifiers,
    drop: [
      dropEntry('BoneFragments', { min: 3, max: 3 }),
      dropTrophy('TrophySkeletonPoison', 0.1),
    ],
  },
  {
    type: 'creature',
    id: 'Ghost',
    tier: 2,
    maxLvl: 1,
    emoji: '👻',
    faction: 'Undead',
    locations: ['Crypt'],
    attacks: single([ { dmg: { slash: 25 }, name: 'slash' } ]),
    hp: 60,
    staggerFactor: 0.5,
    staggerBlocked: true,
    damageModifiers: {
      ...defaultDmgModifiers,
      blunt: 'resistant',
      slash: 'resistant',
      pierce: 'resistant',
      poison: 'immune',
      spirit: 'weak',
    },
    drop: [],
  },
  {
    type: 'creature',
    id: 'Greydwarf',
    tier: 2,
    maxLvl: 3,
    emoji: '',
    faction: 'ForestMonsters',
    locations: ['BlackForest', 'StoneTowerRuinsBF', 'Greydwarf_camp'],
    attacks: single([
      { dmg: { slash: 14 }, name: 'hit' },
      { dmg: { blunt: 10 }, name: 'stone' },
    ]),
    hp: 40,
    staggerFactor: 0.3,
    staggerBlocked: true,
    damageModifiers: grayModifiers,
    drop: [
      dropEntry('GreydwarfEye', { chance: 0.5 }),
      dropEntry('Stone'),
      dropEntry('Wood'),
      dropEntry('Resin'),
      dropTrophy('TrophyGreydwarf', 0.05),
    ],
  },
  {
    type: 'creature',
    id: 'GreydwarfShaman',
    tier: 2,
    maxLvl: 3,
    nightOnly,
    emoji: '',
    faction: 'ForestMonsters',
    locations: ['BlackForest', 'StoneTowerRuinsBF', 'Greydwarf_camp'],
    attacks: single([
      { dmg: { poison: 25 }, name: 'poison breath' },
      { dmg: { slash: 14 }, name: 'slash' },
    ]),
    hp: 60,
    staggerFactor: 0.33,
    staggerBlocked: true,
    // heals for 2.5hp/s for 4s in 4.3m radius
    damageModifiers: grayModifiers,
    drop: [
      dropEntry('GreydwarfEye', { chance: 0.5 }),
      dropEntry('Wood'),
      dropEntry('Resin', { max: 2 }),
      dropTrophy('TrophyGreydwarfShaman', 0.1),
    ],
  },
  {
    type: 'creature',
    id: 'Greydwarf_Elite',
    tier: 2,
    maxLvl: 3,
    upgradeDistance: 2000,
    emoji: '',
    faction: 'ForestMonsters',
    locations: ['BlackForest', 'StoneTowerRuinsBF', 'Greydwarf_camp'],
    attacks: single([
      { dmg: { slash: 30 }, name: 'bite' },
    ]),
    hp: 150,
    staggerFactor: 0.5,
    staggerBlocked: true,
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
  {
    type: 'creature',
    id: 'Troll',
    tier: 2,
    maxLvl: 3,
    upgradeDistance: 2000,
    emoji: '',
    faction: 'ForestMonsters',
    locations: ['BlackForest', 'TrollCave'],
    attacks: [
      {
        variety: 'unarmed',
        attacks: [
          { dmg: { blunt: 60, chop: 100, pickaxe: 40 }, name: '1-hand hit', force: 100 },
          { dmg: { blunt: 70, chop: 100, pickaxe: 40 }, name: '2-hand smash', force: 100 },
          { dmg: { blunt: 50, chop: 60, pickaxe: 40 }, name: 'throw' },
        ],
      }, {
        variety: 'log',
        attacks: [
          { dmg: { blunt: 60, chop: 100, pickaxe: 40 }, name: 'h-swing', force: 80 },
          { dmg: { blunt: 70, chop: 100, pickaxe: 40 }, name: 'v-swing', force: 80 },
        ],
      },
    ],
    hp: 600,
    staggerFactor: 0.3,
    staggerBlocked: true,
    damageModifiers: {
      ...animalDmgModifiers,
      blunt: 'resistant',
      pierce: 'weak',
      poison: 'immune',
    },
    drop: [
      dropEntry('TrollHide', { min: 5, max: 5 }),
      dropEntry('Coins', { min: 20, max: 30 }),
      dropTrophy('TrophyFrostTroll', 0.5),
    ],
  },
  {
    type: 'creature',
    id: 'gd_king', // the elder
    tier: 2,
    maxLvl: 1,
    emoji: '🥦',
    faction: 'Boss',
    locations: ['GDKing'],
    attacks: single([
      // used? { dmg: { blunt: 50 }, name: 'Punch', force: 30 }, 
      { dmg: { pierce: 35, chop: 20, pickaxe: 20 }, name: 'Vine Shoot', force: 40 },
      { dmg: { blunt: 60, chop: 1000, pickaxe: 1000 }, name: 'Stomp', force: 30 },
      { spawn: ['Root'], number: 15, max: 30 },
      // number: 15, max: 30, staggerFactor: 0, staggerBlocked: true,
      // hp: 20, weak to fire,
    ]),
    hp: 2500,
    staggerFactor: 0,
    staggerBlocked: false,
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
    disabled: true,
    id: 'Root', // the elder
    tier: 2,
    maxLvl: 1,
    emoji: '🥦',
    faction: 'Boss',
    locations: ['GDKing'],
    attacks: single([
      { dmg: { blunt: 55, chop: 20, pickaxe: 20, }, name: 'poke', force: 40 }
    ]),
    hp: 20,
    staggerFactor: 0,
    staggerBlocked: true,
    damageModifiers: {
      ...defaultDmgModifiers,
      fire: 'weak',
      frost: 'resistant',
      poison: 'immune',
    },
    drop: [],
  },
// SWAMP
  {
    type: 'creature',
    id: 'Blob',
    tier: 3,
    maxLvl: 1,
    emoji: '🦠',
    faction: 'Undead',
    locations: ['Swamp', 'SunkenCrypt'],
    attacks: single([{ dmg: { poison: 70 }, name: 'poison', unblockable }]),
    hp: 50,
    staggerFactor: 0,
    staggerBlocked: true,
    damageModifiers: blobDamageModifiers,
    drop: [
      dropEntry('Ooze', { min: 1, max: 2 }),
      dropTrophy('TrophyBlob', 0.1),
    ],
  },
  {
    type: 'creature',
    id: 'BlobElite',
    tier: 3,
    maxLvl: 1,
    nightOnly,
    emoji: '🦠',
    faction: 'Undead',
    locations: ['Swamp'],
    attacks: single([{ dmg: { poison: 90 }, name: 'poison', unblockable }]),
    hp: 150,
    staggerFactor: 0,
    staggerBlocked: true,
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
    tier: 3,
    maxLvl: 3,
    emoji: '🧛',
    faction: 'Undead',
    locations: ['Swamp'],
    attacks: single([{ dmg: {
      pierce: 20,
      poison: 60,
    }, name: 'bite', force: 30 }]),
    hp: 60,
    staggerFactor: 0,
    staggerBlocked: false,
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
    tier: 3,
    maxLvl: 3,
    emoji: '🧨',
    faction: 'Demon',
    locations: ['FireHole', 'Ashlands', 'Meteorite'],
    attacks: single([{ dmg: {
      blunt: 10,
      fire: 40,
    }, name: 'fireball', force: 30 }]),
    hp: 20,
    staggerFactor: 0.5,
    staggerBlocked: true,
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
    tier: 3,
    maxLvl: 1,
    nightOnly,
    emoji: '👻',
    faction: 'Undead',
    locations: ['Swamp', 'SwampHut'],
    attacks: single([{ dmg: { slash: 60, }, name: 'slash', force: 60 }]),
    hp: 100,
    staggerFactor: 0.5,
    staggerBlocked: true,
    damageModifiers: {
      ...defaultDmgModifiers,
      blunt: 'resistant',
      slash: 'resistant',
      pierce: 'resistant',
      fire: 'weak',
      frost: 'immune',
      poison: 'immune',
      spirit: 'weak',
    },
    drop: [
      dropEntry('Chain'),
      dropTrophy('TrophyWraith', 0.05),
    ],
  },
  {
    type: 'creature',
    id: 'Draugr',
    tier: 3,
    maxLvl: 3,
    emoji: '🧟',
    faction: 'Undead',
    locations: ['Swamp', 'SwampRuin', 'SunkenCrypt', 'StoneTowerRuinsM'],
    attacks: [
      { variety: 'axe',
        attacks: [{ dmg: { slash: 48, chop: 15 }, name: 'axe', force: 60 }],
      },
      { variety: 'bow',
        attacks: [{ dmg: { pierce: 48 }, name: 'bow', force: 18 }],
      },
    ],
    hp: 100,
    staggerFactor: 0.5,
    staggerBlocked: true,
    damageModifiers: {
      ...animalDmgModifiers,
      fire: 'weak',
      poison: 'immune',
    },
    drop: [
      dropEntry('Entrails'),
      dropTrophy('TrophyDraugr', 0.1),
    ],
  },
  {
    type: 'creature',
    id: 'DraugrElite',
    tier: 3,
    maxLvl: 1,
    nightOnly,
    emoji: '🧟',
    faction: 'Undead',
    locations: ['Swamp', 'SwampRuin', 'SunkenCrypt'],
    attacks: single([ { dmg: { slash: 58, }, name: 'sword', force: 60 } ]),
    hp: 200,
    staggerFactor: 0.5,
    staggerBlocked: true,
    damageModifiers: {
      ...animalDmgModifiers,
      fire: 'weak',
      poison: 'immune',
    },
    drop: [
      dropEntry('Entrails', { min: 2, max: 3 }),
      dropTrophy('TrophyDraugrElite', 0.1),  
    ],
  },
  {
    type: 'creature',
    id: 'Bonemass',
    tier: 3,
    maxLvl: 1,
    emoji: '🦠',
    faction: 'Boss',
    locations: ['Bonemass'],
    attacks: single([
      { dmg: { poison: 100 }, name: 'poison', force: 0, unblockable, undodgeable },
      { dmg: { blunt: 80, // punch
        chop: 1000,
        pickaxe: 1000,
        poison: 30,
      }, name: 'hit', force: 0 },
      { spawn: ['Skeleton', 'Blob'], number: 4, max: 8, }
    ]),
    hp: 5000,
    staggerFactor: 0,
    staggerBlocked: false,
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
    id: 'Wolf',
    tier: 4,
    maxLvl: 3,
    emoji: '🐺',
    faction: 'MountainMonsters',
    locations: ['Mountain'],
    attacks: single([
      { dmg: { slash: 70 }, name: 'bite', force: 30 }, // 3 different animations, same stats
    ]),
    hp: 80,
    damageModifiers: animalDmgModifiers,
    staggerFactor: 0.5,
    staggerBlocked: true,
    drop: [
      dropEntry('WolfFang', { chance: 0.4 }),
      dropEntry('RawMeat', { chance: 0.4 }),
      dropEntry('WolfPelt', { max: 2 }),
      dropTrophy('TrophyWolf', 0.1),
    ],
    tame: { tameTime: 1800, fedTime: 600, commandable: true,
            eats: ['NeckTail', 'RawMeat', 'LoxMeat', 'Sausages', 'FishRaw'] },
            // eatRange:1.4, searchRange:10, heal:20
    pregnancy: { time: 60, chance: 0.33 }, // max: 4, range: 3
  },
  {
    type: 'creature',
    id: 'Fenring',
    tier: 4,
    maxLvl: 1,
    nightOnly,
    emoji: '🐺',
    faction: 'MountainMonsters',
    locations: ['Mountain'],
    attacks: single([
      { dmg: { slash: 85 }, name: 'hit', force: 60 },
      { dmg: { slash: 95 }, name: 'jump', force: 100 },
    ]),
    hp: 150,
    staggerFactor: 0.5,
    staggerBlocked: true,
    damageModifiers: animalDmgModifiers,
    drop: [
      dropEntry('WolfFang'),
      dropTrophy('TrophyFenring', 0.1),
    ],
  },
  {
    type: 'creature',
    id: 'StoneGolem',
    tier: 4,
    maxLvl: 1,
    emoji: '🗿',
    faction: 'ForestMonsters',
    locations: ['Mountain'],
    attacks: [
      { variety: 'spike',
        attacks: [
          { dmg: {
            blunt: 110,
            chop: 100,
            pickaxe: 100,
          }, name: 'spike', force: 130, },
          { dmg: {
            pierce: 110,
            chop: 100,
            pickaxe: 100,
          }, name: 'spikesweep', force: 8 },
        ],
      },
      { variety: 'sledge',
        attacks: [
          { dmg: {
            blunt: 110,
            chop: 100,
            pickaxe: 100,
          }, name: 'slam', force: 130, }, // R8
          { dmg: {
            blunt: 110,
            chop: 100,
            pickaxe: 100,
          }, name: 'double smash', force: 120, }, // R8.66
        ],
      },
    ], 
    hp: 800,
    staggerFactor: 0.33,
    staggerBlocked: true,
    damageModifiers: {
      ...defaultDmgModifiers,
      slash: 'resistant',
      pierce: 'resistant',
      pickaxe: 'veryWeak',
      fire: 'immune',
      frost: 'immune',
      poison: 'immune',
      spirit: 'immune',
    },
    drop: [
      dropEntry('Stone', { min: 5, max: 10 }),
      dropEntry('Crystal', { min: 3, max: 6 }),
      dropTrophy('TrophySGolem', 0.05),
    ],
  },
  {
    type: 'creature',
    id: 'Hatchling', // drake
    tier: 4,
    maxLvl: 1,
    emoji: '🐉',
    faction: 'MountainMonsters',
    locations: ['Mountain', 'DrakeNest'],
    attacks: single([{ dmg: { frost: 90 }, burst: 3, name: 'ice shards', force: 30, }]), // burst interval: 0.3
    hp: 100,
    staggerFactor: 0,
    staggerBlocked: true,
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
    tier: 4,
    maxLvl: 1,
    emoji: '🐲',
    faction: 'Boss',
    locations: ['DragonQueen'],
    attacks: single([
      { dmg: {
        slash: 120,
        chop: 1000,
        pickaxe: 1000
      }, name: 'bite', force: 120 }, // R8
      { dmg: {
        slash: 110,
        chop: 1000,
        pickaxe: 1000
      }, name: 'claw', force: 120 }, // R4
      { dmg: {
        chop: 200,
        pickaxe: 200,
        frost: 200,
      }, name: 'breath', force: 40 },
      { dmg: {
        pierce: 30,
        chop: 200,
        pickaxe: 200,
        frost: 200
      }, burst: 16, name: 'ice shards', force: 30 }, // V25
    ]),
    hp: 7500,
    staggerFactor: 0,
    staggerBlocked: false,
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
  {
    type: 'creature',
    id: 'Goblin', // Fulling
    tier: 5,
    maxLvl: 3,
    emoji: '',
    faction: 'PlainsMonsters',
    locations: ['Plains', 'GoblinCamp', 'StoneTower', 'StoneHengeS'],
    attacks: [
      { variety: 'club', attacks: [{ dmg: { blunt: 110 }, name: 'club' }] },
      { variety: 'spear', attacks: [{ dmg: { pierce: 110 }, name: 'spear' }] },
      { variety: 'sword', attacks: [{ dmg: { slash: 110 }, name: 'sword' }] },
      { variety: 'torch', attacks: [{ dmg: { blunt: 55, fire: 55 }, name: 'torch' }] },
      // vs 26 arm 24.3-37.6
      // vs 52 arm 18.6-28.2
      // vs 52 arm & FR 12.5-21.4
    ],
    hp: 200,
    staggerFactor: 0.4,
    staggerBlocked: true,
    damageModifiers: animalDmgModifiers,
    drop: [
      dropEntry('Coins', { chance: 0.25, min: 5, max: 10 }),
      dropEntry('BlackMetalScrap', { min: 1, max: 2 }),
      dropTrophy('TrophyGoblin', 0.1),
    ],
    // weapon: 2 club, 1 spear, 2 sword, 1 torch
    // shield: 1 wood, 2 <null>
    // tolerate: water
    // alertRange: 20,
    // maxChase: 300,
  },
  {
    type: 'creature',
    id: 'GoblinShaman', // Fulling
    tier: 5,
    maxLvl: 1,
    emoji: '',
    faction: 'PlainsMonsters',
    locations: ['GoblinCamp'],
    attacks: single([
      { dmg: { blunt: 100 }, name: 'staff' },
      { dmg: { blunt: 20, fire: 100 }, name: 'fireball' },
    ]),

    // vs 0 arm 15.1-19.7
    // vs 0 arm & wet 15.1-18.2
    // vs 26 arm 10.9-15.7
    // vs 52 arm 6.5-11.1
    // vs 52 arm + FR 3.8-6.7 (instantly + 5x over time halved due to FR)
    hp: 150,
    staggerFactor: 0.3,
    staggerBlocked: true,
    damageModifiers: animalDmgModifiers,
    drop: [
      dropEntry('Coins', { chance: 0.25, min: 20, max: 40 }),
      dropEntry('BlackMetalScrap', { min: 1, max: 2 }),
      dropTrophy('TrophyGoblinShaman', 0.1),
    ],
  },
  {
    type: 'creature',
    id: 'GoblinBrute', // Berserk
    tier: 5,
    maxLvl: 3,
    emoji: '',
    faction: 'PlainsMonsters',
    locations: ['GoblinCamp', 'StoneHengeS'],
    attacks: single([
      { dmg: {
        blunt: 130,
        chop: 100,
        pickaxe: 40,
      }, name: '???', force: 50, }, // attack
      { dmg: {
        blunt: 130,
        chop: 100,
        pickaxe: 40,
      }, name: '???', force: 70 }, // rage attack toolTier: 2
      { dmg: {
        slash: 80,
        chop: 10,
      }, name: '???', force: 50 }, // taunt toolTier: 0
    ]),
    hp: 800,
    staggerFactor: 0.3,
    staggerBlocked: true,
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
    id: 'Deathsquito',
    tier: 5,
    maxLvl: 1,
    emoji: '🦟',
    faction: 'PlainsMonsters',
    locations: ['Plains'],
    attacks: single([{ dmg: { pierce: 90 }, name: 'bite' }]),
    hp: 10,
    staggerFactor: 0.5,
    staggerBlocked: true,
    damageModifiers: animalDmgModifiers,
    drop: [
      dropEntry('Needle', { scale: false }),
      dropTrophy('TrophyDeathsquito', 0.05),
    ],
  },
  {
    type: 'creature',
    id: 'Lox',
    tier: 5,
    maxLvl: 1,
    emoji: '🐂',
    faction: 'PlainsMonsters',
    locations: ['Plains'],
    attacks: single([
      { dmg: { slash: 130 }, name: 'bite', force: 150 },
      { dmg: { blunt: 120, chop: 100, pickaxe: 100, }, name: 'stomp', force: 100 }, // toolTier: 0
    ]),
    hp: 1000,
    staggerFactor: 1,
    staggerBlocked: true,
    damageModifiers: {
      ...defaultDmgModifiers,
      blunt: 'resistant',
      slash: 'resistant',
      fire: 'weak',
      frost: 'resistant',
      spirit: 'immune',
    },
    drop: [
      dropEntry('LoxMeat', { min: 4, max: 6 }),
      dropEntry('LoxPelt', { min: 2, max: 3 }),
      dropTrophy('TrophyLox', 0.1),
    ],
    tame: { tameTime: 1800, fedTime: 600, commandable: false,
            eats: ['Cloudberry', 'Barley', 'Flax'] },
            // eatRange:4, searchRange:10, heal:10
  },
  {
    type: 'creature',
    id: 'GoblinKing',
    tier: 5,
    maxLvl: 1,
    emoji: '🦴',
    faction: 'Boss',
    locations: ['GoblinKing'],
    attacks: single([
      { dmg: { // 10 meteors
        blunt: 40,
        chop: 50,
        pickaxe: 50,
        fire: 140,
      }, burst: 20, name: 'meteors', force: 100, unblockable }, // "burstInterval": 0.1
      { dmg: {
        blunt: 50,
        chop: 50,
        pickaxe: 50,
        fire: 60,
      }, name: 'fire Breath' },
      { dmg: {
        blunt: 130,
        chop: 100,
        pickaxe: 100,
      }, name: 'nova', force: 100, unblockable },
      // Taunt
    ]),
    hp: 10000,
    staggerFactor: 0,
    staggerBlocked: false,
    damageModifiers: {
      ...defaultDmgModifiers,
      pierce: 'veryResistant',
      fire: 'resistant',
      poison: 'immune',
    },
    drop: [
      dropEntry('Yagluththing', { min: 3, max: 3, scale: false }),
      dropTrophy('TrophyGoblinKing', 1),
    ],
  },
// OCEAN
  {
    type: 'creature',
    id: 'Serpent',
    tier: 4,
    maxLvl: 1,
    emoji: '🐍',
    faction: 'SeaMonsters',
    locations: ['Ocean'],
    attacks: single([
      { dmg: { slash: 70, },
        name: 'attack', force: 100,
      },
      { dmg: {
        slash: 40,
        poison: 5,
      }, name: 'taunt', force: 30
      }
    ]),
    hp: 400,
    staggerFactor: 0,
    staggerBlocked: true,
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
];
