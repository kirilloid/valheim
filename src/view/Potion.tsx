import React, { useContext } from 'react';
import { DamageType, Potion as TPotion } from '../types';
import { timeI2S } from '../model/utils';
import { Icon } from './Icon';
import { RecipeSection } from './Source';
import { TranslationContext } from '../translation.effect';

export function Potion({ item }: { item: TPotion }) {
  const translate = useContext(TranslationContext);
  return (<>
    <h1>
      <Icon type="resource" id={item.id} />
      {' '}
      {translate(item.id)}
    </h1>
    <section>
      <h2>{translate('ui.itemType.potion')}</h2>
      <dl>
        {item.health ? <><dt>{translate('ui.health')}</dt><dd>+{item.health[0]} over {timeI2S(item.health[1])}</dd></> : null}
        {item.stamina ? <><dt>{translate('ui.stamina')}</dt><dd>+{item.stamina[0]} over {timeI2S(item.stamina[1])}</dd></> : null}
        {item.healthRegen ? <><dt>health regen</dt><dd>{item.healthRegen * 100}%</dd></> : null}
        {item.staminaRegen ? <><dt>stamina regen</dt><dd>{item.staminaRegen * 100}%</dd></> : null}
        {item.resist ? <><dt>resistance</dt><dd>{item.resist.map(r => DamageType[r]).join(', ')}</dd></> : null}
        <dt>cooldown</dt><dd>{timeI2S(item.cooldown)}</dd>
      </dl>
    </section>
    <section>
      <h2>{translate('ui.itemType.resource')}</h2>
      <dl>
        <dt>{translate('ui.weight')}</dt><dd><Icon type="icon" id="weight" size={16} />{' '}{item.weight}</dd>
        <dt>{translate('ui.stack')}</dt><dd>{item.stack}</dd>
        <dt>{translate('ui.floats')}</dt><dd>{item.floating ? '✔️' : '❌'}</dd>
      </dl>
    </section>
    <RecipeSection item={item} />
  </>);
}
