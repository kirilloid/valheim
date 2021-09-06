import React, { useContext } from 'react';
import { Link, useParams } from 'react-router-dom';

import { locations } from '../data/location';

import { TranslationContext } from '../effects';
import { ItemIcon } from './Icon';
import { DropTable } from './DropTable';
import { Area, InlineObjectWithIcon, rangeBy } from './helpers';

export function Location() {
  const { id } = useParams<{ id: string }>();
  const translate = useContext(TranslationContext);

  const loc = locations.find(l => l.id === id);
  if (loc == null) {
    return <span className="error">
      Location "{id}" not found
    </span>
  }

  const { biome, vegvisir } = loc;

  return (
    <>
      <h1>{translate(`ui.location.${loc.id}`)}</h1>
      <section>
        <dl>
          <dt>{translate('ui.biome')}</dt>
          <dd><Area area={biome} /></dd>
          <dt>{translate('ui.locationType')}</dt>
          <dd>{translate(`ui.locationType.${loc.type}`)}</dd>
          <dt>altitude range</dt>
          <dd>{rangeBy(loc.altitude, String, '..')}</dd>
          <dt>number in world</dt>
          <dd>{loc.quantity}</dd>
          {vegvisir ? <>
            <dt>{translate('vegvisir')}</dt>
            <dd><InlineObjectWithIcon id={vegvisir.boss} />, {vegvisir.chance * 100}% chance</dd>
          </> : null}
        </dl>
        {loc.creatures.length
        ? <>
            <h2>creatures</h2>
            <ul>{loc.creatures.map(c =>
              <li key={loc.id}>
                <ItemIcon item={c} size={32} />
                <Link to={`/obj/${c.id}`}>{translate(c.id)}</Link>
              </li>)}
            </ul>
          </>
        : null}
        {loc.resources.length
        ? <>
            <h2>resources</h2>
            <ul>{loc.resources.map(id =>
              <li key={id}>
                <InlineObjectWithIcon id={id} />
              </li>
            )}
            </ul>
          </>
        : null}
        {loc.chest && <>
          <h2>chest</h2>
          <DropTable drops={[loc.chest]} />
        </>}
      </section>
    </>
  );
}