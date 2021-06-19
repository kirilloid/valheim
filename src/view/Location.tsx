import React, { useContext } from 'react';
import { Link, useParams } from 'react-router-dom';

import { TranslationContext } from '../translation.effect';
import { locations } from '../model/location';
import { ItemIcon } from './Icon';
import { data } from '../model/objects';

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
          <dt>creatures</dt>
          <dd>
            {loc.creatures.length
              ? <ul>{loc.creatures.map(c =>
                  <li>
                    <ItemIcon item={c} size={32} />
                    <Link to={`/obj/${c.id}`}>{translate(c.id)}</Link>
                  </li>)}
                </ul>
              : <em>none</em>}
          </dd>
          <dt>resources</dt>
          <dd>
            {loc.resources.length
              ? <ul>{loc.resources.map(id =>
                  <li>
                    <ItemIcon item={data[id]} size={32} />
                    <Link to={`/obj/${id}`}>{translate(id)}</Link>
                  </li>
                )}
                </ul>
              : <em>none</em>}
          </dd>
        </dl>
      </section>
    </>
  );
}