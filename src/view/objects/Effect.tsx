import React, { useContext } from 'react';
import { Link, useParams } from 'react-router-dom';

import '../../css/Biome.css';

import { effects } from '../../data/effects';

import { TranslationContext } from '../../effects';
import { SpoilerAlert } from '../parts/Spoiler';
import { Effect as EffectBoni, SimilarEffects } from '../parts/Effect';
import { EffectIcon } from '../parts/Icon';
import { groupBy } from '../../model/utils';
import { List } from '../helpers';

const groupedEffects = groupBy(effects, e => e.group ?? '');

export function Effect() {
  const { id } = useParams<{ id: string }>();
  const translate = useContext(TranslationContext);

  const effect = effects.find(e => e.id === id);
  if (effect == null) {
    return <span className="error">
      Effect "{id}" not found
    </span>
  }

  const group = effect.group;
  
  return (
    <>
      <SpoilerAlert tier={effect.tier} />
      <h1>
        <EffectIcon id={id} size={32} />
        {' '}
        {translate(`ui.effect.${id}`)}
        <span className="entity-type"> &ndash; {translate('ui.effect')}</span>
      </h1>
      {group && groupedEffects[group] && (
        <div>See also: <List separator=" | ">{groupedEffects[group].map(e => <Link key={e.id} to={`/effect/${e.id}`}>
          {translate(`ui.effect.${e.id}`)}
        </Link>)}</List></div>
      )}
      <section>
        <dl>
          <EffectBoni effect={effect} level={0} />
        </dl>
      </section>
      <SimilarEffects effect={effect} />
    </>
  );
}