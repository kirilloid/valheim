import React from 'react';
import { DamageType, Potion as TPotion } from '../types';
import { timeI2S } from '../model/utils';
import { Icon } from './Icon';
import { Recipe } from './Recipe';
import { useTranslation } from '../translation.effect';

export function Potion(item: TPotion) {
  const translate = useTranslation();
  const { recipe } = item;
  return (<>
    <h2>
      <Icon type="resources" id={item.id} />
      {' '}
      {translate(item.id)}
    </h2>
    <section>
      <header>potion</header>
      <dl>
      {item.health ? <><dt>health</dt><dd>+{item.health[0]} over {timeI2S(item.health[1])}</dd></> : null}
      {item.stamina ? <><dt>stamina</dt><dd>+{item.stamina[0]} over {timeI2S(item.stamina[1])}</dd></> : null}
      {item.healthRegen ? <><dt>health regen</dt><dd>{item.healthRegen * 100}%</dd></> : null}
      {item.staminaRegen ? <><dt>stamina regen</dt><dd>{item.staminaRegen * 100}%</dd></> : null}
      {item.resist ? <><dt>resistance</dt><dd>{item.resist.map(r => DamageType[r]).join(', ')}</dd></> : null}
      <dt>cooldown</dt><dd>{timeI2S(item.cooldown)}</dd>
      </dl>
    </section>
    {recipe ? (<>
    recipe: <Recipe {...recipe} />
    </>) : null}
  </>);
}
