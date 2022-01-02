import React, { useContext } from 'react';
import type * as T from '../../types';

import { TranslationContext } from '../../effects';
import { axes, pickaxes } from '../../data/weapons';
import { InlineObjectWithIcon, Resistances } from '../helpers';

const nonImmune = (mod: T.DamageModifier): boolean => {
  return mod !== 'ignore' && mod !== 'immune';
};

export function Destructible({ item }: { item: T.Destructible }) {
  const translate = useContext(TranslationContext);
  const { hp, damageModifiers, minToolTier } = item;

  const onlyDamagers: T.Weapon[] = [
    ...(nonImmune(damageModifiers.chop)
      ? axes.filter(w => (w?.toolTier ?? 0) >= minToolTier)
      : []),
    ...(nonImmune(damageModifiers.pickaxe)
      ? pickaxes.filter(w => (w?.toolTier ?? 0) >= minToolTier)
      : []),
  ];

  return <section>
    <h2>{translate('ui.destructible')}</h2>
    <dl>
      <dt>{translate('ui.durability')}</dt><dd>{hp}</dd>
      <Resistances mods={damageModifiers} />
      {item.minToolTier > 0 || Object.values(damageModifiers).filter(mod => mod === 'immune' || mod === 'ignore').length > 5 ? <>
        <dt>can be damaged only by</dt>
        <dd>
          <ul>
            {onlyDamagers.map(w => <li key={w.id}>
              <InlineObjectWithIcon id={w.id} />
            </li>)}
          </ul>
        </dd>
      </> : null}
    </dl>
  </section>
}

