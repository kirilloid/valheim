import type { Cart, EntityId, GeneralDrop, LocationItem, Piece, Ship, Siege } from '../types';

import * as fs from 'fs';
import { resolve } from 'path';

import { creatures } from './creatures';
import { events } from './events';
import { data } from './itemDB';
import { locations } from './location';
import { objects } from './objects';
import { recipes } from './recipes';
import { resources } from './resources';
import { items } from './weapons';
import { spawners } from './spawners';
import { fishes } from './fish';
import { pieces } from './building';
import { ships, carts, siege } from './transport';

import * as rooms from './rooms';
import { iconPath } from '../view/parts/Icon';

function resolvePath(path: string): string {
  const localPath = `../../public${path}`;
  return resolve(__dirname, localPath);
}

// SOURCE_RECIPE
// SOURCE_GROW
// SOURCE_BAIT

const sourced = new Set<EntityId>();

// SOURCE_CRAFT
for (const { item } of recipes) {
  sourced.add(item);
}

for (const p of pieces) if (p.recipe != null) sourced.add(p.id);
for (const s of ships) if (s.recipe != null) sourced.add(s.id);
for (const c of carts) if (c.recipe != null) sourced.add(c.id);
for (const s of siege) if (s.recipe != null) sourced.add(s.id);

for (const s of spawners) {
  sourced.add(s.spawn);
}

// SOURCE_DROP
for (const c of creatures) {
  for (const { item } of c.drop) sourced.add(item);
  if (c.spawners.length > 0) sourced.add(c.id);
  for (const av of c.attacks) {
    for (const ap of av.attacks) {
      if ('spawn' in ap) {
        for (const id of ap.spawn) {
          sourced.add(id);
        }
      }
    }
  }
}

for (const f of fishes) {
  sourced.add(f.id);
}

for (const r of resources) {
  // SOURCE_GROW
  if (r.grow) sourced.add(r.id);
  if (r.EggGrow) sourced.add(r.EggGrow.grownId);
}

for (const o of objects) {
  for (const gd of o.drop ?? []) {
    for (const { item } of gd.options) sourced.add(item);
  }
  for (const { id } of (o.Destructible?.parts ?? [])) sourced.add(id);
  if (o.grow) sourced.add(o.id);
  if (o.Plant) sourced.add(o.id);
}

function walkAddItem({ item }: LocationItem) {
  if (typeof item === 'string') {
    sourced.add(item);
  } else {
    item.forEach(walkAddItem);
  }
}

for (const l of locations) {
  l.items.forEach(walkAddItem);
  if (l.dungeon) {
    for (const r of l.dungeon.rooms) {
      r.items.forEach(walkAddItem);
    }
  }
  if (l.camp) {
    for (const r of l.camp.inner) {
      r.items.forEach(walkAddItem);
    }
    for (const r of l.camp.perimeter) {
      r.items.forEach(walkAddItem);
    }
  }
}

for (const e of events) {
  for (const s of e.spawns) {
    sourced.add(s.id);
  }
}

// either child (egg->chicken) or parent (other animals) should already be reachable
for (const c of creatures) {
  const childId = c.pregnancy?.childId;
  if (childId != null) {
    if (sourced.has(c.id) || sourced.has(childId)) {
      sourced.add(childId);
      sourced.add(c.id);
    }
  }
}

for (const i of items) {
  if (i.type === 'weapon') {
    for (const a of i.attacks) {
      if (a.type === 'summon') {
        sourced.add(a.summons);
      }
    }
  }
}

const exceptions = new Set<EntityId>([
  // these ones are intentional
  'PlayerUnarmed',
  'Player_tombstone',
  'CargoCrate',
  'Pickable_MountainRemains01_buried',
  // TODO: add later
  'RuneStone',
]);

describe('traceability of all objects', () => {
  test('every object has a source', () => {
    const untraced = [];
    for (const [id, obj] of Object.entries(data)) {
      if (obj.mod != null) continue;
      if (obj.disabled) continue;
      if (!sourced.has(id) && !exceptions.has(id)) {
        untraced.push(id);
      }
    }
    expect(untraced).toEqual([]);  
  });

  test('all recipes use valid entities', () => {
    const failPairs: [EntityId, EntityId][] = [];
    function check(parent: EntityId, item: EntityId) {
      if (!(item in data)) failPairs.push([parent, item]);
    }

    function checkPiece(p: Piece | Ship | Cart | Siege) {
      if (p.recipe != null) {
        for (const key in p.recipe.materials) {
          check(p.id, key);
        }
        if (p.recipe.station !== null) {
          check(p.id, p.recipe.station);
        }
      }
    }

    for (const r of recipes) {
      if (r.type === 'craft') {
        for (const key in r.materials) check(r.item, key);
        for (const key in r.materialsPerLevel) check(r.item, key);
      }
    }
    pieces.forEach(checkPiece);
    ships.forEach(checkPiece);
    carts.forEach(checkPiece);
    siege.forEach(checkPiece);
    expect(failPairs).toEqual([]);
  });

  test('all drops use valid entities', () => {
    const failPairs: [EntityId, EntityId][] = [];
    function check(parent: EntityId, item: EntityId) {
      if (!(item in data)) failPairs.push([parent, item]);
    }
    function checkWithDrop<T extends { drop?: GeneralDrop[]; id: EntityId }>(obj: T) {
      if (obj.drop != null) {
        for (const drop of obj.drop) {
          for (const { item } of drop.options) {
            check(obj.id, item);
          }
        }
      }
    }

    for (const c of creatures) {
      for (const entry of c.drop) {
        check(c.id, entry.item);
      }
    }
    objects.forEach(checkWithDrop);

    expect(failPairs).toEqual([]);
  });

  xtest('all location items are valid entities', () => {
    const failItems = new Set<EntityId>();

    function walkCheckItem({ item }: LocationItem) {
      if (typeof item === 'string') {
        if (!(item in data)) {
          failItems.add(item);
        }
      } else {
        item.forEach(walkCheckItem);
      }
    }
    
    for (const l of locations) {
      // to many undeclared objects
      if (l.id === 'Hildir_camp') continue;
      l.items.forEach(walkCheckItem);
      if (l.dungeon) {
        for (const r of l.dungeon.rooms) {
          r.items.forEach(walkCheckItem);
        }
      }
      if (l.camp) {
        for (const r of l.camp.inner) {
          r.items.forEach(walkCheckItem);
        }
        for (const r of l.camp.perimeter) {
          r.items.forEach(walkCheckItem);
        }
      }
    }
    
    expect(failItems).toEqual(new Set());
  });
});

function testDungeon(name: string, dungeon: rooms.DungeonRoomsConfig) {
  describe(name, () => {
    for (const room of dungeon.rooms) {
      test(`room ${room.id} should have dist sum within error`, () => {
        const total = room.dist.reduce((a, b) => a + b, 0);
        expect(Math.abs(total - 1)).toBeLessThan(Number.EPSILON * room.dist.length);
      });
    }
  });
}


function testCamp(name: string, camp: rooms.CampConfig) {
  describe(name, () => {
    for (const room of camp.inner) {
      test(`room ${room.id} should have dist sum within error`, () => {
        const total = room.dist.reduce((a, b) => a + b, 0);
        expect(Math.abs(total - 1)).toBeLessThan(Number.EPSILON * room.dist.length);
      });
    }
    for (const room of camp.perimeter) {
      test(`room ${room.id} should have dist sum within error`, () => {
        const total = room.dist.reduce((a, b) => a + b, 0);
        expect(Math.abs(total - 1)).toBeLessThan(Number.EPSILON * room.dist.length);
      });
    }
  });
}

describe('dungeons - rooms', () => {
  testDungeon('dvergrTown', rooms.dvergrTown);
  testDungeon('forestcrypt', rooms.forestcrypt);
  testDungeon('frostCaves', rooms.frostCaves);
  testDungeon('sunkencrypt', rooms.sunkencrypt);
  testCamp('woodfarm', rooms.woodfarm);
  testCamp('woodvillage', rooms.woodvillage);
  testCamp('gobvill', rooms.gobvill);
  testCamp('charredRuins', rooms.charredRuins);
  testCamp('fortressRuins', rooms.fortressRuins);
});

xtest('icons', (done) => {
  const entries = Object.entries(data);

  let fails: EntityId[] = [];
  let passed = 0;
  for (const [id, item] of entries) {
    const path = resolvePath(`${iconPath(item)}.png`);
    if (item.disabled
    ||  item.mod
    ||  item.type === 'spawner'
    ) {
      passed++;
      continue;
    }
    fs.stat(path, (err) => {
      passed++;
      if (err != null) fails.push(id);
      if (passed === entries.length) {
        if (fails.length === 0) {
          done();
        } else {
          const failsStr = fails.join(', ');
          const arrayStr = `Array (${fails.length}) [${failsStr.slice(0, 1000)}${failsStr.length > 1000 ? '...' : ''}]`;
          done("Those entities don't have icon: " + arrayStr);
        }
      }
    });
  }  
}, 10000);

xtest('l18n', (done) => {
  const entries = Object.entries(data);

  let fails: EntityId[] = [];
  let passed = 0;
  fs.readFile(resolvePath(`/lang/en.json`), 'utf8', (err, data) => {
    if (err != null) {
      done(err.message);
    }
    const loc = JSON.parse(data);
    for (const [id, item] of entries) {
      if (!(id in loc)) {
        fails.push(id);
      }
    }
    if (fails.length === 0) {
      done();
    } else {
      const failsStr = fails.join(', ');
      const arrayStr = `Array (${fails.length}) [${failsStr.slice(0, 1000)}${failsStr.length > 1000 ? '...' : ''}]`;
      done("Those entities don't have translation: " + arrayStr);
    }
  });

}, 10000);
