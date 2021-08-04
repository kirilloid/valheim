import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { TranslationContext } from '../effects';

import type { Plant as TPlant } from '../types';
import { ItemIcon } from './Icon';
import { ItemHeader } from './ItemHeader';
import { data } from '../model/objects';
import { timeI2S } from '../model/utils';
import { Area, List, rangeBy } from './helpers';

export function Plant({ item }: { item: TPlant }) {
  const { biomes, growTime, growsInto } = item;
  const translate = useContext(TranslationContext);
  return (
    <>
      <ItemHeader item={item} />
      <section>
        <h2>{translate(`ui.plant`)}</h2>
        <dl>
          <dt>planted in</dt>
          <dd><List>{biomes.map(b => <Area area={b} />)}</List></dd>
          <dt>grow time</dt>
          <dd>{rangeBy(growTime, timeI2S)}</dd>
          <dt>grown form</dt>
          <dd>{<ItemIcon item={data[growsInto]} />} <Link to={`/obj/${growsInto}`}>{translate(growsInto)}</Link></dd>
        </dl>
      </section>
    </>
  );
}