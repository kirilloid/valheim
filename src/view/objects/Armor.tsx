import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { TranslationContext } from '../../effects';

import type { Armor as TArmor } from '../../types';
import { durability, ItemSpecial, Resistances, showPair, yesNo } from '../helpers';
import { Icon } from '../parts/Icon';
import { ItemHeader } from '../parts/ItemHeader';
import { RecipeSection } from '../parts/Source';

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
          <dt title="armor loose durability 1:1 to received damage, but only for one randomly chosen piece of armor">{translate('ui.durability')}</dt><dd>{durability(item.durability, level)}</dd>
          {item.moveSpeed ? <><dt title="when equipeed">{translate('ui.moveSpeed')}</dt><dd>{item.moveSpeed * 100}%</dd></> : null}
          {item.damageModifiers ? <Resistances mods={item.damageModifiers} /> : null}
          <ItemSpecial special={item.special} />
        </dl>
      </section>
      <section>
        <h2>{translate('ui.itemType.resource')}</h2>
        <dl>
          <dt>{translate('ui.weight')}</dt><dd><Icon id="weight" alt="" size={16} />{' '}{item.weight}</dd>
          <dt>{translate('ui.floats')}</dt><dd>{yesNo(item.floating)}</dd>
        </dl>
      </section>
      <RecipeSection item={item} />
    </>
  );
}
