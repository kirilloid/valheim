export const gameSettings = {
  playerdamage: 100,
  enemydamage: 100,
  worldlevel: 0,
  eventrate: 100,
  resourcerate: 100,

  staminarate: 100,
  movestaminarate: 100,
  staminaregenrate: 100,

  skillgainrate: 100,
  skillreductionrate: 100,

  enemyspeedsize: 100,
  enemyleveluprate: 100,

  nomap: false,
  teleportall: false,
  noportals: false,
  nobossportals: false,
  passivemobs: false,
  deathkeepequip: false,
  deathnoskillslost: false,
  deathskillsreset: false,
  deathdeleteitems: false,
  deathdeleteunequipped: false,
  nobuildcost: false,
  nocraftcost: false,
  allpiecesunlocked: false,
  noworkbench: false,
  allrecipesunlocked: false,
  activebosses: false,
  worldlevellockedtools: false,
  dungeonbuild: false,
  preset: '',
  nonserveroption: '',
  
  playerevents: false,
  fire: false,

  // defeated_eikthyr,
  // defeated_dragon,
  // defeated_goblinking,
  // defeated_gdking,
  // defeated_bonemass,
  // KilledTroll,
  // killed_surtling,
  // KilledBat,
};

type Difficulty = 'easy' | 'hard' | 'hardcore' | 'casual' | 'hammer' | 'immersive';

export const presets: Record<Difficulty, Partial<typeof gameSettings>> = {
  easy: {
    playerdamage: 110,
    enemydamage: 75,
    eventrate: 150,
    enemyspeedsize: 95,
  },
  hard: {
    playerdamage: 85,
    enemydamage: 150,
    eventrate: 60,
    enemyspeedsize: 110,
    enemyleveluprate: 120,
  },
  hardcore: {
    playerdamage: 70,
    enemydamage: 200,
    eventrate: 60,
    deathskillsreset: true,
    deathdeleteitems: true,
    nomap: true,
    nobossportals: true,
    enemyspeedsize: 120,
    enemyleveluprate: 140,
  },
  casual: {
    passivemobs: true,
    eventrate: 0,
    resourcerate: 150,
    playerdamage: 125,
    enemydamage: 50,
    deathkeepequip: true,
    skillreductionrate: 15,
    teleportall: true,
    playerevents: true,
    enemyspeedsize: 90,
  },
  hammer: {
    nobuildcost: true,
    passivemobs: true,
    eventrate: 0,
  },
  immersive: {
    nomap: true,
    noportals: true,
  },
  // veryhard: {
  //   playerdamage: 70,
  //   enemydamage: 200,
  //   enemyspeedsize: 120,
  //   enemyleveluprate: 140,
  // },
  // veryeasy: {
  //   playerdamage: 125,
  //   enemydamage: 50,
  //   enemyspeedsize: 90,
  // },
}/* as const satisfies Record<string, Partial<GameSettings>>*/;