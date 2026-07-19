import { itemHashes, data } from '../data/itemDB';
import { hashPrefab, Vector2i } from '../model/utils';
import type { PackageReader, PackageWriter } from './Package';
import { checkVersion, INVENTORY } from './versions';

export type Item = {
  readonly id: string;
  stack: number;
  durability: number;
  gridPos: Vector2i;
  equipped: boolean;
  quality: number;
  variant: number;
  crafterID: bigint;
  crafterName: string;
  customData: Map<string, string>;
  worldLevel: number;
  pickedUp: boolean;
};

export type Data = {
  version: number;
  items: Item[];
};

function readItemOld(pkg: PackageReader, version: number): Item {
  const id = pkg.readString();
  const stack = pkg.readInt();
  const durability = pkg.readFloat();
  const gridPos = pkg.readVector2i();
  const equipped = pkg.readBool();
  const quality = version >= 101 ? pkg.readInt() : 1;
  const variant = version >= 102 ? pkg.readInt() : 0;
  const crafterID = version >= 103 ? pkg.readLong() : BigInt(0);
  const crafterName = version >= 103 ? pkg.readString() : "";
  const customData = version >= 104 ? pkg.readMap(pkg.readString, pkg.readString) : new Map<string, string>();
  const worldLevel = version >= 105 ? pkg.readInt() : 0;
  const pickedUp = version >= 106 ? pkg.readBool() : false;
  return { id, stack, durability, gridPos, equipped, quality, variant, crafterID, crafterName, customData, worldLevel, pickedUp };
}

function readItemNew(pkg: PackageReader, version: number): Item {
  const durability = pkg.readInt() * 0.01;
  const gridPos = {
    x: pkg.readByte(),
    y: pkg.readByte(),
  }
  const worldLevel = pkg.readByte();
  const _flags = pkg.readByte();
  const pickedUp = (_flags & 1) > 0;
  const equipped = (_flags & 2) > 0;
  const quality = (_flags & 4) ? pkg.readUShort() : 1;
  const stack = (_flags & 8) ? pkg.readUShort() : 1;
  const variant = (_flags & 16) ? pkg.readInt() : 0;
  const crafterID = (_flags & 32) ? pkg.readLong() : BigInt(0);
  const crafterName = (_flags & 32) ? pkg.readString() : "";
  const prefab = (_flags & 64) ? pkg.readInt() : 0;
  const customData = new Map<string, string>();
  if (_flags & 128) {
    const num = pkg.readNumItems();
    for (let i = 0; i < num; i++) {
      const key = pkg.readString();
      const val = pkg.readString();
      customData.set(key, val);
    }
  }
  const id = itemHashes.get(prefab) ?? `${prefab}_unknown_`;
  return { id, stack, durability, gridPos, equipped, quality, variant, crafterID, crafterName, customData, worldLevel, pickedUp };
}

export function read(pkg: PackageReader): Data {
  const version = pkg.readInt();
  checkVersion('inventory', version, INVENTORY);
  const length = version >= 108 ? pkg.readUShort() : pkg.readInt();
  const inventory: Data = {
    version,
    items: [],
  }
  const itemReader = version >= 108 ? readItemNew : readItemOld;
  for (let index = 0; index < length; ++index) {
    const item = itemReader(pkg, version);
    if (item.id !== '' && item.id !== '0_unknown_') {
      inventory.items.push(item);
    }
  }
  return inventory;
}

function writeItemOld(pkg: PackageWriter, itemData: Item, version: number): void {
  pkg.writeString(itemData.id);
  pkg.writeInt(itemData.stack);
  pkg.writeFloat(itemData.durability);
  pkg.writeVector2i(itemData.gridPos);
  pkg.writeBool(itemData.equipped);
  if (version < 101) return;
  pkg.writeInt(itemData.quality);
  if (version < 102) return;
  pkg.writeInt(itemData.variant);
  if (version < 103) return;
  pkg.writeLong(itemData.crafterID);
  pkg.writeString(itemData.crafterName);
  if (version < 104) return;
  pkg.writeMap(pkg.writeString, pkg.writeString, itemData.customData);
  if (version < 106) return;
  pkg.writeInt(itemData.worldLevel);
  pkg.writeBool(itemData.pickedUp);
}

function writeItemNew(pkg: PackageWriter, itemData: Item, _version: number): void {
  const validId = itemData.id in data;
  const _flags = 0
    | (itemData.pickedUp ? 1 : 0)
    | (itemData.equipped ? 2 : 0)
    | (itemData.quality !== 1 ? 4 : 0)
    | (itemData.stack !== 1 ? 8 : 0)
    | (itemData.variant !== 0 ? 16 : 0)
    | (itemData.crafterID !== BigInt(0) ? 32 : 0)
    | (validId ? 64 : 0)
    | (itemData.customData.size !== 0 ? 128 : 0);
  pkg.writeInt(itemData.durability * 100);
  pkg.writeByte(itemData.gridPos.x);
  pkg.writeByte(itemData.gridPos.y);
  pkg.writeByte(itemData.worldLevel);
  pkg.writeByte(_flags);
  if (_flags & 4) pkg.writeUShort(itemData.quality);
  if (_flags & 8) pkg.writeUShort(itemData.stack);
  if (_flags & 16) pkg.writeInt(itemData.variant);
  if (_flags & 32) pkg.writeLong(itemData.crafterID);
  if (_flags & 32) pkg.writeString(itemData.crafterName);
  if (_flags & 64) pkg.writeInt(hashPrefab(itemData.id));
  if (_flags & 128) pkg.writeNumItems(itemData.customData.size);
  for (const [key, value] of itemData.customData.entries()) {
    pkg.writeString(key);
    pkg.writeString(value);
  }
}

export function write(pkg: PackageWriter, inventory: Data): void {
  pkg.writeInt(inventory.version);
  if (inventory.version >= 108) {
    pkg.writeUShort(inventory.items.length);
  } else {
    pkg.writeInt(inventory.items.length);
  }
  const itemWriter = inventory.version >= 108 ? writeItemNew : writeItemOld;
  for (const itemData of inventory.items) {
    itemWriter(pkg, itemData, inventory.version);
  }
}
