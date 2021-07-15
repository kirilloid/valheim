import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { TranslationContext } from '../effects';

import type { Destructible as TDestructible, GeneralDrop } from '../types';
import { Resistances, showNumber } from './helpers';
import { ItemIcon } from './Icon';
import { ItemHeader } from './ItemHeader';
import { data } from '../model/objects';

function DropTable({ drop }: { drop: GeneralDrop }) {
  const translate = useContext(TranslationContext);
  const {
    chance = 1,
    num: [min, max],
    options,
  } = drop;
  const mul = chance * (min + max) / 2 / options.length;
  const totalWeight = options.reduce((w, { weight = 1 }) => w + weight, 0); 
  return <ul>
    {options.map(opt => {
      const { item, num, weight = 1 } = opt;
      const avg = (num[0] + num[1]) / 2 * (weight / totalWeight);
      return <li key={item}>
        {showNumber(avg * mul)}
        {' '}
        <ItemIcon item={data[item]} />
        {' '}
        <Link to={`/obj/${item}`}>{translate(item)}</Link>
      </li>
    })}
  </ul>;
}

export function Destructible({ item }: { item: TDestructible }) {
  const { hp, damageModifiers, drop } = item;
  const translate = useContext(TranslationContext);
  return (
    <>
      <ItemHeader item={item} />
      <section>
        <h2>{translate(`ui.piece`)}</h2>
        <dl>
          <dt>health</dt><dd>{hp}</dd>
          <Resistances mods={damageModifiers} />
          <dt>drop</dt>
          <dd>
            <DropTable drop={drop} />
          </dd>
        </dl>
      </section>
    </>
  );
}