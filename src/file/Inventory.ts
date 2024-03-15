import type { Vector2i } from '../model/utils';
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

export function read(pkg: PackageReader): Data {
  const version = pkg.readInt();
  checkVersion('inventory', version, INVENTORY);
  const length = pkg.readInt();
  const inventory: Data = {
    version,
    items: [],
  }
  for (let index = 0; index < length; ++index) {
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
    const worldLevel = version >= 106 ? pkg.readInt() : 0;
    const pickedUp = version >= 106 ? pkg.readBool() : false;
    if (id !== '') {
      inventory.items.push({ id, stack, durability, gridPos, equipped, quality, variant, crafterID, crafterName, customData, worldLevel, pickedUp });
    }
  }
  return inventory;
}

export function write(pkg: PackageWriter, inventory: Data): void {
  pkg.writeInt(inventory.version);
  pkg.writeInt(inventory.items.length);
  for (const itemData of inventory.items) {
    pkg.writeString(itemData.id);
    pkg.writeInt(itemData.stack);
    pkg.writeFloat(itemData.durability);
    pkg.writeVector2i(itemData.gridPos);
    pkg.writeBool(itemData.equipped);
    if (inventory.version < 101) continue;
    pkg.writeInt(itemData.quality);
    if (inventory.version < 102) continue;
    pkg.writeInt(itemData.variant);
    if (inventory.version < 103) continue;
    pkg.writeLong(itemData.crafterID);
    pkg.writeString(itemData.crafterName);
    if (inventory.version < 104) continue;
    pkg.writeMap(pkg.writeString, pkg.writeString, itemData.customData);
    if (inventory.version < 106) continue;
    pkg.writeInt(itemData.worldLevel);
    pkg.writeBool(itemData.pickedUp);
  }
}

