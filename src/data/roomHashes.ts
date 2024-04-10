import { stableHashCode } from '../model/hash';
import {
  dvergrTown, forestcrypt, frostCaves, gobvill, sunkencrypt, woodfarm, woodvillage,
  CampConfig, DungeonRoomsConfig,
} from './rooms';

export const roomHashes = new Map<number, string>();
// missing in caves: 1552127445, 1955411972, 389328031

function addRoom(prefix: string, id: string) {
  const key = prefix + id;
  const hash = stableHashCode(key);
  roomHashes.set(hash, key);
}

function addDungeon(dungeon: DungeonRoomsConfig) {
  for (const room of dungeon.rooms) addRoom(dungeon.prefix, room.id);
}

function addCamp(camp: CampConfig) {
  for (const room of camp.inner) addRoom(camp.prefix, room.id);
  for (const room of camp.perimeter) addRoom(camp.prefix, room.id);
}

addDungeon(forestcrypt);
addDungeon(sunkencrypt);
addDungeon(dvergrTown);
addDungeon(frostCaves);

addCamp(gobvill);
addCamp(woodfarm);
addCamp(woodvillage);
