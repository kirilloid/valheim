import React, { useContext } from 'react';
import { TranslationContext } from '../effects';

import type { Plant as TPlant } from '../types';
import { timeI2S } from '../model/utils';

import { Area, InlineObjectWithIcon, List, rangeBy } from './helpers';
import { ItemHeader } from './ItemHeader';

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
          <dd><InlineObjectWithIcon id={growsInto} /></dd>
        </dl>
      </section>
    </>
  );
}