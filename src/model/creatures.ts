import { Creature, DamageModifiers, DamageType, dropEntry, DropEntry, dropTrophy, Faction } from "../types";

const defaultDmgModifiers = {
  [DamageType.Damage]: DamageModifiers.Normal,
  [DamageType.Blunt]: DamageModifiers.Normal,
  [DamageType.Slash]: DamageModifiers.Normal,
  [DamageType.Pierce]: DamageModifiers.Normal,
  [DamageType.Chop]: DamageModifiers.Ignore,
  [DamageType.Pickaxe]: DamageModifiers.Ignore,
  [DamageType.Fire]: DamageModifiers.Normal,
  [DamageType.Frost]: DamageModifiers.Normal,
  [DamageType.Lightning]: DamageModifiers.Normal,
  [DamageType.Poison]: DamageModifiers.Normal,
  [DamageType.Spirit]: DamageModifiers.Normal,
};

const animalDmgModifiers = {
    ...defaultDmgModifiers,
    [DamageType.Spirit]: DamageModifiers.Immune,
}

const grayModifiers = {
    ...animalDmgModifiers,
    [DamageType.Fire]: DamageModifiers.VeryWeak,
    [DamageType.Poison]: DamageModifiers.Resistant,
};

const blobDamageModifiers = {
  ...defaultDmgModifiers,
  [DamageType.Blunt]: DamageModifiers.Weak,
  [DamageType.Slash]: DamageModifiers.Resistant,
  [DamageType.Pierce]: DamageModifiers.Resistant,
  [DamageType.Fire]: DamageModifiers.Resistant,
  [DamageType.Frost]: DamageModifiers.Weak,
  [DamageType.Lightning]: DamageModifiers.Weak,
  [DamageType.Poison]: DamageModifiers.Immune,
};

export const creatures: Creature[] = [
// MEADOWS
  {
    id: 'Deer',
    faction: Faction.ForestMonsters,
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
    id: 'Seagull', // Seagal
    faction: Faction.ForestMonsters,
    attacks: [],
    hp: 1,
    damageModifiers: animalDmgModifiers,
    drop: [
      dropEntry('Feathers', { min: 3, max: 3 }),
    ],
  },
  {
    id: 'Greyling',
    faction: Faction.ForestMonsters,
    attacks: [{ [DamageType.Slash]: 5 }],
    hp: 20,
    damageModifiers: grayModifiers,
    drop: [
      dropEntry('Resin'),
    ],
  },
  {
    id: 'Neck',
    faction: Faction.ForestMonsters,
    attacks: [{ [DamageType.Slash]: 6 }],
    hp: 5,
    damageModifiers: animalDmgModifiers,
    drop: [
      dropEntry('NeckTail', { chance: 0.75 }),
      dropTrophy('TrophyNeck', 0.05),
    ],
  },
  {
    id: 'Boar',
    faction: Faction.ForestMonsters,
    attacks: [{ [DamageType.Blunt]: 10 }],
    hp: 10,
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
    id: 'Eikthyr',
    faction: Faction.Boss,
    attacks: [
      { [DamageType.Pierce]: 20 }, // antlers
      { [DamageType.Lightning]: 15 }, // pew-pew
      { [DamageType.Lightning]: 20 }, // stomp
    ],
    hp: 10,
    damageModifiers: animalDmgModifiers,
    drop: [
      dropEntry('HardAntler', { min: 3, max: 3 }),
      dropTrophy('TrophyEikthyr', 1),
    ],
  },
// FOREST
  {
    id: 'Crow',
    faction: Faction.ForestMonsters,
    attacks: [],
    hp: 1,
    damageModifiers: animalDmgModifiers,
    drop: [
      dropEntry('Feathers', { min: 3, max: 3 }),
    ],
  },
  {
    id: 'Skeleton',
    defeatKey: 'skeleton',
    faction: Faction.Undead,
    attacks: [
      { [DamageType.Slash]: 25 }, // sword
      { [DamageType.Pierce]: 20 },
    ],
    hp: 40,
    damageModifiers: {
      ...defaultDmgModifiers,
      [DamageType.Blunt]: DamageModifiers.Weak,
      [DamageType.Pierce]: DamageModifiers.Resistant,
      [DamageType.Fire]: DamageModifiers.Weak,
      [DamageType.Frost]: DamageModifiers.Resistant,
      [DamageType.Poison]: DamageModifiers.Immune,
    },
    drop: [
      dropEntry('BoneFragments'),
      dropTrophy('TrophySkeleton', 0.1),
    ],
  },
  {
    id: 'Skeleton_Poison', // Rancid Remains
    faction: Faction.Undead,
    attacks: [
      [{ amount: 20, type: DamageType.Blunt },
       { amount: 20, type: DamageType.Poison }],
    ],
    hp: 100,
    damageModifiers: {
      ...defaultDmgModifiers,
      [DamageType.Blunt]: DamageModifiers.Weak,
      [DamageType.Pierce]: DamageModifiers.Resistant,
      [DamageType.Fire]: DamageModifiers.Weak,
      [DamageType.Frost]: DamageModifiers.Resistant,
      [DamageType.Poison]: DamageModifiers.Immune,
    },
    drop: [
      dropEntry('BoneFragments', { min: 3, max: 3 }),
      dropTrophy('TrophySkeletonPoison', 0.1),
    ],
  },
  {
    id: 'Ghost',
    faction: Faction.Undead,
    attacks: [
      { [DamageType.Slash]: 25 }
    ],
    hp: 60,
    damageModifiers: {
      ...defaultDmgModifiers,
      [DamageType.Blunt]: DamageModifiers.Resistant,
      [DamageType.Slash]: DamageModifiers.Resistant,
      [DamageType.Pierce]: DamageModifiers.Resistant,
      [DamageType.Poison]: DamageModifiers.Immune,
      [DamageType.Spirit]: DamageModifiers.Weak,
    },
    drop: [],
  },
  {
    id: 'Greydwarf',
    faction: Faction.ForestMonsters,
    attacks: [
      { [DamageType.Slash]: 14 },
      { [DamageType.Blunt]: 10 },
    ],
    hp: 40,
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
    id: 'GreydwarfShaman',
    faction: Faction.ForestMonsters,
    attacks: [{ [DamageType.Slash]: 14 }],
    hp: 60,
    // heals for 2.5hp/s for 3.5s in 4.3m radius
    damageModifiers: grayModifiers,
    drop: [
      dropEntry('GreydwarfEye', { chance: 0.5 }),
      dropEntry('Wood'),
      dropEntry('Resin', { max: 2 }),
      dropTrophy('TrophyGreydwarfShaman', 0.1),
    ],
  },
  {
    id: 'Greydwarf_Elite',
    faction: Faction.ForestMonsters,
    attacks: [
        { [DamageType.Slash]: 30 },
    ],
    hp: 150,
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
    id: 'Troll',
    defeatKey: 'troll',
    faction: Faction.ForestMonsters,
    attacks: [
      { [DamageType.Blunt]: 60 }, // 1h
      { [DamageType.Blunt]: 70 }, // 2h
      { [DamageType.Blunt]: 50 }, // throw
    ],
    hp: 600,
    damageModifiers: {
      ...animalDmgModifiers,
      [DamageType.Blunt]: DamageModifiers.Resistant,
      [DamageType.Pierce]: DamageModifiers.Weak,
      [DamageType.Poison]: DamageModifiers.Immune,
    },
    drop: [
      dropEntry('TrollHide', { min: 5, max: 5 }),
      dropEntry('Coins', { min: 20, max: 30 }),
      dropTrophy('TrophyFrostToll', 0.5),
    ],
  },
  {
    id: 'gd_king', // the elder
    faction: Faction.Boss,
    attacks: [
      { [DamageType.Pierce]: 35 }, // Vine Shoot
      { [DamageType.Blunt]: 60 },  // Stomp
      { [DamageType.Blunt]: 55 },  // Spawn Roots
    ],
    hp: 2500,
    damageModifiers: {
      ...defaultDmgModifiers,
      [DamageType.Fire]: DamageModifiers.VeryWeak,
      [DamageType.Poison]: DamageModifiers.Immune,
      [DamageType.Spirit]: DamageModifiers.Immune,
    },
    drop: [
      dropEntry('CryptKey', { perPlayer: true }),
      dropTrophy('TrophyTheElder', 1),
    ],
  },
// SWAMP
  {
    id: 'Blob',
    faction: Faction.Undead,
    attacks: [{ [DamageType.Poison]: 70 }],
    staggerFactor: 0,
    hp: 50,
    damageModifiers: blobDamageModifiers,
    drop: [
      dropEntry('Ooze', { min: 1, max: 2 }),
      dropTrophy('TrophyBlob', 0.1),
    ],
  },
  {
    id: 'Oozer',
    faction: Faction.Undead,
    attacks: [{ [DamageType.Poison]: 90 }],
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
    id: 'Leech',
    faction: Faction.Undead,
    attacks: [{
      [DamageType.Pierce]: 20,
      [DamageType.Poison]: 60,
    }],
    hp: 60,
    damageModifiers: {
      ...animalDmgModifiers,
      [DamageType.Fire]: DamageModifiers.Immune,
      [DamageType.Poison]: DamageModifiers.Weak,
      [DamageType.Spirit]: DamageModifiers.Immune,
    },
    drop: [
      dropEntry('Bloodbag'),
      dropTrophy('TrophyLeech', 0.1),
    ],
  },
  {
    id: 'Surtling',
    defeatKey: 'surtling', // killed_surtling
    faction: Faction.Demon,
    attacks: [{
      [DamageType.Blunt]: 10,
      [DamageType.Fire]: 40,
    }], // F30
    hp: 20,
    staggerFactor: 0.5,
    damageModifiers: {
      ...defaultDmgModifiers,
      [DamageType.Fire]: DamageModifiers.Immune,
      [DamageType.Frost]: DamageModifiers.Weak,
      [DamageType.Poison]: DamageModifiers.Immune,
      [DamageType.Spirit]: DamageModifiers.Immune,
    },
    drop: [
      dropEntry('Coal', { min: 4, max: 5 }),
      dropEntry('SurtlingCore', { chance: 0.5 }),
      dropTrophy('TrophySurtling', 0.05),
    ],
  },
  {
    id: 'Wraith',
    faction: Faction.Undead,
    attacks: [{
      [DamageType.Slash]: 60,
    }], // F60
    hp: 100,
    staggerFactor: 0.5,
    damageModifiers: {
      ...defaultDmgModifiers,
      [DamageType.Blunt]: DamageModifiers.Resistant,
      [DamageType.Slash]: DamageModifiers.Resistant,
      [DamageType.Pierce]: DamageModifiers.Resistant,
      [DamageType.Fire]: DamageModifiers.Weak,
      [DamageType.Frost]: DamageModifiers.Immune,
      [DamageType.Poison]: DamageModifiers.Immune,
      [DamageType.Spirit]: DamageModifiers.Weak,
    },
    drop: [
      dropEntry('Chain'),
      dropTrophy('TrophyWraith', 0.05),
    ],
  },
  {
    id: 'Draugr',
    faction: Faction.Undead,
    attacks: [
      { [DamageType.Slash]: 48, [DamageType.Chop]: 15 }, // axe, F60
      { [DamageType.Pierce]: 48 }, // bow F18
    ],
    hp: 100,
    damageModifiers: {
      ...animalDmgModifiers,
      [DamageType.Fire]: DamageModifiers.Weak,
      [DamageType.Poison]: DamageModifiers.Immune,
    },
    drop: [
      dropEntry('Entrails'),
      dropTrophy('TrophyDraugr', 0.1),
    ],
  },
  {
    id: 'DraugrElite',
    faction: Faction.Undead,
    attacks: [
      { [DamageType.Slash]: 58 } // sword F60
    ],
    hp: 200,
    damageModifiers: {
      ...animalDmgModifiers,
      [DamageType.Fire]: DamageModifiers.Weak,
      [DamageType.Poison]: DamageModifiers.Immune,
    },
    drop: [
      dropEntry('Entrails', { min: 2, max: 3 }),
      dropTrophy('TrophyDraugrElite', 0.1),  
    ],
  },
  {
    id: 'Bonemass',
    faction: Faction.Boss,
    attacks: [
      { [DamageType.Poison]: 100 }, // AoE F0
      { [DamageType.Blunt]: 80, // punch
        [DamageType.Chop]: 1000,
        [DamageType.Pickaxe]: 1000,
        [DamageType.Poison]: 30,
      }, // sword F0
    ],
    hp: 5000,
    damageModifiers: {
      ...defaultDmgModifiers,
      [DamageType.Blunt]: DamageModifiers.Weak,
      [DamageType.Slash]: DamageModifiers.Resistant,
      [DamageType.Pierce]: DamageModifiers.VeryResistant,
      [DamageType.Fire]: DamageModifiers.VeryResistant,
      [DamageType.Frost]: DamageModifiers.Weak,
      [DamageType.Poison]: DamageModifiers.Immune,
    },
    drop: [
      dropEntry('Wishbone', { perPlayer: true }),
      dropEntry('TrophyBonemass', { scale: false }),
    ],
  },
// MOUNTAINS
  {
    id: 'Wolf',
    faction: Faction.MountainMonsters,
    attacks: [
      { [DamageType.Slash]: 70 }, // 3 different animations, same stats F30
    ],
    hp: 80,
    damageModifiers: animalDmgModifiers,
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
    id: 'Fenring',
    faction: Faction.MountainMonsters,
    attacks: [
      { [DamageType.Slash]: 85 },
      { [DamageType.Slash]: 95 },
    ],
    hp: 150,
    damageModifiers: animalDmgModifiers,
    drop: [
      dropEntry('WolfFang'),
      dropTrophy('TrophyFenring', 0.1),
    ],
  },
  {
    id: 'StoneGolem',
    faction: Faction.MountainMonsters,
    // spike
    attacks: [{ // attackspike F130
      [DamageType.Blunt]: 110,
      [DamageType.Chop]: 100,
      [DamageType.Pickaxe]: 100,
    }, { // spikesweep
      [DamageType.Pierce]: 110,
      [DamageType.Chop]: 100,
      [DamageType.Pickaxe]: 100,
    }, { // slam F130 R8
      [DamageType.Blunt]: 110,
      [DamageType.Chop]: 100,
      [DamageType.Pickaxe]: 100,
    }, { // double smash F120 R8.66
        [DamageType.Blunt]: 110,
        [DamageType.Chop]: 100,
        [DamageType.Pickaxe]: 100,
      }], 
    hp: 800,
    staggerFactor: 0.33,
    damageModifiers: {
      ...defaultDmgModifiers,
      [DamageType.Slash]: DamageModifiers.Resistant,
      [DamageType.Pickaxe]: DamageModifiers.VeryWeak,
      [DamageType.Fire]: DamageModifiers.Immune,
      [DamageType.Frost]: DamageModifiers.Immune,
      [DamageType.Poison]: DamageModifiers.Immune,
      [DamageType.Spirit]: DamageModifiers.Immune,
    },
    drop: [
      dropEntry('FreezeGlands', { min: 5, max: 10 }),
      dropEntry('Crystal', { min: 3, max: 6 }),
      dropTrophy('TrophySGolem', 0.05),
    ],
  },
  {
    id: 'Hatchling', // drake
    faction: Faction.MountainMonsters,
    attacks: [{
      [DamageType.Frost]: 90,
    }], // F30 PB3 BI0.3
    hp: 100,
    staggerFactor: 0,
    damageModifiers: {
      ...animalDmgModifiers,
      [DamageType.Fire]: DamageModifiers.Weak,
      [DamageType.Frost]: DamageModifiers.Immune,
    },
    drop: [
      dropEntry('FreezeGlands', { max: 2 }),
      dropTrophy('TrophyHatchling', 0.1),
    ],
  },
  {
    id: 'Dragon',
    faction: Faction.Boss,
    attacks: [
      {
        [DamageType.Slash]: 120,
        [DamageType.Chop]: 1000,
        [DamageType.Pickaxe]: 1000
      }, // bite F120 R8
      {
        [DamageType.Slash]: 110,
        [DamageType.Chop]: 1000,
        [DamageType.Pickaxe]: 1000
      }, // claw F120 R4
      {
        [DamageType.Chop]: 200,
        [DamageType.Pickaxe]: 200,
        [DamageType.Frost]: 200,
      }, // breath F40
      {
        [DamageType.Pierce]: 30,
        [DamageType.Chop]: 200,
        [DamageType.Pickaxe]: 200,
        [DamageType.Frost]: 200
      } // ice shotgun F30 V25 B16
    ],
    hp: 7500,
    damageModifiers: grayModifiers,
    drop: [
      dropEntry('DragonTear', { min: 10, max: 10, scale: false }),
      dropEntry('TrophyDragonQueen', { scale: false }),
    ],
  },
// PLAINS
  {
    id: 'Goblin', // Fulling
    faction: Faction.PlainsMonsters,
    attacks: [
        { [DamageType.Blunt]: 110 },
        { [DamageType.Pierce]: 110 },
        { [DamageType.Slash]: 110 },
        [{ amount: 55, type: DamageType.Blunt },
         { amount: 55, type: DamageType.Fire }],
        // vs 26 arm 24.3-37.6
        // vs 52 arm 18.6-28.2
        // vs 52 arm & FR 12.5-21.4
    ],
    hp: 200,
    staggerFactor: 0.4,
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
    id: 'GoblinShaman', // Fulling
    faction: Faction.PlainsMonsters,
    attacks: [
      { [DamageType.Blunt]: 100 }, // staff poke
      [{ amount: 20, type: DamageType.Blunt },   // fireball
       { amount: 100, type: DamageType.Fire }],
    ],

    // vs 0 arm 15.1-19.7
    // vs 0 arm & wet 15.1-18.2
    // vs 26 arm 10.9-15.7
    // vs 52 arm 6.5-11.1
    // vs 52 arm + FR 3.8-6.7 (instantly + 5x over time halved due to FR)
    hp: 150,
    staggerFactor: 0.3,
    damageModifiers: animalDmgModifiers,
    drop: [
      dropEntry('Coins', { chance: 0.25, min: 20, max: 40 }),
      dropEntry('BlackMetalScrap', { min: 1, max: 2 }),
      dropTrophy('TrophyGoblinShaman', 0.1),
    ],
  },
  {
    id: 'GoblinBrute', // Berserk
    faction: Faction.PlainsMonsters,
    attacks: [{
      [DamageType.Blunt]: 130,
      [DamageType.Chop]: 100,
      [DamageType.Pickaxe]: 40,
    }, { // TT2 F50
      [DamageType.Blunt]: 130,
      [DamageType.Chop]: 100,
      [DamageType.Pickaxe]: 40,
    }, { // TT2 F70
      [DamageType.Slash]: 80,
      [DamageType.Chop]: 10,
    }], // F50
    hp: 800,
    staggerFactor: 0.3,
    damageModifiers: animalDmgModifiers,
    drop: [
      dropEntry('Coins', { min: 5, max: 20 }),
      dropEntry('BlackMetalScrap', { min: 3, max: 5 }),
      dropTrophy('GoblinTotem', 0.1),
      dropTrophy('TrophyGoblinBrute', 0.05),
    ],
  },
  {
    id: 'Deathsquito',
    faction: Faction.PlainsMonsters,
    attacks: [{ [DamageType.Pierce]: 90 }],
    hp: 10,
    staggerFactor: 0.5,
    damageModifiers: animalDmgModifiers,
    drop: [
      dropEntry('Needle', { scale: false }),
      dropTrophy('TrophyDeathsquito', 0.05),
    ],
  },
  {
    id: 'Lox',
    faction: Faction.PlainsMonsters,
    attacks: [
      { [DamageType.Slash]: 130 }, // bite F150
      { [DamageType.Blunt]: 120,
        [DamageType.Chop]: 100,
        [DamageType.Pickaxe]: 100,
      }, // stomp F100, HTT:T
    ],
    hp: 1000,
    staggerFactor: 1,
    damageModifiers: {
      ...defaultDmgModifiers,
      [DamageType.Blunt]: DamageModifiers.Resistant,
      [DamageType.Slash]: DamageModifiers.Resistant,
      [DamageType.Fire]: DamageModifiers.Weak,
      [DamageType.Frost]: DamageModifiers.Resistant,
      [DamageType.Spirit]: DamageModifiers.Immune,
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
    id: 'GoblinKing', // Yagluth
    defeatKey: 'goblinKing', // boss_goblinking
    faction: Faction.Boss,
    attacks: [
      {
        [DamageType.Blunt]: 50,
        [DamageType.Chop]: 50,
        [DamageType.Pickaxe]: 50,
        [DamageType.Fire]: 60,
      }, // beam F10, "projectileBursts": 20, "burstInterval": 0.1
      {}, // meteors
      {
        [DamageType.Blunt]: 130,
        [DamageType.Chop]: 100,
        [DamageType.Pickaxe]: 100,
      }, // nova F100
      {}, // Taunt
    ],
    hp: 10000,
    staggerFactor: 0.3,
    damageModifiers: {
      ...defaultDmgModifiers,
      [DamageType.Pierce]: DamageModifiers.VeryResistant,
      [DamageType.Fire]: DamageModifiers.Resistant,
      [DamageType.Poison]: DamageModifiers.Immune,
    },
    drop: [
      dropEntry('YagluthDrop', { min: 3, max: 3, scale: false }),
      dropTrophy('TrophyGoblinKing', 1),
    ],
  },
  {
    id: 'Serpent',
    faction: Faction.SeaMonsters,
    attacks: [{
      [DamageType.Slash]: 70, 
    }, { // attack F100
      [DamageType.Slash]: 40,
      [DamageType.Poison]: 5,
    }], // taunt F30
    hp: 400,
    staggerFactor: 0,
    damageModifiers: {
      ...animalDmgModifiers,
      [DamageType.Fire]: DamageModifiers.Immune,
      [DamageType.Frost]: DamageModifiers.Weak,
      [DamageType.Poison]: DamageModifiers.Resistant,
    },
    drop: [
      dropEntry('SerpentScale', { min: 8, max: 10 }),
      dropEntry('SerpentMeat', { min: 6, max: 8 }),
      dropTrophy('TrophySerpent', 0.33),
    ],
  },
];
