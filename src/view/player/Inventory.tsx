import React, { CSSProperties, useContext, useRef, useState } from 'react';

import type { Item, Weapon, DamageType } from '../../types';
import type { Inventory as TInventory } from './types';

import '../../css/Inventory.css';

import { timeI2S } from '../../model/utils';
import { data } from '../../data/itemDB';

import { ItemIcon } from '../parts/Icon';
import { EpicLootData, extractExtraData } from '../../mods/epic-loot';
import { TranslationContext } from '../../effects';

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

function Tooltip({ invItem, x, y }: { invItem: InvItem, x: number, y: number }) {
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
    <TooltipBody invItem={invItem} item={item} />
  </div>;
}

const TooltipBody = React.memo(({ invItem, item }: { invItem: InvItem, item: Item }) => {
  const translate = useContext(TranslationContext);
  const slot = (item as Weapon).slot as string | undefined;
  const moveSpeed = (item as Weapon).moveSpeed as number | undefined;
  const extraData = extractExtraData(invItem);
  const maxDurability = getMaxDurability(invItem, item, extraData);

  const headerClasses = ['InvTooltip__Header'];
  if (extraData && extraData.rarity !== 'Generic') {
    headerClasses.push('EpicLoot--' + extraData.rarity);
  }
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
          return <>
            {Object.entries(item.damage[0])
              .filter(([, value]) => value)
              .map(([key, value]) => <div key={key}>
                {translate(`ui.damageType.${key}`)}{': '}
                <span className="InvTooltip__value">{value + (item.damage[1][key as DamageType] ?? 0) * (invItem.quality - 1)}</span>
              </div>
            )}
            <div>{translate('ui.knockback')}: <span className="InvTooltip__value">{item.knockback}</span></div>
            <div>{translate('ui.backstab')}: <span className="InvTooltip__value">{item.backstab}x</span></div>
          </>;
        case 'armor':
          return <>
            <div>
              {translate('ui.armor')}{': '}
              <span className="InvTooltip__value">{item.armor[0] + item.armor[1] * (invItem.quality - 1)}</span>
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
    {}
    {!!moveSpeed && <div>
      {translate('ui.moveSpeed')}
      {': '}
      <span className="InvTooltip__value">{Math.round(moveSpeed * 100)}%</span>
    </div>}
    {extraData != null && <ul className={`EpicLoot--${extraData.rarity}`}>{
      Object.entries(extraData.effects).map(
        ([key, value]) => <li key={key}>
          {key}: {value}
        </li>
      )}
    </ul>}
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

export function Inventory({ inventory, extras } : { inventory: TInventory, extras: TInventory[] }) {
  const [tooltipData, setTooltipData] = useState<{ invItem: InvItem, x: number, y: number } | undefined>(undefined);
  const rootRef = useRef<HTMLDivElement>(null);

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
    {tooltipData != null && <Tooltip {...tooltipData} />}
  </>
}
