import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { TranslationContext } from '../translation.effect';

import type { Armor as TArmor } from '../types';
import { durability, ItemSpecial, showPair } from './helpers';
import { Icon } from './Icon';
import { ItemHeader } from './ItemHeader';
import { RecipeSection } from './Source';

export function Armor({ item, level }: { item: TArmor, level?: number }) {
  const translate = useContext(TranslationContext);
  return (
    <>
      <ItemHeader item={item} />
      <section>
        <h2>{translate('ui.itemType.armor')}</h2>
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
        <h2>{translate('ui.itemType.resource')}</h2>
        <dl>
          <dt>{translate('ui.weight')}</dt><dd><Icon id="weight" size={16} />{' '}{item.weight}</dd>
          <dt>{translate('ui.floats')}</dt><dd>{item.floating ? '✔️' : '❌'}</dd>
        </dl>
      </section>
      <RecipeSection item={item} />
    </>
  );
}
