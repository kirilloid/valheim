import { AttackProfile, AttackVariety, Creature, DamageModifiers, dropEntry, dropTrophy } from '../types';

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

const loxDamageModifiers: DamageModifiers = {
  ...defaultDmgModifiers,
  blunt: 'resistant',
  slash: 'resistant',
  fire: 'weak',
  frost: 'resistant',
  spirit: 'immune',
};

const nightOnly = true;
const unblockable = true;
const undodgeable = true;

const single = (attacks: AttackProfile[]): [AttackVariety] => {
  return [{ rate: 1, variety: '', attacks }]; 
};

export const creatures: Creature[] = [
// MEADOWS
  {
    type: 'creature',
    id: 'Deer',
    tags: ['animal'],
    tier: 1,
    maxLvl: 3,
    emoji: '🦌',
    faction: 'ForestMonsters',
    locations: ['Meadows', 'BlackForest'],
    attacks: [],
    hp: 10,
    damageModifiers: animalDmgModifiers,
    drop: [
      dropEntry('RawMeat', { min: 2, max: 2 }),
      dropEntry('DeerHide',	{ max: 3 }),
      dropTrophy('TrophyDeer', 0.5),
    ],
  },
  {
    type: 'creature',
    group: 'bird',
    id: 'Seagal',
    tags: ['fly'],
    tier: 1,
    maxLvl: 1,
    emoji: '🦆',
    faction: 'ForestMonsters',
    locations: ['Meadows', 'BlackForest', 'Plains', 'Ocean'],
    attacks: [],
    hp: 1,
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
    attacks: single([{ dmg: { slash: 5 }, stagger: 1.94, name: 'bite' }]),
    hp: 20,
    stagger: {
      factor: 0.3,
      time: 1.94,
    },
    damageModifiers: grayModifiers,
    drop: [
      dropEntry('Resin'),
    ],
  },
  {
    type: 'creature',
    id: 'Neck',
    tags: ['animal'],
    tier: 1,
    maxLvl: 3,
    upgradeDistance: 800,
    emoji: '🦎',
    faction: 'ForestMonsters',
    locations: ['Meadows'],
    attacks: single([{ dmg: { slash: 6 }, stagger: 1.66, name: 'bite' }]),
    hp: 5,
    stagger: {
      factor: 0.5,
      time: 1.54,
    },
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
    damageModifiers: animalDmgModifiers,
    drop: [dropEntry('FishRaw')],
  },
  {
    type: 'creature',
    id: 'Boar',
    tags: ['animal'],
    tier: 1,
    maxLvl: 3,
    upgradeDistance: 800,
    emoji: '🐗',
    faction: 'ForestMonsters',
    locations: ['Meadows', 'Runestone_Boars'],
    attacks: single([{ dmg: { blunt: 10 }, stagger: 1.24, name: 'tusks' }]),
    hp: 10,
    stagger: {
      factor: 0.5,
      time: 1.24,
    },
    damageModifiers: animalDmgModifiers,
    drop: [
      dropEntry('RawMeat'),
      dropEntry('LeatherScraps'),
      dropTrophy('TrophyBoar', 0.15),
    ],
    tame: { tameTime: 1800, fedTime: 600, commandable: true,
            eats: ['Raspberry', 'Mushroom', 'Blueberries', 'Carrot', 'Turnip', 'Onion'] },
            // eatRange:1.0, searchRange:10, heal:5
    pregnancy: { points: 3, time: 60, chance: 0.33, grow: 3000 },
    // Boar_piggy: 10hp
  },
  {
    type: 'creature',
    id: 'Eikthyr',
    tier: 1,
    maxLvl: 1,
    emoji: '🦌',
    faction: 'Boss',
    locations: ['Eikthyrnir'],
    attacks: single([
      { dmg: { pierce: 20, chop: 1000, pickaxe: 1000 }, name: 'antlers', force: 100, toolTier: 0 },
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
    group: 'bird',
    id: 'Crow',
    tags: ['fly'],
    tier: 2,
    maxLvl: 1,
    emoji: '🐦',
    faction: 'ForestMonsters',
    locations: ['BlackForest'],
    attacks: [],
    hp: 1,
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
    locations: ['Crypt', 'Swamp', 'StoneTowerRuinsM'],
    attacks: [
      { rate: 4, variety: 'sword', attacks: [{ dmg: { slash: 25 }, stagger: 2.48, name: 'sword' }] },
      // { variety: 'mace', attacks: [{ dmg: { blunt: 25 }, stagger: 2.48, name: 'mace' }] },
      { rate: 1, variety: 'bow', attacks: [{ dmg: { pierce: 20 }, stagger: 2.48, name: 'bow' }] },
    ],
    hp: 40,
    stagger: {
      factor: 0.5,
      time: 2.48,
    },
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
             poison: 30 },
      stagger: 3.96, 
      name: 'mace',
    }]),
    hp: 100,
    stagger: {
      factor: 0.5,
      time: 3.44,
    },
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
    attacks: single([ { dmg: { slash: 25 }, stagger: 1.64, name: 'slash' } ]),
    hp: 60,
    stagger: {
      factor: 0.5,
      time: 1.64,
    },
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
    group: 'gray',
    id: 'Greydwarf',
    tier: 2,
    maxLvl: 3,
    emoji: '',
    faction: 'ForestMonsters',
    locations: ['BlackForest', 'StoneTowerRuinsF', 'Greydwarf_camp'],
    attacks: single([
      { dmg: { slash: 14 }, stagger: 1.94, name: 'hit' },
      { dmg: { blunt: 10 }, stagger: 1.94, name: 'stone' },
    ]),
    hp: 40,
    stagger: {
      factor: 0.3,
      time: 1.94,
    },
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
    group: 'gray',
    id: 'GreydwarfShaman',
    tier: 2,
    maxLvl: 3,
    nightOnly,
    emoji: '',
    faction: 'ForestMonsters',
    locations: ['BlackForest'/*, 'StoneTowerRuinsF'*/, 'Greydwarf_camp'],
    attacks: single([
      { dmg: { poison: 30 }, stagger: 1.12, name: 'poison breath' },
      { dmg: { slash: 14 }, stagger: 1.12, name: 'slash' },
    ]),
    hp: 60,
    stagger: {
      factor: 0.33,
      time: 1.12,
    },
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
    group: 'gray',
    id: 'Greydwarf_Elite',
    tier: 2,
    maxLvl: 3,
    upgradeDistance: 2000,
    emoji: '',
    faction: 'ForestMonsters',
    locations: ['BlackForest', 'StoneTowerRuinsF', 'Greydwarf_camp'],
    attacks: single([
      { dmg: { slash: 30 }, stagger: 1.34, name: 'bite' },
    ]),
    hp: 150,
    stagger: {
      factor: 0.5,
      time: 1.34,
    },
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
        rate: 1,
        variety: 'unarmed',
        attacks: [
          { dmg: { blunt: 60, chop: 100, pickaxe: 40 }, name: '1-hand hit', stagger: 4.4, force: 100, toolTier: 2 },
          { dmg: { blunt: 70, chop: 100, pickaxe: 40 }, name: '2-hand smash', stagger: 1.98, force: 100, toolTier: 2 },
          { dmg: { blunt: 50, chop: 60, pickaxe: 40 }, name: 'throw', stagger: 2.16, toolTier: 0 },
        ],
      }, {
        rate: 1,
        variety: 'log',
        attacks: [
          { dmg: { blunt: 70, chop: 100, pickaxe: 40 }, name: 'v-swing', stagger: 2.74, force: 80, toolTier: 2 },
          { dmg: { blunt: 60, chop: 100, pickaxe: 40 }, name: 'h-swing', stagger: 2.74, force: 80, toolTier: 2 },
        ],
      },
    ],
    hp: 600,
    stagger: {
      factor: 0.3,
      time: 2.74,
    },
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
      // SCREAM
      { spawn: ['Root'], number: 15, max: 30 },
      { dmg: { pierce: 35, chop: 20, pickaxe: 20 }, name: 'Vine Shoot', burst: 25, toolTier: 0 },
      { dmg: { blunt: 60, chop: 1000, pickaxe: 1000 }, name: 'Stomp', force: 30, toolTier: 0 }, // area
    ]),
    hp: 2500,
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
    id: 'Root', // from the elder
    tier: 2,
    maxLvl: 1,
    emoji: '🥦',
    faction: 'Boss',
    locations: ['GDKing'],
    attacks: single([
      { dmg: { blunt: 55, chop: 20, pickaxe: 20 }, name: 'poke', force: 40, toolTier: 0 }
    ]),
    hp: 20,
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
    group: 'blob',
    id: 'Blob',
    tier: 3,
    maxLvl: 1,
    emoji: '🦠',
    faction: 'Undead',
    locations: ['Swamp', 'SunkenCrypt'],
    attacks: single([{ dmg: { poison: 90 }, name: 'poison', unblockable }]),
    hp: 50,
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
    tier: 3,
    maxLvl: 1,
    nightOnly,
    emoji: '🦠',
    faction: 'Undead',
    locations: ['Swamp'],
    attacks: single([{ dmg: { poison: 115 }, name: 'poison', unblockable }]),
    hp: 150,
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
      poison: 70,
    }, name: 'bite', force: 30 }]),
    hp: 60,
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
    attacks: single([{
      dmg: { blunt: 10, fire: 40 },
      name: 'fireball', stagger: 1.14, force: 30,
    }]),
    hp: 20,
    stagger: {
      factor: 0.5,
      time: 1.14,
    },
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
    tags: ['fly'],
    tier: 3,
    maxLvl: 1,
    nightOnly,
    emoji: '👻',
    faction: 'Undead',
    locations: ['Swamp', 'SwampHut'],
    attacks: single([{ dmg: { slash: 60, }, name: 'slash', stagger: 2.04, force: 60 }]),
    hp: 100,
    stagger: {
      factor: 0.5,
      time: 2.04,
    },
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
        rate: 3,
        attacks: [{ dmg: { slash: 48, chop: 15 }, name: 'axe', stagger: 2.8, force: 60, toolTier: 0 }],
      },
      { variety: 'bow',
        rate: 1,
        attacks: [{ dmg: { pierce: 48 }, name: 'bow', stagger: 2.8, force: 18 }],
      },
    ],
    hp: 100,
    stagger: {
      factor: 0.5,
      time: 2.8,
    },
    damageModifiers: {
      ...defaultDmgModifiers,
      fire: 'resistant',
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
    attacks: single([ { dmg: { slash: 58, }, name: 'sword', stagger: 2.8, force: 60 } ]),
    hp: 200,
    stagger: {
      factor: 0.5,
      time: 2.8,
    },
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
    id: 'Bonemass',
    tier: 3,
    maxLvl: 1,
    emoji: '🦠',
    faction: 'Boss',
    locations: ['Bonemass'],
    attacks: single([
      { dmg: { poison: 130 }, name: 'poison', force: 0, unblockable, undodgeable },
      { dmg: {
        blunt: 80,
        chop: 1000,
        pickaxe: 1000,
        poison: 50,
      }, name: 'punch', force: 100, toolTier: 0 },
      { spawn: ['Skeleton', 'Blob'], number: 4, max: 8, }
    ]),
    hp: 5000,

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
    tags: ['animal'],
    tier: 4,
    maxLvl: 3,
    emoji: '🐺',
    faction: 'MountainMonsters',
    locations: ['Mountain'],
    attacks: single([
      { dmg: { slash: 70 }, name: 'bite', stagger: 4.8, force: 30 }, // 3 different animations, same stats
    ]),
    hp: 80,
    damageModifiers: animalDmgModifiers,
    stagger: {
      factor: 0.5,
      time: 4.8,
    },
    drop: [
      dropEntry('WolfFang', { chance: 0.4 }),
      dropEntry('WolfMeat', { chance: 1 }),
      dropEntry('WolfPelt', { max: 2 }),
      dropTrophy('TrophyWolf', 0.1),
    ],
    tame: { tameTime: 1800, fedTime: 600, commandable: true,
            eats: ['RawMeat', 'DeerMeat', 'NeckTail', 'LoxMeat', 'Sausages', 'FishRaw'] },
            // eatRange:1.4, searchRange:10, heal:20
    pregnancy: { points: 3, time: 60, chance: 0.33, grow: 3000 }, // max: 4, range: 3
    // Wolf_cub: 10hp
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
      { dmg: { slash: 85 }, name: 'hit', stagger: 1.12, force: 60 },
      { dmg: { slash: 95 }, name: 'jump', stagger: 1.32, force: 100 },
    ]),
    hp: 150,
    stagger: {
      factor: 0.5,
      time: 1.12,
    },
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
      { rate: 1,
        variety: 'spike',
        attacks: [
          { dmg: {
            blunt: 110,
            chop: 100,
            pickaxe: 100,
          }, name: 'spike', stagger: 2.94, force: 130, toolTier: 0 },
          { dmg: {
            blunt: 110,
            chop: 100,
            pickaxe: 100,
          }, name: 'spike sweep', stagger: 0.98, force: 130, toolTier: 0 },
          // spikes, no dmg, no animation
        ],
      },
      { rate: 1,
        variety: 'sledge',
        attacks: [
          { dmg: {
            blunt: 110,
            chop: 100,
            pickaxe: 100,
          }, name: 'slam', stagger: 2.94, force: 130, toolTier: 0 }, // R8
          { dmg: {
            blunt: 110,
            chop: 100,
            pickaxe: 100,
          }, name: 'double smash', stagger: 0.98, force: 120, toolTier: 0 }, // R8.66
        ],
      },
    ], 
    hp: 800,
    stagger: {
      factor: 0.33,
      time: 0.98,
    },
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
    tags: ['animal', 'fly'],
    tier: 4,
    maxLvl: 1,
    emoji: '🐉',
    faction: 'MountainMonsters',
    locations: ['Mountain', 'DrakeNest'],
    attacks: single([{ dmg: { frost: 90 }, burst: 3, name: 'ice shards', force: 30, }]), // burst interval: 0.3
    hp: 100,
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
    tags: ['fly'],
    tier: 4,
    maxLvl: 1,
    emoji: '🐲',
    faction: 'Boss',
    locations: ['DragonQueen'],
    attacks: single([
      // taunt,
      { dmg: {
        pierce: 120,
        chop: 1000,
        pickaxe: 1000
      }, name: 'bite', force: 120, toolTier: 3 }, // R8
      { dmg: {
        slash: 110,
        chop: 1000,
        pickaxe: 1000
      }, name: 'claw', force: 120, toolTier: 3 }, // R4 two: left & right
      { dmg: {
        pierce: 30,
        chop: 200,
        pickaxe: 200,
        frost: 200
      }, burst: 16, name: 'ice shards', force: 30, toolTier: 3 }, // velocity=2/25 burstInterval=0.05, spread=20/13
      { dmg: {
        chop: 200,
        pickaxe: 200,
        frost: 200,
      }, name: 'breath', force: 40, toolTier: 3 },
    ]),
    hp: 7500,

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
    group: 'goblin',
    id: 'Goblin', // Fulling
    tier: 5,
    maxLvl: 3,
    emoji: '',
    faction: 'PlainsMonsters',
    locations: ['Plains', 'GoblinCamp', 'StoneTower', 'StoneHengeS'],
    attacks: [
      { rate: 2, variety: 'club', attacks: [{ dmg: { blunt: 85 }, name: 'club', stagger: 2.08 }] },
      { rate: 1, variety: 'spear', attacks: [{ dmg: { pierce: 85 }, name: 'spear', stagger: 3.38 }] },
      { rate: 2, variety: 'sword', attacks: [{ dmg: { slash: 85 }, name: 'sword', stagger: 2.08 }] },
      { rate: 1, variety: 'torch', attacks: [{ dmg: { blunt: 45, fire: 45 }, name: 'torch', stagger: 2.08 }] },
      // vs 26 arm 24.3-37.6
      // vs 52 arm 18.6-28.2
      // vs 52 arm & FR 12.5-21.4
    ],
    hp: 175,
    stagger: {
      factor: 0.3,
      time: 2.08,
    },
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
    group: 'goblin',
    id: 'GoblinShaman', // Fulling
    tier: 5,
    maxLvl: 1,
    emoji: '',
    faction: 'PlainsMonsters',
    locations: ['GoblinCamp'],
    attacks: single([
      { dmg: { blunt: 100 }, name: 'staff', stagger: 3.2 },
      { dmg: { blunt: 20, fire: 100 }, name: 'fireball', stagger: 3.2 },
    ]),

    // vs 0 arm 15.1-19.7
    // vs 0 arm & wet 15.1-18.2
    // vs 26 arm 10.9-15.7
    // vs 52 arm 6.5-11.1
    // vs 52 arm + FR 3.8-6.7 (instantly + 5x over time halved due to FR)
    hp: 100,
    stagger: {
      factor: 0.3,
      time: 3.2,
    },
    damageModifiers: animalDmgModifiers,
    drop: [
      dropEntry('Coins', { chance: 0.25, min: 20, max: 40 }),
      dropEntry('BlackMetalScrap', { min: 1, max: 2 }),
      dropTrophy('TrophyGoblinShaman', 0.1),
    ],
  },
  {
    type: 'creature',
    group: 'goblin',
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
      }, name: 'attack', stagger: 2.88, force: 50, toolTier: 2 }, // random: 2
      { dmg: {
        blunt: 130,
        chop: 100,
        pickaxe: 40,
      }, name: 'rageattack', stagger: 2.88, force: 70, toolTier: 2 },
      // taunt
    ]),
    hp: 800,
    stagger: {
      factor: 0.3,
      time: 2.88,
    },
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
    tags: ['fly'],
    tier: 5,
    maxLvl: 1,
    emoji: '🦟',
    faction: 'PlainsMonsters',
    locations: ['Plains'],
    attacks: single([{ dmg: { pierce: 90 }, name: 'bite' }]),
    hp: 10,
    damageModifiers: animalDmgModifiers,
    drop: [
      dropEntry('Needle', { scale: false }),
      dropTrophy('TrophyDeathsquito', 0.05),
    ],
  },
  {
    type: 'creature',
    id: 'Lox',
    tags: ['animal'],
    tier: 5,
    maxLvl: 1,
    emoji: '🐂',
    faction: 'PlainsMonsters',
    locations: ['Plains'],
    attacks: single([
      { dmg: { slash: 130 }, name: 'bite', force: 150 },
      { dmg: { blunt: 120, chop: 100, pickaxe: 100, }, name: 'stomp', force: 100, toolTier: 0 },
    ]),
    hp: 1000,
    stagger: {
      factor: 0.3,
      time: NaN,
    },
    damageModifiers: loxDamageModifiers,
    drop: [
      dropEntry('LoxMeat', { min: 4, max: 6 }),
      dropEntry('LoxPelt', { min: 2, max: 3 }),
      dropTrophy('TrophyLox', 0.1),
    ],
    tame: { tameTime: 1800, fedTime: 600, commandable: false,
            eats: ['Cloudberry', 'Barley', 'Flax'] },
            // eatRange:4, searchRange:10, heal:10
    pregnancy: { points: 4, time: 120, chance: 0.33, grow: 6000 },
    // Lox_calf: 100hp res 1104421003
  },
  {
    type: 'creature',
    id: 'BlobTar',
    tier: 5,
    maxLvl: 1,
    emoji: '🦠',
    faction: 'Undead',
    locations: ['TarPit'],
    attacks: single([
      { dmg: { blunt: 45, poison: 50, }, name: 'stomp', force: 80, toolTier: 0 },
    ]),
    hp: 100,
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
        fire: 120,
      }, burst: 20, name: 'meteors', force: 100, unblockable }, // no toolTier
      { dmg: {
        chop: 50,
        pickaxe: 50,
        fire: 40,
        lightning: 20,
      }, name: 'fire Breath' }, // aka beam burst: 20*0.1 V=30/40 spread=1/1
      { dmg: {
        chop: 100,
        pickaxe: 100,
        fire: 65,
        lightning: 65,
      }, name: 'nova', force: 100, toolTier: 2, unblockable },
      // Taunt
    ]),
    hp: 10000,

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
    tags: ['animal'],
    tier: 4,
    maxLvl: 1,
    emoji: '🐍',
    faction: 'SeaMonsters',
    locations: ['Ocean'],
    attacks: single([
      { dmg: { slash: 70, },
        name: 'attack', force: 100,
      },
      // taunt
    ]),
    hp: 400,
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
