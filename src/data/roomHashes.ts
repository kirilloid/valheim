import { stableHashCode } from '../model/utils';
import { forestcrypt, gobvill, sunkencrypt, woodfarm, CampConfig, DungeonRoomsConfig } from './rooms';

export const roomHashes = new Map<number, string>();

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

addCamp(gobvill);
addCamp(woodfarm);
