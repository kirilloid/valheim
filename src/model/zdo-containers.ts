import type { ZDO } from '../file/types';

import { readBase64, writeBase64 } from '../file/base64';
import * as Inventory from '../file/Inventory';
import { stableHashCode } from './hash';
import { PackageWriter } from '../file/Package';
import { prefabHashes } from '../data/zdo';
import { data } from '../data/itemDB';

export type Item = {
  readonly id: string;
  stack: number;
  durability: number;
  quality: number;
  variant: number;
  readonly crafterID: bigint;
  readonly crafterName: string;
  readonly customData: ReadonlyMap<string, string>;
};

const EMPTY_MAP = new Map<string, string>();

function ArmorStand(zdo: ZDO, index: number, onChange: (zdo: ZDO) => void): Item | undefined {
  const id = zdo.strings.get(stableHashCode(index + '_item'));
  if (id == null) return undefined;
  const DURABILITY = stableHashCode(index + '_durability');
  const STACK = stableHashCode(index + '_stack');
  const QUALITY = stableHashCode(index + '_quality');
  const VARIANT = stableHashCode(index + '_variant');
  let customData = EMPTY_MAP;

  return {
    get id() {
      return id;
    },
    get durability() {
      return zdo.ints.get(DURABILITY)!;
    },
    set durability(value: number) {
      zdo.ints.set(DURABILITY, value);
      onChange(zdo);
    },
    get stack() {
      return zdo.ints.get(STACK)!;
    },
    set stack(value: number) {
      zdo.ints.set(STACK, value);
      onChange(zdo);
    },
    get quality() {
      return zdo.ints.get(QUALITY)!;
    },
    set quality(value) {
      zdo.ints.set(QUALITY, value);
      onChange(zdo);
    },
    get variant() {
      return zdo.ints.get(VARIANT)!;
    },
    set variant(value) {
      zdo.ints.set(VARIANT, value);
      onChange(zdo);
    },
    get crafterID() {
      return zdo.longs.get(stableHashCode(index + '_crafterID'))!;
    },
    get crafterName() {
      return zdo.strings.get(stableHashCode(index + '_crafterName'))!;
    },
    get customData() {
      if (customData === EMPTY_MAP) {
        customData = new Map<string, string>();
        const size = zdo.ints.get(stableHashCode(index + '_dataCount')) ?? 0;
        for (let i = 0; i < size; i++) {
          const key = zdo.strings.get(stableHashCode(`${index}_data_${i}`));
          const value = zdo.strings.get(stableHashCode(`${index}_data__${i}`));
          if (key != null && value != null) {
            customData.set(key, value);
          } else {
            console.error(`customData corrupted. Size=${size}, but key[${i}] or value[${i}] is missing`);
          }
        }
      }
      return customData;
    }
  };
};

const ITEMS_HASH = stableHashCode('items');

function Container(zdo: ZDO, index: number, onChange: (zdo: ZDO) => void): Item | undefined {
  const value = zdo.strings.get(ITEMS_HASH);
  if (value == null) return undefined;
  const inventory = Inventory.read(readBase64(value));
  const item = inventory.items[index];
  if (item == null) return undefined;
  function saveInventory() {
    const pkg = new PackageWriter();
    Inventory.write(pkg, inventory);
    const base64 = writeBase64(pkg);
    zdo.strings.set(ITEMS_HASH, base64);
    onChange(zdo);
  }

  return {
    get id() {
      return item.id;
    },
    get durability() {
      return item.durability;
    },
    set durability(value: number) {
      item.durability = value;
      saveInventory();
    },
    get stack() {
      return item.stack;
    },
    set stack(value: number) {
      item.stack = value;
      saveInventory();
    },
    get quality() {
      return item.quality;
    },
    set quality(value) {
      item.quality = value;
      saveInventory();
    },
    get variant() {
      return item.variant;
    },
    set variant(value) {
      item.variant = value;
      saveInventory();
    },
    get crafterID() {
      return item.crafterID;
    },
    get crafterName() {
      return item.crafterName;
    },
    get customData() {
      return item.customData;
    },
  };
}

const ITEM = stableHashCode('item');
const DURABILITY = stableHashCode('durability');
const STACK = stableHashCode('stack');
const QUALITY = stableHashCode('quality');
const VARIANT = stableHashCode('variant');
const CRAFTER_ID = stableHashCode('crafterID');
const CRAFTER_NAME = stableHashCode('crafterName');
const DATA_COUNT = stableHashCode('dataCount');

function ItemStand(zdo: ZDO, index: number, onChange: (zdo: ZDO) => void): Item | undefined {
  const id = zdo.strings.get(ITEM);
  if (id == null) return undefined;
  let customData = EMPTY_MAP;

  return {
    get id() {
      return id;
    },
    get durability() {
      return zdo.ints.get(DURABILITY)!;
    },
    set durability(value: number) {
      zdo.ints.set(DURABILITY, value);
      onChange(zdo);
    },
    get stack() {
      return zdo.ints.get(STACK)!;
    },
    set stack(value: number) {
      zdo.ints.set(STACK, value);
      onChange(zdo);
    },
    get quality() {
      return zdo.ints.get(QUALITY)!;
    },
    set quality(value) {
      zdo.ints.set(QUALITY, value);
      onChange(zdo);
    },
    get variant() {
      return zdo.ints.get(VARIANT)!;
    },
    set variant(value) {
      zdo.ints.set(VARIANT, value);
      onChange(zdo);
    },
    get crafterID() {
      return zdo.longs.get(CRAFTER_ID)!;
    },
    get crafterName() {
      return zdo.strings.get(CRAFTER_NAME)!;
    },
    get customData() {
      if (customData !== EMPTY_MAP) return customData;
      customData = new Map();
      const size = zdo.ints.get(DATA_COUNT) ?? 0;
      for (let i = 0; i < size; i++) {
        const key = zdo.strings.get(stableHashCode(`data_${i}`))!;
        const value = zdo.strings.get(stableHashCode(`data__${i}`))!;
        customData.set(key, value);
      }
      return customData;
    }
  };
}

export function VirtualItem(zdo: ZDO, index: number, onChange: (zdo: ZDO) => void): Item | undefined {
  const id = prefabHashes.get(zdo.prefab);
  const components = id == null ? id : data[id]?.components;
  if (components == null) return undefined;
  for (const cmp of components) {
    switch (cmp) {
      case 'ArmorStand':
        return ArmorStand(zdo, index, onChange);
      case 'Container':
        return Container(zdo, index, onChange);
      case 'ItemStand':
        return ItemStand(zdo, index, onChange);
    }
  }
}
