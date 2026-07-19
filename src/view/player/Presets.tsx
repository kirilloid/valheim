import React, { useCallback, useContext, useState } from 'react';

import type { ValueProps } from '../parts/types';
import type { Player, PlayerData, SkillData } from './types';
import type * as TInventory from '../../file/Inventory';
import type { SkillDatum } from '../../file/Player';
import type { Armor, GameObject, Shield, Tool, Weapon } from '../../types';
import type { Vector2i } from '../../model/utils';
import { INVENTORY_HEIGHT, INVENTORY_SIZE, INVENTORY_WIDTH } from '../../model/game';

import { Inventory } from './Inventory';
import { itemSets, PlayerPreset } from '../../data/item-sets';
import { data } from '../../data/itemDB';
import { SkillType } from '../../model/skills';

import { GameSettingsContext } from '../../effects';
import { Skills } from './Skills';

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
        if (!slots[x + y * INVENTORY_WIDTH]) return { x, y };
      }
    }
  } else {
    for (let y = INVENTORY_HEIGHT - 1; y >= 0; --y) {
      for (let x = 0; x < INVENTORY_WIDTH; ++x) {
        if (!slots[x + y * INVENTORY_WIDTH]) return { x, y };
      }
    }
  }
  return { x: -1, y: -1 };
}

function inventoryFromPreset(preset: PlayerPreset, worldLevel: number): TInventory.Data {
  let items: TInventory.Item[] = [];
  const inventorySlots: boolean[] = Array.from({ length: INVENTORY_SIZE }, () => false);

  for (const i of preset.items) {
    const item = data[i.item];
    if (item == null) continue;
    let gridPos = { x: 0, y: 0 };
    if (i.hotbar > 0) {
      const id = gridPos.x = i.hotbar - 1;
      inventorySlots[id] = true;
      // drop current item
      items = items.filter(ci => ci.gridPos.x !== gridPos.x || ci.gridPos.y !== gridPos.y);
    } else {
      gridPos = findEmptySlot(inventorySlots, topFirst(item));
      const id = gridPos.y * INVENTORY_WIDTH + gridPos.x;
      inventorySlots[id] = true;
    }
    const durabilityPair = (data[i.item] as Weapon | Shield | Armor | Tool).durability ?? [100, 0];
    const durability = durabilityPair[0] + durabilityPair[1] * (i.quality - 1);
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
  const skillData = new Map<SkillType, SkillDatum>();

  for (const [skillStr, level] of Object.entries(preset.skills)) {
    const skill: SkillType = Number(skillStr);
    if (skill !== SkillType.All) {
      skillData.set(skill, { level, accumulator: 0 });
      continue;
    }
    Object.keys(SkillType).forEach(s => {
      const sk = Number(s);
      if (isNaN(sk)) return;
      if (sk !== SkillType.All) {
        skillData.set(sk, { level, accumulator: 0 });
      }
    });
  }

  return skillData;
}

function ShowPreset({ playerData, preset, worldlevel }: { playerData: PlayerData; preset: PlayerPreset; worldlevel: number }) {
  const inventory = inventoryFromPreset(preset, worldlevel);
  const skillData = skillDataFromPreset(preset);
  return <>
    <h2>Inventory</h2>
    <Inventory playerData={{ ...playerData, inventory }} extras={[]} />
    <h2>Skills</h2>
    <Skills skillData={skillData} playerData={playerData} />
  </>
}

export function Presets({ value, onChange } : ValueProps<Player>) {
  const { worldlevel } = useContext(GameSettingsContext);

  const [selected, setSelected] = useState('');
  const preset = itemSets[selected];

  const applyPreset = useCallback(() => {
    const { playerData } = value;
    if (playerData == null) return;
    if (preset == null) return;

    const inventory = inventoryFromPreset(preset, worldlevel);
    const skillData = skillDataFromPreset(preset);

    onChange({
      ...value,
      usedCheats: true,
      playerData: {
        ...playerData,
        inventory,
        skillData,
      },
    });
  }, [value, worldlevel, onChange, preset]);

  const onSelect = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => setSelected(e.target.value), [setSelected]);

  return <section>
    <div className="warning">This will overwrite your character skills and inentory</div>
    <div>
      <label htmlFor="preset">Pick a preset</label>
      {' '}
      <select id="preset" value={selected} onChange={onSelect}>
        <option value="">None</option>
        {Object.entries(itemSets).map(([key]) => {
          return <option value={key} key={key}>{key}</option>
        })}
      </select>
    </div>  
    {preset && value.playerData && <ShowPreset playerData={value.playerData} preset={preset} worldlevel={worldlevel} />}
    <div>
      <button className="btn btn--danger btn--default" disabled={preset == null} onClick={applyPreset}>Apply</button>
    </div>
  </section>
}
