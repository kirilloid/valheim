import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import '../../css/Home.css';

import { groupBy } from '../../model/utils';

import { pages } from '../../data/search';
import { biomes } from '../../data/location';

import { TranslationContext, useRuneTranslate } from '../../effects';
import { markdown } from '../markdown';

const pageGroups = groupBy(pages, p => p.category);

export function Home() {
  const translate = useContext(TranslationContext);
  const runeTranslate = useRuneTranslate();
  return <div>
    <h1>{translate('ui.index.utils')}</h1>
    <p>{markdown(translate('ui.index.description'))}</p>
    <div className="Home">
      <section className="Home__Biomes">
        <h2>{translate('ui.biomes')}</h2>
        <ul>
          {biomes.map(({ id, tier, emoji, active }) => <li key={id}>
            <span className="Home__emoji-icon">{emoji}</span>
            {' '}
            {active
              ? <Link to={`/biome/${id}`}>
                  {runeTranslate({ tier, type: 'biome', id: `ui.biome.${id}` })}
                </Link>
              : <span className="disabled">{runeTranslate({ tier, type: 'biome', id: `ui.biome.${id}` })}</span>}
          </li>)}
        </ul>
      </section>
      <section className="Home__Calculators">
        {Object.entries(pageGroups).map(([name, group]) => <div key={name}>
          <h2>{name}</h2>
          <ul>{group.map(({ id, beta, emoji }) => <li key={id}>
            <span className="Home__emoji-icon">{emoji}</span> <Link to={`/${id}`}>{translate(`ui.page.${id}`)}</Link>
            {beta ? <> &beta;</> : null}
          </li>)}
        </ul>
        </div>)}
      </section>
    </div>
  </div>
}