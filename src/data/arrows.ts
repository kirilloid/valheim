import type { Arrow } from '../types';
import { dmg } from '../model/game';

export const arrows: Arrow[] = [
  { type: 'ammo', id: 'ArrowWood', tier: 1, weight: 0.1, stack: 100,
    damage: dmg({ pierce: 22 }), knockback: 10,
  },
  { type: 'ammo', id: 'ArrowFire', tier: 1, weight: 0.1, stack: 100,
    damage: dmg({ pierce: 11, fire: 22 }), knockback: 10,
  },
  { type: 'ammo', id: 'ArrowFlint', tier: 1, weight: 0.1, stack: 100,
    damage: dmg({ pierce: 26 }), knockback: 10,
  },
  { type: 'ammo', id: 'ArrowBronze', tier: 2, weight: 0.1, stack: 100,
    damage: dmg({ pierce: 32 }), knockback: 10,
  },
  { type: 'ammo', id: 'ArrowIron', tier: 3, weight: 0.1, stack: 100,
    damage: dmg({ pierce: 42 }), knockback: 10,
  },
  { type: 'ammo', id: 'ArrowSilver', tier: 4, weight: 0.1, stack: 100,
    damage: dmg({ pierce: 52, spirit: 20 }), knockback: 10,
  },
  { type: 'ammo', id: 'ArrowObsidian', tier: 4, weight: 0.1, stack: 100,
    damage: dmg({ pierce: 52 }), knockback: 10,
  },
  { type: 'ammo', id: 'ArrowPoison', tier: 4, weight: 0.1, stack: 100,
    damage: dmg({ pierce: 26, poison: 52 }), knockback: 10,
  },
  { type: 'ammo', id: 'ArrowFrost', tier: 4, weight: 0.1, stack: 100,
    damage: dmg({ pierce: 26, frost: 52 }), knockback: 10,
  },
  { type: 'ammo', id: 'ArrowNeedle', tier: 5, weight: 0.1, stack: 100,
    damage: dmg({ pierce: 62 }), knockback: 15,
  },
  /*{ type: 'ammo', id: 'draugr_arrow', tier: -1, weight: 1, stack: 20,
    damage: dmg({ pierce: 15 }), knockback: 35,
  },*/
];

for (const arrow of arrows) {
  arrow.components = ['ItemDrop'];
}
