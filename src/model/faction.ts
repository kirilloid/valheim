import { data } from '../data/itemDB';
import type { EntityId } from '../types';

interface CreatureProfile {
  id: EntityId;
  tamed: boolean;
  aggro: boolean;
}

export function isEnemy(a: CreatureProfile, b: CreatureProfile) {
  const ca = data[a.id];
  const cb = data[b.id];
  if (ca?.type !== 'creature') return false;
  if (cb?.type !== 'creature') return false;
  if (ca.factionGroup != null
   && cb.factionGroup != null
   && ca.factionGroup === cb.factionGroup) {
    return false;
  }
  if (a.tamed || b.tamed) {
    return !(a.tamed && b.tamed)
      && (!a.tamed || cb.faction !== 'Players')
      && (!b.tamed || ca.faction !== 'Players')
      && (!a.tamed || cb.faction !== 'Dverger' || b.aggro)
      && (!b.tamed || ca.faction !== 'Dverger' || a.aggro);
  }
  if ((a.aggro || b.aggro)
   && ((a.aggro && cb.faction === 'Players')
    || (b.aggro && ca.faction === 'Players'))) {
    return true;
  }
  if (ca.faction == cb.faction) return false;
  switch (ca.faction) {
    case 'Players':
      return cb.faction !== 'Dverger';
    case 'AnimalsVeg':
    case 'PlayerSpawned':
      return true;
    case 'ForestMonsters':
      return cb.faction !== 'AnimalsVeg' && cb.faction !== 'Boss';
    case 'Undead':
      return cb.faction !== 'Demon' && cb.faction !== 'Boss';
    case 'Demon':
      return cb.faction !== 'Undead' && cb.faction !== 'Boss';
    case 'MountainMonsters':
      return cb.faction !== 'Boss';
    case 'SeaMonsters':
      return cb.faction !== 'Boss';
    case 'PlainsMonsters':
      return cb.faction !== 'Boss';
    case 'Boss':
      return cb.faction === 'Players' || cb.faction === 'PlayerSpawned';
    case 'MistlandsMonsters':
      return cb.faction !== 'AnimalsVeg' && cb.faction !== 'Boss';
    case 'Dverger':
      return cb.faction !== 'AnimalsVeg' && cb.faction !== 'Boss' && cb.faction !== 'Players';
    case 'TrainingDummy':
      return cb.faction === 'Players';
    default:
      return false;
  }
}