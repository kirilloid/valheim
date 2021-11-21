import type { Vector2i } from '../model/utils';
import type { PackageReader, PackageWriter } from './Package';

export type Data = {
  version: number;
  items: {
    id: string;
    stack: number;
    durability: number;
    gridPos: Vector2i;
    equiped: boolean;
    quality: number;
    variant: number;
    crafterID: bigint;
    crafterName: string;
  }[];
};

export function read(pkg: PackageReader): Data {
  const version = pkg.readInt();
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
    const equiped = pkg.readBool();
    const quality = version >= 101 ? pkg.readInt() : 1;
    const variant = version >= 102 ? pkg.readInt() : 0;
    const crafterID = version >= 103 ? pkg.readLong() : BigInt(0);
    const crafterName = version >= 103 ? pkg.readString() : "";
    if (id !== '') {
      inventory.items.push({ id, stack, durability, gridPos, equiped, quality, variant, crafterID, crafterName });
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
    pkg.writeBool(itemData.equiped);
    pkg.writeInt(itemData.quality);
    pkg.writeInt(itemData.variant);
    pkg.writeLong(itemData.crafterID);
    pkg.writeString(itemData.crafterName);
  }
}

