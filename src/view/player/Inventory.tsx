import React, { CSSProperties, useContext, useLayoutEffect, useRef, useState } from 'react';
import { defaultMemoize } from 'reselect';

import type { Armor, DamageType, Effect, Item, ItemSet, Weapon } from '../../types';
import type { Inventory as TInventory } from './types';

import '../../css/Inventory.css';

import { timeI2S } from '../../model/utils';
import { addDamage, multiplyDamage } from '../../model/combat';
import { SkillType } from '../../model/skills';
import { EpicLootData, extractExtraData, getMaxDurability, LegendaryItemSet, modifyDamage, modifyResistances } from '../../mods/epic-loot';

import { data } from '../../data/itemDB';

import { ItemIcon } from '../parts/Icon';
import { TranslationContext } from '../../effects';
import { List, yesNo } from '../helpers';

type InvItem = TInventory['items'][number];

const INVENTORY_WIDTH = 8;
const INVENTORY_HEIGHT = 4;
const INVENTORY_SIZE = INVENTORY_WIDTH * INVENTORY_HEIGHT;

function Tooltip({ invItem, x, y, equippedItems }: { invItem: InvItem; x: number; y: number; equippedItems: InvItem[] }) {
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
  const extraData = extractExtraData(invItem);
  if (extraData) {
    classes.push('InvTooltip--EpicLoot');
    if (extraData.rarity !== 'Generic') {
      classes.push('InvTooltip--EpicLoot-' + extraData.rarity);
    }
  }
  return <div className={classes.join(' ')} ref={ref} style={{ left: x, top: y }}>
    <TooltipBody invItem={invItem} item={item} equippedItems={equippedItems} />
  </div>;
}

function EpicLootTooltip({ effects, rarity, augmentedIndex }: EpicLootData) {
  const translate = useContext(TranslationContext);
  return <ul className={`InvTooltip__EpicLoot EpicLoot--${rarity}`}>{
    Object.entries(effects).map(([key, value], i) => <li key={key} className={augmentedIndex === i ? 'EpicLoot--Augmented' : ''}>
      {translate(`ui.mod.EpicLoot.effect.${key}`, value!)}
    </li>)}
  </ul>
}

function SetBonus({ bonus }: { bonus: Effect }) {
  const translate = useContext(TranslationContext);
  const parts = [];
  if (bonus.attackModifier != null) {
    parts.push(<span key="skill">{
      translate(`ui.skillType.${SkillType[bonus.attackModifier[0]]}`)}
      {' '}
      <span className="InvTooltip__value">+{bonus.attackModifier[1]}</span>
    </span>);
  }
  if (bonus.damageModifiers != null) {
    parts.push(<span key="resist">{
      Object
        .entries(bonus.damageModifiers)
        .map(([key, value]) => <React.Fragment key={key}>
          {translate(`ui.damageType.${key}`)}
          {': '}
          <span className="InvTooltip__value">{translate(`ui.damageModifier.${value}`)}</span>
        </React.Fragment>)
    }</span>);
  }
  return <List>{parts}</List>;
}

function EpicLootSetBonusTooltip({ set, item, equippedItems }: { set: ItemSet | undefined; item: Item; equippedItems: InvItem[] }) {
  const translate = useContext(TranslationContext);
  if (set == null) return null;
  const equippedItemIds = new Set<string>(equippedItems.map(invItem => invItem.id));
  const equippedTotal = set.items.filter(id => equippedItemIds.has(id)).length;
  return <div className="InvTooltip__Set">
    <header className="InvTooltip__SetHeader">Set: {set.name} ({equippedTotal}/{set.items.length})</header>
    <ul className="InvTooltip__SetItems">
      {set.items.map(id => <li key={id}
        className={equippedItemIds.has(item.id)
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

function EpicLootLegendarySetBonusTooltip({ set, item, equippedItems }: { set: LegendaryItemSet | undefined; item: Item; equippedItems: InvItem[] }) {
  const translate = useContext(TranslationContext);
  if (set == null) return null;
  const equippedLegendaryItemIds = new Set(
    equippedItems
      .map(invItem => extractExtraData(invItem)?.legendaryId)
      .filter(Boolean)
  );
  let equippedTotal = 0;
  const equippedByIndex: boolean[] = [];
  for (const id of set.items) {
    const equipped = equippedLegendaryItemIds.has(id);
    if (equipped) equippedTotal++;
    equippedByIndex.push(equipped);
  }
  return <div className="InvTooltip__Set">
    <header className="InvTooltip__SetHeader">Set: {translate(`ui.mod.EpicLoot.legendarySet.${set.name}`)} ({equippedTotal}/{set.items.length})</header>
    <ul className="InvTooltip__SetItems">
      {set.items.map((id, i) => <li key={id}
        className={equippedByIndex[i]
          ? 'InvTooltip__SetItem--equipped'
          : 'InvTooltip__SetItem--unequipped'}
      >{translate(`ui.mod.EpicLoot.legendary.${id}`)}</li>)}
    </ul>
    <ul className="InvTooltip__SetBonuses">
      {set.effects.map((effect, n) => effect != null && Object.entries(effect).flatMap(([key, value], i) => <li key={n * 10 + i}
          className={n + 1 <= equippedTotal 
            ? 'InvTooltip__SetItem--equipped'
            : 'InvTooltip__SetItem--unequipped'}
        >({n + 1}) {translate(`ui.mod.EpicLoot.effect.${key}`, value!)}</li>))
      }
    </ul>
  </div>
}

function SetBonusTooltip({ set }: { set: ItemSet | undefined }) {
  if (set == null) return null;
  const bonus = set.bonus.slice(-1)[0]!;
  return <div className="InvTooltip__Set">
    Set effect (<span className="InvTooltip__value">{set.bonus.length}</span> parts): <SetBonus bonus={bonus} />
  </div>
}

function showMoveSpeed(value: number) {
  return `${value > 0 ? '+' : ''}${Math.round(value * 100)}%`;
}

const TooltipBody = React.memo(({ invItem, item, equippedItems }: { invItem: InvItem; item: Item; equippedItems: InvItem[] }) => {
  const translate = useContext(TranslationContext);
  const slot = (item as Weapon).slot as string | undefined;
  const moveSpeed = (item as Weapon).moveSpeed as number | undefined;
  const extraData = extractExtraData(invItem);
  const [maxDurability, resultMaxDurability] = getMaxDurability(invItem, item, extraData);

  const headerClasses = ['InvTooltip__Header'];
  const rarityClass = `EpicLoot--${extraData?.rarity ?? 'Generic'}`;
  if (extraData && extraData.rarity !== 'Generic') {
    headerClasses.push('EpicLoot--' + extraData.rarity);
  }
  const Value = <T extends string | number>({ value, originalValue }: { value: T; originalValue: T }) => {
    return <span className={value === originalValue ? 'InvTooltip__value' : rarityClass}>{value}</span>
  };
  let totalMovementModifier = 0;
  for (const invItem of equippedItems) {
    const _item = data[invItem.id];
    if (_item == null) continue;
    const _extraData = extractExtraData(invItem);
    if (_extraData?.effects.RemoveSpeedPenalty != null) continue;
    totalMovementModifier += (_item as Weapon).moveSpeed ?? 0;
  }
  return <>
    <header className={headerClasses.join(' ')}>{translate(item.id)}</header>
    {item.dlc != null && <div className="InvTooltip__DLC">{item.dlc}</div>}
    {item.teleportable === false && <div className="InvTooltip__value">{translate('ui.nonTeleportable')}</div>}
    {/* Epic loot set */
    <p>
      {extraData?.set?.name && <div className={rarityClass}>{translate(`ui.mod.EpicLoot.legendarySet.${extraData.set.name}`)}</div>}
      {extraData?.legendaryId && <div className={rarityClass}>{translate(`ui.mod.EpicLoot.legendary.${extraData.legendaryId}`)}</div>}
    </p>}
    {/* common */}
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
    {(() => {
      if (!isFinite(maxDurability)) return null;
      if (!isFinite(resultMaxDurability)) return <div>
        {translate('ui.durability')}
        {': '}
        <span className={rarityClass}>{translate('ui.mod.EpicLoot.effect.Indestructible')}</span>
      </div>
      return <div>
        {translate('ui.durability')}
        {': '}
        <span className={maxDurability === resultMaxDurability ? 'InvTooltip__value' : rarityClass}>{Math.round(100 * invItem.durability / resultMaxDurability)}%</span>
        {' '}
        <span className="InvTooltip__extra">({Math.round(invItem.durability)}/{resultMaxDurability})</span>
      </div>
    })()}
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
          return <>
            {Object.entries(resultDamage)
              .filter(([, value]) => value)
              .map(([key, value]) => <div key={key}>
                {translate(`ui.damageType.${key}`)}{': '}
                <Value value={value} originalValue={damage[key as DamageType] ?? 0} />
              </div>
            )}
            <div>{translate('ui.knockback')}: <span className="InvTooltip__value">{item.knockback}</span></div>
            <div>{translate('ui.backstab')}: <span className="InvTooltip__value">{item.backstab}x</span></div>
          </>;
        case 'shield':
          const block = typeof item.block === 'number'
            ? item.block
            : item.block[0] + item.block[1] * (invItem.quality - 1);
          return <>
            <div>{translate('ui.block')}: <span className="InvTooltip__value">{block}</span></div>
            {item.parryBonus > 1 && <div>{translate('ui.parryBonus')}: <span className="InvTooltip__value">{item.parryBonus}x</span></div>}
          </>;
        case 'armor':
          const armor = item.armor[0] + item.armor[1] * (invItem.quality - 1);
          const resultArmor = extraData?.effects.ModifyArmor == null ? armor : armor * (1 + extraData.effects.ModifyArmor / 100);
          const damageModifiers = item.damageModifiers;
          const resultDamageModifiers = damageModifiers && modifyResistances(damageModifiers, extraData?.effects);
          return <>
            <div>
              {translate('ui.armor')}{': '}
              <Value value={resultArmor} originalValue={armor} />
            </div>
            {resultDamageModifiers && Object.entries(resultDamageModifiers).map(
              ([key, value]) => <div key={key}>
                {translate(`ui.damageType.${key}`)}
                {': '}
                <Value value={translate(`ui.damageModifier.${value}`)}
                  originalValue={translate(`ui.damageModifier.${damageModifiers?.[key as DamageType]}`)} />
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
    {moveSpeed && extraData?.effects.RemoveSpeedPenalty == null ? <div>
      {translate('ui.moveSpeed')}
      {': '}
      <span className="InvTooltip__value">{showMoveSpeed(moveSpeed)}</span>
      {' '}
      (Total: <span className="InvTooltip__extra">{showMoveSpeed(totalMovementModifier)}</span>)
    </div> : null}
    {extraData
      ? <>
          <EpicLootSetBonusTooltip set={(item as Armor).set} item={item} equippedItems={equippedItems} />
          <EpicLootLegendarySetBonusTooltip set={extraData?.set} item={item} equippedItems={equippedItems} />
          <EpicLootTooltip {...extraData} />
        </>
      : <SetBonusTooltip set={(item as Armor).set} />}
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
    return <div className="Inventory__Item" style={style} onMouseMove={() => onTooltip(invItem)}>
      <div className="InvItem__Icon">
        <ItemIcon item={item} size={64} />
      </div>
    </div>;
  }

  const extraData = extractExtraData(invItem);

  const [, maxDurability] = getMaxDurability(invItem, item, extraData);
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

  const { variant } = invItem;

  return <div
    className={classes.join(' ')}
    style={style}
  >
    <div className="InvItem__Icon InvItem__Icon--shadow">
      <ItemIcon item={item} size={64} variant={variant} />
    </div>
    <div className="InvItem__Icon" onMouseMove={() => onTooltip(invItem)}>
      <ItemIcon item={item} size={64} variant={variant} />
    </div>
    {(item.maxLvl ?? 1) > 1 && <div className="InvItem__quality text-outline">
      {invItem.quality}
    </div>}
    {(item.stack ?? 1) > 1 && <div className="InvItem__stack text-outline">
      {invItem.stack}/{item.stack}
    </div>}
    {isFinite(maxDurability) && <div className="InvItem__durability">
      <div className="InvItem__durability-value" style={{ width: `${100 * invItem.durability / maxDurability}%` }} />
    </div>}
  </div>
}

const getEquippedIds = defaultMemoize(
  (inventory: TInventory, extras: TInventory[]): InvItem[] => [inventory].concat(extras)
    .flatMap(invPart => invPart.items)
    .filter(item => item.equipped)
);

export function Inventory({ inventory, extras } : { inventory: TInventory, extras: TInventory[] }) {
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
    {tooltipData != null && <Tooltip {...tooltipData} equippedItems={equippedItems} />}
  </>
}
