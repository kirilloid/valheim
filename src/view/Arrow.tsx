import React, { useContext } from 'react';
import { SkillType } from '../model/skills';
import { TranslationContext } from '../translation.effect';

import type { Arrow as TArrow } from '../types';
import { ShortWeaponDamage } from './helpers';
import { Icon } from './Icon';
import { ItemHeader } from './ItemHeader';
import { Source } from './Source';

export function Arrow({ item }: { item: TArrow }) {
  const translate = useContext(TranslationContext);
  return (
    <>
      <ItemHeader item={item} />
      <section>
        <h2>{translate('ui.itemType.arrow')}</h2>
        <dl>
          <dt>{translate('ui.damage')}</dt>
          <dd><ShortWeaponDamage damage={item.damage} skill={SkillType.Bows} /></dd>
        </dl>
      </section>
      <section>
        <h2>{translate('ui.itemType.resource')}</h2>
        <dl>
          <dt>{translate('ui.weight')}</dt><dd><Icon id="weight" size={16} />{' '}{item.weight}</dd>
          <dt>{translate('ui.stack')}</dt><dd>{item.stack}</dd>
          <dt>{translate('ui.floats')}</dt><dd>{item.floating ? '✔️' : '❌'}</dd>
        </dl>
      </section>
      <Source id={item.id} />
    </>
  );
}