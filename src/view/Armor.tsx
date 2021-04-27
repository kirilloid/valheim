import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../translation.effect';

import type { Item } from '../types';
import { durability } from './helpers';
import { Icon } from './Icon';
import { Recipe } from './Recipe';

export function Armor(item: Item & { type: 'armor' }) {
  const translate = useTranslation();
  const { recipe } = item;
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
          <dt>slot</dt><dd>{item.slot}</dd>
          <dt><Link to="/info/combat#armor">{translate('ui.armor')}</Link></dt><dd>{item.armor.join('+')}</dd>
          <dt>{translate('ui.maxQuality')}</dt><dd>{item.maxLvl}</dd>
          <dt title="armor loose durability 1:1 to received damage, but only for one randomly chosen piece of armor">durability</dt><dd>{durability(item.durability)}</dd>
          {item.moveSpeed ? <><dt title="when equipeed">move speed</dt><dd>{item.moveSpeed * 100}%</dd></> : null}
          {item.damageModifiers ? <><dt>resistance</dt><dd>{JSON.stringify(item.damageModifiers)}</dd></> : null}
        </dl>
      </section>
      {recipe ? (<>
        {translate('ui.recipe')}: <Recipe {...recipe} />
        </>) : null}
    </>
  );
}
