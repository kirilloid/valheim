import { readBase64 } from '../../file/base64';
import type { Inventory, PlayerData } from './types';
import { read } from '../../file/Inventory';

const Sentinel = '<|>';
const EquipSlotsKey = 'EquipmentSlotInventory';
const QuickSlotsKey = 'QuickSlotInventory';

export function readExtraSlots(playerData: PlayerData): Inventory[] {
  const texts = playerData.knownTexts;
  const result: Inventory[] = [];
  const equipSlots = texts.get(`${Sentinel}${EquipSlotsKey}`);
  if (equipSlots != null) {
    result.push(read(readBase64(equipSlots)));
  }
  const quickSlots = texts.get(`${Sentinel}${QuickSlotsKey}`);
  if (quickSlots != null) {
    result.push(read(readBase64(quickSlots)));
  }
  return result;
}
