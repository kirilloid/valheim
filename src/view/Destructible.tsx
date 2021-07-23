import React, { useContext } from 'react';
import { TranslationContext } from '../effects';
import { fullDestructible } from '../model/destructibles';

import type { DamageModifier, Destructible as TDestructible, Weapon } from '../types';
import { DropTable } from './DropTable';
import { Resistances } from './helpers';
import { items as weapons } from '../model/weapons';
import { ItemHeader } from './ItemHeader';
import { SkillType } from '../model/skills';
import { ItemIcon } from './Icon';

const axes = weapons.filter(w => w.skill === SkillType.Axes && !w.disabled) as Weapon[];
const pickaxes = weapons.filter(w => w.skill === SkillType.Pickaxes && !w.disabled) as Weapon[];

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
        <h2>{translate(`ui.piece`)}</h2>
        <dl>
          <dt>health</dt><dd>{hp}</dd>
          <Resistances mods={damageModifiers} />
          {item.minToolTier >= 0 ?  <>
            <dt>can be damaged by</dt>
            <dd>
              {onlyDamagers.map(w => <ItemIcon key={w.id} item={w} />)}
            </dd>
          </> : null}
          <dt>drop</dt>
          <dd><DropTable drops={drop} /></dd>
        </dl>
      </section>
    </>
  );
}