import React, { useContext } from 'react';
import { Link, useParams } from 'react-router-dom';

import type { GeneralDrop } from '../types';
import { TranslationContext } from '../effects';
import { locations } from '../model/location';
import { ItemIcon } from './Icon';
import { data } from '../model/objects';
import { showNumber } from './helpers';

function Chest({ chest }: { chest: GeneralDrop | undefined }) {
  const translate = useContext(TranslationContext);
  if (chest == null) {
    return null;
  }

  const totalWeight = chest.options.reduce((a, { weight = 1 }) => a + weight, 0);
  const total = (chest.num[0] + chest.num[1]) / 2;

  return (
    <>
      <h2>chest</h2>
      <ul>
      {chest.options.map(({ item: id, num, weight = 1 }) =>
        <li>
          <ItemIcon item={data[id]} size={32} />
          <Link to={`/obj/${id}`}>{translate(id)}</Link>
          {' x'}
          {showNumber(total * (num[0] + num[1]) / 2 * weight / totalWeight)}
        </li>
      )}
      </ul>
    </>
  );
}

export function Location() {
  const { id } = useParams<{ id: string }>();
  const translate = useContext(TranslationContext);

  const loc = locations.find(l => l.id === id);
  if (loc == null) {
    return <span className="error">
      Location "{id}" not found
    </span>
  }

  return (
    <>
      <h1>{translate(`ui.location.${loc.id}`)}</h1>
      <section>
        <dl>
          <dt>{translate('ui.biome')}</dt>
          <dd><Link to={`/biome/${loc.biome}`}>{translate(`ui.biome.${loc.biome}`)}</Link></dd>
          <dt>{translate('ui.locationType')}</dt>
          <dd>{translate(`ui.locationType.${loc.type}`)}</dd>
        </dl>
        {loc.creatures.length
        ? <>
            <h2>creatures</h2>
            <ul>{loc.creatures.map(c =>
              <li>
                <ItemIcon item={c} size={32} />
                <Link to={`/obj/${c.id}`}>{translate(c.id)}</Link>
              </li>)}
            </ul>
          </>
        : <em>none</em>}
        {loc.resources.length
        ? <>
            <h2>resources</h2>
            <ul>{loc.resources.map(id =>
              <li>
                <ItemIcon item={data[id]} size={32} />
                <Link to={`/obj/${id}`}>{translate(id)}</Link>
              </li>
            )}
            </ul>
          </>
        : <em>none</em>}
        <Chest chest={loc.chest} />
      </section>
    </>
  );
}