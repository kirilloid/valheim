import React, { useContext, useLayoutEffect, useRef, useState } from 'react';
import { defaultMemoize } from 'reselect';

import type { Armor, Item, ItemSet } from '../../../types';
import type { Inventory as TInventory, PlayerData } from '../types';
import type { InvItem } from './types';

import '../../../css/Inventory.css';

import { getEpicLootData } from '../../../mods/epic-loot';
import { Class } from '../../../mods/magic-overhaul';
import { modifyClassItemStats, readCharClass, } from '../MagicOverhaul';

import { data } from '../../../data/itemDB';

import { TranslationContext } from '../../../effects';
import { yesNo } from '../../helpers';

import { CommonStats } from './common-stats';
import { Durability } from './durability';
import { MoveSpeed } from './move-speed';
import { InvItemView } from './item-view';
import { ItemSpecific } from './item-specific';
import { SetBonus } from './set-bonus';
import {
  SetBonusTooltip as EpicLootSetBonusTooltip,
  SetName as EpicLootSetName,
} from './epic-loot';
import { JewelCraftingTooltip } from './jewel-crafting';
import { EitrRegen } from './eitr-regen';

const INVENTORY_WIDTH = 8;
const INVENTORY_HEIGHT = 4;
const INVENTORY_SIZE = INVENTORY_WIDTH * INVENTORY_HEIGHT;

function Tooltip({ invItem, x, y, equippedItems, moClass }: {
  invItem: InvItem;
  x: number;
  y: number;
  equippedItems: InvItem[];
  moClass: Class | undefined;
}) {
  const translate = useContext(TranslationContext);
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const elt = ref.current;
    if (elt == null) return;
    const parent = elt.offsetParent as HTMLElement;
    const top = elt.offsetTop + parent.offsetTop;
    if (elt.offsetHeight + top > parent.offsetHeight) {
      elt.style.top = `${parent.offsetHeight - elt.offsetHeight}px`;
    }
  }, [ref]);

  const item = data[invItem.id] as Item | undefined;
  if (item == null) {
    return <div className="InvTooltip" style={{ left: x, top: y }}>
      <header className="InvTooltip__Header">{invItem.id}</header>
      <p>Unknown item</p>
      <div>number: <span className="InvTooltip__value">{invItem.stack}</span></div>
      <div>{translate('ui.quality')}: <span className="InvTooltip__value">{invItem.quality}</span></div>
      <div>{translate('ui.durability')}: <span className="InvTooltip__value">{invItem.durability}</span></div>
      <div>{translate('ui.equipped')}: {yesNo(invItem.equipped)}</div>
    </div>;
  }

  const classes = ['InvTooltip'];
  const epicLoot = getEpicLootData(invItem);

  if (epicLoot) {
    classes.push('InvTooltip--EpicLoot');
    if (epicLoot.rarity !== 'Generic') {
      classes.push('InvTooltip--EpicLoot-' + epicLoot.rarity);
    }
  }

return <div className={classes.join(' ')} ref={ref} style={{ left: x, top: y }}>
    <TooltipBody invItem={invItem} item={modifyClassItemStats(item, moClass)} equippedItems={equippedItems} />
  </div>;
}


function SetBonusTooltip({ set }: { set: ItemSet | undefined }) {
  if (set == null) return null;
  const bonus = set.bonus.at(-1)!;
  return <div className="InvTooltip__Set">
    Set effect (<span className="InvTooltip__value">{set.bonus.length}</span> parts): <SetBonus bonus={bonus} />
  </div>
}

const TooltipBody = React.memo(({ invItem, item, equippedItems }: { invItem: InvItem; item: Item; equippedItems: InvItem[] }) => {
  const translate = useContext(TranslationContext);
  const epicLoot = getEpicLootData(invItem);

  const headerClasses = ['InvTooltip__Header'];
  if (epicLoot && epicLoot.rarity !== 'Generic') {
    headerClasses.push('EpicLoot--' + epicLoot.rarity);
  }

  const set: ItemSet | undefined = (item as Armor).set;

  return <>
    <header className={headerClasses.join(' ')}>{translate(item.id)}</header>
    {item.dlc != null && <div className="InvTooltip__DLC">{item.dlc}</div>}
    {item.teleportable === false && <div className="InvTooltip__value">{translate('ui.nonTeleportable')}</div>}
    <EpicLootSetName epicLoot={epicLoot} />
    <CommonStats item={item} invItem={invItem} />
    <Durability item={item} invItem={invItem} />
    {/* repair station level */}
    <ItemSpecific item={item} invItem={invItem} />
    <MoveSpeed item={item} invItem={invItem} equippedItems={equippedItems} />
    <EitrRegen item={item} equippedItems={equippedItems} />
    <JewelCraftingTooltip invItem={invItem} />
    {epicLoot
      ? <EpicLootSetBonusTooltip set={set} item={item} epicLoot={epicLoot} equippedItems={equippedItems} />
      : <SetBonusTooltip set={set} />}
  </>
});

const getEquippedIds = defaultMemoize(
  (inventory: TInventory, extras: TInventory[]): InvItem[] => [inventory].concat(extras)
    .flatMap(invPart => invPart.items)
    .filter(item => item.equipped)
);

export function Inventory({ playerData, extras } : { playerData: PlayerData, extras: TInventory[] }) {
  const { inventory } = playerData;
  const [tooltipData, setTooltipData] = useState<{ invItem: InvItem, x: number, y: number } | undefined>(undefined);
  const rootRef = useRef<HTMLDivElement>(null);
  const equippedItems = getEquippedIds(inventory, extras);

  const invMap: (InvItem | undefined)[] = Array.from({ length: INVENTORY_SIZE });
  for (const invItem of inventory.items) {
    const { x, y } = invItem.gridPos;
    invMap[y * INVENTORY_WIDTH + x] = invItem;
  }

  let hasUnknownItems = invMap.some(e => e != null && data[e.id] == null);
  const extraItems = extras.map(inv => inv.items);
  const outOfRangeItems = [];

  for (const e of inventory.items) {
    if (e.gridPos.x >= INVENTORY_WIDTH
    || e.gridPos.y >= INVENTORY_HEIGHT) {
      outOfRangeItems.push(e);
    }
  }
  const hasOutOfRangePos = outOfRangeItems.length > 0;
  if (hasOutOfRangePos) {
    extraItems.push(outOfRangeItems);
  }
  const moClass = readCharClass(playerData);

  return <>
    <div className="Inventory" ref={rootRef}>
      <div className="Inventory__container"
        onMouseOut={() => setTooltipData(undefined)}
      >
        {invMap.map((invItem, idx) => {
          const xi = idx % INVENTORY_WIDTH;
          const yi = Math.floor(idx / INVENTORY_WIDTH);
          const x = xi * 69;
          const y = yi * 69;
          const style={
            left: x,
            top: y,
          };
          return <InvItemView key={idx}
            invItem={invItem}
            style={style}
            onTooltip={invItem => setTooltipData({
              invItem,
              x: xi <= 3
                ? x + 64 + (rootRef.current?.offsetLeft ?? 0)
                : x + 64 + (rootRef.current?.offsetLeft ?? 0) - 320,
              y: y + 80 + (rootRef.current?.offsetTop ?? 0)
            })} />
        })}
      </div>
    </div>
    <p>version: {inventory.version}</p>
    {hasUnknownItems && <p className="warning">
      There are unknown items in your inventory possible reasons:
      <ul>
        <li>This program is out of date</li>
        <li>You use mods</li>
        <li>Your inventory is corrupted</li>
      </ul>
    </p>}
    {hasOutOfRangePos && <p className="warning">
      There are items outside of standard inventory. <br />
      If you use mods like V+, then it's OK
    </p>}
    {extraItems.length > 0 && extraItems.map(
      group => <div className="Inventory-extra">{
        group.map(
          (e, i) => <InvItemView key={i} invItem={e} onTooltip={() => {}} /* TODO: add tooltips for those */ />
        )}
      </div>
    )}
    {tooltipData != null &&
      <Tooltip {...tooltipData}
        equippedItems={equippedItems}
        moClass={moClass} />}
  </>
}
