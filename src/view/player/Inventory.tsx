import React, { CSSProperties, useContext, useRef, useState } from 'react';

import type { Armor, Item, ItemSet, ItemSetBonus, Weapon } from '../../types';
import type { Inventory as TInventory } from './types';

import '../../css/Inventory.css';

import { timeI2S } from '../../model/utils';
import { addDamage, multiplyDamage } from '../../model/combat';
import { data } from '../../data/itemDB';

import { ItemIcon } from '../parts/Icon';
import { EpicLootData, extractExtraData, modifyDamage } from '../../mods/epic-loot';
import { TranslationContext } from '../../effects';
import { defaultMemoize } from 'reselect';
import { SkillType } from '../../model/skills';

type InvItem = TInventory['items'][number];

const INVENTORY_WIDTH = 8;
const INVENTORY_HEIGHT = 4;
const INVENTORY_SIZE = INVENTORY_WIDTH * INVENTORY_HEIGHT;

function getMaxDurability(invItem: InvItem, item: Item, extraData: EpicLootData | undefined): number {
  if (item == null) return 0;
  if (!('durability' in item)) return Infinity;
  if (item.durability[0] === Infinity || extraData?.effects.Indestructible != null) return Infinity;
  const maxDurability = item.durability[0] + item.durability[1] * (invItem.quality - 1);
  const durabilityBonus = extraData?.effects.ModifyDurability ?? 0;
  return maxDurability * (1 + durabilityBonus / 100);
}

function Tooltip({ invItem, x, y, equippedItemIds }: { invItem: InvItem; x: number; y: number; equippedItemIds: string[] }) {
  const item = data[invItem.id] as Item | undefined;
  if (item == null) return null;
  const classes = ['InvTooltip'];
  const extraData = extractExtraData(invItem);
  if (extraData) {
    classes.push('InvTooltip--EpicLoot');
    if (extraData.rarity !== 'Generic') {
      classes.push('InvTooltip--EpicLoot-' + extraData.rarity);
    }
  }
  return <div className={classes.join(' ')} style={{ left: x, top: y }}>
    <TooltipBody invItem={invItem} item={item} equippedItemIds={equippedItemIds} />
  </div>;
}

function EpicLootTooltip({ extraData }: { extraData: EpicLootData | undefined }) {
  if (extraData == null) return null;
  return <ul className={`InvTooltip__EpicLoot EpicLoot--${extraData.rarity}`}>{
    Object.entries(extraData.effects).map(
      ([key, value]) => <li key={key}>
        {key}: {value}
      </li>
    )}
  </ul>
}

function SetBonus({ bonus }: { bonus: ItemSetBonus }) {
  const translate = useContext(TranslationContext);
  if (!bonus.Skills) return null;
  return <>{
    Object.entries(bonus.Skills)
      .map(([skill, value]) => translate(`ui.skillType.${SkillType[skill as any]}`) + " +" + value)
      .join(' ')
  }</>;
}

function SetBonusTooltip({ set, item, equippedItemIds }: { set: ItemSet | undefined; item: Item; equippedItemIds: string[] }) {
  const translate = useContext(TranslationContext);
  if (set == null) return null;
  let equippedTotal = 0;
  const equippedByIndex = [];
  for (const id of set.items) {
    const equipped = equippedItemIds.includes(id);
    if (equipped) equippedTotal++;
    equippedByIndex.push(equipped);
  }
  return <div className="InvTooltip__Set">
    <header className="InvTooltip__SetHeader">Set: {set.name} ({equippedTotal}/{set.items.length})</header>
    <ul className="InvTooltip__SetItems">
      {set.items.map(id => <li key={id}
        className={equippedItemIds.includes(item.id)
          ? 'InvTooltip__SetItem--equipped'
          : 'InvTooltip__SetItem--unequipped'}
      >{translate(id)}</li>)}
    </ul>
    <ul className="InvTooltip__SetBonuses">
      {set.bonus.map((bonus, n) => bonus == null ? null : <li key={n}
        className={n + 1 <= equippedTotal 
          ? 'InvTooltip__SetItem--equipped'
          : 'InvTooltip__SetItem--unequipped'}
      >({n + 1}) <SetBonus bonus={bonus} /></li>)}
    </ul>
  </div>
}

const TooltipBody = React.memo(({ invItem, item, equippedItemIds }: { invItem: InvItem; item: Item; equippedItemIds: string[] }) => {
  const translate = useContext(TranslationContext);
  const slot = (item as Weapon).slot as string | undefined;
  const moveSpeed = (item as Weapon).moveSpeed as number | undefined;
  const extraData = extractExtraData(invItem);
  const maxDurability = getMaxDurability(invItem, item, extraData);

  const headerClasses = ['InvTooltip__Header'];
  if (extraData && extraData.rarity !== 'Generic') {
    headerClasses.push('EpicLoot--' + extraData.rarity);
  }
  let set: ItemSet | undefined = undefined;
  return <>
    <header className={headerClasses.join(' ')}>{translate(item.id)}</header>
    {item.dlc != null && <div className="InvTooltip__DLC">{item.dlc}</div>}
    {item.teleportable === false && <div className="InvTooltip__value">{translate('ui.nonTeleportable')}</div>}
    {slot != null && <div>{translate(`ui.slot.${slot}`)}</div>}
    {invItem.crafterID ? <div>
      Crafted by: <span className="InvTooltip__value">{invItem.crafterName.replace(/^<\|c\|>(.*?)(<.*|$)/, '$1')}</span>
    </div> : null}
    <div>
      {translate('ui.weight')}:
      {' '}<span className="InvTooltip__value">{(invItem.stack * item.weight).toFixed(1)}</span>
    </div>
    {(item.maxLvl ?? 1) > 1 && <div>
      {translate('ui.quality')}: <span className="InvTooltip__value">{invItem.quality}</span>
    </div>}
    {isFinite(maxDurability) && <div>
      {translate('ui.durability')}
      {': '}
      <span className="InvTooltip__value">{Math.round(100 * invItem.durability / maxDurability)}%</span>
      {' '}
      <span className="InvTooltip__extra">({Math.round(invItem.durability)}/{maxDurability})</span>
    </div>}
    {/* repair station level */}
    {(() => {
      switch (item.type) {
        case 'item':
          if (item.Food)
            return <>
              <div>{translate('ui.health')}: <span className="InvTooltip__value" style={{ color: '#ff8080' }}>{item.Food.health}</span></div>
              <div>{translate('ui.stamina')}: <span className="InvTooltip__value" style={{ color: '#ffff80' }}>{item.Food.stamina}</span></div>
              <div>{translate('ui.duration')}: <span className="InvTooltip__value">{timeI2S(item.Food.duration)}</span></div>
              <div>{translate('ui.regen')}: <span className="InvTooltip__value">{item.Food.regen}</span></div>
            </>;
          return null;
        case 'weapon':
          const damage = addDamage(item.damage[0], multiplyDamage(item.damage[1], invItem.quality - 1));
          const resultDamage = modifyDamage(damage, extraData?.effects);
          set = item.set;
          return <>
            {Object.entries(resultDamage)
              .filter(([, value]) => value)
              .map(([key, value]) => <div key={key}>
                {translate(`ui.damageType.${key}`)}{': '}
                <span className="InvTooltip__value">{value}</span>
              </div>
            )}
            <div>{translate('ui.knockback')}: <span className="InvTooltip__value">{item.knockback}</span></div>
            <div>{translate('ui.backstab')}: <span className="InvTooltip__value">{item.backstab}x</span></div>
          </>;
        case 'shield':
          const block = typeof item.block === 'number'
            ? item.block
            : item.block[0] + item.block[1] * (invItem.quality - 1);
          set = item.set;
          return <>
            <div>{translate('ui.block')}: <span className="InvTooltip__value">{block}</span></div>
            {item.parryBonus > 1 && <div>{translate('ui.parryBonus')}: <span className="InvTooltip__value">{item.parryBonus}x</span></div>}
          </>;
        case 'armor':
          const armor = item.armor[0] + item.armor[1] * (invItem.quality - 1);
          const resultArmor = extraData?.effects.ModifyArmor == null ? armor : armor + extraData.effects.ModifyArmor;
          set = item.set;
          return <>
            <div>
              {translate('ui.armor')}{': '}
              <span className="InvTooltip__value">{resultArmor}</span>
            </div>
            {item.damageModifiers != null && Object.entries(item.damageModifiers).map(
              ([key, value]) => <div key={key}>
                {translate(`ui.damageType.${key}`)}
                {': '}
                {translate(`ui.damageModifier.${value}`)}
              </div>
            )}
          </>
        case 'ammo':
          return Object.entries(item.damage)
            .filter(([, value]) => value)
            .map(([key, value]) => <div key={key}>
              {translate(`ui.damageType.${key}`)}{': '}
              <span className="InvTooltip__value">{value}</span>
            </div>
          );
      }
    })()}
    {!!moveSpeed && extraData?.effects.RemoveSpeedPenalty == null && <div>
      {translate('ui.moveSpeed')}
      {': '}
      <span className="InvTooltip__value">{Math.round(moveSpeed * 100)}%</span>
    </div>}
    <SetBonusTooltip set={set} item={item} equippedItemIds={equippedItemIds} />
    <EpicLootTooltip extraData={extraData} />
  </>
});

export function InvItemView({ invItem, style, onTooltip }: {
  invItem?: InvItem,
  style?: CSSProperties,
  onTooltip: (invItem: InvItem) => void,
}) {
  if (invItem == null) {
    return <div className="Inventory__Item" style={style} />;
  }
  const item = data[invItem.id] as Item | undefined;
  if (item == null) {
    return <div className="Inventory__Item" style={style}>
      <div className="InvItem__Icon">
        <ItemIcon item={item} size={64} />
      </div>
    </div>;
  }

  const extraData = extractExtraData(invItem);

  const maxDuarbility = getMaxDurability(invItem, item, extraData);
  const classes = ['Inventory__Item'];
  if (invItem.equipped) {
    classes.push('Inventory__Item--equipped');
  }
  if (extraData) {
    classes.push('Inventory__Item--EpicLoot');
    if (extraData.rarity !== 'Generic') {
      classes.push(`Inventory__Item--EpicLoot-${extraData.rarity}`);
    }
  }

  return <div
    className={classes.join(' ')}
    style={style}
  >
    <div className="InvItem__Icon InvItem__Icon--shadow">
      <ItemIcon item={item} size={64} />
    </div>
    <div className="InvItem__Icon" onMouseMove={() => onTooltip(invItem)}>
      <ItemIcon item={item} size={64} />
    </div>
    {(item.maxLvl ?? 1) > 1 && <div className="InvItem__quality text-outline">
      {invItem.quality}
    </div>}
    {(item.stack ?? 1) > 1 && <div className="InvItem__stack text-outline">
      {invItem.stack}/{item.stack}
    </div>}
    {isFinite(maxDuarbility) && <div className="InvItem__durability">
      <div className="InvItem__durability-value" style={{ width: `${100 * invItem.durability / maxDuarbility}%` }} />
    </div>}
  </div>
}

const getEquippedIds = defaultMemoize(
  (inventory: TInventory, extras: TInventory[]): string[] => [inventory].concat(extras)
    .flatMap(invPart => invPart.items)
    .filter(item => item.equipped)
    .map(item => item.id)
);

export function Inventory({ inventory, extras } : { inventory: TInventory, extras: TInventory[] }) {
  const [tooltipData, setTooltipData] = useState<{ invItem: InvItem, x: number, y: number } | undefined>(undefined);
  const rootRef = useRef<HTMLDivElement>(null);
  const equippedItemIds = getEquippedIds(inventory, extras);

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
    {tooltipData != null && <Tooltip {...tooltipData} equippedItemIds={equippedItemIds} />}
  </>
}
