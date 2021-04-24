import React from 'react';
import { Link } from 'react-router-dom';

import type { Item } from '../types';
import { durability } from './helpers';
import { Icon } from './Icon';
import { Recipe } from './Recipe';

export function Armor(item: Item & { type: 'armor' }) {
  const { recipe } = item; 
  return (
    <>
      <h2>
        <Icon type="armor" id={item.id} />
        {' '}
        {item.id}
      </h2>
      <section>
        <header>armor</header>
        <dl>
          <dt>slot</dt><dd>{item.slot}</dd>
          <dt><Link to="/info/combat#armor">armor</Link></dt><dd>{item.armor.join('+')}</dd>
          <dt>max quality</dt><dd>{item.maxLvl}</dd>
          <dt title="armor loose durability 1:1 to received damage, but only for one randomly chosen piece of armor">durability</dt><dd>{durability(item.durability)}</dd>
          {item.moveSpeed ? <><dt title="when equipeed">move speed</dt><dd>{item.moveSpeed * 100}%</dd></> : null}
          {item.damageModifiers ? <><dt>resistance</dt><dd>{JSON.stringify(item.damageModifiers)}</dd></> : null}
        </dl>
      </section>
      {recipe ? (<>
        recipe: <Recipe {...recipe} />
        </>) : null}
    </>
  );
}
