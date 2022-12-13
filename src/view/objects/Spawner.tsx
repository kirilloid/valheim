import React from 'react';

import '../../css/Creature.css';

import type { Spawner as TSpawner } from '../../types';
import { data } from '../../data/itemDB';

import { InlineObjectWithIcon, rangeBy } from '../helpers';
import { ItemHeader } from '../parts/ItemHeader';

export function Spawner({ spawner }: { spawner: TSpawner }) {
  const id = spawner.spawn;
  const item = data[id];
  if (!item) return <p>Spawner of #{id}</p>
  return (<>
    <ItemHeader item={item} />
    <section>
      <h2>Spawner</h2>
      <dl>
        <dt>object</dt>
        <dd><InlineObjectWithIcon id={id} /></dd>
        <dt>levels</dt>
        <dd>{rangeBy(spawner.levels, String)}</dd>
        <dt>level up chance</dt>
        <dd>{spawner.levelUpChance}</dd>
      </dl>
    </section>
  </>);
}