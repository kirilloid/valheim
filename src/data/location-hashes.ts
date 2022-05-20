import { stableHashCode } from '../model/hash';
import { locations } from './location';

export const locationHashes = new Map<number, string>();

for (const loc of locations) {
  const hash = stableHashCode(loc.id);
  locationHashes.set(hash, loc.id);
}
