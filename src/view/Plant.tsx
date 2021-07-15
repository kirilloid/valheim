import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { TranslationContext } from '../effects';

import type { Plant as TPlant } from '../types';
import { ItemIcon } from './Icon';
import { ItemHeader } from './ItemHeader';
import { data } from '../model/objects';
import { timeI2S } from '../model/utils';

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
          <dd>{biomes.map(b => translate(`ui.biome.${b}`)).join(', ')}</dd>
          <dt>grow time</dt>
          <dd>{timeI2S(growTime[0])}–{timeI2S(growTime[1])}</dd>
          <dt>grown form</dt>
          <dd>{<ItemIcon item={data[growsInto]} />} <Link to={`/obj/${growsInto}`}>{translate(growsInto)}</Link></dd>
        </dl>
      </section>
    </>
  );
}