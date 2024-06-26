import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import type { Effect as TEffect } from '../../types';
import { SkillType } from '../../model/skills';
import { assertNever, timeI2S } from '../../model/utils';
import { getTotalDamage } from '../../model/combat';

import { TranslationContext } from '../../effects';
import { rangeBy, Resistances, showNumber } from '../helpers';
import { SkillIcon } from './Icon';

function showDiffPercent(value: number): string {
  const plusSign = value < 0 ? '' : '+';
  return `${plusSign}${showNumber(value * 100)}%`;
}

function Special({ type }: { type: TEffect['special'] }) {
  switch (type) {
    case undefined:
      return null;
    case 'Tailwind':
      return <><dt>Special</dt><dd>Always tailwind</dd></>;
    case 'Demister':
      return <><dt>Special</dt><dd>Disperse mist around you</dd></>;
    default:
      return assertNever(type);
  }
}

export function Effect({ effect, level }: { effect: TEffect; level?: number }) {
  const translate = useContext(TranslationContext);

  const {
    special,
    time,
    // comfort?: { value: number; };
    cooldown,
    absorbDamage,
    healthOverTime,
    // healthOverTime?: [change: number, interval: number],
    damageModifiers,
    attackModifier,
    skillModifiers,
    carryWeight,
    runStamina,
    jumpStamina,
    fallDamage,
    healthRegen,
    staminaRegen,
    eitrRegen,
    xpModifier,
    moveSpeed,
    Aoe,
  } = effect;

  return <>
    <Special type={special} />
    {time != null ? <React.Fragment key="duration">
      <dt>{translate('ui.duration')}</dt>
      <dd>{timeI2S(time)}</dd>
    </React.Fragment> : null}
    {cooldown != null ? <React.Fragment key="cooldown">
      <dt>{translate('ui.cooldown')}</dt>
      <dd>{timeI2S(cooldown)}</dd>
    </React.Fragment> : null}
    {healthOverTime != null ? <React.Fragment key="healthOverTime">
      <dt>{translate('ui.healthRegen')}</dt>
      <dd>{healthOverTime[0]}</dd>
    </React.Fragment> : null}
    {absorbDamage && <React.Fragment>
      <dt>shield</dt>
      <dd>{level == null
        ? `${absorbDamage[0]} + ${absorbDamage[1]} per level`
        : absorbDamage[0] + absorbDamage[1] * level
      }</dd>
    </React.Fragment>}
    {damageModifiers && <Resistances key="resistances" mods={damageModifiers} />}
    {attackModifier && <React.Fragment key="attackModifier">
      <dt>{translate(`ui.skillType.${SkillType[attackModifier[0]]}`)}</dt>
      <dd>{translate('ui.damage')}: {showDiffPercent(attackModifier[1] - 1)}</dd>
    </React.Fragment>}
    {skillModifiers != null && Object.entries(skillModifiers).map(([key, val]) => {
      const skillStr = SkillType[key as unknown as SkillType];
      return <React.Fragment key={`skillModifier-${key}`}>
        <dt><SkillIcon skill={skillStr} useAlt={false} /> <Link to={`/skills/${skillStr}`}>{translate(`ui.skillType.${skillStr}`)}</Link></dt>
        <dd>+{val}</dd>
      </React.Fragment>
    })}
    {carryWeight != null && <React.Fragment key="weight">
      <dt>{translate(`ui.weight`)}</dt>
      <dd>+{carryWeight}</dd>
    </React.Fragment>}
    {staminaRegen != null && <React.Fragment key="staminaRegen">
      <dt>{translate(`ui.stamina`)}</dt>
      <dd>{showDiffPercent(staminaRegen - 1)}</dd>
    </React.Fragment>}
    {healthRegen != null && <React.Fragment key="healthRegen">
      <dt>{translate(`ui.health`)}</dt>
      <dd>{showDiffPercent(healthRegen - 1)}</dd>
    </React.Fragment>}
    {eitrRegen != null && <React.Fragment key="eitrRegen">
      <dt>{translate(`ui.eitr`)}</dt>
      <dd>{showDiffPercent(eitrRegen - 1)}</dd>
    </React.Fragment>}
    {runStamina != null && <React.Fragment key="runStamina">
      <dt>run stamina drain</dt>
      <dd>{showDiffPercent(runStamina)}</dd>
    </React.Fragment>}
    {jumpStamina != null && <React.Fragment key="jumpStamina">
      <dt>jump stamina drain</dt>
      <dd>{showDiffPercent(jumpStamina)}</dd>
    </React.Fragment>}
    {fallDamage != null && <React.Fragment key="fallDamage">
      <dt>fall damage</dt>
      <dd>{showDiffPercent(fallDamage)}</dd>
    </React.Fragment>}
    {xpModifier != null && <React.Fragment key="xpModifier">
      <dt>{translate(`ui.xp`)}</dt>
      <dd>{showDiffPercent(xpModifier - 1)}</dd>
    </React.Fragment>}
    {moveSpeed != null && <React.Fragment key="moveSpeed">
      <dt>{translate(`ui.moveSpeed`)}</dt>
      <dd>{showDiffPercent(moveSpeed)}</dd>
    </React.Fragment>}
    {Aoe != null && <React.Fragment key="Aoe">
      <dt>{translate(`ui.damage`)}</dt>
      <dd>{getTotalDamage(Aoe.damage)}</dd>
      <dt>{translate(`ui.radius`)}</dt>
      <dd>{Aoe.radius}</dd>
      {Aoe.chainTargets != null && <>
        <dt>targets</dt>
        <dd>{rangeBy(Aoe.chainTargets, String)}</dd>
      </>}
    </React.Fragment>}
  </>
}