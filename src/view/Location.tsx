import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';

import type { GameLocationId, LocationConfig } from '../types';

import { isEmpty } from '../model/utils';
import { getLocationDetails, locations, musicToLocation } from '../data/location';

import { TranslationContext } from '../effects';
import { Area, InlineObjectWithIcon, List, rangeBy, showNumber } from './helpers';
import { DropStats } from './parts/DropTable';
import { Tabs } from './parts/Tabs';

function LocationHeader({ id, customMusic }: { id: GameLocationId; customMusic?: string }) {
  const translate = useContext(TranslationContext);
  return <h1>
    {translate(`ui.location.${id}`)}
    <span className="entity-type"> &ndash; {translate(`ui.location`)}</span>
    <CustomMusic id={customMusic} />
  </h1>
}

function SingleLocation({ loc }: { loc: LocationConfig }) {
  const translate = useContext(TranslationContext);
  const vegvisirChance = 1 - (loc.destructibles.Vevgvisir?.[0] ?? 1);
  return (
    <section style={{ position: 'relative' }}>
      {loc.id !== loc.typeId &&
      <img src={`/icons/location/${loc.id}.png`} alt="" className="LocationIllustration" />}
      <dl>
        <dt>{translate('ui.biome')}</dt>
        <dd><List>{loc.biomes.map(biome => <Area area={biome} key={biome} />)}</List></dd>
        <dt>{translate('ui.locationType')}</dt>
        <dd>{translate(`ui.locationType.${loc.type}`)}</dd>
        {loc.needsKey ? <React.Fragment key="key">
          <dt>needs key</dt>
          <dd><InlineObjectWithIcon id={loc.needsKey} size={16} /></dd>
        </React.Fragment> : null}
        <dt>{translate('ui.altitude')}</dt>
        <dd>{rangeBy(loc.altitude, String, '..')}</dd>
        <dt>number in world</dt>
        <dd>{loc.quantity}</dd>
        {vegvisirChance ? <React.Fragment key="vegvisir">
          <dt>{translate('vegvisir')}</dt>
          <dd><InlineObjectWithIcon id="Vegvisir" />, {showNumber(vegvisirChance * 100)}% chance</dd>
        </React.Fragment> : null}
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

function CustomMusic({ id }: { id?: string }) {
  if (id == null) return null;
  const isUnique = (musicToLocation[id]?.length ?? 0) <= 1;
  return isUnique
    ? <span className="music-icon"
        title="This location has unique music">
        ♫
      </span>
    : <span className="music-icon"
        title="This location has custom music">
        ♪
      </span>;
}

export function Location() {
  const { id } = useParams<{ id: string }>();

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
        <LocationHeader id={id} customMusic={summary.customMusic} />
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
      <LocationHeader id={id} customMusic={summary.customMusic} />
      <Tabs tabs={tabs} selected={0} key={id} />
    </>
  );
}