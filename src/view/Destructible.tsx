import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import { TranslationContext } from '../effects';
import { fullDestructible } from '../model/destructibles';

import type { BiomeConfig, DamageModifier, Destructible as TDestructible, LocationConfig, Weapon } from '../types';
import { DropTable } from './DropTable';
import { Area, Resistances } from './helpers';
import { items as weapons } from '../model/weapons';
import { ItemHeader } from './ItemHeader';
import { SkillType } from '../model/skills';
import { ItemIcon } from './Icon';
import { biomes, locations } from '../model/location';

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
          <dt>could be found in</dt>
          <dd>{
            ([] as (LocationConfig | BiomeConfig)[]).concat(locations, biomes)
              .filter(loc => loc.destructibles.includes(item))
              .flatMap(loc => [<Area area={loc.id} />, ', '])
          }</dd>
          <dt>{translate('ui.durability')}</dt><dd>{hp}</dd>
          <Resistances mods={damageModifiers} />
          {item.minToolTier >= 0 ?  <>
            <dt>can be damaged only by</dt>
            <dd>
              <ul>
                {onlyDamagers.map(w => <li>
                  <ItemIcon key={w.id} item={w} />
                  <Link to={`/obj/${w.id}`}>{translate(w.id)}</Link>
                </li>)}
              </ul>
            </dd>
          </> : null}
          <dt>{translate('ui.drops')}</dt>
          <dd><DropTable drops={drop} /></dd>
        </dl>
      </section>
    </>
  );
}