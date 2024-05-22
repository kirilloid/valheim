import React, { useCallback, useContext } from 'react';

import type { ValueProps } from '../parts/types';
import type { Player, SkillData } from './types';
import type * as Inventory from '../../file/Inventory';
import type { Armor, GameObject, Shield, Tool, Weapon } from '../../types';
import type { Vector2i } from '../../model/utils';

import { INVENTORY_HEIGHT, INVENTORY_SIZE, INVENTORY_WIDTH } from '../../model/game';
import { itemSets, PlayerPreset } from '../../data/item-sets';
import { data } from '../../data/itemDB';
import { SkillType } from '../../model/skills';

import { GameSettingsContext } from '../../effects';

function topFirst(item: GameObject): boolean {
  return item.type === 'weapon'
      || item.type === 'tool'
      || item.type === 'shield'
      || (item.type === 'armor' && item.slot === 'util')
      // || item.type === 'misc':
      //      AsksvinEgg, ChickenEgg, BarberKit, Bell, CryptKey, DragonEgg, DvergrKey, GoblinTotem, HildirKey_*,
      //      SaddleAsksvin, SaddleLox, chest_hildir*
  ;
}

function findEmptySlot(slots: boolean[], topFirst: boolean): Vector2i {
  if (topFirst) {
    for (let y = 0; y < INVENTORY_HEIGHT; ++y) {
      for (let x = 0; x < INVENTORY_WIDTH; ++x) {
        if (!slots[x + y * INVENTORY_SIZE]) return { x, y };
      }
    }
  } else {
    for (let y = INVENTORY_HEIGHT - 1; y >= 0; --y) {
      for (let x = 0; x < INVENTORY_WIDTH; ++x) {
        if (!slots[x + y * INVENTORY_SIZE]) return { x, y };
      }
    }
  }
  return { x: -1, y: -1 };
}

function inventoryFromPreset(preset: PlayerPreset, worldLevel: number): Inventory.Data {
  let items: Inventory.Item[] = [];
  const inventorySlots: boolean[] = Array.from({ length: INVENTORY_SIZE }, () => false);

  for (const i of preset.items) {
    const item = data[i.item];
    if (item == null) continue;
    let gridPos = { x: 0, y: 0 };
    if (i.hotbar > 0) {
      const id = gridPos.x = i.hotbar;
      inventorySlots[id] = true;
      // drop current item
      items = items.filter(ci => ci.gridPos.x === gridPos.x && ci.gridPos.y === ci.gridPos.y);
    } else {
      const id = inventorySlots.findIndex(x => !x);
      const x = id % INVENTORY_WIDTH;
      const y = Math.floor(id / INVENTORY_WIDTH);
      inventorySlots[id] = true;
      gridPos = findEmptySlot(inventorySlots, topFirst(item));
    }
    const durabilityPair = (data[i.item] as Weapon | Shield | Armor | Tool).durability ?? [100, 0];
    const durability = durabilityPair[0] + durabilityPair[1] * i.quality;
    const crafterID = BigInt(0);
    const crafterName = "Thor";
    const customData = new Map<string, string>();
    items.push({
      id: i.item,
      stack: Math.max(1, i.stack),
      durability,
      gridPos,
      equipped: i.equip,
      quality: i.quality,
      variant: 0,
      crafterID,
      crafterName,
      customData,
      worldLevel,
      pickedUp: true,
    });
  }

  return { version: 0, items };
}

function skillDataFromPreset(preset: PlayerPreset): SkillData {
  const skillData = new Map();

  for (const [skill, level] of Object.entries(preset.skills)) {
    if (Number(skill) !== SkillType.All) {
      skillData.set(skill, level);
      continue;
    }
    Object.keys(SkillType).forEach(s => {
      const sk = Number(s);
      if (sk !== SkillType.All) {
        skillData.set(sk, level);
      }
    });
  }

  return skillData;
}

export function Presets({ value, onChange } : ValueProps<Player>) {
  const { worldlevel } = useContext(GameSettingsContext);

  const applyPreset = useCallback((preset: PlayerPreset) => {
    const { playerData } = value;
    if (playerData == null) return;

    const inventory = inventoryFromPreset(preset, worldlevel);
    const skillData = skillDataFromPreset(preset);

    onChange({
      ...value,
      playerData: {
        ...playerData,
        inventory,
        skillData,
      },
    });
  }, [value, onChange]);

  return <section>
    {Object.entries(itemSets).map(([key, preset]) => {
      return <button key={key} className="btn btn--default" onClick={() => applyPreset(preset)}>{key}</button>;
    })}
  </section>
}
