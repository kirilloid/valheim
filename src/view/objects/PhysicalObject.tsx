import React, { useContext } from 'react';

import type * as T from '../../types';
import { timeI2S } from '../../model/utils';
import { axes, pickaxes } from '../../data/weapons';
import { fullDestructible } from '../../data/objects';

import { TranslationContext } from '../../effects';
import { Area, InlineObjectWithIcon, List, rangeBy, Resistances } from '../helpers';
import { ItemHeader } from '../parts/ItemHeader';
import { DropTable } from '../parts/DropTable';
import { GrowSection } from '../parts/Source';

const nonImmune = (mod: T.DamageModifier): boolean => {
  return mod !== 'ignore' && mod !== 'immune';
};

function Destructible({ item }: { item: T.Destructible }) {
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

function Grow({ item }: { item: T.PhysicalObject }) {
  return <section>
    <h2>Source</h2>
    <GrowSection item={item} />
  </section>
}

function Drop({ drop }: { drop: T.GeneralDrop[] }) {
  const translate = useContext(TranslationContext);
  return <section>
    <h2>{translate('ui.drops')}</h2>
    <DropTable drops={drop} />
  </section>
}

function Plant({ plant }: { plant: T.Plantable }) {
  const { biomes, growTime } = plant;
  const translate = useContext(TranslationContext);
  return <section>
    <h2>{translate(`ui.plant`)}</h2>
    <dl>
      <dt>planted in</dt>
      <dd><List>{biomes.map(b => <Area key={b} area={b} />)}</List></dd>
      <dt>grow time</dt>
      <dd>{rangeBy(growTime, timeI2S)}</dd>
    </dl>
  </section>
}

export function PhysicalObject({ item }: { item: T.PhysicalObject }) {
  const full = fullDestructible(item);

  return (
    <>
      <ItemHeader item={item} />
      <Grow item={item} />
      {item.plant && <Plant plant={item.plant} />}
      {full?.destructible && <Destructible item={full.destructible} />}
      {item.drop && <Drop drop={item.drop} />}
    </>
  );
}