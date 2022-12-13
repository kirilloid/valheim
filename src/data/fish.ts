import type { Deadspeak, Fish } from '../types';
import { spawner } from '../model/spawner';

const baitsNormal = {
  FishingBait: 1,
  FishingBaitAshlands: 0.3,
  FishingBaitCave: 0.3,
  FishingBaitDeepNorth: 0.3,
  FishingBaitForest: 0.3,
  FishingBaitMistlands: 0.3,
  FishingBaitOcean: 0.3,
  FishingBaitPlains: 0.3,
  FishingBaitSwamp: 0.3,
};

function deadSpeakFish(texts: string[]): Deadspeak {
  return {
    interval: 60,
    chance: 0.02,
    triggerDistance: 10,
    ttl: 15,
    texts,
  };
}

export const fishes: Fish[] = [
  {
    type: 'fish',
    id: 'Fish1',
    components: ['Fish'],
    tags: ['fish'],
    tier: 1,
    emoji: '🐟',
    stack: 10,
    weight: [2, 1],
    spawners: [spawner({
      tier: 0,
      biomes: ['Meadows', 'BlackForest', 'Plains'],
      maxSpawned: 5,
      interval: 120,
      chance: 0.5,
      distance: 20,
      envs: [],
      groupSize: [2, 6],
      groupRadius: 2,
      altitude: [-3, -1.5],
      tilt: [0, 99],
      offset: 0.1,
      levels: [1, 5],
      levelUpChance: 0.2,
    })],
    speed: 3,
    turnSpeed: 100,
    baits: baitsNormal,
    staminaUse: 4,
    Deadspeak: deadSpeakFish([
      'ui.deadspeak.fishared1',
      'ui.deadspeak.fishared2',
      'ui.deadspeak.fish1',
    ]),
  },
  {
    type: 'fish',
    id: 'Fish2',
    components: ['Fish'],
    tags: ['fish'],
    tier: 1,
    emoji: '🐟',
    stack: 10,
    weight: [2, 1],
    spawners: [spawner({
      tier: 0,
      biomes: ['Meadows', 'BlackForest', 'Plains'],
      maxSpawned: 4,
      interval: 120,
      chance: 0.5,
      distance: 20,
      envs: [],
      groupSize: [2, 4],
      groupRadius: 2,
      altitude: [-5, -2],
      tilt: [0, 99],
      offset: 0.1,
      levels: [1, 5],
    })],
    speed: 5,
    turnSpeed: 100,
    baits: baitsNormal,
    staminaUse: 6,
    Deadspeak: deadSpeakFish([
      'ui.deadspeak.fishared1',
      'ui.deadspeak.fishared2',
      'ui.deadspeak.fish2',
    ]),
  },
  {
    type: 'fish',
    id: 'Fish3',
    components: ['Fish'],
    tags: ['fish'],
    tier: 1,
    emoji: '🐟',
    stack: 10,
    weight: [2, 1],
    spawners: [spawner({
      tier: 0,
      biomes: ['Meadows', 'BlackForest', 'Plains', 'Ocean'],
      maxSpawned: 3,
      interval: 120,
      chance: 0.5,
      distance: 20,
      envs: [],
      groupSize: [1, 2],
      groupRadius: 2,
      altitude: [-999, -5],
      tilt: [0, 99],
      offset: 0.1,
      levels: [1, 5],
      levelUpChance: 0.2,
    })],
    speed: 10,
    turnSpeed: 80,
    baits: baitsNormal,
    staminaUse: 8,
    Deadspeak: deadSpeakFish([
      'ui.deadspeak.fishared1',
      'ui.deadspeak.fishared2',
      'ui.deadspeak.fish3',
    ]),
  },
  {
    type: 'fish',
    id: 'Fish4_cave',
    components: ['Fish'],
    tags: ['fish'],
    tier: 4,
    emoji: '🐟',
    stack: 10,
    weight: [2, 1],
    spawners: [],
    speed: 10,
    turnSpeed: 80,
    baits: { FishingBaitCave: 1 },
    staminaUse: 12,
    Deadspeak: deadSpeakFish([
      'ui.deadspeak.fishared1',
      'ui.deadspeak.fishared2',
      'ui.deadspeak.fish4',
    ]),
  },
  {
    type: 'fish',
    id: 'Fish5',
    components: ['Fish'],
    tags: ['fish'],
    tier: 1,
    emoji: '🐟',
    stack: 10,
    weight: [2, 1],
    spawners: [spawner({
      tier: 2,
      biomes: ['BlackForest'],
      maxSpawned: 10,
      interval: 80,
      chance: 0.5,
      distance: 12,
      envs: [],
      groupSize: [3, 7],
      groupRadius: 2,
      altitude: [-999, -5],
      tilt: [0, 99],
      offset: 0.1,
      levels: [1, 5],
      levelUpChance: 0.2,
    })],
    speed: 10,
    turnSpeed: 80,
    baits: { FishingBaitForest: 1 },
    staminaUse: 10,
    Deadspeak: deadSpeakFish([
      'ui.deadspeak.fishared1',
      'ui.deadspeak.fishared2',
      'ui.deadspeak.fish5',
    ]),
  },
  {
    type: 'fish',
    id: 'Fish6',
    components: ['Fish'],
    tags: ['fish'],
    tier: 1,
    emoji: '🐟',
    stack: 10,
    weight: [2, 1],
    spawners: [spawner({
      tier: 0,
      biomes: ['Swamp'],
      maxSpawned: 10,
      interval: 80,
      chance: 0.6,
      distance: 10,
      envs: [],
      groupSize: [3, 7],
      groupRadius: 2,
      altitude: [-999, -5],
      tilt: [0, 99],
      offset: 0.1,
      levels: [1, 5],
      levelUpChance: 0.2,
    })],
    speed: 10,
    turnSpeed: 80,
    baits: { FishingBaitSwamp: 1 },
    staminaUse: 12,
    Deadspeak: deadSpeakFish([
      'ui.deadspeak.fishared1',
      'ui.deadspeak.fishared2',
      'ui.deadspeak.fish6',
    ]),
  },
  {
    type: 'fish',
    id: 'Fish7',
    components: ['Fish'],
    tags: ['fish'],
    tier: 1,
    emoji: '🐠',
    stack: 10,
    weight: [2, 1],
    spawners: [spawner({
      tier: 5,
      biomes: ['Plains'],
      maxSpawned: 7,
      interval: 80,
      chance: 0.6,
      distance: 20,
      envs: [],
      groupSize: [3, 6],
      groupRadius: 2,
      altitude: [-999, -5],
      tilt: [0, 99],
      offset: 0.1,
      levels: [1, 5],
      levelUpChance: 0.2,
    })],
    speed: 10,
    turnSpeed: 80,
    baits: { FishingBaitPlains: 1 },
    staminaUse: 14,
    Deadspeak: deadSpeakFish([
      'ui.deadspeak.fishared1',
      'ui.deadspeak.fishared2',
      'ui.deadspeak.fish7',
    ]),
  },
  {
    type: 'fish',
    id: 'Fish8',
    components: ['Fish'],
    tags: ['fish'],
    tier: 3,
    emoji: '🐠',
    stack: 10,
    weight: [2, 1],
    spawners: [spawner({
      tier: 0,
      biomes: ['Ocean'],
      maxSpawned: 10,
      interval: 80,
      chance: 0.5,
      distance: 12,
      envs: [],
      groupSize: [2, 7],
      groupRadius: 2,
      altitude: [-999, -5],
      tilt: [0, 99],
      offset: 0.1,
      levels: [1, 5],
      levelUpChance: 0.2,
    })],
    speed: 10,
    turnSpeed: 80,
    baits: { FishingBaitOcean: 1 },
    staminaUse: 14,
    Deadspeak: deadSpeakFish([
      'ui.deadspeak.fishared1',
      'ui.deadspeak.fishared2',
      'ui.deadspeak.fish8',
    ]),
  },
  {
    type: 'fish',
    id: 'Fish9',
    components: ['Fish'],
    tags: ['fish'],
    tier: 6,
    emoji: '🐠',
    stack: 10,
    weight: [2, 1],
    spawners: [spawner({
      tier: 0,
      biomes: ['Mistlands'],
      maxSpawned: 5,
      interval: 60,
      chance: 0.5,
      distance: 12,
      envs: [],
      groupSize: [2, 7],
      groupRadius: 2,
      altitude: [-999, -5],
      tilt: [0, 99],
      offset: 0.1,
      levels: [1, 5],
      levelUpChance: 0.2,
    })],
    speed: 10,
    turnSpeed: 80,
    baits: { FishingBaitMistlands: 1 },
    staminaUse: 16,
    Deadspeak: deadSpeakFish([
      'ui.deadspeak.fishared1',
      'ui.deadspeak.fishared2',
      'ui.deadspeak.fish9',
    ]),
  },
  {
    type: 'fish',
    id: 'Fish12',
    components: ['Fish'],
    tags: ['fish'],
    tier: 5,
    emoji: '🐡',
    stack: 10,
    weight: [2, 1],
    spawners: [spawner({
      tier: 0,
      biomes: ['Ocean', 'Mistlands'],
      maxSpawned: 8,
      interval: 80,
      chance: 0.4,
      distance: 12,
      envs: [],
      groupSize: [2, 5],
      groupRadius: 2,
      altitude: [-999, -6],
      tilt: [0, 99],
      offset: 0.1,
      levels: [1, 5],
      levelUpChance: 0.2,
    })],
    speed: 10,
    turnSpeed: 80,
    baits: { FishingBaitMistlands: 1 },
    staminaUse: 16,
    Deadspeak: deadSpeakFish([
      'ui.deadspeak.fishared1',
      'ui.deadspeak.fishared2',
      'ui.deadspeak.fish12',
    ]),
  },
  {
    type: 'fish',
    id: 'Fish10',
    components: ['Fish'],
    tags: ['fish'],
    tier: 1,
    emoji: '🐠',
    stack: 10,
    weight: [2, 1],
    spawners: [spawner({
      tier: 0,
      biomes: ['DeepNorth'],
      maxSpawned: 10,
      interval: 70,
      chance: 0.6,
      distance: 12,
      envs: [],
      groupSize: [3, 10],
      groupRadius: 3,
      altitude: [-999, -5],
      tilt: [0, 99],
      offset: 0.1,
      levels: [1, 5],
      levelUpChance: 0.15,
    })],
    speed: 10,
    turnSpeed: 80,
    baits: { FishingBaitDeepNorth: 1 },
    staminaUse: 20,
    Deadspeak: deadSpeakFish([
      'ui.deadspeak.fishared1',
      'ui.deadspeak.fishared2',
      'ui.deadspeak.fish10',
    ]),
  },
  {
    type: 'fish',
    id: 'Fish11',
    components: ['Fish'],
    tags: ['fish'],
    tier: 1,
    emoji: '🐠',
    stack: 10,
    weight: [2, 1],
    spawners: [spawner({
      tier: 0,
      biomes: ['Ashlands'],
      maxSpawned: 10,
      interval: 80,
      chance: 0.6,
      distance: 8,
      envs: [],
      groupSize: [3, 7],
      groupRadius: 2,
      altitude: [-999, -5],
      tilt: [0, 99],
      offset: 0.1,
      levels: [1, 5],
      levelUpChance: 0.2,
    })],
    speed: 10,
    turnSpeed: 80,
    baits: { FishingBaitAshlands: 1 },
    staminaUse: 20,
    Deadspeak: deadSpeakFish([
      'ui.deadspeak.fishared1',
      'ui.deadspeak.fishared2',
      'ui.deadspeak.fish11',
    ]),
  },
];