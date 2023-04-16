import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';

import '../../css/Biome.css';

import { effects } from '../../data/effects';

import { TranslationContext } from '../../effects';
import { SpoilerAlert } from '../parts/Spoiler';
import { Effect as EffectBoni } from '../parts/Effect';
import { EffectIcon } from '../parts/Icon';

export function Effect() {
  const { id } = useParams<{ id: string }>();
  const translate = useContext(TranslationContext);

  const effect = effects.find(e => e.id === id);
  if (effect == null) {
    return <span className="error">
      Effect "{id}" not found
    </span>
  }
  
  return (
    <>
      <SpoilerAlert tier={effect.tier} />
      <h1>
        <EffectIcon id={id} size={32} />
        {' '}
        {translate(`ui.effect.${id}`)}
        <span className="entity-type"> &ndash; {translate('ui.effect')}</span>
      </h1>
      <section>
        <dl>
          <EffectBoni effect={effect} level={0} />
        </dl>
      </section>
    </>
  );
}