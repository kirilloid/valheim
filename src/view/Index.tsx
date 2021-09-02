import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import { TranslationContext } from '../effects';
import { biomes } from '../model/location';
import { pages } from '../model/search';

export function Index() {
  const translate = useContext(TranslationContext);
  return <div>
    <h1>{translate('ui.index.utils')}</h1>
    <p>{translate('ui.index.description')}</p>
    <section>
      <h2>{translate('ui.index.calculators')}</h2>
      <ul>
        {pages.map(({ id }) => <li key={id}>
          <Link to={`/${id}`}>{translate(`ui.page.${id}`)}</Link>
        </li>)}
      </ul>
    </section>
    <section>
      <h2>{translate('ui.biomes')}</h2>
      <ul>
        {biomes.map(({ id }) => <li key={id}>
          <Link to={`/biome/${id}`}>{translate(`ui.biome.${id}`)}</Link>
        </li>)}
      </ul>
    </section>
  </div>
}