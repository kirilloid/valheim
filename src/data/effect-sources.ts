import type { EntityId } from '../types';

import { resources } from './resources';
import { items as armors } from './armors';

const effectSources: Record<EntityId, string> = {};
for (const res of resources) {
  if (res.power) {
    effectSources[res.power] = res.id;
  }
}

for (const item of armors) {
  if (item.adrenaline?.effect) {
    effectSources[item.adrenaline.effect.id] = item.id;
  }
}
