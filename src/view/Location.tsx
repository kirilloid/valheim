import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';

import { locations } from '../data/location';

import { TranslationContext } from '../effects';
import { Area, InlineObjectWithIcon, List, rangeBy } from './helpers';

export function Location() {
  const { id } = useParams<{ id: string }>();
  const translate = useContext(TranslationContext);

  const loc = locations.find(l => l.id === id);
  if (loc == null) {
    return <div className="error">
      Location "{id}" not found
    </div>
  }

  const { biomes } = loc;

  return (
    <>
      <h1>{translate(`ui.location.${loc.id}`)}</h1>
      <section>
        <dl>
          <dt>{translate('ui.biome')}</dt>
          <dd><List>{biomes.map(biome => <Area area={biome} />)}</List></dd>
          <dt>{translate('ui.locationType')}</dt>
          <dd>{translate(`ui.locationType.${loc.type}`)}</dd>
          <dt>{translate('ui.altitude')}</dt>
          <dd>{rangeBy(loc.altitude, String, '..')}</dd>
          <dt>number in world</dt>
          <dd>{loc.quantity}</dd>
          {/*vegvisir ? <>
            <dt>{translate('vegvisir')}</dt>
            <dd><InlineObjectWithIcon id={vegvisir.boss} />, {vegvisir.chance * 100}% chance</dd>
          </> : null*/}
        </dl>
        {loc.creatures.length
        ? <>
            <h2>{translate('ui.creatures')}</h2>
            <ul>{loc.creatures.map(c =>
              <li key={c.id}>
                <InlineObjectWithIcon id={c.id} size={32} />
              </li>
            )}
            </ul>
          </>
        : null}
        {loc.resources.length
        ? <>
            <h2>{translate('ui.resources')}</h2>
            <ul>{loc.resources.map(id =>
              <li key={id}>
                <InlineObjectWithIcon id={id} />
              </li>
            )}
            </ul>
          </>
        : null}
      </section>
    </>
  );
}