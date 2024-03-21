import type { LocationItem } from '../../types';

import type { Distribution } from '../../model/dist';

export type DungeonRoomsConfig = {
  type: 'dungeon';
  prefix: string,
  rooms: RoomConfig[];
};

export type CampConfig = {
  type: 'camp';
  prefix: string,
  inner: CamplaceConfig[];
  perimeter: CamplaceConfig[];
};

export type RoomConnection = {
  pos: [x: number, y: number, z: number],
  type?: string;
  entrance?: boolean;
  allowDoor?: boolean;
};

export type RoomConfig = {
  id: string;
  theme: Theme;
} & ({
  type: 'start';
} | {
  type: 'middle';
  minPlaceOrder?: number;
} | {
  type: 'end';
  minPlaceOrder?: number;
  endCapPriority?: number;
}) & {
  size: [number, number, number];
  weight: number;
  connections: RoomConnection[];
  items: LocationItem[];
  dist: Distribution;
};

export type CamplaceConfig = {
  id: string;
  theme: Theme;
  size: [number, number, number];
  weight: number;
  items: LocationItem[];
  dist: Distribution;
};

export enum Theme {
  None = 0,
  Crypt = 1,
  SunkenCrypt = 2,
  Cave = 4,
  ForestCrypt = 8,
  GoblinCamp = 16,
  MeadowsVillage = 32,
  MeadowsFarm = 64,
  DvergrTown = 128,
  DvergrBoss = 256,
  ForestCryptHildir = 512,
  CaveHildir = 1024,
  PlainsFortHildir = 2048,
  AshlandsRuins = 4096,
  FortressRuins = 8192,
}
