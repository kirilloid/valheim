import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';

import '../../css/Biome.css';

import { effects } from '../../data/effects';

import { TranslationContext } from '../../effects';
import { SpoilerAlert } from '../parts/Spoiler';
import { Effect as EffectBoni } from '../parts/Effect';

export function Effect() {
  const { id } = useParams<{ id: string }>();
  const translate = useContext(TranslationContext);

  const effect = effects.find(e => e.id === id);
  if (effect == null) {
    return <span className="error">
      Effect "{id}" not found
    </span>
  }

  const imgPath = `/icons/effect/${id}`;

  return (
    <>
      <SpoilerAlert tier={effect.tier} />
      <h1>
        <picture>
          <source srcSet={`${imgPath}.webp`} type="image/webp" />
          <img src={`${imgPath}.png`} alt="" width="32" height="32" />
        </picture>
        {' '}
        {translate(`ui.effect.${id}`)}
      </h1>
      <section>
        <dl>
          <EffectBoni effect={effect} level={0} />
        </dl>
      </section>
    </>
  );
}