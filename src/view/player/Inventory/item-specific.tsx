import React, { useContext } from 'react';

import type { Armor as TArmor, Arrow, DamageType, Food as TFood, Item, Shield as TShield, Weapon } from '../../../types';
import type { InvItem } from './types';
import { addDamage, multiplyDamage } from '../../../model/combat';
import { timeI2S } from '../../../model/utils';
import { EpicLootData, getEpicLootData, modifyDamage, modifyResistances } from '../../../mods/epic-loot';

import { TranslationContext } from '../../../effects';
import { List } from '../../helpers';

function Food({ stats }: { stats: TFood }) {
  const translate = useContext(TranslationContext);
  return <>
    <div key="health">{translate('ui.health')}: <span className="InvTooltip__value" style={{ color: '#ff8080' }}>{stats.health}</span></div>
    <div key="stamina">{translate('ui.stamina')}: <span className="InvTooltip__value" style={{ color: '#ffff80' }}>{stats.stamina}</span></div>
    {stats.eitr && <div key="eitr">{translate('ui.eitr')}: <span className="InvTooltip__value" style={{ color: '#9090ff' }}>{stats.eitr}</span></div>}
    <div key="duration">{translate('ui.duration')}: <span className="InvTooltip__value">{timeI2S(stats.duration)}</span></div>
    <div key="regen">{translate('ui.regen')}: <span className="InvTooltip__value">{stats.regen}</span></div>
  </>;
}

const Value = <T extends string | number>({ value, originalValue, rarityClass }: { value: T; originalValue: T; rarityClass: string }) => {
  return <span className={value === originalValue ? 'InvTooltip__value' : rarityClass}>{value}</span>
};

function Damage({ item, invItem, epicLoot }: { item: Weapon; invItem: InvItem; epicLoot?: EpicLootData }) {
  const translate = useContext(TranslationContext);

  const damage = addDamage(item.damage[0], multiplyDamage(item.damage[1], invItem.quality - 1));
  const resultDamage = modifyDamage(damage, epicLoot?.effects);
  const rarityClass = `EpicLoot--${epicLoot?.rarity ?? 'Generic'}`;
  const attack = item.attacks[0];

  return <>
    {Object.entries(resultDamage)
      .filter(([, value]) => value)
      .map(([key, value]) => <div key={key}>
        {translate(`ui.damageType.${key}`)}{': '}
        <Value value={value} originalValue={damage[key as DamageType] ?? 0} rarityClass={rarityClass} />
      </div>
    )}
    {attack?.stamina ? <div>{translate('ui.stamina')}: <span className="InvTooltip__value">{attack.stamina}</span></div> : null}
    {attack?.eitr && <div>{translate('ui.eitr')}: <span className="InvTooltip__value">{attack.eitr}</span></div>}
    {attack?.healthPercent && <div>{translate('ui.health')}: <span className="InvTooltip__value">{attack.healthPercent}%</span></div>}
    <div>{translate('ui.knockback')}: <span className="InvTooltip__value">{item.knockback}</span></div>
    <div>{translate('ui.backstab')}: <span className="InvTooltip__value">{item.backstab}x</span></div>
  </>;
}

function Shield({ item, invItem }: { item: TShield; invItem: InvItem }) {
  const translate = useContext(TranslationContext);

  const block = typeof item.block === 'number'
    ? item.block
    : item.block[0] + item.block[1] * (invItem.quality - 1);

  return <>
    <div>{translate('ui.block')}: <span className="InvTooltip__value">{block}</span></div>
    {item.parryBonus > 1 && <div>{translate('ui.parryBonus')}: <span className="InvTooltip__value">{item.parryBonus}x</span></div>}
  </>;
}

function Armor({ item, invItem, epicLoot }: { item: TArmor; invItem: InvItem; epicLoot?: EpicLootData }) {
  const translate = useContext(TranslationContext);
  const rarityClass = `EpicLoot--${epicLoot?.rarity ?? 'Generic'}`;

  const armor = item.armor[0] + item.armor[1] * (invItem.quality - 1);
  const resultArmor = epicLoot?.effects.ModifyArmor == null ? armor : armor * (1 + epicLoot.effects.ModifyArmor / 100);
  const damageModifiers = item.damageModifiers;
  const resultDamageModifiers = damageModifiers && modifyResistances(damageModifiers, epicLoot?.effects);

  return <>
    <div>
      {translate('ui.armor')}{': '}
      <Value value={resultArmor} originalValue={armor} rarityClass={rarityClass} />
    </div>
    {resultDamageModifiers && Object.entries(resultDamageModifiers).map(
      ([key, value]) => <div key={key}>
        {translate(`ui.damageType.${key}`)}
        {': '}
        <Value value={translate(`ui.damageModifier.${value}`)}
          originalValue={translate(`ui.damageModifier.${damageModifiers?.[key as DamageType]}`)}
          rarityClass={rarityClass} />
      </div>
    )}
  </>
}

function AmmoDamage({ item }: { item: Arrow }) {
  const translate = useContext(TranslationContext);

  return <>
    <List>
      {Object.entries(item.damage)
        .filter(([, value]) => value)
        .map(([key, value]) => <div key={key}>
          {translate(`ui.damageType.${key}`)}{': '}
          <span className="InvTooltip__value">{value}</span>
        </div>
      )}
    </List>
    <div>{translate('ui.knockback')}: <span className="InvTooltip__value">{item.knockback}</span></div>
  </>;
}

export const ItemSpecific = React.memo(({ invItem, item }: { invItem: InvItem; item: Item; }) => {
  const epicLoot = getEpicLootData(invItem);

  switch (item.type) {
    case 'item':
      return item.Food ? <Food stats={item.Food} /> : null;
    case 'weapon':
      return <Damage item={item} invItem={invItem} epicLoot={epicLoot} />
    case 'shield':
      return <Shield item={item} invItem={invItem} />
    case 'armor':
      return <Armor item={item} invItem={invItem} epicLoot={epicLoot} />
    case 'arrow':
    case 'bolt':
    case 'missile':
      return <AmmoDamage item={item} />
  }
  return null;
});
