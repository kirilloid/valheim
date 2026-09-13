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
  Crypt = 0x1,
  SunkenCrypt = 0x2,
  Cave = 0x4,
  ForestCrypt = 0x8,
  GoblinCamp = 0x10,
  MeadowsVillage = 0x20,
  MeadowsFarm = 0x40,
  DvergrTown = 0x80,
  DvergrBoss = 0x100,
  ForestCryptHildir = 0x200,
  CaveHildir = 0x400,
  PlainsFortHildir = 0x800,
  AshlandsRuins = 0x1000,
  FortressRuins = 0x2000,
  Hole = 0x4000,
  NorthVillage = 0x10000,
  Morkhalla = 0x20000,
}
