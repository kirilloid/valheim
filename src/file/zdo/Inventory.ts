import type { ZDO } from '../types';
import type { Item } from '../Inventory';

import { stableHashCode } from '../../model/hash';
import * as Inventory from '../../file/Inventory';

import { readBase64, writeBase64 } from '../base64';
import { PackageReader, PackageWriter } from '../Package';

const ITEMS_HASH = stableHashCode('items');

interface WritableInventory {
  items: Item[];
  save(): void;
}

export function extractInventory(zdo: ZDO): WritableInventory {
  const value = zdo.strings.get(ITEMS_HASH) ?? zdo.byteArrays.get(ITEMS_HASH);
  if (value == null) return {
    items: [],
    save() {},
  };
  const inventory = Inventory.read(
    typeof value === 'string'
    ? readBase64(value)
    : new PackageReader(value)
  );
  return {
    items: inventory.items,
    save() {
      const pkg = new PackageWriter();
      Inventory.write(pkg, inventory);
      if (typeof value === 'string') {
        zdo.strings.set(ITEMS_HASH, writeBase64(pkg));
      } else {
        zdo.byteArrays.set(ITEMS_HASH, pkg.flush());
      }
    }
  }
}
