import { Creature, DamageModifier, DamageType, dropEntry, dropTrophy, Faction } from "../types";

const defaultDmgModifiers = {
  [DamageType.Damage]: DamageModifier.Normal,
  [DamageType.Blunt]: DamageModifier.Normal,
  [DamageType.Slash]: DamageModifier.Normal,
  [DamageType.Pierce]: DamageModifier.Normal,
  [DamageType.Chop]: DamageModifier.Ignore,
  [DamageType.Pickaxe]: DamageModifier.Ignore,
  [DamageType.Fire]: DamageModifier.Normal,
  [DamageType.Frost]: DamageModifier.Normal,
  [DamageType.Lightning]: DamageModifier.Normal,
  [DamageType.Poison]: DamageModifier.Normal,
  [DamageType.Spirit]: DamageModifier.Normal,
};

const animalDmgModifiers = {
  ...defaultDmgModifiers,
  [DamageType.Spirit]: DamageModifier.Immune,
}

const grayModifiers = {
  ...animalDmgModifiers,
  [DamageType.Fire]: DamageModifier.VeryWeak,
  [DamageType.Poison]: DamageModifier.Resistant,
};

const blobDamageModifiers = {
  ...defaultDmgModifiers,
  [DamageType.Blunt]: DamageModifier.Weak,
  [DamageType.Slash]: DamageModifier.Resistant,
  [DamageType.Pierce]: DamageModifier.Resistant,
  [DamageType.Fire]: DamageModifier.Resistant,
  [DamageType.Frost]: DamageModifier.Weak,
  [DamageType.Lightning]: DamageModifier.Weak,
  [DamageType.Poison]: DamageModifier.Immune,
};

/**
 * numer of players (in range 200) scale
 * dmg +4%
 * hp +40%
 * 
 * stars scale
 * dmg +50%
 * hp +100%
 */

export const creatures: Creature[] = [
// MEADOWS
  {
    type: 'creature',
    id: 'Deer',
    tier: 1,
    emoji: '🦌',
    faction: Faction.ForestMonsters,
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
    emoji: '🦆',
    faction: Faction.ForestMonsters,
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
    emoji: '🐀',
    faction: Faction.ForestMonsters,
    attacks: [{ dmg: { [DamageType.Slash]: 5 }, name: 'bite' }],
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
    emoji: '🦎',
    faction: Faction.ForestMonsters,
    attacks: [{ dmg: { [DamageType.Slash]: 6 }, name: 'bite' }],
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
    emoji: '',
    faction: Faction.ForestMonsters,
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
    emoji: '🐗',
    faction: Faction.ForestMonsters,
    attacks: [{ dmg: { [DamageType.Blunt]: 10 }, name: 'tusks' }],
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
    emoji: '🦌',
    faction: Faction.Boss,
    staggerFactor: 0,
    staggerBlocked: true,
    attacks: [
      { dmg: { [DamageType.Pierce]: 20, [DamageType.Chop]: 1000, [DamageType.Pickaxe]: 1000 }, name: 'antlers', force: 100 },
      { dmg: { [DamageType.Lightning]: 15 }, name: 'pew-pew', force: 200 },
      { dmg: { [DamageType.Lightning]: 20 }, name: 'stomp', force: 100 },
    ],
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
    emoji: '🐦',
    faction: Faction.ForestMonsters,
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
    emoji: '💀',
    faction: Faction.Undead,
    attacks: [
      { dmg: { [DamageType.Slash]: 25 }, name: 'sword' },
      { dmg: { [DamageType.Pierce]: 20 }, name: 'bow' },
    ],
    hp: 40,
    staggerFactor: 0.5,
    staggerBlocked: true,
    damageModifiers: {
      ...defaultDmgModifiers,
      [DamageType.Blunt]: DamageModifier.Weak,
      [DamageType.Pierce]: DamageModifier.Resistant,
      [DamageType.Fire]: DamageModifier.Weak,
      [DamageType.Frost]: DamageModifier.Resistant,
      [DamageType.Poison]: DamageModifier.Immune,
    },
    drop: [
      dropEntry('BoneFragments'),
      dropTrophy('TrophySkeleton', 0.1),
    ],
  },
  {
    type: 'creature',
    id: 'Skeleton_Poison', // Rancid Remains
    tier: 2,
    emoji: '☠️',
    faction: Faction.Undead,
    attacks: [{
      dmg: { [DamageType.Blunt]: 20,
             [DamageType.Poison]: 20 },
      name: '',
    }],
    hp: 100,
    staggerFactor: 0.5,
    staggerBlocked: true,
    damageModifiers: {
      ...defaultDmgModifiers,
      [DamageType.Blunt]: DamageModifier.Weak,
      [DamageType.Pierce]: DamageModifier.Resistant,
      [DamageType.Fire]: DamageModifier.Weak,
      [DamageType.Frost]: DamageModifier.Resistant,
      [DamageType.Poison]: DamageModifier.Immune,
    },
    drop: [
      dropEntry('BoneFragments', { min: 3, max: 3 }),
      dropTrophy('TrophySkeletonPoison', 0.1),
    ],
  },
  {
    type: 'creature',
    id: 'Ghost',
    tier: 2,
    emoji: '👻',
    faction: Faction.Undead,
    attacks: [
      { dmg: { [DamageType.Slash]: 25 }, name: '' }
    ],
    hp: 60,
    staggerFactor: 0.5,
    staggerBlocked: true,
    damageModifiers: {
      ...defaultDmgModifiers,
      [DamageType.Blunt]: DamageModifier.Resistant,
      [DamageType.Slash]: DamageModifier.Resistant,
      [DamageType.Pierce]: DamageModifier.Resistant,
      [DamageType.Poison]: DamageModifier.Immune,
      [DamageType.Spirit]: DamageModifier.Weak,
    },
    drop: [],
  },
  {
    type: 'creature',
    id: 'Greydwarf',
    tier: 2,
    emoji: '',
    faction: Faction.ForestMonsters,
    attacks: [
      { dmg: { [DamageType.Slash]: 14 }, name: 'hit' },
      { dmg: { [DamageType.Blunt]: 10 }, name: 'stone' },
    ],
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
    emoji: '',
    faction: Faction.ForestMonsters,
    attacks: [{ dmg: { [DamageType.Poison]: 25 }, name: '' }],
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
    emoji: '',
    faction: Faction.ForestMonsters,
    attacks: [
      { dmg: { [DamageType.Slash]: 30 }, name: 'bite' },
    ],
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
    emoji: '',
    faction: Faction.ForestMonsters,
    attacks: [
      { dmg: { [DamageType.Blunt]: 60, [DamageType.Chop]: 100, [DamageType.Pickaxe]: 40 }, name: '1-hand hit', force: 100 },
      { dmg: { [DamageType.Blunt]: 70, [DamageType.Chop]: 100, [DamageType.Pickaxe]: 40 }, name: '2-hand smash', force: 100 }, // unblockable
      { dmg: { [DamageType.Blunt]: 50, [DamageType.Chop]: 60, [DamageType.Pickaxe]: 40 }, name: 'throw' },
      { dmg: { [DamageType.Blunt]: 60, [DamageType.Chop]: 100, [DamageType.Pickaxe]: 40 }, name: 'h-swing', force: 80 },
      { dmg: { [DamageType.Blunt]: 70, [DamageType.Chop]: 100, [DamageType.Pickaxe]: 40 }, name: 'v-swing', force: 80 },
    ],
    hp: 600,
    staggerFactor: 0.3,
    staggerBlocked: true,
    damageModifiers: {
      ...animalDmgModifiers,
      [DamageType.Blunt]: DamageModifier.Resistant,
      [DamageType.Pierce]: DamageModifier.Weak,
      [DamageType.Poison]: DamageModifier.Immune,
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
    emoji: '🥦',
    faction: Faction.Boss,
    attacks: [
      // used? { dmg: { [DamageType.Blunt]: 50 }, name: 'Punch', force: 30 }, 
      { dmg: { [DamageType.Pierce]: 35, [DamageType.Chop]: 20, [DamageType.Pickaxe]: 20 }, name: 'Vine Shoot', force: 40 },
      { dmg: { [DamageType.Blunt]: 60, [DamageType.Chop]: 1000, [DamageType.Pickaxe]: 1000 }, name: 'Stomp', force: 30 },
      { spawn: ['Root'], number: 15, max: 30 },
      // number: 15, max: 30, staggerFactor: 0, staggerBlocked: true,
      // hp: 20, weak to fire,
    ],
    hp: 2500,
    staggerFactor: 0,
    staggerBlocked: false,
    damageModifiers: {
      ...defaultDmgModifiers,
      [DamageType.Fire]: DamageModifier.VeryWeak,
      [DamageType.Poison]: DamageModifier.Immune,
      [DamageType.Spirit]: DamageModifier.Immune,
    },
    drop: [
      dropEntry('CryptKey', { perPlayer: true }),
      dropTrophy('TrophyTheElder', 1),
    ],
  },
  {
    type: 'creature',
    id: 'Root', // the elder
    tier: 2,
    emoji: '🥦',
    faction: Faction.Boss,
    attacks: [
      { dmg: { [DamageType.Blunt]: 55, [DamageType.Chop]: 20, [DamageType.Pickaxe]: 20, }, name: '', force: 40 }
    ],
    hp: 20,
    staggerFactor: 0,
    staggerBlocked: true,
    damageModifiers: {
      ...defaultDmgModifiers,
      [DamageType.Fire]: DamageModifier.Weak,
      [DamageType.Frost]: DamageModifier.Resistant,
      [DamageType.Poison]: DamageModifier.Immune,
    },
    drop: [],
  },
// SWAMP
  {
    type: 'creature',
    id: 'Blob',
    tier: 3,
    emoji: '🦠',
    faction: Faction.Undead,
    attacks: [{ dmg: { [DamageType.Poison]: 70 }, name: '' }], // unblockable
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
    id: 'Oozer',
    tier: 3,
    emoji: '🦠',
    faction: Faction.Undead,
    attacks: [{ dmg: { [DamageType.Poison]: 90 }, name: '' }], // unblockable
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
    emoji: '🧛',
    faction: Faction.Undead,
    attacks: [{ dmg: {
      [DamageType.Pierce]: 20,
      [DamageType.Poison]: 60,
    }, name: 'bite', force: 30 }],
    hp: 60,
    staggerFactor: 0,
    staggerBlocked: false,
    damageModifiers: {
      ...animalDmgModifiers,
      [DamageType.Fire]: DamageModifier.Immune,
      [DamageType.Poison]: DamageModifier.Weak,
      [DamageType.Spirit]: DamageModifier.Immune,
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
    emoji: '🧨',
    faction: Faction.Demon,
    attacks: [{ dmg: {
      [DamageType.Blunt]: 10,
      [DamageType.Fire]: 40,
    }, name: '', force: 30 }],
    hp: 20,
    staggerFactor: 0.5,
    staggerBlocked: true,
    damageModifiers: {
      ...defaultDmgModifiers,
      [DamageType.Fire]: DamageModifier.Immune,
      [DamageType.Frost]: DamageModifier.Weak,
      [DamageType.Poison]: DamageModifier.Immune,
      [DamageType.Spirit]: DamageModifier.Immune,
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
    emoji: '👻',
    faction: Faction.Undead,
    attacks: [{ dmg: { [DamageType.Slash]: 60, }, name: '', force: 60 }],
    hp: 100,
    staggerFactor: 0.5,
    staggerBlocked: true,
    damageModifiers: {
      ...defaultDmgModifiers,
      [DamageType.Blunt]: DamageModifier.Resistant,
      [DamageType.Slash]: DamageModifier.Resistant,
      [DamageType.Pierce]: DamageModifier.Resistant,
      [DamageType.Fire]: DamageModifier.Weak,
      [DamageType.Frost]: DamageModifier.Immune,
      [DamageType.Poison]: DamageModifier.Immune,
      [DamageType.Spirit]: DamageModifier.Weak,
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
    emoji: '🧟',
    faction: Faction.Undead,
    attacks: [
      { dmg: { [DamageType.Slash]: 48, [DamageType.Chop]: 15 }, name: 'axe', force: 60 },
      { dmg: { [DamageType.Pierce]: 48 }, name: 'bow', force: 18 },
    ],
    hp: 100,
    staggerFactor: 0.5,
    staggerBlocked: true,
    damageModifiers: {
      ...animalDmgModifiers,
      [DamageType.Fire]: DamageModifier.Weak,
      [DamageType.Poison]: DamageModifier.Immune,
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
    emoji: '🧟',
    faction: Faction.Undead,
    attacks: [
      { dmg: { [DamageType.Slash]: 58, }, name: '', force: 60 }
    ],
    hp: 200,
    staggerFactor: 0.5,
    staggerBlocked: true,
    damageModifiers: {
      ...animalDmgModifiers,
      [DamageType.Fire]: DamageModifier.Weak,
      [DamageType.Poison]: DamageModifier.Immune,
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
    emoji: '🦠',
    faction: Faction.Boss,
    attacks: [
      { dmg: { [DamageType.Poison]: 100 }, name: 'poison', force: 0 }, // undodgeable, unblockable
      { dmg: { [DamageType.Blunt]: 80, // punch
        [DamageType.Chop]: 1000,
        [DamageType.Pickaxe]: 1000,
        [DamageType.Poison]: 30,
      }, name: 'hit', force: 0 },
      { spawn: ['Skeleton', 'Blob'], number: 4, max: 8, }
    ],
    hp: 5000,
    staggerFactor: 0,
    staggerBlocked: false,
    damageModifiers: {
      ...defaultDmgModifiers,
      [DamageType.Blunt]: DamageModifier.Weak,
      [DamageType.Slash]: DamageModifier.Resistant,
      [DamageType.Pierce]: DamageModifier.VeryResistant,
      [DamageType.Fire]: DamageModifier.VeryResistant,
      [DamageType.Frost]: DamageModifier.Weak,
      [DamageType.Poison]: DamageModifier.Immune,
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
    emoji: '🐺',
    faction: Faction.MountainMonsters,
    attacks: [
      { dmg: { [DamageType.Slash]: 70 }, name: 'bite', force: 30 }, // 3 different animations, same stats
    ],
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
    emoji: '🐺',
    faction: Faction.MountainMonsters,
    attacks: [
      { dmg: { [DamageType.Slash]: 85 }, name: 'hit', force: 60 },
      { dmg: { [DamageType.Slash]: 95 }, name: 'jump', force: 100 },
    ],
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
    emoji: '🗿',
    faction: Faction.ForestMonsters,
    attacks: [{ dmg: {
      [DamageType.Blunt]: 110,
      [DamageType.Chop]: 100,
      [DamageType.Pickaxe]: 100,
    }, name: 'spike', force: 130, },
    { dmg: {
      [DamageType.Pierce]: 110,
      [DamageType.Chop]: 100,
      [DamageType.Pickaxe]: 100,
    }, name: 'spikesweep', force: 8 },
    { dmg: {
      [DamageType.Blunt]: 110,
      [DamageType.Chop]: 100,
      [DamageType.Pickaxe]: 100,
    }, name: 'slam', force: 130, }, // R8
    { dmg: {
      [DamageType.Blunt]: 110,
      [DamageType.Chop]: 100,
      [DamageType.Pickaxe]: 100,
    }, name: 'double smash', force: 120, }, // R8.66
    ], 
    hp: 800,
    staggerFactor: 0.33,
    staggerBlocked: true,
    damageModifiers: {
      ...defaultDmgModifiers,
      [DamageType.Slash]: DamageModifier.Resistant,
      [DamageType.Pierce]: DamageModifier.Resistant,
      [DamageType.Pickaxe]: DamageModifier.VeryWeak,
      [DamageType.Fire]: DamageModifier.Immune,
      [DamageType.Frost]: DamageModifier.Immune,
      [DamageType.Poison]: DamageModifier.Immune,
      [DamageType.Spirit]: DamageModifier.Immune,
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
    emoji: '🐉',
    faction: Faction.MountainMonsters,
    attacks: [{ dmg: { [DamageType.Frost]: 90 }, burst: 3, name: '', force: 30, }], // burst interval: 0.3
    hp: 100,
    staggerFactor: 0,
    staggerBlocked: true,
    damageModifiers: {
      ...animalDmgModifiers,
      [DamageType.Fire]: DamageModifier.Weak,
      [DamageType.Frost]: DamageModifier.Immune,
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
    emoji: '🐲',
    faction: Faction.Boss,
    attacks: [
      { dmg: {
        [DamageType.Slash]: 120,
        [DamageType.Chop]: 1000,
        [DamageType.Pickaxe]: 1000
      }, name: 'bite', force: 120 }, // R8
      { dmg: {
        [DamageType.Slash]: 110,
        [DamageType.Chop]: 1000,
        [DamageType.Pickaxe]: 1000
      }, name: 'claw', force: 120 }, // R4
      { dmg: {
        [DamageType.Chop]: 200,
        [DamageType.Pickaxe]: 200,
        [DamageType.Frost]: 200,
      }, name: 'breath', force: 40 },
      { dmg: {
        [DamageType.Pierce]: 30,
        [DamageType.Chop]: 200,
        [DamageType.Pickaxe]: 200,
        [DamageType.Frost]: 200
      }, burst: 16, name: 'ice shards', force: 30 }, // V25
    ],
    hp: 7500,
    staggerFactor: 0,
    staggerBlocked: false,
    damageModifiers: {
      ...animalDmgModifiers,
      [DamageType.Fire]: DamageModifier.Weak,
      [DamageType.Frost]: DamageModifier.Immune,
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
    emoji: '',
    faction: Faction.PlainsMonsters,
    attacks: [
      { dmg: { [DamageType.Blunt]: 110 }, name: 'club' },
      { dmg: { [DamageType.Pierce]: 110 }, name: 'spear' },
      { dmg: { [DamageType.Slash]: 110 }, name: 'sword' },
      { dmg: { [DamageType.Blunt]: 55, [DamageType.Fire]: 55 }, name: 'torch' },
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
    emoji: '',
    faction: Faction.PlainsMonsters,
    attacks: [
      { dmg: { [DamageType.Blunt]: 100 }, name: 'staff' },
      { dmg: { [DamageType.Blunt]: 20, [DamageType.Fire]: 100 }, name: 'fireball' },
    ],

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
    emoji: '',
    faction: Faction.PlainsMonsters,
    attacks: [
      { dmg: {
        [DamageType.Blunt]: 130,
        [DamageType.Chop]: 100,
        [DamageType.Pickaxe]: 40,
      }, name: '???', force: 50, }, // attack
      { dmg: {
        [DamageType.Blunt]: 130,
        [DamageType.Chop]: 100,
        [DamageType.Pickaxe]: 40,
      }, name: '???', force: 70 }, // rage attack toolTier: 2
      { dmg: {
        [DamageType.Slash]: 80,
        [DamageType.Chop]: 10,
      }, name: '???', force: 50 }, // taunt toolTier: 0
    ],
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
    emoji: '🦟',
    faction: Faction.PlainsMonsters,
    attacks: [{ dmg: { [DamageType.Pierce]: 90 }, name: 'bite' }],
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
    emoji: '🐂',
    faction: Faction.PlainsMonsters,
    attacks: [
      { dmg: { [DamageType.Slash]: 130 }, name: 'bite', force: 150 },
      { dmg: { [DamageType.Blunt]: 120, [DamageType.Chop]: 100, [DamageType.Pickaxe]: 100, }, name: 'stomp', force: 100 }, // toolTier: 0
    ],
    hp: 1000,
    staggerFactor: 1,
    staggerBlocked: true,
    damageModifiers: {
      ...defaultDmgModifiers,
      [DamageType.Blunt]: DamageModifier.Resistant,
      [DamageType.Slash]: DamageModifier.Resistant,
      [DamageType.Fire]: DamageModifier.Weak,
      [DamageType.Frost]: DamageModifier.Resistant,
      [DamageType.Spirit]: DamageModifier.Immune,
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
    emoji: '🦴',
    faction: Faction.Boss,
    attacks: [
      { dmg: { // 10 meteors
        [DamageType.Blunt]: 40,
        [DamageType.Chop]: 50,
        [DamageType.Pickaxe]: 50,
        [DamageType.Fire]: 140,
      }, burst: 20, name: 'meteors', force: 100, }, // unblockable? "burstInterval": 0.1
      { dmg: {
        [DamageType.Blunt]: 50,
        [DamageType.Chop]: 50,
        [DamageType.Pickaxe]: 50,
        [DamageType.Fire]: 60,
      }, name: 'Fire Breath' },
      { dmg: {
        [DamageType.Blunt]: 130,
        [DamageType.Chop]: 100,
        [DamageType.Pickaxe]: 100,
      }, name: 'nova', force: 100 }, // unblockable
      // Taunt
    ],
    hp: 10000,
    staggerFactor: 0,
    staggerBlocked: false,
    damageModifiers: {
      ...defaultDmgModifiers,
      [DamageType.Pierce]: DamageModifier.VeryResistant,
      [DamageType.Fire]: DamageModifier.Resistant,
      [DamageType.Poison]: DamageModifier.Immune,
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
    emoji: '🐍',
    faction: Faction.SeaMonsters,
    attacks: [
      { dmg: { [DamageType.Slash]: 70, },
        name: 'attack', force: 100,
      },
      { dmg: {
        [DamageType.Slash]: 40,
        [DamageType.Poison]: 5,
      }, name: 'taunt', force: 30
      }
    ],
    hp: 400,
    staggerFactor: 0,
    staggerBlocked: true,
    damageModifiers: {
      ...animalDmgModifiers,
      [DamageType.Fire]: DamageModifier.Immune,
      [DamageType.Frost]: DamageModifier.Weak,
      [DamageType.Poison]: DamageModifier.Resistant,
    },
    drop: [
      dropEntry('SerpentScale', { min: 8, max: 10 }),
      dropEntry('SerpentMeat', { min: 6, max: 8 }),
      dropTrophy('TrophySerpent', 0.33),
    ],
  },
];
