import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../translation.effect';

import type { Armor as TArmor } from '../types';
import { durability, ItemSpecial, showPair } from './helpers';
import { Icon } from './Icon';
import { RecipeSection } from './Source';

export function Armor(item: TArmor, level?: number) {
  const translate = useTranslation();
  return (
    <>
      <h2>
        <Icon type="armor" id={item.id} />
        {' '}
        {translate(item.id)}
      </h2>
      <section>
        <header>{translate('ui.itemType.armor')}</header>
        <dl>
          <dt>{translate('ui.slot')}</dt><dd>{translate(`ui.slot.${item.slot}`)}</dd>
          <dt><Link to="/info/combat#armor">{translate('ui.armor')}</Link></dt><dd>{showPair(item.armor, level)}</dd>
          <dt>{translate('ui.maxQuality')}</dt><dd>{item.maxLvl}</dd>
          <dt title="armor loose durability 1:1 to received damage, but only for one randomly chosen piece of armor">durability</dt><dd>{durability(item.durability, level)}</dd>
          {item.moveSpeed ? <><dt title="when equipeed">move speed</dt><dd>{item.moveSpeed * 100}%</dd></> : null}
          {item.damageModifiers ? <><dt>resistance</dt><dd>{JSON.stringify(item.damageModifiers)}</dd></> : null}
          <ItemSpecial special={item.special} />
        </dl>
      </section>
      <section>
        <header>{translate('ui.itemType.resource')}</header>
        <dl>
          <dt>{translate('ui.weight')}</dt><dd><Icon type="icon" id="weight" size={16} />{' '}{item.weight}</dd>
          <dt>{translate('ui.floats')}</dt><dd>{item.floating ? '✔️' : '❌'}</dd>
        </dl>
      </section>
      <RecipeSection item={item} />
    </>
  );
}
