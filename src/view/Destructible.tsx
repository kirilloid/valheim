import React, { useContext } from 'react';

import { TranslationContext } from '../effects';
import { fullDestructible } from '../model/objects';

import type { BiomeConfig, DamageModifier, Destructible as TDestructible, LocationConfig, Weapon } from '../types';
import { DropTable } from './DropTable';
import { Area, InlineObjectWithIcon, List, Resistances } from './helpers';
import { items as weapons } from '../model/weapons';
import { ItemHeader } from './ItemHeader';
import { SkillType } from '../model/skills';
import { biomes, locations } from '../model/location';
import { GrowSection } from './Source';

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