import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { TranslationContext } from '../../effects';

import type { Armor as TArmor, ItemSet as TItemSet } from '../../types';
import { durability, InlineObjectWithIcon, ItemSpecial, Resistances, showPair, showPercent } from '../helpers';
import { Effect } from '../parts/Effect';
import { ItemIcon } from '../parts/Icon';
import { ItemHeader } from '../parts/ItemHeader';
import { Resource } from '../parts/Resource';
import { RecipeSection } from '../parts/Source';

function ItemSet({ item, set }: { item: TArmor, set: TItemSet }) {
  const translate = useContext(TranslationContext);
  return (
    <section>
      <h2>Set</h2>
      <h3>Items</h3>
      <ul>{
        set.items.map(id => id === item.id
          ? <li key={id}><><ItemIcon item={item} /> {translate(id)}</></li>
          : <li key={id}><InlineObjectWithIcon id={id} /></li>)
      }</ul>
      {set.bonus.map(effect => effect && <React.Fragment key={effect.id}>
      <h3>Bonus: {translate(`ui.effect.${effect.id}`)}</h3>
      <dl>
        <Effect effect={effect} />
      </dl>
      </React.Fragment>)}
    </section>
  );
}

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
          {item.staminaModifiers ? <React.Fragment key="staminaMods">
            {Object.entries(item.staminaModifiers).map(([key, val]) => <React.Fragment key={key}>
              <dt>stamina: {key}</dt><dd>{showPercent(val)}</dd>
            </React.Fragment>)}
          </React.Fragment> : null}
          <dt title="armor loose durability 1:1 to received damage, but only for one randomly chosen piece of armor">{translate('ui.durability')}</dt><dd>{durability(item.durability, level)}</dd>
          {item.moveSpeed ? <React.Fragment key="moveSpeed"><dt title="when equipped">{translate('ui.moveSpeed')}</dt><dd>{item.moveSpeed * 100}%</dd></React.Fragment> : null}
          {item.damageModifiers ? <Resistances mods={item.damageModifiers} /> : null}
          {item.eitrRegen ? <React.Fragment key="eitr"><dt>eitr</dt><dd>{item.eitrRegen} / s</dd></React.Fragment> : null}
          <ItemSpecial special={item.special} />
        </dl>
      </section>
      {item.set ? <ItemSet item={item} set={item.set} /> : null}
      {item.effect ? <React.Fragment key="effect">
        <section>
          <h2>{translate('ui.effect')}</h2>
          <dl>
            <Effect effect={item.effect} />
          </dl>
        </section>
      </React.Fragment> : null}
      <Resource item={item} />
      <RecipeSection item={item} />
    </>
  );
}
