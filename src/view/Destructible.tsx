import React, { useContext } from 'react';

import type { DamageModifier, Destructible as TDestructible, Weapon } from '../types';
import { SkillType } from '../model/skills';
import { axes, items as weapons, pickaxes } from '../data/weapons';
import { fullDestructible } from '../data/objects';

import { TranslationContext } from '../effects';
import { InlineObjectWithIcon, Resistances } from './helpers';
import { ItemHeader } from './ItemHeader';
import { DropTable } from './DropTable';
import { GrowSection } from './Source';

const nonImmune = (mod: DamageModifier): boolean => {
  return mod !== 'ignore' && mod !== 'immune';
};

export function Destructible({ item }: { item: TDestructible }) {
  const full = fullDestructible(item);
  const { hp, damageModifiers, drop } = full;
  const translate = useContext(TranslationContext);

  const onlyDamagers: Weapon[] = [
    ...(nonImmune(damageModifiers.chop)
      ? axes.filter(w => (w?.toolTier ?? 0) >= item.minToolTier)
      : []),
    ...(nonImmune(damageModifiers.pickaxe)
      ? pickaxes.filter(w => (w?.toolTier ?? 0) >= item.minToolTier)
      : []),
  ];

  return (
    <>
      <ItemHeader item={item} />
      <section>
        <h2>{translate('ui.destructible')}</h2>
        <dl>
          <dt>{translate('ui.durability')}</dt><dd>{hp}</dd>
          <Resistances mods={damageModifiers} />
          {item.minToolTier >= 0 ? <>
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
      <section>
        <h2>Source</h2>
        <GrowSection item={item} />
      </section>
      <section>
        <h2>{translate('ui.drops')}</h2>
        <DropTable drops={drop} />
      </section>
    </>
  );
}