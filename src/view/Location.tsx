import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';

import { isEmpty } from '../model/utils';
import { getLocationDetails } from '../data/location';

import { TranslationContext } from '../effects';
import { Area, List, rangeBy } from './helpers';
import { DropStats } from './DropTable';

export function Location() {
  const { id } = useParams<{ id: string }>();
  const translate = useContext(TranslationContext);

  const loc = getLocationDetails(id);
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
          <dd><List>{biomes.map(biome => <Area area={biome} key={biome} />)}</List></dd>
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
        {!isEmpty(loc.creatures) && <>
          <h2>{translate('ui.creatures')}</h2>
          <DropStats items={loc.creatures} />
        </>}
        {!isEmpty(loc.resources) && <>
          <h2>{translate('ui.resources')}</h2>
          <DropStats items={loc.resources} />
        </>}
        {!isEmpty(loc.destructibles) && <>
          <h2>{translate('ui.objects')}</h2>
          <DropStats items={loc.destructibles} />
        </>}
      </section>
    </>
  );
}