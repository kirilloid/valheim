import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';

import '../../css/Biome.css';

import type { Effect as TEffect } from '../../types';
import { effects } from '../../data/effects';
import { assertNever, timeI2S } from '../../model/utils';

import { TranslationContext } from '../../effects';
import { Resistances } from '../helpers';
import { SpoilerAlert } from '../parts/Spoiler';

function showDiffPercent(value: number): string {
  const plusSign = value < 0 ? '' : '+';
  return `${plusSign}${value * 100}%`;
}

function Special({ type }: { type: TEffect['special'] }) {
  switch (type) {
    case undefined:
      return null;
    case 'Tailwind':
      return <><dt>Special</dt><dd>Always tailwind</dd></>;
    default:
      return assertNever(type);
  }
}

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
  const {
    special,
    time,
    // comfort?: { value: number; };
    cooldown,
    // healthOverTime?: [change: number, interval: number],
    damageModifiers,
    attackModifier,
    stealth,
    carryWeight,
    runStamina,
    jumpStamina,
    healthRegen,
    staminaRegen,
    xpModifier,
    moveSpeed,
  } = effect;

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
          <Special type={special} />
          {time != null ? <><dt>{translate('ui.duration')}</dt><dd>{timeI2S(time)}</dd></> : null}
          {cooldown != null ? <><dt>{translate('ui.cooldown')}</dt><dd>{timeI2S(cooldown)}</dd></> : null}
          {damageModifiers && <Resistances mods={damageModifiers} />}
          {attackModifier && <><dt>{translate(`ui.skillType.${attackModifier[0]}`)}</dt><dd>{showDiffPercent(attackModifier[1] - 1)}</dd></>}
          {stealth != null && <><dt>{translate(`ui.skillType.Sneak`)}</dt><dd>{showDiffPercent(stealth)}</dd></>}
          {carryWeight != null && <><dt>{translate(`ui.weight`)}</dt><dd>+{carryWeight}</dd></>}
          {staminaRegen != null && <><dt>{translate(`ui.stamina`)}</dt><dd>{showDiffPercent(staminaRegen - 1)}</dd></>}
          {healthRegen != null && <><dt>{translate(`ui.health`)}</dt><dd>{showDiffPercent(healthRegen - 1)}</dd></>}
          {runStamina != null && <><dt>run stamina drain</dt><dd>{showDiffPercent(runStamina)}</dd></>}
          {jumpStamina != null && <><dt>jump stamina drain</dt><dd>{showDiffPercent(jumpStamina)}</dd></>}
          {xpModifier != null && <><dt>{translate(`ui.xp`)}</dt><dd>{showDiffPercent(xpModifier - 1)}</dd></>}
          {moveSpeed != null && <><dt>{translate(`ui.moveSpeed`)}</dt><dd>{showDiffPercent(moveSpeed)}</dd></>}
        </dl>
      </section>
    </>
  );
}