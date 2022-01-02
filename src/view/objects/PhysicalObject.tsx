import React, { useContext } from 'react';

import type * as T from '../../types';
import { timeI2S } from '../../model/utils';
import { fullDestructible } from '../../data/objects';

import { TranslationContext } from '../../effects';
import { Area, List, rangeBy } from '../helpers';
import { ItemHeader } from '../parts/ItemHeader';
import { DropTable } from '../parts/DropTable';
import { GrowSection } from '../parts/Source';
import { Destructible } from '../parts/Destructible';

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
      {item.Plant && <Plant plant={item.Plant} />}
      {full?.Destructible && <Destructible item={full.Destructible} />}
      {item.drop && <Drop drop={item.drop} />}
    </>
  );
}