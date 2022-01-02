import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';

import type { LocationConfig } from '../types';

import { isEmpty } from '../model/utils';
import { getLocationDetails, locations } from '../data/location';

import { TranslationContext } from '../effects';
import { Area, List, rangeBy } from './helpers';
import { DropStats } from './parts/DropTable';
import { Tabs } from './parts/Tabs';

function SingleLocation({ loc }: { loc: LocationConfig }) {
  const translate = useContext(TranslationContext);
  return (
    <section>
      <dl>
        <dt>{translate('ui.biome')}</dt>
        <dd><List>{loc.biomes.map(biome => <Area area={biome} key={biome} />)}</List></dd>
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
  );
}

export function Location() {
  const { id } = useParams<{ id: string }>();
  const translate = useContext(TranslationContext);

  const summary = getLocationDetails(id);
  if (summary == null) {
    return <div className="error">
      Location "{id}" not found
    </div>
  }
  const locs = locations.filter(loc => loc.typeId === id);

  if (locs.length === 1) {
    return (
      <>
        <h1>{translate(`ui.location.${id}`)}</h1>
        <SingleLocation loc={summary} />
      </>
    );  
  }

  const tabs = [{
    title: 'summary',
    renderer: () => <SingleLocation loc={summary} />
  }, ...locs.map((loc, i) => ({
    title: `#${i + 1}`,
    renderer: () => <SingleLocation loc={loc} />
  }))]

  return (
    <>
      <h1>{translate(`ui.location.${id}`)}</h1>
      <Tabs tabs={tabs} selected={0} key={id} />
    </>
  );
}